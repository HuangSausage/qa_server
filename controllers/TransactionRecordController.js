const TransactionRecord = require('../models/TransactionRecord');
const CommonTools = require('../services/CommonTools');
const UserData = require('../models/UserData');
// 錯誤代碼 06  01取值 02新增 03修改 04刪除 #0601XX
class TransactionRecordController {
    // 取值
    async getAllData(req, res, next){
        const tr_m = new TransactionRecord;
        const ct_s = new CommonTools;
        const ud_m = new UserData;
        try {
            let data = {'transaction':{'records':{},'lastlogins':{}}};
            await tr_m.getAllData().then(result => {// 若寫入成功則回傳
                data.transaction.records = result;
            }, (err) => {// 若寫入失敗則回傳
                res.json('資料獲取失敗');
            })
            await ud_m.getAllUserLastLogin().then(result => {// 若寫入成功則回傳
                data.transaction.lastlogins = result;
            }, (err) => {// 若寫入失敗則回傳
                res.json('資料獲取失敗');
            })
            return res.json(data)
        } catch (error) {
            await ct_s.writeErrorLog(error,'#060101','TransactionRecordController','getAllData');
            return res.json('#060101');
        }
    }

    // 新增
    async actionCreate(req, res, next){
        const tr_m = new TransactionRecord;
        const ct_s = new CommonTools;
        try {
            await tr_m.create(req).then(result => {// 若寫入成功則回傳
                console.log('異動記錄寫入成功！')
            }, (err) => {// 若寫入失敗則回傳
                console.log('異動記錄寫入失敗！')
            })
        } catch (error) {
            await ct_s.writeErrorLog(error,'#060201','TransactionRecordController','getAllData');
            return res.json('#060201');
        }
    }
}

module.exports = TransactionRecordController;
