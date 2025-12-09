/**
 * OrderFormView - Компонент для генерации формы создания заказа
 */

export function renderOrderForm(dictionaries = {}) {
    const { vehicleBodyTypes = [] } = dictionaries;

    return `
        <div class="card">
            <h2>Создание нового заказа</h2>

            <form id="orderForm" class="order-form">
                <!-- Секция: Маршрут -->
                <fieldset class="form-section">
                    <legend>🗺️ Маршрут</legend>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="route_from">Откуда (пункт отправления) *</label>
                            <input type="text" id="route_from" name="route_from" 
                                   placeholder="Например: Москва" required>
                        </div>
                        <div class="form-group">
                            <label for="route_to">Куда (пункт назначения) *</label>
                            <input type="text" id="route_to" name="route_to" 
                                   placeholder="Например: Санкт-Петербург" required>
                        </div>
                    </div>
                </fieldset>

                <!-- Секция: Груз -->
                <fieldset class="form-section">
                    <legend>📦 Груз</legend>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="cargo_name">Наименование груза *</label>
                            <input type="text" id="cargo_name" name="cargo_name" 
                                   placeholder="Например: Электроника" required>
                        </div>
                        <div class="form-group">
                            <label for="cargo_weight">Вес (кг) *</label>
                            <input type="number" id="cargo_weight" name="cargo_weight" 
                                   placeholder="1000" min="0" step="0.01" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="vehicleBodyType">Тип кузова *</label>
                            <select id="vehicleBodyType" name="vehicleBodyType" required>
                                <option value="">Выберите тип кузова</option>
                                ${vehicleBodyTypes.map(type =>
        `<option value="${type._id}">${type.name}</option>`
    ).join('')}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <!-- Секция: Участники -->
                <fieldset class="form-section">
                    <legend>👥 Участники</legend>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="clientName">Клиент *</label>
                            <input type="text" id="clientName" name="clientName" 
                                   placeholder="Например: ООО Ромашка" required>
                        </div>
                        <div class="form-group">
                            <label for="carrierName">Перевозчик *</label>
                            <input type="text" id="carrierName" name="carrierName" 
                                   placeholder="Например: ИП Транспорт" required>
                        </div>
                    </div>
                </fieldset>

                <!-- Секция: Даты -->
                <fieldset class="form-section">
                    <legend>📅 Даты</legend>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="date_loading">Дата погрузки *</label>
                            <input type="date" id="date_loading" name="date_loading" required>
                        </div>
                        <div class="form-group">
                            <label for="date_unloading">Дата выгрузки *</label>
                            <input type="date" id="date_unloading" name="date_unloading" required>
                        </div>
                    </div>
                </fieldset>

                <!-- Секция: Финансы -->
                <fieldset class="form-section">
                    <legend>💰 Финансы</legend>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="clientRate">Ставка клиента (₽) *</label>
                            <input type="number" id="clientRate" name="clientRate" 
                                   placeholder="50000" min="0" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label for="carrierRate">Ставка перевозчика (₽) *</label>
                            <input type="number" id="carrierRate" name="carrierRate" 
                                   placeholder="40000" min="0" step="0.01" required>
                        </div>
                    </div>
                </fieldset>

                <button type="submit" class="btn btn-primary">✓ Создать заказ</button>
            </form>
        </div>
    `;
}

/**
 * Генерация формы редактирования заказа
 */
export function renderEditOrderForm(order, dictionaries = {}) {
    const { vehicleBodyTypes = [] } = dictionaries;

    return `
        <form id="editOrderForm" class="modal-form">
            <input type="hidden" id="editOrderId" value="${order._id}">

            <!-- Маршрут -->
            <fieldset class="form-section">
                <legend>🗺️ Маршрут</legend>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editRouteFrom">Откуда *</label>
                        <input type="text" id="editRouteFrom" value="${order.route_from}" required>
                    </div>
                    <div class="form-group">
                        <label for="editRouteTo">Куда *</label>
                        <input type="text" id="editRouteTo" value="${order.route_to}" required>
                    </div>
                </div>
            </fieldset>

            <!-- Груз -->
            <fieldset class="form-section">
                <legend>📦 Груз</legend>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editCargoName">Наименование *</label>
                        <input type="text" id="editCargoName" value="${order.cargo_name}" required>
                    </div>
                    <div class="form-group">
                        <label for="editCargoWeight">Вес (кг) *</label>
                        <input type="number" id="editCargoWeight" value="${order.cargo_weight}" 
                               min="0" step="0.01" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editVehicleBodyType">Тип кузова *</label>
                        <select id="editVehicleBodyType" required>
                            <option value="">Выберите тип кузова</option>
                            ${vehicleBodyTypes.map(type =>
        `<option value="${type._id}" ${order.vehicleBodyType === type._id ? 'selected' : ''}>
                                    ${type.name}
                                </option>`
    ).join('')}
                        </select>
                    </div>
                </div>
            </fieldset>

            <!-- Даты -->
            <fieldset class="form-section">
                <legend>📅 Даты</legend>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editDateLoading">Дата погрузки *</label>
                        <input type="date" id="editDateLoading" 
                               value="${formatDateForInput(order.date_loading)}" required>
                    </div>
                    <div class="form-group">
                        <label for="editDateUnloading">Дата выгрузки *</label>
                        <input type="date" id="editDateUnloading" 
                               value="${formatDateForInput(order.date_unloading)}" required>
                    </div>
                </div>
            </fieldset>

            <!-- Участники -->
            <fieldset class="form-section">
                <legend>👥 Участники</legend>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editClientName">Клиент *</label>
                        <input type="text" id="editClientName" 
                               value="${order.client?.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="editCarrierName">Перевозчик *</label>
                        <input type="text" id="editCarrierName" 
                               value="${order.carrier?.name || ''}" required>
                    </div>
                </div>
            </fieldset>

            <!-- Финансы -->
            <fieldset class="form-section">
                <legend>💰 Финансы</legend>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editClientRate">Ставка клиента (₽) *</label>
                        <input type="number" id="editClientRate" value="${order.client_rate}" 
                               min="0" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="editCarrierRate">Ставка перевозчика (₽) *</label>
                        <input type="number" id="editCarrierRate" value="${order.carrier_rate}" 
                               min="0" step="0.01" required>
                    </div>
                </div>
            </fieldset>
        </form>
    `;
}

// Helper function
function formatDateForInput(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
