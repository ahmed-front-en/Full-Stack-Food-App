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
        return res.status(201).json({massage: 'User registered successfully', token, newUser});
        


    }catch (error) {
        res.status(500).json({ message: 'Error registering user' });
     }
    })







module.exports = router;