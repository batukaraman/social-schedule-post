import path from "path";
import fs from "fs";

export const getFileUrl = (filename: string): string => {
  return `/uploads/${filename}`;
};

export const deleteFile = (filename: string): void => {
  const basePath = path.join(__dirname, "../../uploads");
  const filePath = filename.startsWith("/uploads")
    ? path.join(__dirname, "../../uploads", filename.slice(8))
    : path.join(basePath, filename);

  try {
    fs.unlinkSync(filePath);
    console.log(`Dosya silindi: ${filename}`);
  } catch (err) {
    console.error(`Dosya silinemedi: ${filename}`, err);
  }
};
