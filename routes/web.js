var express = require('express');
var router = express.Router();

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 站主
const Owner = require('../controllers/OwnerDataController');
owner = new Owner();
// 取值
router.get('/owner-all-data', owner.getAllData);
// router.get('/owners', owner.getOwners);
router.get('/owner', owner.getOwner);
router.post('/login_owner', owner.getOwnerByLogin);
// 功能
router.post('/owner-create', owner.actionCreate);
router.post('/owner-modify', owner.actionModify);
router.post('/owner-self-modify', owner.actionModifyByOwner);
router.post('/owner-delete', owner.actionDelete);
router.post('/owner-close', owner.actionClose);


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 問題
const Question = require('../controllers/QuestionDataController');
question = new Question();
// 取值
router.get('/question-all-data', question.getAllData);
// router.get('/questions', question.getQuestions);
// router.get('/question', question.getQuestion);
// 功能
router.post('/question-create', question.actionCreate);
router.post('/question-modify', question.actionModify);
router.post('/question-delete', question.actionDelete);


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 通知
const Notify = require('../controllers/NotifyDataController');
notify = new Notify();
// 取值
router.get('/notify-all-data', notify.getAllData);
// router.get('/notifys', notify.getNotifys);
// router.get('/notify', notify.getNotify);
// 功能
router.post('/notify-create', notify.actionCreate);
router.post('/notify-modify', notify.actionModify);
router.post('/notify-delete', notify.actionDelete);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 上傳圖片
const Image = require('../controllers/ImageRecordController');
const multer  = require('multer')
const upload = multer({ dest: 'upload/' })
image = new Image();
// 取值
router.get('/image-all-data', image.getAllData);
// router.get('/notifys', notify.getNotifys);
// router.get('/notify', notify.getNotify);
// 功能
router.post('/image-create',upload.single('imageFile'), image.actionCreate);
router.post('/image-modify', image.actionModify);
router.post('/image-delete', image.actionDelete);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 異動紀錄
const Transaction = require('../controllers/TransactionRecordController');
transaction = new Transaction();
// 取值
router.get('/transaction-all-data', transaction.getAllData);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 使用者
const User = require('../controllers/UserDataController');
user = new User();
// 取值
router.get('/user-all-data', user.getAllData);
router.get('/users', user.getUsers);
router.get('/user', user.getUser);

// 功能
router.post('/user-check', user.checkUser);
router.post('/login', user.login);
router.post('/user-create', user.actionCreate);
router.post('/user-modify', user.actionModify);
router.post('/user-modify-personal', user.actionModifyPersonal);
router.post('/user-delete', user.actionDelete);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 系統參數
const System = require('../controllers/SystemPartameterController');
system = new System();
// 取值

// 功能
router.post('/system-sign-modify', system.actionSignModify);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = router;
