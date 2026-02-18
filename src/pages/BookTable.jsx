import { useEffect, useState } from 'react';
import { getTables, getAvailability, createReservation } from '../api';

export default function BookTable() {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [date, setDate] = useState('');
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [form, setForm] = useState({
        customer_name: '', customer_email: '', customer_phone: '',
        guest_count: '', special_requests: '',
    });
    const [message, setMessage] = useState(null);
    const [step, setStep] = useState(1); // 1: select table, 2: select slot, 3: fill details

    useEffect(() => {
        getTables({ is_active: 'true' })
            .then((data) => setTables(data.tables || []))
            .catch(() => { });
    }, []);

    const handleDateChange = (e) => {
        const d = e.target.value;
        setDate(d);
        setSelectedSlot(null);
        if (selectedTable && d) {
            getAvailability(selectedTable.id, d)
                .then((data) => setSlots(data.slots || []))
                .catch(() => setSlots([]));
        }
    };

    const handleSelectTable = (table) => {
        setSelectedTable(table);
        setStep(2);
        setSlots([]);
        setSelectedSlot(null);
        setDate('');
        setForm({ ...form, guest_count: '' });
    };

    const handleSelectSlot = (slot) => {
        if (!slot.available) return;
        setSelectedSlot(slot);
        setStep(3);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage(null);
        createReservation({
            table_id: selectedTable.id,
            customer_name: form.customer_name,
            customer_email: form.customer_email,
            customer_phone: form.customer_phone,
            guest_count: parseInt(form.guest_count),
            reservation_date: date,
            slot_start_time: selectedSlot.start_time,
            special_requests: form.special_requests || null,
        })
            .then(() => {
                setMessage({ type: 'success', text: '🎉 Reservation confirmed! Your table is booked.' });
                setStep(1);
                setSelectedTable(null);
                setSelectedSlot(null);
                setDate('');
                setForm({ customer_name: '', customer_email: '', customer_phone: '', guest_count: '', special_requests: '' });
            })
            .catch((err) => setMessage({ type: 'error', text: err.message }));
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="container">
            <div className="page-header">
                <h1>Book a Table</h1>
                <p>Three simple steps to reserve your dining experience</p>
            </div>

            {message && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                    <button style={{ float: 'right', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }} onClick={() => setMessage(null)}>✕</button>
                </div>
            )}

            {/* Step Indicators */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                {[1, 2, 3].map((s) => (
                    <div key={s} style={{
                        flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center',
                        background: step >= s ? 'var(--accent)' : 'var(--bg-card)',
                        color: step >= s ? 'white' : 'var(--text-muted)',
                        fontWeight: 600, fontSize: '0.85rem', transition: 'var(--transition)',
                    }}>
                        {s === 1 ? '① Select Table' : s === 2 ? '② Pick Time' : '③ Your Details'}
                    </div>
                ))}
            </div>

            {/* Step 1: Select Table */}
            {step === 1 && (
                <div className="card-grid">
                    {tables.map((table) => (
                        <div className="card" key={table.id} onClick={() => handleSelectTable(table)} style={{ cursor: 'pointer' }}>
                            <div className="card-header">
                                <span className="card-title">Table #{table.table_number}</span>
                                <span className={`card-badge badge-${table.location}`}>{table.location}</span>
                            </div>
                            <div className="card-detail">
                                <span className="icon">👥</span>
                                <span>Seats {table.seating_capacity}</span>
                            </div>
                        </div>
                    ))}
                    {tables.length === 0 && (
                        <div className="empty-state">
                            <div className="icon">🪑</div>
                            <p>No tables available</p>
                        </div>
                    )}
                </div>
            )}

            {/* Step 2: Select Date & Time Slot */}
            {step === 2 && selectedTable && (
                <div className="form-card">
                    <h3 style={{ marginBottom: '1rem' }}>Table #{selectedTable.table_number} · {selectedTable.location} · {selectedTable.seating_capacity} seats</h3>
                    <div className="form-group">
                        <label>Select Date</label>
                        <input type="date" min={today} value={date} onChange={handleDateChange} />
                    </div>
                    {slots.length > 0 && (
                        <>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                                Available Time Slots
                            </label>
                            <div className="slots-grid">
                                {slots.map((slot) => (
                                    <div
                                        key={slot.start_time}
                                        className={`slot ${slot.available ? 'slot-available' : 'slot-booked'} ${selectedSlot?.start_time === slot.start_time ? 'selected' : ''}`}
                                        onClick={() => handleSelectSlot(slot)}
                                    >
                                        {slot.start_time} - {slot.end_time}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    <button className="btn btn-secondary" onClick={() => { setStep(1); setSelectedTable(null); }}>
                        ← Back
                    </button>
                </div>
            )}

            {/* Step 3: Customer Details */}
            {step === 3 && selectedTable && selectedSlot && (
                <form className="form-card" onSubmit={handleSubmit}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Table #{selectedTable.table_number} · {date} · {selectedSlot.start_time}–{selectedSlot.end_time}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Fill in your details to confirm the reservation</p>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input required value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" required value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input type="tel" required value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Number of Guests</label>
                        <input type="number" min="1" max={selectedTable.seating_capacity} required value={form.guest_count}
                            onChange={(e) => setForm({ ...form, guest_count: e.target.value })}
                            placeholder={`Max ${selectedTable.seating_capacity}`} />
                    </div>
                    <div className="form-group">
                        <label>Special Requests (optional)</label>
                        <textarea value={form.special_requests} onChange={(e) => setForm({ ...form, special_requests: e.target.value })}
                            placeholder="Birthday celebration, dietary requirements, etc." />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
                            ← Back
                        </button>
                        <button type="submit" className="btn btn-primary">
                            ✓ Confirm Reservation
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
