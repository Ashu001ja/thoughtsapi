const mongoose=require('mongoose');

const thoughtSchema=new mongoose.Schema({
    title:{
        type:String,
    },
    image:{
        type:String,
    }
});
module.exports=mongoose.model('Thought',thoughtSchema);