import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    profile: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    
    },
})

export const userModel = mongoose.model('user', userSchema)