const router= require('express').Router();
const {register, login}=require('../controllers/authController');
const auth= require('../middleware/authMiddleware');

router.get('/me',auth,(req,res)=>{
    res.json({user:{id:req.user._id, name:req.user.name, email:req.user.email}});
});

router.post('/register',register);
router.post('/login',login);

module.exports=router;