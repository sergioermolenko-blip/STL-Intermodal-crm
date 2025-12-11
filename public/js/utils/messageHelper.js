/**
 * Вспомогательные функции для отображения сообщений
 */

/**
 * Показать сообщение пользователю
 * @param {string} text - Текст сообщения
 * @param {string} type - Тип сообщения: 'success' или 'error'
 */
export function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    if (!messageEl) return;

    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.classList.remove('hidden');

    setTimeout(() => {
        messageEl.classList.add('hidden');
    }, 3000);
}
