/**
 * Wizard Handlers - управление wizard-формой
 */

import { appState } from '../../state/appState.js';
import { modalView } from '../../views/ModalView.js';
import {
    renderWizard,
    WIZARD_SECTIONS,
    SECTION_ORDER,
    SECTION_STATES
} from '../../views/WizardFormView.js';
import { createOrder } from './orderCRUD.js';
import { showMessage } from '../../utils/messageHelper.js';

// Текущее состояние wizard
let wizardState = {
    currentSection: WIZARD_SECTIONS.CLIENT,
    sectionStates: {},
    data: {},
    isEdit: false,
    orderId: null
};

/**
 * Сбросить состояние wizard
 */
function resetWizardState() {
    wizardState = {
        currentSection: WIZARD_SECTIONS.CLIENT,
        sectionStates: {},
        data: {},
        isEdit: false,
        orderId: null
    };
}

/**
 * Собрать данные из текущей формы
 */
function collectFormData() {
    const form = document.getElementById('wizardForm');
    if (!form) return;

    const formData = new FormData(form);

    // Сохраняем все поля в wizardState.data
    for (const [key, value] of formData.entries()) {
        wizardState.data[key] = value;
    }

    // Обработка чекбоксов
    wizardState.data.isDangerous = form.querySelector('#wizardIsDangerous')?.checked || false;
    wizardState.data.isTemperature = form.querySelector('#wizardIsTemperature')?.checked || false;
}

/**
 * Валидация секции
 * @param {string} sectionId - ID секции
 * @returns {boolean} true если валидно
 */
function validateSection(sectionId) {
    const data = wizardState.data;

    switch (sectionId) {
        case WIZARD_SECTIONS.CLIENT:
            return !!data.clientId;
        case WIZARD_SECTIONS.ROUTE:
            return !!data.routeFrom && !!data.routeTo;
        case WIZARD_SECTIONS.CARGO:
            return true; // Не обязательные поля
        case WIZARD_SECTIONS.TRANSPORT:
            return true; // Не обязательные поля
        case WIZARD_SECTIONS.FINANCE:
            return true; // Не обязательные поля
        default:
            return true;
    }
}

/**
 * Обновить отображение wizard
 */
function updateWizardUI() {
    const container = document.getElementById('wizardContainer');
    if (!container) return;

    container.innerHTML = renderWizard({
        currentSection: wizardState.currentSection,
        sectionStates: wizardState.sectionStates,
        data: wizardState.data,
        dictionaries: {
            clients: appState.clients,
            carriers: appState.carriers,
            vehicleBodyTypes: appState.dictionaries.vehicleBodyTypes,
            packageTypes: appState.dictionaries.packageTypes
        },
        isEdit: wizardState.isEdit
    });

    // Привязка обработчиков
    attachWizardHandlers();
}

/**
 * Привязка обработчиков wizard
 */
function attachWizardHandlers() {
    // Навигация по секциям (сайдбар)
    document.querySelectorAll('.wizard-step').forEach(step => {
        step.addEventListener('click', () => {
            collectFormData();
            const sectionId = step.dataset.section;
            goToSection(sectionId);
        });
    });

    // Кнопка "Назад"
    const btnBack = document.getElementById('wizardBtnBack');
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            collectFormData();
            goToPrevSection();
        });
    }

    // Кнопка "Далее"
    const btnNext = document.getElementById('wizardBtnNext');
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            collectFormData();
            if (validateSection(wizardState.currentSection)) {
                wizardState.sectionStates[wizardState.currentSection] = SECTION_STATES.COMPLETE;
                goToNextSection();
            } else {
                wizardState.sectionStates[wizardState.currentSection] = SECTION_STATES.ERROR;
                showMessage('Заполните обязательные поля', 'error');
                updateWizardUI();
            }
        });
    }

    // Кнопка "Сохранить черновик"
    const btnDraft = document.getElementById('wizardBtnDraft');
    if (btnDraft) {
        btnDraft.addEventListener('click', saveDraft);
    }

    // Кнопка "Создать заказ"
    const btnCreate = document.getElementById('wizardBtnCreate');
    if (btnCreate) {
        btnCreate.addEventListener('click', createOrderFromWizard);
    }

    // Расчёт маржи при изменении ставок
    const clientRate = document.getElementById('wizardClientRate');
    const carrierRate = document.getElementById('wizardCarrierRate');
    if (clientRate && carrierRate) {
        const updateProfit = () => {
            const profit = (parseFloat(clientRate.value) || 0) - (parseFloat(carrierRate.value) || 0);
            const profitDisplay = document.getElementById('wizardProfitDisplay');
            if (profitDisplay) {
                profitDisplay.textContent = `${profit.toLocaleString('ru-RU')} ₽`;
                profitDisplay.classList.toggle('negative', profit < 0);
            }
        };
        clientRate.addEventListener('input', updateProfit);
        carrierRate.addEventListener('input', updateProfit);
        updateProfit();
    }
}

/**
 * Перейти к секции
 * @param {string} sectionId - ID секции
 */
function goToSection(sectionId) {
    wizardState.currentSection = sectionId;
    updateWizardUI();
}

/**
 * Перейти к следующей секции
 */
function goToNextSection() {
    const currentIndex = SECTION_ORDER.indexOf(wizardState.currentSection);
    if (currentIndex < SECTION_ORDER.length - 1) {
        wizardState.currentSection = SECTION_ORDER[currentIndex + 1];
        updateWizardUI();
    }
}

/**
 * Перейти к предыдущей секции
 */
function goToPrevSection() {
    const currentIndex = SECTION_ORDER.indexOf(wizardState.currentSection);
    if (currentIndex > 0) {
        wizardState.currentSection = SECTION_ORDER[currentIndex - 1];
        updateWizardUI();
    }
}

/**
 * Сохранить черновик
 */
async function saveDraft() {
    collectFormData();

    if (!wizardState.data.clientId) {
        showMessage('Для сохранения черновика выберите клиента', 'error');
        return;
    }

    const orderData = {
        clientId: wizardState.data.clientId || null,
        carrierId: wizardState.data.carrierId || null,
        routeFrom: wizardState.data.routeFrom || null,
        routeTo: wizardState.data.routeTo || null,
        cargoName: wizardState.data.cargoName || null,
        cargoWeight: parseFloat(wizardState.data.cargoWeight) || null,
        dateLoading: wizardState.data.dateLoading || null,
        dateUnloading: wizardState.data.dateUnloading || null,
        clientRate: parseFloat(wizardState.data.clientRate) || 0,
        carrierRate: parseFloat(wizardState.data.carrierRate) || 0,
        transportMode: wizardState.data.transportMode || 'tbd',
        direction: wizardState.data.direction || null,
        vehicleBodyTypeId: wizardState.data.vehicleBodyTypeId || null,
        packageTypeId: wizardState.data.packageTypeId || null,
        notes: wizardState.data.notes || null,
        status: 'draft'
    };

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка сохранения');
        }

        showMessage('Черновик сохранён!', 'success');

        const { loadOrders } = await import('../orderManager.js');
        await loadOrders();
    } catch (error) {
        console.error('Ошибка сохранения черновика:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

/**
 * Создать заказ из wizard
 */
async function createOrderFromWizard() {
    collectFormData();

    // Проверяем все обязательные поля
    if (!wizardState.data.clientId) {
        showMessage('Выберите клиента', 'error');
        goToSection(WIZARD_SECTIONS.CLIENT);
        return;
    }

    if (!wizardState.data.routeFrom || !wizardState.data.routeTo) {
        showMessage('Заполните маршрут', 'error');
        goToSection(WIZARD_SECTIONS.ROUTE);
        return;
    }

    const orderData = {
        clientId: wizardState.data.clientId || null,
        carrierId: wizardState.data.carrierId || null,
        routeFrom: wizardState.data.routeFrom,
        routeTo: wizardState.data.routeTo,
        cargoName: wizardState.data.cargoName || null,
        cargoWeight: parseFloat(wizardState.data.cargoWeight) || null,
        dateLoading: wizardState.data.dateLoading || null,
        dateUnloading: wizardState.data.dateUnloading || null,
        clientRate: parseFloat(wizardState.data.clientRate) || 0,
        carrierRate: parseFloat(wizardState.data.carrierRate) || 0,
        transportMode: wizardState.data.transportMode || 'tbd',
        direction: wizardState.data.direction || null,
        vehicleBodyTypeId: wizardState.data.vehicleBodyTypeId || null,
        packageTypeId: wizardState.data.packageTypeId || null,
        notes: wizardState.data.notes || null,
        status: 'draft'
    };

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка создания');
        }

        showMessage('Заказ успешно создан!', 'success');
        closeWizard();

        // Перезагрузка списка заказов
        const { loadOrders } = await import('../orderManager.js');
        await loadOrders();
    } catch (error) {
        console.error('❌ Ошибка создания заказа:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

/**
 * Открыть wizard
 * @param {number|null} orderId - ID заказа для редактирования (или null для нового)
 */
export function openWizard(orderId = null) {
    resetWizardState();

    if (orderId) {
        const order = appState.getOrderById(orderId);
        if (order) {
            wizardState.data = { ...order };
            wizardState.isEdit = true;
            wizardState.orderId = orderId;
        }
    }

    // Создаём контейнер wizard в модальном окне
    const container = document.getElementById('modalContainer');
    if (!container) return;

    container.innerHTML = `
        <div id="dynamicModal" class="modal">
            <div class="modal-overlay" data-close="true"></div>
            <div class="modal-content wizard-modal">
                <button class="modal-close" data-close="true">×</button>
                <div id="wizardContainer"></div>
            </div>
        </div>
    `;

    // Привязка закрытия
    container.querySelectorAll('[data-close="true"]').forEach(el => {
        el.addEventListener('click', closeWizard);
    });

    // Escape для закрытия
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeWizard();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    updateWizardUI();
}

/**
 * Закрыть wizard
 */
export function closeWizard() {
    const container = document.getElementById('modalContainer');
    if (container) {
        container.innerHTML = '';
    }
    resetWizardState();
}

// Экспорт
export {
    wizardState,
    collectFormData,
    validateSection,
    goToSection
};
