# Training Recording System

Система для навчання та запису тренувань.

## 🚀 Швидкий старт

### Локальна розробка

1. Налаштуйте локальну PostgreSQL базу даних (див. `backend/LOCAL_DB_SETUP.md`)
2. Встановіть залежності:
   ```bash
   cd backend
   npm install
   ```
3. Виконайте міграції:
   ```bash
   npm run prisma:migrate
   ```
4. Запустіть сервер:
   ```bash
   npm start
   ```

### Деплой на Render

Детальна інструкція: [RENDER_DEPLOY.md](./RENDER_DEPLOY.md)

## 📁 Структура проєкту

```
├── backend/          # Backend API (Node.js + Express + Prisma)
├── frontend/         # Frontend (HTML + JavaScript)
├── render.yaml       # Render конфігурація
└── RENDER_DEPLOY.md  # Інструкція для деплою на Render
```

## 🔗 Посилання

- GitHub: https://github.com/Bastion125/training-recording-system
- Render Dashboard: https://dashboard.render.com/
