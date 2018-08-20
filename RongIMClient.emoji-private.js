/**
 * 表情帮助库
 * 具体参考文档 https://github.com/rongcloud/demo-web-sdk#表情帮助库如何使用
 * */

(function (b) {
    if (b.RongIMClient) {
        var c = {u1F600: {en: "grinning", zh: "\u72de\u7b11", tag: "\ud83d\ude00", "bp": "-1539px 0"}, u1F601: {en: "grin", zh: "\u9732\u9f7f\u800c\u7b11", tag: "\ud83d\ude01", "bp": "-1566px 0"}, u1F602: {en: "joy", zh: "\u6b22\u4e50", tag: "\ud83d\ude02", "bp": "-1593px 0"}, u1F603: {en: "smile", zh: "\u5fae\u7b11", tag: "\ud83d\ude03", "bp": "-1620px 0"}, u1F605: {en: "sweat_smile", zh: "\u8d54\u7b11", tag: "\ud83d\ude05", "bp": "-1647px 0"}, u1F606: {en: "satisfied",
            zh: "\u6ee1\u610f", tag: "\ud83d\ude06", "bp": "-1674px 0"}, u1F607: {en: "innocent", zh: "\u65e0\u8f9c", tag: "\ud83d\ude07", "bp": "-1701px 0"}, u1F608: {en: "smiling_imp", zh: "\u574f\u7b11", tag: "\ud83d\ude08", "bp": "-1728px 0"}, u1F609: {en: "wink", zh: "\u7728\u773c", tag: "\ud83d\ude09", "bp": "-1755px 0"}, u1F611: {en: "expressionless", zh: "\u9762\u65e0\u8868\u60c5", tag: "\ud83d\ude11", "bp": "-1944px 0"}, u1F612: {en: "unamused", zh: "\u4e00\u8138\u4e0d\u5feb",
            tag: "\ud83d\ude12", "bp": "-1971px 0"}, u1F613: {en: "sweat", zh: "\u6c57", tag: "\ud83d\ude13", "bp": "0 -27px"}, u1F614: {en: "pensive", zh: "\u54c0\u601d", tag: "\ud83d\ude14", "bp": "-27px -27px"}, u1F615: {en: "confused", zh: "\u8ff7\u832b", tag: "\ud83d\ude15", "bp": "-54px -27px"}, u1F616: {en: "confounded", zh: "\u56f0\u60d1\u7684", tag: "\ud83d\ude16", "bp": "-81px -27px"}, u1F618: {en: "kissing_heart", zh: "\u4eb2\u4e00\u4e2a", tag: "\ud83d\ude18",
            "bp": "-108px -27px"}, u1F621: {en: "rage", zh: "\u6124\u6012", tag: "\ud83d\ude21", "bp": "-270px -27px"}, u1F622: {en: "cry", zh: "\u54ed", tag: "\ud83d\ude22", "bp": "-297px -27px"}, u1F623: {en: "persevere", zh: "\u4f7f\u52b2", tag: "\ud83d\ude23", "bp": "-324px -27px"}, u1F624: {en: "triumph", zh: "\u751f\u6c14", tag: "\ud83d\ude24", "bp": "-351px -27px"}, u1F628: {en: "fearful", zh: "\u53ef\u6015", tag: "\ud83d\ude28", "bp": "-378px -27px"},
            u1F629: {en: "weary", zh: "\u538c\u5026", tag: "\ud83d\ude29", "bp": "-405px -27px"}, u1F630: {en: "cold_sweat", zh: "\u51b7\u6c57", tag: "\ud83d\ude30", "bp": "-567px -27px"}, u1F631: {en: "scream", zh: "\u60ca\u53eb", tag: "\ud83d\ude31", "bp": "-594px -27px"}, u1F632: {en: "astonished", zh: "\u60ca\u8bb6", tag: "\ud83d\ude32", "bp": "-621px -27px"}, u1F633: {en: "flushed", zh: "\u5446\u4f4f", tag: "\ud83d\ude33", "bp": "-648px -27px"}, u1F634: {en: "sleeping",
                zh: "\u7761\u7720", tag: "\ud83d\ude34", "bp": "-675px -27px"}, u1F635: {en: "dizzy_face", zh: "\u65ad\u7535\u4e86", tag: "\ud83d\ude35", "bp": "-702px -27px"}, u1F636: {en: "no_mouth", zh: "\u65e0\u53e3", tag: "\ud83d\ude36", "bp": "-729px -27px"}, u1F637: {en: "mask", zh: "\u75c5\u4e86", tag: "\ud83d\ude37", "bp": "-756px -27px"}, u1F3A4: {en: "microphone", zh: "KTV", tag: "\ud83c\udfa4", "bp": "-486px 0"}, u1F3B2: {en: "game_die", zh: "\u8272\u5b50", tag: "\ud83c\udfb2",
                "bp": "-513px 0"}, u1F3B5: {en: "musical_note", zh: "\u97f3\u4e50", tag: "\ud83c\udfb5", "bp": "-540px 0"}, u1F3C0: {en: "basketball", zh: "\u7bee\u7403", tag: "\ud83c\udfc0", "bp": "-567px 0"}, u1F3C2: {en: "snowboarder", zh: "\u5355\u677f\u6ed1\u96ea", tag: "\ud83c\udfc2", "bp": "-594px 0"}, u1F3E1: {en: "house_with_garden", zh: "\u623f\u5b50", tag: "\ud83c\udfe1", "bp": "-621px 0"}, u1F004: {en: "mahjong", zh: "\u9ebb\u5c06", tag: "\ud83c\udc04", "bp": "0 0"},
            u1F4A1: {en: "bulb", zh: "\u706f\u6ce1", tag: "\ud83d\udca1", "bp": "-1188px 0"}, u1F4A2: {en: "anger", zh: "\u6124\u6012", tag: "\ud83d\udca2", "bp": "-1215px 0"}, u1F4A3: {en: "bomb", zh: "\u70b8\u5f39", tag: "\ud83d\udca3", "bp": "-1242px 0"}, u1F4A4: {en: "zzz", zh: "ZZZ", tag: "\ud83d\udca4", "bp": "-1269px 0"}, u1F4A9: {en: "shit", zh: "\u72d7\u5c41", tag: "\ud83d\udca9", "bp": "-1296px 0"}, u1F4AA: {en: "muscle", zh: "\u808c\u8089", tag: "\ud83d\udcaa", "bp": "-1323px 0"},
            u1F4B0: {en: "moneybag", zh: "\u94b1\u888b", tag: "\ud83d\udcb0", "bp": "-1350px 0"}, u1F4DA: {en: "books", zh: "\u4e66\u7c4d", tag: "\ud83d\udcda", "bp": "-1377px 0"}, u1F4DE: {en: "telephone_receiver", zh: "\u7535\u8bdd", tag: "\ud83d\udcde", "bp": "-1404px 0"}, u1F4E2: {en: "loudspeaker", zh: "\u6269\u97f3\u5668", tag: "\ud83d\udce2", "bp": "-1431px 0"}, u1F6AB: {en: "stop", zh: "\u505c\u6b62", tag: "\ud83d\udeab", "bp": "-918px -27px"}, u1F6BF: {en: "shower",
                zh: "\u6dcb\u6d74", tag: "\ud83d\udebf", "bp": "-945px -27px"}, u1F30F: {en: "earth_asia", zh: "\u571f", tag: "\ud83c\udf0f", "bp": "-27px 0"}, u1F33B: {en: "sunflower", zh: "\u5411\u65e5\u8475", tag: "\ud83c\udf3b", "bp": "-135px 0"}, u1F35A: {en: "rice", zh: "\u996d", tag: "\ud83c\udf5a", "bp": "-216px 0"}, u1F36B: {en: "chocolate_bar", zh: "\u5de7\u514b\u529b", tag: "\ud83c\udf6b", "bp": "-270px 0"}, u1F37B: {en: "beers", zh: "\u5564\u9152", tag: "\ud83c\udf7b",
                "bp": "-324px 0"}, u1F44A: {en: "punch", zh: "\u62f3", tag: "\ud83d\udc4a", "bp": "-729px 0"}, u1F44C: {en: "ok_hand", zh: "\u6ca1\u95ee\u9898", tag: "\ud83d\udc4c", "bp": "-756px 0"}, u1F44D: {en: "1", zh: "1", tag: "\ud83d\udc4d", "bp": "-783px 0"}, u1F44E: {en: "-1", zh: "-1", tag: "\ud83d\udc4e", "bp": "-810px 0"}, u1F44F: {en: "clap", zh: "\u62cd", tag: "\ud83d\udc4f", "bp": "-837px 0"}, u1F46A: {en: "family", zh: "\u5bb6\u5ead", tag: "\ud83d\udc6a",
                "bp": "-891px 0"}, u1F46B: {en: "couple", zh: "\u60c5\u4fa3", tag: "\ud83d\udc6b", "bp": "-918px 0"}, u1F47B: {en: "ghost", zh: "\u9b3c", tag: "\ud83d\udc7b", "bp": "-945px 0"}, u1F47C: {en: "angel", zh: "\u5929\u4f7f", tag: "\ud83d\udc7c", "bp": "-972px 0"}, u1F47D: {en: "alien", zh: "\u5916\u661f\u4eba", tag: "\ud83d\udc7d", "bp": "-999px 0"}, u1F47F: {en: "imp", zh: "\u6076\u9b54", tag: "\ud83d\udc7f", "bp": "-1026px 0"}, u1F48A: {en: "pill",
                zh: "\u836f", tag: "\ud83d\udc8a", "bp": "-1080px 0"}, u1F48B: {en: "kiss", zh: "\u543b", tag: "\ud83d\udc8b", "bp": "-1107px 0"}, u1F48D: {en: "ring", zh: "\u6212\u6307", tag: "\ud83d\udc8d", "bp": "-1134px 0"}, u1F60A: {en: "blush", zh: "\u8138\u7ea2", tag: "\ud83d\ude0a", "bp": "-1782px 0"}, u1F60B: {en: "yum", zh: "\u998b", tag: "\ud83d\ude0b", "bp": "-1809px 0"}, u1F60C: {en: "relieved",
                zh: "\u5b89\u5fc3", tag: "\ud83d\ude0c", "bp": "-1836px 0"}, u1F60D: {en: "heart_eyes", zh: "\u8272\u8272", tag: "\ud83d\ude0d", "bp": "-1863px 0"}, u1F60E: {en: "sunglasses", zh: "\u58a8\u955c", tag: "\ud83d\ude0e", "bp": "-1890px 0"}, u1F60F: {en: "smirk", zh: "\u50bb\u7b11", tag: "\ud83d\ude0f", "bp": "-1917px 0"}, u1F61A: {en: "kissing_closed_eyes", zh: "\u63a5\u543b", tag: "\ud83d\ude1a", "bp": "-135px -27px"}, u1F61C: {en: "stuck_out_tongue_winking_eye",
                zh: "\u641e\u602a", tag: "\ud83d\ude1c", "bp": "-162px -27px"}, u1F61D: {en: "stuck_out_tongue_closed_eyes", zh: "\u6076\u4f5c\u5267", tag: "\ud83d\ude1d", "bp": "-189px -27px"}, u1F61E: {en: "disappointed", zh: "\u5931\u671b\u7684", tag: "\ud83d\ude1e", "bp": "-216px -27px"}, u1F61F: {en: "anguished", zh: "\u82e6\u6da9", tag: "\ud83d\ude1f", "bp": "-243px -27px"}, u1F62A: {en: "sleepy", zh: "\u56f0", tag: "\ud83d\ude2a", "bp": "-432px -27px"}, u1F62B: {en: "tired_face",
                zh: "\u6293\u72c2", tag: "\ud83d\ude2b", "bp": "-459px -27px"}, u1F62C: {en: "grimacing", zh: "\u9b3c\u8138", tag: "\ud83d\ude2c", "bp": "-486px -27px"}, u1F62D: {en: "sob", zh: "\u54ed\u6ce3", tag: "\ud83d\ude2d", "bp": "-513px -27px"}, u1F62F: {en: "hushed", zh: "\u5bc2\u9759", tag: "\ud83d\ude2f", "bp": "-540px -27px"}, u1F64A: {en: "speak_no_evil", zh: "\u4e0d\u8bf4\u8bdd", tag: "\ud83d\ude4a", "bp": "-837px -27px"}, u1F64F: {en: "pray", zh: "\u7948\u7977",
                tag: "\ud83d\ude4f", "bp": "-864px -27px"}, u1F319: {en: "moon", zh: "\u6708\u4eae", tag: "\ud83c\udf19", "bp": "-54px 0"}, u1F332: {en: "evergreen_tree", zh: "\u6811", tag: "\ud83c\udf32", "bp": "-81px 0"}, u1F339: {en: "rose", zh: "\u73ab\u7470", tag: "\ud83c\udf39", "bp": "-108px 0"}, u1F349: {en: "watermelon", zh: "\u897f\u74dc", tag: "\ud83c\udf49", "bp": "-162px 0"},
            u1F366: {en: "icecream", zh: "\u51b0\u6dc7\u6dcb", tag: "\ud83c\udf66", "bp": "-243px 0"}, u1F377: {en: "wine_glass", zh: "\u9152", tag: "\ud83c\udf77", "bp": "-297px 0"}, u1F381: {en: "gift", zh: "\u793c\u7269", tag: "\ud83c\udf81", "bp": "-351px 0"}, u1F382: {en: "birthday", zh: "\u751f\u65e5", tag: "\ud83c\udf82", "bp": "-378px 0"}, u1F384: {en: "christmas_tree", zh: "\u5723\u8bde", tag: "\ud83c\udf84", "bp": "-405px 0"}, u1F389: {en: "tada", zh: "\u793c\u82b1",
                tag: "\ud83c\udf89", "bp": "-432px 0"}, u1F393: {en: "mortar_board", zh: "\u6bd5\u4e1a", tag: "\ud83c\udf93", "bp": "-459px 0"}, u1F434: {en: "horse", zh: "\u9a6c", tag: "\ud83d\udc34", "bp": "-648px 0"}, u1F436: {en: "dog", zh: "\u72d7", tag: "\ud83d\udc36", "bp": "-675px 0"}, u1F451: {en: "crown", zh: "\u738b\u51a0", tag: "\ud83d\udc51", "bp": "-864px 0"}, u1F484: {en: "lipstick",
                zh: "\u53e3\u7ea2", tag: "\ud83d\udc84", "bp": "-1053px 0"}, u1F494: {en: "broken_heart", zh: "\u4f24\u5fc3", tag: "\ud83d\udc94", "bp": "-1161px 0"}, u1F525: {en: "fire", zh: "\u706b\u4e86", tag: "\ud83d\udd25", "bp": "-1458px 0"}, u1F556: {en: "time", zh: "\u65f6\u95f4", tag: "\ud83d\udd56", "bp": "-1512px 0"}, u1F648: {en: "see_no_evil", zh: "\u4e0d\u770b", tag: "\ud83d\ude48", "bp": "-783px -27px"}, u1F649: {en: "hear_no_evil", zh: "\u4e0d\u542c", tag: "\ud83d\ude49",
                "bp": "-810px -27px"}, u1F680: {en: "rocket", zh: "\u706b\u7bad", tag: "\ud83d\ude80", "bp": "-891px -27px"}, u2B50: {en: "star", zh: "\u661f\u661f", tag: "\u2b50", "bp": "-1431px -27px"}, u23F0: {en: "alarm_clock", zh: "\u949f\u8868", tag: "\u23f0", "bp": "-972px -27px"}, u23F3: {en: "hourglass_flowing_sand", zh: "\u6c99\u6f0f", tag: "\u23f3", "bp": "-999px -27px"}, u26A1: {en: "zap", zh: "\u95ea\u7535", tag: "\u26a1", "bp": "-1188px -27px"},
            u26BD: {en: "soccer", zh: "\u8db3\u7403", tag: "\u26bd", "bp": "-1215px -27px"}, u26C4: {en: "snowman", zh: "\u96ea\u4eba", tag: "\u26c4", "bp": "-1242px -27px"}, u26C5: {en: "partly_sunny", zh: "\u591a\u4e91", tag: "\u26c5", "bp": "-1269px -27px"}, u261D: {en: "point_up", zh: "\u7b2c\u4e00", tag: "\u261d", "bp": "-1134px -27px"}, u263A: {en: "relaxed", zh: "\u8f7b\u677e", tag: "\u263a", "bp": "-1161px -27px"}, u270A: {en: "fist", zh: "\u62f3\u5934", tag: "\u270a",
                "bp": "-1296px -27px"}, u270B: {en: "hand", zh: "\u624b", tag: "\u270b", "bp": "-1323px -27px"}, u270C: {en: "v", zh: "v ", tag: "\u270c", "bp": "-1350px -27px"}, u270F: {en: "pencil2", zh: "\u7b14", tag: "\u270f", "bp": "-1377px -27px"}, u2600: {en: "sunny", zh: "\u6674\u6717", tag: "\u2600", "bp": "-1026px -27px"}, u2601: {en: "cloud", zh: "\u4e91", tag: "\u2601", "bp": "-1053px -27px"}, u2614: {en: "umbrella", zh: "\u4f1e", tag: "\u2614", "bp": "-1080px -27px"},
            u2615: {en: "coffee", zh: "\u5496\u5561", tag: "\u2615", "bp": "-1107px -27px"}, u2744: {en: "snowflake", zh: "\u96ea\u82b1", tag: "\u2744", "bp": "-1404px -27px"}};
        //根据浏览器初始化css
        function initCss() {
            var head = document.getElementsByTagName("head")[0] || document.createElement("head");
            if (document.createStyleSheet) {
                initBtag = function (position) {
                    var e = document.createElement("b");
                    e.style.width = '22px';
                    e.style.height = '22px';
                    e.style.backgroundImage = 'url('+ b["RongOpts"]["EMOJI_BG_IMAGE"] + ')';
                    e.style.display = 'inline';
                    e.style.display = 'inline-block';
                    e.style.zoom = '1';
                    e.style.backgroundPosition = position;
                    e.className = "RC_Expression";
                    return e;
                };
            } else {
                var _style = document.createElement("style");
                _style.type = "text/css";
                _style.innerHTML = ".RC_Expression {width:22px;height:22px;background-image:url("+ b["RongOpts"]["EMOJI_BG_IMAGE"] +");display:inline-block}";
                head.appendChild(_style);
            }
        }

        var initBtag = function (position) {
            var e = document.createElement("b");
            e.className = "RC_Expression";
            e.style.backgroundPosition = position;
            e.setAttribute("contenteditable","false");
            e.setAttribute("unselectable","off");
            return e;
        };
        b.RongIMClient.Expression = new function () {
            initCss();
            var e = this;
            //得到所有表情对象 0-128
            this.getAllExpression = function (a, b) {
                if (0 < a && -1 < b && 129 > a + b) {
                    var h = [], d = 0, f;
                    for (f in c) {
                        if (d >= b + a)break;
                        if (d >= b) {
                            var e = initBtag(c[f]["bp"]);
                            h.push({englishName: c[f].en, chineseName: c[f].zh, img: e, tag: c[f].tag});
                        }
                        d++;
                    }
                    return h;
                }
                throw Error("Wrong parameter");
            };
            //根据c的key得到表情对象
            this.getEmojiByContent = function (a) {
                if (a in c) {
                    var b = initBtag(c[a]["bp"]);
                    return{englishName: c[a].en, chineseName: c[a].zh, img: b, tag: c[a].tag};
                }
            };
            //计算utf
            this.calcUTF = function (d) {
                if (61440 < d.charCodeAt(0)) {
                    var b = c[escape(d).replace("%u", "u1")];
                    if (b)return b.tag;
                }
                return d;
            };
            //根据英文名称或中文名称得到表情对象
            this.getEmojiObjByEnglishNameOrChineseName = function (a) {
                for (var b in c) {
                    if (c[b].en == a || c[b].zh == a) {
                        var e = initBtag(c[b]["bp"]);
                        return {img: e, englishName: c[b].en, chineseName: c[b].zh, tag: c[b].tag};
                    }
                }
                return{};
            };
            var k = /(\ud83d\ude00|\ud83d\ude01|\ud83d\ude02|\ud83d\ude03|\ud83d\ude05|\ud83d\ude06|\ud83d\ude07|\ud83d\ude08|\ud83d\ude09|\ud83d\ude11|\ud83d\ude12|\ud83d\ude13|\ud83d\ude14|\ud83d\ude15|\ud83d\ude16|\ud83d\ude18|\ud83d\ude21|\ud83d\ude22|\ud83d\ude23|\ud83d\ude24|\ud83d\ude28|\ud83d\ude29|\ud83d\ude30|\ud83d\ude31|\ud83d\ude32|\ud83d\ude33|\ud83d\ude34|\ud83d\ude35|\ud83d\ude36|\ud83d\ude37|\ud83c\udfa4|\ud83c\udfb2|\ud83c\udfb5|\ud83c\udfc0|\ud83c\udfc2|\ud83c\udfe1|\ud83c\udc04|\ud83d\udca1|\ud83d\udca2|\ud83d\udca3|\ud83d\udca4|\ud83d\udca9|\ud83d\udcaa|\ud83d\udcb0|\ud83d\udcda|\ud83d\udcde|\ud83d\udce2|\ud83d\udeab|\ud83d\udebf|\ud83c\udf0f|\ud83c\udf3b|\ud83c\udf5a|\ud83c\udf6b|\ud83c\udf7b|\ud83d\udc4a|\ud83d\udc4c|\ud83d\udc4d|\ud83d\udc4e|\ud83d\udc4f|\ud83d\udc6a|\ud83d\udc6b|\ud83d\udc7b|\ud83d\udc7c|\ud83d\udc7d|\ud83d\udc7f|\ud83d\udc8a|\ud83d\udc8b|\ud83d\udc8d|\ud83d\udd2b|\ud83d\ude0a|\ud83d\ude0b|\ud83d\ude0c|\ud83d\ude0d|\ud83d\ude0e|\ud83d\ude0f|\ud83d\ude1a|\ud83d\ude1c|\ud83d\ude1d|\ud83d\ude1e|\ud83d\ude1f|\ud83d\ude2a|\ud83d\ude2b|\ud83d\ude2c|\ud83d\ude2d|\ud83d\ude2f|\ud83d\ude4a|\ud83d\ude4f|\ud83c\udf19|\ud83c\udf32|\ud83c\udf39|\ud83c\udf49|\ud83c\udf56|\ud83c\udf66|\ud83c\udf77|\ud83c\udf81|\ud83c\udf82|\ud83c\udf84|\ud83c\udf89|\ud83c\udf93|\ud83d\udc34|\ud83d\udc36|\ud83d\udc37|\ud83d\udc51|\ud83d\udc84|\ud83d\udc94|\ud83d\udd25|\ud83d\udd56|\ud83d\ude48|\ud83d\ude49|\ud83d\ude80|\u2b50|\u23f0|\u23f3|\u26a1|\u26bd|\u26c4|\u26c5|\u261d|\u263a|\u270a|\u270b|\u270c|\u270f|\u2600|\u2601|\u2614|\u2615|\u2744)/g;
            //解析一段字符串得到表情
            this.retrievalEmoji = function (a, b) {
                return a.replace(k, function (a) {
                    var d;
                    a:{
                        for (d in c)if (c[d].tag == a)break a;
                        d = a
                    }
                    return d != a ? b(e.getEmojiByContent(d)) : a;
                })
            }
        };
    } else {
        throw new Error("Please load RongIMClient.min.js,http://res.websdk.rong.io/RongIMClient.min.js")
    }
})(window);
