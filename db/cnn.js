require('dotenv').config();
const mongoose = require('mongoose');

URL=process.env.MONGODB

const connectDb=()=>{
    mongoose.connect(URL).then(()=>{
        console.log('Connected to MongoDB');
    }).catch(err=>{
        console.error('Error connecting to MongoDB',err);
    });
};
module.exports=connectDb;