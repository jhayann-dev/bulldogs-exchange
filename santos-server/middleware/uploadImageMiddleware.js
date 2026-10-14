import multer from "multer";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageSize = 5 * 1024 * 1024;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxImageSize, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      const error = new Error("Choose a JPEG, PNG, or WebP image.");
      error.status = 400;
      callback(error);
      return;
    }
    callback(null, true);
  },
});

const matchesImageSignature = (buffer, mimeType) => {
  if (mimeType === "image/jpeg") {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (mimeType === "image/png") {
    return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }

  if (mimeType === "image/webp") {
    return buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  }

  return false;
};

const uploadSingleImage = upload.single("image");

const uploadImageMiddleware = (req, res, next) => {
  uploadSingleImage(req, res, async (error) => {
    if (error) {
      if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ success: false, message: "Image must be 5 MiB or smaller." });
      }
      return res.status(error.status || 400).json({
        success: false,
        message: error.message || "Image upload failed.",
      });
    }

    if (req.file && !matchesImageSignature(req.file.buffer, req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "The file contents do not match a valid JPEG, PNG, or WebP image.",
      });
    }

    return next();
  });
};

export default uploadImageMiddleware;
