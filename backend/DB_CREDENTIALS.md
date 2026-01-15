# 🔐 Дані для підключення до локальної бази даних

## 📋 Облікові дані

**База даних:** `training_recording_local`  
**Користувач:** `training_user`  
**Пароль:** `Training123!@#`  
**Хост:** `localhost`  
**Порт:** `5432`

## 🔗 Connection String

```
postgresql://training_user:Training123!@#@localhost:5432/training_recording_local
```

## 🚀 Швидке налаштування

### Крок 1: Створення бази даних

Відкрийте термінал та виконайте:

```bash
cd "/Users/a11/Desktop/Сайт/Навчання Альфа 1.1/ТЕСТ 2_1/github/backend"

# Підключіться до PostgreSQL (може знадобитися пароль вашого системного користувача)
/opt/homebrew/opt/postgresql@15/bin/psql -d postgres
```

Потім виконайте SQL команди:

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
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO training_user;
```

Або виконайте готовий SQL скрипт:

```bash
/opt/homebrew/opt/postgresql@15/bin/psql -d postgres -f scripts/setup-local-db.sql
```

### Крок 2: Оновлення .env файлу

Файл `.env` вже налаштовано з локальними даними:

```env
DATABASE_URL="postgresql://training_user:Training123!@#@localhost:5432/training_recording_local"
DIRECT_URL="postgresql://training_user:Training123!@#@localhost:5432/training_recording_local"
```

### Крок 3: Виконання міграцій

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

## ✅ Перевірка підключення

```bash
cd backend
node scripts/test-db-config.js
```

Або через psql:

```bash
/opt/homebrew/opt/postgresql@15/bin/psql -U training_user -d training_recording_local -h localhost
# Пароль: Training123!@#
```

## 📝 Альтернативний спосіб (якщо є проблеми з паролем)

Якщо PostgreSQL потребує пароль системного користувача, використайте:

```bash
# Створення користувача через createuser
/opt/homebrew/opt/postgresql@15/bin/createuser -s training_user

# Встановлення паролю (може знадобитися пароль системного користувача)
/opt/homebrew/opt/postgresql@15/bin/psql -d postgres -c "ALTER USER training_user WITH PASSWORD 'Training123!@#';"

# Створення бази даних
/opt/homebrew/opt/postgresql@15/bin/createdb -O training_user training_recording_local
```

## 🔧 Детальна інструкція

Дивіться файл `LOCAL_DB_SETUP.md` для повної інструкції.
