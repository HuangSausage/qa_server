const ImageRecord = require('../models/ImageRecord');
const TransactionRecord = require('../controllers/TransactionRecordController');
const CommonTools = require('../services/CommonTools');
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID


// 錯誤代碼 04  01取值 02新增 03修改 04刪除 #0401XX
class ImageRecordController {
    // 取值
    async getAllData(req, res, next){
        const ir_m = new ImageRecord;
        const ct_s = new CommonTools;
        try {

        } catch (error) {
            await ct_s.writeErrorLog(error,'#040101','ImageRecordController','getAllData');
            return res.json('#040101');
        }
    }

    // 新增
    async actionCreate(req, res, next){
        const ir_m = new ImageRecord;
        const ct_s = new CommonTools;
        const tr_c = new TransactionRecord;
        try {
            let data = {};
            let { file } = req
            if (file) {
                // // 從檔案路徑讀檔
                // fs.readFile(file.path, (err, data) => {
                //     if (err) return console.error(err)
                //     // 寫入 upload 資料夾
                //     fs.writeFile(`upload/${file.filename}_${file.originalname}`, data, () => {
                //         return res.json(`upload/${file.filename}_${file.originalname}`);
                //     })
                // })
                // 設定 app ID
                imgur.setClientID(IMGUR_CLIENT_ID)
                // 取得檔案目錄，上傳至 imgur
                imgur.upload(file.path, (err, image) => {
                    if (err) return console.error(err)
                    // 連結放在 image.data.link 裡
                    return res.json(image.data.link);
                })
            }
        } catch (error) {
            await ct_s.writeErrorLog(error,'#040201','ImageRecordController','actionCreate');
            return res.json('#040201');
        }
    }

    // 修改
    async actionModify(req, res, next){
        const ir_m = new ImageRecord;
        const ct_s = new CommonTools;
        const tr_c = new TransactionRecord;
        try {

        } catch (error) {
            await ct_s.writeErrorLog(error,'#040301','ImageRecordController','actionModify');
            return res.json('#040301');
        }
    }

    // 刪除
    async actionDelete(req, res, next){
        const ir_m = new ImageRecord;
        const ct_s = new CommonTools;
        const tr_c = new TransactionRecord;
        try {

        } catch (error) {
            await ct_s.writeErrorLog(error,'#040401','ImageRecordController','actionDelete');
            return res.json('#040401');
        }
    }
}


module.exports = ImageRecordController;