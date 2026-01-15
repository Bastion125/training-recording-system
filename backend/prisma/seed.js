const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Створення ролей
  const roles = [
    { name: 'SystemAdmin', description: 'Системний адміністратор - повний доступ' },
    { name: 'Admin', description: 'Адміністратор - адміністративний доступ' },
    { name: 'Readit', description: 'Інструктор - може створювати курси та матеріали' },
    { name: 'User', description: 'Звичайний користувач - тільки перегляд та проходження курсів' }
  ];

  console.log('📝 Creating roles...');
  for (const roleData of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: roleData
    });
    console.log(`✅ Role created/updated: ${role.name}`);
  }

  // Створення системного адміністратора
  const systemAdminRole = await prisma.role.findUnique({
    where: { name: 'SystemAdmin' }
  });

  if (systemAdminRole) {
    // Створення тестового адміністратора з зручними обліковими даними
    const testAdminPassword = 'Admin123!';
    const testAdminPasswordHash = await bcrypt.hash(testAdminPassword, 10);
    
    const testAdmin = await prisma.user.upsert({
      where: { email: 'admin@test.local' },
      update: {},
      create: {
        email: 'admin@test.local',
        passwordHash: testAdminPasswordHash,
        roleId: systemAdminRole.id,
        isActive: true
      }
    });
    
    console.log('\n✅ ============================================');
    console.log('✅ Тестовий адміністратор створено!');
    console.log('✅ ============================================');
    console.log('📧 Email:    admin@test.local');
    console.log('🔑 Пароль:   Admin123!');
    console.log('👤 Роль:     SystemAdmin (повний доступ)');
    console.log('✅ ============================================');
    console.log('⚠️  ВАЖЛИВО: Змініть пароль після першого входу!');
    console.log('✅ ============================================\n');
    
    // Також створюємо системного адміна для сумісності
    const systemAdminPassword = 'SystemAdmin123!';
    const systemAdminPasswordHash = await bcrypt.hash(systemAdminPassword, 10);
    
    const systemAdmin = await prisma.user.upsert({
      where: { email: 'system@bps.local' },
      update: {},
      create: {
        email: 'system@bps.local',
        passwordHash: systemAdminPasswordHash,
        roleId: systemAdminRole.id,
        isActive: true
      }
    });
    
    console.log('✅ System Admin created/updated: system@bps.local');
    console.log('⚠️  Default password: SystemAdmin123!');
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
