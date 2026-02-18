import { useEffect, useState } from 'react';
import { getReservations, cancelReservation } from '../api';

export default function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ date: '', status: '' });
    const [message, setMessage] = useState(null);

    const fetchReservations = () => {
        setLoading(true);
        const params = {};
        if (filter.date) params.date = filter.date;
        if (filter.status) params.status = filter.status;
        getReservations(params)
            .then((data) => setReservations(data.reservations || []))
            .catch(() => setMessage({ type: 'error', text: 'Failed to load reservations' }))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchReservations(); }, [filter]);

    const handleCancel = (id) => {
        if (!confirm('Cancel this reservation?')) return;
        cancelReservation(id)
            .then(() => {
                setMessage({ type: 'success', text: 'Reservation cancelled successfully' });
                fetchReservations();
            })
            .catch((err) => setMessage({ type: 'error', text: err.message }));
    };

    return (
        <div className="container">
            <div className="page-header">
                <h1>Reservations</h1>
                <p>View and manage all table reservations</p>
            </div>

            {message && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                    <button style={{ float: 'right', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }} onClick={() => setMessage(null)}>✕</button>
                </div>
            )}

            <div className="filters">
                <div className="form-group">
                    <label>Date</label>
                    <input type="date" value={filter.date} onChange={(e) => setFilter({ ...filter, date: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Status</label>
                    <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                        <option value="">All</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loader"><div className="spinner"></div></div>
            ) : reservations.length === 0 ? (
                <div className="empty-state">
                    <div className="icon">📋</div>
                    <p>No reservations found</p>
                </div>
            ) : (
                <div className="card-grid">
                    {reservations.map((r) => (
                        <div className="card" key={r.id}>
                            <div className="card-header">
                                <span className="card-title">Table #{r.table_id}</span>
                                <span className={`card-badge badge-${r.status}`}>{r.status}</span>
                            </div>
                            <div className="card-detail">
                                <span className="icon">👤</span>
                                <span>{r.customer_name}</span>
                            </div>
                            <div className="card-detail">
                                <span className="icon">📧</span>
                                <span>{r.customer_email}</span>
                            </div>
                            <div className="card-detail">
                                <span className="icon">📅</span>
                                <span>{r.reservation_date}</span>
                            </div>
                            <div className="card-detail">
                                <span className="icon">🕐</span>
                                <span>{r.slot_start_time?.substring(0, 5)} – {r.slot_end_time?.substring(0, 5)}</span>
                            </div>
                            <div className="card-detail">
                                <span className="icon">👥</span>
                                <span>{r.guest_count} guests</span>
                            </div>
                            {r.special_requests && (
                                <div className="card-detail">
                                    <span className="icon">📝</span>
                                    <span>{r.special_requests}</span>
                                </div>
                            )}
                            {r.status === 'confirmed' && (
                                <button className="btn btn-danger btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => handleCancel(r.id)}>
                                    Cancel Reservation
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
