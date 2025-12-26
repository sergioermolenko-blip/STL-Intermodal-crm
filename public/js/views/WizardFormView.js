/**
 * WizardFormView - Wizard-форма для создания/редактирования заказов
 * 
 * 5 секций:
 * 1. Client - клиент, контакт, инкотермс
 * 2. Route - откуда/куда, даты
 * 3. Cargo - описание, вес, объём
 * 4. Transport - тип, направление
 * 5. Finance - ставка, валюта
 */

// Константы секций
export const WIZARD_SECTIONS = {
    CLIENT: 'client',
    ROUTE: 'route',
    CARGO: 'cargo',
    TRANSPORT: 'transport',
    FINANCE: 'finance'
};

// Порядок секций
export const SECTION_ORDER = [
    WIZARD_SECTIONS.CLIENT,
    WIZARD_SECTIONS.ROUTE,
    WIZARD_SECTIONS.CARGO,
    WIZARD_SECTIONS.TRANSPORT,
    WIZARD_SECTIONS.FINANCE
];

// Названия секций
const SECTION_LABELS = {
    [WIZARD_SECTIONS.CLIENT]: '👤 Клиент',
    [WIZARD_SECTIONS.ROUTE]: '🗺️ Маршрут',
    [WIZARD_SECTIONS.CARGO]: '📦 Груз',
    [WIZARD_SECTIONS.TRANSPORT]: '🚛 Транспорт',
    [WIZARD_SECTIONS.FINANCE]: '💰 Финансы'
};

// Состояния секций
export const SECTION_STATES = {
    INCOMPLETE: 'incomplete',
    CURRENT: 'current',
    COMPLETE: 'complete',
    ERROR: 'error'
};

/**
 * Рендер sidebar wizard
 * @param {string} currentSection - ID текущей секции
 * @param {Object} sectionStates - Состояния секций
 * @returns {string} HTML сайдбара
 */
export function renderWizardSidebar(currentSection, sectionStates = {}) {
    const items = SECTION_ORDER.map((sectionId, index) => {
        const state = sectionStates[sectionId] || SECTION_STATES.INCOMPLETE;
        const isCurrent = sectionId === currentSection;
        const label = SECTION_LABELS[sectionId];

        return `
            <div class="wizard-step ${state} ${isCurrent ? 'active' : ''}" 
                 data-section="${sectionId}">
                <span class="wizard-step-number">${index + 1}</span>
                <span class="wizard-step-label">${label}</span>
            </div>
        `;
    }).join('');

    return `<div class="wizard-sidebar">${items}</div>`;
}

/**
 * Рендер секции Client
 * @param {Object} data - Данные формы
 * @param {Array} clients - Список клиентов
 * @returns {string} HTML секции
 */
export function renderClientSection(data = {}, clients = []) {
    const clientOptions = clients.map(c =>
        `<option value="${c.id}" ${data.clientId == c.id ? 'selected' : ''}>${c.name}</option>`
    ).join('');

    return `
        <div class="wizard-section" id="section-client">
            <h3>👤 Клиент</h3>
            
            <div class="form-group">
                <label>Клиент *</label>
                <select name="clientId" id="wizardClientId" required>
                    <option value="">Выберите клиента</option>
                    ${clientOptions}
                </select>
            </div>

            <div class="form-group">
                <label>Инкотермс</label>
                <select name="incoterms" id="wizardIncoterms">
                    <option value="">Не выбрано</option>
                    <option value="EXW" ${data.incoterms === 'EXW' ? 'selected' : ''}>EXW - Ex Works</option>
                    <option value="FCA" ${data.incoterms === 'FCA' ? 'selected' : ''}>FCA - Free Carrier</option>
                    <option value="FAS" ${data.incoterms === 'FAS' ? 'selected' : ''}>FAS - Free Alongside Ship</option>
                    <option value="FOB" ${data.incoterms === 'FOB' ? 'selected' : ''}>FOB - Free on Board</option>
                    <option value="CFR" ${data.incoterms === 'CFR' ? 'selected' : ''}>CFR - Cost and Freight</option>
                    <option value="CIF" ${data.incoterms === 'CIF' ? 'selected' : ''}>CIF - Cost Insurance Freight</option>
                    <option value="CPT" ${data.incoterms === 'CPT' ? 'selected' : ''}>CPT - Carriage Paid To</option>
                    <option value="CIP" ${data.incoterms === 'CIP' ? 'selected' : ''}>CIP - Carriage Insurance Paid</option>
                    <option value="DAP" ${data.incoterms === 'DAP' ? 'selected' : ''}>DAP - Delivered at Place</option>
                    <option value="DPU" ${data.incoterms === 'DPU' ? 'selected' : ''}>DPU - Delivered at Place Unloaded</option>
                    <option value="DDP" ${data.incoterms === 'DDP' ? 'selected' : ''}>DDP - Delivered Duty Paid</option>
                </select>
            </div>

            <div class="form-group">
                <label>Примечание по клиенту</label>
                <textarea name="clientNotes" id="wizardClientNotes" rows="2">${data.clientNotes || ''}</textarea>
            </div>
        </div>
    `;
}

/**
 * Рендер секции Route
 * @param {Object} data - Данные формы
 * @returns {string} HTML секции
 */
export function renderRouteSection(data = {}) {
    const dateLoading = data.dateLoading ? data.dateLoading.split('T')[0] : '';
    const dateUnloading = data.dateUnloading ? data.dateUnloading.split('T')[0] : '';

    return `
        <div class="wizard-section" id="section-route">
            <h3>🗺️ Маршрут</h3>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Откуда *</label>
                    <input type="text" name="routeFrom" id="wizardRouteFrom" 
                           value="${data.routeFrom || ''}" required placeholder="Город отправления">
                </div>
                <div class="form-group">
                    <label>Куда *</label>
                    <input type="text" name="routeTo" id="wizardRouteTo" 
                           value="${data.routeTo || ''}" required placeholder="Город назначения">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Дата погрузки</label>
                    <input type="date" name="dateLoading" id="wizardDateLoading" value="${dateLoading}">
                </div>
                <div class="form-group">
                    <label>Дата выгрузки</label>
                    <input type="date" name="dateUnloading" id="wizardDateUnloading" value="${dateUnloading}">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Адрес отправления</label>
                    <input type="text" name="originAddress" id="wizardOriginAddress" 
                           value="${data.originAddress || ''}" placeholder="Полный адрес">
                </div>
                <div class="form-group">
                    <label>Адрес назначения</label>
                    <input type="text" name="destinationAddress" id="wizardDestinationAddress" 
                           value="${data.destinationAddress || ''}" placeholder="Полный адрес">
                </div>
            </div>
        </div>
    `;
}

/**
 * Рендер секции Cargo
 * @param {Object} data - Данные формы
 * @param {Array} packageTypes - Типы упаковки
 * @returns {string} HTML секции
 */
export function renderCargoSection(data = {}, packageTypes = []) {
    const packageOptions = packageTypes.map(pt =>
        `<option value="${pt.id}" ${data.packageTypeId == pt.id ? 'selected' : ''}>${pt.name}</option>`
    ).join('');

    return `
        <div class="wizard-section" id="section-cargo">
            <h3>📦 Груз</h3>
            
            <div class="form-group">
                <label>Характер груза</label>
                <input type="text" name="cargoName" id="wizardCargoName" 
                       value="${data.cargoName || ''}" placeholder="Описание груза">
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Вес (кг)</label>
                    <input type="number" name="cargoWeight" id="wizardCargoWeight" 
                           value="${data.cargoWeight || ''}" min="0" step="0.1">
                </div>
                <div class="form-group">
                    <label>Объём (м³)</label>
                    <input type="number" name="cargoVolume" id="wizardCargoVolume" 
                           value="${data.cargoVolume || ''}" min="0" step="0.01">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Количество мест</label>
                    <input type="number" name="cargoPlaces" id="wizardCargoPlaces" 
                           value="${data.cargoPlaces || ''}" min="0">
                </div>
                <div class="form-group">
                    <label>Тип упаковки</label>
                    <select name="packageTypeId" id="wizardPackageType">
                        <option value="">Не выбрано</option>
                        ${packageOptions}
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group checkbox-group">
                    <label>
                        <input type="checkbox" name="isDangerous" id="wizardIsDangerous" 
                               ${data.isDangerous ? 'checked' : ''}>
                        ⚠️ Опасный груз (DG)
                    </label>
                </div>
                <div class="form-group checkbox-group">
                    <label>
                        <input type="checkbox" name="isTemperature" id="wizardIsTemperature" 
                               ${data.isTemperature ? 'checked' : ''}>
                        🌡️ Температурный режим
                    </label>
                </div>
            </div>
        </div>
    `;
}

/**
 * Рендер секции Transport
 * @param {Object} data - Данные формы
 * @param {Array} vehicleBodyTypes - Типы кузова
 * @returns {string} HTML секции
 */
export function renderTransportSection(data = {}, vehicleBodyTypes = []) {
    const bodyOptions = vehicleBodyTypes.map(bt =>
        `<option value="${bt.id}" ${data.vehicleBodyTypeId == bt.id ? 'selected' : ''}>${bt.name}</option>`
    ).join('');

    return `
        <div class="wizard-section" id="section-transport">
            <h3>🚛 Транспорт</h3>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Тип транспорта</label>
                    <select name="transportMode" id="wizardTransportMode">
                        <option value="tbd" ${data.transportMode === 'tbd' ? 'selected' : ''}>❓ Не определён</option>
                        <option value="auto" ${data.transportMode === 'auto' ? 'selected' : ''}>🚛 Авто</option>
                        <option value="rail" ${data.transportMode === 'rail' ? 'selected' : ''}>🚂 ЖД</option>
                        <option value="sea" ${data.transportMode === 'sea' ? 'selected' : ''}>🚢 Море</option>
                        <option value="air" ${data.transportMode === 'air' ? 'selected' : ''}>✈️ Авиа</option>
                        <option value="multimodal" ${data.transportMode === 'multimodal' ? 'selected' : ''}>🔄 Мультимодал</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Направление</label>
                    <select name="direction" id="wizardDirection">
                        <option value="" ${!data.direction ? 'selected' : ''}>Не выбрано</option>
                        <option value="import" ${data.direction === 'import' ? 'selected' : ''}>🔽 Импорт</option>
                        <option value="export" ${data.direction === 'export' ? 'selected' : ''}>🔼 Экспорт</option>
                        <option value="domestic" ${data.direction === 'domestic' ? 'selected' : ''}>🏠 Внутренняя</option>
                        <option value="transit" ${data.direction === 'transit' ? 'selected' : ''}>↔️ Транзит</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Тип кузова</label>
                    <select name="vehicleBodyTypeId" id="wizardVehicleBodyType">
                        <option value="">Не выбрано</option>
                        ${bodyOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Требования к транспорту</label>
                    <input type="text" name="transportRequirements" id="wizardTransportRequirements" 
                           value="${data.transportRequirements || ''}" placeholder="GPS, пломба и т.д.">
                </div>
            </div>
        </div>
    `;
}

/**
 * Рендер секции Finance
 * @param {Object} data - Данные формы
 * @param {Array} carriers - Список перевозчиков
 * @returns {string} HTML секции
 */
export function renderFinanceSection(data = {}, carriers = []) {
    const carrierOptions = carriers.map(c =>
        `<option value="${c.id}" ${data.carrierId == c.id ? 'selected' : ''}>${c.name}</option>`
    ).join('');

    return `
        <div class="wizard-section" id="section-finance">
            <h3>💰 Финансы</h3>
            
            <div class="form-group">
                <label>Перевозчик</label>
                <select name="carrierId" id="wizardCarrierId">
                    <option value="">Не выбран</option>
                    ${carrierOptions}
                </select>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Ставка клиента (₽)</label>
                    <input type="number" name="clientRate" id="wizardClientRate" 
                           value="${data.clientRate || ''}" min="0" step="0.01">
                </div>
                <div class="form-group">
                    <label>Ставка перевозчика (₽)</label>
                    <input type="number" name="carrierRate" id="wizardCarrierRate" 
                           value="${data.carrierRate || ''}" min="0" step="0.01">
                </div>
            </div>

            <div class="form-group profit-display">
                <label>Маржа</label>
                <div id="wizardProfitDisplay" class="profit-value">—</div>
            </div>

            <div class="form-group">
                <label>Примечание</label>
                <textarea name="notes" id="wizardNotes" rows="3">${data.notes || ''}</textarea>
            </div>
        </div>
    `;
}

/**
 * Рендер секции по ID
 * @param {string} sectionId - ID секции
 * @param {Object} data - Данные формы
 * @param {Object} dictionaries - Справочники
 * @returns {string} HTML секции
 */
export function renderSection(sectionId, data = {}, dictionaries = {}) {
    switch (sectionId) {
        case WIZARD_SECTIONS.CLIENT:
            return renderClientSection(data, dictionaries.clients || []);
        case WIZARD_SECTIONS.ROUTE:
            return renderRouteSection(data);
        case WIZARD_SECTIONS.CARGO:
            return renderCargoSection(data, dictionaries.packageTypes || []);
        case WIZARD_SECTIONS.TRANSPORT:
            return renderTransportSection(data, dictionaries.vehicleBodyTypes || []);
        case WIZARD_SECTIONS.FINANCE:
            return renderFinanceSection(data, dictionaries.carriers || []);
        default:
            return '<p>Секция не найдена</p>';
    }
}

/**
 * Рендер полного wizard
 * @param {Object} options - Параметры
 * @returns {string} HTML wizard
 */
export function renderWizard(options = {}) {
    const {
        currentSection = WIZARD_SECTIONS.CLIENT,
        sectionStates = {},
        data = {},
        dictionaries = {},
        isEdit = false
    } = options;

    const sidebar = renderWizardSidebar(currentSection, sectionStates);
    const content = renderSection(currentSection, data, dictionaries);
    const title = isEdit ? 'Редактирование заказа' : 'Создание заказа';

    const currentIndex = SECTION_ORDER.indexOf(currentSection);
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === SECTION_ORDER.length - 1;

    return `
        <div class="wizard-container">
            ${sidebar}
            <div class="wizard-content">
                <div class="wizard-header">
                    <h2>${title}</h2>
                </div>
                <form id="wizardForm" class="wizard-form">
                    ${content}
                </form>
                <div class="wizard-actions">
                    <button type="button" class="btn btn-secondary" id="wizardBtnBack" 
                            ${isFirst ? 'disabled' : ''}>← Назад</button>
                    <button type="button" class="btn btn-outline" id="wizardBtnDraft">
                        💾 Сохранить черновик
                    </button>
                    ${isLast
            ? `<button type="button" class="btn btn-primary" id="wizardBtnCreate">
                               ✓ Создать заказ
                           </button>`
            : `<button type="button" class="btn btn-primary" id="wizardBtnNext">
                               Далее →
                           </button>`
        }
                </div>
            </div>
        </div>
    `;
}
