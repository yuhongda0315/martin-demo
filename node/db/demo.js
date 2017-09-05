var datastore = require('./datastore');

var params = {
	url: 'martin',
	filename: 'datastore.db'
};
datastore = datastore.init(params);

var Staff = datastore.Staff;

var params = {
	data: {
		id : "12sk6KwCHLYmWaRAfTe",
	    name : "飞天奖",
	    email : "yuhongda@rongcloud.cn",
	    portrait_url : "https://rongcloud-image.cn.ronghub.com/11b5634363a0d64375.gif",
	    portrait_big_url : "https://rongcloud-image.cn.ronghub.com/11b5634363a0d64375.gif",
	    mobile : "13269772769",
	    tel : "13269772769",
	    is_deleted : 0,
	    state : 0,
	    depart_id : "jimF2DqBHaDUnYnfLwZsGC",
	    depart_name : "前端开发中心",
	    supervisor_id : "AVFvYCzogPctWX4ApuPecT",
	    supervisor_name : "薛争锋",
	    duty_name : "",
	    company_id : "bkjn3dn9ms9Gft5mmcC4ai",
	    user_type : 0,
	    update_dt : 1494303364000,
	    version : 3 
	}
};
// Staff.add(params, (error, ret) => {
// 	console.log(error);
// });

// Staff.update(params, (error, ret) => {
// 	console.log(error);
// });

var params = {
	data: {
		name: 'M'
	}
};
Staff.search(params, (error, rows) => {
	console.log(rows.length);
});

// var params = {
// 	sql: 'select * from Staff',
// 	type: 'all'
// };
// Staff.execSQL(params, (error, ret) => {
// 	console.log(error, ret);
// });