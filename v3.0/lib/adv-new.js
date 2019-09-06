(function(win, doc, encode,unescape) {
    /*
     * @ adv.js
     * @Author by sean.wang
     * @Version 3.0.1
     * @date null
     * @mail xiao.wang@ipinyou.com
     * */
    var en = encode,
        ERRORTIMES= 0,//error times
        agentArr = [];
    /*
     * @ Class util
     * util工具包
     * */
     var util = {
         /*
         * @Class cookie  cookie get || set
         * */
        cookie:{
            set:function(key,value,options){
                var _value = encodeURIComponent(value);
                document.cookie =
                    key + "=" + _value
                        + (options.path ? "; path=" + options.path : "")
                        + (options.expires ? "; expires=" + options.expires.toGMTString() : "")
                        + (options.domain ? "; domain=" + options.domain : "")
                        + (options.secure ? "; secure" : '');
            },
            get:function(key){
                if(!document.cookie){return "";}
                var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
                    result = reg.exec(document.cookie);
                if(!result){
                    return "";
                }
                var value = result[2] || "";
                if ('string' == typeof value) {
                    value = decodeURIComponent(value);
                    return value;
                }
                return "";

            }
        },
         /*
         * @function isType  check type
         * @return boolean
         * */
        isType:function(type){
            return function(obj) {
                return {}.toString.call(obj) == "[object " + type + "]"
            }
        }
    }
    var isObject = util.isType("Object");
    var isString = util.isType("String");
    var isArray = Array.isArray || util.isType("Array");
    var isFunction = util.isType("Function");

    /*
    * @function getArr copy value of _py
    * @return Array
    * */
    var getArr = function(){
        var _arr = [];
        for(var i= 0,l=_py.length;i<l;i++){
            _arr[i]=_py[i];
        }
        return _arr;
    }
    /*
    * @function  isNull
    * return boolean
    * */
    var isNull = function(arg){
        if(arg =="" || arg==null || arg=="null"){
            return true;
        }
        return false;
    }
    /*
    * @function get real host
    * @return host
    * */
    var getHost = function(){
        var host = location.hostname,
            hostName = host.split("."),
            len = 2,
            reg = /[com.cn][net.cn][org.cn][gov.cn]/g;
        if(reg.test(host)){
            len = 3;
        }
        return hostName.slice(hostName.length-len).join(".");
    }

    /*
     * @ Class Event
     * @des:Eventcenter，fire|listen custom Event
     * @return null
     * */
    var Event = (function (){

        return{
            _listeners:{},
            addListener: function(type, listener){
                if (typeof this._listeners[type] == "undefined"){
                    this._listeners[type] = [];
                }

                this._listeners[type].push(listener);
            },

            fire: function(event){
                if (typeof event == "string"){
                    event = { type: event };
                }
                if (!event.target){
                    event.target = this;
                }

                if (!event.type){
                    //throw new Error("Event object missing 'type'");
                }

                if (this._listeners[event.type] instanceof Array){
                    var listeners = this._listeners[event.type];
                    for (var i=0, len=listeners.length; i < len; i++){
                        listeners[i].call(this, event);
                    }
                }
            },

            removeListener: function(type, listener){
                if (this._listeners[type] instanceof Array){
                    var listeners = this._listeners[type];
                    for (var i=0, len=listeners.length; i < len; i++){
                        if (listeners[i] === listener){
                            listeners.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }
    })()
     /*
     * @Class _cookie  cookie|localStorage  opt
     * @
     * */
    var _cookie = {
        set:function(name,value,opt){
            util.cookie.set(name,value,opt);
            if(window.localStorage){
                localStorage.setItem(name,value)
            }
        },
        get:function(name){
            if(!isNull(util.cookie.get(name))){
                return util.cookie.get(name);
            }
            if(window.localStorage){
                if(localStorage.getItem(name)){
                    return localStorage.getItem(name);
                }
            }
            return "";        }
    }
    /*
    * @Class _session cookie|sessionStorage opt
    *
    * */
    var _session = {
        set:function(name,value,opt){
            util.cookie.set(name,value,opt);
            if(window.sessionStorage){
                sessionStorage.setItem(name,value)
            }
        },get:function(name){
            if(window.sessionStorage){
                if(sessionStorage.getItem(name)){
                    return sessionStorage.getItem(name)
                }
            }
            if(util.cookie.get(name)){
                return util.cookie.get(name);
            }
            return "";
        }
    }
    /*
    * @_jump :jump number get | add
    * @return Number
    * */
    var _jump = {
        get:function(){
            return !isNull(_session.get("ipysession"))?_session.get("ipysession"):0;
        },
        add:function(){
            var _isAdd = _cookie.get("ipycookie");
            if(isNull(_isAdd)){return}
            var _Num = _jump.get("ipysession");
            _session.set("ipysession",++_Num,{"domain":"."+getHost()});
        }

    }
    /*
    * @function getQueryString
    * @des get Url args or hash args
    * */
    var getQueryString=function(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"),
            r = window.location.search.substr(1).match(reg);
        if(r!=null&& r.length>2){
            return  unescape(r[2])
        };
        var _hash = window.location.hash.substr(1).match(reg);
        if(_hash!=null && _hash.length>2){
            return unescape(_hash[2]);
        }
        return '';
    },getProtocol = function(){
        return protocol = ("https:" == location.protocol ? "https://" : "http://");
    },getDomain = function(){
        var l = _py.length;
        for(var i=0;i<l;i++){
            if(_py[i][0] == "_setDomain"){
                return _py[i][1];
            }
        }
        return "stats.ipinyou.com";
    },getUrl = function(){
        return window.location.href;
    },getParam = function(name){
        for(var i= 0,l=_py.length;i<l;i++){
            if(_py[i][0] == name){
                return _py[i][1];
            }
        }
        return "";
    },getFlag = function(){
        return _cookie.get("ipycookie")?_cookie.get("ipycookie"):getQueryString(getParam("_setParam"));
    },getLast = function(){
        return _py[_py.length-1]
    }
    var sendUrl = function(url){
        new Image().src =getProtocol() + getDomain() + url + "&rd="+new Date().getTime();
    }
    /*
    * @Class param
    * @des : get url arguments
    * */
    var param = {
        utma:function(){
            if(util.cookie.get("__utma")){
                return "_utma="+ util.cookie.get("__utma");
            }
            return "";
        },
        utmz:function(){
            if(util.cookie.get("__utmz")){
                return "&_utmz=" + util.cookie.get("__utmz");
            }
            return "";
        },
        utm:function(){
            if(!isNull(this.utma())){
                return "&t=" + en(this.utma()+this.utmz());
            }
            return "";
        },
        u:function(){
            var u = location.href,
                r = document.referrer;
            window.parent != window && (u = r, r = '');
            return "u=" + en(u);
        },
        c:function(){
            if(!isNull(getFlag())){
                return "&c=" + getFlag();
            }
            return "";
        },
        s:function(){
            if(!isNull(getFlag())){
                return "&s=" +_jump.get();
            }
            return "";
        },
        a:function(){
            var _last = getLast();
            if(_last[0] != "_setConversion"){
                var value = getParam("_setAccount");
                return "&a=" + value;
            }else{
                return "&a=" + _last[1];
            }

        },
        e:function(){
            var val = "";
            if(!!getParam("_setExtend") || !!this.utma()){
                if(!!getParam("_setExtend")){
                    val += getParam("_setExtend");
                }
                return "&e=" + val;
            }
            return "";
        },
        r:function(){
            var r = document.referrer;
            if (!r) {
                try {
                    if (window.opener) {
                        r = window.opener.location.href;
                    }
                }
                catch (e) {}
            }
            return "&r=" + en(r);
        },
        p:function(){
            if(!!getParam("_trackPageview")){
                var val = "p=" + getParam("_trackPageview");
                return val;
            }
            return "";
        },
        pv:function(){
            var _pv = getLast();
            if(_py.length<2){return""}
            return "&pv=" + _pv[1];
        },
        extendData:function(){
            var _pv = getLast(),
                names = ["","","p","ext"],val =this.e();
            for(var i= 2,l=_pv.length;i<l;i++){
                val += "&"+names[i]+"="+_pv[i];
            }

            if(/^&/i.test(val)){
                val = val.replace("&","");
            }
            return "&e="+en(val);
        }
    }


    Event.addListener("_setAccount",function(){ })
    Event.addListener("_trackEvent",function(){ })
    Event.addListener("_setCustomVar",function(){ })
    Event.addListener("_trackPageview",function(){
        var p = param;
        var url = "/adv.gif?" + p.u()+p.a()+p.c()+p.pv()+ p.extendData()+p.r()+ p.utm()+p.s()+"";
        Event.fire("setJump");
        sendUrl(url);
    })
    Event.addListener("_setAutoPageview",function(){
        if(!!getParam("_setAutoPageview")){return}
        var p = param;
        var url = "/adv.gif?" + p.u()+p.a()+p.c()+p.pv()+ p.extendData()+p.r()+ p.utm()+p.s()+"";
        Event.fire("setJump");
        sendUrl(url)
    })
    Event.addListener("_setConversion",function(){
        var p = param,
            url = "/cvt.gif?" + p.u()+p.a()+p.c()+ p.extendData()+p.r()+ p.utm()+p.s()+"";
        sendUrl(url);
    })
    Event.addListener("setJump",function(){
        _jump.add();
    })
    Event.addListener("cookieMapping",function(){
        if(document.body){
            var ifr = document.createElement("iframe");
            ifr.style.display = "none";
            ifr.src = ("http:" != location.protocol ? "https://cm.ipinyou.com/cmas.html" : "http://cm.ipinyou.com/cma.html");
            document.body.appendChild(ifr);
        }else{
            ERRORTIMES ++;
            if(ERRORTIMES>10){
                return;
            }
            setTimeout(function(){
                Event.fire("cookieMapping");
            },200)
        }
    });
    Event.addListener("setAutoPush",function(){
        agentArr = getArr();
        for(var i= 0,l=agentArr.length;i<l;i++){
            var _v = _py[i][0];
            if( _v!=="_setAccount" && _v !== "_setExtend"  && _v !== "_setParam" && _v !== "_setDomain" && _v!=="_setAutoPageview"){
                Event.fire(_v);
            }
        }
        agentArr = null;
    })
    Event.addListener("setStore",function(){
        if(getQueryString(getParam("_setParam")) && !_cookie.get("ipycookie")){

            _cookie.set("ipycookie",getQueryString(getParam("_setParam")),{"domain":"."+getHost()});
        }
    });

    function init(){
        Event.fire("setJump");
        Event.fire("setStore");
        Event.fire("setAutoPush");
        Event.fire("_setAutoPageview");
        setTimeout(function(){
            Event.fire("cookieMapping");
        },5000)
    }

    /*
     * @ function fire
     * 自定义事件委托方法
     * */
    var fire = function(data){
        var _type = data[0];
        switch (_type){
            case "_setAccount":Event.fire("_setAccount");
                break;
            case "_trackEvent":Event.fire("_trackEvent");
                break;
            case "_trackPageview":Event.fire("_trackPageview");
                break;
            case "_setCustomVar":Event.fire("_setCustomVar");
                break;
            case "_setAutoPageview":Event.fire("_setAutoPageview");
                break;
            case "_setCookie":Event.fire("_setCookie");
                break;
            case "_setConversion":Event.fire("_setConversion");
                break;
        }
    }
    _py.push = function(data){
        Array.prototype.push.call(this,data);
        fire(data);
    }

    init();
})(window, document, encodeURIComponent,unescape);
