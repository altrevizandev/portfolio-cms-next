import { hash } from 'bcryptjs';
import { prisma } from "./index.js";

const isProduction = process.env.NODE_ENV == "production";

async function main() {
  const admin_role = await prisma.role.upsert({
    where: { slug: 'admin' },
    update: {},
    create: {
      name: 'Admin',
      slug: 'admin',
    },
  });

  const admin_account = await seedAdminAccount();

  await prisma.accountRoles.upsert({
    where: {
      account_id_role_id: {
        account_id: admin_account.id,
        role_id: admin_role.id,
      }
    },
    update: {},
    create: {
      account_id: admin_account.id,
      role_id: admin_role.id
    }
  });
}

const seedAdminAccount = async () => {
  const adminName = process.env.ADMIN_NAME ?? "Andre Lucas Trevizan";
  const adminEmail = process.env.ADMIN_EMAIL ?? "altrevizan.dev@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";

  if (isProduction && (adminEmail == "" || adminPassword == "")) {
    throw new Error("Configure ADMIN_EMAIL e ADMIN_PASSWORD para executar o seed em producao");
  }

  const email = adminEmail || "altrevizan.dev@gmail.com";
  const password = adminPassword || "Admin@123456789_2026";
  const hashedPassword = await hash(password, 12);

  const adminAccount = await prisma.account.upsert({
    where: { email },
    update: {
      name: adminName,
    },
    create: {
      name: adminName,
      email,
      password: hashedPassword
    }
  });

  return adminAccount;
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)

    await prisma.$disconnect()

    process.exit(1)
  })
