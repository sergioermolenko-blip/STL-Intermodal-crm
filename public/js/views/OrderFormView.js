export function renderOrderForm(vehicleBodyTypes = [], clients = [], carriers = []) {
    // 1. Генерируем опции для Типов Кузова
    const bodyTypeOptions = vehicleBodyTypes.map(type =>
        `<option value="${type._id}">${type.name}</option>`
    ).join('');

    // 2. Генерируем опции для Клиентов
    const clientOptions = clients.map(client =>
        `<option value="${client._id}">${client.name}</option>`
    ).join('');

    // 3. Генерируем опции для Перевозчиков
    const carrierOptions = carriers.map(carrier =>
        `<option value="${carrier._id}">${carrier.name}</option>`
    ).join('');

    // 4. Возвращаем HTML формы
    return `
        <form id="createOrderForm" class="order-form">
            <div class="form-grid-layout">
                
                <div class="form-section">
                    <h3>📍 Маршрут и Даты</h3>
                    
                    <div class="form-group">
                        <label>Откуда</label>
                        <input type="text" name="routeFrom" id="route_from" placeholder="Город отправления" required>
                    </div>

                    <div class="form-group">
                        <label>Куда</label>
                        <input type="text" name="routeTo" id="route_to" placeholder="Город назначения" required>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Дата погрузки</label>
                            <input type="date" name="dateLoading" id="date_loading" required>
                        </div>
                        <div class="form-group">
                            <label>Дата выгрузки</label>
                            <input type="date" name="dateUnloading" id="date_unloading">
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h3>🚛 Груз и Транспорт</h3>

                    <div class="form-group">
                        <label>Характер груза</label>
                        <input type="text" name="cargoName" id="cargo_name" placeholder="Например: Доски" required>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Вес (кг)</label>
                            <input type="number" name="cargoWeight" id="cargo_weight" placeholder="20000" required>
                        </div>
                        <div class="form-group">
                            <label>Тип кузова</label>
                            <select name="vehicleBodyType" id="vehicleBodyType" required>
                                <option value="" disabled selected>Выберите тип</option>
                                ${bodyTypeOptions}
                            </select>
                        </div>
                    </div>
                </div>

                <div class="form-section full-width">
                    <h3>💰 Участники и Деньги</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Клиент</label>
                            <select name="client" id="clientSelect" required>
                                <option value="" disabled selected>Выберите клиента</option>
                                ${clientOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Ставка клиента (₽)</label>
                            <input type="number" name="clientRate" id="client_rate" placeholder="0">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Перевозчик</label>
                            <select name="carrier" id="carrierSelect" required>
                                <option value="" disabled selected>Выберите перевозчика</option>
                                ${carrierOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Ставка перевозчика (₽)</label>
                            <input type="number" name="carrierRate" id="carrier_rate" placeholder="0">
                        </div>
                    </div>
                </div>

            </div>

            <div class="form-actions">
                <button type="submit" class="btn btn-primary btn-large">Создать заказ</button>
            </div>
        </form>
    `;
}