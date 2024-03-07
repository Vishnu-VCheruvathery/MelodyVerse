import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { userModel } from '../models/userModel.js'
import cloudinary from '../cloudinary/cloudinary.js'
const {SECRET, user, pass} = process.env

const router = express.Router()


router.post('/signup', async (req,res) => {

    try {

        const {sanitizedUsername, sanitizedPassword,  sanitizedEmail, image} = req.body
        
        const result = await cloudinary.uploader.upload(image, {
          folder: 'images',
       })

        const hashedPassword = await bcrypt.hash(sanitizedPassword, 10)
     
        const newUser = new userModel({
           username: sanitizedUsername,
           password: hashedPassword,
           email: sanitizedEmail,
           profile: {
            public_id: result.public_id,
            url: result.secure_url
        }
        })
     
        await newUser.save()
     
        var transport = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: user,
            pass: pass
          }
        });

        const mailOptions = {
          from: 'melodyverse@gmail.com',
          to: sanitizedEmail,
          subject: "Welcome to MelodyVerse!!",
         
      }
       await transport.sendMail(mailOptions)

        return res.json({message: 'New User created!'})
    } catch (error) {
        console.log(error)
        return res.json(error)
    }
  
}) 

router.post('/login', async(req,res) => {
    try {
        const {username, password, email} = req.body

        const user = await userModel.findOne({ email })
        
        if(!user){
            return res.json({error: 'No User found with that credentials'})
        }
        
        const match = await bcrypt.compare(password, user.password)
        
        if(match === false){
            return res.json({error: "Wrong Password"})
        }
    
        const token = jwt.sign({id: user._id, name: user.username, profile: user.profile}, SECRET)
       
        res.json({ token });
    } catch (error) {
        console.log(error)
        res.json(error)
    }
})

router.post('/reset', async(req,res) => {
  try {
    const {email, resetPassword} = req.body

    const user = await userModel.findOne({ email })
   
    if(!user){
        return  res.json({error: 'No User found with that credentials'})
    }

    const match = await bcrypt.compare(resetPassword, user.password)

    if(match === true){
       return  res.json({error: "Please don't choose the same password"})
    }
    const hashedPassword = await bcrypt.hash(resetPassword, 10)
    
    const update = await userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword
    })

    return res.json({message:'Password updated!'})
  } catch (error) {
    console.log(error)
    res.json(error)
  }
})

export {router as userRouter}

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
      const tokenParts = token.split(' ');
      if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
        const tokenString = tokenParts[1];
        // Verify the token here
        jwt.verify(tokenString, SECRET, (err, decoded) => {
          if (err) {
            return res.sendStatus(403);
          } else {
            // Attach the decoded payload to the request object
            req.decoded = decoded;
            next();
          }
        });
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  };