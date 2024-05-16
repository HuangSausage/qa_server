const db = require('./connection_db');

class UserData {
    getAllData(arraydata){
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM qa_user_data WHERE isflag = 1 AND ( ud_name LIKE "%'+arraydata.ud_name+'%" OR ud_account LIKE "%'+arraydata.ud_name+'%") ORDER BY create_date DESC', function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(rows);
            })
        })
    }
    getDataById(ud_id){
        return new Promise((resolve, reject) => {
            // 尋找是否有重複的account
            db.query('SELECT * FROM qa_user_data WHERE isflag = 1 AND ud_id = '+ud_id, function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(rows[0]);
            })
        })
    }
    getDataByAccount(ud_account){
        return new Promise((resolve, reject) => {
            // 尋找是否有重複的account
            db.query('SELECT ud_account FROM qa_user_data WHERE ud_account = ? AND isflag = 1', arraydata.ud_account, function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(rows.length);
            })
        })
    }
    getUserByLogin(arraydata){
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM qa_user_data WHERE isflag = 1 AND ud_account = "'+arraydata.ud_account+'" AND ud_password = "'+arraydata.ud_password+'"', function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                if(rows.length == 0){
                    reject(false);
                    return;
                }
                resolve(rows[0]);
            })
        })
    }
    getAllUserLastLogin(){
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM qa_user_data WHERE isflag = 1 AND ud_last_login != "null" ORDER BY ud_last_login DESC', function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(rows);
            })
        })
    }
    getDataByIdPwd(ud_id,ud_password){
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM qa_user_data WHERE isflag = 1 AND ud_id = "'+ud_id+'" AND ud_password = "'+ud_password+'"', function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(rows);
            })
        })
    }
    delete(arraydata) {
        arraydata.isflag = 0;
        return new Promise((resolve, reject) => {
            db.query('UPDATE qa_user_data SET ? WHERE ud_id =' + arraydata.ud_id, arraydata , function(err, rows){
                if (err) {
                    reject(false);
                    return;
                }
                resolve(true);
            })
        })
    }
    create(arraydata) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO qa_user_data SET ?', arraydata, function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(true);
            })
        })
    }
    update(arraydata) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE qa_user_data SET ? WHERE ud_id =' + arraydata.ud_id, arraydata , function(err, rows){
                if (err) {
                    reject(false);
                    return;
                }
                resolve(true);
            })
        })
    }
}

module.exports = UserData;
