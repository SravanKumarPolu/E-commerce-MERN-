import multer from 'multer'

const storge=multer.diskStorage({
  filename:function(req,file,callback){
    callback(null,file.originalname)
  }
})
const upload=multer({storge});
export default upload

