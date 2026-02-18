const TABLE_API = '/api/tables';
const RESERVATION_API = '/api/reservations';

async function request(url, options = {}) {
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.errors?.join(', ') || 'Request failed');
    return data;
}

// ─── Tables ───
export const getTables = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`${TABLE_API}${query ? '?' + query : ''}`);
};

export const getTable = (id) => request(`${TABLE_API}/${id}`);

export const createTable = (data) =>
    request(TABLE_API, { method: 'POST', body: JSON.stringify(data) });

export const updateTable = (id, data) =>
    request(`${TABLE_API}/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteTable = (id) =>
    request(`${TABLE_API}/${id}`, { method: 'DELETE' });

// ─── Reservations ───
export const getReservations = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`${RESERVATION_API}${query ? '?' + query : ''}`);
};

export const getReservation = (id) => request(`${RESERVATION_API}/${id}`);

export const createReservation = (data) =>
    request(RESERVATION_API, { method: 'POST', body: JSON.stringify(data) });

export const cancelReservation = (id) =>
    request(`${RESERVATION_API}/${id}/cancel`, { method: 'PATCH' });

export const getAvailability = (tableId, date) =>
    request(`${RESERVATION_API}/tables/${tableId}/availability?date=${date}`);
