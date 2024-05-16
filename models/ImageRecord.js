const db = require('./connection_db');

class ImageRecord {
	getDataByQdId(qd_id){
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM qa_image_record WHERE isflag = 1 AND qd_id = '+qd_id, function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(rows);
            })
        })
	}
    getDataByNdId(nd_id){
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM qa_image_record WHERE isflag = 1 AND nd_id = '+nd_id, function (err, rows) {
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
            db.query('UPDATE qa_image_record SET ? WHERE ir_id =' + arraydata.ir_id, arraydata , function(err, rows){
                if (err) {
                    reject(false);
                    return;
                }
                resolve(true);
            })
        })
    }
    createGetId(arraydata) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO qa_image_record SET ?', arraydata, function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                // resolve(true);
            })
            db.query('SELECT MAX(ir_id) FROM qa_image_record WHERE isflag = 1', function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(rows['MAX(ir_id)']);
            })
        })
    }
    create(arraydata) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO qa_image_record SET ?', arraydata, function (err, rows) {
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
            db.query('UPDATE qa_image_record SET ? WHERE ir_id =' + arraydata.ir_id, arraydata , function(err, rows){
                if (err) {
                    reject(false);
                    return;
                }
                resolve(true);
            })
        })
    }
}

module.exports = ImageRecord;
