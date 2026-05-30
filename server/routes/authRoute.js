const router= require('express').Router();
const {register, login, logout}=require('../controllers/authController');
const auth= require('../middleware/authMiddleware');

router.get('/me',auth,(req,res)=>{
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.status(200).json({user:{id:req.user._id, name:req.user.name, email:req.user.email}});
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
});

router.post('/register',register);
router.post('/login',login);
router.post('/logout',logout);

module.exports=router;