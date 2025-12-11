/**
 * Вспомогательные функции для работы с формами
 */

/**
 * Форматировать дату для отображения
 * @param {string|Date} date - Дата для форматирования
 * @returns {string} Отформатированная дата
 */
export function formatDate(date) {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ru-RU');
}

/**
 * Получить данные из FormData как объект
 * @param {FormData} formData - FormData объект
 * @returns {Object} Объект с данными формы
 */
export function formDataToObject(formData) {
    const obj = {};
    for (const [key, value] of formData.entries()) {
        obj[key] = value;
    }
    return obj;
}

/**
 * Очистить форму
 * @param {HTMLFormElement} form - Форма для очистки
 */
export function resetForm(form) {
    if (form) {
        form.reset();
    }
}
