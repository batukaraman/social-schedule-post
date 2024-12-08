import { Request, Response } from "express";
import {
  createUserPost,
  fetchUserPosts,
  fetchPostById,
  deleteUserPost,
  updateUserPost,
} from "../services/postService";
import { getFileUrl } from "../services/mediaService";
import { DateTime } from "luxon";
import { schedulePostStatusUpdate } from "../queues/postStatusQueue";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { caption, scheduleDate, status, timezone } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (status === "scheduled" && !scheduleDate) {
      return res
        .status(400)
        .json({ error: "Scheduled posts require a scheduleDate." });
    }

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ error: "A post must have at least one image." });
    }

    const imageUrls = files.map((file) => getFileUrl(file.filename));

    const userTimezone = timezone || "Europe/Istanbul";
    const utcDate = DateTime.fromISO(scheduleDate, { zone: userTimezone })
      .toUTC()
      .toJSDate();

    const post = await createUserPost(
      caption,
      utcDate,
      userId,
      imageUrls,
      status
    );

    if (post.status === "scheduled") {
      schedulePostStatusUpdate(post.id, new Date(scheduleDate));
    }

    res.status(201).json(post);
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    res.status(400).json({ error: err.message });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const posts = await fetchUserPosts(userId);
    res.status(200).json(posts);
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    res.status(500).json({ error: err.message });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const post = await fetchPostById(postId, userId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    res.status(500).json({ error: err.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const result = await deleteUserPost(postId, userId);

    res.status(200).json(result);
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    res.status(400).json({ error: err.message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { caption, scheduleDate, status, removedImageIds, timezone } =
      req.body;
    const postId = req.params.id;
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    if (status === "scheduled" && !scheduleDate) {
      return res
        .status(400)
        .json({ error: "Scheduled posts require a scheduleDate." });
    }

    const files = req.files as Express.Multer.File[];
    const newImageUrls = files.map((file) => getFileUrl(file.filename));

    const userTimezone = timezone || "Europe/Istanbul";
    const utcDate = DateTime.fromISO(scheduleDate, { zone: userTimezone })
      .toUTC()
      .toJSDate();

    const updatedPost = await updateUserPost(
      postId,
      userId,
      caption,
      scheduleDate ? utcDate : null,
      newImageUrls,
      removedImageIds || [],
      status
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    res.status(400).json({ error: err.message });
  }
};
