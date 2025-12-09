// ============================================
// FORM GENERATORS
// ============================================

/**
 * Генератор HTML формы для клиента
 */
function getClientFormHTML(client = null) {
    return `
        <form id="clientForm">
            <div class="form-group">
                <label for="clientName">Название компании *</label>
                <input type="text" id="clientName" name="name" 
                       value="${client?.name || ''}" required>
            </div>
            <div class="form-group">
                <label for="clientInn">ИНН</label>
                <input type="text" id="clientInn" name="inn" 
                       value="${client?.inn || ''}" maxlength="12">
            </div>
            <div class="form-group">
                <label for="clientContactPerson">Контактное лицо</label>
                <input type="text" id="clientContactPerson" name="contactPerson" 
                       value="${client?.contactPerson || ''}">
            </div>
            <div class="form-group">
                <label for="clientPhone">Телефон</label>
                <input type="tel" id="clientPhone" name="phone" 
                       value="${client?.phone || ''}">
            </div>
            <div class="form-group">
                <label for="clientEmail">Email</label>
                <input type="email" id="clientEmail" name="email" 
                       value="${client?.email || ''}">
            </div>
        </form>
    `;
}

/**
 * Генератор HTML формы для перевозчика
 */
function getCarrierFormHTML(carrier = null) {
    return `
        <form id="carrierForm">
            <div class="form-group">
                <label for="carrierName">Название компании *</label>
                <input type="text" id="carrierName" name="name" 
                       value="${carrier?.name || ''}" required>
            </div>
            <div class="form-group">
                <label for="carrierDriverName">Имя водителя</label>
                <input type="text" id="carrierDriverName" name="driverName" 
                       value="${carrier?.driverName || ''}">
            </div>
            <div class="form-group">
                <label for="carrierTruckNumber">Номер грузовика</label>
                <input type="text" id="carrierTruckNumber" name="truckNumber" 
                       value="${carrier?.truckNumber || ''}">
            </div>
            <div class="form-group">
                <label for="carrierPhone">Телефон</label>
                <input type="tel" id="carrierPhone" name="phone" 
                       value="${carrier?.phone || ''}">
            </div>
        </form>
    `;
}

// ============================================
// CLIENTS SECTION - EVENT DELEGATION
// ============================================

/**
 * Загрузить список клиентов
 */
async function loadClients() {
    try {
        const response = await fetch(API_CLIENTS);

        if (!response.ok) {
            throw new Error('Ошибка при загрузке клиентов');
        }

        const clients = await response.json();
        loadedClients = clients; // Сохраняем в глобальное хранилище
        console.log('👥 Загружено клиентов:', clients.length);

        renderClientsTable();
    } catch (error) {
        console.error('❌ Ошибка загрузки клиентов:', error);
        if (clientsTableBody) {
            clientsTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="color: var(--error-color); text-align: center;">
                        Ошибка при загрузке клиентов
                    </td>
                </tr>
            `;
        }
    }
}

/**
 * Рендеринг таблицы клиентов
 */
function renderClientsTable() {
    if (!clientsTableBody) return;

    if (loadedClients.length === 0) {
        clientsTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <p>Клиентов пока нет. Добавьте первого клиента!</p>
                </td>
            </tr>
        `;
        return;
    }

    clientsTableBody.innerHTML = loadedClients.map(client => `
        <tr>
            <td>${client.name}</td>
            <td>${client.inn || '—'}</td>
            <td>${client.contactPerson || '—'}</td>
            <td>${client.phone || '—'}</td>
            <td>${client.email || '—'}</td>
            <td>${new Date(client.created_at).toLocaleDateString('ru-RU')}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" data-id="${client._id}" title="Редактировать">
                        ✏️
                    </button>
                    <button class="btn-icon btn-delete" data-id="${client._id}" title="Удалить">
                        🗑️
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Инициализация event delegation для таблицы клиентов
 */
function initClientTableEvents() {
    if (!clientsTableBody) return;

    clientsTableBody.addEventListener('click', async (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const clientId = target.dataset.id;

        if (target.classList.contains('btn-edit')) {
            await handleEditClient(clientId);
        } else if (target.classList.contains('btn-delete')) {
            await handleDeleteClient(clientId);
        }
    });
}

/**
 * Инициализация кнопки "Добавить клиента"
 */
function initClientAddButton() {
    const addBtn = document.querySelector('[data-action="add-client"]');
    if (addBtn) {
        addBtn.addEventListener('click', handleAddClient);
    }
}

/**
 * Обработчик добавления клиента
 */
async function handleAddClient() {
    const formHTML = getClientFormHTML();

    modalView.showForm('Новый клиент', formHTML, async (e) => {
        const formData = new FormData(document.getElementById('clientForm'));

        const clientData = {
            name: formData.get('name').trim(),
            inn: formData.get('inn')?.trim() || undefined,
            contactPerson: formData.get('contactPerson')?.trim() || undefined,
            phone: formData.get('phone')?.trim() || undefined,
            email: formData.get('email')?.trim() || undefined
        };

        if (!clientData.name) {
            showMessage('✗ Название компании обязательно', 'error');
            return;
        }

        try {
            const response = await fetch(API_CLIENTS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clientData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при создании клиента');
            }

            showMessage('✓ Клиент успешно создан!', 'success');
            modalView.close();
            loadClients();
        } catch (error) {
            console.error('❌ Ошибка создания клиента:', error);
            showMessage(`✗ Ошибка: ${error.message}`, 'error');
        }
    });
}

/**
 * Обработчик редактирования клиента
 */
async function handleEditClient(clientId) {
    const client = loadedClients.find(c => c._id === clientId);
    if (!client) {
        showMessage('✗ Клиент не найден', 'error');
        return;
    }

    const formHTML = getClientFormHTML(client);

    modalView.showForm('Редактирование клиента', formHTML, async (e) => {
        const formData = new FormData(document.getElementById('clientForm'));

        const clientData = {
            name: formData.get('name').trim(),
            inn: formData.get('inn')?.trim() || undefined,
            contactPerson: formData.get('contactPerson')?.trim() || undefined,
            phone: formData.get('phone')?.trim() || undefined,
            email: formData.get('email')?.trim() || undefined
        };

        if (!clientData.name) {
            showMessage('✗ Название компании обязательно', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_CLIENTS}/${clientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clientData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при обновлении клиента');
            }

            showMessage('✓ Клиент успешно обновлен!', 'success');
            modalView.close();
            loadClients();
        } catch (error) {
            console.error('❌ Ошибка обновления клиента:', error);
            showMessage(`✗ Ошибка: ${error.message}`, 'error');
        }
    });
}

/**
 * Обработчик удаления клиента
 */
async function handleDeleteClient(clientId) {
    if (!confirm('Вы уверены, что хотите удалить этого клиента?')) {
        return;
    }

    try {
        const response = await fetch(`${API_CLIENTS}/${clientId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при удалении клиента');
        }

        showMessage('✓ Клиент успешно удален!', 'success');
        loadClients();
    } catch (error) {
        console.error('❌ Ошибка удаления клиента:', error);
        showMessage(`✗ Ошибка: ${error.message}`, 'error');
    }
}

// ============================================
// CARRIERS SECTION - EVENT DELEGATION
// ============================================

/**
 * Загрузить список перевозчиков
 */
async function loadCarriers() {
    try {
        const response = await fetch(API_CARRIERS);

        if (!response.ok) {
            throw new Error('Ошибка при загрузке перевозчиков');
        }

        const carriers = await response.json();
        loadedCarriers = carriers; // Сохраняем в глобальное хранилище
        console.log('🚛 Загружено перевозчиков:', carriers.length);

        renderCarriersTable();
    } catch (error) {
        console.error('❌ Ошибка загрузки перевозчиков:', error);
        if (carriersTableBody) {
            carriersTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="color: var(--error-color); text-align: center;">
                        Ошибка при загрузке перевозчиков
                    </td>
                </tr>
            `;
        }
    }
}

/**
 * Рендеринг таблицы перевозчиков
 */
function renderCarriersTable() {
    if (!carriersTableBody) return;

    if (loadedCarriers.length === 0) {
        carriersTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <p>Перевозчиков пока нет. Добавьте первого перевозчика!</p>
                </td>
            </tr>
        `;
        return;
    }

    carriersTableBody.innerHTML = loadedCarriers.map(carrier => `
        <tr>
            <td>${carrier.name}</td>
            <td>${carrier.driverName || '—'}</td>
            <td>${carrier.truckNumber || '—'}</td>
            <td>${carrier.phone || '—'}</td>
            <td>${new Date(carrier.created_at).toLocaleDateString('ru-RU')}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" data-id="${carrier._id}" title="Редактировать">
                        ✏️
                    </button>
                    <button class="btn-icon btn-delete" data-id="${carrier._id}" title="Удалить">
                        🗑️
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Инициализация event delegation для таблицы перевозчиков
 */
function initCarrierTableEvents() {
    if (!carriersTableBody) return;

    carriersTableBody.addEventListener('click', async (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const carrierId = target.dataset.id;

        if (target.classList.contains('btn-edit')) {
            await handleEditCarrier(carrierId);
        } else if (target.classList.contains('btn-delete')) {
            await handleDeleteCarrier(carrierId);
        }
    });
}

/**
 * Инициализация кнопки "Добавить перевозчика"
 */
function initCarrierAddButton() {
    const addBtn = document.querySelector('[data-action="add-carrier"]');
    if (addBtn) {
        addBtn.addEventListener('click', handleAddCarrier);
    }
}

/**
 * Обработчик добавления перевозчика
 */
async function handleAddCarrier() {
    const formHTML = getCarrierFormHTML();

    modalView.showForm('Новый перевозчик', formHTML, async (e) => {
        const formData = new FormData(document.getElementById('carrierForm'));

        const carrierData = {
            name: formData.get('name').trim(),
            driverName: formData.get('driverName')?.trim() || undefined,
            truckNumber: formData.get('truckNumber')?.trim() || undefined,
            phone: formData.get('phone')?.trim() || undefined
        };

        if (!carrierData.name) {
            showMessage('✗ Название компании обязательно', 'error');
            return;
        }

        try {
            const response = await fetch(API_CARRIERS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(carrierData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при создании перевозчика');
            }

            showMessage('✓ Перевозчик успешно создан!', 'success');
            modalView.close();
            loadCarriers();
        } catch (error) {
            console.error('❌ Ошибка создания перевозчика:', error);
            showMessage(`✗ Ошибка: ${error.message}`, 'error');
        }
    });
}

/**
 * Обработчик редактирования перевозчика
 */
async function handleEditCarrier(carrierId) {
    const carrier = loadedCarriers.find(c => c._id === carrierId);
    if (!carrier) {
        showMessage('✗ Перевозчик не найден', 'error');
        return;
    }

    const formHTML = getCarrierFormHTML(carrier);

    modalView.showForm('Редактирование перевозчика', formHTML, async (e) => {
        const formData = new FormData(document.getElementById('carrierForm'));

        const carrierData = {
            name: formData.get('name').trim(),
            driverName: formData.get('driverName')?.trim() || undefined,
            truckNumber: formData.get('truckNumber')?.trim() || undefined,
            phone: formData.get('phone')?.trim() || undefined
        };

        if (!carrierData.name) {
            showMessage('✗ Название компании обязательно', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_CARRIERS}/${carrierId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(carrierData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при обновлении перевозчика');
            }

            showMessage('✓ Перевозчик успешно обновлен!', 'success');
            modalView.close();
            loadCarriers();
        } catch (error) {
            console.error('❌ Ошибка обновления перевозчика:', error);
            showMessage(`✗ Ошибка: ${error.message}`, 'error');
        }
    });
}

/**
 * Обработчик удаления перевозчика
 */
async function handleDeleteCarrier(carrierId) {
    if (!confirm('Вы уверены, что хотите удалить этого перевозчика?')) {
        return;
    }

    try {
        const response = await fetch(`${API_CARRIERS}/${carrierId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при удалении перевозчика');
        }

        showMessage('✓ Перевозчик успешно удален!', 'success');
        loadCarriers();
    } catch (error) {
        console.error('❌ Ошибка удаления перевозчика:', error);
        showMessage(`✗ Ошибка: ${error.message}`, 'error');
    }
}
