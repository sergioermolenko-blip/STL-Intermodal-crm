---
description: Полный жизненный цикл заказа (Shipment) для международного экспедитора
---

# Shipment Workflow

Полный жизненный цикл заказа для международного экспедитора.

**Связанные документы:**
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) - План реализации
- [UI_DESIGN.md](./UI_DESIGN.md) - UI дизайн

## Этапы workflow

### Этап 1: Работа с клиентом
- Получение запроса от клиента
- Уточнение деталей (маршрут, груз, сроки)
- Создание заказа в статусе `inquiry`

### Этап 2: Работа с перевозчиками
- Запрос ставок у перевозчиков (`carrier_quote`)
- Получение и сравнение ставок (`quotes_received`)
- Выбор лучшего варианта

### Этап 3: Коммерческое предложение
- Подготовка КП с расчётом маржи (`proposal_draft`)
- Отправка КП клиенту (`proposal_sent`)
- Ожидание подтверждения

### Этап 4: Подтверждение и бронирование
- Клиент подтвердил КП (`client_approved`)
- Бронирование транспорта (`booking`)
- Перевозчик подтвердил (`confirmed`)

### Этап 5: Исполнение перевозки
- Груз забран (`picked_up`)
- Экспортная таможня (`export_customs`)
- Отправлен (`departed`)
- В пути (`in_transit`)
- Прибыл (`arrived`)
- Импортная таможня (`import_customs`)
- Доставлен (`delivered`)

### Этап 6: Финансовое закрытие
- Счёт выставлен (`invoiced`)
- Клиент оплатил (`paid`)
- Заказ закрыт (`closed`)

## Статусы заказа

### До подтверждения
| Статус | Код | Описание |
|--------|-----|----------|
| Черновик | `draft` | Неполный заказ |
| Запрос | `inquiry` | Получен запрос от клиента |
| Запрос ставок | `carrier_quote` | Запросили ставки |
| Ставки получены | `quotes_received` | Получили ответы |
| Подготовка КП | `proposal_draft` | Готовим КП |
| КП отправлено | `proposal_sent` | КП отправлено клиенту |
| Клиент одобрил | `client_approved` | Клиент подтвердил КП |

### Бронирование
| Статус | Код | Описание |
|--------|-----|----------|
| Букинг | `booking` | Бронируем транспорт |
| Подтверждён | `confirmed` | Перевозчик подтвердил |

### Исполнение
| Статус | Код | Описание |
|--------|-----|----------|
| Забран | `picked_up` | Груз забран |
| Экспорт таможня | `export_customs` | Экспортная таможня |
| Отправлен | `departed` | Покинул страну отправления |
| В пути | `in_transit` | Международный транзит |
| Прибыл | `arrived` | Прибыл в страну назначения |
| Импорт таможня | `import_customs` | Импортная таможня |
| Частично | `partial` | Часть груза доставлена |
| Доставлен | `delivered` | Весь груз доставлен |

### Финансы
| Статус | Код | Описание |
|--------|-----|----------|
| Счёт выставлен | `invoiced` | Счёт отправлен клиенту |
| Оплачен | `paid` | Клиент оплатил |
| Закрыт | `closed` | Заказ завершён |

### Исключения
| Статус | Код | Описание |
|--------|-----|----------|
| Истёк | `expired` | КП не принято вовремя |
| Отклонён | `declined` | Клиент отклонил КП |
| Отменён | `cancelled` | Заказ отменён |
| Приостановлен | `hold` | Временно приостановлен |
| Проблема | `problem` | Требует внимания |
| Возврат | `returned` | Груз возвращён |
| Утерян | `lost` | Груз утерян |

## Edge Cases

### 1. Неполный заказ
Клиент не знает деталей → создаём `draft`, заполняем частично.

### 2. Неизвестный транспорт
Клиент не знает какой транспорт лучше → `transportMode = tbd`.

### 3. Несколько ставок
Запрашиваем у 3-5 перевозчиков → выбираем лучшую.

### 4. Несколько вариантов КП
Предлагаем: море (дешевле) vs авиа (быстрее).

### 5. Частичная доставка
Часть груза доставлена → статус `partial`.

### 6. Изменение после подтверждения
Клиент хочет изменить → Amendment, повторное подтверждение.

### 7. Отмена на любом этапе
Всегда можно перейти в `cancelled` или `hold`.

## Переходы статусов

```javascript
const allowedTransitions = {
  'draft':           ['inquiry', 'cancelled'],
  'inquiry':         ['carrier_quote', 'cancelled'],
  'carrier_quote':   ['quotes_received', 'cancelled'],
  'quotes_received': ['proposal_draft', 'cancelled'],
  'proposal_draft':  ['proposal_sent', 'cancelled'],
  'proposal_sent':   ['client_approved', 'declined', 'expired'],
  'client_approved': ['booking', 'cancelled'],
  'booking':         ['confirmed', 'cancelled'],
  'confirmed':       ['picked_up', 'cancelled', 'hold'],
  'picked_up':       ['export_customs', 'departed', 'in_transit'],
  'export_customs':  ['departed', 'hold', 'problem'],
  'departed':        ['in_transit'],
  'in_transit':      ['arrived', 'hold', 'problem'],
  'arrived':         ['import_customs', 'delivered'],
  'import_customs':  ['delivered', 'partial', 'hold', 'problem'],
  'partial':         ['delivered', 'hold'],
  'delivered':       ['invoiced', 'closed'],
  'invoiced':        ['paid'],
  'paid':            ['closed'],
  'hold':            ['*previous*', 'cancelled'],
  'problem':         ['*previous*', 'cancelled', 'returned', 'lost']
};
```

## Цвета статусов (CSS)

```css
.status-draft           { background: #9E9E9E; }
.status-inquiry         { background: #2196F3; }
.status-carrier_quote   { background: #03A9F4; }
.status-quotes_received { background: #00BCD4; }
.status-proposal_draft  { background: #009688; }
.status-proposal_sent   { background: #FF9800; }
.status-client_approved { background: #8BC34A; }
.status-booking         { background: #CDDC39; }
.status-confirmed       { background: #4CAF50; }
.status-picked_up       { background: #4CAF50; }
.status-in_transit      { background: #3F51B5; }
.status-delivered       { background: #4CAF50; }
.status-invoiced        { background: #FFC107; }
.status-paid            { background: #8BC34A; }
.status-closed          { background: #607D8B; }
.status-cancelled       { background: #F44336; }
.status-problem         { background: #F44336; }
```
