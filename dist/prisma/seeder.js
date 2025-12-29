import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { getPrisma } from "../database.js";
import fs from "fs";
import path from "path";
const prisma = getPrisma();
// Config
const NUM_ADMINS = 2;
const NUM_LIBRARIANS = 3;
const NUM_MEMBERS = 20;
const NUM_AUTHORS = 15;
const NUM_CATEGORIES = 8;
const NUM_BOOKS = 50;
const NUM_TRANSACTIONS = 30;
// Fixed credentials for testing
const TEST_CREDENTIALS = {
    ADMIN: { password: "admin123" },
    LIBRARIAN: { password: "librarian123" },
    MEMBER: { password: "member123" }
};
async function findOrCreateAuthor(name, bio, birthDate) {
    const existingAuthor = await prisma.author.findFirst({
        where: { name }
    });
    if (existingAuthor) {
        return existingAuthor;
    }
    return await prisma.author.create({
        data: { name, bio, birthDate }
    });
}
async function seedData() {
    console.log("\uD83D\uDE80 Starting database seeding...");
    console.log("=".repeat(50));
    // Clear existing data
    console.log("\uD83E\uDDF9 Clearing existing data...");
    await prisma.transactionItem.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.category.deleteMany();
    await prisma.member.deleteMany();
    await prisma.user.deleteMany();
    // Arrays to store created data
    const createdData = {
        admins: [],
        librarians: [],
        members: [],
        users: [],
        categories: [],
        authors: [],
        books: [],
        membersData: []
    };
    // ======================
    // 1. SEED USERS
    // ======================
    console.log("\n\uD83D\uDC65 Seeding users...");
    // Admin Users (fixed emails for easy testing)
    for (let i = 1; i <= NUM_ADMINS; i++) {
        const email = `admin${i}@library.com`;
        const password = await bcrypt.hash(TEST_CREDENTIALS.ADMIN.password, 10);
        const admin = await prisma.user.create({
            data: {
                username: `admin${i}`,
                email,
                password,
                name: `Admin ${i}`,
                role: "ADMIN",
            },
        });
        createdData.admins.push(admin);
        createdData.users.push(admin);
        console.log(`  ✅ Admin ${i}: ${email} / ${TEST_CREDENTIALS.ADMIN.password}`);
    }
    // Librarian Users (fixed emails for testing)
    for (let i = 1; i <= NUM_LIBRARIANS; i++) {
        const email = `librarian${i}@library.com`;
        const password = await bcrypt.hash(TEST_CREDENTIALS.LIBRARIAN.password, 10);
        const librarian = await prisma.user.create({
            data: {
                username: `librarian${i}`,
                email,
                password,
                name: `Petugas Perpustakaan ${i}`,
                role: "LIBRARIAN",
            },
        });
        createdData.librarians.push(librarian);
        createdData.users.push(librarian);
        console.log(`  ✅ Librarian ${i}: ${email} / ${TEST_CREDENTIALS.LIBRARIAN.password}`);
    }
    // Member Users (fixed first 5 for testing, rest random)
    for (let i = 1; i <= NUM_MEMBERS; i++) {
        // First 5 members have fixed emails for testing
        const email = i <= 5
            ? `member${i}@library.com`
            : faker.internet.email();
        const password = await bcrypt.hash(TEST_CREDENTIALS.MEMBER.password, 10);
        const name = i <= 5
            ? `Anggota ${i}`
            : faker.person.fullName();
        const user = await prisma.user.create({
            data: {
                username: i <= 5 ? `member${i}` : faker.internet.username(),
                email,
                password,
                name,
                role: "MEMBER",
            },
        });
        const member = await prisma.member.create({
            data: {
                kodeMember: `MEM${String(i).padStart(4, "0")}`,
                nama: name,
                email,
                telepon: faker.helpers.fromRegExp(/08[0-9]{10}/),
                alamat: faker.location.streetAddress(),
                status: faker.helpers.arrayElement(["ACTIVE", "ACTIVE", "ACTIVE", "INACTIVE"]),
                userId: user.id,
            },
        });
        createdData.members.push(user);
        createdData.membersData.push(member);
        createdData.users.push(user);
        if (i <= 5) {
            console.log(`  ✅ Member ${i}: ${email} / ${TEST_CREDENTIALS.MEMBER.password}`);
        }
    }
    // ======================
    // 2. SEED CATEGORIES
    // ======================
    console.log("\n\uD83D\uDCC2 Seeding categories...");
    const categoryNames = [
        "Fiksi",
        "Non-Fiksi",
        "Pendidikan",
        "Teknologi",
        "Sastra",
        "Sejarah",
        "Bisnis",
        "Psikologi"
    ];
    for (let i = 0; i < NUM_CATEGORIES; i++) {
        const category = await prisma.category.create({
            data: {
                name: categoryNames[i] || faker.word.noun(),
                description: faker.lorem.sentence(),
            },
        });
        createdData.categories.push(category);
        console.log(`  ✅ Category: ${category.name}`);
    }
    // ======================
    // 3. SEED AUTHORS
    // ======================
    console.log("\n\u270D\uFE0F Seeding authors...");
    // Popular Indonesian authors (fixed for realism)
    const popularAuthors = [
        { name: "Andrea Hirata", bio: "Penulis novel bestseller Laskar Pelangi", birthDate: new Date("1967-10-24") },
        { name: "Pramoedya Ananta Toer", bio: "Sastrawan Indonesia terkemuka", birthDate: new Date("1925-02-06") },
        { name: "Tere Liye", bio: "Penulis novel Indonesia kontemporer", birthDate: new Date("1979-05-21") },
        { name: "Dee Lestari", bio: "Penulis dan penyanyi Indonesia", birthDate: new Date("1976-01-20") },
        { name: "Eka Kurniawan", bio: "Penulis novel Cantik Itu Luka", birthDate: new Date("1975-11-28") },
    ];
    // Seed popular authors first
    for (const authorData of popularAuthors) {
        const author = await findOrCreateAuthor(authorData.name, authorData.bio, authorData.birthDate);
        createdData.authors.push(author);
        console.log(`  ✅ Author: ${author.name}`);
    }
    // Seed random authors
    for (let i = popularAuthors.length; i < NUM_AUTHORS; i++) {
        const author = await findOrCreateAuthor(faker.person.fullName(), faker.lorem.paragraph(), faker.date.birthdate({ min: 1900, max: 2000, mode: "year" }));
        createdData.authors.push(author);
    }
    // ======================
    // 4. SEED BOOKS
    // ======================
    console.log("\n\uD83D\uDCDA Seeding books...");
    // Popular books (fixed for realism)
    const popularBooks = [
        { title: "Laskar Pelangi", isbn: "9789793062792", year: 2005, authorIndex: 0, categoryIndex: 0 },
        { title: "Bumi Manusia", isbn: "9789794166948", year: 1980, authorIndex: 1, categoryIndex: 5 },
        { title: "Harry Potter dan Batu Bertuah", isbn: "9786020382958", year: 2000, authorIndex: 2, categoryIndex: 0 },
        { title: "Supernova: Kesatria, Puteri, dan Bintang Jatuh", isbn: "9789792239844", year: 2001, authorIndex: 3, categoryIndex: 0 },
        { title: "Cantik Itu Luka", isbn: "9789793663527", year: 2002, authorIndex: 4, categoryIndex: 4 },
    ];
    // Seed popular books first
    for (const bookData of popularBooks) {
        if (createdData.authors[bookData.authorIndex] && createdData.categories[bookData.categoryIndex]) {
            const book = await prisma.book.create({
                data: {
                    title: bookData.title,
                    isbn: bookData.isbn,
                    description: faker.lorem.paragraphs({ min: 1, max: 2 }),
                    year: bookData.year,
                    stock: faker.number.int({ min: 5, max: 20 }),
                    coverImage: "/public/uploads/default-book.jpg",
                    authorId: createdData.authors[bookData.authorIndex].id,
                    categoryId: createdData.categories[bookData.categoryIndex].id,
                },
            });
            createdData.books.push(book);
            console.log(`  ✅ Book: "${book.title}" by ${createdData.authors[bookData.authorIndex].name}`);
        }
    }
    // Seed random books
    const usedISBNs = new Set(popularBooks.map(b => b.isbn));
    for (let i = popularBooks.length; i < NUM_BOOKS; i++) {
        let isbn = faker.string.numeric(13);
        while (usedISBNs.has(isbn))
            isbn = faker.string.numeric(13);
        usedISBNs.add(isbn);
        const book = await prisma.book.create({
            data: {
                title: faker.lorem.words({ min: 1, max: 5 }),
                isbn,
                description: faker.lorem.paragraphs({ min: 1, max: 3 }),
                year: faker.number.int({ min: 1900, max: 2024 }),
                stock: faker.number.int({ min: 1, max: 20 }),
                coverImage: "/public/uploads/default-book.jpg",
                authorId: faker.helpers.arrayElement(createdData.authors).id,
                categoryId: faker.helpers.arrayElement(createdData.categories).id,
            },
        });
        createdData.books.push(book);
    }
    // ======================
    // 5. SEED TRANSACTIONS
    // ======================
    console.log("\n\uD83D\uDCB0 Seeding transactions...");
    // Create some active members for transactions
    const activeMembers = createdData.membersData.filter(m => m.status === "ACTIVE");
    for (let i = 1; i <= NUM_TRANSACTIONS; i++) {
        const member = faker.helpers.arrayElement(activeMembers);
        const borrowDate = faker.date.past({ years: 1 });
        const dueDate = new Date(borrowDate);
        dueDate.setDate(dueDate.getDate() + 14);
        const status = faker.helpers.weightedArrayElement([
            { value: "BORROWED", weight: 0.3 },
            { value: "RETURNED", weight: 0.6 },
            { value: "OVERDUE", weight: 0.05 },
            { value: "CANCELLED", weight: 0.05 }
        ]);
        let returnDate = null;
        if (status === "RETURNED") {
            returnDate = new Date(borrowDate);
            returnDate.setDate(returnDate.getDate() + faker.number.int({ min: 1, max: 14 }));
        }
        const numBooks = faker.number.int({ min: 1, max: 3 });
        const selectedBooks = faker.helpers.arrayElements(createdData.books, numBooks);
        const transaction = await prisma.transaction.create({
            data: {
                memberId: member.id,
                dueDate,
                returnDate,
                status: status,
                items: {
                    create: selectedBooks.map(book => ({
                        bookId: book.id,
                        quantity: faker.number.int({ min: 1, max: 2 }),
                    })),
                },
            },
            include: { items: true },
        });
        // Update book stock
        for (const item of transaction.items) {
            await prisma.book.update({
                where: { id: item.bookId },
                data: { stock: { decrement: item.quantity } },
            });
        }
        if (i <= 5) {
            console.log(`  ✅ Transaction ${i}: ${member.kodeMember} borrowed ${numBooks} books`);
        }
    }
    // Create some overdue transactions
    console.log("\n\u23F0 Creating overdue transactions...");
    const overdueMembers = activeMembers.slice(0, 3);
    for (const member of overdueMembers) {
        const borrowDate = new Date();
        borrowDate.setDate(borrowDate.getDate() - 21);
        const dueDate = new Date(borrowDate);
        dueDate.setDate(dueDate.getDate() + 14);
        const book = faker.helpers.arrayElement(createdData.books);
        await prisma.transaction.create({
            data: {
                memberId: member.id,
                dueDate,
                status: "BORROWED",
                items: { create: [{ bookId: book.id, quantity: 1 }] },
            },
        });
        await prisma.book.update({
            where: { id: book.id },
            data: { stock: { decrement: 1 } },
        });
    }
    return createdData;
}
// ======================
// MAIN EXECUTION
// ======================
async function main() {
    try {
        const createdData = await seedData();
        // ======================
        // DISPLAY TESTING INFO
        // ======================
        console.log("\n" + "=".repeat(50));
        console.log("\uD83C\uDF89 DATABASE SEEDING COMPLETED!");
        console.log("=".repeat(50));
        console.log("\n\uD83D\uDD10 TESTING CREDENTIALS:");
        console.log("=".repeat(30));
        console.log("\n\uD83D\uDC51 ADMIN ACCOUNTS:");
        createdData.admins.forEach((admin, idx) => {
            console.log(`${idx + 1}. Email: ${admin.email}`);
            console.log(`   Password: ${TEST_CREDENTIALS.ADMIN.password}`);
            console.log(`   Username: ${admin.username}`);
        });
        console.log("\n\uD83D\uDCDA LIBRARIAN ACCOUNTS:");
        createdData.librarians.forEach((librarian, idx) => {
            console.log(`${idx + 1}. Email: ${librarian.email}`);
            console.log(`   Password: ${TEST_CREDENTIALS.LIBRARIAN.password}`);
            console.log(`   Username: ${librarian.username}`);
        });
        console.log("\n\uD83D\uDC65 MEMBER ACCOUNTS (First 5 for testing):");
        createdData.members.slice(0, 5).forEach((member, idx) => {
            console.log(`${idx + 1}. Email: ${member.email}`);
            console.log(`   Password: ${TEST_CREDENTIALS.MEMBER.password}`);
            console.log(`   Username: ${member.username}`);
        });
        // ======================
        // DISPLAY SUMMARY
        // ======================
        console.log("\n\uD83D\uDCCA SEEDING SUMMARY:");
        console.log("=".repeat(30));
        console.log(`👤 Total Users: ${createdData.users.length}`);
        console.log(`   ├─ Admin: ${createdData.admins.length}`);
        console.log(`   ├─ Librarian: ${createdData.librarians.length}`);
        console.log(`   └─ Member: ${createdData.members.length}`);
        console.log(`📚 Books: ${createdData.books.length}`);
        console.log(`✍️ Authors: ${createdData.authors.length}`);
        console.log(`📂 Categories: ${createdData.categories.length}`);
        console.log(`👥 Members: ${createdData.membersData.length}`);
        const transactionCount = await prisma.transaction.count();
        console.log(`💰 Transactions: ${transactionCount}`);
        // ======================
        // TESTING INSTRUCTIONS
        // ======================
        console.log("\n\uD83D\uDE80 QUICK START FOR TESTING:");
        console.log("=".repeat(30));
        console.log("\n1. Login as Admin:");
        console.log(`   curl -X POST http://localhost:3000/api/auth/login \\`);
        console.log(`     -H "Content-Type: application/json" \\`);
        console.log(`     -d '{"email": "admin1@library.com", "password": "${TEST_CREDENTIALS.ADMIN.password}"}'`);
        console.log("\n2. Get your token from response");
        console.log("\n3. Test protected endpoint:");
        console.log(`   curl -X GET http://localhost:3000/api/books/stats \\`);
        console.log(`     -H "Authorization: Bearer YOUR_TOKEN_HERE"`);
        console.log("\n4. Or use Swagger UI:");
        console.log(`   Open: http://localhost:3000/api-docs`);
        console.log(`   Click "Authorize" button`);
        console.log(`   Enter: Bearer YOUR_TOKEN_HERE`);
        // ======================
        // SAVE TO FILE
        // ======================
        const testData = {
            credentials: {
                admin: createdData.admins.map(a => ({
                    email: a.email,
                    password: TEST_CREDENTIALS.ADMIN.password,
                    username: a.username
                })),
                librarian: createdData.librarians.map(l => ({
                    email: l.email,
                    password: TEST_CREDENTIALS.LIBRARIAN.password,
                    username: l.username
                })),
                member: createdData.members.slice(0, 5).map(m => ({
                    email: m.email,
                    password: TEST_CREDENTIALS.MEMBER.password,
                    username: m.username
                }))
            },
            stats: {
                users: createdData.users.length,
                books: createdData.books.length,
                authors: createdData.authors.length,
                categories: createdData.categories.length,
                members: createdData.membersData.length,
                transactions: transactionCount
            },
            sampleBooks: createdData.books.slice(0, 3).map(b => ({
                title: b.title,
                isbn: b.isbn,
                year: b.year,
                stock: b.stock
            }))
        };
        const filePath = path.join(__dirname, "test-accounts.json");
        fs.writeFileSync(filePath, JSON.stringify(testData, null, 2));
        console.log(`\n💾 Test data saved to: ${filePath}`);
        console.log("\n" + "=".repeat(50));
        console.log("\u2705 Ready for testing! Happy coding! \uD83D\uDE80");
        console.log("=".repeat(50));
    }
    catch (error) {
        console.error("\n\u274C Error seeding database:", error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
// Execute
main();
//# sourceMappingURL=seeder.js.map
