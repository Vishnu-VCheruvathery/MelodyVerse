import express from 'express'
import { postModel } from '../models/postModel.js'
import cloudinary from '../cloudinary/cloudinary.js'
import { verifyToken } from './userRoutes.js';

const router = express.Router()

router.get('/', verifyToken, async(req,res) => {
    try {
        const page = req.query.page || 1; // Default to page 1 if not provided
        const perPage = 2; // Number of posts per page
        const skip = (page - 1) * perPage;

        // Fetch posts with pagination
        const totalPostsCount = await postModel.countDocuments({});
        const posts = await postModel.find({}).skip(skip).limit(perPage);

        const totalPages = Math.ceil(totalPostsCount / perPage);
        const hasMore = page < totalPages;

        return res.json({ posts, hasMore });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/', verifyToken, async(req,res) => {
    try{
        const {title, text ,image} = req.body
        
        const result = await cloudinary.uploader.upload(image, {
            folder: 'images',
         })

        const newPost = new postModel({
            title: title,
            text: text,
            image: {
                public_id: result.public_id,
                url: result.secure_url
            }
        })

        await newPost.save()

        return res.json({message: 'post added successfully!'})
    }catch(error){
        console.log(error)
    }
})

export {router as postRouter}