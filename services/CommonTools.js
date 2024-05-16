const ErrorLog = require('../models/ErrorLog');
class CommonTools {
    //取得現在時間，並將格式轉成YYYY-MM-DD HH:MM:SS
    whatTime() {
        const date = new Date();
        const mm = date.getMonth() + 1;
        const dd = date.getDate();
        const hh = date.getHours();
        const mi = date.getMinutes();
        const ss = date.getSeconds();

        return [date.getFullYear(), "-" +
            (mm > 9 ? '' : '0') + mm, "-" +
            (dd > 9 ? '' : '0') + dd, " " +
            (hh > 9 ? '' : '0') + hh, ":" +
            (mi > 9 ? '' : '0') + mi, ":" +
            (ss > 9 ? '' : '0') + ss
        ].join('');
    }

    // 錯誤提示紀錄
    async writeErrorLog(message, code = null, fileName = null, functionName = null){
        const el_r = new ErrorLog
        const data = {};
        data.log_message = message;
        if (code) {
            data.log_code = code;
        }
        if (fileName) {
            data.log_file = fileName;
        }
        if (functionName) {
            data.log_function = functionName;
        }

        await el_r.create(data).then(result => {// 若寫入成功則回傳
            return true;
        }, (err) => {// 若寫入失敗則回傳
            return false
        })
    }
}

module.exports = CommonTools;