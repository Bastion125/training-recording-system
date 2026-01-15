#!/bin/bash

# Скрипт для перевірки стану деплою на Railway

RAILWAY_URL="https://training-recording-system-production.up.railway.app"

echo "🔍 Перевірка стану деплою на Railway"
echo "======================================"
echo ""

# Перевірка основного health check
echo "1. Перевірка основного health check (/health):"
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "${RAILWAY_URL}/health")
HEALTH_CODE=$(echo "$HEALTH_RESPONSE" | tail -n 1)
HEALTH_BODY=$(echo "$HEALTH_RESPONSE" | sed '$d')

if [ "$HEALTH_CODE" = "200" ]; then
    echo "✅ Health check успішний (HTTP $HEALTH_CODE)"
    echo "   Відповідь: $HEALTH_BODY"
else
    echo "❌ Health check не пройдено (HTTP $HEALTH_CODE)"
    echo "   Відповідь: $HEALTH_BODY"
fi

echo ""

# Перевірка API health check
echo "2. Перевірка API health check (/api/health):"
API_HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "${RAILWAY_URL}/api/health")
API_HEALTH_CODE=$(echo "$API_HEALTH_RESPONSE" | tail -n 1)
API_HEALTH_BODY=$(echo "$API_HEALTH_RESPONSE" | sed '$d')

if [ "$API_HEALTH_CODE" = "200" ]; then
    echo "✅ API health check успішний (HTTP $API_HEALTH_CODE)"
    echo "   Відповідь: $API_HEALTH_BODY"
else
    echo "❌ API health check не пройдено (HTTP $API_HEALTH_CODE)"
    echo "   Відповідь: $API_HEALTH_BODY"
fi

echo ""

# Перевірка database health check
echo "3. Перевірка database health check (/api/health/db):"
DB_HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "${RAILWAY_URL}/api/health/db")
DB_HEALTH_CODE=$(echo "$DB_HEALTH_RESPONSE" | tail -n 1)
DB_HEALTH_BODY=$(echo "$DB_HEALTH_RESPONSE" | sed '$d')

if [ "$DB_HEALTH_CODE" = "200" ]; then
    echo "✅ Database health check успішний (HTTP $DB_HEALTH_CODE)"
    echo "   Відповідь: $DB_HEALTH_BODY"
    
    # Перевірка чи є інформація про таблиці
    if echo "$DB_HEALTH_BODY" | grep -q "tables"; then
        TABLES_COUNT=$(echo "$DB_HEALTH_BODY" | grep -o '"tables":[0-9]*' | grep -o '[0-9]*')
        echo "   📊 Кількість таблиць: $TABLES_COUNT"
    fi
else
    echo "❌ Database health check не пройдено (HTTP $DB_HEALTH_CODE)"
    echo "   Відповідь: $DB_HEALTH_BODY"
    echo ""
    echo "   💡 Можливі причини:"
    echo "   - DATABASE_URL не налаштовано"
    echo "   - Міграції не виконано"
    echo "   - PostgreSQL сервіс не запущений"
fi

echo ""
echo "======================================"

# Підсумок
if [ "$HEALTH_CODE" = "200" ] && [ "$API_HEALTH_CODE" = "200" ] && [ "$DB_HEALTH_CODE" = "200" ]; then
    echo "✅ Всі перевірки пройдено успішно!"
    echo "🚀 Проєкт готовий до використання"
    exit 0
else
    echo "⚠️  Деякі перевірки не пройдено"
    echo "📝 Перевірте логи та налаштування на Railway"
    exit 1
fi
