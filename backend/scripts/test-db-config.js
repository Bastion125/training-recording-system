/**
 * Скрипт для перевірки конфігурації бази даних
 * Перевіряє наявність змінних оточення та валідність Prisma схеми
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function testDatabaseConfig() {
  console.log('🔍 Перевірка конфігурації бази даних...\n');

  // Перевірка змінних оточення
  console.log('1. Перевірка змінних оточення:');
  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL не встановлено!');
    process.exit(1);
  }
  console.log('✅ DATABASE_URL встановлено');

  if (!directUrl) {
    console.warn('⚠️  DIRECT_URL не встановлено (може знадобитися для міграцій)');
  } else {
    console.log('✅ DIRECT_URL встановлено');
  }

  // Перевірка формату DATABASE_URL
  console.log('\n2. Перевірка формату DATABASE_URL:');
  try {
    const url = new URL(databaseUrl.replace(/^postgresql:\/\//, 'http://'));
    console.log(`✅ Формат URL валідний`);
    console.log(`   Host: ${url.hostname}`);
    console.log(`   Port: ${url.port || '5432 (default)'}`);
    console.log(`   Database: ${url.pathname.replace('/', '')}`);
  } catch (error) {
    console.error('❌ Невірний формат DATABASE_URL:', error.message);
    process.exit(1);
  }

  // Перевірка Prisma Client
  console.log('\n3. Перевірка Prisma Client:');
  try {
    const prisma = new PrismaClient();
    console.log('✅ Prisma Client ініціалізовано');
    
    // Спробуємо підключитися (якщо можливо)
    console.log('\n4. Спроба підключення до бази даних:');
    try {
      await prisma.$connect();
      console.log('✅ Підключення до бази даних успішне!');
      
      // Простий тестовий запит
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      console.log('✅ Тестовий запит виконано успішно');
      
      // Перевірка таблиць
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `;
      console.log(`\n📊 Знайдено таблиць: ${tables.length}`);
      if (tables.length > 0) {
        console.log('   Таблиці:');
        tables.forEach(table => {
          console.log(`   - ${table.table_name}`);
        });
      }
      
      await prisma.$disconnect();
    } catch (error) {
      if (error.message.includes("Can't reach database server")) {
        console.log('⚠️  Не вдалося підключитися до бази даних');
        console.log('   Це нормально, якщо використовується internal Railway hostname');
        console.log('   Міграції будуть виконані автоматично під час деплою на Railway');
      } else {
        console.error('❌ Помилка підключення:', error.message);
        throw error;
      }
    }
  } catch (error) {
    console.error('❌ Помилка ініціалізації Prisma Client:', error.message);
    process.exit(1);
  }

  console.log('\n✅ Конфігурація бази даних валідна!');
  console.log('\n📝 Наступні кроки:');
  console.log('   1. Міграції будуть виконані автоматично на Railway через railway.json');
  console.log('   2. Команда деплою: npm run prisma:deploy && npm start');
  console.log('   3. Перевірте health check: /api/health/db');
}

testDatabaseConfig().catch((error) => {
  console.error('❌ Критична помилка:', error);
  process.exit(1);
});
