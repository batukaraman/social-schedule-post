import { postStatusQueue } from "../config/bull";
import { processPostStatusJob } from "../jobs/postStatusJob";

postStatusQueue.process(processPostStatusJob);

export const schedulePostStatusUpdate = (
  postId: number,
  scheduleDate: Date
) => {
  postStatusQueue.add(
    { postId },
    {
      delay: scheduleDate.getTime() - Date.now(),
      attempts: 3,
      backoff: 10000,
    }
  );
};
