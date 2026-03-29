import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

export type ProductCategory =
  | "sarees"
  | "blouses"
  | "lehenga"
  | "ghagras"
  | "dupattas";

export type Product = {
  id: number;
  category: ProductCategory;
  title: string;
  description: string;
  price: number;
  fabric: string;
  imagePath: string | null;
  featured: boolean;
  createdAt: string; // ISO timestamp
};

// A single-process, file-based DB for local/dev + demos.
const dbDir = path.join(process.cwd(), "data");
const dbPath = path.join(dbDir, "bellissima.sqlite");

if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    fabric TEXT NOT NULL,
    imagePath TEXT,
    featured INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );

  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
  CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
  CREATE INDEX IF NOT EXISTS idx_products_createdAt ON products(createdAt);
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );
`);

// Demo data: seed placeholder products so the catalog renders immediately.
// Disable by setting NEXT_PUBLIC_SEED_DEMO="false".
if (process.env.NEXT_PUBLIC_SEED_DEMO !== "false") {
  const countRow = db.prepare(
    `SELECT COUNT(*) as count FROM products`
  ).get() as { count?: number } | undefined;
  const count = typeof countRow?.count === "number" ? countRow.count : 0;

  if (count === 0) {
    const createdAt = (daysAgo: number) =>
      new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

    const seed = [
      {
        category: "sarees" as const,
        title: "Blush Banarasi Saree",
        description: "Golden zari highlights with a soft blush glow.",
        price: 5999,
        fabric: "Banarasi Silk",
        imagePath: "images/sarees-1.svg",
        featured: true,
        createdAt: createdAt(6),
      },
      {
        category: "sarees" as const,
        title: "Rose Pearl Saree",
        description: "Lightweight elegance with delicate texture and shine.",
        price: 4999,
        fabric: "Art Silk",
        imagePath: "images/sarees-1.svg",
        featured: false,
        createdAt: createdAt(12),
      },
      {
        category: "sarees" as const,
        title: "Ivory Kanjivaram Saree",
        description: "Classic border detailing with a premium drape.",
        price: 7499,
        fabric: "Kanjivaram Silk",
        imagePath: "images/sarees-1.svg",
        featured: true,
        createdAt: createdAt(2),
      },

      {
        category: "blouses" as const,
        title: "Pastel Rose Blouse",
        description: "Flattering fit with refined stitching and comfort.",
        price: 1499,
        fabric: "Cotton Silk",
        imagePath: "images/blouses-1.svg",
        featured: false,
        createdAt: createdAt(5),
      },
      {
        category: "blouses" as const,
        title: "Soft Gold Zari Blouse",
        description: "Subtle gold accents to elevate your saree look.",
        price: 1899,
        fabric: "Silk Blend",
        imagePath: "images/blouses-1.svg",
        featured: true,
        createdAt: createdAt(3),
      },
      {
        category: "blouses" as const,
        title: "Ivory Satin Neck Blouse",
        description: "A smooth satin finish with premium neck detailing.",
        price: 1699,
        fabric: "Satin",
        imagePath: "images/blouses-1.svg",
        featured: false,
        createdAt: createdAt(9),
      },

      {
        category: "lehenga" as const,
        title: "Embellished Rose Lehengas",
        description: "Festive sparkle with graceful flow and rich detailing.",
        price: 8999,
        fabric: "Silk & Sequins",
        imagePath: "images/lehenga-1.svg",
        featured: true,
        createdAt: createdAt(1),
      },
      {
        category: "lehenga" as const,
        title: "Ivory Floral Lehenga",
        description: "Floral motifs with a refined pastel palette.",
        price: 8299,
        fabric: "Jacquard",
        imagePath: "images/lehenga-1.svg",
        featured: false,
        createdAt: createdAt(7),
      },
      {
        category: "lehenga" as const,
        title: "Blush Net Lehenga",
        description: "Light net feel with elegant layering and glow.",
        price: 7699,
        fabric: "Net",
        imagePath: "images/lehenga-1.svg",
        featured: false,
        createdAt: createdAt(14),
      },

      {
        category: "ghagras" as const,
        title: "Festive Ghagra in Pastel",
        description: "A soft celebratory look with premium fabric feel.",
        price: 6899,
        fabric: "Raw Silk",
        imagePath: "images/ghagras-1.svg",
        featured: false,
        createdAt: createdAt(4),
      },
      {
        category: "ghagras" as const,
        title: "Blush Pleated Ghagra",
        description: "Pleated elegance with a statement, party-ready silhouette.",
        price: 7199,
        fabric: "Pleated Fabric",
        imagePath: "images/ghagras-1.svg",
        featured: true,
        createdAt: createdAt(2),
      },
      {
        category: "ghagras" as const,
        title: "Ivory Fest Ghagra Set",
        description: "Classic ivory charm with a polished finish.",
        price: 6499,
        fabric: "Silk Blend",
        imagePath: "images/ghagras-1.svg",
        featured: false,
        createdAt: createdAt(10),
      },

      {
        category: "dupattas" as const,
        title: "Ivory Soft Dupatta",
        description: "Light drape with a premium finish and comfort.",
        price: 1999,
        fabric: "Chiffon",
        imagePath: "images/dupattas-1.svg",
        featured: false,
        createdAt: createdAt(8),
      },
      {
        category: "dupattas" as const,
        title: "Rose Gradient Dupatta",
        description: "A subtle blush gradient that pairs effortlessly.",
        price: 2299,
        fabric: "Georgette",
        imagePath: "images/dupattas-1.svg",
        featured: true,
        createdAt: createdAt(3),
      },
      {
        category: "dupattas" as const,
        title: "Soft Gold Border Dupatta",
        description: "Elegant border detailing for a complete look.",
        price: 2499,
        fabric: "Silk Blend",
        imagePath: "images/dupattas-1.svg",
        featured: false,
        createdAt: createdAt(6),
      },
    ];

    const insertStmt = db.prepare(`
      INSERT INTO products
        (category, title, description, price, fabric, imagePath, featured, createdAt)
      VALUES
        (@category, @title, @description, @price, @fabric, @imagePath, @featured, @createdAt)
    `);

    for (const p of seed) {
      insertStmt.run({
        category: p.category,
        title: p.title,
        description: p.description,
        price: p.price,
        fabric: p.fabric,
        imagePath: p.imagePath,
        featured: p.featured ? 1 : 0,
        createdAt: p.createdAt,
      });
    }
  }
}

function mapProduct(row: unknown): Product {
  const r = row as Record<string, unknown>;
  return {
    id: r.id as number,
    category: r.category as ProductCategory,
    title: r.title as string,
    description: r.description as string,
    price: r.price as number,
    fabric: r.fabric as string,
    imagePath: (r.imagePath as string | null) ?? null,
    featured: (r.featured as number) === 1,
    createdAt: r.createdAt as string,
  };
}

export function getFeaturedProducts(limit = 8): Product[] {
  const stmt = db.prepare(
    `SELECT * FROM products WHERE featured = 1 ORDER BY createdAt DESC LIMIT ?`
  );
  return stmt.all(limit).map(mapProduct);
}

export function getLatestProducts(limit = 8): Product[] {
  const stmt = db.prepare(
    `SELECT * FROM products ORDER BY createdAt DESC LIMIT ?`
  );
  return stmt.all(limit).map(mapProduct);
}

export function getAllProducts(limit = 200): Product[] {
  const stmt = db.prepare(
    `SELECT * FROM products ORDER BY createdAt DESC LIMIT ?`
  );
  return stmt.all(limit).map(mapProduct);
}

export function getProductsByCategory(
  category: ProductCategory,
  limit = 24
): Product[] {
  const stmt = db.prepare(
    `SELECT * FROM products WHERE category = ? ORDER BY createdAt DESC LIMIT ?`
  );
  return stmt.all(category, limit).map(mapProduct);
}

export function searchProducts(options: {
  q: string;
  category?: ProductCategory;
  limit?: number;
}): Product[] {
  const { q, category, limit = 24 } = options;
  const like = `%${q}%`;

  const conditions: string[] = [
    `(title LIKE ? OR description LIKE ? OR fabric LIKE ?)`,
  ];
  const params: Array<string | number> = [like, like, like];

  if (category) {
    conditions.push(`category = ?`);
    params.push(category);
  }

  const where = conditions.join(" AND ");
  const stmt = db.prepare(
    `SELECT * FROM products WHERE ${where} ORDER BY createdAt DESC LIMIT ?`
  );
  return stmt.all(...params, limit).map(mapProduct);
}

export function getProductById(id: number): Product | null {
  const stmt = db.prepare(`SELECT * FROM products WHERE id = ? LIMIT 1`);
  const row = stmt.get(id);
  return row ? mapProduct(row) : null;
}

export function insertProduct(input: Omit<Product, "id" | "createdAt">) {
  const stmt = db.prepare(
    `
      INSERT INTO products (category, title, description, price, fabric, imagePath, featured)
      VALUES (@category, @title, @description, @price, @fabric, @imagePath, @featured)
    `
  );
  const info = stmt.run({
    ...input,
    featured: input.featured ? 1 : 0,
    imagePath: input.imagePath ?? null,
  });
  return getProductById(Number(info.lastInsertRowid));
}

export function updateProduct(
  id: number,
  input: Omit<Product, "id" | "createdAt">
) {
  const stmt = db.prepare(
    `
      UPDATE products
      SET category = @category,
          title = @title,
          description = @description,
          price = @price,
          fabric = @fabric,
          imagePath = @imagePath,
          featured = @featured
      WHERE id = @id
    `
  );
  stmt.run({
    id,
    ...input,
    featured: input.featured ? 1 : 0,
    imagePath: input.imagePath ?? null,
  });
  return getProductById(id);
}

export function deleteProduct(id: number): void {
  const stmt = db.prepare(`DELETE FROM products WHERE id = ?`);
  stmt.run(id);
}

export function insertInquiry(input: {
  name: string;
  phone: string;
  email?: string;
  message: string;
}) {
  const stmt = db.prepare(
    `
      INSERT INTO inquiries (name, phone, email, message)
      VALUES (@name, @phone, @email, @message)
    `
  );
  stmt.run({
    ...input,
    email: input.email ?? null,
  });
}

