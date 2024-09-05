require('dotenv').config();
const mongose=require('mongoose');

const URL=process.env.MONGODB

const connectdb=()=>{
    mongose.connect(URL).then(()=>{
        console.log('MongoDB Connected...');
    });
}

module.exports=connectdb;