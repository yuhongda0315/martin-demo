var defaultUser = {
	name: '陌生人',
	portraitUri: 'http://7xogjk.com1.z0.glb.clouddn.com/Uz6Sw8GXx1476068767254905029'
};
var users = {
	'1002': {
		id: '1002',
		name: '小企鹅',
		portraitUri: 'http://7xogjk.com1.z0.glb.clouddn.com/675NdFjkx1466733699776768066'
	},
	'1003': {
		id: '1003',
		name: '飞翔的企鹅',
		portraitUri: 'http://7xogjk.com1.z0.glb.clouddn.com/FjsNMjYoVKfGmA86SNwnggfKgE6_'
	},
	'1004': {
		id: '1004',
		name: 'CPU',
		portraitUri: 'http://7xogjk.com1.z0.glb.clouddn.com/Tp6nLyUKX1466570511241467041'
	},
	'1005': {
		id: '1005',
		name: '西湖龙井',
		portraitUri: 'http://7xogjk.com1.z0.glb.clouddn.com/Fh4fnCvnO_SOwpuMPYGBnzBwrx6A'
	},
	'1001': {
		id: '1001',
		name: '大海飞',
		portraitUri: 'http://7xogjk.com1.z0.glb.clouddn.com/u0LUuhzHm1466557920584458984'
	}
};
var friends = [{
	displayName: "",
	message: "I am u0LUuhzHm",
	status: 20,
	updatedAt: "2016-07-23T08:32:49.000Z",
	user: {
		id: "4CDq6tYdV",
		nickname: "郭佳",
		phone: "13426313374",
		portraitUri: "http://7xogjk.com1.z0.glb.clouddn.com/4CDq6tYdV1466653333664126953",
		region: "86"
	}
}, {
	displayName: "",
	message: "",
	status: 20,
	updatedAt: "016-10-18T04:32:09.000Z0Z",
	user: {
		id: "675NdFjkx",
		nickname: "杨川",
		phone: "18201252063",
		portraitUri: "http://7xogjk.com1.z0.glb.clouddn.com/675NdFjkx1466733699776768066",
		region: "86"
	}
}, {
	displayName: "",
	message: "我是李涛",
	status: 20,
	updatedAt: "2016-09-28T02:41:31.000Z",
	user: {
		id: "LEU82p5Zk",
		nickname: "李涛",
		phone: "13671101652",
		portraitUri: "http://7xogjk.com1.z0.glb.clouddn.com/LEU82p5Zk1464574166962886963",
		region: "86"
	}
}];

var groupIds = ['Uz6Sw8GXx', '675NdFjkx', '7crjBbeZ5'];

var groups = [{
	role: 1,
	group: {
		id: "Uz6Sw8GXx",
		name: "web.",
		portraitUri: "http://7xogjk.com1.z0.glb.clouddn.com/FliXi6zl_U3YJF6K1DkZsY51trWw",
		creatorId: "675NdFjkx",
		memberCount: 5,
		maxMemberCount: 500
	}
}, {
	role: 1,
	group: {
		id: "675NdFjkx",
		name: "产品研发部",
		portraitUri: "http://7xogjk.com1.z0.glb.clouddn.com/Bj8i9FSde1479293590044522949",
		creatorId: "Uz6Sw8GXx",
		memberCount: 76,
		maxMemberCount: 500
	}
}, {
	role: 1,
	group: {
		id: "7crjBbeZ5",
		name: "test2222",
		portraitUri: "http://7xogjk.com1.z0.glb.clouddn.com/mi8t76DVu1466759842147481934",
		creatorId: "MfgILRowx",
		memberCount: 3,
		maxMemberCount: 500
	}
}];
var group = {
	'Uz6Sw8GXx': {
		id: '"Uz6Sw8GXx"',
		name: 'web.',
		portraitUri: 'http://7xogjk.com1.z0.glb.clouddn.com/FliXi6zl_U3YJF6K1DkZsY51trWw'
	},
	'675NdFjkx': {
		id: '"675NdFjkx"',
		name: '产品研发部',
		portraitUri: 'http://7xogjk.com1.z0.glb.clouddn.com/Bj8i9FSde1479293590044522949'
	},
	'7crjBbeZ5': {
		id: '"7crjBbeZ5"',
		name: 'test2222',
		portraitUri: 'http://7xogjk.com1.z0.glb.clouddn.com/mi8t76DVu1466759842147481934'
	}
}

var groupMembers = {
	'Uz6Sw8GXx': [{
		"displayName": "",
		"role": 0,
		"createdAt": "2016-03-01T09:38:08.000Z",
		"updatedAt": "2016-03-01T09:38:08.000Z",
		"user": {
			"id": "675NdFjkx",
			"nickname": "杨川",
			"portraitUri": "http://7xogjk.com1.z0.glb.clouddn.com/675NdFjkx1466733699776768066"
		}
	}, {
		"displayName": "",
		"role": 1,
		"createdAt": "2016-03-01T09:38:08.000Z",
		"updatedAt": "2016-03-01T09:38:08.000Z",
		"user": {
			"id": "MfgILRowx",
			"nickname": "郑毅123",
			"portraitUri": "http://7xogjk.com1.z0.glb.clouddn.com/FjsNMjYoVKfGmA86SNwnggfKgE6_"
		}
	}, {
		"displayName": "",
		"role": 1,
		"createdAt": "2016-03-01T09:38:08.000Z",
		"updatedAt": "2016-03-01T10:03:16.000Z",
		"user": {
			"id": "u0LUuhzHm",
			"nickname": "于洪达001",
			"portraitUri": "http://7xogjk.com1.z0.glb.clouddn.com/u0LUuhzHm1466557920584458984"
		}
	}, {
		"displayName": "",
		"role": 1,
		"createdAt": "2016-09-21T14:22:02.000Z",
		"updatedAt": "2016-09-21T14:22:02.000Z",
		"user": {
			"id": "lUHLA1jod",
			"nickname": "薛争锋",
			"portraitUri": "http://7xogjk.com1.z0.glb.clouddn.com/FrMzQAt-JEJIwnYWRc885UEGB6il"
		}
	}, {
		"displayName": "",
		"role": 1,
		"createdAt": "2016-11-22T08:36:51.000Z",
		"updatedAt": "2016-11-22T08:36:51.000Z",
		"user": {
			"id": "wmlPKfEUc",
			"nickname": "赵福运",
			"portraitUri": "http://7xogjk.com1.z0.glb.clouddn.com/FrestOvUh4089mmpHSGnz5-dUqcr"
		}
	}],
	'675NdFjkx': [{
		"displayName": "",
		"role": 1,
		"createdAt": "2016-06-23T03:43:18.000Z",
		"updatedAt": "2016-06-23T03:43:18.000Z",
		"user": {
			"id": "OIBbeKlkx",
			"nickname": "施剑峰",
			"portraitUri": ""
		}
	}, {
		"displayName": "",
		"role": 1,
		"createdAt": "2016-06-06T04:09:04.000Z",
		"updatedAt": "2016-06-06T04:09:04.000Z",
		"user": {
			"id": "675NdFjkx",
			"nickname": "杨川",
			"portraitUri": "http://7xogjk.com1.z0.glb.clouddn.com/675NdFjkx1466733699776768066"
		}
	}, {
		"displayName": "",
		"role": 1,
		"createdAt": "2016-06-22T05:29:40.000Z",
		"updatedAt": "2016-06-22T05:29:40.000Z",
		"user": {
			"id": "MfgILRowx",
			"nickname": "郑毅123",
			"portraitUri": "http://7xogjk.com1.z0.glb.clouddn.com/FjsNMjYoVKfGmA86SNwnggfKgE6_"
		}
	}, {
		"displayName": "",
		"role": 0,
		"createdAt": "2016-02-29T12:26:58.000Z",
		"updatedAt": "2016-02-29T12:26:58.000Z",
		"user": {
			"id": "Uz6Sw8GXx",
			"nickname": "郑英君",
			"portraitUri": "http://7xogjk.com1.z0.glb.clouddn.com/Uz6Sw8GXx1480657489396230957"
		}
	}, {
		"displayName": "",
		"role": 1,
		"createdAt": "2016-02-29T12:26:58.000Z",
		"updatedAt": "2016-06-28T07:25:02.000Z",
		"user": {
			"id": "hMjCbic6U",
			"nickname": "fanghe",
			"portraitUri": "http://7xogjk.com1.z0.glb.clouddn.com/hMjCbic6U1466779768249026123"
		}
	}, {
		"displayName": "",
		"role": 1,
		"createdAt": "2016-02-29T12:26:58.000Z",
		"updatedAt": "2016-02-29T12:26:58.000Z",
		"user": {
			"id": "ImgEatRGU",
			"nickname": "杨攀",
			"portraitUri": "http://7xogjk.com1.z0.glb.clouddn.com/ImgEatRGU1463128238995328857"
		}
	}, {
		"displayName": "",
		"role": 1,
		"createdAt": "2016-02-29T12:26:58.000Z",
		"updatedAt": "2016-02-29T12:26:58.000Z",
		"user": {
			"id": "mi8t76DVu",
			"nickname": "吕朋",
			"portraitUri": "http://7xogjk.com1.z0.glb.clouddn.com/mi8t76DVu1466759842147481934"
		}
	}, {
		"displayName": "",
		"role": 1,
		"createdAt": "2016-03-01T07:13:30.000Z",
		"updatedAt": "2016-03-01T07:13:30.000Z",
		"user": {
			"id": "GC2lr3GPu",
			"nickname": "王平",
			"portraitUri": ""
		}
	}, {
		"displayName": "",
		"role": 1,
		"createdAt": "2016-03-01T07:05:59.000Z",
		"updatedAt": "2016-03-01T07:05:59.000Z",
		"user": {
			"id": "YMFYnvxNu",
			"nickname": "岑裕",
			"portraitUri": ""
		}
	}, {
		"displayName": "",
		"role": 1,
		"createdAt": "2016-03-01T06:14:49.000Z",
		"updatedAt": "2016-03-01T06:14:49.000Z",
		"user": {
			"id": "AIq9Pk0Eu",
			"nickname": "师帅",
			"portraitUri": ""
		}
	}, {
		"displayName": "",
		"role": 1,
		"createdAt": "2016-03-01T06:17:55.000Z",
		"updatedAt": "2016-03-01T06:17:55.000Z",
		"user": {
			"id": "pxwX92h1u",
			"nickname": "李恩海",
			"portraitUri": "http://7xogjk.com1.z0.glb.clouddn.com/pxwX92h1u1480592195057355957"
		}
	}, {
		"displayName": "",
		"role": 1,
		"createdAt": "2016-06-22T05:29:40.000Z",
		"updatedAt": "2016-06-22T05:29:40.000Z",
		"user": {
			"id": "H5YjcPa2k",
			"nickname": "师海阳",
			"portraitUri": ""
		}
	}, {
		"displayName": "",
		"role": 1,
		"createdAt": "2016-03-01T06:58:29.000Z",
		"updatedAt": "2016-06-22T04:15:51.000Z",
		"user": {
			"id": "t1hWCOGvX",
			"nickname": "z阿明",
			"portraitUri": "http://7xogjk.com1.z0.glb.clouddn.com/FtsvvWnAcLeoHFVnRLuQ3hbyZMAC"
		}
	}, {
		"displayName": "",
		"role": 1,
		"createdAt": "2016-03-01T06:17:55.000Z",
		"updatedAt": "2016-03-01T06:17:55.000Z",
		"user": {
			"id": "Tp6nLyUKX",
			"nickname": "满少臣",
			"portraitUri": "http://7xogjk.com1.z0.glb.clouddn.com/Tp6nLyUKX1466570511241467041"
		}
	}, {
		"displayName": "",
		"role": 1,
		"createdAt": "2016-03-01T06:17:55.000Z",
		"updatedAt": "2016-03-01T06:17:55.000Z",
		"user": {
			"id": "rOMJ1vQVd",
			"nickname": "zhanglu",
			"portraitUri": "http://7xogjk.com1.z0.glb.clouddn.com/Fh4fnCvnO_SOwpuMPYGBnzBwrx6A"
		}
	}, {
		"displayName": "",
		"role": 1,
		"createdAt": "2016-03-01T06:17:55.000Z",
		"updatedAt": "2016-03-01T06:17:55.000Z",
		"user": {
			"id": "zfta479r2",
			"nickname": "周瑞",
			"portraitUri": "http://7xogjk.com1.z0.glb.clouddn.com/FhNGcU1t9fqeY8RNU9YLxB_uC0CW"
		}
	}],
	'7crjBbeZ5': [{
		"displayName": "",
		"role": 0,
		"createdAt": "2016-06-21T07:47:50.000Z",
		"updatedAt": "2016-06-21T07:47:50.000Z",
		"user": {
			"id": "MfgILRowx",
			"nickname": "郑毅123",
			"portraitUri": "http://7xogjk.com1.z0.glb.clouddn.com/FjsNMjYoVKfGmA86SNwnggfKgE6_"
		}
	}, {
		"displayName": "",
		"role": 1,
		"createdAt": "2016-06-21T07:47:50.000Z",
		"updatedAt": "2016-06-21T07:47:50.000Z",
		"user": {
			"id": "lFVuoM7Jx",
			"nickname": "zz移动",
			"portraitUri": "http://7xogjk.com1.z0.glb.clouddn.com/FpUeAftgRyYJasAm_Y1HJpmXlM9h"
		}
	}, {
		"displayName": "",
		"role": 1,
		"createdAt": "2016-06-21T07:47:50.000Z",
		"updatedAt": "2016-06-21T07:47:50.000Z",
		"user": {
			"id": "u0LUuhzHm",
			"nickname": "于洪达001",
			"portraitUri": "http://7xogjk.com1.z0.glb.clouddn.com/u0LUuhzHm1466557920584458984"
		}
	}]
};