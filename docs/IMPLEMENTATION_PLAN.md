# 🌍 STL Intermodal CRM - Implementation Plan v2.0

## Концепция
**Международная мультимодальная CRM** для экспедитора:
- 🚛 Авто (FTL/LTL) | 🚂 ЖД | 🚢 Море (FCL/LCL) | ✈️ Авиа | 🔄 Мультимодал

**Workflow:** см. [SHIPMENT_WORKFLOW.md](./SHIPMENT_WORKFLOW.md)

---

## 🗄️ Новые модели базы данных

### CarrierQuote (Котировка от перевозчика)
```javascript
CarrierQuote {
  id, shipmentId
  carrierId, carrierContactId
  
  transportMode: ENUM ['auto','rail','sea','air']
  rate: DECIMAL
  currency: STRING
  transitDays: INTEGER
  validUntil: DATE
  
  status: ENUM ['requested','received','selected','rejected','expired']
  notes: TEXT
  routeDetails: JSON
  createdAt, updatedAt
}
```

### Proposal (КП для клиента)
```javascript
Proposal {
  id, shipmentId
  proposalNumber: STRING  // "КП-2024-001234"
  
  clientId, clientContactId
  
  options: JSON  // [{name, rate, transitDays, carrierQuoteId}, ...]
  selectedOptionIndex: INTEGER
  
  totalRate: DECIMAL
  currency: STRING
  margin: DECIMAL
  marginPercent: DECIMAL
  
  status: ENUM ['draft','sent','approved','declined','expired']
  validUntil: DATE
  sentAt, approvedAt: DATETIME
  notes: TEXT
}
```

### Shipment (обновлённый)
```javascript
Shipment {
  id, shipmentNumber  // "STL-2024-001234"
  
  // Статусы (из SHIPMENT_WORKFLOW.md)
  status: ENUM [
    'draft','inquiry','carrier_quote','quotes_received',
    'proposal_draft','proposal_sent','client_approved',
    'booking','confirmed',
    'picked_up','export_customs','departed','in_transit',
    'arrived','import_customs','partial','delivered',
    'invoiced','paid','closed',
    'expired','declined','cancelled','hold','problem','returned','lost'
  ]
  
  transportMode: ENUM ['auto','rail','sea','air','multimodal','tbd']
  direction: ENUM ['import','export','domestic','transit']
  incoterms, incotermsPlace
  
  clientId, shipperId, consigneeId, notifyPartyId, billToId
  originCountry, originCity, originAddress
  destinationCountry, destinationCity, destinationAddress
  
  clientRate, clientCurrency, totalCost, margin
  estimatedPickup, estimatedDelivery, actualPickup, actualDelivery
  
  selectedCarrierQuoteId, selectedProposalId
}
```

---

## 📋 Фазы реализации

### Фаза 1: Статусы и основа (2-3 дня)
- Добавить status, shipmentNumber, transportMode, direction в Order
- UI: выбор статуса, цветной бейдж, кнопки смены

### Фаза 2: Работа с перевозчиками (2-3 дня)
- Модель CarrierQuote
- UI: запрос ставок, сравнение, выбор

### Фаза 3: КП для клиента (2-3 дня)
- Модель Proposal
- UI: создание КП, варианты, расчёт маржи

### Фаза 4: Мультимодал (3-4 дня)
- Модель ShipmentLeg
- UI добавления этапов

### Фаза 5: Груз (2 дня)
- Модель Cargo (INTTRA стандарт)

### Фаза 6: Контейнеры (2 дня)
- Модель Container

### Фаза 7: Таможня (2 дня)
- Модель CustomsClearance

### Фаза 8: Документы (3 дня)
- Модель ShipmentDocument, загрузка, PDF

### Фаза 9: Финансы (2 дня)
- Мультивалютность, P&L

---

## 🎯 Приоритет

**Начать с Фаз 1-3:**
1. Статусы → Видимость workflow
2. CarrierQuote → Работа с перевозчиками  
3. Proposal → Работа с клиентами
