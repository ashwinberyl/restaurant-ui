import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTables } from '../api';

export default function Home() {
    const [stats, setStats] = useState({ total: 0, indoor: 0, outdoor: 0, capacity: 0 });

    useEffect(() => {
        getTables()
            .then((data) => {
                const tables = data.tables || [];
                setStats({
                    total: tables.length,
                    indoor: tables.filter((t) => t.location === 'indoor').length,
                    outdoor: tables.filter((t) => t.location === 'outdoor').length,
                    capacity: tables.reduce((sum, t) => sum + t.seating_capacity, 0),
                });
            })
            .catch(() => { });
    }, []);

    return (
        <>
            <section className="hero">
                <h1>Reserve Your Perfect Table</h1>
                <p>
                    Seamless dining reservations with real-time availability.
                    Find the perfect table for any occasion.
                </p>
                <div className="hero-actions">
                    <Link to="/book" className="btn btn-primary">
                        🗓️ Book a Table
                    </Link>
                    <Link to="/tables" className="btn btn-secondary">
                        📋 View Tables
                    </Link>
                </div>
            </section>
            <div className="container">
                <div className="stats">
                    <div className="stat-card">
                        <div className="stat-value">{stats.total}</div>
                        <div className="stat-label">Total Tables</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats.indoor}</div>
                        <div className="stat-label">Indoor Tables</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats.outdoor}</div>
                        <div className="stat-label">Outdoor Tables</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats.capacity}</div>
                        <div className="stat-label">Total Seats</div>
                    </div>
                </div>
            </div>
        </>
    );
}
