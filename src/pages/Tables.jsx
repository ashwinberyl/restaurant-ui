import { useEffect, useState } from 'react';
import { getTables, createTable, deleteTable } from '../api';

export default function Tables() {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState({ location: '', capacity: '' });
    const [form, setForm] = useState({ table_number: '', seating_capacity: '', location: 'indoor' });
    const [message, setMessage] = useState(null);

    const fetchTables = () => {
        setLoading(true);
        const params = {};
        if (filter.location) params.location = filter.location;
        if (filter.capacity) params.capacity = filter.capacity;
        getTables(params)
            .then((data) => setTables(data.tables || []))
            .catch(() => setMessage({ type: 'error', text: 'Failed to load tables' }))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchTables(); }, [filter]);

    const handleCreate = (e) => {
        e.preventDefault();
        createTable({
            table_number: parseInt(form.table_number),
            seating_capacity: parseInt(form.seating_capacity),
            location: form.location,
        })
            .then(() => {
                setMessage({ type: 'success', text: 'Table created successfully!' });
                setForm({ table_number: '', seating_capacity: '', location: 'indoor' });
                setShowForm(false);
                fetchTables();
            })
            .catch((err) => setMessage({ type: 'error', text: err.message }));
    };

    const handleDelete = (id) => {
        if (!confirm('Deactivate this table?')) return;
        deleteTable(id)
            .then(() => {
                setMessage({ type: 'success', text: 'Table deactivated' });
                fetchTables();
            })
            .catch((err) => setMessage({ type: 'error', text: err.message }));
    };

    return (
        <div className="container">
            <div className="page-header">
                <h1>Restaurant Tables</h1>
                <p>Manage your restaurant's tables</p>
            </div>

            {message && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                    <button style={{ float: 'right', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }} onClick={() => setMessage(null)}>✕</button>
                </div>
            )}

            <div className="filters">
                <div className="form-group">
                    <label>Location</label>
                    <select value={filter.location} onChange={(e) => setFilter({ ...filter, location: e.target.value })}>
                        <option value="">All</option>
                        <option value="indoor">Indoor</option>
                        <option value="outdoor">Outdoor</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Min Capacity</label>
                    <input type="number" min="1" placeholder="Any" value={filter.capacity} onChange={(e) => setFilter({ ...filter, capacity: e.target.value })} />
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ Cancel' : '+ Add Table'}
                </button>
            </div>

            {showForm && (
                <form className="form-card" onSubmit={handleCreate} style={{ marginBottom: '1.5rem' }}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Table Number</label>
                            <input type="number" min="1" required value={form.table_number} onChange={(e) => setForm({ ...form, table_number: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Seating Capacity</label>
                            <input type="number" min="1" max="20" required value={form.seating_capacity} onChange={(e) => setForm({ ...form, seating_capacity: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
                            <option value="indoor">Indoor</option>
                            <option value="outdoor">Outdoor</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Create Table</button>
                </form>
            )}

            {loading ? (
                <div className="loader"><div className="spinner"></div></div>
            ) : tables.length === 0 ? (
                <div className="empty-state">
                    <div className="icon">🪑</div>
                    <p>No tables found. Add your first table!</p>
                </div>
            ) : (
                <div className="card-grid">
                    {tables.map((table) => (
                        <div className="card" key={table.id}>
                            <div className="card-header">
                                <span className="card-title">Table #{table.table_number}</span>
                                <span className={`card-badge badge-${table.location}`}>{table.location}</span>
                            </div>
                            <div className="card-detail">
                                <span className="icon">👥</span>
                                <span>Seats {table.seating_capacity}</span>
                            </div>
                            <div className="card-detail">
                                <span className="icon">{table.is_active ? '✅' : '❌'}</span>
                                <span>{table.is_active ? 'Active' : 'Inactive'}</span>
                            </div>
                            {table.is_active && (
                                <button className="btn btn-danger btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => handleDelete(table.id)}>
                                    Deactivate
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
