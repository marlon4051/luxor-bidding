import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const users = await Promise.all(
    Array.from({ length: 10 }, async (_, index) => {
      const password = "password";
      const hashedPassword = await bcrypt.hash(password, 10);

      return prisma.user.create({
        data: {
          name: `User ${index + 1}`,
          email: `user${index + 1}@example.com`,
          password: hashedPassword,
        },
      });
    })
  );

  // Create 10 collections
  const collections = await Promise.all(
    Array.from({ length: 100 }, (_, index) => {
      return prisma.collection.create({
        data: {
          name: `Collection ${index + 1}`,
          description: `Description of Collection ${index + 1}`,
          stocks: 100,
          price: Math.random() * 100 + 1,
          userId: users[Math.floor(Math.random() * users.length)].id,
        },
      });
    })
  );

  // Create 10 bids for collection
  await Promise.all(
    collections.map((collection) => {
      return Promise.all(
        Array.from({ length: 10 }, (_, index) => {
          return prisma.bid.create({
            data: {
              price: Math.random() * 100 + 1,
              status: "pending",
              collectionId: collection.id,
              userId: users[Math.floor(Math.random() * users.length)].id, 
            },
          });
        })
      );
    })
  );

  console.log("Data seeding completed");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
