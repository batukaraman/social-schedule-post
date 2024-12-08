import { Job } from "bull";
import { updatePostStatusToPublished } from "../services/postService";

export const processPostStatusJob = async (job: Job) => {
  const { postId } = job.data;

  try {
    await updatePostStatusToPublished(postId);
    console.log(`Post ${postId} successfully updated to "published".`);
  } catch (error) {
    console.error(`Failed to update post ${postId}:`, error);
    throw error;
  }
};