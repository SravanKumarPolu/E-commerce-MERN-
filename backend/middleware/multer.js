import multer from 'multer'

const storge=multer.diskStorage({
  filename:function(req,file,callback){
    callback(null,file.originalname)
  }
})
const upload=muler({storge});
export default upload