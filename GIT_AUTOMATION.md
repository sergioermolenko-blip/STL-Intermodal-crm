# 🚀 Git Automation Guide

## ✅ Git установлен и настроен!

### 📝 Быстрые команды

#### Вариант 1: NPM скрипт (быстрый коммит)
```bash
npm run git:quick
```
Автоматически:
- Добавит все изменения (git add .)
- Сделает коммит с сообщением "Quick commit"
- Отправит в remote (git push)

#### Вариант 2: PowerShell скрипт (с кастомным сообщением)
```powershell
.\git-commit.ps1 "Your commit message here"
```

Пример:
```powershell
.\git-commit.ps1 "Added new feature"
```

#### Вариант 3: Классический git
После установки git доступен из командной строки:
```bash
git add .
git commit -m "Your message"
git push
```

---

## 🔧 Настройка (если еще не сделано)

### 1. Настроить пользователя Git
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 2. Настроить remote (если нужно)
```bash
git remote -v  # Проверить текущий remote
git remote add origin https://github.com/username/repo.git  # Добавить remote
```

### 3. Настроить аутентификацию GitHub
Используйте Personal Access Token:
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Выберите scopes: `repo`
4. Сохраните token

При первом push введите:
- Username: ваш GitHub username
- Password: ваш Personal Access Token

---

## 📚 Примеры использования

### Коммит текущей миграции
```bash
# Через NPM (быстро)
npm run git:quick

# Или через PowerShell скрипт (с описанием)
.\git-commit.ps1 "Migrated from MongoDB to SQLite - All 28 tests passing ✅"
```

### Проверить статус
```bash
git status
```

### Посмотреть изменения
```bash
git diff
```

### Посмотреть историю
```bash
git log --oneline
```

---

## 🎯 Рекомендованное сообщение для текущего коммита

```
Migrated from MongoDB to SQLite

- Backend: 17 files (7 models, 6 controllers, config, seed)
- Frontend: 9 files (Order/Contact structure, _id→id)  
- Testing: 28/28 E2E tests passing ✅
- Database: MongoDB → SQLite (57KB)

Changed files:
- Models: Client, Carrier, Contact, Order, VehicleBodyType, LoadingType, PackageType, index.js
- Controllers: baseEntityController, clientController, carrierController, contactController, orderController, dictionaryController
- Frontend: orderCRUD.js, orderUI.js, orderHandlers.js, OrderFormView.js, contactCRUD.js, ContactFormView.js, contactUI.js, CompanyFormView.js, baseCompanyManager.js, appState.js
- Config: package.json, db.js, server.js, seed.js, .env
```

---

## 💡 Советы

1. **git:quick** - для быстрых коммитов мелких изменений
2. **git-commit.ps1** - для важных коммитов с описанием
3. **Проверяйте изменения** перед коммитом: `git status`
4. **Коммитьте часто** - маленькие коммиты лучше больших
5. **Пишите понятные сообщения** - поможет в будущем

---

## 🔒 .gitignore

Убедитесь, что `.gitignore` содержит:
```
node_modules/
.env
database.sqlite
test-results/
playwright-report/
```

✅ .gitignore уже настроен правильно!
