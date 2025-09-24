// // src/config/multerConfig.js
// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // 🔹 Storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = "uploads/employees";
//     fs.mkdirSync(uploadPath, { recursive: true }); // folder auto create
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `emp-${Date.now()}${ext}`);
//   },
// });

// // 🔹 File filter (only images)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|gif/;
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (allowedTypes.test(ext)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images are allowed"), false);
//   }
// };

// export const upload = multer({ storage, fileFilter });
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const uploadPath = path.join("uploads", today);

    fs.mkdirSync(uploadPath, { recursive: true }); // auto-create folder
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `ss-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) cb(null, true);
  else cb(new Error("Only images are allowed"), false);
};

export const upload = multer({ storage, fileFilter });
