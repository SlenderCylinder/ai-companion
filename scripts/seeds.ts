const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
    try {

        await db.category.createMany({
            data: [
                { name: "Famous People" },
                { name: "Musicians" },
                { name: "Games" },
                { name: "Movies & TV" },
                { name: "Animals" },
                { name: "Philosophy" },
                { name: "Scientists" },

            ]
        })


    } catch (error) {
        console.error("Error seeding default cateogries", error);
    } finally {
        await db.$disconnect();
    }
}

main ();