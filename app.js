const express = require('express');
const connectDb = require('./db/cnn');
const thoughtSchema = require('./model/models');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.static('uploads'));

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'thoughts',
    format: async (req, file) => {
      // Allow all image formats
      const formats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp'];
      const fileExtension = file.originalname.split('.').pop().toLowerCase();
      if (formats.includes(fileExtension)) {
        return fileExtension;
      } else {
        throw new Error(`Unsupported image format: ${fileExtension}`);
      }
    },
    public_id: (req, file) => 'computed-filename-using-request',
  },
});

const upload = multer({ storage: storage });

app.get('/', async (req, res) => {
  const data = await thoughtSchema.find({});
  res.send(data);
});

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file && !req.body.title) {
      res.status(400).send('Either a file or a title is required!');
      return;
    }
    let thoughtData = {};
    if (req.file) {
      thoughtData.image = req.file.path;
    }
    if (req.body.title) {
      thoughtData.title = req.body.title;
    }
    const thought = new thoughtSchema(thoughtData);
    await thought.save();
    res.send('Image and/or title uploaded successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading image and/or title!');
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
    const thought = await thoughtSchema.findByIdAndDelete(req.params.id);
    if (!thought) {
      res.status(404).send('Thought not found!');
      return;
    }
    if (thought.image) {
      const publicId = thought.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }
    res.send('Image deleted successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting thought!');
  }
});

const Start = async () => {
  await connectDb();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

Start();