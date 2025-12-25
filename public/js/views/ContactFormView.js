/**
 * View module для формы контакта
 */

/**
 * Рендер формы контакта
 * @param {Object|null} contact - Данные контакта для редактирования
 * @param {Array} clients - Массив клиентов
 * @param {Array} carriers - Массив перевозчиков
 * @returns {string} HTML формы
 */
export function renderContactForm(contact = null, clients = [], carriers = []) {
    const clientOptions = clients.map(client =>
        `<option value="${client.id}" ${contact?.client?.id === client.id ? 'selected' : ''}>${client.name}</option>`
    ).join('');

    const carrierOptions = carriers.map(carrier =>
        `<option value="${carrier.id}" ${contact?.carrier?.id === carrier.id ? 'selected' : ''}>${carrier.name}</option>`
    ).join('');

    const relatedToClient = contact?.relatedTo === 'client' || !contact;
    const relatedToCarrier = contact?.relatedTo === 'carrier';

    const phonesHTML = contact?.phones?.map((phone, index) => `
        <div class="phone-input-group" data-index="${index}">
            <input type="tel" name="phone_${index}" value="${phone}" required>
            ${index > 0 ? '<button type="button" class="btn-remove-phone">✖</button>' : ''}
        </div>
    `).join('') || `
        <div class="phone-input-group" data-index="0">
            <input type="tel" name="phone_0" required>
        </div>
    `;

    return `
        <form id="contactForm" class="modal-form">
            <input type="hidden" id="contactId" value="${contact?.id || ''}">
            
            <div class="form-group">
                <label for="contactFullName">ФИО *</label>
                <input type="text" id="contactFullName" name="fullName" value="${contact?.fullName || ''}" required>
            </div>

            <div class="form-group">
                <label>Тип компании *</label>
                <div class="radio-group">
                    <label>
                        <input type="radio" name="relatedTo" value="client" ${relatedToClient ? 'checked' : ''} required>
                        Клиент
                    </label>
                    <label>
                        <input type="radio" name="relatedTo" value="carrier" ${relatedToCarrier ? 'checked' : ''}>
                        Перевозчик
                    </label>
                </div>
            </div>

            <div class="form-group" id="clientSelectGroup" ${relatedToCarrier ? 'style="display:none"' : ''}>
                <label for="contactClient">Клиент *</label>
                <select id="contactClient" name="client">
                    <option value="">Выберите клиента</option>
                    ${clientOptions}
                </select>
            </div>

            <div class="form-group" id="carrierSelectGroup" ${relatedToClient ? 'style="display:none"' : ''}>
                <label for="contactCarrier">Перевозчик *</label>
                <select id="contactCarrier" name="carrier">
                    <option value="">Выберите перевозчика</option>
                    ${carrierOptions}
                </select>
            </div>

            <div class="form-group">
                <label>Телефоны *</label>
                <div id="phonesContainer">
                    ${phonesHTML}
                </div>
                <button type="button" id="btnAddPhone" class="btn btn-secondary btn-small">+ Добавить телефон</button>
            </div>
            
            <div class="form-group">
                <label for="contactEmail">Email *</label>
                <input type="email" id="contactEmail" name="email" value="${contact?.email || ''}" required>
            </div>

            <div class="form-group">
                <label for="contactNotes">Комментарии</label>
                <textarea id="contactNotes" name="notes" rows="4">${contact?.notes || ''}</textarea>
            </div>

            <div class="form-group">
                <label>
                    <input type="checkbox" id="contactIsActive" name="isActive" ${contact?.isActive !== false ? 'checked' : ''}>
                    Активен
                </label>
            </div>
        </form>
    `;
}
