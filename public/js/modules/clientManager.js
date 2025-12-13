/**
 * Client Manager - управление клиентами
 * Использует baseCompanyManager для устранения дублирования кода
 */

import { createCompanyManager } from './baseCompanyManager.js';
import { fetchClients, createClient, updateClient } from '../utils/api.js';
import { appState } from '../state/appState.js';
import { renderClientForm } from '../views/ClientFormView.js';

// Конфигурация для менеджера клиентов
const clientConfig = {
    type: 'client',
    entityNameRu: 'клиента',
    apiMethods: {
        fetch: fetchClients,
        create: createClient,
        update: updateClient
    },
    formRenderer: renderClientForm,
    stateMethods: {
        getAll: () => appState.clients,
        getById: (id) => appState.getClientById(id),
        setAll: (items) => appState.setClients(items)
    },
    tableBodyId: 'clientsTableBody',
    buttonId: 'btnAddClient',
    selectId: 'client',
    contactSelectId: 'clientContact',
    formIdPrefix: 'client'
};

// Создаем менеджер клиентов с помощью фабрики
const manager = createCompanyManager(clientConfig);

// Экспортируем методы (сохраняем обратную совместимость)
export const loadClients = manager.load;
export const openClientModal = manager.openModal;
export const saveClient = manager.save;
export const loadClientContacts = manager.loadContacts;
export const init = manager.init;

// Экспортируем объект менеджера
export const clientManager = {
    init: manager.init,
    loadClients: manager.load,
    openClientModal: manager.openModal,
    saveClient: manager.save,
    loadClientContacts: manager.loadContacts
};
