/**
 * Dictionary Manager - управление справочниками
 */

import { fetchDictionaries } from '../utils/api.js';
import { appState } from '../state/appState.js';

/**
 * Загрузить все справочники
 */
export async function loadDictionaries() {
    try {
        const data = await fetchDictionaries();
        appState.setDictionaries({
            vehicleBodyTypes: data.vehicleBodyTypes || [],
            loadingTypes: data.loadingTypes || [],
            packageTypes: data.packageTypes || []
        });
    } catch (error) {
        console.error('❌ Ошибка загрузки справочников:', error);
    }
}

export const dictionaryManager = {
    loadDictionaries
};
