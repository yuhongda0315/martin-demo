(function(dependencies) {
	var win = dependencies.win;
	var $ = dependencies.$;
	var Vue = dependencies.Vue;
	var _ = dependencies.underscore;

	var toneMap = {
		C: 0,
		D: 1,
		bE: 1.5,
		E: 2,
		F: 2.5,
		G: 3.5,
		bA: 4,
		A: 4.5,
		bB: 5,
		B: 5.5
	};

	var tones = _.map(toneMap, function(v, k) {
		return k;
	});
	var data = {
		showTone: '',
		tones: tones,
		tone: '',
		song: ''
	};
	var sharpei = new Vue({
		el: '#main',
		data: data,
		methods: {
			toner: function(tone){
				this.tone = tone;
				calc();
			},
			singer: function(song){
				this.song = song;
				calc();
			}
		}
	});

	function clear(){
		sharpei.tone = '';
		sharpei.song = '';
	}
	function calc(){
		var max = 6;
		var tone = sharpei.tone;
		var song = sharpei.song;
		if (!song || !tone) {
			return;
		}
		var toneValue = toneMap[tone];
		var songValue = toneMap[song];
		var val = songValue - toneValue;

		if (val < 0) {
			val = max - Math.abs(val);
		}

		if (val > max) {
			val = val - max;
		}

		sharpei.showTone = findProto(toneMap, function(item){
			return item[1] == val;
		})[0];
		clear();
	}
	function findProto(obj, func){
		return _.filter(_.pairs(obj), function(item){
			return func(item);
		})[0];
	}
})({
	win: window,
	Vue: Vue,
	jQuery: $,
	underscore: _
});