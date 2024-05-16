const db = require('./connection_db');

class QuestionData {
	getAllData(arraydata){
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM qa_question_data LEFT JOIN wms_logosort on qa_question_data.qd_id = wms_logosort.qd_id WHERE qa_question_data.isflag = 1 AND qa_question_data.ld_name LIKE "%'+arraydata.ld_name+'%" ORDER BY wms_logosort.ls_sort ASC', function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(rows);
            })
        })
	}
    getDataById(qd_id){
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM qa_question_data WHERE isflag = 1 AND qd_id = '+qd_id, function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(rows[0]);
            })
        })
	}
    getDataByOdId(od_id){
        return new Promise((resolve, reject) => {
            db.query('SELECT qd_id,od_id,qd_title,qd_content,qd_image,qd_order,qd_type,qd_answer FROM qa_question_data WHERE isflag = 1 AND od_id = '+od_id+' ORDER BY qd_order ASC ', function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(rows);
            })
        })
	}
    getDataByIdName(qd_id,ld_name){
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM qa_question_data WHERE isflag = 1 AND qd_id != "'+qd_id+'" AND ld_name = "'+ld_name+'"', function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                if(rows.length == 0){
                    reject(false);
                    return;
                }
                resolve(rows);
            })
        })
    }
    getDataByName(ld_name){
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM qa_question_data WHERE isflag = 1 AND ld_name = "'+ld_name+'"', function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(rows);
            })
        })
    }
    deleteByOdId(od_id){
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM qa_question_data WHERE od_id = ?' , od_id , function(err, rows){
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
            db.query('UPDATE qa_question_data SET ? WHERE qd_id =' + arraydata.qd_id, arraydata , function(err, rows){
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
            db.query('INSERT INTO qa_question_data SET ?', arraydata, function (err, rows) {
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
            db.query('UPDATE qa_question_data SET ? WHERE qd_id =' + arraydata.qd_id, arraydata , function(err, rows){
                if (err) {
                    reject(false);
                    return;
                }
                resolve(true);
            })
        })
    }
}

module.exports = QuestionData;
