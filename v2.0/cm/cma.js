(function() {
	try {
		var L = "";
		function J(f) {
			f = f.replace("/[\\[]/", "\\[").replace("/[\\]]/", "\\]");
			var b = window.location.href;
			var d = "[\\?&]" + f + "=([^&#]*)", i = new RegExp(d), g = i
					.exec(b);
			if (g) {
				var h = "", a = g[1].replace(/\+/g, " ");
				try {
					h = a;
					return h
				} catch (c) {
					return ""
				}
			}
			return ""
		}
		var e = "2_5_" + J("a");
		var E = [
				"http://cms.tanx.com/t.gif?tanx_nid=29600513&tanx_cm&ext_data=" + e,
				"http://cm.g.doubleclick.net/pixel?google_nid=ipy&google_cm&ext_data=" + e,
				"http://cm.g.doubleclick.net/pixel?google_nid=ipym&google_cm&ext_data=" + e,
				"http://sax.sina.com.cn/cm?sina_nid=1&ext_data=" + e,
				"http://cm.l.qq.com/?dspid=10016&dspuid=G1LIOs21cjIy&gettuid=1&ext_data=" + e,
				"http://c.yes.youku.com/cm.gif?dspid=11112",
				"http://cm.pos.baidu.com/pixel?dspid=6418041&ext_data=" + e,
				"http://cc.xtgreat.com/cm.gif?dspid=11164&ext_data=" + e,
				"http://cm.qtmojo.com/pixel?allyes_dspid=192&allyes_cm&ext_data=" + e,
				"http://ckm.iqiyi.com/pixel?qiyi_nid=71000015&qiyi_sc",
				"http://cm.fastapi.net/?dspid=100018&gethuid=1&dspuid=G1PH766EsY_&ext_data=",
				"http://t.go.sohu.com/cm.gif?ver=1&mid=10012&ext_data=" + e,
				"http://cm.vamaker.com/pixel?vamaker_dspid=11168120&vamaker_cm&v=1&ext_data=" + e ];
		var G = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];
		function F(a) {
			return Object.prototype.toString.call(a) === "[object Array]"
		}
		function H(a, b) {
			return a - b
		}
		var v = {
			set : function(c, b, d) {
				var f = new Date();
				f.setDate(f.getDate() + d);
				document.cookie = c
						+ "="
						+ encodeURIComponent(b)
						+ ((d == null) ? "" : ";expires="
								+ f.toGMTString());
				try {
					if (window.localStorage) {
						window.localStorage.setItem(c, b)
					}
				} catch (a) {
				}
			},
			get : function(c) {
				if (!document.cookie) {
					return ""
				}
				var b = new RegExp("(^| )" + c + "=([^;]*)(;|\x24)"), d = b
						.exec(document.cookie);
				if (!d) {
					return ""
				}
				var a = d[2] || "";
				if ("string" == typeof a) {
					a = decodeURIComponent(a);
					return a
				}
				try {
					if (window.localStorage) {
						return window.localStorage.getItem(c) || ""
					}
				} catch (f) {
				}
				return ""
			}
		};
		var A = function(b) {
			for (var a = 0; a < E.length; a++) {
				if (b == E[a]) {
					return a
				}
			}
			return 0
		};
		var u = function() {
			var b = v.get("py_map_list").split("&")[0];
			var a = b.split("/").join(" ");
			var d = new Date(),nd = d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate()
			return a || nd
		};
		var N = function(g, h) {
			var f = g;
			var b = h;
			for (var c = 0; c < f.length; c++) {
				for (var d = 0; d < b.length; d++) {
					if (f[c] == b[d]) {
						f[c] = null;
						b[d] = null
					}
				}
			}
			var a = f.concat(b);
			var i = a.length;
			while (i--) {
				if (a[i] == null) {
					a.splice(i, 1)
				}
			}
			a = a.sort(H);
			return a
		};
		var w = function() {
			var a = u();
			var b = new Date(a).getTime();
			var c = new Date().getTime();
			return Math.floor((c - b) / 86400000)
		};
		var M = function(d) {
			try {
				if (d.length < 2) {
					return d
				}
				var a = [ d[0] ];
				for (var c = 1; c < d.length; c++) {
					if (d.indexOf(d[c]) == c) {
						if (d[c] != "" && d[c] != null) {
							a.push(d[c])
						}
					}
				}
				if (a[0] == "") {
					a.splice(0, 1)
				}
				return a.sort(H)
			} catch (b) {
				return d
			}
		};
		var x = function() {
			var a = v.get("py_map_list").split("&");
			if (a.length > 1) {
				if (F(a[1].split("-"))) {
					a = M(a[1].split("-"));
					return a
				}
			}
			return []
		};
		var C = function() {
			var b = N(G, x());
			var d = [];
			for (var c = 0; c < b.length; c++) {
				var a = b[c];
				d.push(E[a])
			}
			return d
		};
		var K;
		function y() {
			if (_maps.length > 0) {
				D()
			}
		}
		function D() {
			var f = document.createElement("img");
			L = _maps[0];
			if (L != undefined) {
				f.setAttribute("src", L);
				f.setAttribute("id", "mapImg");
				f.onload = I;
				document.body.appendChild(f);
				f.style.display = "none";
				_maps.splice(0, 1);
				var d = A(L);
				var a = x();
				a.push(d);
				var b = a.join("-");
				var c = u().split(" ").join("/");
				v.set("py_map_list", (c + "&" + b), 1)
			}
			if (_maps.length > 0) {
				K = setTimeout(y, 3000)
			}
		}
		function I() {
			clearTimeout(K);
			this.parentNode.removeChild(this);
			setTimeout(D, 20)
		}
		var B = function() {
			var a = w();
			if (a >= 1) {
				v.set("py_map_list", "")
			}
			if (!v.get("py_map_list")) {
				_maps = E.slice(0, 4)
			} else {
				var b = C();
				if (b.length > 2) {
					_maps = b.slice(0, 2)
				} else {
					_maps = b.slice(0, b.length)
				}
			}
			if (_maps.length > 0) {
				D(_maps)
			}
		};
		B()
	} catch (z) {
	}
})();