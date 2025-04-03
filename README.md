# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](

https://typescript-eslint.io) in your


project-root/
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageUpload.jsx
│   │   │   └── ImageGallery.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── cloudinary.js
│   ├── controllers/
│   ├── models/
│   │   └── Image.js
│   ├── routes/
│   │   └── imageRoutes.js
│   ├── uploads/
│   ├── .env.example
│   ├── app.js
│   └── package.json
│
├── README.md
└── .gitignore

server/app.js
// server/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const imageRoutes = require('./routes/imageRoutes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/images', imageRoutes);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

(server/config/cloudinary.js)
// server/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;

(server/models/Image.js)
// server/models/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    tags: { type: [String], required: true },
    imageUrl: { type: String, required: true },
});

module.exports = mongoose.model('Image', imageSchema);

(server/routes/imageRoutes.js)
// server/routes/imageRoutes.js
const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const Image = require('../models/Image');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        const newImage = new Image({
            title: req.body.title,
            tags: req.body.tags.split(','),
            imageUrl: result.secure_url,
        });
        await newImage.save();
        res.status(201).json(newImage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    const { tag } = req.query;
    try {
        const images = tag ? await Image.find({ tags: tag }) : await Image.find();
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const image = await Image.findByIdAndDelete(req.params.id);
        if (!image) return res.status(404).send('Image not found');
        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

(client/src/App.jsx)
// client/src/App.jsx
import React from 'react';
import ImageUpload from './components/ImageUpload';
import ImageGallery from './components/ImageGallery';
import './

