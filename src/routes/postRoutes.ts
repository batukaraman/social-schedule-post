import { Router } from "express";
import {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  updatePost,
} from "../controllers/postController";
import { authenticateUser } from "../utils/auth";
import { fileUpload } from "../middleware/uploadMiddleware";

const router = Router();

router.use(authenticateUser);

router.post("/create", fileUpload, async (req, res, next) => {
  try {
    await createPost(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    await getPosts(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    await getPostById(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deletePost(req, res);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", fileUpload, async (req, res, next) => {
  try {
    await updatePost(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
