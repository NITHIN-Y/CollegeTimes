const router=require("express").Router();
const User=require("../models/user");
const bcrypt=require("bcrypt");
const Post=require("../models/Post")
const mongoose=require("mongoose");


//Update
router.put('/:id',async(req,res)=>{
    if(req.body.userId===req.params.id)
    {
        if(req.body.password)
        {
            const salt= await bcrypt.genSalt(10);
            req.body.password=await bcrypt.hash(req.body.password,salt);
        }
        try{
            const updatedUser=await User.findByIdAndUpdate(req.params.id,
                {
                    $set:req.body,
                },{new:true});
                //not updating instantaneously watch out here
            res.status(200).json(updatedUser);
        }catch(err)
        {
            res.status(500).json(err);
        }

    }
    else{
        res.status(401).json("you can update only your account");
    }
})

//DELETE
router.delete('/:id',async(req,res)=>{
    if(req.body.userId===req.params.id)
    {
        try
        {    
            const user=await User.findById(req.params.id);
            try
            {
                await Post.deleteMany({username:user.username});
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("USER IS DELETED");
            }
            catch(err)
            {
                res.status(500).json(err);
            }
        }
        catch{
                res.status(404).json('User not found');
        }
    }
    else{
        res.status(401).json("you can delete only your account");
    }
})

//get one user

router.get('/:id',async(req,res)=>
{
    try{
        const user= await User.findById(req.params.id);
        const {password, ...others}=user._doc;
        req.status(200).json(others);
    }
    catch(err)
    {
        res.status(500).json(err);
    }
})
module.exports=router;



