
import "dotenv/config";
import { hash } from "bcrypt";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient, Role } from "../src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

const librarianNameValue = process.env.LIBRARIAN_NAME?.trim();
const librarianEmailValue = process.env.LIBRARIAN_EMAIL
  ?.trim()
  .toLowerCase();
const librarianPasswordValue = process.env.LIBRARIAN_PASSWORD;

if (
  !librarianNameValue ||
  !librarianEmailValue ||
  !librarianPasswordValue
) {
  throw new Error(
    "LIBRARIAN_NAME, LIBRARIAN_EMAIL and LIBRARIAN_PASSWORD must be configured.",
  );
}

const librarianName: string = librarianNameValue;
const librarianEmail: string = librarianEmailValue;
const librarianPassword: string = librarianPasswordValue;

if (Buffer.byteLength(librarianPassword, "utf8") < 8) {
  throw new Error("Librarian password must contain at least 8 bytes.");
}

if (Buffer.byteLength(librarianPassword, "utf8") > 72) {
  throw new Error("Librarian password cannot exceed 72 bytes.");
}

const adapter = new PrismaNeon({
  connectionString,
  connectionTimeoutMillis: 15000,
  max: 10,
});

const prisma = new PrismaClient({ adapter });

const genres = [
  {
    name: "African Literature",
    slug: "african-literature",
  },
  {
    name: "Contemporary Fiction",
    slug: "contemporary-fiction",
  },
  {
    name: "Fantasy",
    slug: "fantasy",
  },
  {
    name: "Science Fiction",
    slug: "science-fiction",
  },
  {
    name: "Historical Fiction",
    slug: "historical-fiction",
  },
];

const books = [
  {
    title: "Things Fall Apart",
    author: "Chinua Achebe",
    isbn: "9789966463630",
    totalCopies: 12,
    availableCopies: 8,
    genreSlug: "african-literature",
  },
  {
    title: "Weep Not, Child",
    author: "NgÅ©gÄ© wa Thiong'o",
    isbn: "9789966460011",
    totalCopies: 8,
    availableCopies: 5,
    genreSlug: "african-literature",
  },
  {
    title: "The River Between",
    author: "NgÅ©gÄ© wa Thiong'o",
    isbn: "9789966460028",
    totalCopies: 10,
    availableCopies: 7,
    genreSlug: "african-literature",
  },
  {
    title: "A Grain of Wheat",
    author: "NgÅ©gÄ© wa Thiong'o",
    isbn: "9780141186993",
    totalCopies: 7,
    availableCopies: 4,
    genreSlug: "african-literature",
  },
  {
    title: "The Joys of Motherhood",
    author: "Buchi Emecheta",
    isbn: "9780435906849",
    totalCopies: 6,
    availableCopies: 3,
    genreSlug: "african-literature",
  },
  {
    title: "Americanah",
    author: "Chimamanda Ngozi Adichie",
    isbn: "9780307455925",
    totalCopies: 9,
    availableCopies: 6,
    genreSlug: "contemporary-fiction",
  },
  {
    title: "Half of a Yellow Sun",
    author: "Chimamanda Ngozi Adichie",
    isbn: "9781400044160",
    totalCopies: 8,
    availableCopies: 5,
    genreSlug: "contemporary-fiction",
  },
  {
    title: "Homegoing",
    author: "Yaa Gyasi",
    isbn: "9780241975237",
    totalCopies: 7,
    availableCopies: 4,
    genreSlug: "contemporary-fiction",
  },
  {
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    isbn: "9781594631931",
    totalCopies: 10,
    availableCopies: 6,
    genreSlug: "contemporary-fiction",
  },
  {
    title: "A Game of Thrones",
    author: "George R. R. Martin",
    isbn: "9780007428540",
    totalCopies: 11,
    availableCopies: 7,
    genreSlug: "fantasy",
  },
  {
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    isbn: "9780756404741",
    totalCopies: 6,
    availableCopies: 3,
    genreSlug: "fantasy",
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J. K. Rowling",
    isbn: "9781408894620",
    totalCopies: 15,
    availableCopies: 11,
    genreSlug: "fantasy",
  },
  {
    title: "The Golden Compass",
    author: "Philip Pullman",
    isbn: "9780375823459",
    totalCopies: 8,
    availableCopies: 5,
    genreSlug: "fantasy",
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    isbn: "9781399611176",
    totalCopies: 9,
    availableCopies: 6,
    genreSlug: "science-fiction",
  },
  {
    title: "The Martian",
    author: "Andy Weir",
    isbn: "9780553418026",
    totalCopies: 7,
    availableCopies: 4,
    genreSlug: "science-fiction",
  },
  {
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    isbn: "9781451673319",
    totalCopies: 10,
    availableCopies: 8,
    genreSlug: "science-fiction",
  },
  {
    title: "The Left Hand of Darkness",
    author: "Ursula K. Le Guin",
    isbn: "9781473225947",
    totalCopies: 6,
    availableCopies: 3,
    genreSlug: "science-fiction",
  },
  {
    title: "The Book Thief",
    author: "Markus Zusak",
    isbn: "9780375842207",
    totalCopies: 12,
    availableCopies: 8,
    genreSlug: "historical-fiction",
  },
  {
    title: "The Nightingale",
    author: "Kristin Hannah",
    isbn: "9781250080400",
    totalCopies: 9,
    availableCopies: 5,
    genreSlug: "historical-fiction",
  },
  {
    title: "Memoirs of a Geisha",
    author: "Arthur Golden",
    isbn: "9780679781585",
    totalCopies: 7,
    availableCopies: 4,
    genreSlug: "historical-fiction",
  },
  {
    title: "All the Light We Cannot See",
    author: "Anthony Doerr",
    isbn: "9781476746586",
    totalCopies: 8,
    availableCopies: 5,
    genreSlug: "historical-fiction",
  },
];

async function main(): Promise<void> {
  await prisma.$connect();

  const passwordHash: string = await hash(librarianPassword, 12);

  await prisma.user.upsert({
    where: {
      email: librarianEmail,
    },
    update: {
      name: librarianName,
      passwordHash,
      role: Role.LIBRARIAN,
    },
    create: {
      name: librarianName,
      email: librarianEmail,
      passwordHash,
      role: Role.LIBRARIAN,
    },
  });

  console.log("Librarian account seeded successfully.");

  const genreIds = new Map<string, number>();

  for (const genre of genres) {
    const savedGenre = await prisma.genre.upsert({
      where: {
        slug: genre.slug,
      },
      update: {
        name: genre.name,
      },
      create: genre,
    });

    genreIds.set(genre.slug, savedGenre.id);
  }

  for (const book of books) {
    const genreId = genreIds.get(book.genreSlug);

    if (genreId === undefined) {
      throw new Error(`Genre not found: ${book.genreSlug}`);
    }

    const { genreSlug, ...bookData } = book;

    await prisma.book.upsert({
      where: {
        isbn: book.isbn,
      },
      update: {
        ...bookData,
        genreId,
      },
      create: {
        ...bookData,
        genreId,
      },
    });
  }

  console.log("Library database seeding completed successfully.");
  console.log(`Genres processed: ${genres.length}`);
  console.log(`Books processed: ${books.length}`);
}

main()
  .catch((error: unknown) => {
    console.error("Database seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
