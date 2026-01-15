const express = require('express');
const Router = express.Router();
const User = require('../models/UserSchema');
const router = require('./recipe');
const  bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password){
            return  res.status(400).json({ message: 'Email and password are required' });
        }
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword
        });
        await newUser.save();
        let token = jwt.sign({email, id:newUser._id}, process.env.SECRET_KEY, {expiresIn: '1w'}
        );
        return res.status(201).json({message: 'User registered successfully', token, user:newUser});
        


    }catch (error) {
        res.status(500).json({ message: 'Error registering user' });
     }
    })


router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        let token = jwt.sign({ email, id:user._id }, process.env.SECRET_KEY, { expiresIn: '1w' });
        return res.status(200).json({ message: 'Signin successful', token, user });

    } catch (error) {
        res.status(500).json({ message: 'Error signing in user' });
    }
});


   router.get('/:id', async (req, res) => {
        const user = await User.findById(req.params.id)
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });

    })



module.exports = router;