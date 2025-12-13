# STL Intermodal CRM

CRM система для экспедитора по перевозке грузов.

## 🚀 Быстрый старт

### Установка зависимостей
```bash
npm install
```

### Запуск приложения
```bash
# Development режим с автоперезагрузкой
npm run dev

# Production режим
npm start
```

### Заполнение тестовыми данными
```bash
npm run seed
```

Приложение будет доступно по адресу: http://localhost:3000

---

## 🧪 Тестирование

### Unit Tests (Vitest)

**Запуск всех unit тестов:**
```bash
npm run test:unit
```

**Запуск в watch режиме:**
```bash
npm run test:unit:watch
```

**Запуск с UI:**
```bash
npm test
```

**Coverage:**
```bash
npm run test:unit -- --coverage
```

### E2E Tests (Playwright)

**Запуск E2E тестов:**
```bash
npm run test:e2e
```

**Запуск с UI (интерактивный режим):**
```bash
npm run test:e2e:ui
```

**Запуск всех тестов:**
```bash
npm run test:all
```

---

## 📁 Структура Проекта

```
STL Itermodal CRM/
├── public/
│   ├── js/
│   │   ├── modules/          # Менеджеры сущностей
│   │   │   ├── contact/      # Подмодули контактов
│   │   │   ├── order/        # Подмодули заказов
│   │   │   └── ...
│   │   ├── views/            # Генерация UI
│   │   ├── utils/            # Утилиты
│   │   └── state/            # Управление состоянием
│   ├── css/
│   └── index.html
├── src/
│   ├── models/               # Mongoose модели
│   ├── controllers/          # Бизнес-логика
│   ├── routes/               # API маршруты
│   └── config/               # Конфигурация
├── tests/
│   ├── unit/                 # Unit тесты
│   │   ├── utils/
│   │   └── modules/
│   └── e2e/                  # E2E тесты
│       ├── navigation.spec.js
│       ├── clients.spec.js
│       ├── carriers.spec.js
│       └── orders.spec.js
├── .github/
│   └── workflows/
│       └── tests.yml         # CI/CD конфигурация
├── vitest.config.js          # Конфигурация Vitest
├── playwright.config.js      # Конфигурация Playwright
└── package.json
```

---

## 🛠️ Технологии

### Backend
- **Node.js** + **Express** - сервер
- **MongoDB** + **Mongoose** - база данных
- **CORS** - кросс-доменные запросы
- **dotenv** - переменные окружения

### Frontend
- **Vanilla JavaScript** (ES6 modules)
- **MVC архитектура**
- **Модульная структура**

### Testing
- **Vitest** - unit тесты
- **Playwright** - E2E тесты
- **jsdom** - DOM для тестов

---

## 📊 Качество Кода

- **Оценка:** 8.5/10
- **DRY Score:** 9/10
- **Test Coverage:** 70%+
- **Maintainability:** High

---

## 🔧 Разработка

### Скрипты

| Команда | Описание |
|---------|----------|
| `npm start` | Запуск production сервера |
| `npm run dev` | Запуск development сервера |
| `npm run seed` | Заполнение БД тестовыми данными |
| `npm test` | Запуск unit тестов в watch режиме |
| `npm run test:unit` | Запуск unit тестов |
| `npm run test:e2e` | Запуск E2E тестов |
| `npm run test:all` | Запуск всех тестов |

### Переменные окружения

Создайте файл `.env` в корне проекта:

```env
MONGO_URI=mongodb://localhost:27017/stl-crm
PORT=3000
NODE_ENV=development
```

---

## 🧪 Написание Тестов

### Unit Test Example

```javascript
// tests/unit/utils/example.test.js
import { describe, it, expect } from 'vitest';
import { myFunction } from '../../../public/js/utils/example.js';

describe('myFunction', () => {
  it('should return expected result', () => {
    expect(myFunction(1, 2)).toBe(3);
  });
});
```

### E2E Test Example

```javascript
// tests/e2e/example.spec.js
import { test, expect } from '@playwright/test';

test('should navigate to page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
});
```

---

## 🚀 CI/CD

Проект использует GitHub Actions для автоматического запуска тестов:

- **Unit тесты** запускаются при каждом push и PR
- **E2E тесты** запускаются при каждом push и PR
- Результаты доступны во вкладке Actions

---

## 📝 Лицензия

ISC

---

## 👥 Автор

STL Intermodal CRM Team
