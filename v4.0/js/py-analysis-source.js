/*
 * @adv
 * 4.2.0 smart pixel 初始版本  线上地址http://fm.p0y.cn/j/t/a.js
 * 4.2.1 statstest.ipinyou.com切换为stats.ipinyou.com
 * 4.2.2 解决火狐没有发送adv请求的问题
 * 4.2.3 解决多个触发器或的关系，去掉send指令，添加Cookiemapping控制参数
 * 4.2.4 event发送访客，py().track发送访客和转化，如果脚本加载完毕后直接执行访客
 * 4.2.5 去掉没有配置event事件发送默认访客的处理，添加viewPage事件，添加exend参数设置事件
 * 4.2.6 extend 添加字符串为空的判断，新增remove的处理逻辑
 * 4.2.7 ra方法修改先给src赋值在append到页面，新需求添加购物车，收藏的商品ID用p参数接收,并修复remove的 bug
 * 4.2.8 添加循环的方法，对外开放getCookie和setcookie的方法
 * 4.2.9 删除执行完的指令,脚本加载完成后修改py方法，调整load完脚本更新调用方法
 * 4.2.10 对外暴露ipy方法，因为当通过创意点击时，访客请求会返回设置cookie的方法,暴露ipy其他方法
 * 4.2.11 使用store.js来实现除第三方cookie外的额外标识,使用第一方cookie和本地存储的方式实现,扩展参数增加使用_pykey_,并配置迪卡侬广告主测试
 *        解决多次部署脚本后,mapping设置失效以及存在的后台配置remove命令失效问题
 *        解决加载脚本后,执行错误命令出错问题
 * 4.2.12 修复驴妈妈单品页部署两套代码卡死问题,IE8访客发送失败
 * 4.2.13 支持收集用户页面停留时间统计,支持设置clickParam命令,解决getQueryString代码逻辑错误问题
 * 4.2.14 由于title属性过长,不再收集title属性
 * 4.2.15 优化发送cookiemapping屏蔽referer,发送cookiemapping只并行发出
 * 4.2.16 解决停留时间统计不准确的问题
 * 4.2.17 解决通用代码没有py命令时能正常进行cookie mapping,优化停留时间统计,增加收集屏幕百分比功能
 * 4.2.18 增加事件：在线咨询、在线留言、支付成功、统计,放开对恶意设置参数的判断，支持更多自定义参数的传入,停留时间统计默认放开,收集第一方cookie逻辑暂不开放
 * 4.2.20 增加default的set命令默认不再发送停留事件和滚动条事件，需要开启才生效， 可通过修改通用代码配置不进行preadv请求
 * 4.2.21 转化事件默认都有trackId来保证只发送cvt一个请求
 * 4.2.22 所有浏览器信息需要在事件发送前重新获取最新的信息
 * 4.2.23 解决在请求preadv还没返回时就直接触发py命令的问题
 * 4.2.24 解决callback后没有获取浏览器信息和后台配置代码问题
 * 4.2.25 收集终端设备id信息。url参数为pyimei和pyidfa，通过cookie存储，以ipydeviceid为key存储
 * 4.2.26 添加方法getReferrerQueryString，用来获取referrer中对应的参数值
 * 4.2.27 为了日产项目需要，停留时长使用5秒
 * @version 4.2.27
 * */
(function (W,D,E) {
  try{
    //Ba 判断js对象类型的正则表达式定义
    var Ba = /\[object (Boolean|Number|String|Function|Array|Date|RegExp)\]/,
        //Ca 判断对象类型字符串,如为null返回'null',
        Ca = function (a) {
            if (null == a)return String(a);
            var b = Ba.exec(Object.prototype.toString.call(Object(a)));
            return b ? b[1].toLowerCase() : "object"
        },
        //Ea 如果 object 具有指定名称的属性，那么JavaScript中hasOwnProperty函数方法返回 true；反之则返回 false。
        //此方法无法检查该对象的原型链中是否具有该属性；该属性必须是对象本身的一个成员。在下例中，所有的 String 对象共享一个公用 split 方法。下面的代码将输出 false 和 true。
        //var s = new String("JScript");
        //print(s.hasOwnProperty("split"));
        //print(String.prototype.hasOwnProperty("split"));
        Ea = function (a, b) {
            return Object.prototype.hasOwnProperty.call(Object(a), b)
        },
        //fa 判断对象
        fa = function (a) {
            if (!a || "object" != Ca(a) || a.nodeType || a == a.window)return !1;
            try {
                //isPrototypeOf是用来判断指定对象object1是否存在于另一个对象object2的原型链中，是则返回true，否则返回false。
                if (a.constructor && !Ea(a, "constructor") && !Ea(a.constructor.prototype, "isPrototypeOf"))return !1
            } catch (c) {
                return !1
            }
            for (var b in a);
            return void 0 ===b || Ea(a, b)
        },
        //合并二个变量的属性
        Fa = function (a, b) {
            var c = b || ("array" == Ca(a) ? [] : {}), d,e;
            for (d in a)if (Ea(a, d)) {
                e = a[d];
                if(Ca(c)!="array"){
//                     if(!Qa.get(d)){
// //                        log("恶意设置参数，不予处理，设置参数如下：" + d + ":" + e);
//                         continue
//                     }
                  if(Qa.get(d)) d=Qa.get(d).F
                }
                //console.info(d+"=="+e+"--"+("array" == Ca(e) ));
                "array" == Ca(e) ? ("array" != Ca(c[d]) && (c[d] = []), c[d] = Fa(e, c[d])) : fa(e) ? (fa(c[d]) || (c[d] = {}), c[d] = Fa(e, c[d])) : c[d] = e
            }
            return c
        },
        Ga = function (a,c) {//模拟JSON.stringify方法，Ga为其递归
            var s=Ca(a)=="array"?"[":"{",d,e;
            for (d in a)
            	if (Ea(a, d)) {
            		e = a[d];
                    if(Ca(e)=="array"||Ca(e)=="object"){
                        s+=c=="array"?Ga(e,Ca(e)) +",":"\""+d+"\":"+Ga(e,Ca(e)) +","
                    }else if(Ca(e)=="string"){
                        s+=c=="array"?"\""+e +"\",":"\""+d+"\":\""+e +"\",";
                    }else {
                        s+=c=="array"?""+e +",":"\""+d+"\":"+e +",";
                    }
            	}
            s+=Ca(a)=="array"?"]":"}";
            return s;
        },
        Ha=function(a){//模拟JSON.stringify方法，Ga为其递归
            var s  = Ca(a)=="array"||Ca(a)=="object"?Ga(a,Ca(a)).replace(/,}/g,"}").replace(/,]/g,"]"):a
            return (s!="{}"?s:"");//todo 最后返回的内容判断 是否需要调整
        },
        //将b的属性copy到a对象中，a需要copy到的对象，b被copy的对象，
        cp = function(a,b){
        	for (d in b){
                if (Ea(b, d)) {
                	a[d] = b[d];
                }
            }
        };
    var ea = function (a) {//判断参数是否为funciton类型
        return "function" == typeof a
    }, kaa = function (a) {//判断参数是否为array类型
        return "[object Array]" == Object.prototype.toString.call(Object(a))
    }, hasValue = function(arr,value){// 判断数组中是否存在元素
      if(void 0 ==arr || !kaa(arr))return 0;
      for(var i=0;i<arr.length;i++){
        if(value==arr[i])return 1;
      }
      return 0;
    },qa = function (a) {//todo 下面有同名同功能方法
        return void 0 != a && -1 < (a.constructor + "").indexOf("String")
    }, Dd = function (a, b) {//todo 下面有同名同功能方法
        return 0 == a.indexOf(b)
    };


    var pf = navigator,//todo 下文可以更名navigator为pf
        u = function (a, b, c) {//a参数名称，
            var d = W[a];
            W[a] = void 0 === d || c ? b : d;
            return W[a]
        },
        K = function (a, b, c, d) {
            return (d || "http:" != W.location.protocol ? a : b) + c
        },
        //把script代码插入document元素中，优先绷按第一条script标签，body,head
        qf = function (a) {
            var b = D.getElementsByTagName("script")[0] || D.body || D.head;
            b.parentNode.insertBefore(a, b)
        },
        //处理script的onlaod事件，a表示script/img/iframe对象,b表示需要执行的函数名
        ka = function (a, b) {
            b && (a.addEventListener ? a.onload = b : a.onreadystatechange = function () {
                a.readyState in{loaded: 1, complete: 1} && (a.onreadystatechange = null, b())
            })
        },
        //创建一个script，并指定onlaod方法和onerror方法
        p = function (a, b, c) {
            var s = D.createElement("script");
            s.type = "text/javascript";
            s.async = !0;
            s.src = a;
            ka(s, b);
            c && (s.onerror = c);
            qf(s)
        },
        //创建一个iframe,并指定onload方法，返回创建成功的对iframe对象
        ra = function (a, b) {
            var c = D.createElement("iframe");
            c.height = "0";
            c.width = "0";
            c.style.display = "none";
            c.style.visibility = "hidden";
            void 0 !== a && (c.src = a);//先给src赋值，在append到页面，如果反之会认为是二次更新
            qf(c);
            ka(c, b);
            return c
        },
        //创建一个img,并指定onlaod事件和onerror事件
        N = function (a, b, c) {//todo 暂时没用 用的是下面的N1方法
            var d = new Image(1, 1);
            d.onload = function () {
                d.onload = null;
                b && b()
            };
            d.onerror = function () {
                d.onerror = null;
                c && c()
            };
            d.src = a
        },
        //创建一个img,并指定onlaod事件和onerror事件
        N1 = function (a, b, c,i) {
            if(i!=null){//todo var d=i?i:new Image(1, 1);可以用这个方法替代下面ifElse处理
                var d = i;
            }else{
                var d = new Image(1, 1);
            }
            d.onload = function () {
                d.onload = null;
                b && b()
            };
            d.onerror = function () {
                d.onerror = null;
                c && c()
            };
            d.src = a
        },
        //通用的增加事件方法，a表示element，b表示eventType，c表示callback，d表示useCapture, 一个bool类型。当为false时为冒泡获取(由里向外)，true为capture方式(由外向里)。
        U = function (a, b, c, d) {
            a.addEventListener ? a.addEventListener(b, c, !!d) : a.attachEvent && a.attachEvent("on" + b, c)
        },
        //实现javascript的异步,正常情况下javascript都是按照顺序执行的。但是我们可能让该语句后面的语句执行完再执行本身，
        q = function (a) {
            W.setTimeout(a, 0)
        },
        //记录当前页面的最大滚动条百分比
        max_sp=0,
        seFlag=false,
        sp=function (){
          var scrollTo=W.pageYOffset|| D.documentElement.scrollTop || D.body.scrollTop;
          var scrollHeight=D.documentElement.scrollHeight || D.body.scrollHeight;
          var clientHeight=D.documentElement.clientHeight || D.body.clientHeight;
          if(scrollHeight>clientHeight){
              var scrollPercent = parseInt((scrollTo / (scrollHeight-clientHeight)) * 100);
          }else{
              max_sp=100;seFlag=true;return max_sp;
          }
          if(max_sp<scrollPercent)max_sp=scrollPercent;
          return scrollPercent;
         },
        spF = function(){
          var scrollPercent =sp();
          if(max_sp>=100)RR(W,"scroll",spF);
          //超过百分之80发送事件
          if(!seFlag&&scrollPercent>80){
              eval(py_n+"('event','scrollEvent')");
              seFlag=true;
          }
        },
        na = !1,//false
        oa = [sp], rf = function (a) {//dom ready时触发的事件
            if (!na) {
                var b = D.createEventObject, c = "complete" == D.readyState, f = "interactive" == D.readyState;
                if (!a || "readystatechange" != a.type || c || !b && f) {
                    na = !0;
                    for (var e = 0; e < oa.length; e++)oa[e]()
                }
            }
        }, sf = 0, tf = function () {//低版本浏览器dom ready触发
            if (!na && 140 > sf) {
                sf++;
                try {
                    D.documentElement.doScroll("left"), rf()
                } catch (a) {
                    W.setTimeout(tf, 50)
                }
            }
        }, vf = function (a) {//获取指定id的元素//todo 该方法暂时没有使用
            var b = D.getElementById(a);
           //TODO 需要了解下面这段具体用途
            if (b && uf(b, "id") != a)for (var c = 1; c < D.all[a].length; c++)if (uf(D.all[a][c], "id") == a)return D.all[a][c];
            return b
        }, uf = function (a,b) {//获取元素的属性值，如不存在返回null todo 该方法暂时没有使用
            return a && b && a.attributes && a.attributes[b] ? a.attributes[b].value : null
            //触发当前事件的源对象,srcElement是IE下的属性,target是Firefox下的属性,Chrome浏览器同时有这两个属性
        }, wf = function (a) {//todo 该方法暂时没有使用
            return a.target || a.srcElement || {}
            //传入html的脚本片段，解析其中的script元素
        }, sa = function (a) {//todo 该方法暂时没有使用
            var b = D.createElement("div");
            b.innerHTML = "A<div>" + a + "</div>";
            for (var b = b.lastChild, c = []; b.firstChild;)c.push(b.removeChild(b.firstChild));
            return c
        }, xf = function (a, b) {//todo 该方法暂时没有使用
            for (var c = {}, d = 0; d < b.length; d++)c[b[d]] = !0;
            for (var e = a, d = 0; e && !c[String(e.tagName).toLowerCase()] && 100 > d; d++)e = e.parentElement;
            e && !c[String(e.tagName).toLowerCase()] && (e = null);
            return e
        }, yf = !1, zf = [],// todo 最下面 "complete" === D.readyState 是执行的方法，除此之外没用
        //onload触发发事件
        Af = function () {// todo 最下面 "complete" === D.readyState 是执行的方法，除此之外没用
            if (!yf) {
                yf = !0;
                for (var a = 0; a < zf.length; a++)zf[a]()
            }
        }, Bf = function (a) {//得到url#号后的内容//todo 该方法暂时没有使用
            a = a || W;
            var b = a.location.href, c = b.indexOf("#");
            return 0 > c ? "" : b.substring(c + 1)
            //日志输出方法
        },qa = function (a) {//判断是否存在，类型是否为String
            return void 0 != a && -1 < (a.constructor + "").indexOf("String")
        }, Dd = function (a, b) {//判断a是否以b开头  //todo 方法重复，之前有Dd同功能同名方法
            return 0 == a.indexOf(b)
        }, raa = function (a) {
            return a ? a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "") : ""
        }, log = function (a) {
//            window.console && window.console.log && window.console.log(a)
        },info = function (a) {
//            window.console && window.console.info && window.console.info(a)
        },error = function (a) {
//            window.console && window.console.error && window.console.error(a)
        }, ab = function (a, b, c, d) {
            if (void 0 != c)switch (b) {
                case Na:
                   // wb.test(c)
            }
            var e = $a(b);
            e && e.o ? e.o(a, b, c, d) : a.data.set(b, c, d)
        }, bb = function (a, b, c, d, e) {
            this.name = a;//属性名称
            this.F = b;//属性缩写
            this.Z = d;
            this.o = e;
            this.defaultValue = c//默认值
        }, $a = function (a) {
            var b = Qa.get(a);
            if (!b)for (var c = 0; c < Za.length; c++) {
                var d = Za[c], e = d[0].exec(a);
                if (e) {
                    b = d[1](e);
                    Qa.set(b.name, b);
                    break
                }
            }
            return b
        }, S = function (a, b, c, d, e) {
            a = new bb(a, b, c, d, e);
            Qa.set(a.name, a);
            return a.name
        },SE = function (a, b,p ,c, d, e) {
            a = new bb(a, b, c, d, e);
            a.p=p;
            Qa.set(a.name, a);
            return a.name
        }, cbb = function (a,b) {
            Za.push([new RegExp("^" + a + "$"), b])
        }, T = function (a, b, c) {
            return S(a, b, c, void 0, db)
        }, db = function () {
        }, xa = function () {//去掉域名的www. //todo 该方法暂时没用到
            var a = "" + D.location.hostname;
            return 0 == a.indexOf("www.") ? a.substring(4) : a
        }, ya = function (a) {
            var b = D.referrer;
            if (/^https?:\/\//i.test(b)) {
                if (a)return b;
                a = "//" + D.location.hostname;
                var c = b.indexOf(a);
                if (5 == c || 6 == c)if (a = b.charAt(c + a.length), "/" == a || "?" == a || "" == a || ":" == a)return;
                return b
            }
        }, za = function (a, b) {//todo 该暂时没有使用
            if (1 == b.length && null != b[0] && "object" === typeof b[0])return b[0];
            for (var c = {}, d = Math.min(a.length + 1, b.length), e = 0; e < d; e++)if ("object" === typeof b[e]) {
                for (var g in b[e])b[e].hasOwnProperty(g) && (c[g] = b[e][g]);
                break
            } else e < a.length && (c[a[e]] = b[e]);
            return c
        },setExtraData=function(a){//初始化参数代码，用来收集广告主传递的需要回传到服务端的数据
            var b =W.navigator, c = W.screen, d = D.location;
            //a.set(lb, ya(a.get(ec)));//获取referrer  TODO a.get(ec) 返回false 暂时写死true 原因传入的a是new Ya
            a.set(lb, ya(true));//获取referrer
            if (d) {
                a.set(kb, d.href)//得到location
            }
            c && a.set(qb, c.width + "x" + c.height);//screenResolution
            c && a.set(pb, c.colorDepth + "-bit");//得到颜色深度
            var c = D.documentElement, g = (e = D.body) && e.clientWidth && e.clientHeight, ca = [];
            c && c.clientWidth && c.clientHeight && ("CSS1Compat" === D.compatMode || !g) ? ca = [c.clientWidth, c.clientHeight] : g && (ca = [e.clientWidth, e.clientHeight]);
            c = 0 >= ca[0] || 0 >= ca[1] ? "" : ca.join("x");
            a.set(rb, c);//viewportSize

            var  ps = [];
            (e = D.body) && e.scrollWidth && e.scrollHeight && (ps = [e.scrollWidth, e.scrollHeight]);
            var pn = 0 >= ps[0] || 0 >= ps[1] ? "" : ps.join("x");
            a.set(bs, pn);//pageSize

            a.set(tb, fc());//得到flash版本
            a.set(ub, cdid || _getDeviceId());//获取设备id，优先使用cookie存储的，cookie没有则用url的
            a.set(ob, D.characterSet || D.charset);//获取encoding
            a.set(sb, b && "function" === typeof b.javaEnabled && b.javaEnabled() || !1);//是否支持java
            a.set(nb, (b && (b.language || b.browserLanguage) || "").toLowerCase());//浏览器语言
            if (d && a.get(cc) && (b = D.location.hash)) {//判断是否有allowAnchor，拼接location中的utm参数
                b = b.split(/[?&#]+/);
                d = [];
                for (c = 0; c < b.length; ++c)(Dd(b[c], "utm_id") || Dd(b[c], "utm_campaign") || Dd(b[c], "utm_source") || Dd(b[c], "utm_medium") || Dd(b[c], "utm_term") || Dd(b[c], "utm_content") || Dd(b[c], "gclid") || Dd(b[c], "dclid") || Dd(b[c], "gclsrc")) && d.push(b[c]);
                0 < d.length && (b = "#" + d.join("&"), a.set(kb, a.get(kb) +b))//得到location
            }
           // a.set(tl,(Qa.get(tl).defaultValue)());
//            log("获取客户端信息完毕!");
        };
    function fc() {
        var a, b, c;
        if ((c = (c = W.navigator) ? c.plugins : null) && c.length)for (var d = 0; d < c.length && !b; d++) {
            var e = c[d];
            -1 < e.name.indexOf("Shockwave Flash") && (b = e.description)
        }
        if (!b)try {
            a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"), b = a.GetVariable("$version")
        } catch (g) {
        }
        if (!b)try {
            a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"), b = "WIN 6,0,21,0", a.AllowScriptAccess = "always", b = a.GetVariable("$version")
        } catch (g) {
        }
        if (!b)try {
            a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), b = a.GetVariable("$version")
        } catch (g) {
        }
        b &&
        (a = b.match(/[\d]+/g)) && 3 <= a.length && (b = a[0] + "." + a[1] + " r" + a[2]);
        return b || void 0
    };
    var ee = function () {
        this.keys = [];
        this.values = {};
        this.m = {}
    };
    ee.prototype.set = function (a, b, c) {
        this.keys.push(a);
        c ? this.m[":" + a] = b : this.values[":" + a] = b
    };
    ee.prototype.setParam = function (a,b,m, c) {
        this.keys.push(a);
        c ? (this.m[":" + a]?this.m[":" + a][m] = b[m]:this.m[":" + a]=b) : (this.values[":" + a]? this.values[":" + a][m] = b[m]:this.values[":" + a] = b);
    };
    ee.prototype.get = function (a) {
        return this.m.hasOwnProperty(":" + a) ? this.m[":" + a] : this.values[":" + a]
    };
    ee.prototype.map = function (a) {
        for (var b = 0; b < this.keys.length; b++) {
            var c = this.keys[b], d = this.get(c);
            d && a(c, d)
        }
    };
    var Ya = function () {
        this.data = new ee
    }, Qa = new ee, Za = [];
    Ya.prototype.get = function (a) {
        var b = $a(a), c = this.data.get(a);
        b && void 0 == c && (c = ea(b.defaultValue) ? b.defaultValue() : b.defaultValue);
        return b && b.Z ? b.Z(this, a, c) : c
    };
    Ya.prototype.set = function (a, b, c) {
        if (a)if ("object" == typeof a)for (var d in a)a.hasOwnProperty(d) && ab(this, d, a[d], c); else ab(this, a, b, c)
    };

//    log("加载adv脚本完成...");
    //得到命令方法对像
    var py_n =qa(W._CommandName_) && raa(W._CommandName_) || "py";

    var clonePy = function(w,l,py){
      var _py =  function(){var r = arguments;r.length && w[l].$.e(r);
          w[l].track = function(a){ (r.t =[]).push(arguments);  if(a){w[l].$.t(r)}};return w[l]};
      cp(_py,py);
      return _py;
    }
    var py=W[py_n];py.L=py.l;
    if(!py.a)return;//广告主id为必填参数,如果为空则无法处理任何事情,如果为空,后台presadv日志会出很多错误.如后台处理了,此行应删除,至少能种个第三方cookie
    //var Baa = !1, he = S("_br"), hb = T("apiVersion", "v"), ib = T("clientVersion", "_v");
    //S("anonymizeIp", "aip");
    //var jb = S("adSenseId", "a"), Va = S("hitType", "t"), Ia = S("hitCallback"), Ra = S("hitPayload");
    //S("nonInteraction", "ni");

//    S("dataSource", "ds");
    //var Vd = S("useBeacon", void 0, !1);//, fa = S("transport");
//    S("sessionControl", "sc", "");
//    S("sessionGroup", "sg");
//    S("queueTime", "qt");
    //var Ac = S("_s", "_s");
//    S("screenName", "cd");
    /*, mb = S("page", "dp", "")*/;
    /*S("hostname", "dh");*/
    //终端参数
    var nb = S("language", "lg"), ob = S("encoding", "ec") , pb = S("screenColors", "sc"),
        qb = S("screenResolution", "sr"), rb = S("viewportSize", "vp"), sb = S("javaEnabled", "je"),tb = S("flashVersion", "fv"),ub = S("deviceId", "did"),
        bs=S("pageSize","ps");
    //自动获取参数
    var kb = S("location", "u", ""), lb = S("referrer", "r"),vs=S("version", "v");
    //var tl = S("title", "tt", function () {
    //    return D.title || void 0
    //});
    cbb("contentGroup([0-9]+)", function (a) {//todo 貌似不需要该配置
        return new bb(a[0], "cg" + a[1])
    });
    //参数专用开始 缩写校验
    S("account","a")
    S("activity_content","ac")
    S("activity_end_time","ae")
    S("activity_start_time","as")
    S("activity_url","au")
    S("android_schema_url","and")
    S("brand","b")
    S("category","ca")
    S("categoryId","cid")
    S("clickId","c")
    S("cookieId","ci")
    S("currency_code","cc")
    S("data","dt")
    S("discount","dc")

    S("email","em")
    S("id","id")
    S("industry","ind")
    S("ios_schema_url","ios")
    S("mobile_activity_url","ma")
    S("mobile_name","mm")
    S("mobile_pic_height","mh")
    S("mobile_pic_url","mu")
    S("mobile_pic_width","mw")
    S("mobile_pic_size","ms")
    S("mobile_product_url","wap")
    S("name","n")
    S("off_time","et")
    S("on_time","sm")
    S("orig_price","op")
    S("pc_pic_url","ppu")
    S("pic_height","ph")
    S("pic_width","pw")
    S("pic_size","pis")
    S("price","pr")
    S("product_no","pn")
    S("product_url","pu")
    S("promotion","pm")
    S("short_desc","sd")
    S("short_name","sn")
    S("sold_out","so")
    S("spu_id","si")
    S("stock","sk")
    S("type","tp")
    S("userId","uid")
    S("url","u")
    S("money","mn")
    S("items","it")
    S("count","ct")
    S("trackId", "tid");
    S("event", "ev");
    S("categoryPath", "cp");
    S("page", "pg");
    S("customEvent", "ce");
    S("keywords", "k");

    //事件参数 //todo 可以定义变量，回头就可以替换所有的明文  一改全改
    SE("domain","d",["d"])
    SE("default","df",["evs"])
    var mp = SE("mapping","mp",["mp"]),ex = SE("extend","e",["e"])
    SE("user","ur",["id","name","cookieId","email","type","category"])
    SE("clickParam","cpk",["cpk"]);
    SE("site","st",["type","id","industry"])
    SE("viewHome", "vh", ["pg"]);
    SE("viewList", "vl", ["cp"]);
    SE("viewItem", "vi", ["pn"]);
    SE("viewSearch","vs",["k"]);
    SE("viewActivity","va",["n"]);
    SE("viewChannel","vn" ,["n"]);
    SE("viewUserIndex","vu",["uid"]);
    SE("viewCart","vc",["mn","it"]);
    SE("viewPage","vg");
    SE("collect","cl",["id","tid"]);
    SE("order","od",["id","mn","it","tid"]);
    SE("purchase","pch",["id","mn","it","tid"]);
    SE("consult","co",["tid"]);
    SE("message","msg",["tid"]);
    SE("statistics","sts",["tid"]);
    SE("addCart","ad",["id","tid"]);
    SE("register","rg",["id","dt","tid"]);
    SE("leads","ls",["id","dt","tid"]);
    SE("custom","cm",["ce","id","dt","tid"]);
    SE("standingTime","ste");
    SE("scrollEvent","se");
//    SE("visit","pgv",["ev"])
//    SE("track","tc",["ev","tid"])
    //参数专用结束
//    S("campaignId", "ci");
//    S("campaignName", "cn");
//    S("campaignSource", "cs");
//    S("campaignMedium", "cm");
//    S("campaignKeyword", "ck");
//    S("campaignContent", "cc");
//    var ub = S("eventCategory", "ec"), xb = S("eventAction", "ea"), yb = S("eventLabel", "el"), zb = S("eventValue", "ev"), Bb = S("socialNetwork", "sn"), Cb = S("socialAction", "sa"), Db = S("socialTarget", "st"), Eb = S("l1", "plt"), Fb = S("l2", "pdt"), Gb = S("l3", "dns"), Hb = S("l4", "rrt"), Ib = S("l5", "srt"), Jb = S("l6", "tcp"), Kb = S("l7", "dit"), Lb = S("l8", "clt"), Mb = S("timingCategory", "utc"), Nb = S("timingVar", "utv"), Ob = S("timingLabel", "utl"), Pb = S("timingValue", "utt");
//    S("appName", "an");
//    S("appVersion", "av", "");
//    S("appId", "aid", "");
//    S("appInstallerId", "aiid", "");
//    S("exDescription", "exd");
//    S("exFatal", "exf");
    //var Nc = S("expId", "xid"), Oc = S("expVar", "xvar"), Rc = S("_utma", "_utma"), Sc = S("_utmz", "_utmz"), Tc = S("_utmht", "_utmht"), Ua = S("_hc", void 0, 0), Xa = S("_ti", void 0, 0), Wa = S("_to", void 0, 20);
    cbb("dimension([0-9]+)", function (a) {//todo 貌似不需要该配置
        return new bb(a[0], "cd" + a[1])
    });
    cbb("metric([0-9]+)", function (a) {//todo 貌似不需要该配置
        return new bb(a[0], "cm" + a[1])
    });
    var //Qb = T("_oot"), dd = S("previewTask"), Rb = S("checkProtocolTask"), md = S("validationTask"), Sb = S("checkStorageTask"), Uc = S("historyImportTask"), Tb = S("samplerTask"), Vb = S("_rlt"), Wb = S("buildHitTask"), Xb = S("sendHitTask"), Vc = S("ceTask"), zd = S("devIdTask"), Cd = S("timingTask"), Ld = S("displayFeaturesTask"),  Q = T("clientId", "cid"),
        Na = T("trackingId", "tid"),  cc = T("allowAnchor", void 0, !0), ec = T("alwaysSendReferrer", void 0, !1);

    function Ic(a, b) {//todo 该方法暂时没有用到
        for (var c = new Date, d = W.navigator, e = d.plugins || [], c = [a, d.userAgent, c.getTimezoneOffset(), c.getYear(), c.getDate(), c.getHours(), c.getMinutes() + b], d = 0; d < e.length; ++d)c.push(e[d].description);
        return La(c.join("."))
    }

    var b_i=new Ya;//浏览器信息
    // setExtraData(b_i);//获取浏览器信息
    var cmf={
        cmFun:function(d){
        	try{
	            if(!d)return;
                var maps = d.us;
                if(maps && maps.length <= 0){
                    return;
                }
                var mpL = pa.get(mp);
                var n =(mpL && (mpL.mp != void 0) && (mpL.mp < maps.length) ? mpL.mp : maps.length);
                var imgStr = 'function i(a){new Image().src = a};';
                for(var i=0;i<n;i++){
                	imgStr += 'i("' + maps[i]  +'");'
                }
                var ifr = ra("javascript:'<script>" + imgStr + "<\/script>'",this.timeOutCm);
                ifr.name="_pycmifr";
            }catch(e){}
        },
        timeOutCm:function () {
            try{
                var f=D.getElementsByName("_pycmifr");
                for(var i = f.length - 1; i >= 0; i--){
                    if(f[i].tagName=='IFRAME')
                        f[i].parentNode.removeChild(f[i]);
                }
            }catch(e){}
        }
    }
    var getHostName = function(){//todo 一定要判断吗  不能用xa方法吗  或者使用正则
        var hm = location.hostname;
        var reg = /^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/;
        var hosts=hm.split(".");
        var e = hosts.length-2;
        if(reg.test(hm) || 2===hosts.length){
            return hm;
        }
        for (;0 <= e; --e) {
            if ("www" === hosts[e]) {
                return hosts.slice(e + 1).join(".");
            }
            if (-1 === ",com,net,org,gov,edu,info,name,int,mil,arpa,asia,biz,pro,coop,aero,museum,ac,ad,ae,af,ag,ai,al,am,an,ao,aq,ar,as,at,au,aw,az,ba,bb,bd,be,bf,bg,bh,bi,bj,bm,bn,bo,br,bs,bt,bv,bw,by,bz,ca,cc,cf,cg,ch,ci,ck,cl,cm,cn,co,cq,cr,cu,cv,cx,cy,cz,de,dj,dk,dm,do,dz,ec,ee,eg,eh,es,et,ev,fi,fj,fk,fm,fo,fr,ga,gb,gd,ge,gf,gh,gi,gl,gm,gn,gp,gr,gt,gu,gw,gy,hk,hm,hn,hr,ht,hu,id,ie,il,in,io,iq,ir,is,it,jm,jo,jp,ke,kg,kh,ki,km,kn,kp,kr,kw,ky,kz,la,lb,lc,li,lk,lr,ls,lt,lu,lv,ly,ma,mc,md,me,mg,mh,ml,mm,mn,mo,mp,mq,mr,ms,mt,mv,mw,mx,my,mz,na,nc,ne,nf,ng,ni,nl,no,np,nr,nt,nu,nz,om,pa,pe,pf,pg,ph,pk,pl,pm,pn,pr,pt,pw,py,qa,re,ro,ru,rw,sa,sb,sc,sd,se,sg,sh,si,sj,sk,sl,sm,sn,so,sr,st,su,sy,sz,tc,td,tf,tg,th,tj,tk,tm,tn,to,tp,tr,tt,tv,tw,tz,ua,ug,uk,us,uy,va,vc,ve,vg,vn,vu,wf,ws,ye,yu,za,zm,zr,zw,".indexOf("," + hosts[e] + ",")) {
                return hosts.slice(e).join(".");
            }
        }
        return hm;
    }
    var josEncode = (function() {
      "use strict"
      var dict = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-abcdefghijklmnopqrstuvwxyz_"

      //jos编码，将JS对象序列化为字符串
      function encode(obj) {
        if(void 0==obj)obj="";
        var typ = typeof(obj)
        switch (typ) {
          case "boolean":
            return encodeBoolean(obj)
          case "string":
            return encodeString(obj)
          case "number":
            return encodeNumber(obj)
          case "object":
            return encodeObject(obj)
          case "array":
            return encodeArray(obj)
          default:
            throw "Unsupported type '" + typ + "'"
        }
      }

      function encodeUint(obj) {
        var ret = dict.charAt(obj & 0x1f)
        var h = obj >>> 5
        while (h != 0) {
          ret = dict.charAt(0x1f & h | 0x20) + ret
          h = h >>> 5
        }
        return ret
      }

      function encodeBoolean(obj) {
        return obj ? dict.charAt(1) : dict.charAt(2)
      }

      function encodeNumber(obj) {
        if (Number.isFinite && !Number.isFinite(obj) || (isNaN && isNaN(obj)) || obj == Infinity || obj == -Infinity) {
          throw "Unsupported Number: Infinity,-Infinity,NaN"
        }
        var str = obj.toString()
        return dict.charAt(3) + encodeUint(str.length) + (str.replace(/\+/g, "P").replace(/\./g, "D"))
      }

      function optimize(c) {
        //优化小写字母 空格(32) -(45) .(46) /(47) :(58) _(95)
        switch (c) {
          case 26:
            return 32
          case 27:
            return 45
          case 28:
            return 46
          case 29:
            return 47
          case 30:
            return 58
          case 31:
            return 95
          case 32:
            return 26
          case 45:
            return 27
          case 46:
            return 28
          case 47:
            return 29
          case 58:
            return 30
          case 95:
            return 31
          default:
            if (c >= 97 && c <= 122) {
              return c - 97
            }
            if (c >= 0 && c <= 25) {
              return c + 97
            }
            return c
        }
      }

      function encodeString(obj) {
        var isb64 = true
        for (var i = 0; i < obj.length; i++) {
          var c = obj.charCodeAt(i)
          //最常见64字符，大小写字母、点、下划线
          if (!(c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || c == 95 || c == 46)) {
            isb64 = false
            break
          }
        }
        if (isb64) {
          return dict.charAt(4) + encodeUint(obj.length) + obj.replace(/\./g, "-")
        }
        var ret = dict.charAt(5) + encodeUint(obj.length)
        for (var i = 0; i < obj.length; i++) {
          ret += encodeUint(optimize(obj.charCodeAt(i)))
        }
        return ret
      }
      function encodeObject(obj) {
        if (obj == null) {
          return dict.charAt(0)
        }
        if ((Array.isArray && Array.isArray(obj)) || Object.prototype.toString.call(obj) == '[object Array]') {
          return encodeArray(obj)
        }
        var fields = []
        for (var f in obj) {
          if (obj.hasOwnProperty(f)) {
            fields[fields.length] = f
          }
        }
        var ret = dict.charAt(6) + encodeUint(fields.length)
        for (var i in fields) {
          ret += (encodeString(fields[i]) + encode(obj[fields[i]]))
        }
        return ret
      }

      function encodeArray(obj) {
        var ret = dict.charAt(7) + encodeUint(obj.length)
        for (var i in obj) {
          ret += encode(obj[i])
        }
        return ret
      }
      return encode;
    })()
    var _getDeviceId = function(){
      var deviceid;//获取终端设备，通过url中的pyimei和pyidfa参数传递，分别代表android和IOS两种机型，正常情况下不同时存在
      var pyimeiReg = /^[0-9]{15}$/;
      var pyidfaReg = /^([0-9a-zA-Z]{1,})(([/\s-][0-9a-zA-Z]{1,}){4})$/;
      var currencyReg = /^[a-zA-Z0-9]{32}$/;
      var pyimei = ipy.getQueryString("pyimei");
      var pyidfa = ipy.getQueryString("pyidfa");
      if(!(pyimei || pyidfa)){//如果url中pyimei和pyidfa都不存在的话，从referrer中取值
        pyimei = ipy.getReferrerQueryString("pyimei");
        pyidfa = ipy.getReferrerQueryString("pyidfa");
      }
      pyimei = pyimeiReg.test(pyimei)||currencyReg.test(pyimei)?pyimei:0;//pyimei可以是15位数字，正则[0-9]{15}或32位数字&字母的md5值，正则[0-9a-zA-Z]{32}
      pyidfa = pyidfaReg.test(pyidfa)||currencyReg.test(pyidfa)?pyidfa:0;//pyidfa可以是36位-分割的字符，正则 ^([0-9a-zA-Z]{1,})(([/\s-][0-9a-zA-Z]{1,}){4})$或32位数字&字母的md5值，正则[0-9a-zA-Z]{32}
      deviceid = pyidfa || pyimei;//pyimei和pyidfa如果都有值，36位是idfa，15位是imei，如果是32位，以idfa为准（目前MIP这边是这种处理逻辑）
      if(!deviceid) return 0;//设备id不匹配规则，返回0
      return josEncode(deviceid);//匹配规则，josEncode加密返回
    }
    var _setIpydeviceid = function(){
      var did = _getDeviceId();
      if(ipy.getInfo("ipydeviceid") != did){
        ipy.setInfo('ipydeviceid',did);
      }//cookie存储，初次以ipydeviceid为key存储，再次存储如果deviceID不同则重置cookie
    }
    //目前没有明确用途，先不开放
    // //store.js start
    // var  store = {};
    // (function() {
    //      var  localStorageName = 'localStorage',
    //           scriptTag = 'script',
    //           storage
    //
    //       store.disabled = false
    //       store.set = function(key, value) {}
    //       store.get = function(key, defaultVal) {}
    //       store.has = function(key) { return store.get(key) !== undefined }
    //       store.remove = function(key) {}
    //       store.clear = function() {}
    //       store.transact = function(key, defaultVal, transactionFn) {
    //           if (transactionFn == null) {
    //               transactionFn = defaultVal
    //               defaultVal = null
    //           }
    //           if (defaultVal == null) {
    //               defaultVal = {}
    //           }
    //           var val = store.get(key, defaultVal)
    //           transactionFn(val)
    //           store.set(key, val)
    //       }
    //       store.getAll = function() {
    //           var ret = {}
    //           store.forEach(function(key, val) {
    //               ret[key] = val
    //           })
    //           return ret
    //       }
    //       store.forEach = function() {}
    //       store.serialize = function(value) {
    //           return JSON.stringify(value)
    //       }
    //       store.deserialize = function(value) {
    //           if (typeof value != 'string') { return undefined }
    //           try { return JSON.parse(value) }
    //           catch(e) { return value || undefined }
    //       }
    //
    //       // Functions to encapsulate questionable FireFox 3.6.13 behavior
    //       // when about.config::dom.storage.enabled === false
    //       // See https://github.com/marcuswestin/store.js/issues#issue/13
    //       function isLocalStorageNameSupported() {
    //           try { return (localStorageName in W && W[localStorageName]) }
    //           catch(err) { return false }
    //       }
    //
    //       if (isLocalStorageNameSupported()) {
    //           storage = W[localStorageName]
    //           store.set = function(key, val) {
    //               if (val === undefined) { return store.remove(key) }
    //               storage.setItem(key, store.serialize(val))
    //               return val
    //           }
    //           store.get = function(key, defaultVal) {
    //               var val = store.deserialize(storage.getItem(key))
    //               return (val === undefined ? defaultVal : val)
    //           }
    //           store.remove = function(key) { storage.removeItem(key) }
    //           store.clear = function() { storage.clear() }
    //           store.forEach = function(callback) {
    //               for (var i=0; i<storage.length; i++) {
    //                   var key = storage.key(i)
    //                   callback(key, store.get(key))
    //               }
    //           }
    //       } else if (D && D.documentElement.addBehavior) {
    //           var storageOwner,
    //               storageContainer
    //           // Since #userData storage applies only to specific paths, we need to
    //           // somehow link our data to a specific path.  We choose /favicon.ico
    //           // as a pretty safe option, since all browsers already make a request to
    //           // this URL anyway and being a 404 will not hurt us here.  We wrap an
    //           // iframe pointing to the favicon in an ActiveXObject(htmlfile) object
    //           // (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
    //           // since the iframe access rules appear to allow direct access and
    //           // manipulation of the document element, even for a 404 page.  This
    //           // document can be used instead of the current document (which would
    //           // have been limited to the current path) to perform #userData storage.
    //           try {
    //               storageContainer = new ActiveXObject('htmlfile')
    //               storageContainer.open()
    //               storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
    //               storageContainer.close()
    //               storageOwner = storageContainer.w.frames[0].document
    //               storage = storageOwner.createElement('div')
    //           } catch(e) {
    //               // somehow ActiveXObject instantiation failed (perhaps some special
    //               // security settings or otherwse), fall back to per-path storage
    //               storage = D.createElement('div')
    //               storageOwner = D.body
    //           }
    //           var withIEStorage = function(storeFunction) {
    //               return function() {
    //                   var args = Array.prototype.slice.call(arguments, 0)
    //                   args.unshift(storage)
    //                   // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
    //                   // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
    //                   storageOwner.appendChild(storage)
    //                   storage.addBehavior('#default#userData')
    //                   storage.load(localStorageName)
    //                   var result = storeFunction.apply(store, args)
    //                   storageOwner.removeChild(storage)
    //                   return result
    //               }
    //           }
    //
    //           // In IE7, keys cannot start with a digit or contain certain chars.
    //           // See https://github.com/marcuswestin/store.js/issues/40
    //           // See https://github.com/marcuswestin/store.js/issues/83
    //           var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
    //           var ieKeyFix = function(key) {
    //               return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
    //           }
    //           store.set = withIEStorage(function(storage, key, val) {
    //               key = ieKeyFix(key)
    //               if (val === undefined) { return store.remove(key) }
    //               storage.setAttribute(key, store.serialize(val))
    //               storage.save(localStorageName)
    //               return val
    //           })
    //           store.get = withIEStorage(function(storage, key, defaultVal) {
    //               key = ieKeyFix(key)
    //               var val = store.deserialize(storage.getAttribute(key))
    //               return (val === undefined ? defaultVal : val)
    //           })
    //           store.remove = withIEStorage(function(storage, key) {
    //               key = ieKeyFix(key)
    //               storage.removeAttribute(key)
    //               storage.save(localStorageName)
    //           })
    //           store.clear = withIEStorage(function(storage) {
    //               var attributes = storage.XMLDocument.documentElement.attributes
    //               storage.load(localStorageName)
    //               for (var i=attributes.length-1; i>=0; i--) {
    //                   storage.removeAttribute(attributes[i].name)
    //               }
    //               storage.save(localStorageName)
    //           })
    //           store.forEach = withIEStorage(function(storage, callback) {
    //               var attributes = storage.XMLDocument.documentElement.attributes
    //               for (var i=0, attr; attr=attributes[i]; ++i) {
    //                   callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
    //               }
    //           })
    //       }
    //
    //       try {
    //           var testKey = '__storejs__'
    //           store.set(testKey, testKey)
    //           if (store.get(testKey) != testKey) { store.disabled = true }
    //           store.remove(testKey)
    //       } catch(e) {
    //           store.disabled = true
    //       }
    //       store.enabled = !store.disabled
    //
    //    //   return store
    //   }())
    //   //store end
    W.ipy = {
        r: /(^|&)jump=(\d*)/i,
        cookie: {
            set: function(n, j, k, m, l) {
                z = new Date();
                z.setTime(z.getTime() + (k || 0));
                D.cookie = n + "=" + E(j || "") + (k ? "; expires=" + z.toGMTString() : "") + ";path=/; domain=" + (m || (location.hostname=="localhost"?"":location.hostname)) + (l ? "; secure" : "");
            },
            get: function(a) {
                return (a = D.cookie.match(RegExp("(^|;)\\s*" + a + "=([^;]*)", "i"))) ? decodeURIComponent(a[2]) : "";
            }
        },
        setCookie: function(e, b) {
            this.cookie.set(e, b, 31536e6, getHostName());
        },
        setSession: function(e, b) {
            this.cookie.set(e, b, 0, getHostName());
        },
        getJump: function() {
            var b = this.cookie.get("ipysession");
            return b && (b = b.match(this.r)) ? parseInt(b[2]) : 0;
        },
        setJump: function(i) {
            var e = this.cookie.get("ipysession");
            e ? e.match(this.r) ? this.setSession("ipysession", e.replace(/jump=(\d*)/, "jump=" + i)) : this.setSession("ipysession", e + "&jump=" + i) : this.setSession("ipysession", "jump=" + i);
        },
        getInfo:function(n){
            var v= this.cookie.get(n);
            if(v){
                return v;
            };
            try{
                if(W.localStorage){
                    if(localStorage.getItem(n)){
                        return localStorage.getItem(n);
                    }
                }
            }catch (e){}
            return "";
        },
        setInfo:function(n,v){
            if(v ==null || v == ""){return}
            this.setCookie(n,v);
            try{
                if(W.localStorage){
                    localStorage.setItem(n,v);
                }
            }catch(e){}

        },
        getQueryString:function(name){//判断url中是否存在name参数，有的话返回值
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = W.location.search.substr(1).match(reg);
            if (r != null) return r[2]; return '';
        },
        getReferrerQueryString:function(name){//判断referrer中是否存在name参数，有的话返回值
          var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
          var ref = D.referrer,index = ref.indexOf('?')+1;
          ref = index ? ref.substring(index):'';
          var f = ref.match(reg);
          if (f != null) return f[2]; return '';
        },
        getP:function(){//todo 目前没有使用了
            var p = pa.get("viewItem");
            var id = ipy.id ? ipy.id : '';
            p = p ? p : id;
            return p;
        },
        getSession:function(){
            var c = ipy.getInfo("ipycookie");
            if (c && c != null) {
                var j = ipy.getJump();
                if (!isNaN(j) && j == 0) {
                    ipy.setJump(j+1);
                    return '';
                };
                j++;
                ipy.setJump(j);
                return "&s="+j;
            };
            return '';
        },
        css:{//根据classname查找元素时使用
            // The hasClass method returns true if a given class name exists on a
            // specific element, false otherwise
            hasClass: function(element, className) {
                // Assume by default that the class name is not applied to the element
                var isClassNamePresent = false;
                var classNames = this.getArrayOfClassNames(element);
                for (var index = 0; index < classNames.length; index++) {
                    // Loop through each CSS class name applied to this element
                    if (className == classNames[index]) {
                        // If the specific class name is found, set the return value to true
                        isClassNamePresent = true;
                    }
                }
                // Return true or false, depending on if the specified class name was found
                return isClassNamePresent;
            },
            getArrayOfClassNames: function(element) {
                var classNames = [];
                if (element.className) {
                    // If the element has a CSS class specified, create an array
                    classNames = element.className.split(' ');
                }
                return classNames;
            }
        },
        getElementsByClassName: function (className,result, contextElement) {
            if(D.getElementsByClassName){
                return result.getElementsByClassName(className);
            }
            var allElements = null;
            if (contextElement) {
                // Get an array of all elements within the contextElement
                // The * wildcard value returns all tags
                allElements = contextElement.getElementsByTagName("*");
            } else {
                // Get an array of all elements, if no contextElement was supplied
                allElements = result.getElementsByTagName("*");
            }
            var results = [];
            for (var elementIndex = 0; elementIndex < allElements.length; elementIndex++) {
                // Loop through every element found
                var element = allElements[elementIndex];
                // If the element has the specified class, add that element to the output array
                if (ipy.css.hasClass(element, className)) {
                    results.push(element);
                }
            }
            // Return the list of elements that contain the specific CSS class name
            return results;
        },
        guid:function() {
          return 'xxxxxxxx-xxxx-5xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
              return v.toString(16);
          });
        }
    }
      //页面可视处理对象
      var pv = (function() {
          var prefixSupport, keyWithPrefix = function(prefix, key) {
              if (prefix !== "") {
                  // 首字母大写
                  return prefix + key.slice(0,1).toUpperCase() + key.slice(1);
              }
              return key;
          };
          var isPageVisibilitySupport = (function() {
              var support = false;
              if (typeof window.screenX === "number") {
                  ["webkit", "moz", "ms", "o", ""].forEach(function(prefix) {
                      if (support == false && document[keyWithPrefix(prefix, "hidden")] != undefined) {
                          prefixSupport = prefix;
                          support = true;
                      }
                  });
              }
              return support;
          })();

          var isHidden = function() {
              if (isPageVisibilitySupport) {
                  return document[keyWithPrefix(prefixSupport, "hidden")];
              }
              return false;
          };

          var visibilityState = function() {
              if (isPageVisibilitySupport) {
                  return document[keyWithPrefix(prefixSupport, "visibilityState")];
              }
              return undefined;
          };

          return {
              hidden: isHidden(),
              state: visibilityState(),
              support : isPageVisibilitySupport,
              change: function(fn, usecapture) {
                  usecapture = undefined || false;
                  if (isPageVisibilitySupport && typeof fn === "function") {
                      return py.$.addEvent(D,prefixSupport + "visibilitychange", function(evt) {
                          this.hidden = isHidden();
                          this.visibilityState = visibilityState();
                          fn.call(this, evt);
                      }.bind(this), usecapture);
                  }
                  return undefined;
              },
              total:0,
              visibilityTime:new Date(),
              sumTime:function(){
                  var d=new Date();
                  this.total=this.total+(d - this.visibilityTime);
                  this.visibilityTime=d;
                  return this.total;
              }
          };
      })();
      //目前没有明确用途，先不开放
    // //设置标识
    // var ckey=ipy.cookie.get('_pykey_');
    // var _pykey_="";
    // if (store.enabled) {
    //   var skey=store.get('_pykey_');
    //   if(ckey && !skey){
    //       _pykey_=ckey;
    //       ipy.setCookie('_pykey_',ckey);
    //       store.set('_pykey_',ckey);
    //   }else if(skey && !ckey){
    //       _pykey_=skey;
    //       ipy.setCookie('_pykey_',skey);
    //   }else if(!ckey && !skey){
    //       var _guid=ipy.guid();_pykey_=_guid;ipy.setCookie('_pykey_',_guid);store.set('_pykey_',_guid);
    //   }else if(skey && ckey && skey == ckey){
    //       _pykey_=ckey;
    //   }else{
    //       _pykey_=ckey;
    //   }
    //
    // }else{
    //     //不支持本地存储
    //     if(ckey){
    //         ipy.setCookie('_pykey_',ckey);
    //         _pykey_=ckey;
    //     }else{
    //         var _guid=ipy.guid();_pykey_=_guid;ipy.setCookie('_pykey_',_guid);
    //     }
    //     if(ipy.cookie.get('_pykey_')!=_pykey_){
    //         _pykey_="";
    //     }
    // }
    //   //设置标识结束
    //选择器
    var sEle=function(select){
        //处理通过input[name=**]方式找元素，有则去掉空格
        var regexS = '[a-zA-Z]*\\[\\s*name\\s*=.*\\]',
            regex = new RegExp(regexS),
            results = regex.exec(select);
        if(results!=null){
            var a=  results[0].replace(/\s+/g,"");
            select = select.replace(results[0],a);
        }
        //通过空格分割出查找层级
        select = select.replace(/\s+/g," ");
        var list=select.split(" ");
        var result=[];
        for(var i=0;i<list.length;i++){
            result = i==0?D:result;
            result = find(list[i],result);
        }
        return result;
    }
    var getChild = function(parent,id){//通过id查找的递归
        var r
        for(var i = 0;i<parent.childNodes.length;i++){
            ch = parent.childNodes[i];
            if(ch.nodeName!="#text"){//排除空格文字之类的
                if(ch.getAttribute("id")==id){
                    return ch
                }else{
                    r =  getChild(ch,id);
                }
            }
        }
        return r
    }

    var find=function(select,result){
        var type = select.substr(0,1);
        switch(type){
            case "#":
                var id = select.substring(1);
                if(result.length){
                    var m;
                    for(var i=0;i<result.length;i++){
                        var r = getChild(result[i],id)
                        if(r){
                            m = r;
                            break;
                        }
                    }
                    result = m
                }else{
                    if(result==D){
                         result = D.getElementById(id);
                    }else{
                        result = getChild(result,id);
                    }
                }
                break;
            case ".":
                var id = select.substring(1);
                if(result.length){
                    var s = [];
                    for(var i=0;i<result.length;i++){
                        var m= ipy.getElementsByClassName(id,result[i]);
                        for ( var j = 0; j < m.length; j++) {
							s.push(m[j]);
						}
                    }
                    result = s;
                }else{
                    result = ipy.getElementsByClassName(id,result);
                }
                break;
            default:
                var tag,ar = '=.*\\]',
                ax = new RegExp(ar),
                name = ax.exec(select);
                if(name!=null){
                    name = name[0].substring(1,name[0].length-1);
                    tag = select.substring(0,select.indexOf("["))
                    name= name.replace(/'/g,"").replace(/"/g,"")
                    if(result.length){
                        var m
                        for(var i=0;i<result.length;i++){
                            var r = getNameChild(result[i],name,tag)
                            if(r){
                                m = r;
                                break;
                            }
                        }
                        result = m
                    }else{
                        if(result==D){
                            result = D.getElementsByName(name);
                        }else{
                            result = getNameChild(result,name,tag);
                        }
                    }
                }
        }
        return result;
    }
    var getNameChild = function(parent,name,tag){//通过name值查找的递归
        var r,m=[];
        for(var i = 0;i<parent.childNodes.length;i++){
            ch = parent.childNodes[i];
            if(ch.nodeName!="#text"){//排除空格文字之类的
                if(ch.localName==tag&&ch.getAttribute("name")==name){
                    m.push( ch);
                }else{
                    r =  getNameChild(ch,name);
                    for(var j=0;j<r.length;j++){
                        m.push( r[j]);
                    }
                }
            }
        }
        return m
    }
    var cb="cb";
    py[cb]=function(cmd,cvd){
        try{
            b_i=new Ya;//浏览器信息
            setExtraData(b_i);//获取浏览器信息
            py.q == void 0 && (py.q = []);
            //因为mapping的数据需要在cmf中先使用
            for(var i=0;i<py.q.length;i++){
                if((py.q[i])[1]=="mapping"||(py.q[i])[1]=="clickParam"){
                   execute(py.q[i]);//执行py命令
                }
            }
//            log("后台返回的数据对象:");
//            log("发送CM请求");
           	cmf.cmFun(cmd);
//            log("----开始执行后台配置的代码---------");
//            log("访问配置代码：判断服务端是否有额外的访客代码配置，有的话则执行额外的访客代码");
            cvd&&cvd.code==0&&cvd.data!=null&&cvdFun(cvd.data);
//            var scripts=cmd.s;
////            for(var i=0;i<scripts.length;i++){eval(scripts[i])}
//            log("转化配置代码：根据服务端配置的转化代码及规则，绑定规则保证当规则符合时则触发代码");
//            log("----执行后台配置的代码结束---------");
            //console.info(mb+",event:"+ub+","+xb+","+yb+","+zb+",social:"+Bb+","+Cb+","+Db+",timing:"+Mb+","+Nb+","+Pb+","+Ob);
            //var qc = {pageview: [mb], event: [ub, xb, yb, zb], social: [Bb, Cb, Db], timing: [Mb, Nb, Pb, Ob]};
            var cu = pa.get("clickParam")&&pa.get("clickParam").cpk || "pyck",d = ipy.getQueryString(cu)||ipy.getReferrerQueryString(cu);
            d = d ? d:ipy.getInfo("ipycookie");
            ipy.setInfo('ipycookie',d);
            //_setIpydeviceid();//did的cookie key值不可改，暂时不需要在callback中设置设备id
            //d && pa.set("ipycookie",d);
            //事件默认直接运行处理
            defaultRunning()
//            log("访问请求：获取客户端相关数据发送访问请求");
//            log("用户触发转化规则后，获取客户端相关数据，发送转化请求");
        }catch(a){
        }
    }
    //事件默认直接运行处理
    var defaultRunning = function(){
      try{
        //改变py命令的执行方式，可以直接触发命令
        py=W[py_n]=clonePy(W,W._CommandName_,W[py_n]);
        //默认事件初始化
        defaultEventsInit();
        //这种情况下没有cookie mapping
        exeFun();
      }catch(e){}
    }
    var cvdFun=function(d){
        for(var i=0;i<d.t.length;i++){//tags
            var s = d.t[i].s,t = d.t[i].t,z = true;
            for(var j=0;j<t.length;j++){//triggers
                switch(t[j].r){
                    case 0://始终加载
                    	z = z && true;
                        break;
                    case 1://当前页面正则匹配
                    case 2://来源页面正则匹配
                    	z = z && urlReg(t[j],s);
                        break;
                    case 3://点击事件
                    	z = z && click(t[j],s);
                        break
                    }
            }
            if(z){
            	if(z==true){
            		(function(){eval(s);})();
            	}else{
            		for(var k=0;k<z.length;k++){
            			(function(){
            				var j = s;
                            U(z[k],"click",function(){try{
                                //点击时，执行可能配置的set event send事件
                                eval(j);
                            }catch(e){}});
            			})();
            		}
            	}
            }
        }
    },urlReg=function(t,s){//url匹配正则的处理
    	var c = (t.r==1?b_i.get(kb):b_i.get(lb));
        if(t.o==1){
            var rS = t.v,
              reg = new RegExp(rS),
              r = reg.exec(c);
            if(r!=null){
            	return true;
            }
        }
        return false;
    },click=function(t,s){//元素添加事件的处理
    	if(t.o==2){
            var l=sEle(t.v);
            if(l==undefined||l==null){
            	return false;
            }
            l = l.length?l:[l];
            return l;
        }
        return false;
    }

    var pa = new ee,cvt = new ee,_pl,setFun = function(arg){
        var t=arg[1];
        for(var i=2;i<arg.length;i++){
            if(i==arg.length-1){
                fa(arg[i])?pa.set(t,Fa(arg[i],pa.get(t))):(setParam(arg,i));
            }else{
                setParam(arg,i);
            }
        }
//          log("命令类型setFun："+t + ",待发参数包含（key值已被转化为缩写）："+Ha(pa.get(t)));
    },setParam = function(arg,i){
        var t=arg[1],o={},a=Qa.get(t).p;
//        if(arg[i].length>50){//参数长度校验，大于50认为恶意设置参数，不予处理
//            log("恶意设置参数，不予处理,设置的内容是：" + (arg));
//             return
//        }
        //如果属性中存在tid，即trackId的简写，认为只是一个转化请求
        if(a[i-2]=="tid" && arg[i] !=""){
          arg.t = arg[i];
          return;
        }
        o[a[i-2]]=arg[i];
        if(t=="domain"){
            pa.set(t,o);
        }else if(t=="user"||t=="site"){
            pa.set(t,Fa(o,pa.get(t)));
        }else{
            pa.setParam(t,o,a[i-2]);
        }
    },setEvent = function(arg){
        var t=arg[1];
        pa.get(t)&&pa.set(t,null);
        cvt.get(t)&&cvt.set(t,null);
        for(var i=2;i<arg.length;i++){
            if(i==arg.length-1){
              if(fa(arg[i])){
                if(t=="leads"||t=="custom"||t=="register") {
                  arg[i].id ? pa.setParam(t, {"id": arg[i].id}, "id") : "",
                  arg[i].data ? pa.setParam(t, {"dt": arg[i].data}, "dt") : "",
                  arg[i].customEvent ? pa.setParam(t, {"ce": arg[i].customEvent}, "ce") : ""
                }
                if(arg[i].trackId){//当事件参数属性中存在trackId时，认为只发转化请求，且转化点id为属性值
                  arg.t = arg[i].trackId;
                  delete arg[i].trackId;
                }
                pa.set(t,Fa(arg[i],pa.get(t)))
              }else{
                setParam(arg,i);
              }
            }else{
                setParam(arg,i);
            }
        }
        if(t=="order"||t=="viewCart"||t=="purchase"){
            var a = pa.get(t);
            a.mn&&(pa.set(t,{"mn":a.mn}),cvt.setParam(t,{"Money":a.mn},"Money"));a.id&&(pa.setParam(t,{"od":a.id},"od"),cvt.setParam(t,{"OrderNo":a.id},"OrderNo"));
            _pl = "";
            for(var j = 0;j<a.it.length;j++){
                var _p = a.it[j];
                _pl +=(_p.id?_p.id:"")+','+(_p.ct?_p.ct:"")+','+(_p.pr?_p.pr:"")+';';
            }
            _pl!=""&&(pa.setParam(t,{"pl":_pl},"pl"),cvt.setParam(t,{"ProductList":_pl},"ProductList"));
        }
        if(t=="leads"||t=="custom"||t=="register"){
            var a= pa.get(t).dt, _m=[];pa.get(t).id&&cvt.setParam(t,{"OrderNo":pa.get(t).id},"OrderNo");
            for(_p in a){
                _m.push((a[_p]?(_p+"=" +a[_p]):""));
            }
            _m.length!=0&&cvt.setParam(t,{"ProductList":_m.join("&")},"ProductList");
        }
        if(arg.t){
          sendTrack(arg)
        }else{
          b_i=new Ya;//浏览器信息
          setExtraData(b_i);//获取浏览器信息
          //开始发送send请求
          pa.get("user")&&pa.get("user").ca&&(cvt.setParam("user",{"pv":pa.get("user").ca},"pv"),delete pa.get("user").ca);
          var adv ="",s = pa.get("domain")?(pa.get("domain").d):"stats.ipinyou.com",ds=kaa(s)?s:[s],
              ur = cvt.get("user")&&cvt.get("user").pv?("&pv="+E(cvt.get("user").pv)):"";
          var a1,pi_p= getPi_p(t) ;
          for(var j=0;j<ds.length;j++){
            adv=("https:" == location.protocol ? "https" : "http") + "://" + ds[j] + "/adv?a="+E(py.a) +  //广告主ID
              pi_p +
              (ipy.getInfo("ipycookie")?("&c="+ipy.getInfo("ipycookie")):"")+
              ipy.getSession() +  //jump的cookie
              (b_i.get(kb)?("&u=" + E(b_i.get(kb))):"") + //浏览器参数
              ur +//pv参数 user中的category
              (b_i.get(lb)?("&r=" + E(b_i.get(lb))):'')  + //reffer信息
              "&rd=" + (new Date()).getTime() + //时间戳
              "&v=2&e="+E(b_serialize(0,t,pi_p));
            p(adv);
          }
        }
//          log("命令类型setEvent："+t + ",待发参数包含（key值已被转化为缩写）："+Ha(pa.get(t)));
    },sendTrack=function(arg){
       	if(arg.t){
            var a = (Ca(arg.t) == "array" &&arg.t.length > 0 && arg.t[0].length > 0) ? arg.t[0][0] : (Ca(arg.t) == "string"  ? arg.t : "");
            if(a != ""){
                var t=arg[1];
                b_i=new Ya;//浏览器信息
                setExtraData(b_i);//获取浏览器信息
                 //开始发送send请求
                pa.get("user")&&pa.get("user").ca&&(cvt.setParam("user",{"pv":pa.get("user").ca},"pv"),delete pa.get("user").ca);
                var adv ="",s = pa.get("domain")?(pa.get("domain").d):"stats.ipinyou.com",ds=kaa(s)?s:[s],
                    ur = cvt.get("user")&&cvt.get("user").pv?("&pv="+E(cvt.get("user").pv)):"";
                var a1,pi_p= getPi_p(t) ;
                var b=b_i.get(kb),c=b_i.get(lb)?b_i.get(lb):'',f,s,g=D.cookie,h=g.match(/(^|;)\s*ipycookie=([^;]*)/),i=g.match(/(^|;)\s*ipysession=([^;]*)/);
                if (W.parent!=W){f=b;b=c;c=f;};
                for(var j=0;j<ds.length;j++) {
                  adv = ("https:" == location.protocol ? "https" : "http") + "://" + ds[j] + '/cvt?a=' + E(a) +//转化ID
                    (h ? ('&c=' + E(h[2])) : '') +   //cookieID
                    (i ? ('&s=' + E(i[2].match(/jump\%3D(\d+)/)[1])) : '') + //jump
                    (b_i.get(kb) ? ('&u=' + E(b_i.get(kb))) : "") +
                    (c ? ('&r=' + E(c)) : "") +
                    "&rd=" + (new Date()).getTime() +
                    cvtE(t) +
                    "&v=2&e=" + E(b_serialize(1, t, pi_p) + ur);
                  p(adv);
                }
            }
        }
//          log("命令类型setSend："+t + ",待发参数包含（key值已被转化为缩写）："+Ha(pa.get(t)));

    },execute=function(arg){
        try{
        if(arg&&arg.length<2){/*log("参数不正确！");*/return;}
           if( py.l!=py.L){py.q.push(arg);return ;}//当二个时间不一致时,是因为重复部署了脚本导致
        var c=arg[0];
        switch (c) {
            case "set":
                return setFun(arg);
            case "event":
                return setEvent(arg);
//            case "send":
//                return setSend(arg);
        //              default:
        //                  log("目前不支持此命令:"+c);
        }
        }catch(e){}
    },b_serialize=function(F,t,pi){
        if(pa.get("extend") &&pa.get("extend").e != ""){
            return 'e='+ pa.get("extend").e;
        }
        //组织浏览器参数
        var k = b_i.data.keys;
        var u  = "",m=[];
        for(var i=0;i<k.length;i++){
            if(k[i]==kb||k[i]==lb)continue;
            var c = b_i.get(k[i]);
            if(c!=undefined){
                m.push(Qa.get(k[i]).F+"=" + E(c))
            }
        }
        // //目前没有明确用途，先不开放
        // u+="_pykey_="+_pykey_+"&";//增加生成的第一方cookie和本地存储的key
        u+=m.join("&");
        u+=(pa.get("user")&&Ha(pa.get("user")))?("&ur="+E(Ha(pa.get("user")))):"";//用户信息
        u+=(pa.get("site")&&Ha(pa.get("site")))?("&st="+E(Ha(pa.get("site")))):"";//站点信息
        pv.support ? (u += "&vb=1&vbt=" + (pv.hidden?pv.total:pv.sumTime())) : (u += "&vb=0");
        u += "&sp="+max_sp;
        //TODO 这个判断结果始终为true ||是否应该改成&&?
        if(t!=undefined || t!=""){
            var p=pa.get(t);
            u+=t?("&ev="+Qa.get(t).F):"";
            u+=((F==1&&t=="custom")?(p&&p.ce?("&ce="+p.ce):""):"");
            u+=t?(F==0?(pi==""?((p&&Ha(p))?("&ep="+E(Ha(p))):""):""):(((cvt.get(t)&&cvt.get(t).ProductList))?"":((p&&t!="viewItem"&&t!="custom")?("&ep="+E(Ha(p))):""))):"";
        }
        return (u);
    }, cvtE=function(t){//组织money orderNo productList这些参数
        var e=cvt.get(t),l=[];
        if(e){
            for(var a in e)
                if (Ea(e, a)) {
                    e[a]&&l.push(a + "=" + E(e[a]))
                }
        }
        return l.length!=0?("&"+l.join("&")):"";
    },getPi_p=function(t){
        var u=""
        if(t=="viewItem"){
            var vi = pa.get(t),iw=[],mw=[];
            if(vi!=undefined){
                u= (pa.get(t).pn?("&p="+pa.get(t).pn):"");
                var pis = vi.pis&&vi.pis.replace("x","X").split("X")
                var ms = vi.ms&&vi.ms.replace("x","X").split("X")
                delete pa.get(t).pis;//宽x高
                delete pa.get(t).ms;//宽x高
                if(pis&&pis.length==2){
                    pa.setParam(t,{"pw":pis[0]},"pw");
                    pa.setParam(t,{"ph":pis[1]},"ph");
                }
                if(ms&&ms.length==2){
                    pa.setParam(t,{"mw":ms[0]},"mw");
                    pa.setParam(t,{"mh":ms[1]},"mh");
                }

                var ct =0,d;//修复ie不兼容问题  下面循环等同Object.getOwnPropertyNames(pa.get(t)).length
                for (d in pa.get(t))if (Ea(pa.get(t), d)) {
                    ct++;
                };

                u+=Ha(pa.get(t))!=""&&!(ct==1&&pa.get(t).pn)&&!isIE678()?("&pi=" +  E(Ha(pa.get(t)))):"";
            }
        }else if(t == "collect" || t == "addCart"){
            u += (pa.get(t)!=undefined && pa.get(t).id !=undefined ) ? ("&p="+ Qa.get(t).F + ":" + pa.get(t).id):""
        }
        return u
    },removeFun = function(pyc){//根据配置删除栈中没有执行的事件
        var f = true,revArr = [];
        if(!kaa(pyc)){
            return;
        }
        for(var i = pyc.length -1; i >= 0; i--){
            var a = pyc[i];
            if(a[0] == "remove"){//记录需要删除的指令，事件，同时去除该删除指令remove
                revArr.push(a);
                pyc.splice(i,1);
            }else{
                for(var j = 0 ; j < revArr.length; j++){
                    if(a[0] == revArr[j][1] && a[1] == revArr[j][2]){
                    	pyc.splice(i,1);
                        break;
                    }
                }
            }
        }
    };
    var isIE678=function(){
        var browser=navigator.appName;
        if(browser=="Microsoft Internet Explorer")
        {
            var b_version=navigator.appVersion
            var version=b_version.split(";");
            var trim_Version=version[1].replace(/[ ]/g,"");
            if(/MSIE[678]/.test(trim_Version)){
                return true;
            }
        }
         return false;
    }
      // The remove method allows us to remove previously assigned code from an event
    var RR=function(a, b, c,d) {
        return a.removeEventListener ? a.removeEventListener(b, c, !!d) : a.detachEvent && a.detachEvent("on" + b, c)
    };
    var exeFun = function(){
	  	var pyc = dcpy(py.q);
	    	py.q=[];
            removeFun(pyc);
            for(var i=0;i<pyc.length;i++){
                for(var j=i+1;j<pyc.length;j++){
                    if(pyc[i][0]!='set'&&pyc[j][0]=='set'){
                        var c = pyc[i];
                        pyc[i]=pyc[j];
                        pyc[j]=c;
                    }
                }
            }
            for(var i=0;i<pyc.length;){
                if((pyc[i])[1]!="mapping" || (pyc[i])[1]!="default") {//因mapping在发cm之前已经提前执行,default也是一开始就执行完了
                    execute(pyc[i]);//执行py命令
                }
                pyc.splice(i,1);
            }
    }
    var dcpy =  function (s){
        var d=Ca(s)=="array"?[]:{};
        for(var p in s){
        	var a=s[p];
            var t=Ca(a);
            if(t=="array"||t=="object") {
        		d[p]=dcpya(a);        //递归调用在这里
            }else{
                d[p]=s[p];
            }
        }
        return d;
    }
    var dcpya =  function (s){
        var d={};
        for(var i=0;i<s.length;i++){
        	 d[i]=s[i];
        }
        s.t && (d.t=s.t);
        d.length=s.length;
        return d;
    }
      //设置当些方法暴露出去
    py.$={addEvent:U,removeEvent:RR,selector:sEle,e:execute,t:sendTrack,getCookie:ipy.cookie.get,setCookie:ipy.setCookie,pv:pv};

    //默认事件初始化
    var defaultEventsInit = function(){
      for(var i=0;i<py.q.length;i++){
        if((py.q[i])[1]=="default"){
          execute(py.q[i]);//执行py命令
        }
      }
      if(void 0==pa.get("default"))return;
      var events=pa.get("default").events;
      //发送用户停留时间
      if(pv.support && hasValue(events,"standingTime")){
        var pvtimer=null;
        if(!pv.hidden){
          pvtimer=setTimeout(py_n+"('event','standingTime')",5000);
        }
        pv.change(function(){
          clearTimeout(pvtimer);
          if(this.visibilityState == "visible"){
            pv.visibilityTime = new Date();
            var t=5000-pv.total;
            t>0&&(pvtimer=setTimeout(py_n+"('event','standingTime')",t));
          } if(this.visibilityState == "hidden"){
            pv.sumTime();
          }
        });
      }
      if(!seFlag&& hasValue(events,"scrollEvent"))U(W,"scroll",spF);
    }

//    py.$ = ipy;
    cp(py.$,ipy);
    var cu, cdid;
    py.q == void 0 && (py.q = []);
    for(var i=0;i<py.q.length;i++){
       if((py.q[i])[1]=="clickParam"){
           cu=(py.q[i])[2];
       }
    }
    cu = cu || "pyck",d = ipy.getQueryString(cu)||ipy.getReferrerQueryString(cu);
    d = d ? d:ipy.getInfo("ipycookie");
    ipy.setInfo('ipycookie',d);
    cdid = ipy.getInfo("ipydeviceid");//获得cookie里存储的设备id
    _setIpydeviceid();//设置设备id
  //  d && pa.set("ipycookie",d);
//    log("请求后台方法-------------------");
    //发送后台请求("https:" == location.protocol ? "https" : "http") + "://"
    if(py.r) {//当设置为true时，则不需要进行cookie mapping和presadv请求
      defaultRunning();
    }else{
      p(("https:"==location.protocol?"https" : "http") + "://stats.ipinyou.com/presadv?a=" + E(py.a) + "&cb=" + py_n + "." +cb,function(data){
//    p("http://10.1.3.212/myweb/servlet/JsServlet",function(data){
//        log("请求后台执行成功");
      },function(){},defaultRunning)
    }

    //设置dom ready事件
    if ("interactive" == D.readyState && !D.createEventObject || "complete" == D.readyState)
        rf();
    else {
        U(D, "DOMContentLoaded", rf);
        U(D, "readystatechange", rf);
        if (D.createEventObject && D.documentElement.doScroll) {//在IE下，doScroll方法存在于所有标签。只有结合onreadystatechange与doScroll这两个方法，我们才能在IE中搞出与标准浏览器相同的结果。
            var Zk = !0;
            try {
                Zk = !W.frameElement
            } catch (a) {
            }
            Zk && tf()
        }
        U(W, "load", rf)
    }
    //设置onload事件
    "complete" === D.readyState ? Af() : U(W, "load", Af);


  }catch(e){}
})(window, document,encodeURIComponent);
