import process from "process";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Seed Users
  const passwordHash = await bcrypt.hash("admin123", 10);
  const staffHash = await bcrypt.hash("staff123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@foodordering.com" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@foodordering.com",
      password: passwordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: "staff@foodordering.com" },
    update: {},
    create: {
      name: "Staff Kasir",
      email: "staff@foodordering.com",
      password: staffHash,
      role: "STAFF",
      status: "ACTIVE",
    },
  });

  console.log(`Users created: ${admin.email}, ${staff.email}`);

  // 2. Seed Units
  const unitsData = [
    { name: "Porsi", symbol: "prs", description: "Per porsi sajian" },
    { name: "Pcs", symbol: "pcs", description: "Per satuan potong" },
    { name: "Gelas / Cup", symbol: "cup", description: "Per gelas saji" },
    { name: "Botol", symbol: "btl", description: "Per botol kemasan" },
  ];

  const units = [];
  for (const u of unitsData) {
    const unit = await prisma.unit.upsert({
      where: { name: u.name },
      update: {},
      create: u,
    });
    units.push(unit);
  }

  // 3. Seed Categories
  const categoriesData = [
    { name: "Makanan Utama", description: "Menu hidangan utama", order: 1 },
    { name: "Minuman", description: "Aneka minuman segar", order: 2 },
    { name: "Camilan & Snack", description: "Makanan ringan & pembuka", order: 3 },
  ];

  const categories = [];
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { name: c.name },
      update: {},
      create: c,
    });
    categories.push(cat);
  }

  // 4. Seed Products
  const sampleProducts = [
    {
      name: "Nasi Goreng Spesial",
      sku: "FD-NGS-01",
      costPrice: 15000,
      sellingPrice: 28000,
      stock: 50,
      minStock: 5,
      categoryId: categories[0].id,
      unitId: units[0].id,
      description: "Nasi goreng dengan telur, suwiran ayam, dan sosis.",
      status: "ACTIVE",
    },
    {
      name: "Ayam Bakar Madu",
      sku: "FD-ABM-02",
      costPrice: 18000,
      sellingPrice: 32000,
      stock: 35,
      minStock: 5,
      categoryId: categories[0].id,
      unitId: units[0].id,
      description: "Ayam bakar bumbu kecap madu disajikan dengan sambal terasi.",
      status: "ACTIVE",
    },
    {
      name: "Es Teh Manis",
      sku: "DR-ETM-01",
      costPrice: 2000,
      sellingPrice: 6000,
      stock: 100,
      minStock: 10,
      categoryId: categories[1].id,
      unitId: units[2].id,
      description: "Teh manis segar dengan es batu.",
      status: "ACTIVE",
    },
    {
      name: "Kentang Goreng",
      sku: "SN-KTR-01",
      costPrice: 8000,
      sellingPrice: 16000,
      stock: 40,
      minStock: 5,
      categoryId: categories[2].id,
      unitId: units[0].id,
      description: "French fries renyah dengan bumbu gurih.",
      status: "ACTIVE",
    },
  ];

  for (const prod of sampleProducts) {
    const existing = await prisma.product.findFirst({
      where: { sku: prod.sku },
    });
    if (!existing) {
      await prisma.product.create({
        data: prod,
      });
    }
  }

  // 5. Seed Customer
  const customer = await prisma.customer.upsert({
    where: { email: "budi@example.com" },
    update: {},
    create: {
      name: "Budi Santoso",
      email: "budi@example.com",
      phone: "08123456789",
      address: "Jl. Sudirman No. 12, Jakarta",
    },
  });

  console.log(`✅ Sample customer created: ${customer.name}`);
  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
