# Виправлення помилки CORS 404 на Railway

## Проблема
```
Preflight response is not successful. Status code: 404
Fetch API cannot load https://training-recording-system-production.up.railway.app/api/auth/login
```

## Причини
1. **Railway сервіс не запущений** - найчастіша причина
2. **Неправильний URL** - перевірте фактичний Railway URL
3. **CORS не налаштований** - backend не обробляє OPTIONS запити
4. **Неправильні Environment Variables** - DATABASE_URL, CORS_ORIGIN

## Рішення

### 1. Перевірте Railway Service

#### Перевірка статусу:
1. Відкрийте Railway Dashboard
2. Перейдіть до вашого Backend Service
3. Перевірте **Deployments** - останній deployment має бути успішним (зелена галочка)
4. Перевірте **Logs** - мають бути повідомлення про запуск сервера

#### Перевірка URL:
1. Railway Dashboard → Backend Service → Settings → Networking
2. Скопіюйте **Public Domain** (наприклад: `https://your-service.up.railway.app`)
3. Перевірте в браузері:
   ```
   https://your-service.up.railway.app/
   https://your-service.up.railway.app/api/health
   ```
4. Очікувана відповідь:
   ```json
   {
     "success": true,
     "message": "Training Recording System API",
     "version": "1.0.0"
   }
   ```

### 2. Оновіть Environment Variables в Railway

#### Обов'язкові змінні:
1. **DATABASE_URL** (НЕ MYSQL_PUBLIC_URL!)
   - Railway Dashboard → MySQL Service → Variables
   - Скопіюйте `DATABASE_URL` (не `MYSQL_PUBLIC_URL`)
   - Вставте в Backend Service → Variables

2. **JWT_SECRET**
   - Створіть надійний ключ (мінімум 32 символи)
   - Наприклад: `openssl rand -base64 32`

3. **NODE_ENV**
   - Значення: `production`

4. **CORS_ORIGIN**
   - Для GitHub Pages: `https://bastion125.github.io`
   - Або для локальної розробки: `http://localhost:8080,http://localhost:3000`
   - Можна вказати кілька через кому: `https://bastion125.github.io,http://localhost:8080`

### 3. Оновіть Frontend API URL

Якщо ваш Railway URL відрібняється від `training-recording-system-production.up.railway.app`:

1. Відкрийте `frontend/app/scripts/api.js`
2. Знайдіть рядок:
   ```javascript
   const RAILWAY_API_URL = 'https://training-recording-system-production.up.railway.app/api';
   ```
3. Замініть на ваш фактичний Railway URL:
   ```javascript
   const RAILWAY_API_URL = 'https://your-actual-railway-url.up.railway.app/api';
   ```

### 4. Перезапустіть Railway Service

Після зміни Environment Variables:

1. Railway Dashboard → Backend Service → Settings
2. Натисніть **Redeploy** або **Restart**
3. Дочекайтеся завершення деплою (1-2 хвилини)

### 5. Перевірка в браузері

Відкрийте консоль браузера (F12) та перевірте:

1. **Network tab** - перевірте запити до Railway
2. **Console** - перевірте помилки
3. Спробуйте відкрити Railway URL напряму:
   ```
   https://your-railway-url.up.railway.app/api/health
   ```

### 6. Типові помилки

#### "Cannot find module"
**Рішення:** 
- Railway Shell → `npm install`
- Перевірте, що `postinstall` script виконується

#### "Error: connect ECONNREFUSED"
**Рішення:**
- Перевірте `DATABASE_URL` (не `MYSQL_PUBLIC_URL`)
- Переконайтеся, що MySQL service запущений

#### "404 Not Found" на всіх запитах
**Рішення:**
- Перевірте Root Directory: має бути `backend`
- Перевірте Start Command: має бути `npm start` або порожній
- Перевірте логи Railway на помилки

#### CORS помилки після виправлення 404
**Рішення:**
- Переконайтеся, що `CORS_ORIGIN` встановлено правильно
- Додайте ваш GitHub Pages URL: `https://bastion125.github.io`
- Перезапустіть Railway service

### 7. Тестування після виправлення

1. Відкрийте https://bastion125.github.io/training-recording-system/
2. Спробуйте увійти:
   - Email: `admin@test.local`
   - Password: `Admin123!`
3. Перевірте консоль браузера - не має бути CORS помилок

## Швидка перевірка Railway

Виконайте в Railway Shell:

```bash
# Перевірка змінних оточення
env | grep -E "DATABASE_URL|JWT_SECRET|NODE_ENV|CORS_ORIGIN|PORT"

# Перевірка запуску сервера
npm start

# Перевірка підключення до БД
npm run prisma:studio
```

## Контакт

Якщо проблема не вирішена:
1. Перевірте логи Railway (Deployments → Logs)
2. Перевірте Network tab в браузері
3. Переконайтеся, що всі Environment Variables встановлені правильно
