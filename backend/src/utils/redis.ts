import { Redis } from "ioredis";
require("dotenv").config();

const redisClient = () => {
  if (process.env.REDIS_URL) {
    console.log("Redis connecting...");
    return process.env.REDIS_URL;
  }
  throw new Error("Redis connection failed - REDIS_URL not set");
};

export const redis = new Redis(redisClient(), {
  maxRetriesPerRequest: null,
  retryStrategy(times) {
    return Math.min(times * 200, 2000);
  },
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.log("Redis error:", err.message));