/**
 * Комплексна перевірка налаштування проєкту
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('🔍 Комплексна перевірка налаштування проєкту\n');

let errors = [];
let warnings = [];
let success = [];

// 1. Перевірка .env файлу
console.log('1. Перевірка змінних оточення:');
if (!process.env.DATABASE_URL) {
  errors.push('DATABASE_URL не встановлено');
} else {
  success.push('DATABASE_URL встановлено');
  if (process.env.DATABASE_URL.includes('postgres.railway.internal')) {
    warnings.push('Використовується internal Railway hostname (працює тільки на Railway)');
  }
}

if (!process.env.DIRECT_URL) {
  warnings.push('DIRECT_URL не встановлено (може знадобитися для міграцій)');
} else {
  success.push('DIRECT_URL встановлено');
}

if (!process.env.JWT_SECRET) {
  warnings.push('JWT_SECRET не встановлено (використовується дефолтне значення)');
} else {
  success.push('JWT_SECRET встановлено');
}

// 2. Перевірка структури проєкту
console.log('\n2. Перевірка структури проєкту:');
const requiredFiles = [
  'server.js',
  'package.json',
  'prisma/schema.prisma',
  'railway.json',
  'src/config/database.js'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    success.push(`Файл ${file} існує`);
  } else {
    errors.push(`Файл ${file} не знайдено`);
  }
});

// 3. Перевірка міграцій
console.log('\n3. Перевірка міграцій:');
const migrationsDir = path.join(__dirname, '..', 'prisma', 'migrations');
if (fs.existsSync(migrationsDir)) {
  const migrations = fs.readdirSync(migrationsDir).filter(item => {
    const itemPath = path.join(migrationsDir, item);
    return fs.statSync(itemPath).isDirectory() && item !== '.gitkeep';
  });
  if (migrations.length > 0) {
    success.push(`Знайдено ${migrations.length} міграцій`);
    migrations.forEach(migration => {
      const migrationFile = path.join(migrationsDir, migration, 'migration.sql');
      if (fs.existsSync(migrationFile)) {
        success.push(`  ✓ ${migration}`);
      } else {
        errors.push(`  ✗ ${migration} - файл migration.sql не знайдено`);
      }
    });
  } else {
    warnings.push('Міграції не знайдено');
  }
} else {
  errors.push('Директорія міграцій не знайдена');
}

// 4. Перевірка package.json скриптів
console.log('\n4. Перевірка package.json:');
try {
  const packageJson = require(path.join(__dirname, '..', 'package.json'));
  const requiredScripts = ['start', 'prisma:deploy', 'prisma:generate', 'test'];
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      success.push(`Скрипт ${script} налаштовано`);
    } else {
      errors.push(`Скрипт ${script} не знайдено`);
    }
  });
} catch (error) {
  errors.push(`Помилка читання package.json: ${error.message}`);
}

// 5. Перевірка railway.json
console.log('\n5. Перевірка railway.json:');
try {
  const railwayJson = require(path.join(__dirname, '..', 'railway.json'));
  if (railwayJson.deploy && railwayJson.deploy.startCommand) {
    success.push('Railway startCommand налаштовано');
    if (railwayJson.deploy.startCommand.includes('prisma:deploy')) {
      success.push('  ✓ Міграції включені в команду деплою');
    }
  }
  if (railwayJson.deploy && railwayJson.deploy.healthcheckPath) {
    success.push(`Health check path: ${railwayJson.deploy.healthcheckPath}`);
  }
} catch (error) {
  errors.push(`Помилка читання railway.json: ${error.message}`);
}

// Виведення результатів
console.log('\n' + '='.repeat(50));
console.log('📊 РЕЗУЛЬТАТИ ПЕРЕВІРКИ:');
console.log('='.repeat(50));

if (success.length > 0) {
  console.log('\n✅ Успішні перевірки:');
  success.forEach(msg => console.log(`   ${msg}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️  Попередження:');
  warnings.forEach(msg => console.log(`   ${msg}`));
}

if (errors.length > 0) {
  console.log('\n❌ Помилки:');
  errors.forEach(msg => console.log(`   ${msg}`));
  console.log('\n❌ Налаштування потребує виправлень!');
  process.exit(1);
} else {
  console.log('\n✅ Всі перевірки пройдено успішно!');
  console.log('\n📝 Наступні кроки:');
  console.log('   1. Задеплойте проєкт на Railway');
  console.log('   2. Міграції виконаються автоматично');
  console.log('   3. Перевірте health check: /api/health/db');
  console.log('   4. Запустіть тести після деплою');
}
