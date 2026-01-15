# Інструкції для деплою на Railway

## 📋 Інформація про проєкт

- **Railway URL:** https://training-recording-system-production.up.railway.app
- **Проєкт:** protective-integrity
- **Сервіс:** training-recording-system
- **Environment:** production

## 🔧 Крок 1: Налаштування змінних оточення

Через веб-інтерфейс Railway (https://railway.app):

1. Відкрийте проєкт `protective-integrity`
2. Виберіть сервіс `training-recording-system`
3. Перейдіть до **Variables** (Змінні оточення)
4. Додайте/оновіть наступні змінні:

### Обов'язкові змінні:

```
DATABASE_URL=postgresql://postgres:ASdeOUBlKPAvzYodpKVWVkIRbXzUghBI@postgres.railway.internal:5432/railway
```

```
DIRECT_URL=postgresql://postgres:ASdeOUBlKPAvzYodpKVWVkIRbXzUghBI@postgres.railway.internal:5432/railway
```

### Додаткові змінні (якщо потрібно):

```
JWT_SECRET=<згенеруйте через: openssl rand -base64 32>
```

```
NODE_ENV=production
```

```
CORS_ORIGIN=https://bastion125.github.io
```

```
PORT=3000
```

## 🚀 Крок 2: Деплой проєкту

### Варіант A: Через GitHub (рекомендовано)

1. Переконайтеся, що код закомічений у GitHub репозиторій
2. У Railway проєкті перейдіть до **Settings** → **Source**
3. Підключіть GitHub репозиторій (якщо ще не підключено)
4. Виберіть папку `backend` як **Root Directory**
5. Railway автоматично почне деплой при push до репозиторію

### Варіант B: Через Railway Dashboard

1. У проєкті натисніть **Deploy** або **Redeploy**
2. Railway автоматично виконає:
   - `npm install`
   - `prisma generate`
   - `npm run prisma:deploy` (міграції)
   - `npm start`

## ✅ Крок 3: Перевірка деплою

Після деплою перевірте:

1. **Health check:**
   ```bash
   curl https://training-recording-system-production.up.railway.app/health
   ```

2. **Database health check:**
   ```bash
   curl https://training-recording-system-production.up.railway.app/api/health/db
   ```

3. **Перевірка логів:**
   - У Railway Dashboard → **Deployments** → виберіть останній деплой → **View Logs**

## 🧪 Крок 4: Запуск тестів

Після успішного деплою запустіть тести:

```bash
cd backend
npm test
```

Або через Railway CLI (якщо доступно):

```bash
railway run npm test
```

## 🔍 Діагностика проблем

### Помилка підключення до БД

Перевірте:
- `DATABASE_URL` встановлено правильно
- PostgreSQL сервіс запущений на Railway
- Міграції виконані (`prisma migrate deploy`)

### 404 помилки

Перевірте:
- Правильний URL в `frontend/app/scripts/api.js`
- CORS налаштовано правильно

### Помилки міграцій

Перевірте логи деплою:
- Міграції виконуються через `npm run prisma:deploy` в `railway.json`
- Переконайтеся, що `DIRECT_URL` встановлено

## 📝 Оновлення frontend URL

Після успішного деплою оновіть URL в `frontend/app/scripts/api.js`:

```javascript
const RAILWAY_API_URL = 'https://training-recording-system-production.up.railway.app/api';
```

## 🔗 Корисні посилання

- Railway Dashboard: https://railway.app
- Проєкт: https://railway.app/project/protective-integrity
- Health Check: https://training-recording-system-production.up.railway.app/health
- DB Health Check: https://training-recording-system-production.up.railway.app/api/health/db
