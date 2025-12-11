/**
 * Централизованные API вызовы
 */

/**
 * Базовый API класс для CRUD операций
 */
class BaseAPI {
    constructor(resource) {
        this.resource = resource;
        this.baseURL = '/api';
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: { 'Content-Type': 'application/json' },
            ...options
        };

        const response = await fetch(url, config);

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return response.json();
    }

    async getAll() {
        return this.request(`/${this.resource}`);
    }

    async create(data) {
        return this.request(`/${this.resource}`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async update(id, data) {
        return this.request(`/${this.resource}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(id) {
        return this.request(`/${this.resource}/${id}`, {
            method: 'DELETE'
        });
    }
}

// Создаем экземпляры для каждого ресурса
const ordersAPI = new BaseAPI('orders');
const clientsAPI = new BaseAPI('clients');
const carriersAPI = new BaseAPI('carriers');
const contactsAPI = new BaseAPI('contacts');

// Экспортируем методы (для обратной совместимости)
export const fetchOrders = () => ordersAPI.getAll();
export const createOrder = (data) => ordersAPI.create(data);
export const updateOrder = (id, data) => ordersAPI.update(id, data);
export const deleteOrder = (id) => ordersAPI.delete(id);

export const fetchClients = () => clientsAPI.getAll();
export const createClient = (data) => clientsAPI.create(data);
export const updateClient = (id, data) => clientsAPI.update(id, data);
export const deleteClient = (id) => clientsAPI.delete(id);

export const fetchCarriers = () => carriersAPI.getAll();
export const createCarrier = (data) => carriersAPI.create(data);
export const updateCarrier = (id, data) => carriersAPI.update(id, data);
export const deleteCarrier = (id) => carriersAPI.delete(id);

export const fetchContacts = () => contactsAPI.getAll();
export const createContact = (data) => contactsAPI.create(data);
export const updateContact = (id, data) => contactsAPI.update(id, data);
export const deleteContact = (id) => contactsAPI.delete(id);

export async function fetchDictionaries() {
    const response = await fetch('/api/dictionaries');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}
