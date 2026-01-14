const express = require('express');
const Recipe = require('../models/RecipeSchema');

const router = express.Router();


router.get( '/', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }

});

router.post( '/', async (req, res) => {
    const { title, ingredients, instructions } = req.body; 
    if (!title || !ingredients || !instructions ) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const newRecipe = await Recipe.create({
        title,
        ingredients,
        instructions
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

router.put( '/:id', async (req, res) => {
    const { id } = req.params;
    const { title, ingredients, instructions } = req.body;
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            id,
            { title, ingredients, instructions },
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


router.delete( '/:id', async (req, res) => {
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