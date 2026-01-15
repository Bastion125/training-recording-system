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
    // Створення адміністратора з надійним паролем
    const adminPassword = process.env.ADMIN_PASSWORD || 'Tr4!n1ngS3cur3@2024';
    const adminPasswordHash = await bcrypt.hash(adminPassword, 12);
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@training.local' },
      update: {
        passwordHash: adminPasswordHash,
        isActive: true
      },
      create: {
        email: 'admin@training.local',
        passwordHash: adminPasswordHash,
        roleId: systemAdminRole.id,
        isActive: true
      }
    });
    
    console.log('\n✅ ============================================');
    console.log('✅ Адміністратор створено/оновлено!');
    console.log('✅ ============================================');
    console.log('📧 Email:    admin@training.local');
    console.log('🔑 Пароль:   ' + adminPassword);
    console.log('👤 Роль:     SystemAdmin (повний доступ)');
    console.log('✅ ============================================\n');
    
    // Тестовий адмін для розробки
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
