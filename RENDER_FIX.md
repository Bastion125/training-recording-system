# 🔧 Виправлення помилки: DIRECT_URL not found

## ❌ Помилка

```
Error: Environment variable not found: DIRECT_URL.
```

## ✅ Рішення

### Швидке виправлення:

1. **Відкрийте Render Dashboard:** https://dashboard.render.com/
2. **Перейдіть до вашого Web Service** (`training-recording-backend`)
3. **Перейдіть до розділу Environment Variables**
4. **Додайте змінну `DIRECT_URL`:**
   - Натисніть **Add Environment Variable**
   - **Key:** `DIRECT_URL`
   - **Value:** Вставте той самий Internal Database URL, що й для `DATABASE_URL`
   - Натисніть **Save Changes**

5. **Перевірте, що `DATABASE_URL` також встановлено:**
   - Якщо немає - додайте також `DATABASE_URL` з Internal Database URL

6. **Перезапустіть деплой:**
   - Перейдіть до **Manual Deploy** → **Clear build cache & deploy**

### Як отримати Internal Database URL:

1. У Render Dashboard перейдіть до вашого PostgreSQL сервісу
2. Перейдіть до розділу **Connections**
3. Знайдіть **Internal Database URL**
4. Скопіюйте повний URL (виглядає як: `postgresql://user:password@host:port/database`)

### Приклад:

Якщо ваш `DATABASE_URL`:
```
postgresql://training_user:password123@dpg-xxxxx-a.oregon-postgres.render.com/training_recording
```

То `DIRECT_URL` має бути **такий самий**:
```
postgresql://training_user:password123@dpg-xxxxx-a.oregon-postgres.render.com/training_recording
```

## 📋 Чеклист змінних оточення

Переконайтеся, що всі ці змінні встановлені:

- [ ] `DATABASE_URL` - Internal Database URL
- [ ] `DIRECT_URL` - Internal Database URL (такий самий)
- [ ] `JWT_SECRET` - випадковий рядок
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000` (опціонально)
- [ ] `CORS_ORIGIN` = `https://bastion125.github.io`

## ✅ Після виправлення

Після додавання `DIRECT_URL` та перезапуску деплою, він має пройти успішно.

Перевірте логи - має з'явитися:
```
✔ Generated Prisma Client
✔ Applied migration: 20260115130503_init
✔ Applied migration: 20260115140950_add_knowledge_tables
```
