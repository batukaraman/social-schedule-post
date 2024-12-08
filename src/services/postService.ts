import { deleteFile } from "./mediaService";
import Media from "../models/Media";
import Post from "../models/Post";

export const createUserPost = async (
  caption: string,
  scheduleDate: Date | null,
  userId: string,
  imageUrls: string[],
  status: "scheduled" | "published" | "draft"
) => {
  const post = await Post.create(
    {
      caption,
      scheduleDate,
      status,
      userId,
      media: imageUrls.map((url) => ({ url })),
    },
    {
      include: [{ model: Media, as: "media" }],
    }
  );

  return post;
};

export const fetchUserPosts = async (userId: string) => {
  const posts = await Post.findAll({
    where: { userId },
    include: [
      {
        model: Media,
        as: "media",
      },
    ],
  });
  return posts;
};

export const fetchPostById = async (id: string, userId: string) => {
  const post = await Post.findOne({
    where: { id, userId },
    include: [
      {
        model: Media,
        as: "media",
      },
    ],
  });
  return post;
};

export const deleteUserPost = async (postId: string, userId: string) => {
  const post = await Post.findOne({ where: { id: postId, userId } });

  if (!post) {
    throw new Error("Gönderi bulunamadı.");
  }

  await Media.destroy({ where: { postId } });

  await Post.destroy({ where: { id: postId, userId } });

  return { message: "Gönderi başarıyla silindi." };
};

export const updateUserPost = async (
  postId: string,
  userId: string,
  updatedCaption: string,
  updatedScheduleDate: Date | null,
  newImageUrls: string[],
  removedImageIds: string[],
  status: "scheduled" | "published" | "draft"
) => {
  const post = await Post.findOne({
    where: { id: postId, userId },
    include: [{ model: Media, as: "media" }],
  });

  if (!post) {
    throw new Error("Post not found");
  }

  const removedImageIdsAsNumbers = removedImageIds.map((id) => Number(id));
  const currentImages: Media[] = post.media || [];
  const remainingImages = currentImages.filter(
    (media: Media) => !removedImageIdsAsNumbers.includes(media.id)
  );

  if (remainingImages.length + newImageUrls.length === 0) {
    throw new Error("A post must have at least one image.");
  }

  const mediaToDelete = currentImages.filter((media: Media) =>
    removedImageIdsAsNumbers.includes(media.id)
  );

  for (const media of mediaToDelete) {
    await media.destroy();
    deleteFile(media.url);
  }

  await Media.bulkCreate(newImageUrls.map((url) => ({ url, postId: post.id })));

  post.caption = updatedCaption;
  post.scheduleDate = updatedScheduleDate;
  post.status = status;

  await post.save();

  await post.reload({ include: [{ model: Media, as: "media" }] });

  return post;
};

export const updatePostStatusToPublished = async (postId: string) => {
  const post = await Post.findByPk(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.status !== "scheduled") {
    throw new Error("Post is not scheduled");
  }

  post.status = "published";
  post.save();
};