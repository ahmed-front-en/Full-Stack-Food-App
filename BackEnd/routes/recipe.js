const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Recipe = require('../models/RecipeSchema');
const requireAuth = require('../middlewares/auth');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'public', 'images');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
});
const upload = multer({ storage });


router.get( '/', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }

});

router.post( '/', requireAuth, upload.single('coverImage'), async (req, res) => {
    const { title, ingredients, instructions } = req.body; 
    if (!title || !ingredients || !instructions ) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const newRecipe = await Recipe.create({
        title,
        ingredients,
        instructions,
        coverImage: req.file ? req.file.filename : undefined,
        createdBy: req.userId
    });
    res.status(201).json(newRecipe);
});


router.get( '/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        return res.status(404).json({ message: 'Recipe not found' });
    }
});

router.put( '/:id', requireAuth, upload.single('coverImage'), async (req, res) => {
    const { id } = req.params;
    const { title, ingredients, instructions } = req.body;
    const update = { title, ingredients, instructions };
    if (req.file) {
        update.coverImage = req.file.filename;
    }
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            id,
            update,
            { new: true, runValidators: true }
        );
        if (!updatedRecipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json(updatedRecipe);
    }catch (error) {
        return res.status(404).json({ message: 'Recipe server not found' });
    }
})


router.delete( '/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(id);
        if (!deletedRecipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' });
    }
});



module.exports = router;