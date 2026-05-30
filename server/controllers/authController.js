const User=require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const sendEmail = require('../utils/sendEmail');

exports.register=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'Email already in use'});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        await User.create({name ,email ,password:hashedPassword});
        res.json({message:'User registered successfully'});
    }catch(err){
        res.status(500).json({message:'Registration failed'});
    }
};

exports.login=async(req,res)=>{
    try{
        const {email,password, rememberMe}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:'Invalid credentials'});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:'Invalid credentials'});
        }
        const isProduction = process.env.NODE_ENV === "production";
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        const cookieAge= rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
        res.cookie('token',token,{httpOnly:true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', maxAge: cookieAge});
        res.json({message:'Login successful', user:{id:user._id, name:user.name, email:user.email}});
    }catch(err){
        res.status(500).json({message:'Login failed'});
    }   
};

exports.logout=(req,res)=>{
    res.clearCookie('token', {httpOnly:true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax'});
    res.status(200).json({message:'Logout successful'});
};

exports.forgotPassword=async(req,res)=>{
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save();
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        const message = `
            <div style="font-family:Arial;padding:20px">
                <h2>Password Reset Request</h2>
                <p>We received a request to reset your password.</p>
                <a href="${resetUrl}" style="display:inline-block; padding:12px 20px; background:#06b6d4; color:white; text-decoration:none; border-radius:8px;">
                    Reset Password
                </a>
                <p>This link expires in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>`;
        await sendEmail({ to: user.email, subject: 'Password Reset Request', html: message });
        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send password reset email' });
    }
};

exports.resetPassword=async(req,res)=>{
    try {
        const resetToken = req.params.token;
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpire: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        const { password } = req.body;
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
};