const UserData = require('../models/UserData');
const TransactionRecord = require('../controllers/TransactionRecordController');
const CommonTools = require('../services/CommonTools');
const jwt = require('jsonwebtoken');
const config = require('../config/development_config');
// 錯誤代碼 05  01取值 02新增 03修改 04刪除 #0501XX
class UserDataController {
    // 取值
    async getAllData(req, res, next){
        const ud_m = new UserData;
        const ct_s = new CommonTools;
        try {
            let data = {};
            data.user = {};
            if(!req.query.ud_name || req.query.ud_name == ''){
                data.user.ud_name = '';
            }else{
                data.user.ud_name = req.query.ud_name;
            }
            await ud_m.getAllData(data.user).then(result => {// 若寫入成功則回傳
                data.user.users = result;
            }, (err) => {// 若寫入失敗則回傳
                data.user.users = [];
            })
            return res.json(data)
        } catch (error) {
            await ct_s.writeErrorLog(error,'#050101','UserDataController','getAllData');
            return res.json('#050101');
        }
    }

    // 取值
	async getUsers(req, res, next){
        const ud_m = new UserData;
        const ct_s = new CommonTools;
        try {
            let data = [];
            let arraydata = {}
            if(!req.query.ud_name || req.query.ud_name == ''){
                arraydata.ud_name = '';
            }else{
                arraydata.ud_name = req.query.ud_name;
            }
            await ud_m.getAllData(arraydata).then(result => {// 若寫入成功則回傳
                data = result;
            }, (err) => {// 若寫入失敗則回傳
                data = [];
            })
            return res.json(data)
        } catch (error) {
            await ct_s.writeErrorLog(error,'#050102','UserDataController','getUsers');
            return res.json('#050102');
        }
	}

    // 取值
    async getUser(req, res, next){
        const ud_m = new UserData;
        const ct_s = new CommonTools;
        try {
            let data = {};
            if(!req.query.ud_id || req.query.ud_id == ''){
                res.json('尚未傳入使用者編號！')
            }
            await ud_m.getDataById(req.query.ud_id).then(result => {// 若寫入成功則回傳
                data = result;
            }, (err) => {// 若寫入失敗則回傳
                data = '資料獲取失敗';
            })
            return res.json(data)
        } catch (error) {
            await ct_s.writeErrorLog(error,'#050103','UserDataController','getUser');
            return res.json('#050103');
        }
	}

    // 取值
    async checkUser(req, res, next){
        const ud_m = new UserData;
        const ct_s = new CommonTools;
        try {
            let data = {};
            let boolean = false;
            // 獲取client端資料
            const arraydata = {
                ud_account: req.body.user.ud_account,
                ud_password: req.body.user.ud_password,
            }
            // 抓取資料
            await ud_m.getUserByLogin(arraydata).then(result => {// 若寫入成功則回傳
                data.user = result;
                boolean = true;
            }, (err) => {// 若寫入失敗則回傳
                res.json(false)
            })
            if(boolean){
                var token = jwt.verify(req.body.token, config.secret);
                // 超過登入時間
                if(Math.floor(Date.now() / 1000) > token.exp){
                    return res.json(false);
                }
                // 產生token
                const new_token = jwt.sign({
                    algorithm: 'HS256',
                    exp: Math.floor(Date.now() / 1000) + (60 * 60), // token一個小時後過期。
                    data: data.ud_id
                }, config.secret);
                data.token = new_token;
                return res.json(data);
            }else{
                return res.json(false);
            }
        } catch (error) {
            await ct_s.writeErrorLog(error,'#050104','UserDataController','checkUser');
            return res.json('#050104');
        }
    }

    // 登入用
    async login(req, res, next){
        const ct_s = new CommonTools;
        const ud_m = new UserData;
        try {
            let data = {'user':{},'token':''};
            let boolean = false;
            // 獲取client端資料
            const arraydata = {
                ud_account: req.body.ud_account,
                ud_password: req.body.ud_password,
            }
            // 抓取資料
            await ud_m.getUserByLogin(arraydata).then(result => {// 若寫入成功則回傳
                data.user = result;
                boolean = true;
            }, (err) => {// 若寫入失敗則回傳
                res.json(false)
            })
            if(boolean){
                arraydata.ud_id = data.user.ud_id;
                arraydata.ud_last_login = ct_s.whatTime();
                await ud_m.update(arraydata).then(result => {// 若寫入成功則回傳
                    boolean = result;
                }, (err) => {// 若寫入失敗則回傳
                    boolean = false;
                })
                // 產生token
                const token = jwt.sign({
                    algorithm: 'HS256',
                    exp: Math.floor(Date.now() / 1000) + (60 * 60), // token一個小時後過期。
                    data: data.user
                }, config.secret);
                data.token = token;
                return res.json(data);
            }else{
                data.error = '#050105';
                return res.status(500).send();
            }
        } catch (error) {
            await ct_s.writeErrorLog(error,'#050105','UserDataController','checkUser');
            return res.json('#050105');
        }
    }

    // 新增
    async actionCreate(req, res, next){
        const ud_m = new UserData;
        const ct_s = new CommonTools;
        const tr_c = new TransactionRecord;
        try {
            let data = {};
            let boolean = true;
            // 獲取client端資料
            let arraydata = {
                ud_name: req.body.ud_name,
                ud_account: req.body.ud_account,
                ud_password: req.body.ud_password,
                ud_status:req.body.ud_status,
                ud_admin:req.body.ud_admin,
                create_user:req.body.create_user,
                create_date: ct.whatTime()
            }
            // 檢查使用者帳號是否已被使用
            await ud_m.getDataByAccount(arraydata.ud_account).then(result => {// 若寫入成功則回傳
                if(result > 0){
                    data = '該使用者帳號已被使用，請重新輸入';
                    boolean = false;
                }
            }, (err) => {// 若寫入失敗則回傳
                data = err;
                boolean = false;
            })
            if(!boolean){
                return res.json(data);
            }
            // 將資料寫入資料庫
            await ud_m.create(arraydata).then(result => {// 若寫入成功則回傳
                data = result;
            }, (err) => {// 若寫入失敗則回傳
                data = err;
            })
            return res.json(data);
        } catch (error) {
            await ct_s.writeErrorLog(error,'#050201','UserDataController','checkUser');
            return res.json('#050201');
        }
    }

    // 修改
    async actionModifyPersonal(req, res, next){
        const ud_m = new UserData;
        const ct_s = new CommonTools;
        const tr_c = new TransactionRecord;
        try {
            let data = {};
            let arraydata = {};
            if(!req.body.ud_id || req.body.ud_id == ''){
                res.json('尚未傳入使用者編號！')
            }else{
                arraydata.ud_id = req.body.ud_id;
            }
            if(req.body.ud_password){
                await ud_m.getDataByIdPwd(req.body.ud_id,req.body.ud_password).then(result => {// 若寫入成功則回傳
                    if(result.length == 0){
                        res.json('舊密碼輸入錯誤！')
                    }
                }, (err) => {// 若寫入失敗則回傳
                    res.json('出現未知錯誤！')
                })
                arraydata.ud_password = req.body.ud_new_password;
            }
            arraydata.ud_name = req.body.ud_name;
            arraydata.last_update_user = req.body.last_update_user;
            // 將資料寫入資料庫
            await ud_m.update(arraydata).then(result => {// 若寫入成功則回傳
                data = true;
            }, (err) => {// 若寫入失敗則回傳
                data = false;
            })
            if(data){
                await ud_m.getDataById(req.body.ud_id).then(result => {// 若寫入成功則回傳
                    data = result;
                }, (err) => {// 若寫入失敗則回傳
                    data = false;
                })
            }
            return res.json(data);
        } catch (error) {
            await ct_s.writeErrorLog(error,'#050301','UserDataController','checkUser');
            return res.json('#050301');
        }
    }

    // 修改
    async actionModify(req, res, next){
        const ct_s = new CommonTools;
        const ud_m = new UserData;
        const tr_c = new TransactionRecord;
        try {
            let data = {'result':true,'string':''};
            if(!req.body.ud_id || req.body.ud_id == ''){
                boolean = false;
                data = {'result':false,'string':'尚未傳入使用者編號！'}
                res.json(data)
            }
            // 獲取client端資料
            let arraydata = {};
            arraydata.ud_id = req.body.ud_id;
            if(req.body.ud_password != ''){
                arraydata.ud_password = req.body.ud_password;
            }
            arraydata.ud_status = req.body.ud_status;
            arraydata.ud_admin = req.body.ud_admin;
            arraydata.ud_name = req.body.ud_name;
            arraydata.last_update_user = req.body.last_update_user;
            // 將資料寫入資料庫
            await ud_m.update(arraydata).then(result => {// 若寫入成功則回傳
                res.json(result)
            }, (err) => {// 若寫入失敗則回傳
                res.json(err)
            })
        } catch (error) {
            await ct_s.writeErrorLog(error,'#050302','UserDataController','checkUser');
            return res.json('#050302');
        }
    }

    // 刪除
    async actionDelete(req, res, next){
        const ct_s = new CommonTools;
        const ud_m = new UserData;
        const tr_c = new TransactionRecord;
        try {
            let data = {'result':true,'string':''};
            let boolean = true;
            let arraydata = {};
            if(!req.body.ud_id || req.body.ud_id == ''){
                boolean = false;
                data = {'result':false,'string':'尚未傳入使用者編號！'}
                res.json(data)
            }else{
                arraydata.ud_id = req.body.ud_id;
                arraydata.last_update_user = req.body.last_update_user;
            }
            // 將資料寫入資料庫
            if(boolean){
                await ud_m.delete(arraydata).then(result => {// 若寫入成功則回傳
                    data = {'result':true,'string':'刪除成功！'}
                    res.json(data)
                }, (err) => {// 若寫入失敗則回傳
                    data = {'result':true,'string':'刪除失敗！'}
                    res.json(data)
                })
            }else{
                data = {'result':true,'string':'刪除失敗！'}
                res.json(data)
            }
        } catch (error) {
            await ct_s.writeErrorLog(error,'#050401','UserDataController','checkUser');
            return res.json('#050401');
        }
    }
}

module.exports = UserDataController;
