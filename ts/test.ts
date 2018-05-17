/// <reference path="./RongIMLib.d.ts" />
module Merda {
	export class Client {
		static init(params: any): void{
			RongIMLib.RongIMClient.init('appkey');
			RongIMLib.ConversationType.PRIVATE
		}
	}
}