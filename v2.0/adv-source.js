/*
 *
 * @adv
 * @auther sean.wang,hank
 * 2.7.3 增加商品收集属性，货币币种，选填，不填默认为人民币，调整代码版本定义；解决mapping属性符合说明实现“1为关闭cookiemapping其他为开启”
 * 2.7.4 针对这四家广告主（"jumei.com","womai.com","lvmama.com","lagou.com"）做了处理
 * 		1）主页面http，使用反向cm的方式
 * 		2）主页面https，依旧使用cmas.html的方式cm
 * 2.7.5 全部广告主走反向cm的方式
 * 2.7.6 因为返回cm方式后台不能同步上线，回退到2.7.3的版本
 * 2.7.7 cma地址切换为cdn上地址，同时去掉当当的特殊处理
 * 2.7.8 发送adv请求时增加版本标识参数v=1,用于区分此版本发出的请求
 * 2.7.9 对部分广告主进行smart pixel代码的切换升级
 * 2.7.10 对当当（xT），VIPABC（uc），聚美优品（_d）进行smart pixel代码的切换升级.调整smart pixel调用代码
 * 2.7.11 切第二批广告主
 * 2.7.12 （1）iframe加sendbox属性值为allow-scripts，
 *  	      （2）修改流程为先发送adv，load完成后iframe引用cmas.html/cma.html发送cm请求,不使用timeout发送cm请求
 * 2.7.13 iframe加sendbox属性值为allow-same-origin
 * 2.7.14 第三批切换smart pixel黑名单
 * 2.7.15 驴妈妈加入黑名单
 * 2.7.16 smart pixel的py命令增加clickParam命令,解决getQueryString代码逻辑错误问题
 * 2.7.17 旧版本访客代码商品收集时,货币参数能正常使用新版本传值
 * 2.7.18 清空smart pixel黑名单
 * @version 2.7.18
 *
 * */
(function(win, doc, enc) {
    function isArray(arr){
        return Object.prototype.toString.call(arr) === '[object Array]';
    }
    _py.getLast = function(e) {
        for (var a = this.length - 1; 0 <= a; a--) {
            if(isArray(this[a])){
                if (this[a][0] == e) {
                    return this[a][1];
                }
            }
        }
        return null;
    };
    var a = _py.getLast("a"),smartPixelIdBlackList=[],comId=a && a.split(".")[0],smartPixel=true;
    for(var i=0;i<smartPixelIdBlackList.length;i++){if(smartPixelIdBlackList[i]==comId){smartPixel=false;break;}}
    if(smartPixel){
        var p= _py.getLast("p"),pi= _py.getLast("pi"),pv= _py.getLast("pv"),e= _py.getLast("e"),d= _py.getLast("domain"),m= _py.getLast("mapping"),c=_py.getLast('urlParam');
        (function(w,d,s,l,a){
            w._CommandName_=l;w[l]=w[l]||function(){(w[l].q=w[l].q||[]).push(arguments);
                    w[l].track = function(){(w[l].q[w[l].q.length-1].t=[]).push(arguments)};return w[l]},
                w[l].a=a,w[l].l=1*new Date();
            var c = d.createElement(s);c.async=1;
            c.src='//fm.ipinyou.com/j/a.js';
            var h = d.getElementsByTagName(s)[0];h.parentNode.insertBefore(c, h);
        })(win,doc,'script','py',a);
        if(pv!=null)py("set","user",{"category":pv});
        if(e!=null)py("set","extend",e);
        if(d!=null)py("set","domain",d);
        if(m!=null&&!(m !==1))py("set","mapping",0);
        if(c!=null)py("set","clickParam",c);
        if(pi!=null){
            var _goodsDataPy={};
            _goodsDataPy.product_no=pi.id;
            _goodsDataPy.name=pi.name;
            _goodsDataPy.brand = pi.brand;
            _goodsDataPy.orig_price=pi.origPrice;
            _goodsDataPy.price = pi.price;
            _goodsDataPy.pc_pic_url = pi.imgUrl;
            _goodsDataPy.product_url  = pi.productUrl;
            _goodsDataPy.category   = pi.category;
            _goodsDataPy.sold_out   = pi.soldOut;
           if(pi.currency)_goodsDataPy.currency_code = pi.currency;
            py("event","viewItem",_goodsDataPy);
        }else if(p!=null){
            py("event","viewItem",p)
        }else{
            py("event","viewPage");
        }

    }else{//使用原有访客的逻辑
//        var RELEASE_TIME = 1000;
//        var mappingUrl = "cma";
    //    var isReleaseTime = (function(){
    //        var str = "dangdang";
    //        var _url = win.location.href;
    //
    //        if(_url.indexOf(str)>-1){
    //            RELEASE_TIME = 7000;
    //            mappingUrl = "cma_dangdang"
    //        }
    //    })();

        function isArray(arr){
            return Object.prototype.toString.call(arr) === '[object Array]';
        }

        /*
         *
         * @function getHostName
         * @获取当前主域名
         * @return String
         * */
        var getHostName = function(){
            var hostName = location.hostname;
            var reg = /^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/;
            var hosts=hostName.split(".");
            var e = hosts.length-2;
            if(reg.test(hostName) || 2===hosts.length){
                return hostName;
            }
            for (;0 <= e; --e) {
                if ("www" === hosts[e]) {
                    return hosts.slice(e + 1).join(".");
                }
                if (-1 === ",com,net,org,gov,edu,info,name,int,mil,arpa,asia,biz,pro,coop,aero,museum,ac,ad,ae,af,ag,ai,al,am,an,ao,aq,ar,as,at,au,aw,az,ba,bb,bd,be,bf,bg,bh,bi,bj,bm,bn,bo,br,bs,bt,bv,bw,by,bz,ca,cc,cf,cg,ch,ci,ck,cl,cm,cn,co,cq,cr,cu,cv,cx,cy,cz,de,dj,dk,dm,do,dz,ec,ee,eg,eh,es,et,ev,fi,fj,fk,fm,fo,fr,ga,gb,gd,ge,gf,gh,gi,gl,gm,gn,gp,gr,gt,gu,gw,gy,hk,hm,hn,hr,ht,hu,id,ie,il,in,io,iq,ir,is,it,jm,jo,jp,ke,kg,kh,ki,km,kn,kp,kr,kw,ky,kz,la,lb,lc,li,lk,lr,ls,lt,lu,lv,ly,ma,mc,md,me,mg,mh,ml,mm,mn,mo,mp,mq,mr,ms,mt,mv,mw,mx,my,mz,na,nc,ne,nf,ng,ni,nl,no,np,nr,nt,nu,nz,om,pa,pe,pf,pg,ph,pk,pl,pm,pn,pr,pt,pw,py,qa,re,ro,ru,rw,sa,sb,sc,sd,se,sg,sh,si,sj,sk,sl,sm,sn,so,sr,st,su,sy,sz,tc,td,tf,tg,th,tj,tk,tm,tn,to,tp,tr,tt,tv,tw,tz,ua,ug,uk,us,uy,va,vc,ve,vg,vn,vu,wf,ws,ye,yu,za,zm,zr,zw,".indexOf("," + hosts[e] + ",")) {
                    return hosts.slice(e).join(".");
                }
            }
            return hostName;
        }

        /*
         * @function _py.getLast 获取最后一次参数
         * @function return String
         * */
        _py.getLast = function(e) {
            for (var a = this.length - 1; 0 <= a; a--) {
                if(isArray(this[a])){
                    if (this[a][0] == e) {
                        return this[a][1];
                    }
                }

            }
        };
        /*
         * @function _py.serialize 组合所有需发送参数
         * @return String
         * */
        _py.serialize = function() {
            function t(v, e) {
                for (var u = 0; u < v.length; u++) {
                    if (v[u] === e) {
                        return u;
                    }
                }
                return -1;
            }
            for (var i = [ "domain","urlParam",'pi','e','p','mapping'], m = [], j = [], n = [], k, l = 0; l < this.length; l++) {
                k = this[l][0], -1 === t(i, k) && (j[k] = j[k] || [], 0 < j[k].length ? -1 === t(j[k], this[l][1]) && j[k].push(this[l][1]) : (j[k].push(this[l][1]),
                    m.push([ k, j[k] ])));
            }
            for (l = 0; l < m.length; l++) {
                n.push(m[l][0] + "=" + enc(m[l][1].join(",")));
            }

            return n.join("&");
        };

        /*
         * @Object ipy共用方法用来接收参数
         * */
        win.ipy = {
            r: /(^|&)jump=(\d*)/i,
            cookie: {
                set: function(n, j, k, m, l) {
                    z = new Date();
                    z.setTime(z.getTime() + (k || 0));
                    doc.cookie = n + "=" + enc(j || "") + (k ? "; expires=" + z.toGMTString() : "") + ";path=/; domain=" + (m || location.host) + (l ? "; secure" : "");
                },
                get: function(a) {
                    return (a = doc.cookie.match(RegExp("(^|;)\\s*" + a + "=([^;]*)", "i"))) ? decodeURIComponent(a[2]) : "";
                }
            },
            setCookie: function(e, b) {
                ipy.cookie.set(e, b, 31536e6, getHostName());
            },
            setSession: function(e, b) {
                ipy.cookie.set(e, b, 0, getHostName());
            },
            getJump: function() {
                var b = ipy.cookie.get("ipysession");
                return b && (b = b.match(ipy.r)) ? parseInt(b[2]) : 0;
            },
            setJump: function(i) {
                var e = ipy.cookie.get("ipysession");
                e ? e.match(ipy.r) ? ipy.setSession("ipysession", e.replace(/jump=(\d*)/, "jump=" + i)) : ipy.setSession("ipysession", e + "&jump=" + i) : ipy.setSession("ipysession", "jump=" + i);
            },
            getInfo:function(n){
                var v= ipy.cookie.get(n);
                if(v){
                    return v;
                };
                try{
                    if(win.localStorage){
                        if(localStorage.getItem(n)){
                            return localStorage.getItem(n);
                        }
                    }
                }catch (e){}
                return "";
            },
            setInfo:function(n,v){
                if(v ==null || v == ""){return}
                ipy.setCookie(n,v);
                try{
                    if(win.localStorage){
                        localStorage.setItem(n,v);
                    }
                }catch(e){}

            },
            getQueryString:function(name){//判断url中是否存在name参数，有的话返回值
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = win.location.search.substr(1).match(reg);
                if (r != null) return r[2]; return '';
            },
            setExendParam:function(p,c,e){
                var _pi = p || "",
                    _cg= c || "",
                    _ed = e || "";
                ipy.getExtendParam(_pi,_cg,_ed);
            },
            getExtendParam:function(i,g,c){
                var e="",pv="";
                if (i !=null && i) {
                    e = "p="+i;
                };
                if (g !=null && g) {
                    _py.push(['pv',g]);
                };
                if (c !=null && c) {
                    e += "&ext="+c;
                };
                ipy.extendSend(e);
            },
            itemInfo:function(json){
                var v = [],c;
                switch(typeof json){
                    case 'string':
                        c=json;
                        break;
                    case 'object':
                        var data = ['id','name','origPrice','price','brand','imgUrl','productUrl','categoryId','category','promotion','discount','soldOut','domain','currency'];
                        for (var i = 0; i < data.length; i++) {
                            var str = (json[data[i]] == undefined)?'':json[data[i]];
                            str = str.toString();
                            v.push(enc(str));
                        };
                        ipy.id = json.id || '';
                        c = v.join(',');
                        break;
                    default:
                        return c = '';
                }
                return c;
            },
            extendSend:function(ex){
                var e='';
                if (_py.getLast("e")) {
                    e='e='+_py.getLast("e")+'&';
                };
                e += ex,s = _py.getLast("domain"),
                    p = ("https:" == location.protocol ? "https" : "http") + "://" + s + "/adv?" + _py.serialize() +ipy.getSession()+"&e="+h(e)+"&rd=" + new Date().getTime();
                (new Image()).src=p;
            },
            getSession:function(){
                var c = _py.getLast("c");
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
            getP:function(){
                var p = _py.getLast('p');
                var id = ipy.id ? ipy.id : '';
                p = p ? p : id;
                return p;
            }
        };

        /*
         * 延迟发送cookie Mapping
         * */
         if(_py.getLast("mapping") !==1){
//            var f = "setTimeout(function() {var f=document;e = f.createElement('iframe');e.src='" + ("http:" != location.protocol ? "https://cm.ipinyou.com/cmas.html?a="+_py.getLast("a"): "http://fm.p0y.cn/cm/cma.html?a="+_py.getLast("a")) + "';f.body.insertBefore(e,f.body.firstChild);e.style.display='none';}, "+RELEASE_TIME+")";
            var f =  "http:" != location.protocol ? "https://cm.ipinyou.com/cmas.html?a="+_py.getLast("a"): "http://fm.p0y.cn/cm/cma.html?a="+_py.getLast("a");
        }
        var p = location.href, q = doc.referrer,e,pi,id;
        win.parent != win && (p = q, q = "");
        p && _py.push([ "u", p ]);
        q && _py.push([ "r", q ]);
        var u = _py.getLast('urlParam') || "pyck",d = ipy.getQueryString(u);
        d = d ? d:ipy.getInfo("ipycookie");
        ipy.setInfo('ipycookie',d);
        d && _py.push([ "c", d ]);
        var s = _py.getLast("domain");
        var e= _py.getLast("e");
        if (e != '' && e) {
            e='e='+_py.getLast("e");
        }else{
            e='';
        };
        //pi 用于商品库对接
        pi = ipy.itemInfo(_py.getLast("pi"));
        p = ("https:" == location.protocol ? "https" : "http") + "://" + s + "/adv?" + _py.serialize() +ipy.getSession()+"&pi="+enc(pi)+"&p="+enc(ipy.getP())+"&e="+enc(e)+"&rd=" + new Date().getTime()+"&v=1";
//        q = doc.createElement("iframe");
//        q.src = "javascript:false;";
//        q.sandbox='allow-same-origin allow-scripts';
//        q.style.display = "none";

        function adv(){
            if (doc.body) {
//                doc.body.insertBefore(q, doc.body.firstChild);
//                try {
//                    c = q.contentWindow.document, c.write('<!doctype html><html><body onload="' + f + '"><script src="' + p + '"></script></body></html>'),
//                        c.close();
//
//                } catch (b) {
//                    q.contentWindow.location.replace('javascript:void((function(){document.write("<!doctype html><html><body onload=\\"' + f + "\\\"><script>document.domain='" + document.domain + "';var s=document.createElement('script');document.body.insertBefore(s,document.body.firstChild);s.src='" + p + "';</script></body></html>\");document.close()})());");
//                }
                var c = doc.createElement("script");
                c.type = "text/javascript";
                c.async = !0;
                c.src = p;
                c.onload = c.onreadystatechange = function(){
                    if(! this.readyState|| this.readyState=='loaded' || this.readyState=='complete'){
                        c.parentNode.removeChild(c);// 删除访客请求
                        var cm = doc.createElement("iframe");
                        cm.sandbox='allow-scripts allow-same-origin';
                        cm.style.display = "none";
                        cm.src = f;
                        doc.body.insertBefore(cm, doc.body.firstChild);
                    }
                };
                doc.body.insertBefore(c, doc.body.firstChild);
            } else {
                setTimeout(adv, 50);
            }
        }
        setTimeout(adv,10);
    }
})(window, document, encodeURIComponent);