/**
 * Централизованные API вызовы
 */

const API_BASE = '/api';

// Orders API
export async function fetchOrders() {
    const response = await fetch(`${API_BASE}/orders`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

export async function createOrder(data) {
    const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка создания заказа');
    }
    return response.json();
}

export async function updateOrder(id, data) {
    const response = await fetch(`${API_BASE}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка обновления заказа');
    }
    return response.json();
}

export async function deleteOrder(id) {
    const response = await fetch(`${API_BASE}/orders/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Ошибка удаления заказа');
    return response.json();
}

// Clients API
export async function fetchClients() {
    const response = await fetch(`${API_BASE}/clients`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

export async function createClient(data) {
    const response = await fetch(`${API_BASE}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка создания клиента');
    }
    return response.json();
}

export async function updateClient(id, data) {
    const response = await fetch(`${API_BASE}/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка обновления клиента');
    }
    return response.json();
}

export async function deleteClient(id) {
    const response = await fetch(`${API_BASE}/clients/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка удаления клиента');
    }
    return response.json();
}

// Carriers API
export async function fetchCarriers() {
    const response = await fetch(`${API_BASE}/carriers`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

export async function createCarrier(data) {
    const response = await fetch(`${API_BASE}/carriers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка создания перевозчика');
    }
    return response.json();
}

export async function updateCarrier(id, data) {
    const response = await fetch(`${API_BASE}/carriers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка обновления перевозчика');
    }
    return response.json();
}

export async function deleteCarrier(id) {
    const response = await fetch(`${API_BASE}/carriers/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка удаления перевозчика');
    }
    return response.json();
}

// Contacts API
export async function fetchContacts() {
    const response = await fetch(`${API_BASE}/contacts`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

export async function createContact(data) {
    const response = await fetch(`${API_BASE}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка создания контакта');
    }
    return response.json();
}

export async function updateContact(id, data) {
    const response = await fetch(`${API_BASE}/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка обновления контакта');
    }
    return response.json();
}

export async function deleteContact(id) {
    const response = await fetch(`${API_BASE}/contacts/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Ошибка удаления контакта');
    return response.json();
}

// Dictionaries API
export async function fetchDictionaries() {
    const response = await fetch(`${API_BASE}/dictionaries`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}
