(function () {
    try {
        var c = "";
        var i = ["http://cms.tanx.com/t.gif?tanx_nid=29600513&tanx_cm", "http://cm.g.doubleclick.net/pixel?google_nid=ipy&google_cm", "http://cm.pos.baidu.com/pixel?dspid=6418041", "https://cm.g.doubleclick.net/pixel?google_nid=ipym&google_cm", "http://cm.miaozhen.atm.youku.com/cm.gif?dspid=11112", "http://cc.xtgreat.com/cm.gif?dspid=11164", "http://cm.qtmojo.com/pixel?allyes_dspid=192&allyes_cm", "http://cm.ipinyou.com/qq/cmr.gif", "http://stats.ipinyou.com/adin/cmr.gif", "http://t.go.sohu.com/cm.gif?ver=1&mid=10012", "http://sax.sina.com.cn/cm?sina_nid=1", "http://ckm.iqiyi.com/pixel?qiyi_nid=71000015&qiyi_sc"];
        var h = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        function g(v, e) {
            return v - e
        }

        function u(x) {
            x = x.replace("/[\\[]/", "\\[").replace("/[\\]]/", "\\]");
            var w = "[\\?&]" + x + "=([^&#]*)", A = new RegExp(w), y = A.exec(window.location.href);
            if (y) {
                var z = "", e = y[1].replace(/\+/g, " ");
                try {
                    z = decodeURIComponent(e);
                    return decodeURIComponent(z)
                } catch (v) {
                    return ""
                }
            }
            return ""
        }

        var s = {
            set: function (v, w, e) {
                var x = new Date();
                x.setDate(x.getDate() + e);
                document.cookie = v + "=" + encodeURIComponent(w) + ((e == null) ? "" : ";expires=" + x.toGMTString())
            }, get: function (v) {
                if (!document.cookie) {
                    return ""
                }
                var w = new RegExp("(^| )" + v + "=([^;]*)(;|\x24)"), e = w.exec(document.cookie);
                if (!e) {
                    return ""
                }
                var x = e[2] || "";
                if ("string" == typeof x) {
                    x = decodeURIComponent(x);
                    return x
                }
                return ""
            }
        };
        var m = function (e) {
            for (var v = 0; v < i.length; v++) {
                if (e == i[v]) {
                    return v
                }
            }
            return 0
        };
        var t = function () {
            var e = s.get("py_map_list").split("&")[0];
            var v = e.split("/").join(" ");
            var x = new Date();
            var w = x.getFullYear() + "/" + (x.getMonth() + 1) + "/" + x.getDate();
            return v || w
        };
        var a = function (e, A) {
            var v = e;
            var B = A;
            for (var x = 0; x < v.length; x++) {
                for (var w = 0; w < B.length; w++) {
                    if (v[x] == B[w]) {
                        v[x] = null;
                        B[w] = null
                    }
                }
            }
            var y = v.concat(B);
            var z = y.length;
            while (z--) {
                if (y[z] == null) {
                    y.splice(z, 1)
                }
            }
            y = y.sort(g);
            return y
        };
        var r = function () {
            var w = t();
            var v = new Date(w).getTime();
            var e = new Date().getTime();
            return Math.floor((e - v) / 86400000)
        };
        var b = function (e) {
            e.sort(g);
            var w = [e[0]];
            for (var v = 1; v < e.length; v++) {
                if (e[v] !== w[w.length - 1]) {
                    w.push(e[v])
                }
            }
            return w;
            if (n[0] == "") {
                n.splice(0, 1)
            }
            return n
        };
        var q = function () {
            var e = s.get("py_map_list").split("&");
            if (e.length > 1) {
                e = b(e[1].split("-"));
                return e
            }
            return []
        };
        var k = function () {
            var w = a(h, q());
            var e = [];
            for (var v = 0; v < w.length; v++) {
                var x = w[v];
                e.push(i[x])
            }
            return e
        };
        var d;

        function p() {
            if (_maps.length > 0) {
                j()
            }
        }

        function j() {
            var e = document.createElement("img");
            c = _maps[0];
            e.setAttribute("src", c);
            e.setAttribute("id", "mapImg");
            e.onload = f;
            document.body.appendChild(e);
            e.style.display = "none";
            _maps.splice(0, 1);
            d = setTimeout(p, 3000)
        }

        function f() {
            clearTimeout(d);
            this.onload = null;
            this.parentNode.removeChild(this);
            var e = m(c);
            var x = q();
            x.push(e);
            var w = x.join("-");
            var v = t().split(" ").join("/");
            s.set("py_map_list", (v + "&" + w), 3);
            if (_maps.length > 0) {
                setTimeout(j, 20)
            }
        }

        var l = function () {
            var w = r();
            if (w > 3) {
                s.set("py_map_list", "")
            }
            if (!s.get("py_map_list")) {
                _maps = i.slice(0, 3)
            } else {
                var v = k();
                if (v.length > 2) {
                    _maps = v.slice(0, 2)
                } else {
                    _maps = v.slice(0, v.length)
                }
            }
            if (_maps.length > 0) {
                j(_maps)
            }
            var e = u("sid");
            new Image().src = "http://cm.ipinyou.com/suning/cms.gif?sid=" + e
        };
        l()
    } catch (o) {
    }
})();