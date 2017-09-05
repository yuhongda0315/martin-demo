const fs 		= require('fs');
const sqlite3 	= require('co-sqlite3');
const co 		= require('co');
const thunkify 	= require('thunkify');

var isExist = (url) => {
	return fs.existsSync(url);
};

// 仅支持多级相对路径
var mkdir = (url) => {
	if (isExist(url)) {
		return;
	}
	var mkdirSync = thunkify(fs.mkdirSync);
	var dirs = url.split('/');
	var dirname = '';
	dirs.forEach((name) => {
		dirname = dirname ? (dirname += '/' + name) : name;
		if (!isExist(dirname)) {
			co(function*() {
				yield mkdirSync(dirname);
			});
		}
	});
};

var stringFormat = (str, vals) => {
	for (var i = 0, len = vals.length; i < len; i++) {
		var val = vals[i],
			reg = new RegExp("\\{" + (i) + "\\}", "g");
		str = str.replace(reg, val);
	}
	return str;
};

var isPrimary = (column) => {
	return column == 'id';
};

var path = '';

var sqlTpl = {
	staff: [
		'$id, $name, $email, $portrait_url,',
		'$portrait_big_url, $mobile, $tel, $is_deleted, $state,',
		'$depart_id, $depart_name, $supervisor_id, $supervisor_name,',
		'$duty_name, $company_id, $user_type, $update_dt, $version'
	]
};

var process = (callback) => {
	return co(function*() {
		var db = yield sqlite3(path);
		callback(db);
		db.close();
	});
};

var Staff = {};

var transferProto = (obj, callback) => {
	callback = callback || function(){ }
	var ret = {};
	for (var key in obj) {
		var proto = '$' + key;
		var val = obj[key];
		ret[proto] = val;
		callback(proto, key, val);
	}
	return ret;
};

Staff.add = (params, callback) => {
	var buildSQL = () => {
		var sql = sqlTpl.staff;
		sql.unshift('insert into Staff values(');
		sql.push(')');
		return sql.join('');
	};
	var data = params.data;
	data = transferProto(data);

	co(function*() {
		var db = yield sqlite3(path);
		var doc = yield db.get('select * from Staff where id = ?', data.$id);
		if (!doc) {
			var sql = buildSQL();
			db.run(sql, data);
		}
		var error = null;
		callback(error);

	}).catch(callback);
};

Staff.remove = (params, callback) => {
	var sql = 'delete from Staff where id = $id';
	var data = params.data;
	data = transferProto(data);

	process((db) => {
		db.run(sql, data);
		var error = null;
		callback(error);
	}).catch(callback);
};

Staff.update = (params, callback) => {
	var sql = 'update Staff set ';
	var data = params.data;
	var columns = [];
	//动态拼接 SQL
	data = transferProto(data, (proto, key ,val) => {
		if (isPrimary(key)) {
			return;
		}
		var column = key + '=' + proto;
		columns.push(column);
	});
	sql += columns.join(',');
	sql += ' where id = $id';

	process((db) => {
		db.run(sql, data);
		var error = null;
		callback(error);
	}).catch(callback);
};

Staff.get = (params, callback) => {
	var sql = sqlTpl.staff;
	sql.unshift('select ');
	sql.push(' from Staff where id = $id');
	sql = sql.join('');

	var data = params.data;
	data = transferProto(data);
	co(function* (){
		var db = yield sqlite3(path);
		var doc = db.get(sql, data);
		db.close();		
		var error = null;
		callback(error, doc);
	}).catch(callback);
};

Staff.search = (params, callback) => {
	var data = params.data;

	var columns = sqlTpl.staff;
	columns = columns.join('');
	columns = columns.replace(/\$/g, '');
	var sql = ['select '];
	sql.push(columns);
	sql.push(' from Staff where name like "%' + data.name + '%"');
	sql = sql.join('');
	co(function* (){
		var db = yield sqlite3(path);
		var rows = yield db.all(sql, {});
		db.close();
		var error = null;
		callback(error, rows);
	}).catch(callback);	
};

/*
	params.type : run | all
*/
Staff.execSQL = (params, callback) => {
	var sql = params.sql;
	var type = params.type;
	co(function* (){
		var db = yield sqlite3(path);
		var ret = yield db[type](sql);
		var error = null;
		callback(error, ret);
		db.close();
	}).catch(callback);
};

var initDB = () => {
	// Staff
	var staff = sqlTpl.staff.join('');
	staff = staff.replace(/\$/g, '');
	staff = 'CREATE TABLE IF NOT EXISTS Staff(' + staff + ')';

	// Group

	process(function(db) {
		db.run(staff);
	});
};

var init = (params) => {
	var urlTpl = '{0}/{1}';
	var url = params.url;
	var filename = params.filename;

	if (!filename || !url) {
		throw new Error('datastore init params error.');
	}

	path = stringFormat(urlTpl, [url, filename]);

	isExist(url) || mkdir(url);

	initDB();

	return {
		Staff
	};
};

module.exports.init = init;