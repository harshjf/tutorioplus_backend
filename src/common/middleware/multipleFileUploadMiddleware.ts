import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.resolve("uploads", "mentors");

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now(); 
    cb(null, `${file.fieldname}_${timestamp}${path.extname(file.originalname)}`);
  },
});

export const uploadMentorFiles = multer({ storage });

export const multipleFileUploadMiddleware = (req:any, res:any, next:any) => {
  uploadMentorFiles.fields([
    { name: "cv", maxCount: 1 },   
    { name: "photo", maxCount: 1 }, 
  ])(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: "Error processing mentor file upload" });
    }
    if (req.files) {
      if (req.files.cv) {
        req.files.cv[0].path = path.resolve(req.files.cv[0].path);
      }
      if (req.files.photo) {
        req.files.photo[0].path = path.resolve(req.files.photo[0].path);
      }
    }
    next();
  });
};
