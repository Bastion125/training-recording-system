# Налаштування локальної PostgreSQL бази даних

## 📋 Дані для підключення

Після виконання налаштування використовуйте:

- **Database:** `training_recording_local`
- **User:** `training_user`
- **Password:** `Training123!@#`
- **Host:** `localhost`
- **Port:** `5432`

**Connection String:**
```
postgresql://training_user:Training123!@#@localhost:5432/training_recording_local
```

## 🚀 Швидке налаштування

### Варіант 1: Через psql (якщо знаєте пароль postgres користувача)

```bash
cd backend
/opt/homebrew/opt/postgresql@15/bin/psql -d postgres -f scripts/setup-local-db.sql
```

### Варіант 2: Через createdb та createuser

```bash
# Створення користувача
/opt/homebrew/opt/postgresql@15/bin/createuser -s training_user

# Встановлення паролю
/opt/homebrew/opt/postgresql@15/bin/psql -d postgres -c "ALTER USER training_user WITH PASSWORD 'Training123!@#';"

# Створення бази даних
/opt/homebrew/opt/postgresql@15/bin/createdb -O training_user training_recording_local
```

### Варіант 3: Вручну через psql

1. Підключіться до PostgreSQL:
```bash
/opt/homebrew/opt/postgresql@15/bin/psql -d postgres
```

2. Виконайте SQL команди:
```sql
-- Створення користувача
CREATE USER training_user WITH PASSWORD 'Training123!@#';

-- Надання прав
ALTER USER training_user CREATEDB;

-- Створення бази даних
CREATE DATABASE training_recording_local OWNER training_user;

-- Підключення до нової бази
\c training_recording_local

-- Надання прав на схему
GRANT ALL ON SCHEMA public TO training_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO training_user;
```

## ⚙️ Оновлення .env файлу

Після створення бази даних оновіть `backend/.env`:

```env
# Локальна PostgreSQL база даних
DATABASE_URL="postgresql://training_user:Training123!@#@localhost:5432/training_recording_local"
DIRECT_URL="postgresql://training_user:Training123!@#@localhost:5432/training_recording_local"

# JWT Secret
JWT_SECRET=local-dev-secret-key-change-in-production

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:8080
```

## 🔄 Виконання міграцій

Після налаштування виконайте міграції:

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

Або для production міграцій:

```bash
npm run prisma:deploy
```

## ✅ Перевірка підключення

Перевірте підключення:

```bash
cd backend
node scripts/test-db-config.js
```

Або через psql:

```bash
/opt/homebrew/opt/postgresql@15/bin/psql -U training_user -d training_recording_local -h localhost
# Пароль: Training123!@#
```

## 🔧 Діагностика проблем

### Помилка: "password authentication failed"

**Рішення:**
1. Перевірте, чи PostgreSQL запущений: `brew services list | grep postgresql`
2. Запустіть PostgreSQL: `brew services start postgresql@15`
3. Перевірте `pg_hba.conf` налаштування

### Помилка: "database does not exist"

**Рішення:**
1. Переконайтеся, що база даних створена
2. Перевірте назву бази даних в `.env`
3. Виконайте скрипт створення бази даних знову

### Помилка: "permission denied"

**Рішення:**
1. Переконайтеся, що користувач має права CREATEDB
2. Перевірте права на схему public
3. Виконайте GRANT команди знову

## 📝 Корисні команди

```bash
# Перевірка статусу PostgreSQL
brew services list | grep postgresql

# Запуск PostgreSQL
brew services start postgresql@15

# Зупинка PostgreSQL
brew services stop postgresql@15

# Перегляд всіх баз даних
/opt/homebrew/opt/postgresql@15/bin/psql -d postgres -c "\l"

# Перегляд всіх користувачів
/opt/homebrew/opt/postgresql@15/bin/psql -d postgres -c "\du"

# Підключення до бази даних
/opt/homebrew/opt/postgresql@15/bin/psql -U training_user -d training_recording_local -h localhost
```

## 🗑️ Видалення бази даних

Якщо потрібно видалити базу даних:

```bash
/opt/homebrew/opt/postgresql@15/bin/dropdb -U training_user training_recording_local
```

Або через psql:

```sql
DROP DATABASE training_recording_local;
DROP USER training_user;
```
