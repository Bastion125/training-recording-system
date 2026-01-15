# 🔧 Виправлення CORS помилки

## ❌ Помилка

```
Access to fetch at 'https://...' from origin 'https://bastion125.github.io' 
has been blocked by CORS policy: Response to preflight request doesn't pass 
access control check: No 'Access-Control-Allow-Origin' header is present 
on the requested resource.
```

## 🔍 Причини

1. **Неправильний URL в `api.js`** - placeholder не замінений на реальний Render URL
2. **CORS_ORIGIN не налаштовано** на Render або встановлено неправильно

## ✅ Рішення

### Крок 1: Оновити URL в api.js

1. **Знайдіть ваш Render URL:**
   - Відкрийте https://dashboard.render.com/
   - Перейдіть до вашого Web Service
   - Скопіюйте URL зверху (наприклад: `https://training-recording-backend.onrender.com`)

2. **Оновіть `frontend/app/scripts/api.js`:**
   - Відкрийте файл `frontend/app/scripts/api.js`
   - Знайдіть рядок:
     ```javascript
     const RENDER_API_URL = 'https://ВАШ_SERVICE_NAME.onrender.com/api';
     ```
   - Замініть `ВАШ_SERVICE_NAME` на назву вашого сервісу:
     ```javascript
     const RENDER_API_URL = 'https://training-recording-backend.onrender.com/api';
     ```
   - Закомітьте та запуште зміни:
     ```bash
     git add frontend/app/scripts/api.js
     git commit -m "Оновлено Render API URL"
     git push origin main
     ```

### Крок 2: Налаштувати CORS_ORIGIN на Render

1. **Відкрийте Render Dashboard:** https://dashboard.render.com/
2. **Перейдіть до вашого Web Service**
3. **Перейдіть до розділу Environment Variables**
4. **Перевірте або додайте `CORS_ORIGIN`:**
   - **Key:** `CORS_ORIGIN`
   - **Value:** `https://bastion125.github.io`
   - Натисніть **Save Changes**

5. **Перезапустіть сервіс:**
   - Перейдіть до **Manual Deploy** → **Clear build cache & deploy**
   - Або просто натисніть **Deploy latest commit**

### Крок 3: Перевірка CORS налаштування

Після оновлення перевірте:

1. **Перевірте health check:**
   ```bash
   curl https://ВАШ_URL.onrender.com/health
   ```

2. **Перевірте CORS headers:**
   ```bash
   curl -H "Origin: https://bastion125.github.io" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        https://ВАШ_URL.onrender.com/api/auth/register \
        -v
   ```

   Має повернутися:
   ```
   < HTTP/1.1 200 OK
   < Access-Control-Allow-Origin: https://bastion125.github.io
   < Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS,PATCH
   < Access-Control-Allow-Headers: Content-Type,Authorization,X-Requested-With,Accept,Origin
   < Access-Control-Allow-Credentials: true
   ```

## 📋 Чеклист виправлення

- [ ] Оновлено `RENDER_API_URL` в `frontend/app/scripts/api.js` на реальний Render URL
- [ ] Закомічено та запушено зміни в GitHub
- [ ] `CORS_ORIGIN` встановлено на Render як `https://bastion125.github.io`
- [ ] Сервіс перезапущено на Render
- [ ] Перевірено CORS headers через curl

## 🔍 Додаткова діагностика

### Якщо CORS все ще не працює:

1. **Перевірте логи на Render:**
   - Перейдіть до **Logs** у вашому Web Service
   - Перевірте, чи сервер запущений та чи немає помилок

2. **Перевірте, чи CORS_ORIGIN правильно встановлено:**
   - У Environment Variables має бути точно: `https://bastion125.github.io`
   - Без слеша в кінці!
   - Без пробілів!

3. **Перевірте, чи frontend використовує правильний URL:**
   - Відкрийте консоль браузера (F12)
   - Перевірте Network tab - який URL використовується для запитів

4. **Якщо використовуєте кілька доменів:**
   - `CORS_ORIGIN` може містити кілька значень через кому:
   - `https://bastion125.github.io,https://your-other-domain.com`

## ✅ Після виправлення

Після виконання всіх кроків CORS помилка має зникнути, і запити з GitHub Pages мають працювати.
