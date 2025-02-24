import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!file) {
      cb(null, "uploads/temp"); 
      return;
    }
    const studentId = req.body.studentId || "unknown";
    const folderPath = path.resolve("uploads", String(studentId));
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    if (!file) {
      cb(null, "placeholder.txt"); 
      return;
    }
    const serviceId = req.body.serviceId || "new";
    cb(null, `doc_${serviceId}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({ storage });
export const optionalFileUpload = (req: any, res: any, next: any) => {
  upload.single("file")(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ error: "Error processing file upload" });
    }
    if (req.file) {
      req.file.path = path.resolve(req.file.path); 
    }
    next(); 
  });
};
