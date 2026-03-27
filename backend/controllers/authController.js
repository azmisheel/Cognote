import jwt from 'jsonwebtoken'
import User from '../models/User.js'

//Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
}

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {

    try {
        const { username, email, password } = req.body;

        //check if user exists
        const userExists = await User.findOne({ $or: [{ email }] });
        if (userExists) {
            return res.status(400).json({ success: false, error: userExists.email ? 'Email already in use' : 'Username already in use' });
        }

        //create user
        const user = await User.create({ username, email, password });

        //generate token
        const token = generateToken(user._id);
        
        res.status(201).json({ success: true, data: { 
            user: { id:user._id, username: user.username, email: user.email, profileImage: user.profileImage, createdAt: user.createdAt }, token}, 
        message: 'User registered successfully' });
    }
    catch(error){
        next(error);
    }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //Validate user
        if(!email || !password){
            return res.status(400).json({ success: false, error: 'Please provide email and password' });
        }

        //check for user include password
        const user = await User.findOne({ email }).select('+password');

        if(!user) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await user.matchPassword(password);
        if(!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user._id);
        res.status(200).json({ success: true, user: { id: user._id, username: user.username, email: user.email, profileImage: user.profileImage, createdAt: user.createdAt }, token , message: 'Logged in successfully' });
    }
    catch(error){
        next(error);
    }
}


// @desc   Get user profile
// @route  GET /api/auth/profile
// @access Private
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({ success: true, data: {
            user: { id: user._id, username: user.username, email: user.email, profileImage: user.profileImage, createdAt: user.createdAt, updatedAt: user.updatedAt }
        } });

    }
    catch(error){
        next(error);
    }
}


// @desc   Update user profile
// @route  PUT /api/auth/profile
// @access Private
export const updateProfile = async (req, res, next) => {
    
    try {
        const { username, email, profileImage } = req.body;
        const user = await User.findById(req.user._id)
            
        if (username) user.username = username;
        if (email) user.email = email;
        if (profileImage) user.profileImage = profileImage;
        await user.save();

        res.status(200).json({ success: true, data: {
            user: { id: user._id, username: user.username, email: user.email, profileImage: user.profileImage}
        }, message: 'Profile updated successfully' });

    }
    catch(error){
        next(error);
    }
}

// @desc   Change password
// @route  POST /api/auth/change-password
// @access Private
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select("+password");

        if(!currentPassword || !newPassword){
            return res.status(400).json({ success: false, error: 'Please provide current and new password' });
        }

        //check if current password is false
        const isMatch = await user.matchPassword(currentPassword);
        if(!isMatch) {
            return res.status(401).json({ success: false, error: 'Current password is incorrect' });
        }
        if(currentPassword === newPassword){
            return res.status(401).json({ success: false, error: 'New password cannot be the same as current password' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    }
    catch(error){
        next(error);
    }
}