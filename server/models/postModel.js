import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title: {
        type: String,
    },
    text: {
        type: String,
    },
    image: {
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

export const postModel = mongoose.model('posts', postSchema)