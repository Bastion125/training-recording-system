# Налаштування Environment Variables на Railway

## Обов'язкові змінні середовища

Скопіюйте ці значення в Railway Dashboard → Backend Service → Variables:

### 1. DATABASE_URL
```
mysql://root:JUanFPDzOHTBstokDHwZTuUBVYeZXnrY@mysql.railway.internal:3306/railway
```

**Важливо:** Використовуйте `DATABASE_URL`, а НЕ `MYSQL_PUBLIC_URL`!

### 2. JWT_SECRET
```
YOUR_GENERATED_SECRET_HERE
```

**Генерація надійного ключа:**
```bash
openssl rand -base64 32
```

Або використайте один з цих (мінімум 32 символи):
- `Tr4iningR3c0rd1ngSyst3m2024!@#SecureKey`
- `Bastion125TrainingSystemJWTSecretKey2024!`
- `MySecureJWTSecretForTrainingRecordingSystem2024`

**⚠️ НЕ використовуйте ці приклади в production!** Згенеруйте свій унікальний ключ.

### 3. NODE_ENV
```
production
```

### 4. CORS_ORIGIN
```
https://bastion125.github.io/training-recording-system/
```

**Альтернативно** (якщо потрібно додати локальну розробку):
```
https://bastion125.github.io/training-recording-system/,http://localhost:8080,http://localhost:3000
```

## Інструкція по налаштуванню

### Крок 1: Відкрийте Railway Dashboard
1. Перейдіть на https://railway.com/
2. Увійдіть в свій акаунт
3. Виберіть проєкт з вашим Backend Service

### Крок 2: Додайте Environment Variables
1. Railway Dashboard → Backend Service → Variables
2. Натисніть **"New Variable"** для кожної змінної
3. Додайте всі 4 змінні (DATABASE_URL, JWT_SECRET, NODE_ENV, CORS_ORIGIN)

### Крок 3: Перевірте налаштування
1. Переконайтеся, що:
   - **Root Directory** = `backend`
   - **Start Command** = `npm start` (або порожній)
2. Settings → Networking → переконайтеся, що домен згенеровано

### Крок 4: Перезапустіть сервіс
1. Settings → **Redeploy** або **Restart**
2. Дочекайтеся завершення деплою (1-2 хвилини)

### Крок 5: Перевірка
1. Відкрийте Railway URL: `https://your-service.up.railway.app/api/health`
2. Має повернутися:
   ```json
   {
     "success": true,
     "message": "Server is running",
     "timestamp": "..."
   }
   ```

## Перевірка після налаштування

### Тест 1: Health Check
```bash
curl https://your-railway-url.up.railway.app/api/health
```

### Тест 2: Root Endpoint
```bash
curl https://your-railway-url.up.railway.app/
```

### Тест 3: Frontend підключення
1. Відкрийте https://bastion125.github.io/training-recording-system/
2. Спробуйте увійти
3. Перевірте консоль браузера (F12) - не має бути CORS помилок

## Типові помилки

### "Error: connect ECONNREFUSED"
**Причина:** Неправильний DATABASE_URL або MySQL service не запущений
**Рішення:** 
- Перевірте, що використовуєте `DATABASE_URL`, а не `MYSQL_PUBLIC_URL`
- Переконайтеся, що MySQL service запущений

### "CORS policy: No 'Access-Control-Allow-Origin'"
**Причина:** Неправильний CORS_ORIGIN
**Рішення:**
- Перевірте, що CORS_ORIGIN точно відповідає URL вашого сайту
- Переконайтеся, що немає зайвих пробілів
- Перезапустіть Railway service

### "404 Not Found" на всіх запитах
**Причина:** Сервіс не запущений або неправильний Root Directory
**Рішення:**
- Перевірте Root Directory = `backend`
- Перевірте логи Railway на помилки
- Переконайтеся, що `npm start` працює

## Безпека

⚠️ **НЕ комітьте JWT_SECRET в git!**
- JWT_SECRET має бути тільки в Railway Environment Variables
- Не додавайте `.env` файли в git
- Використовуйте різні JWT_SECRET для development та production

## Після налаштування

1. Запустіть міграції:
   ```bash
   Railway Shell → npm run prisma:deploy
   Railway Shell → npm run prisma:seed
   ```

2. Перевірте створення адміна:
   - Email: `admin@test.local`
   - Password: `Admin123!`

3. Протестуйте вхід на https://bastion125.github.io/training-recording-system/
