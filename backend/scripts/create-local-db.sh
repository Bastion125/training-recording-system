#!/bin/bash

# Простий скрипт для створення локальної БД через createdb/createuser

PSQL_BIN="/opt/homebrew/opt/postgresql@15/bin"
DB_NAME="training_recording_local"
DB_USER="training_user"
DB_PASSWORD="Training123!@#"

echo "🔧 Створення локальної PostgreSQL бази даних"
echo "=============================================="
echo ""

# Перевірка чи PostgreSQL запущений
if ! $PSQL_BIN/pg_isready -h localhost > /dev/null 2>&1; then
    echo "❌ PostgreSQL не запущений"
    echo "   Запустіть: brew services start postgresql@15"
    exit 1
fi

echo "✅ PostgreSQL запущений"
echo ""

# Створення користувача (якщо не існує)
echo "📝 Створення користувача $DB_USER..."
if $PSQL_BIN/psql -d postgres -tc "SELECT 1 FROM pg_user WHERE usename = '$DB_USER'" 2>/dev/null | grep -q 1; then
    echo "   Користувач вже існує, оновлюємо пароль..."
    $PSQL_BIN/psql -d postgres -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null
else
    $PSQL_BIN/createuser -s $DB_USER 2>/dev/null
    $PSQL_BIN/psql -d postgres -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null
    echo "   ✅ Користувач створено"
fi

# Видалення старої бази якщо існує
echo ""
echo "🗑️  Видалення старої бази даних (якщо існує)..."
$PSQL_BIN/dropdb -U $DB_USER $DB_NAME 2>/dev/null || true

# Створення нової бази
echo "📦 Створення бази даних $DB_NAME..."
$PSQL_BIN/createdb -U $DB_USER -O $DB_USER $DB_NAME 2>/dev/null

if [ $? -eq 0 ]; then
    echo "   ✅ База даних створена"
    
    # Надання прав
    echo ""
    echo "🔐 Надання прав..."
    $PSQL_BIN/psql -U $DB_USER -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;" 2>/dev/null
    $PSQL_BIN/psql -U $DB_USER -d $DB_NAME -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;" 2>/dev/null
    $PSQL_BIN/psql -U $DB_USER -d $DB_NAME -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;" 2>/dev/null
    echo "   ✅ Права надано"
    
    echo ""
    echo "=============================================="
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
else
    echo "   ❌ Помилка створення бази даних"
    echo ""
    echo "💡 Спробуйте виконати SQL скрипт вручну:"
    echo "   psql -d postgres -f scripts/setup-local-db.sql"
    exit 1
fi
