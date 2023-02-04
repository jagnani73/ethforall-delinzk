import { createClient, RedisClientType } from "redis";
class CacheService {
  private static cache: RedisClientType | null = null;
  private constructor() {}
  public static async initCache() {
    CacheService.cache = createClient({
      socket: {
        host: process.env.REDIS_HOST!,
        port: +process.env.REDIS_PORT!,
      },
      username: process.env.REDIS_USERNAME!,
      password: process.env.REDIS_PASSWORD!,
    });
    await this.cache?.connect();
    process.on("SIGINT", () => this.cache?.disconnect());
    process.on("SIGHUP", () => this.cache?.disconnect());
    console.log("Redis initiated successfully!");
  }
  public static async getCache() {
    if (this.cache) {
      return this.cache;
    } else {
      await this.initCache();
      return this.cache;
    }
  }
}

export default CacheService;
