/**
 * Централизованное хранилище состояния приложения
 */
class AppState {
    constructor() {
        this._clients = [];
        this._carriers = [];
        this._orders = [];
        this._contacts = [];
        this._dictionaries = {
            vehicleBodyTypes: [],
            loadingTypes: [],
            packageTypes: []
        };
    }

    // Getters
    get clients() {
        return this._clients;
    }

    get carriers() {
        return this._carriers;
    }

    get orders() {
        return this._orders;
    }

    get contacts() {
        return this._contacts;
    }

    get dictionaries() {
        return this._dictionaries;
    }

    // Setters
    setClients(clients) {
        this._clients = clients;
    }

    setCarriers(carriers) {
        this._carriers = carriers;
    }

    setOrders(orders) {
        this._orders = orders;
    }

    setContacts(contacts) {
        this._contacts = contacts;
    }

    setDictionaries(dictionaries) {
        this._dictionaries = dictionaries;
    }

    // Utility methods
    getClientById(id) {
        return this._clients.find(c => c.id === id);
    }

    getCarrierById(id) {
        return this._carriers.find(c => c.id === id);
    }

    getContactById(id) {
        return this._contacts.find(c => c.id === id);
    }

    getOrderById(id) {
        return this._orders.find(o => o.id === id);
    }
}

export const appState = new AppState();
