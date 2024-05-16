const NotifyData = require('../models/NotifyData');
const TransactionRecord = require('../controllers/TransactionRecordController');
const CommonTools = require('../services/CommonTools');
// 錯誤代碼 03  01取值 02新增 03修改 04刪除 #0301XX
class NotifyDataController {
    // 取值
    async getAllData(req, res, next){
        const nd_m = new NotifyData;
        const ct_s = new CommonTools;
        try {

        } catch (error) {
            await ct_s.writeErrorLog(error,'#030101','NotifyDataController','getAllData');
            return res.json('#030101');
        }
    }

    // 新增
    async actionCreate(req, res, next){
        const nd_m = new NotifyData;
        const ct_s = new CommonTools;
        const tr_c = new TransactionRecord;
        try {

        } catch (error) {
            await ct_s.writeErrorLog(error,'#030201','NotifyDataController','actionCreate');
            return res.json('#030201');
        }
    }

    // 修改
    async actionModify(req, res, next){
        const nd_m = new NotifyData;
        const ct_s = new CommonTools;
        const tr_c = new TransactionRecord;
        try {

        } catch (error) {
            await ct_s.writeErrorLog(error,'#030301','NotifyDataController','actionModify');
            return res.json('#030301');
        }
    }

    // 刪除
    async actionDelete(req, res, next){
        const nd_m = new NotifyData;
        const ct_s = new CommonTools;
        const tr_c = new TransactionRecord;
        try {

        } catch (error) {
            await ct_s.writeErrorLog(error,'#030401','NotifyDataController','actionDelete');
            return res.json('#030401');
        }
    }
}


module.exports = NotifyDataController;