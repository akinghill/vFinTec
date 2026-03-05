import "dotenv/config";
import { prisma } from "../src/server/db";
import { faker } from "@faker-js/faker";

async function main() {
    console.log("Seeding database...");

    // 1. Clear existing tables deterministically
    await prisma.transaction.deleteMany();
    await prisma.membership.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.user.deleteMany();

    console.log("Cleared existing data.");

    // 2. Create organizations
    const vector = await prisma.organization.create({
        data: { name: "Vector Holdings" }
    });
    const atlas = await prisma.organization.create({
        data: { name: "Atlas Capital" }
    });

    console.log("Created organizations.");

    // 3. Create users
    const vectorUsers = [
        { email: "admin@vector.com", name: "Vector Admin" },
        { email: "manager@vector.com", name: "Vector Finance Manager" },
        { email: "viewer@vector.com", name: "Vector Viewer" }
    ];

    const atlasUsers = [
        { email: "admin@atlas.com", name: "Atlas Admin" },
        { email: "manager@atlas.com", name: "Atlas Finance Manager" },
        { email: "viewer@atlas.com", name: "Atlas Viewer" }
    ];

    // Helper function to create users and assign memberships
    async function seedOrgUsers(orgId: string, users: typeof vectorUsers) {
        const createdUsers = await Promise.all(
            users.map(u => prisma.user.create({ data: u }))
        );

        // Assign roles based on email
        await prisma.membership.create({
            data: { userId: createdUsers[0].id, organizationId: orgId, role: "ADMIN" }
        });
        await prisma.membership.create({
            data: { userId: createdUsers[1].id, organizationId: orgId, role: "FINANCIAL_MANAGER" }
        });
        await prisma.membership.create({
            data: { userId: createdUsers[2].id, organizationId: orgId, role: "VIEWER" }
        });

        return createdUsers;
    }

    const vectorCreatedUsers = await seedOrgUsers(vector.id, vectorUsers);
    const atlasCreatedUsers = await seedOrgUsers(atlas.id, atlasUsers);

    console.log("Created users and assigned memberships.");

    // 4. Generate transactions
    const categories = ["Revenue", "Infrastructure", "Payroll", "Marketing", "Software", "Operations"];

    async function seedTransactions(orgId: string, createdUsers: { id: string }[]) {
        // Determine random number between 40 and 60
        const count = faker.number.int({ min: 40, max: 60 });
        const transactions = Array.from({ length: count }).map(() => ({
            organizationId: orgId,
            // Random user from the org created it
            createdById: createdUsers[faker.number.int({ min: 0, max: 2 })].id,
            amount: faker.number.int({ min: -5000, max: 12000 }),
            category: faker.helpers.arrayElement(categories),
            description: faker.company.buzzPhrase(),
            createdAt: faker.date.recent({ days: 60 }),
        }));

        await prisma.transaction.createMany({ data: transactions });
        return count;
    }

    const vCount = await seedTransactions(vector.id, vectorCreatedUsers);
    const aCount = await seedTransactions(atlas.id, atlasCreatedUsers);

    console.log(`Created ${vCount} transactions for Vector Holdings.`);
    console.log(`Created ${aCount} transactions for Atlas Capital.`);

    console.log("Seeding finished successfully.");
}

main()
    .catch((e) => {
        console.error("Error during seeding", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
