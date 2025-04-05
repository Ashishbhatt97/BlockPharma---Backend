import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

// Define storage options for Multer
const storage: StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ): void => {
    cb(null, "uploads/profilePics"); // Specify the destination directory
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ): void => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

// Define file filter to validate image types
// const fileFilter = (
//   req: Request,
//   file: Express.Multer.File,
//   cb: FileFilterCallback
// ): void => {
//   const allowedTypes = /jpeg|jpg|png|gif|webp|svg|avif/;
//   const extname = allowedTypes.test(
//     path.extname(file.originalname).toLowerCase()
//   );
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images are allowed"));
//   }
// };

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "profilePic") {
      const allowedTypes = /jpeg|jpg|png|gif/;
      const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimetype = allowedTypes.test(file.mimetype);
      if (extname && mimetype) cb(null, true);
      else cb(new Error("Only images are allowed for profile picture"));
    } else {
      cb(new Error(`Unexpected field: ${file.fieldname}`));
    }
  },
});

// // Initialize the upload middleware
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 * 5 }, // Set file size limit to 5MB
//   fileFilter: fileFilter,
// });

export default upload;
