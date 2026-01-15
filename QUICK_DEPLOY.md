# 🚀 Швидкий деплой через GitHub

## Крок 1: Закомітити та запушити зміни

```bash
cd "/Users/a11/Desktop/Сайт/Навчання Альфа 1.1/ТЕСТ 2_1/github"

# Додати всі зміни
git add .

# Закомітити
git commit -m "Налаштування Railway PostgreSQL, деплой конфігурація та тестові скрипти"

# Запушити в GitHub
git push origin main
```

## Крок 2: Налаштування Railway через веб-інтерфейс

### 2.1. Підключення GitHub

1. Відкрийте: https://railway.app
2. Проєкт: `protective-integrity` → Сервіс: `training-recording-system`
3. **Settings** → **Source**
4. Натисніть **Connect GitHub Repo**
5. Виберіть: `Bastion125/training-recording-system`
6. Гілка: `main`
7. **Root Directory:** `backend` ⚠️ **ВАЖЛИВО!**
8. Натисніть **Deploy**

### 2.2. Змінні оточення

**Settings** → **Variables** → додайте:

```
DATABASE_URL=postgresql://postgres:ASdeOUBlKPAvzYodpKVWVkIRbXzUghBI@postgres.railway.internal:5432/railway
DIRECT_URL=postgresql://postgres:ASdeOUBlKPAvzYodpKVWVkIRbXzUghBI@postgres.railway.internal:5432/railway
NODE_ENV=production
CORS_ORIGIN=https://bastion125.github.io
```

## Крок 3: Перевірка

```bash
cd backend
node scripts/test-deployment.js
```

## ✅ Готово!

Після цього кожен `git push` автоматично запускає деплой.

**Детальна інструкція:** `backend/GITHUB_DEPLOY.md`
