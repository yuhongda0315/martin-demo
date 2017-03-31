var mongo  = require('mongodb'),
    config = require('./conf');

var server = new mongo.Server(config.DB_HOST,config.DB_PORT,{auto_reconnect:true,poolSize:10}),
    db = new mongo.Db(config.DB_NAME,server,{safe:true});

var ioFactory = function(db,collection){

}
/**
* 插入一行
* @param {string} collection 表名称。
* @param {object} data 数据对象,字段要严格匹配 collection 中的字段。
* @param {object} callback 可选参数，回调函数。
*/
exports.insertOne = function(collection,data,callback){
   db.open(function(err,db){
     db.collection(collection).insert(data,function(err,ret){
       db.close();
        if (callback) {
            err ? callback.onError(err) : callback.onSuccess(ret.insertedId);
        }
     });
   });
}

/**
* 插入多行
* @param {string} collection 表名称
* @param {array} datas 数据对象数组
* @param {object} callback 可选参数，回掉函数
*/
exports.insertMany = function(collection,datas,callback){
  db.open(function(err,db){
    db.collection(collection).insertMany(datas,function(err,ret){
      if (callback) {
          err ? callback.onError(err) : callback.onSuccess(ret.ops);
      }
      db.close();
    });
  });
}

exports.update = function(collection,condition,data){
   db.open(function(err,db){
     db.collection(collection).updateOne(condition,data);
     db.close();
   });
}

exports.updateAll = function(collection,data){

}

exports.remove = function(collection,condition){

}

exports.removeAll = function(collection){

}

exports.findByPage = function(collection,condition,callback){
  db.open(function(err,db){
    db.collection(collection).find(condition).toArray(function(err,ret){
      callback.onSuccess(ret);
      db.close();
    });
  });
}

exports.findAll = function(collection,condition,callback){

}
