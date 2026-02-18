import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Tables from './pages/Tables';
import BookTable from './pages/BookTable';
import Reservations from './pages/Reservations';

export default function App() {
    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    <NavLink to="/" className="navbar-brand">
                        🍽️ Reserve<span>Table</span>
                    </NavLink>
                    <div className="navbar-links">
                        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                            Home
                        </NavLink>
                        <NavLink to="/tables" className={({ isActive }) => isActive ? 'active' : ''}>
                            Tables
                        </NavLink>
                        <NavLink to="/book" className={({ isActive }) => isActive ? 'active' : ''}>
                            Book
                        </NavLink>
                        <NavLink to="/reservations" className={({ isActive }) => isActive ? 'active' : ''}>
                            Reservations
                        </NavLink>
                    </div>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tables" element={<Tables />} />
                <Route path="/book" element={<BookTable />} />
                <Route path="/reservations" element={<Reservations />} />
            </Routes>
        </>
    );
}
