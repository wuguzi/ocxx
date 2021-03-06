exports.uploadFile = () => {
    // 判断上传接口
    const multer = require('koa-multer');//加载koa-multer模块  
    //文件上传
    //配置  
    var storage = multer.diskStorage({  
        //文件保存路径  
        destination: function (req, file, cb) {
            cb(null, global.config.officialPicPath)
        },  
        //修改文件名称  
        filename: async(req, file, cb) => {  
            const { wxSession } = req.body
            const md5 = require('md5')
            var fileFormat = (file.originalname).split(".");
            const fileName = md5(Date.now() + wxSession + '_official_') + "_official_." + fileFormat[fileFormat.length - 1]
            cb(null, fileName);
        }
    })
    //加载配置
    return multer({ storage: storage });
}
