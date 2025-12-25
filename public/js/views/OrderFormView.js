export function renderOrderForm(vehicleBodyTypes = [], clients = [], carriers = [], loadingTypes = [], packageTypes = []) {
    // 1. Генерируем опции для Типов Кузова
    const bodyTypeOptions = vehicleBodyTypes.map(type =>
        `<option value="${type.id}">${type.name}</option>`
    ).join('');

    // 2. Генерируем опции для Клиентов
    const clientOptions = clients.map(client =>
        `<option value="${client.id}">${client.name}</option>`
    ).join('');

    // 3. Генерируем опции для Перевозчиков
    const carrierOptions = carriers.map(carrier =>
        `<option value="${carrier.id}">${carrier.name}</option>`
    ).join('');

    // 4. Генерируем опции для Типов Загрузки
    const loadingTypeOptions = loadingTypes.map(type =>
        `<option value="${type.id}">${type.name}</option>`
    ).join('');

    // 5. Генерируем опции для Типов Упаковки
    const packageTypeOptions = packageTypes.map(type =>
        `<option value="${type.id}">${type.name}</option>`
    ).join('');

    // 6. Возвращаем HTML формы с Grid Layout
    return `
        <form id="createOrderForm" class="order-form">
            <div class="form-grid-layout">
                
                <!-- Блок 1: ЗАКАЗЧИК (Первая секция) -->
                <div class="form-section">
                    <h3 class="section-title">👤 Заказчик</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Клиент</label>
                            <select name="client" id="clientSelect" required>
                                <option value="" disabled selected>Выберите клиента</option>
                                ${clientOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Контактное лицо</label>
                            <select name="clientContact" id="clientContactSelect">
                                <option value="">Сначала выберите клиента</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Ставка клиента (₽)</label>
                            <input type="number" name="clientRate" id="client_rate" placeholder="0">
                        </div>
                        <div class="form-group">
                            <!-- Пустое место для симметрии -->
                        </div>
                    </div>
                </div>

                <!-- Блок 2: Маршрут и Даты -->
                <div class="form-section">
                    <h3 class="section-title">📍 Маршрут и Даты</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Откуда</label>
                            <input type="text" name="route_from" id="route_from" placeholder="Город отправления" required>
                        </div>
                        <div class="form-group">
                            <label>Куда</label>
                            <input type="text" name="route_to" id="route_to" placeholder="Город назначения" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Дата погрузки</label>
                            <input type="date" name="date_loading" id="date_loading" required>
                        </div>
                        <div class="form-group">
                            <label>Дата выгрузки</label>
                            <input type="date" name="date_unloading" id="date_unloading">
                        </div>
                    </div>
                </div>

                <!-- Блок 3: Груз и Транспорт -->
                <div class="form-section">
                    <h3 class="section-title">🚛 Груз и Транспорт</h3>

                    <div class="form-row" style="display: flex; gap: 1rem;">
                        <div class="form-group" style="flex: 2;">
                            <label>Характер груза</label>
                            <input type="text" name="cargo_name" id="cargo_name" placeholder="Например: Доски" required>
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label>Вес (кг)</label>
                            <input type="number" name="cargo_weight" id="cargo_weight" placeholder="20000" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Тип упаковки</label>
                        <select name="packageType" id="packageType">
                            <option value="" disabled selected>Выберите тип упаковки</option>
                            ${packageTypeOptions}
                        </select>
                    </div>

                    <div class="form-row" style="display: flex; gap: 1rem;">
                        <div class="form-group" style="flex: 1;">
                            <label>Тип кузова</label>
                            <select name="vehicleBodyType" id="vehicleBodyType" required>
                                <option value="" disabled selected>Выберите тип</option>
                                ${bodyTypeOptions}
                            </select>
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label>Тип загрузки</label>
                            <select name="loadingType" id="loadingType">
                                <option value="" disabled selected>Выберите тип загрузки</option>
                                ${loadingTypeOptions}
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Блок 4: Исполнитель и Финансы (Последняя секция) -->
                <div class="form-section">
                    <h3 class="section-title">💰 Исполнитель и Деньги</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Перевозчик</label>
                            <select name="carrier" id="carrierSelect" required>
                                <option value="" disabled selected>Выберите перевозчика</option>
                                ${carrierOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Контактное лицо</label>
                            <select name="carrierContact" id="carrierContactSelect">
                                <option value="">Сначала выберите перевозчика</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Ставка перевозчика (₽)</label>
                            <input type="number" name="carrierRate" id="carrier_rate" placeholder="0">
                        </div>
                        <div class="form-group">
                            <!-- Пустое место для симметрии -->
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