const handleErrors = (err,req,res,next)=>{
    return res.status(err.statusCode || 500).json({message:err.message,error:err})
}
module.exports = handleErrors