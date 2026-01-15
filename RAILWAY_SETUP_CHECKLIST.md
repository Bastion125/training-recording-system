# Чеклист налаштування Railway Backend

## ✅ Поточний стан налаштувань

### Frontend (api.js)
- ✅ Railway API URL налаштовано: `https://training-recording-system-production.up.railway.app/api`
- ✅ Локальна БД вимкнена за замовчуванням (`USE_LOCAL_DB = false`)

### Backend (server.js)
- ✅ CORS налаштовано з `https://bastion125.github.io` в defaultOrigins
- ✅ Health check endpoints налаштовані (`/health`, `/api/health`, `/api/health/db`)

### Railway конфігурація
- ✅ `railway.json` налаштовано з командою деплою: `npm run prisma:deploy && npm start`
- ✅ Health check path: `/health`

## 📋 Чеклист для деплою на Railway

### Крок 1: Створення проекту на Railway
- [ ] Зайти на [railway.app](https://railway.app)
- [ ] Створити новий проект
- [ ] Підключити GitHub репозиторій
- [ ] Вибрати папку `backend` як root директорію

### Крок 2: Додавання PostgreSQL бази даних
- [ ] У проекті Railway натиснути "New" → "Database" → "Add PostgreSQL"
- [ ] Railway автоматично створить змінну `DATABASE_URL`
- [ ] Створити `DIRECT_URL` (копія `DATABASE_URL`)

### Крок 3: Налаштування змінних оточення
Додати в налаштуваннях сервісу:
- [ ] `DATABASE_URL` (автоматично з PostgreSQL)
- [ ] `DIRECT_URL` (копія `DATABASE_URL`)
- [ ] `JWT_SECRET` (випадковий рядок: `openssl rand -base64 32`)
- [ ] `NODE_ENV=production`
- [ ] `CORS_ORIGIN=https://bastion125.github.io` (або ваш GitHub Pages URL)
- [ ] `PORT=3000` (Railway автоматично призначить порт)

### Крок 4: Отримання URL сервісу
- [ ] У налаштуваннях сервісу перейти до "Networking"
- [ ] Скопіювати "Public Domain" (наприклад: `training-recording-production.up.railway.app`)
- [ ] Оновити `RAILWAY_API_URL` в `github/frontend/app/scripts/api.js` якщо URL змінився

### Крок 5: Перевірка міграцій
- [ ] Railway автоматично виконає `npm install` та `prisma generate`
- [ ] Міграції виконаються автоматично через `npm run prisma:deploy` в `railway.json`
- [ ] Або виконати вручну через Railway CLI:
  ```bash
  railway run npm run prisma:deploy
  ```

### Крок 6: Тестування підключення
- [ ] Перевірити health check: `https://ВАШ_RAILWAY_DOMAIN.up.railway.app/health`
- [ ] Перевірити DB health: `https://ВАШ_RAILWAY_DOMAIN.up.railway.app/api/health/db`
- [ ] Відкрити сайт на GitHub Pages та перевірити консоль браузера на помилки

## 🔍 Діагностика проблем

### CORS помилки
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```
**Рішення:** Перевірити налаштування CORS в `server.js` та змінну `CORS_ORIGIN` на Railway

### 404 помилки
```
Failed to fetch
```
**Рішення:** Перевірити правильність URL API в `api.js`

### 500 помилки (Database connection failed)
```
Database connection failed
```
**Рішення:** Перевірити `DATABASE_URL` на Railway та виконати міграції

## 📝 Корисні команди для діагностики

```bash
# Перевірка Railway логів
railway logs

# Перевірка змінних оточення
railway variables

# Тест підключення до БД локально
cd backend
npm run prisma:studio
```

## 🔄 Оновлення Railway URL

Якщо Railway URL змінився, оновіть файл `github/frontend/app/scripts/api.js`:

```javascript
// Рядок 48
const RAILWAY_API_URL = 'https://НОВИЙ_RAILWAY_DOMAIN.up.railway.app/api';
```

## 📚 Додаткова інформація

Детальна інструкція: див. `рішення_проблеми_підключення_до_бд_з_github_pages_e501100c.plan.md`
