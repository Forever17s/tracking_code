/*
 *
 * @adv
 * @auther Hank
 * 4.0.0 去掉cm调用延迟
 * 4.0.1 反向cookiemapping调用
 * 4.0.2 解决remove属性在ie下不支持问题，使用removeChild方法
 * 4.1   取消与有货相关测试，保留cm
 * @version 4.1.0
 * */
(function(win, doc, enc) {
    var RELEASE_TIME = 0;// 默认不再延迟发送cm请求
    var mappingUrl = "cma";
    var isReleaseTime = (function(){
        var str = "dangdang";
        var _url = window.location.href;

        if(_url.indexOf(str)>-1){
            RELEASE_TIME = 7000;
            mappingUrl = "cma_dangdang"
        }
    })();

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
                doc.cookie = n + "=" + enc(j || "") + (k ? "; expires=" + z.toGMTString() : "") + ";path=/; domain=" + (m || (location.hostname=="localhost"?"":location.hostname)) + (l ? "; secure" : "");
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
        getQueryString:function(name){
            if (name== '' || name ==null) {
                return;
            };
            var _u =  win.location.href,
                _p = _u.split(name),
                dis = "";
            if(_p.length>1){
                _u = _p[1];
                dis = _u.split("&")[0].replace("=","");
                return dis;
            }
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"),
                r = win.location.search.substr(1).match(reg);
            if(r!=null && r){
                return r[2];
            };
            var _h= win.location.hash.substr(1).match(reg);
            if(_h!=null && _h){
                return _h[2];
            }
            return '';
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
                    var data = ['id','name','origPrice','price','brand','imgUrl','productUrl','categoryId','category','promotion','discount','soldOut','domain'];
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
    // pi 用于商品库对接
    pi = ipy.itemInfo(_py.getLast("pi"));
    p = ("https:" == location.protocol ? "https" : "http") + "://" + s + "/adv?" + _py.serialize() +ipy.getSession()+"&pi="+enc(pi)+"&p="+enc(ipy.getP())+"&e="+enc(e)+"&rd=" + new Date().getTime();


    // cm请求callback函数
    function cm(d){
        _py.cmf.d=d;
        var ifr=doc.createElement("iframe");
        ifr.style.display="none";
        ifr.id="_pycmifr";
        doc.body.appendChild(ifr);
        ifr.src="javascript:'<script>-function(cm){function img(){var img =new Image();return img;};cm.cmFun(img);}(window.parent._py.cmf)<\/script>'";
    }
    _py.cmf={
        d:null,
        timer:null,
        allMaps:[],
        image:null,
        _maps:[],
        loadCount:0,
        syncNum:100,
        cmFun:function(img){
            var d=this.d;
            if(!d)return;
            var t= d.t;
            this.image=img;
            this.syncNum= d.p;
            this.allMaps=this._maps= d.us;
            if(t==1){// 并行
                this.cookieMapping();
            }else if(t==2){// 串行
                this.syncNum= this.d.p=1;
                this.cookieMapping();
            }else{// 异常情况不处理
            }
        },
        cookieMapping:function () {
        	try{
	            this._maps = this.allMaps.splice(0, this.syncNum);
	            if(this._maps.length<=0){
	                var _cmifr=doc.getElementById("_pycmifr");
	                if(_cmifr)_cmifr.parentNode.removeChild(_cmifr);
	                return;
	            }
	            for(var i=0;i<this._maps.length;i++){
	                var img =this.image(); // 创建一个Image对象，实现图片的预下载
	                img.onload =img.onerror=function(){
	                    this.onload = null;
	                    _py.cmf.loadCount++;
	                    if(_py.cmf.loadCount>=_py.cmf.syncNum||_py.cmf.loadCount>=_py.cmf._maps.length){
	                        _py.cmf.loadCount=0;
	                        clearTimeout(_py.cmf.timer);
	                        _py.cmf.cookieMapping();
	                    }
	                }// 需要在能触发事件之前
	                img.src = this._maps[i];
	                img.style.display = "none";
	                // doc.body.appendChild(img);
	                // doc.body.removeChild(e);
	            }
	            this.timer = setTimeout(_py.cmf.timeOutCookieMapping, 3000);
        	}catch(e){}
        },
        timeOutCookieMapping:function () {
        	try{
	            if (_py.cmf._maps.length > 0) {
	                _py.cmf.cookieMapping();
	            }else{
	                var _cmifr=doc.getElementById("_pycmifr");
	                if(_cmifr)_cmifr.parentNode.removeChild(_cmifr);
	            }
        	}catch(e){}
        }
    }
    win.cm=cm;
    function adv(){
        if (doc.body) {
            // 由于cookiemapping需要操作body元素，需要等document.body存在时才能操作
            var c = doc.createElement("script");
            c.type = "text/javascript";
            c.async = !0;
            c.src = p;
            c.onload = c.onreadystatechange = function(){
                if(! this.readyState|| this.readyState=='loaded' || this.readyState=='complete'){
                    c.parentNode.removeChild(c);// 删除访客请求
                    var cms = doc.createElement("script");
                    cms.type = "text/javascript";
                    cms.async = !0;
                    cms.onload = cms.onreadystatechange = function() {
                        if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
                            cms.parentNode.removeChild(cms);// 删除请求
                        }
                    }
                    cms.src = ("https:" == location.protocol ? "https" : "http") + "://" +"cm.ipinyou.com/idmr/advcm"+"?a="+_py.getLast("a")+"&rd=" + new Date().getTime();;
                    var d = doc.getElementsByTagName("script")[0];
                    d.parentNode.insertBefore(cms, d);
                }
            };
            doc.body.insertBefore(c, doc.body.firstChild);
            // var d = doc.getElementsByTagName("script")[0];
            // d.parentNode.insertBefore(c, d)
        } else {
            setTimeout(adv, 50);
        }
    }
    setTimeout(adv, 10);
})(window, document, encodeURIComponent);
