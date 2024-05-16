const db = require('./connection_db');

class NotifyData {
    getDataByOdId(od_id){
        return new Promise((resolve, reject) => {
            db.query('SELECT od_id,nd_title,nd_image,nd_order FROM qa_notify_data WHERE isflag = 1 AND od_id = ?',od_id, function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(rows);
            })
        })
    }

    getDataById(nd_id){
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM qa_notify_data WHERE isflag = 1 AND nd_id = ?',nd_id, function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                var string=JSON.stringify(rows[0]);
                var data = JSON.parse(string)
                resolve(data);
            })
        })
    }

    deleteByOdId(od_id){
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM qa_notify_data WHERE od_id = ?' , od_id , function(err, rows){
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
            db.query('UPDATE qa_notify_data SET ? WHERE nd_id =' + arraydata.nd_id, arraydata , function(err, rows){
                if (err) {
                    reject(false);
                    return;
                }
                resolve(true);
            })
        })
    }

    create(arraydata){
        console.log('新增一筆')
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO qa_notify_data SET ?', arraydata, function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(rows);
            })
        })
    }

    update(arraydata){
        return new Promise((resolve, reject) => {
            db.query('UPDATE qa_notify_data SET ? WHERE nd_id =' + arraydata.nd_id, arraydata , function(err, rows){
                if (err) {
                    reject(false);
                    return;
                }
                resolve(true);
            })
        })
    }
}

module.exports = NotifyData;