/**
 * ModalView - Управление модальными окнами
 */

class ModalView {
    constructor() {
        this.container = null;
        this.onSaveCallback = null;
    }

    /**
     * Показать модальное окно
     * @param {string} title - Заголовок окна
     * @param {string} contentHTML - HTML содержимое
     * @param {Function} onSave - Callback при сохранении
     */
    show(title, contentHTML, onSave = null) {
        this.onSaveCallback = onSave;
        this.container = document.getElementById('modalContainer');

        const modalHTML = `
            <div id="dynamicModal" class="modal">
                <div class="modal-overlay" data-close="true"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <button class="modal-close" data-close="true">×</button>
                    </div>
                    <div class="modal-body">
                        ${contentHTML}
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" data-close="true">Отмена</button>
                        <button type="button" class="btn btn-primary" data-save="true">Сохранить</button>
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = modalHTML;

        // Добавляем обработчики
        this._attachEventListeners();

        // Показываем модальное окно (убираем класс hidden если есть)
        const modal = document.getElementById('dynamicModal');
        modal.classList.remove('hidden');
    }

    /**
     * Показать модальное окно с формой (для submit)
     * @param {string} title - Заголовок окна
     * @param {string} formHTML - HTML формы
     * @param {Function} onSubmit - Callback при submit формы
     */
    showForm(title, formHTML, onSubmit) {
        this.container = document.getElementById('modalContainer');

        const modalHTML = `
            <div id="dynamicModal" class="modal">
                <div class="modal-overlay" data-close="true"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <button class="modal-close" data-close="true">×</button>
                    </div>
                    <div class="modal-body">
                        ${formHTML}
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" data-close="true">Отмена</button>
                        <button type="button" class="btn btn-primary" data-submit="true">Сохранить</button>
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = modalHTML;

        // Добавляем обработчики
        this._attachEventListeners();

        // Обработчик submit формы через кнопку
        const submitBtn = this.container.querySelector('[data-submit="true"]');
        const form = this.container.querySelector('form');

        if (submitBtn && form && onSubmit) {
            submitBtn.addEventListener('click', async () => {
                // Проверяем валидность формы
                if (form.checkValidity()) {
                    const event = new Event('submit', { bubbles: true, cancelable: true });
                    await onSubmit(event);
                } else {
                    // Показываем ошибки валидации
                    form.reportValidity();
                }
            });
        }

        // Показываем модальное окно
        const modal = document.getElementById('dynamicModal');
        modal.classList.remove('hidden');
    }

    /**
     * Закрыть модальное окно
     */
    close() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.onSaveCallback = null;
    }

    /**
     * Привязка обработчиков событий
     */
    _attachEventListeners() {
        const modal = document.getElementById('dynamicModal');
        if (!modal) return;

        // Закрытие по клику на overlay или кнопку закрытия
        modal.querySelectorAll('[data-close="true"]').forEach(element => {
            element.addEventListener('click', () => this.close());
        });

        // Кнопка сохранения (если не форма)
        const saveBtn = modal.querySelector('[data-save="true"]');
        if (saveBtn && this.onSaveCallback) {
            saveBtn.addEventListener('click', async () => {
                await this.onSaveCallback();
            });
        }

        // Закрытие по Escape
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.close();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
}

// Экспортируем singleton
export const modalView = new ModalView();
