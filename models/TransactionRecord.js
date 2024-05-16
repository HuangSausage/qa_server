const db = require('./connection_db');

class TransactionRecord {
	getAllData(){
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM qa_transaction_record WHERE isflag = 1 ORDER BY tr_id DESC',function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(rows);
            })
        })
    }
    create(arraydata){
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO qa_transaction_record SET ?', arraydata, function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(true);
            })
        });
    }
}

module.exports = TransactionRecord;