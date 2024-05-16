const db = require('./connection_db');

class ErrorLog {
    create(arraydata) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO errorlog SET ?', arraydata, function (err, rows) {
                if (err) {
                    reject(false);
                    return;
                }
                resolve(rows);
            })
        })
    }
}

module.exports = ErrorLog;
