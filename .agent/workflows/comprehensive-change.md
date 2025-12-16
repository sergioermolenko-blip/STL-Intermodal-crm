---
description: Workflow для комплексных изменений с проверкой всех зависимостей
---

# Комплексное изменение кода

Этот workflow обеспечивает синхронные изменения во всех зависимых файлах.

## Шаги выполнения

### 1. Анализ зависимостей
- Определить, какие файлы будут затронуты
- Составить список всех зависимых компонентов
- Проверить паттерны проекта (MVC, Factory)

### 2. Создание плана изменений
- Перечислить все файлы для изменения
- Определить порядок изменений (от модели к представлению)
- Показать план пользователю для подтверждения

### 3. Реализация изменений
- Изменить файлы в правильном порядке:
  1. Models (src/models/)
  2. Controllers (src/controllers/)
  3. Views (public/js/views/)
  4. Managers (public/js/modules/)
  5. Tests (tests/)

### 4. Проверка целостности
- Запустить поиск по проекту для проверки всех упоминаний
- Убедиться, что не осталось "висящих" ссылок
- Проверить симметричность (Client ↔ Carrier)

### 5. Тестирование
```bash
npm run test:all
```

### 6. Отчет об изменениях
- Показать список всех измененных файлов
- Объяснить, что изменилось в каждом
- Дать инструкции по проверке

## Чеклист для разных типов изменений

### Добавление поля к сущности
- [ ] Model — добавить в схему
- [ ] View — добавить в форму
- [ ] Controller — добавить валидацию (если нужно)
- [ ] UI — добавить в таблицу/карточку
- [ ] Tests — обновить тесты

### Добавление справочника
- [ ] Model — создать модель
- [ ] dictionaryController — добавить seeding
- [ ] Order Model — добавить связь
- [ ] OrderFormView — добавить select
- [ ] dictionaryManager — загрузить данные
- [ ] orderManager — передать в форму

### Изменение API
- [ ] Routes — обновить маршрут
- [ ] Controller — обновить метод
- [ ] Frontend API — обновить URL
- [ ] Все вызовы — найти и обновить
- [ ] Tests — обновить тесты

## Карта зависимостей

### Order (Заказ)
```
Model: src/models/Order.js
Controller: src/controllers/orderController.js
Routes: src/routes/orderRoutes.js
View: public/js/views/OrderFormView.js
Manager: public/js/modules/orderManager.js
CRUD: public/js/modules/order/orderCRUD.js
UI: public/js/modules/order/orderUI.js
Handlers: public/js/modules/order/orderHandlers.js
Tests: tests/e2e/orders.spec.js
```

### Client/Carrier (симметричные)
```
Models: src/models/Client.js + Carrier.js
Base Controller: src/controllers/baseEntityController.js
Controllers: src/controllers/clientController.js + carrierController.js
Routes: src/routes/clientRoutes.js + carrierRoutes.js
View: public/js/views/CompanyFormView.js (общая)
Base Manager: public/js/modules/baseCompanyManager.js
Managers: public/js/modules/clientManager.js + carrierManager.js
Tests: tests/e2e/clients.spec.js + carriers.spec.js
```

### Contact (Контакт)
```
Model: src/models/Contact.js
Controller: src/controllers/contactController.js
Routes: src/routes/contactRoutes.js
View: public/js/views/ContactFormView.js
Manager: public/js/modules/contactManager.js
Submodules: public/js/modules/contact/*
Tests: tests/e2e/contacts.spec.js
```

## Примеры использования

### Пример 1: Добавить поле "containerNumber" к Order
```
Файлы:
1. src/models/Order.js — добавить поле
2. public/js/views/OrderFormView.js — добавить input
3. public/js/modules/order/orderUI.js — отобразить в списке
4. tests/e2e/orders.spec.js — проверить создание

Порядок: Model → View → UI → Tests
```

### Пример 2: Добавить справочник "CargoType"
```
Файлы:
1. src/models/CargoType.js — создать модель
2. src/controllers/dictionaryController.js — добавить seeding
3. src/models/Order.js — добавить связь
4. public/js/views/OrderFormView.js — добавить select
5. public/js/modules/dictionaryManager.js — загрузить
6. public/js/modules/orderManager.js — передать в форму

Порядок: Model → Dictionary → Order → View → Manager
```

## Проверка после изменений

1. Запустить сервер: `npm run dev`
2. Открыть приложение: http://localhost:3000
3. Проверить функционал вручную
4. Запустить тесты: `npm run test:all`
5. Проверить консоль браузера на ошибки
6. Проверить консоль сервера на ошибки

## Откат при проблемах

Если что-то пошло не так:
```bash
git status
git diff
git checkout -- <файл>  # откатить конкретный файл
git reset --hard HEAD   # откатить все изменения
```
