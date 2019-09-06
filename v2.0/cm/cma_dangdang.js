(function () {
    try {
        var c = "";
        var j = ["http://cms.tanx.com/t.gif?tanx_nid=29600513&tanx_cm", "http://cm.pos.baidu.com/pixel?dspid=6418041", "http://cm.g.doubleclick.net/pixel?google_nid=ipy&google_cm", "http://cm.miaozhen.atm.youku.com/cm.gif?dspid=11112", "http://cc.xtgreat.com/cm.gif?dspid=11164", "http://sax.sina.com.cn/cm?sina_nid=1", "http://cm.qtmojo.com/pixel?allyes_dspid=192&allyes_cm", "https://cm.g.doubleclick.net/pixel?google_nid=ipym&google_cm", "http://t.go.sohu.com/cm.gif?ver=1&mid=10012", "http://ckm.iqiyi.com/pixel?qiyi_nid=71000015&qiyi_sc"];
        var h = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        function i(e) {
            return Object.prototype.toString.call(e) === "[object Array]"
        }

        function g(u, e) {
            return u - e
        }

        var s = {
            set: function (v, w, u) {
                var y = new Date();
                y.setDate(y.getDate() + u);
                document.cookie = v + "=" + encodeURIComponent(w) + ((u == null) ? "" : ";expires=" + y.toGMTString());
                try {
                    if (window.localStorage) {
                        window.localStorage.setItem(v, w)
                    }
                } catch (x) {
                }
            }, get: function (v) {
                if (!document.cookie) {
                    return ""
                }
                var w = new RegExp("(^| )" + v + "=([^;]*)(;|\x24)"), u = w.exec(document.cookie);
                if (!u) {
                    return ""
                }
                var x = u[2] || "";
                if ("string" == typeof x) {
                    x = decodeURIComponent(x);
                    return x
                }
                try {
                    if (window.localStorage) {
                        return window.localStorage.getItem(v) || ""
                    }
                } catch (y) {
                }
                return ""
            }
        };
        var n = function (e) {
            for (var u = 0; u < j.length; u++) {
                if (e == j[u]) {
                    return u
                }
            }
            return 0
        };
        var t = function () {
            var e = s.get("py_map_list").split("&")[0];
            var u = e.split("/").join(" ");
            return u || new Date().toLocaleString().split(" ")[0]
        };
        var a = function (e, z) {
            var u = e;
            var A = z;
            for (var w = 0; w < u.length; w++) {
                for (var v = 0; v < A.length; v++) {
                    if (u[w] == A[v]) {
                        u[w] = null;
                        A[v] = null
                    }
                }
            }
            var x = u.concat(A);
            var y = x.length;
            while (y--) {
                if (x[y] == null) {
                    x.splice(y, 1)
                }
            }
            x = x.sort(g);
            return x
        };
        var r = function () {
            var v = t();
            var u = new Date(v).getTime();
            var e = new Date().getTime();
            return Math.floor((e - u) / 86400000)
        };
        var b = function (u) {
            try {
                if (u.length < 2) {
                    return u
                }
                var x = [u[0]];
                for (var v = 1; v < u.length; v++) {
                    if (u.indexOf(u[v]) == v) {
                        if (u[v] != "" && u[v] != null) {
                            x.push(u[v])
                        }
                    }
                }
                if (x[0] == "") {
                    x.splice(0, 1)
                }
                return x.sort(g)
            } catch (w) {
                return u
            }
        };
        var q = function () {
            var e = s.get("py_map_list").split("&");
            if (e.length > 1) {
                if (i(e[1].split("-"))) {
                    e = b(e[1].split("-"));
                    return e
                }
            }
            return []
        };
        var l = function () {
            var v = a(h, q());
            var e = [];
            for (var u = 0; u < v.length; u++) {
                var w = v[u];
                e.push(j[w])
            }
            return e
        };
        var d;

        function p() {
            if (_maps.length > 0) {
                k()
            }
        }

        function k() {
            var e = document.createElement("img");
            c = _maps[0];
            if (c != undefined) {
                e.setAttribute("src", c);
                e.setAttribute("id", "mapImg");
                e.onload = f;
                document.body.appendChild(e);
                e.style.display = "none";
                _maps.splice(0, 1);
                var u = n(c);
                var x = q();
                x.push(u);
                var w = x.join("-");
                var v = t().split(" ").join("/");
                s.set("py_map_list", (v + "&" + w), 3)
            }
            if (_maps.length > 0) {
                d = setTimeout(p, 3000)
            }
        }

        function f() {
            clearTimeout(d);
            this.parentNode.removeChild(this);
            setTimeout(k, 20)
        }

        var m = function () {
            var u = r();
            if (u > 3) {
                s.set("py_map_list", "")
            }
            if (!s.get("py_map_list")) {
                _maps = j.slice(0, 4)
            } else {
                var e = l();
                if (e.length > 2) {
                    _maps = e.slice(0, 2)
                } else {
                    _maps = e.slice(0, e.length)
                }
            }
            if (_maps.length > 0) {
                k(_maps)
            }
        };
        m()
    } catch (o) {
    }
})();

