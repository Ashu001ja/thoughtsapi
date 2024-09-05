const mongoose=require('mongoose');

const thoughtSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    }
});
module.exports=mongoose.model('Thought',thoughtSchema);