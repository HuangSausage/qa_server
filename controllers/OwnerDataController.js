const OwnerData = require('../models/OwnerData');
const QuestionData = require('../models/QuestionData');
const NotifyData = require('../models/NotifyData');
const TransactionRecord = require('../controllers/TransactionRecordController');
const CommonTools = require('../services/CommonTools');
const jwt = require('jsonwebtoken');
const config = require('../config/development_config');
const db = require('../models/connection_db');
// 錯誤代碼 01  01取值 02新增 03修改 04刪除 #0101XX
class OwnerDataController {
    // 取值
    async getAllData(req, res, next){
        const od_m = new OwnerData;
        const ct_s = new CommonTools;
        try{
            let data = {};
            let arraydata = req.query;
            if(!arraydata.od_name){
                arraydata.od_name = '';
            }
            if(!arraydata.create_user || arraydata.create_user == 'all'){
                arraydata.create_user = '';
            }
            if(!arraydata.od_status || arraydata.od_status == 'all'){
                arraydata.od_status = '';
            }
            if(!arraydata.orderBy){
                arraydata.orderBy = 'create_date';
            }
            if(!arraydata.sort){
                arraydata.sort = 'DESC';
            }
            data.owners = [];

            await od_m.getAllData(arraydata).then(result => {// 若寫入成功則回傳
                data.owners = result;
            }, (err) => {// 若寫入失敗則回傳
                data.owners = [];
            })
            return res.json(data);
        } catch(error){
            await ct_s.writeErrorLog(error,'#010101','OwnerDataController','getAllData');
            return res.json('#010101');
        }
    }

    // 取單一值
    async getOwner(req, res, next){
        const od_m = new OwnerData;
        const qd_m = new QuestionData;
        const nd_m = new NotifyData;
        const ct_s = new CommonTools;
        try {
            let data = {};
            let arraydata = req.query;
            await od_m.getDataByOdId(arraydata.od_id).then(result => {// 若寫入成功則回傳
                data.owner = result;
            }, (err) => {// 若寫入失敗則回傳
                data.owner = [];
            })
            await qd_m.getDataByOdId(arraydata.od_id).then(result => {// 若寫入成功則回傳
                data.questions = result;
            }, (err) => {// 若寫入失敗則回傳
                data.questions = [];
            })
            await nd_m.getDataByOdId(arraydata.od_id).then(result => {// 若寫入成功則回傳
                data.notifys = result;
            }, (err) => {// 若寫入失敗則回傳
                data.notifys = [];
            })
            return res.json(data);
        } catch (error) {
            // db.rollback();
            await ct_s.writeErrorLog(error,'#010101','OwnerDataController','getOwner');
            return res.json('#010101');
        }
    }

    // 透過後置碼&od_id確認是否可以登入
    async getOwnerByLogin(req, res, next){
        const od_m = new OwnerData;
        const ct_s = new CommonTools;
        try {
            let data = {};
            // 獲取站主資料
            const arraydata = {
                od_id: req.body.od_id,
                od_suffix: req.body.od_suffix,
            }
            await od_m.getDataByOdIdSuffix(arraydata).then(result => {// 若寫入成功則回傳
                data.owner = result;0
            }, (err) => {// 若寫入失敗則回傳
                data.owner = [];
            })
            // 產生token
            const token = jwt.sign({
                algorithm: 'HS256',
                exp: Math.floor(Date.now() / 1000) + (60 * 60), // token一個小時後過期。
                data: data.user
            }, config.secret);
            data.token = token;
            return res.json(data);
        } catch (error) {
            // db.rollback();
            await ct_s.writeErrorLog(error,'#010101','OwnerDataController','getOwner');
            return res.json('#010101');
        }
    }

    // 新增
    async actionCreate(req, res, next){
        const od_m = new OwnerData;
        const qd_m = new QuestionData;
        const nd_m = new NotifyData;
        const ct_s = new CommonTools;
        const tr_c = new TransactionRecord;
        try {
            let data = {};
            let boolean = true;
            let arraydata = {};
            let od_id = 0;
            arraydata = req.body;
            if(arraydata.owner.od_name == ''){
                return res.json('尚未傳入站名！');
            }else if(arraydata.owner.od_suffix == ''){
                return res.json('尚未傳入後置碼！');
            }
            // await od_m.getDataBySuffix(arraydata.owner.od_suffix).then(result => {// 若寫入成功則回傳
            //     if(result.length > 0){
            //         boolean = false;
            //         data.text = '後置碼已被使用，請重新設定！';
            //         data.success = false;
            //     }
            // }, (err) => {// 若寫入失敗則回傳
            //     boolean = false;
            //     data.text = '出現未知錯誤！';
            //     data.success = false;
            // })
            // if(!boolean){
            //     return res.json(data);
            // }
            db.beginTransaction();
            // 將資料寫入資料庫
            await od_m.create(arraydata.owner).then(result => {// 若寫入成功則回傳
                data.success = true;
                data.od_id = result.insertId;
                let tr_data = {};
                od_id = result.insertId;
                tr_data.od_id = result.insertId;
                tr_data.tr_action = 1;
                tr_data.create_user = arraydata.owner.last_update_user;
                tr_c.actionCreate(tr_data);
                return
            }, (err) => {// 若寫入失敗則回傳
                db.rollback();
                data.success = false;
                return
            })
            if(arraydata.question.length > 0){
                var q_boolean = true;
                for (let i = 0; i < arraydata.question.length; i++) {
                    arraydata.question[i].od_id = od_id;
                    arraydata.question[i].qd_content = JSON.stringify(arraydata.question[i].qd_content);
                    arraydata.question[i].qd_image = JSON.stringify(arraydata.question[i].qd_image);
                    // 將資料寫入資料庫
                    await qd_m.create(arraydata.question[i]).then(result => {// 若寫入成功則回傳
                        let tr_data = {};
                        tr_data.qd_id = result.insertId;
                        tr_data.tr_action = 1;
                        tr_data.create_user = arraydata.owner.last_update_user;
                        tr_c.actionCreate(tr_data);
                        return
                    }, (err) => {// 若寫入失敗則回傳
                        q_boolean = false;
                        return
                    })
                    if (!q_boolean) {
                        db.rollback();
                        break
                    }
                }
            }
            if(arraydata.notify.length > 0){
                var n_boolean = true;
                for (let i = 0; i < arraydata.notify.length; i++) {
                    arraydata.notify[i].od_id = od_id;
                    arraydata.notify[i].nd_image = JSON.stringify(arraydata.notify[i].nd_image);
                    // 將資料寫入資料庫
                    await nd_m.create(arraydata.notify[i]).then(result => {// 若寫入成功則回傳
                        let tr_data = {};
                        tr_data.nd_id = result.insertId;
                        tr_data.tr_action = 1;
                        tr_data.create_user = arraydata.owner.last_update_user;
                        tr_c.actionCreate(tr_data);
                        return
                    }, (err) => {// 若寫入失敗則回傳
                        n_boolean = false;
                        return
                    })
                    if (!n_boolean) {
                        db.rollback();
                        break
                    }
                }
            }
            db.commit();
            return res.json(data);
        } catch (error) {
            db.rollback();
            await ct_s.writeErrorLog(error,'#010201','OwnerDataController','actionCreate');
            return res.json('#010201');
        }
    }

    // 修改
    async actionModify(req, res, next){
        const od_m = new OwnerData;
        const qd_m = new QuestionData;
        const nd_m = new NotifyData;
        const ct_s = new CommonTools;
        const tr_c = new TransactionRecord;
        try {
            let data = {};
            let arraydata = {};
            arraydata = req.body;
            if(!arraydata.owner.od_id || arraydata.owner.od_id == ''){
                res.json('尚未傳入站主編號！')
            }
            // if(arraydata.owner.od_suffix){
            //     await od_m.getDataByIdSuffix(arraydata.owner.od_id,arraydata.owner.od_suffix).then(result => {// 若寫入成功則回傳
            //         if(result.length > 0){
            //             res.json('後置碼已被使用，請重新設定！')
            //         }
            //     }, (err) => {// 若寫入失敗則回傳
            //         res.json('出現未知錯誤！')
            //     })
            // }

            db.beginTransaction();
            // 將資料寫入資料庫
            await od_m.update(arraydata.owner).then(result => {// 若寫入成功則回傳
                data = true;
                let tr_data = {};
                tr_data.od_id = arraydata.owner.od_id;
                tr_data.tr_action = 2;
                tr_data.create_user = arraydata.owner.last_update_user;
                tr_c.actionCreate(tr_data);
            }, (err) => {// 若寫入失敗則回傳
                data = false;
            })
            if(arraydata.question.length > 0){
                console.log('arraydata.question.length',arraydata.question.length)
                var q_boolean = true;
                await qd_m.deleteByOdId(arraydata.owner.od_id).then(result => {// 若寫入成功則回傳
                    for (let i = 0; i < arraydata.question.length; i++) {
                        arraydata.question[i].od_id = arraydata.owner.od_id;
                        arraydata.question[i].qd_content = JSON.stringify(arraydata.question[i].qd_content);
                        arraydata.question[i].qd_image = JSON.stringify(arraydata.question[i].qd_image);
                        // 將資料寫入資料庫
                        qd_m.create(arraydata.question[i]).then(result => {// 若寫入成功則回傳
                            let tr_data = {};
                            tr_data.qd_id = result.insertId;
                            tr_data.tr_action = 1;
                            tr_data.create_user = arraydata.owner.last_update_user;
                            tr_c.actionCreate(tr_data);
                            return
                        }, (err) => {// 若寫入失敗則回傳
                            q_boolean = false;
                            return
                        })
                        if (!q_boolean) {
                            break
                        }
                    }
                }, (err) => {// 若寫入失敗則回傳
                    db.rollback();
                })
            }
            if(arraydata.notify.length > 0){
                var n_boolean = true;
                console.log('arraydata.notify.length',arraydata.notify.length)
                await nd_m.deleteByOdId(arraydata.owner.od_id).then(result => {// 若寫入成功則回傳
                    for (let i = 0; i < arraydata.notify.length; i++) {
                        arraydata.notify[i].od_id = arraydata.owner.od_id;
                        arraydata.notify[i].nd_image = JSON.stringify(arraydata.notify[i].nd_image);
                        // 將資料寫入資料庫
                        nd_m.create(arraydata.notify[i]).then(result => {// 若寫入成功則回傳
                            let tr_data = {};
                            tr_data.nd_id = result.insertId;
                            tr_data.tr_action = 1;
                            tr_data.create_user = arraydata.owner.last_update_user;
                            tr_c.actionCreate(tr_data);
                            return
                        }, (err) => {// 若寫入失敗則回傳
                            n_boolean = false;
                            return
                        })
                        if (!n_boolean) {
                            break
                        }
                    }
                }, (err) => {// 若寫入失敗則回傳
                    db.rollback();
                })
            }
            db.commit();
            return res.json(data);
        } catch (error) {
            db.rollback();
            await ct_s.writeErrorLog(error,'#010301','OwnerDataController','actionModify');
            return res.json('#010301');
        }
    }

    // 業主回覆頁修改
    async actionModifyByOwner(req, res, next){
        const od_m = new OwnerData;
        const qd_m = new QuestionData;
        const ct_s = new CommonTools;
        const tr_c = new TransactionRecord;
        try {
            let data = {};
            let arraydata = {};
            arraydata = req.body;
            if(!arraydata.owner.od_id || arraydata.owner.od_id == ''){
                res.json('尚未傳入站主編號！')
            }

            db.beginTransaction();
            // 將資料寫入資料庫
            await od_m.update(arraydata.owner).then(result => {// 若寫入成功則回傳
                data = true;
                let tr_data = {};
                tr_data.od_id = arraydata.owner.od_id;
                tr_data.tr_action = 2;
                tr_data.create_user = arraydata.owner.last_update_user;
                tr_c.actionCreate(tr_data);
            }, (err) => {// 若寫入失敗則回傳
                db.rollback();
                data = false;
            })
            if(arraydata.question.length > 0){
                var q_boolean = true;
                let modifydata = {};
                for (let i = 0; i < arraydata.question.length; i++) {
                    // 將資料寫入資料庫
                    modifydata.qd_content = JSON.stringify(arraydata.question[i].qd_content);
                    modifydata.qd_id = arraydata.question[i].qd_id;
                    modifydata.qd_answer = arraydata.question[i].qd_answer;
                    qd_m.update(modifydata).then(result => {// 若寫入成功則回傳
                        console.log(arraydata.question[i])
                        let tr_data = {};
                        tr_data.qd_id = arraydata.question[i].qd_id;
                        tr_data.tr_action = 2;
                        tr_data.create_user = arraydata.owner.last_update_user;
                        tr_c.actionCreate(tr_data);
                        return
                    }, (err) => {// 若寫入失敗則回傳
                        q_boolean = false;
                        db.rollback();
                        return
                    })
                    if (!q_boolean) {
                        break
                    }
                }
            }
            db.commit();
            return res.json(data);
        } catch (error) {
            db.rollback();
            await ct_s.writeErrorLog(error,'#010301','OwnerDataController','actionModify');
            return res.json('#010301');
        }
    }

    // 刪除
    async actionDelete(req, res, next){
        const od_m = new OwnerData;
        const ct_s = new CommonTools;
        const tr_c = new TransactionRecord;
        try {
            let data = {};
            let arraydata = {};
            arraydata = req.body;
            if(!arraydata.od_id || arraydata.od_id == ''){
                res.json('尚未傳入站主編號！')
            }
            // 將資料寫入資料庫
            await od_m.delete(arraydata).then(result => {// 若寫入成功則回傳
                data = true;
                let tr_data = {};
                tr_data.od_id = arraydata.od_id;
                tr_data.tr_action = 3;
                tr_data.create_user = arraydata.last_update_user;
                tr_c.actionCreate(tr_data);
            }, (err) => {// 若寫入失敗則回傳
                data = false;
            })
            return res.json(data);
        } catch (error) {
            await ct_s.writeErrorLog(error,'#010401','OwnerDataController','actionDelete');
            return res.json('#010401');
        }
    }

    // 關閉
    async actionClose(req, res, next){
        const od_m = new OwnerData;
        const ct_s = new CommonTools;
        const tr_c = new TransactionRecord;
        try {
            let data = {};
            let arraydata = {};
            arraydata = req.body;
            if(!arraydata.od_id || arraydata.od_id == ''){
                res.json('尚未傳入站主編號！')
            }
            // 將資料寫入資料庫
            await od_m.close(arraydata).then(result => {// 若寫入成功則回傳
                data = true;
                let tr_data = {};
                tr_data.od_id = arraydata.od_id;
                tr_data.tr_action = 2;
                tr_data.create_user = arraydata.last_update_user;
                tr_c.actionCreate(tr_data);
            }, (err) => {// 若寫入失敗則回傳
                data = false;
            })
            return res.json(data);
        } catch (error) {
            await ct_s.writeErrorLog(error,'#010401','OwnerDataController','actionDelete');
            return res.json('#010401');
        }
    }
}

module.exports = OwnerDataController;
