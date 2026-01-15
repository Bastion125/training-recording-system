-- Скрипт для створення локальної PostgreSQL бази даних
-- Виконайте: psql -d postgres -f scripts/setup-local-db.sql

-- Створення користувача (якщо не існує)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'training_user') THEN
    CREATE USER training_user WITH PASSWORD 'Training123!@#';
    RAISE NOTICE 'Користувач training_user створено';
  ELSE
    ALTER USER training_user WITH PASSWORD 'Training123!@#';
    RAISE NOTICE 'Пароль користувача training_user оновлено';
  END IF;
END
$$;

-- Надання прав
ALTER USER training_user CREATEDB;

-- Видалення старої бази якщо існує
DROP DATABASE IF EXISTS training_recording_local;

-- Створення нової бази
CREATE DATABASE training_recording_local OWNER training_user;

-- Підключення до нової бази та надання прав
\c training_recording_local

-- Надання всіх прав на схему public
GRANT ALL ON SCHEMA public TO training_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO training_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO training_user;

\echo ''
\echo '========================================'
\echo '✅ Локальна база даних налаштована!'
\echo '========================================'
\echo ''
\echo '📋 Дані для підключення:'
\echo '   Database: training_recording_local'
\echo '   User:     training_user'
\echo '   Password: Training123!@#'
\echo '   Host:     localhost'
\echo '   Port:     5432'
\echo ''
\echo '🔗 Connection String:'
\echo '   postgresql://training_user:Training123!@#@localhost:5432/training_recording_local'
\echo ''
