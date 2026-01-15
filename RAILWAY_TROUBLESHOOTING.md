# Railway Troubleshooting Guide

## Помилка "Not Found - The train has not arrived at the station"

Ця помилка означає, що Railway не може досягти вашого сервісу. Ось кроки для діагностики:

### 1. Перевірте налаштування Railway Service

#### Root Directory
- Відкрийте Railway Dashboard → Ваш Backend Service → Settings
- Переконайтеся, що **Root Directory** встановлено: `backend`
- Якщо ні, встановіть та збережіть

#### Start Command
- Переконайтеся, що **Start Command** встановлено: `npm start`
- Або залиште порожнім (Railway автоматично використає `npm start` з package.json)

### 2. Перевірте Environment Variables

Відкрийте Railway Dashboard → Ваш Backend Service → Variables

**Обов'язкові змінні:**
- `DATABASE_URL` - має бути з MySQL service (формат: `mysql://user:password@host:port/database`)
- `JWT_SECRET` - надійний ключ (мінімум 32 символи)
- `NODE_ENV=production`
- `PORT` - Railway встановить автоматично (не потрібно встановлювати вручну)

**Як отримати DATABASE_URL:**
1. Railway Dashboard → Ваш MySQL Service → Variables
2. Скопіюйте `DATABASE_URL`
3. Вставте в Backend Service → Variables

### 3. Перевірте логи Railway

1. Railway Dashboard → Ваш Backend Service → Deployments
2. Відкрийте останній deployment
3. Перевірте логи на наявність помилок:

**Типові помилки:**
- `Error: Cannot find module` - не встановлені залежності
- `Error: connect ECONNREFUSED` - проблема з DATABASE_URL
- `Port already in use` - конфлікт портів

### 4. Перевірте Build Logs

1. Railway Dashboard → Ваш Backend Service → Deployments
2. Відкрийте Build Logs
3. Переконайтеся, що:
   - `npm install` виконався успішно
   - `prisma generate` виконався успішно (через postinstall script)
   - Немає помилок компіляції

### 5. Перевірте Health Check

Railway використовує `/api/health` для перевірки здоров'я сервісу.

Перевірте вручну:
```bash
curl https://your-railway-url.up.railway.app/api/health
```

Або відкрийте в браузері:
```
https://your-railway-url.up.railway.app/
```

Очікувана відповідь:
```json
{
  "success": true,
  "message": "Training Recording System API",
  "version": "1.0.0",
  "timestamp": "..."
}
```

### 6. Запустіть міграції вручну

Якщо сервер запускається, але не працює:

1. Railway Dashboard → Ваш Backend Service → Connect → Open Shell
2. Виконайте:
```bash
npm run prisma:deploy
npm run prisma:seed
```

### 7. Перевірте Networking

1. Railway Dashboard → Ваш Backend Service → Settings → Networking
2. Переконайтеся, що домен згенеровано:
   - Натисніть "Generate Domain" якщо домену немає
3. Скопіюйте URL (наприклад: `https://training-recording-production.up.railway.app`)

### 8. Типові проблеми та рішення

#### Проблема: "Cannot find module '@prisma/client'"
**Рішення:** 
- Переконайтеся, що `postinstall` script виконується
- В Railway Shell виконайте: `npm run prisma:generate`

#### Проблема: "Error: connect ECONNREFUSED"
**Рішення:**
- Перевірте DATABASE_URL
- Переконайтеся, що MySQL service запущений
- Перевірте, що DATABASE_URL має правильний формат

#### Проблема: "Port 3000 already in use"
**Рішення:**
- Railway автоматично встановлює PORT через змінну оточення
- Не встановлюйте PORT вручну
- Переконайтеся, що server.js використовує `process.env.PORT`

#### Проблема: Сервер запускається, але не відповідає
**Рішення:**
- Переконайтеся, що server.js слухає на `0.0.0.0` (не `localhost`)
- Перевірте, що всі роути правильно підключені
- Перевірте логи на помилки при обробці запитів

### 9. Перезапуск сервісу

Якщо нічого не допомагає:

1. Railway Dashboard → Ваш Backend Service → Settings
2. Натисніть "Redeploy" або "Restart"
3. Дочекайтеся завершення деплою

### 10. Контакт підтримки Railway

Якщо проблема не вирішена:
- Railway Dashboard → Support
- Надайте Request ID з помилки
- Додайте логи з Deployments

---

## Швидка перевірка

Виконайте ці команди в Railway Shell для діагностики:

```bash
# Перевірка Node.js версії
node --version

# Перевірка npm версії
npm --version

# Перевірка наявності файлів
ls -la
ls -la server.js

# Перевірка змінних оточення (без значень)
env | grep -E "DATABASE_URL|JWT_SECRET|NODE_ENV|PORT"

# Тестовий запуск сервера
npm start
```

Якщо `npm start` працює локально в Shell, але не працює через Railway, проблема в налаштуваннях Railway (Root Directory, Start Command, або Networking).
