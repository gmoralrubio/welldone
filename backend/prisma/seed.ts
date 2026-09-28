import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { username: 'John' },
    update: {},
    create: {
      email: 'john@example.com',
      password: 'seed-password',
      name: 'John',
      surname: 'Doe',
      username: 'jdoe',
    },
  });

  await prisma.article.upsert({
    where: {
      authorId_slug: { authorId: user.id, slug: 'mi-primer-articulo' },
    },
    update: {},
    create: {
      title: 'Mi primer artículo',
      intro: 'Introducción de prueba',
      content: 'Contenido de prueba',
      slug: 'mi-primer-articulo',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-01-15T10:00:00.000Z'),
      authorId: user.id,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
