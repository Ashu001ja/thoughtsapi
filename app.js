const express = require('express');
const connectDb = require('./db/cnn');
const thoughtSchema = require('./model/models');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
  try{
  const data = await thoughtSchema.find({});
  res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching thoughts!');
  }
});

app.post('/upload',async (req, res) => {
  try {
   const {title,name}=req.body;
   const data=thoughtSchema({title,name});
   await data.save();
   res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading image and/or title!');
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
   const thought = await thoughtSchema.findByIdAndDelete(req.params.id);
   res.send({
     message: 'Thought deleted successfully!',
     thought: thought,
   })
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting thought!');
  }
});

const Start = async () => {
  try {
  await connectDb();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} catch (error) {
  console.error('Error starting the server', error);
}
};

Start();