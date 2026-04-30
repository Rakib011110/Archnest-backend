import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";

const router = Router();

// multer storage
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, path.join(process.cwd(), "uploads", "profiledocs"));
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// HTML Form page
router.get("/upload-form", (_req: Request, res: Response) => {
  res.send(`
    <h2>Multer Upload Test</h2>
    <form action="/api/files/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="photo" required />
      <button type="submit">Upload</button>
    </form>
    <p>Note: field name = <b>photo</b></p>
  `);
});

// Upload endpoint
router.post("/api/files/upload", upload.single("photo"), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  const url = `${req.protocol}://${req.get("host")}/uploads/profiledocs/${req.file.filename}`;

  res.json({
    message: "Upload successful",
    filename: req.file.filename,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    url,
  });
});

export default router;
