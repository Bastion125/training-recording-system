# 🔐 Конфігурація Render PostgreSQL

## 📋 Дані для підключення

**Internal Database URL:**
```
postgresql://sql_ns68_user:Gdj0QaXbuOr5qfPKbEiNo3pC8ERPr6E2@dpg-d5khtr75r7bs73a9nkog-a/sql_ns68
```

**Username:** `sql_ns68_user`  
**Password:** `Gdj0QaXbuOr5qfPKbEiNo3pC8ERPr6E2`  
**Database:** `sql_ns68`  
**Host:** `dpg-d5khtr75r7bs73a9nkog-a`

## ⚙️ Налаштування на Render

### Крок 1: Додати змінні оточення в Web Service

1. Відкрийте https://dashboard.render.com/
2. Перейдіть до вашого **Web Service** (`training-recording-backend`)
3. Перейдіть до розділу **Environment Variables**
4. Додайте або оновіть наступні змінні:

#### DATABASE_URL
- **Key:** `DATABASE_URL`
- **Value:** `postgresql://sql_ns68_user:Gdj0QaXbuOr5qfPKbEiNo3pC8ERPr6E2@dpg-d5khtr75r7bs73a9nkog-a/sql_ns68`
- Натисніть **Save Changes**

#### DIRECT_URL
- **Key:** `DIRECT_URL`
- **Value:** `postgresql://sql_ns68_user:Gdj0QaXbuOr5qfPKbEiNo3pC8ERPr6E2@dpg-d5khtr75r7bs73a9nkog-a/sql_ns68`
- ⚠️ **ВАЖЛИВО:** Той самий URL що й DATABASE_URL
- Натисніть **Save Changes**

#### Інші змінні (якщо ще не додано):
- **CORS_ORIGIN:** `https://bastion125.github.io`
- **NODE_ENV:** `production`
- **JWT_SECRET:** (згенеруйте через `openssl rand -base64 32`)

### Крок 2: Перезапустити деплой

1. Після додавання змінних натисніть **Manual Deploy**
2. Виберіть **Clear build cache & deploy**
3. Або просто натисніть **Deploy latest commit**

### Крок 3: Перевірка

Після деплою перевірте логи - має з'явитися:
```
✔ Generated Prisma Client
✔ Applied migration: 20260115130503_init
✔ Applied migration: 20260115140950_add_knowledge_tables
```

## 📋 Повний чеклист змінних оточення

Переконайтеся, що всі ці змінні встановлені:

- [x] `DATABASE_URL` = `postgresql://sql_ns68_user:Gdj0QaXbuOr5qfPKbEiNo3pC8ERPr6E2@dpg-d5khtr75r7bs73a9nkog-a/sql_ns68`
- [x] `DIRECT_URL` = `postgresql://sql_ns68_user:Gdj0QaXbuOr5qfPKbEiNo3pC8ERPr6E2@dpg-d5khtr75r7bs73a9nkog-a/sql_ns68`
- [ ] `CORS_ORIGIN` = `https://bastion125.github.io`
- [ ] `NODE_ENV` = `production`
- [ ] `JWT_SECRET` = (згенеруйте випадковий рядок)
- [ ] `PORT` = `10000` (опціонально)

## 🔍 Перевірка підключення

Після налаштування перевірте:

```bash
# Health check
curl https://ВАШ_URL.onrender.com/health

# Database health check
curl https://ВАШ_URL.onrender.com/api/health/db
```

## ⚠️ Важливі примітки

1. **Internal Database URL** - використовується для швидшого підключення всередині Render мережі
2. **DIRECT_URL** - обов'язковий для Prisma міграцій, має бути такий самий як DATABASE_URL
3. **Не публікуйте** ці дані в публічних репозиторіях
4. Якщо потрібно підключитися локально, використовуйте **External Database URL** з Render Dashboard

## 🔗 Корисні посилання

- Render Dashboard: https://dashboard.render.com/
- PostgreSQL сервіс: https://dashboard.render.com/web/[ваш-сервіс-id]
