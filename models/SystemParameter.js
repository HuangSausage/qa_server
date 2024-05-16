const db = require('./connection_db');

class SystemParameter {
	getDataByKey(sp_parameterkey){
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM qa_system_parameter WHERE isflag = 1 AND sp_parameterkey = ?',sp_parameterkey, function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(JSON.parse(JSON.stringify(rows[0])));
            })
        })
    }
    update(arraydata) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE qa_system_parameter SET ? WHERE sp_id =' + arraydata.sp_id, arraydata , function(err, rows){
                if (err) {
                    reject(false);
                    return;
                }
                resolve(true);
            })
        })
    }
}

module.exports = SystemParameter;