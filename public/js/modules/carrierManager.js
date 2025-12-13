/**
 * Carrier Manager - управление перевозчиками
 * Использует baseCompanyManager для устранения дублирования кода
 */

import { createCompanyManager } from './baseCompanyManager.js';
import { fetchCarriers, createCarrier, updateCarrier } from '../utils/api.js';
import { appState } from '../state/appState.js';
import { renderCarrierForm } from '../views/CarrierFormView.js';

// Конфигурация для менеджера перевозчиков
const carrierConfig = {
    type: 'carrier',
    entityNameRu: 'перевозчика',
    apiMethods: {
        fetch: fetchCarriers,
        create: createCarrier,
        update: updateCarrier
    },
    formRenderer: renderCarrierForm,
    stateMethods: {
        getAll: () => appState.carriers,
        getById: (id) => appState.getCarrierById(id),
        setAll: (items) => appState.setCarriers(items)
    },
    tableBodyId: 'carriersTableBody',
    buttonId: 'btnAddCarrier',
    selectId: 'carrier',
    contactSelectId: 'carrierContact',
    formIdPrefix: 'carrier'
};

// Создаем менеджер перевозчиков с помощью фабрики
const manager = createCompanyManager(carrierConfig);

// Экспортируем методы (сохраняем обратную совместимость)
export const loadCarriers = manager.load;
export const openCarrierModal = manager.openModal;
export const saveCarrier = manager.save;
export const loadCarrierContacts = manager.loadContacts;
export const init = manager.init;

// Экспортируем объект менеджера
export const carrierManager = {
    init: manager.init,
    loadCarriers: manager.load,
    openCarrierModal: manager.openModal,
    saveCarrier: manager.save,
    loadCarrierContacts: manager.loadContacts
};
