import { MongoClient } from "mongodb";
import fs from "fs";

const MONGODB_URI = process.env.DATABASE_URL || process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;
const MONGODB_CERT_PATH = process.env.MONGODB_CERT_PATH;
const CA_CERT = process.env.CA_CERT;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (!MONGODB_DB) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env.local"
  );
}

if (!CA_CERT && !MONGODB_CERT_PATH) {
  throw new Error(
    "Please define the MONGODB_CERT_PATH environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  const ca = CA_CERT ? CA_CERT : fs.readFileSync(MONGODB_CERT_PATH);

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      sslValidate: true,
      sslCA: ca,
    };

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      return {
        client,
        db: client.db(MONGODB_DB),
      };
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
