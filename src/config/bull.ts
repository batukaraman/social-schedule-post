import Queue from "bull";
import redis from "./redis";

export const postStatusQueue = new Queue("post-status", {
  redis: {
    host: redis.options.host,
    port: redis.options.port,
  },
});
