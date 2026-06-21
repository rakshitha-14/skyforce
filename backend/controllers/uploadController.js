const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists in root of backend directory
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Controller method to handle successful file upload
exports.uploadFile = (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  // File is successfully uploaded by multer, return file metadata
  // relative URL on server, e.g., /uploads/filename
  const fileUrl = `/uploads/${req.file.filename}`;
  
  res.status(201).json({
    fileName: req.file.originalname,
    fileUrl: fileUrl,
    uploadedAt: new Date()
  });
};
