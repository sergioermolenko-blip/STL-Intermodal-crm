# 🌍 STL Intermodal CRM - Implementation Plan v2.1

## Концепция
**Международная мультимодальная CRM** для экспедитора:
- 🚛 Авто (FTL/LTL) | 🚂 ЖД | 🚢 Море (FCL/LCL) | ✈️ Авиа | 🔄 Мультимодал

**Документация:**
- Workflow: [SHIPMENT_WORKFLOW.md](./SHIPMENT_WORKFLOW.md)
- UI Design: [UI_DESIGN.md](./UI_DESIGN.md)

---

## 🖥️ UI Архитектура

### Master-Detail паттерн
1. **Список заказов** - таблица с фильтрами
2. **Карточка заказа** - детали + timeline статусов
3. **Wizard-форма** - создание/редактирование заказа

### Wizard-форма (5 секций)
| Секция | Поля |
|--------|------|
| Клиент | Компания, контакт, инкотермс |
| Маршрут | Откуда/куда, даты |
| Груз | Описание, вес, объём, DG, температура |
| Транспорт | Тип, требования |
| Финансы | Ставка, валюта |

---

## 🗄️ Модели базы данных

### CarrierQuote (Котировка от перевозчика)
```javascript
CarrierQuote {
  id, shipmentId, carrierId, carrierContactId
  transportMode, rate, currency, transitDays, validUntil
  status: ['requested','received','selected','rejected','expired']
  notes, routeDetails: JSON
}
```

### Proposal (КП для клиента)
```javascript
Proposal {
  id, shipmentId, proposalNumber
  clientId, clientContactId
  options: JSON, selectedOptionIndex
  totalRate, currency, margin, marginPercent
  status: ['draft','sent','approved','declined','expired']
  validUntil, sentAt, approvedAt, notes
}
```

### Shipment (обновлённый Order)
```javascript
Shipment {
  id, shipmentNumber
  status: [25+ статусов - см. SHIPMENT_WORKFLOW.md]
  transportMode: ['auto','rail','sea','air','multimodal','tbd']
  direction: ['import','export','domestic','transit']
  incoterms, incotermsPlace
  clientId, shipperId, consigneeId, notifyPartyId, billToId
  originCountry, originCity, originAddress
  destinationCountry, destinationCity, destinationAddress
  clientRate, clientCurrency, totalCost, margin
  estimatedPickup, estimatedDelivery, actualPickup, actualDelivery
}
```

---

## 📋 Фазы реализации

### Фаза 1: Статусы и основа (2-3 дня)
**Backend:**
- Добавить status, shipmentNumber, transportMode, direction в Order

**Frontend:**
- Цветной бейдж статуса в списке
- Timeline статусов в карточке
- Кнопки смены статуса

---

### Фаза 2: Wizard-форма (3-4 дня)
**Frontend:**
- Wizard с сайдбаром (5 секций)
- Сохранение черновика
- Валидация полей

**Backend:**
- API для создания/редактирования заказа

---

### Фаза 3: CarrierQuote (2-3 дня)
**Backend:**
- Модель CarrierQuote
- API CRUD

**Frontend:**
- UI запроса ставок
- Сравнение ставок
- Выбор перевозчика

---

### Фаза 4: Proposal/КП (2-3 дня)
**Backend:**
- Модель Proposal
- API CRUD

**Frontend:**
- UI создания КП
- Расчёт маржи
- Варианты (море vs авиа)

---

### Фаза 5: Мультимодал (3-4 дня)
- Модель ShipmentLeg
- UI добавления этапов

### Фаза 6: Груз (2 дня)
- Модель Cargo (INTTRA стандарт)

### Фаза 7: Контейнеры (2 дня)
- Модель Container

### Фаза 8: Таможня (2 дня)
- Модель CustomsClearance

### Фаза 9: Документы (3 дня)
- Модель ShipmentDocument, загрузка, PDF

### Фаза 10: Финансы (2 дня)
- Мультивалютность, P&L

---

## 🎯 Приоритет

**Начать с Фаз 1-4:**
1. Статусы → Видимость workflow
2. Wizard-форма → Удобное создание заказов
3. CarrierQuote → Работа с перевозчиками  
4. Proposal → Работа с клиентами
