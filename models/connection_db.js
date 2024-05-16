// DataBase
const config = require('../config/development_config');
const mysqlt = require("mysql");

///////////// 連接真資料庫 ///////////////////////////
const connection = mysqlt.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    port: config.mysql.port
});

// connection.beginTransaction(function (err) {
//     if (err) {
//         console.log(err)
//     }
// });

// connection.connect(err => {
//     if (err) {
//         console.log('失敗就是失敗，別再逼逼了！');
//     } else {
//         console.log('成功連結上了，早安你好嗎~~~');
//     }
// });
module.exports = connection;

//////////// 連接緩存資料庫 ////////////////////////
// const pool = mysqlt.createPool({
//     host: config.mysql.host,
//     user: config.mysql.user,
//     password: config.mysql.password,
//     database: config.mysql.database,
//     port: config.mysql.port
// });

// module.exports = pool;