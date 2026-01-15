#!/bin/bash

# Скрипт для створення локальної PostgreSQL бази даних

PSQL="/opt/homebrew/opt/postgresql@15/bin/psql"
DB_NAME="training_recording_local"
DB_USER="training_user"
DB_PASSWORD="Training123!@#"

echo "🔧 Налаштування локальної PostgreSQL бази даних"
echo "================================================"
echo ""

# Перевірка чи PostgreSQL запущений
if ! $PSQL -h localhost -U $(whoami) -d postgres -c "SELECT 1" > /dev/null 2>&1; then
    echo "❌ Помилка: PostgreSQL не запущений або недоступний"
    echo "   Спробуйте: brew services start postgresql@15"
    exit 1
fi

echo "✅ PostgreSQL запущений"
echo ""

# Створення користувача (якщо не існує)
echo "📝 Створення користувача бази даних..."
if $PSQL -h localhost -U $(whoami) -d postgres -tc "SELECT 1 FROM pg_user WHERE usename = '$DB_USER'" | grep -q 1; then
    echo "   Користувач $DB_USER вже існує"
    # Оновлення паролю
    $PSQL -h localhost -U $(whoami) -d postgres -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>&1
    echo "   ✅ Пароль оновлено"
else
    $PSQL -h localhost -U $(whoami) -d postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>&1
    echo "   ✅ Користувач $DB_USER створено"
fi

# Надання прав
$PSQL -h localhost -U $(whoami) -d postgres -c "ALTER USER $DB_USER CREATEDB;" 2>&1
echo "   ✅ Права надано"
echo ""

# Видалення бази даних якщо існує
echo "🗑️  Видалення старої бази даних (якщо існує)..."
$PSQL -h localhost -U $(whoami) -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;" 2>&1 > /dev/null
echo "   ✅ Готово"
echo ""

# Створення нової бази даних
echo "📦 Створення бази даних $DB_NAME..."
$PSQL -h localhost -U $(whoami) -d postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ База даних $DB_NAME створена"
else
    echo "   ❌ Помилка створення бази даних"
    exit 1
fi
echo ""

# Надання всіх прав на базу даних
echo "🔐 Надання прав користувачу..."
$PSQL -h localhost -U $(whoami) -d $DB_NAME -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>&1
$PSQL -h localhost -U $(whoami) -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;" 2>&1
echo "   ✅ Права надано"
echo ""

echo "================================================"
echo "✅ Локальна база даних налаштована!"
echo ""
echo "📋 Дані для підключення:"
echo "   Database: $DB_NAME"
echo "   User:     $DB_USER"
echo "   Password: $DB_PASSWORD"
echo "   Host:     localhost"
echo "   Port:     5432"
echo ""
echo "🔗 Connection String:"
echo "   postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
echo ""
