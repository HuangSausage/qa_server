const SystemParameter = require('../models/SystemParameter');
const TransactionRecord = require('../controllers/TransactionRecordController');
const CommonTools = require('../services/CommonTools');
// 錯誤代碼 07  01取值 02新增 03修改 04刪除 #0701XX
class SystemPartameterController {
    // 修改
    async actionSignModify(req, res, next){
        const sp_m = new SystemParameter;
        const ct_s = new CommonTools;
        const tr_c = new TransactionRecord;
        try {
            await sp_m.update(req.body).then(result => {// 若寫入成功則回傳
                res.json(true);
            }, (err) => {// 若寫入失敗則回傳
                res.json('修改失敗！')
            })
        } catch (error) {
            await ct_s.writeErrorLog(error,'#070301','QuestionDataController','actionModify');
            return res.json('#070301');
        }
    }
}

module.exports = SystemPartameterController;
