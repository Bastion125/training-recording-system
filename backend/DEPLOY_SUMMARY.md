# Підсумок налаштування та інструкції для деплою

## ✅ Виконані налаштування

### 1. Локальна конфігурація
- ✅ `DATABASE_URL` налаштовано в `.env`
- ✅ `DIRECT_URL` налаштовано в `.env`
- ✅ Prisma Client згенеровано
- ✅ Prisma схема валідована
- ✅ Всі модулі перевірено та протестовано

### 2. Створені скрипти для тестування
- ✅ `scripts/test-db-config.js` - перевірка конфігурації БД
- ✅ `scripts/validate-setup.js` - комплексна перевірка налаштування
- ✅ `scripts/test-imports.js` - перевірка імпортів модулів
- ✅ `scripts/test-deployment.js` - тестування деплою на Railway
- ✅ `scripts/check-deployment.sh` - bash скрипт для перевірки деплою

## 🚀 Інструкції для деплою на Railway

### Поточний стан
- **Railway URL:** https://training-recording-system-production.up.railway.app
- **Проєкт:** protective-integrity
- **Сервіс:** training-recording-system
- **Статус:** ❌ Не задеплоєний (404 Application not found)

### Крок 1: Налаштування змінних оточення

**Через веб-інтерфейс Railway:**

1. Відкрийте https://railway.app
2. Увійдіть у проєкт `protective-integrity`
3. Виберіть сервіс `training-recording-system`
4. Перейдіть до **Variables** (або **Settings** → **Variables**)
5. Додайте/оновіть наступні змінні:

#### Обов'язкові змінні:

```
DATABASE_URL=postgresql://postgres:ASdeOUBlKPAvzYodpKVWVkIRbXzUghBI@postgres.railway.internal:5432/railway
```

```
DIRECT_URL=postgresql://postgres:ASdeOUBlKPAvzYodpKVWVkIRbXzUghBI@postgres.railway.internal:5432/railway
```

#### Рекомендовані змінні:

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

### Крок 2: Деплой проєкту

#### Варіант A: Через GitHub (рекомендовано)

1. Переконайтеся, що код закомічений у GitHub репозиторій
2. У Railway проєкті:
   - Перейдіть до **Settings** → **Source**
   - Підключіть GitHub репозиторій (якщо ще не підключено)
   - Виберіть папку `backend` як **Root Directory**
   - Збережіть зміни
3. Railway автоматично почне деплой при push до репозиторію
4. Або натисніть **Deploy** → **Redeploy** для ручного деплою

#### Варіант B: Через Railway Dashboard

1. У проєкті натисніть **Deploy** або **Redeploy**
2. Railway автоматично виконає:
   - `npm install`
   - `prisma generate` (через postinstall)
   - `npm run prisma:deploy` (міграції)
   - `npm start`

### Крок 3: Перевірка деплою

Після деплою перевірте стан:

#### Через скрипти:

```bash
# Node.js скрипт
cd backend
node scripts/test-deployment.js

# Або bash скрипт
./scripts/check-deployment.sh
```

#### Вручну через curl:

```bash
# Основний health check
curl https://training-recording-system-production.up.railway.app/health

# API health check
curl https://training-recording-system-production.up.railway.app/api/health

# Database health check
curl https://training-recording-system-production.up.railway.app/api/health/db
```

#### Через Railway Dashboard:

1. Перейдіть до **Deployments**
2. Виберіть останній деплой
3. Перевірте **Logs** на наявність помилок
4. Перевірте статус деплою (має бути "Active")

### Крок 4: Запуск тестів

Після успішного деплою та перевірки health checks:

```bash
cd backend
npm test
```

Або через Railway CLI (якщо доступно):

```bash
railway run npm test
```

## 🔍 Діагностика проблем

### Помилка: "Application not found" (404)

**Причини:**
- Проєкт не задеплоєний
- Сервіс не запущений
- Неправильний URL

**Рішення:**
1. Перевірте Railway Dashboard → Deployments
2. Переконайтеся, що останній деплой успішний
3. Перевірте логи на наявність помилок

### Помилка: "Database connection failed"

**Причини:**
- `DATABASE_URL` не налаштовано
- PostgreSQL сервіс не запущений
- Міграції не виконано

**Рішення:**
1. Перевірте змінну `DATABASE_URL` в Railway Variables
2. Переконайтеся, що PostgreSQL сервіс запущений
3. Перевірте логи деплою - міграції мають виконатися автоматично

### Помилка: "Can't reach database server"

**Причини:**
- Неправильний `DATABASE_URL`
- Internal Railway hostname не працює локально

**Рішення:**
- `postgres.railway.internal` працює тільки всередині Railway мережі
- Переконайтеся, що використовуєте правильний internal hostname
- Для локальної розробки використовуйте public connection string

## 📝 Оновлення frontend після деплою

Після успішного деплою оновіть URL в `frontend/app/scripts/api.js`:

```javascript
const RAILWAY_API_URL = 'https://training-recording-system-production.up.railway.app/api';
```

## 📚 Корисні команди

```bash
# Перевірка стану Railway проєкту
railway status

# Перегляд змінних оточення
railway variables

# Перегляд логів
railway logs

# Запуск команди на Railway
railway run <command>

# Тестування деплою
node scripts/test-deployment.js
./scripts/check-deployment.sh
```

## 🔗 Посилання

- Railway Dashboard: https://railway.app
- Проєкт: https://railway.app/project/protective-integrity
- Health Check: https://training-recording-system-production.up.railway.app/health
- DB Health Check: https://training-recording-system-production.up.railway.app/api/health/db

## ✅ Чеклист деплою

- [ ] Налаштовано `DATABASE_URL` в Railway Variables
- [ ] Налаштовано `DIRECT_URL` в Railway Variables
- [ ] Налаштовано інші змінні оточення (JWT_SECRET, NODE_ENV, CORS_ORIGIN)
- [ ] Проєкт задеплоєний через GitHub або Railway Dashboard
- [ ] Health check `/health` повертає 200
- [ ] API health check `/api/health` повертає 200
- [ ] Database health check `/api/health/db` повертає 200
- [ ] Тести пройдено успішно
- [ ] Frontend URL оновлено в `api.js`

## 📄 Додаткові документи

- `DEPLOY_INSTRUCTIONS.md` - детальні інструкції для деплою
- `TEST_REPORT.md` - звіт про локальне тестування
- `RAILWAY_SETUP_CHECKLIST.md` - чеклист налаштування Railway
