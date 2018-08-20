/// <reference path="path/RongIMLib-2.3.2.d.ts" />
module RongIM {
	export class Client {
		static init(params: any): void{
      var RongIMClient = RongIMLib.RongIMClient;
			RongIMClient.init('appkey');
      // ...
      // 更多参考: http://www.rongcloud.cn/docs/web_api_demo.html
		}
	}
}