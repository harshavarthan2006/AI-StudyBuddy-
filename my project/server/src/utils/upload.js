const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.txt', '.pdf', '.doc', '.docx', '.md', '.json'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext) || file.mimetype.startsWith('text/')) {
    cb(null, true);
  } else {
    cb(new Error('Only text documents (.txt, .pdf, .md, .doc) are supported for file upload'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const extractTextFromFile = async (filePath, mimeType) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.pdf') {
      const pdfParse = require('pdf-parse');
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else {
      // UTF-8 text file read
      return fs.readFileSync(filePath, 'utf-8');
    }
  } catch (err) {
    console.error('File text extraction error:', err);
    return '';
  }
};

module.exports = { upload, extractTextFromFile };
