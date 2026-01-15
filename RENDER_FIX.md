# 🔧 Виправлення помилок деплою на Render

## ❌ Помилка 1: DIRECT_URL not found

```
Error: Environment variable not found: DIRECT_URL.
```

## ❌ Помилка 2: Can't reach database server at postgres.railway.internal

```
Error: P1001: Can't reach database server at `postgres.railway.internal:5432`
```

**Це означає, що ви використовуєте старий Railway URL замість Render Database URL!**

## ✅ Рішення

### Швидке виправлення:

1. **Відкрийте Render Dashboard:** https://dashboard.render.com/
2. **Перейдіть до вашого Web Service** (`training-recording-backend`)
3. **Перейдіть до розділу Environment Variables**

4. **⚠️ ВИДАЛІТЬ старі Railway змінні (якщо є):**
   - Знайдіть `DATABASE_URL` зі значенням `postgres.railway.internal`
   - Видаліть його (натисніть на іконку корзини)
   - Також видаліть `DIRECT_URL` якщо він містить Railway URL

5. **Отримайте Render Database URL:**
   - Перейдіть до вашого PostgreSQL сервісу в Render
   - У розділі **Connections** знайдіть **Internal Database URL**
   - Скопіюйте повний URL (виглядає як: `postgresql://user:password@dpg-xxxxx-a.oregon-postgres.render.com/database`)

6. **Додайте правильні змінні:**
   - Натисніть **Add Environment Variable**
   - **Key:** `DATABASE_URL`
   - **Value:** Вставте Render Internal Database URL
   - Натисніть **Save Changes**
   
   - Натисніть **Add Environment Variable** знову
   - **Key:** `DIRECT_URL`
   - **Value:** Вставте той самий Render Internal Database URL
   - Натисніть **Save Changes**

7. **Перезапустіть деплой:**
   - Перейдіть до **Manual Deploy** → **Clear build cache & deploy**
   - Або просто натисніть **Deploy latest commit**

### Як отримати Render Internal Database URL:

1. У Render Dashboard перейдіть до вашого PostgreSQL сервісу
2. Перейдіть до розділу **Connections**
3. Знайдіть **Internal Database URL** (НЕ External!)
4. Скопіюйте повний URL

### ⚠️ ВАЖЛИВО: Використовуйте Render URL, НЕ Railway!

**НЕПРАВИЛЬНО (Railway - не працює на Render):**
```
postgresql://postgres:password@postgres.railway.internal:5432/railway
```

**ПРАВИЛЬНО (Render Database URL):**
```
postgresql://training_user:password123@dpg-xxxxx-a.oregon-postgres.render.com/training_recording
```

### Приклад правильних значень:

Якщо ваш Render Internal Database URL:
```
postgresql://training_user:password123@dpg-xxxxx-a.oregon-postgres.render.com/training_recording
```

То обидві змінні мають бути **такі самі**:
- `DATABASE_URL` = `postgresql://training_user:password123@dpg-xxxxx-a.oregon-postgres.render.com/training_recording`
- `DIRECT_URL` = `postgresql://training_user:password123@dpg-xxxxx-a.oregon-postgres.render.com/training_recording`

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
