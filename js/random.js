var ParRandom = (function() {

    var copy = function(from, to, callback, force) {
        
        callback = callback || function(k, v, t){
            t[k] = v;
        };

        for (var key in from) {
            var value = from[key];
            if (to.hasOwnProperty(key)) {
                force && callback(key, value, to);
            }else{
                callback(key, value, to);
            }
        }
        return to;
    };

    var cache = {
        store: {},
        set: function(key, value) {
            this.store[key] = value;
        },
        get: function(key) {
            return this.store[key];
        }
    };

    var stringFormat = function(str, vals) {
        for (var i = 0, len = vals.length; i < len; i++) {
            var val = vals[i],
                reg = new RegExp("\\{" + (i) + "\\}", "g");
            str = str.replace(reg, val);
        }
        return str;
    };

    var checkElement = function(element) {
        return element && typeof element.innerHTML == 'string';
    };

    var draw = function(callback) {
        var element = cache.get('element');
        if (!checkElement(element)) {
            throw new Error('config.element error.');
        }
        var members = cache.get('members'),
            tpl = cache.get('tpl');

        for (var i = 0, len = members.length; i < len; i++) {
            var _tpl = stringFormat(tpl, [i, members[i]]);
            element.innerHTML += _tpl;
        }
        callback();
    };

    var getIndex = function(range) {
        return Math.floor(Math.random() * range);
    };
    /*
        var rates = [{ speed:50, step:0}, { speed:1, step:2}, { speed:0, step:50}];
    */
    var start = function(callback) {
        var members = cache.get('members'),
            range = members.length;

        cache.set('callback', callback);
        var speed = 30,
            count = 0,
            timer = 0;
        // TOTO 可配置
        var step = {
            0: function() {
                restart();
            },
            2: function() {
                speed = 1;
                restart();
            },
            80: function() {
                speed = 0;
                count = 0;
                clearInterval(timer);
            }
        };

        var process = function() {
            step[count] && step[count]();
            var index = getIndex(range);
            cache.get('callback')({
                member: members[index],
                index: index
            });
            count++;
        };

        function restart() {
            clearInterval(timer);
            timer = setInterval(process, 20 * speed);
        };

        step['0']();
    };


    /*
        config.members : ['水色', '杨川', 'Eva', '福运', 'Martin', 'Once Again']
        config.tpl: '<div class="member" id="{0}">{1}</div>'
        config.element: HTMLElement
     */
    return function(config, callback) {
        var _config = {
            members: [],
            tpl: '<div class="member" id="random-member-{0}">{1}</div>',
            element: null
        };
        copy(_config, config);

        // 缓存 config
        for (var key in config) {
            cache.set(key, config[key]);
        }
        draw(function() {
            var instance = {
                start: start
            };
            callback && callback(instance);
        });

    };
})();