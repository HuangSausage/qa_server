const QuestionData = require('../models/QuestionData');
const TransactionRecord = require('../controllers/TransactionRecordController');
const CommonTools = require('../services/CommonTools');
// 錯誤代碼 02  01取值 02新增 03修改 04刪除 #0201XX
class QuestionDataController {
    // 取值
    async getAllData(req, res, next){
        const qd_m = new QuestionData;
        const ct_s = new CommonTools;
        try {
        } catch (error) {
            await ct_s.writeErrorLog(error,'#020101','QuestionDataController','getAllData');
            return res.json('#020101');
        }
    }

    // 新增
    async actionCreate(req, res, next){
        const qd_m = new QuestionData;
        const ct_s = new CommonTools;
        const tr_c = new TransactionRecord;
        try {
        } catch (error) {
            await ct_s.writeErrorLog(error,'#020201','QuestionDataController','actionCreate');
            return res.json('#020201');
        }
    }

    // 修改
    async actionModify(req, res, next){
        const qd_m = new QuestionData;
        const ct_s = new CommonTools;
        const tr_c = new TransactionRecord;
        try {

        } catch (error) {
            await ct_s.writeErrorLog(error,'#020301','QuestionDataController','actionModify');
            return res.json('#020301');
        }
    }

    // 刪除
    async actionDelete(req, res, next){
        const qd_m = new QuestionData;
        const ct_s = new CommonTools;
        const tr_c = new TransactionRecord;
        try {

        } catch (error) {
            await ct_s.writeErrorLog(error,'#020401','QuestionDataController','actionDelete');
            return res.json('#020401');
        }
    }
}


module.exports = QuestionDataController;