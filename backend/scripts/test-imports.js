/**
 * Перевірка імпортів та структури модулів
 */

require('dotenv').config();

console.log('🔍 Перевірка імпортів та структури модулів\n');

let errors = [];
let success = [];

// Тест 1: Перевірка основного сервера
console.log('1. Перевірка server.js:');
try {
  const app = require('../server');
  if (app && typeof app.listen === 'function' || typeof app === 'function') {
    success.push('✅ server.js успішно імпортовано');
  } else {
    errors.push('❌ server.js не експортує правильний об\'єкт');
  }
} catch (error) {
  errors.push(`❌ Помилка імпорту server.js: ${error.message}`);
}

// Тест 2: Перевірка конфігурації бази даних
console.log('\n2. Перевірка database.js:');
try {
  const prisma = require('../src/config/database');
  if (prisma && prisma.$connect) {
    success.push('✅ database.js успішно імпортовано (Prisma Client)');
  } else {
    errors.push('❌ database.js не експортує Prisma Client');
  }
} catch (error) {
  errors.push(`❌ Помилка імпорту database.js: ${error.message}`);
}

// Тест 3: Перевірка контролерів
console.log('\n3. Перевірка контролерів:');
const controllers = [
  'authController',
  'courseController',
  'crewController',
  'equipmentController',
  'knowledgeController',
  'personnelController'
];

controllers.forEach(controller => {
  try {
    const module = require(`../src/controllers/${controller}`);
    if (module) {
      success.push(`✅ ${controller} успішно імпортовано`);
    }
  } catch (error) {
    errors.push(`❌ Помилка імпорту ${controller}: ${error.message}`);
  }
});

// Тест 4: Перевірка маршрутів
console.log('\n4. Перевірка маршрутів:');
const routes = [
  'auth',
  'courses',
  'personnel',
  'crews',
  'equipment',
  'knowledge',
  'files',
  'practice'
];

routes.forEach(route => {
  try {
    const module = require(`../src/routes/${route}`);
    if (module) {
      success.push(`✅ routes/${route}.js успішно імпортовано`);
    }
  } catch (error) {
    errors.push(`❌ Помилка імпорту routes/${route}.js: ${error.message}`);
  }
});

// Тест 5: Перевірка middleware
console.log('\n5. Перевірка middleware:');
const middleware = ['auth', 'errorHandler', 'validateId'];

middleware.forEach(mw => {
  try {
    const module = require(`../src/middleware/${mw}`);
    if (module) {
      success.push(`✅ middleware/${mw}.js успішно імпортовано`);
    }
  } catch (error) {
    errors.push(`❌ Помилка імпорту middleware/${mw}.js: ${error.message}`);
  }
});

// Виведення результатів
console.log('\n' + '='.repeat(50));
console.log('📊 РЕЗУЛЬТАТИ ПЕРЕВІРКИ ІМПОРТІВ:');
console.log('='.repeat(50));

if (success.length > 0) {
  console.log(`\n✅ Успішні імпорти (${success.length}):`);
  success.forEach(msg => console.log(`   ${msg}`));
}

if (errors.length > 0) {
  console.log(`\n❌ Помилки (${errors.length}):`);
  errors.forEach(msg => console.log(`   ${msg}`));
  console.log('\n❌ Деякі модулі не можуть бути імпортовані!');
  process.exit(1);
} else {
  console.log('\n✅ Всі модулі успішно імпортовані!');
  console.log('✅ Структура проєкту валідна!');
}
