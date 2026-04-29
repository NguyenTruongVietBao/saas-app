import { eq } from 'drizzle-orm';
import { db } from '..';
import { organizations } from '../db/schema';

async function main() {
  try {
    console.log('\n  \x1b[36m🚀 Starting CRUD Demo Workflow...\x1b[0m');

    // 1. CREATE: Thêm một tổ chức mới
    console.log(
      '\n  \x1b[33m[1/4] CREATE\x1b[0m: Inserting demo organization...',
    );
    const [newOrg] = await db
      .insert(organizations)
      .values({
        name: 'Demo Agency',
        subdomain: `demo-${Date.now()}`,
        schemaName: `tenant_demo_${Date.now()}`,
        plan: 'pro',
      })
      .returning();

    console.log('    ✅ Created:', newOrg.name, `(ID: ${newOrg.id})`);

    // 2. READ: Đọc dữ liệu vừa tạo
    console.log(
      '\n  \x1b[33m[2/4] READ\x1b[0m: Fetching the created organization...',
    );
    const fetchedOrg = await db.query.organizations.findFirst({
      where: eq(organizations.id, newOrg.id),
    });

    if (fetchedOrg) {
      console.log(
        '    ✅ Found:',
        fetchedOrg.name,
        `(Plan: ${fetchedOrg.plan})`,
      );
    }

    // 3. UPDATE: Cập nhật thông tin
    console.log(
      '\n  \x1b[33m[3/4] UPDATE\x1b[0m: Upgrading plan to enterprise...',
    );
    const [updatedOrg] = await db
      .update(organizations)
      .set({ plan: 'enterprise' })
      .where(eq(organizations.id, newOrg.id))
      .returning();

    console.log('    ✅ Updated plan to:', updatedOrg.plan);

    // 4. DELETE: Xóa dữ liệu demo
    console.log('\n  \x1b[33m[4/4] DELETE\x1b[0m: Cleaning up demo data...');
    await db.delete(organizations).where(eq(organizations.id, newOrg.id));

    console.log('    ✅ Deleted successfully.');

    console.log(
      '\n  \x1b[32m✨ CRUD Workflow completed successfully!\x1b[0m\n',
    );
  } catch (error) {
    console.error('\n  \x1b[31m❌ CRUD Demo Error:\x1b[0m', error);
    process.exit(1);
  }
}

main();
