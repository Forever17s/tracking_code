(function(s, o, h) {
	function g() {
		var i = location.hostname;
		if (/^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/.test(i)) {
			return i
		}
		var a = i.split("."),
			e = a.length - 2;
		if (2 === a.length) {
			return i
		}
		for (; 0 <= e; --e) {
			if ("www" === a[e]) {
				return a.slice(e + 1).join(".")
			}
			if (-1 === ",com,net,org,gov,edu,info,name,int,mil,arpa,asia,biz,pro,coop,aero,museum,ac,ad,ae,af,ag,ai,al,am,an,ao,aq,ar,as,at,au,aw,az,ba,bb,bd,be,bf,bg,bh,bi,bj,bm,bn,bo,br,bs,bt,bv,bw,by,bz,ca,cc,cf,cg,ch,ci,ck,cl,cm,cn,co,cq,cr,cu,cv,cx,cy,cz,de,dj,dk,dm,do,dz,ec,ee,eg,eh,es,et,ev,fi,fj,fk,fm,fo,fr,ga,gb,gd,ge,gf,gh,gi,gl,gm,gn,gp,gr,gt,gu,gw,gy,hk,hm,hn,hr,ht,hu,id,ie,il,in,io,iq,ir,is,it,jm,jo,jp,ke,kg,kh,ki,km,kn,kp,kr,kw,ky,kz,la,lb,lc,li,lk,lr,ls,lt,lu,lv,ly,ma,mc,md,me,mg,mh,ml,mm,mn,mo,mp,mq,mr,ms,mt,mv,mw,mx,my,mz,na,nc,ne,nf,ng,ni,nl,no,np,nr,nt,nu,nz,om,pa,pe,pf,pg,ph,pk,pl,pm,pn,pr,pt,pw,py,qa,re,ro,ru,rw,sa,sb,sc,sd,se,sg,sh,si,sj,sk,sl,sm,sn,so,sr,st,su,sy,sz,tc,td,tf,tg,th,tj,tk,tm,tn,to,tp,tr,tt,tv,tw,tz,ua,ug,uk,us,uy,va,vc,ve,vg,vn,vu,wf,ws,ye,yu,za,zm,zr,zw,".indexOf("," + a[e] + ",")) {
				return a.slice(e).join(".")
			}
		}
		return i
	}
	_py.getLast = function(e) {
		for (var a = this.length - 1; 0 <= a; a--) {
			if (this[a][0] == e) {
				return this[a][1]
			}
		}
	};
	_py.serialize = function() {
		function t(v, e) {
			for (var u = 0; u < v.length; u++) {
				if (v[u] === e) {
					return u
				}
			}
			return -1
		}
		for (var i = ["domain", "urlParam", "pi","p","e"], m = [], j = [], n = [], k, l = 0; l < this.length; l++) {
			k = this[l][0], -1 === t(i, k) && (j[k] = j[k] || [], 0 < j[k].length ? -1 === t(j[k], this[l][1]) && j[k].push(this[l][1]) : (j[k].push(this[l][1]), m.push([k, j[k]])))
		}
		for (l = 0; l < m.length; l++) {
			n.push(m[l][0] + "=" + h(m[l][1].join(",")))
		}
		return n.join("&")
	};
	s.ipy = {
		r: /(^|&)jump=(\d*)/i,
		cookie: {
			set: function(n, j, k, m, l) {
				z = new Date();
				z.setTime(z.getTime() + (k || 0));
				o.cookie = n + "=" + h(j || "") + (k ? "; expires=" + z.toGMTString() : "") + ";path=/; domain=" + (m || (location.hostname=="localhost"?"":location.hostname)) + (l ? "; secure" : "")
			},
			get: function(a) {
				return (a = o.cookie.match(RegExp("(^|;)\\s*" + a + "=([^;]*)", "i"))) ? decodeURIComponent(a[2]) : ""
			}
		},
		setCookie: function(e, b) {
			ipy.cookie.set(e, b, 31536000000, g())
		},
		setSession: function(e, b) {
			ipy.cookie.set(e, b, 0, g())
		},
		getJump: function() {
			var b = ipy.cookie.get("ipysession");
			return b && (b = b.match(ipy.r)) ? parseInt(b[2]) : 0
		},
		setJump: function(i) {
			var e = ipy.cookie.get("ipysession");
			e ? e.match(ipy.r) ? ipy.setSession("ipysession", e.replace(/jump=(\d*)/, "jump=" + i)) : ipy.setSession("ipysession", e + "&jump=" + i) : ipy.setSession("ipysession", "jump=" + i)
		},
		getInfo: function(n) {
			var v = ipy.cookie.get(n);
			if (v) {
				return v
			}
			if (s.localStorage) {
				if (localStorage.getItem(n)) {
					return localStorage.getItem(n)
				}
			}
			return ""
		},
		setInfo: function(n, v) {
			if (v == null || v == "") {
				return
			}
			ipy.setCookie(n, v);
			if (s.localStorage) {
				localStorage.setItem(n, v)
			}
		},
		getQueryString: function(name) {
			if (name == "" || name == null) {
				return
			}
			var _u = s.location.href,
				_p = _u.split(name),
				dis = "";
			if (_p.length > 1) {
				_u = _p[1];
				dis = _u.split("&")[0].replace("=", "");
				return dis
			}
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
				r = s.location.search.substr(1).match(reg);
			if (r != null && r) {
				return r[2]
			}
			var _h = s.location.hash.substr(1).match(reg);
			if (_h != null && _h) {
				return _h[2]
			}
			return ""
		},
		setExendParam: function(p, c, e) {
			var _pi = p || "",
				_cg = c || "",
				_ed = e || "";
			ipy.getExtendParam(_pi, _cg, _ed)
		},
		getExtendParam: function(i, g, c) {
			var e = "",
				pv = "";
			if (i != null && i) {
				e = "p=" + i
			}
			if (g != null && g) {
				_py.push(["pv", g])
			}
			if (c != null && c) {
				e += "&ext=" + c
			}
			ipy.extendSend(e)
		},
        retarget:function(OrderNo,Money,ProductList,extend){
            var s = _py.getLast("domain"),
                e = extend || ""
                p = ("https:" == location.protocol ? "https" : "http") + "://" + s + "/cvt?OrderNo="+OrderNo+"&Money="+Money+"&ProductList="+ProductList+"&e="+e+"&rd=" + new Date().getTime();
            new Image().src = p;
        },
		itemInfo:function(json){
            var v = [],c;
            switch(typeof json){
                case 'string':
                    c=json;
                    break;
                case 'object':
                    var data = ['id','name','origPrice','price','brand','imgUrl','productUrl','categoryId','category','promotion','discount','soldOut','domain','extend'];
                    for (var i = 0; i < data.length; i++) {
                        var str = json[data[i]] || '';
                        str = str.toString();
                        v.push(h(str));
                    };
                    ipy.id = json.id || '';
                    c = v.join(',');
                    break;
                default:
                    return c = '';
            }
            return c;
        },
		extendSend: function(ex) {
			var e = "";
			if (_py.getLast("e")) {
				e = "e=" + _py.getLast("e") + "&"
			}
			e += ex, s = _py.getLast("domain"), p = ("https:" == location.protocol ? "https" : "http") + "://" + s + "/adv?" + _py.serialize() + ipy.getSession() + "&e=" + h(e) + "&rd=" + new Date().getTime();
			(new Image()).src = p
		},
		getSession: function() {
			var c = _py.getLast("c");
			if (c && c != null) {
				var j = ipy.getJump();
				if (!isNaN(j) && j == 0) {
					ipy.setJump(j + 1);
					return ""
				}
				j++;
				ipy.setJump(j);
				return "&s=" + j
			}
			return ""
		},
		getP:function(){
            var p = _py.getLast('p');
            var id = ipy.id ? ipy.id : '';
            p = p ? p : id;
            return p;
        }
	};
	var p = location.href,
		q = o.referrer,
		e, pi, cma = ["cm.g.doubleclick.net/pixel?google_nid=ipy&google_cm"
		, "cms.tanx.com/t.gif?tanx_nid=29600513&tanx_cm"
		, "cm.pos.baidu.com/pixel?dspid=6418041"
		, "cm.miaozhen.atm.youku.com/cm.gif?dspid=11112"
		, "cc.xtgreat.com/cm.gif?dspid=11164"],
		cmas = ["cm.g.doubleclick.net/pixel?google_nid=ipy&google_cm"],
		u = _py.getLast("urlParam"),
		d = ipy.getQueryString(u);
	if (window.VIPTE && VIPTE.DETAIL || window.VIPDAY && VIPDAY.DETAIL) {
        var dspUrlArr = [];
        dspUrlArr.push("http://n.vip.com/redirect.php?p=");
        dspUrlArr.push("lww0ef9w");
        dspUrlArr.push(encodeURIComponent("&desturl=" + location.href));
        p = dspUrlArr.join("")
    }
	s.parent != s && (p = q, q = "");
	p && _py.push(["u", p]);
	q && _py.push(["r", q]);
	d = d ? d : ipy.getInfo("ipycookie");
	ipy.setInfo("ipycookie", d);
	d && _py.push(["c", d]);
	s = _py.getLast("domain");
	e = _py.getLast("e");

	if (e != "" && e) {  //获取扩展字段，如_py 未push，则为空
		e = "e=" + _py.getLast("e")
	} else {
		e = ""
	}
	pi = ipy.itemInfo(_py.getLast("pi"));    // @pi 商品库字段
	p = ("https:" == location.protocol ? "https" : "http") + "://" + s + "/adv.gif?" + _py.serialize() + ipy.getSession() + "&pi=" + h(pi)+"&p="+h(ipy.getP())+"&e=" + h(e) + "&rd=" + new Date().getTime();
	(function r() {
		if (o.body) {
			var i = o.createElement("img"),cmkey="py_cm",
				ht, cm;
			i.onload = i.onreadystatechange = function() {
				if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
					i.remove();
				}
				if ("https:" == location.protocol) {
					ht = "https";
					cm = cmas
				} else {
					ht = "http";
					cm = cma
				}
				var _t = function () {//得到上次cookiemapping的时间
					var v = ipy.cookie.get(cmkey);
					var x = new Date();
					var w = x.getFullYear() + "/" + (x.getMonth() + 1) + "/" + x.getDate();
					return v || w
				};
				var _r = function () {//得到上次cookiemapping后距离当前时间多久
					var w = _t();
					var v = new Date(w).getTime();
					var e = new Date().getTime();
					return Math.floor((e - v) / 86400000)
				};
				var _f=function(){//设置cookiemapping后记录时间
					var v = _t();
					ipy.cookie.set(cmkey, v, 3*86400000);
				}

				var c=0;
				if(_r()>2)ipy.cookie.set(cmkey,"");
				if(ipy.cookie.get(cmkey)!=""&&_r()>=0&&_r()<3)return;
				for (var k = 0; k < cm.length; k++) {
					var img = o.createElement("img");
					img.onload=function(){
						c++;
						if(c>=cm.length){
							_f();c=0;
						}
					}
					img.src = ht + "://" + cm[k];
					img.style.display = "none";
					o.body.insertBefore(img, o.body.firstChild)
				}
			}
			i.src = p;
			i.style.display = "none";
			o.body.insertBefore(i, o.body.firstChild);

		} else {
			setTimeout(r, 50)
		}
	})()
})(window, document, encodeURIComponent);