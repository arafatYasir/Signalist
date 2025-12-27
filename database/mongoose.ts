import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export const dbConnect = async () => {
    if (!MONGODB_URI) {
        throw new Error("Please provide a MONGODB_URI in the environment variables");
    }
    try {
        if (cached.conn) {
            return cached.conn;
        }
        if (!cached.promise) {
            cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then((mongoose) => {
                return mongoose;
            })
        }

        cached.conn = await cached.promise;

        console.log(`--------- Database Connected on ${process.env.NODE_ENV} ----------`);
        return cached.conn;
    } catch (e) {
        console.error(e);
        throw e;
    }
}