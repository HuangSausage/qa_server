const db = require('./connection_db');

class OwnerData {
	getAllData(arraydata){
        var string = 'SELECT * FROM qa_owner_data WHERE isflag = 1 ';
        if(arraydata.od_name){
            string = string+'AND od_name LIKE "%'+arraydata.od_name+'%" ';
        }
        if(arraydata.od_status || arraydata.od_status === 0){
            string = string+'AND od_status = '+arraydata.od_status+' ';
        }
        if(arraydata.create_user){
            string = string+'AND create_user = "'+arraydata.create_user+'" ';
        }
        return new Promise((resolve, reject) => {
            db.query(string+'ORDER BY '+arraydata.orderBy+' '+arraydata.sort, function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(rows);
            })
        })
	}
    reset(){
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM qa_owner_data' , function(err, rows){
                if (err) {
                    reject(false);
                    return;
                }
                resolve(true);
            })
        })
    }
    getDataByOdId(od_id){
        let result = {};
        return new Promise((resolve, reject) => {
            // 尋找是否有重複的
            db.query('SELECT * FROM qa_owner_data WHERE isflag = 1 AND od_id = ?',od_id, function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                result = rows[0];
                resolve(result);
            })
        })
    }
    // 確認後置碼是否有被其他站主使用
    getDataByIdSuffix(od_id,od_suffix){
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM qa_owner_data WHERE isflag = 1 AND od_id != "'+od_id+'" AND od_suffix = "'+od_suffix+'"', function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(rows);
            })
        })
    }
    getDataBySuffix(od_suffix){
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM qa_owner_data WHERE isflag = 1 AND od_suffix = "'+od_suffix+'"', function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(rows);
            })
        })
    }
    getDataByOdIdSuffix(arraydata){
        return new Promise((resolve, reject) => {
            db.query('SELECT od_id,od_suffix FROM qa_owner_data WHERE isflag = 1 AND od_id = '+arraydata.od_id+' AND od_suffix = "'+arraydata.od_suffix+'"', function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(rows[0]);
            })
        })
    }
    close(arraydata) {
        arraydata.od_status = 0;
        return new Promise((resolve, reject) => {
            db.query('UPDATE qa_owner_data SET ? WHERE od_id =' + arraydata.od_id, arraydata , function(err, rows){
                if (err) {
                    reject(false);
                    return;
                }
                resolve(true);
            })
        })
    }
    delete(arraydata) {
        arraydata.isflag = 0;
        return new Promise((resolve, reject) => {
            db.query('UPDATE qa_owner_data SET ? WHERE od_id =' + arraydata.od_id, arraydata , function(err, rows){
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
            db.query('INSERT INTO qa_owner_data SET ?', arraydata, function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(rows);
            })
        })
    }
    update(arraydata) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE qa_owner_data SET ? WHERE od_id =' + arraydata.od_id, arraydata , function(err, rows){
                if (err) {
                    reject(false);
                    return;
                }
                resolve(true);
            })
        })
    }
}

module.exports = OwnerData;
