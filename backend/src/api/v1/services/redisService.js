import redis from "redis";
import { InternalServerError } from "../../utils/errors.js";

// Create and configure Redis client
export const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

// Handle Redis errors
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
  throw new InternalServerError();
});

// Connect to Redis
export const initRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Redis connection error:", err);
    throw err;
  }
};
