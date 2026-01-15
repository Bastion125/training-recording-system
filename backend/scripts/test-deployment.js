/**
 * Скрипт для тестування деплою на Railway
 * Перевіряє health checks та запускає тести
 */

const https = require('https');
const http = require('http');

const RAILWAY_URL = 'https://training-recording-system-production.up.railway.app';

// Утиліта для HTTP запитів
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Перевірка health check
async function checkHealth() {
  console.log('🔍 Перевірка основного health check (/health)...');
  try {
    const response = await makeRequest(`${RAILWAY_URL}/health`);
    if (response.statusCode === 200) {
      console.log('✅ Health check успішний');
      console.log(`   Відповідь: ${response.body.substring(0, 200)}`);
      return true;
    } else {
      console.log(`❌ Health check не пройдено (HTTP ${response.statusCode})`);
      console.log(`   Відповідь: ${response.body}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Помилка підключення: ${error.message}`);
    return false;
  }
}

// Перевірка API health check
async function checkApiHealth() {
  console.log('\n🔍 Перевірка API health check (/api/health)...');
  try {
    const response = await makeRequest(`${RAILWAY_URL}/api/health`);
    if (response.statusCode === 200) {
      console.log('✅ API health check успішний');
      console.log(`   Відповідь: ${response.body.substring(0, 200)}`);
      return true;
    } else {
      console.log(`❌ API health check не пройдено (HTTP ${response.statusCode})`);
      console.log(`   Відповідь: ${response.body}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Помилка підключення: ${error.message}`);
    return false;
  }
}

// Перевірка database health check
async function checkDbHealth() {
  console.log('\n🔍 Перевірка database health check (/api/health/db)...');
  try {
    const response = await makeRequest(`${RAILWAY_URL}/api/health/db`);
    if (response.statusCode === 200) {
      console.log('✅ Database health check успішний');
      const body = JSON.parse(response.body);
      console.log(`   Відповідь: ${JSON.stringify(body, null, 2).substring(0, 300)}`);
      
      if (body.database && body.database.tables !== undefined) {
        console.log(`   📊 Кількість таблиць: ${body.database.tables}`);
      }
      
      return true;
    } else {
      console.log(`❌ Database health check не пройдено (HTTP ${response.statusCode})`);
      console.log(`   Відповідь: ${response.body}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Помилка підключення: ${error.message}`);
    return false;
  }
}

// Головна функція
async function main() {
  console.log('='.repeat(60));
  console.log('🧪 Тестування деплою на Railway');
  console.log('='.repeat(60));
  console.log(`URL: ${RAILWAY_URL}\n`);
  
  const results = {
    health: await checkHealth(),
    apiHealth: await checkApiHealth(),
    dbHealth: await checkDbHealth()
  };
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 РЕЗУЛЬТАТИ ТЕСТУВАННЯ:');
  console.log('='.repeat(60));
  console.log(`Health check:        ${results.health ? '✅' : '❌'}`);
  console.log(`API health check:    ${results.apiHealth ? '✅' : '❌'}`);
  console.log(`Database health:      ${results.dbHealth ? '✅' : '❌'}`);
  
  const allPassed = results.health && results.apiHealth && results.dbHealth;
  
  if (allPassed) {
    console.log('\n✅ Всі перевірки пройдено успішно!');
    console.log('🚀 Проєкт готовий до використання');
    console.log('\n📝 Наступні кроки:');
    console.log('   1. Запустіть тести: npm test');
    console.log('   2. Оновіть frontend URL в api.js');
    process.exit(0);
  } else {
    console.log('\n⚠️  Деякі перевірки не пройдено');
    console.log('\n💡 Можливі причини:');
    if (!results.health || !results.apiHealth) {
      console.log('   - Проєкт не задеплоєний або не запущений');
      console.log('   - Перевірте Railway Dashboard → Deployments');
    }
    if (!results.dbHealth) {
      console.log('   - DATABASE_URL не налаштовано');
      console.log('   - Міграції не виконано');
      console.log('   - PostgreSQL сервіс не запущений');
    }
    console.log('\n📝 Інструкції для деплою: див. DEPLOY_INSTRUCTIONS.md');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Критична помилка:', error);
  process.exit(1);
});
