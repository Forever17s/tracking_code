/*
 * @adv
 * 4.3.0 初始化代码，基于4.2.X的改进优化版本
 * @version 4.3.0
 * */
(function (W,D,E) {
  try{
    //判断js对象类型的正则表达式定义
    var objTypeArg = /\[object (Boolean|Number|String|Function|Array|Date|RegExp)\]/,
      //C判断对象类型字符串,如为null返回'null',
      objTypeString = function (obj) {
        if (null == obj)return String(obj);
        var arr = objTypeArg.exec(Object.prototype.toString.call(Object(obj)));
        return arr ? arr[1].toLowerCase() : "object"
      },
      //如果 object 具有指定名称的属性，那么JavaScript中hasOwnProperty函数方法返回 true；反之则返回 false。
      //此方法无法检查该对象的原型链中是否具有该属性；该属性必须是对象本身的一个成员。在下例中，所有的 String 对象共享一个公用 split 方法。下面的代码将输出 false 和 true。
      //var s = new String("JScript");
      //print(s.hasOwnProperty("split"));
      //print(String.prototype.hasOwnProperty("split"));
      hasOwnProperty = function (obj, property) {
        return Object.prototype.hasOwnProperty.call(Object(obj), property)
      },
      // 判断对象
      isObject = function (obj) {
        if (!obj || "object" != objTypeString(obj) || obj.nodeType || obj == obj.window)return !1;
        try {
          //isPrototypeOf是用来判断指定对象object1是否存在于另一个对象object2的原型链中，是则返回true，否则返回false。
          if (obj.constructor && !hasOwnProperty(obj, "constructor") && !hasOwnProperty(obj.constructor.prototype, "isPrototypeOf"))return !1
        } catch (c) {
          return !1
        }
        for (var p in obj);
        return void 0 ===p || hasOwnProperty(obj, p)
      },
      isEmptyObject = function( obj ) {
        var name;
        for ( name in obj ) {
          return false;
        }
        return true;
      },
      // 将source的属性copy到dest对象中，dest需要copy到的对象，source被copy的对象，
      extend = function(dest,source){
        var result = dest || ("array" == objTypeString(source) ? [] : {}), property;
        for (property in source)if (hasOwnProperty(source, property)) {
          var e = source[property];
          "array" == objTypeString(e) ? ("array" != objTypeString(result[property]) && (result[property] = []), result[property] = extend(e, result[property])) : isObject(e) ? (isObject(result[property]) || (result[property] = {}), result[property] = extend(e, result[property])) : result[property] = e
        }
        return result
      },
      isFunction = function (obj) {// 判断参数是否为funciton类型
        return "function" == typeof obj
      },
      isArray = function (obj) {// 判断参数是否为array类型
        return "[object Array]" == Object.prototype.toString.call(Object(obj))
      },
      // 判断数组中是否存在元素
      hasValue = function(arr,value){
        if(void 0 ==arr || !isArray(arr))return 0;
        for(var i=0;i<arr.length;i++){
          if(value==arr[i])return 1;
        }
        return 0;
      },
      isString = function (obj) {
        return void 0 != obj && -1 < (obj.constructor + "").indexOf("String")
      },
      startWith = function (str1, str2) {
        return 0 == str1.indexOf(str2)
      },
      getPropertyValue = function (property, defalutValue, useDefaultValue) {
        var value = W[property];
        W[property] = void 0 === value || useDefaultValue ? defalutValue : value;
        return W[property]
      },
      //插入document元素中，优先绷按第一条script标签，body,head
      appendElement = function (element) {
        var b = D.getElementsByTagName("script")[0] || D.body || D.head;
        b.parentNode.insertBefore(element, b)
      },
      //处理script的onlaod事件，element表示script/img/iframe对象,onload表示需要执行的函数名
      onload = function (element, onload) {
        onload && (element.addEventListener ? element.onload = onload : element.onreadystatechange = function () {
          element.readyState in{loaded: 1, complete: 1} && (element.onreadystatechange = null, onload())
        })
      },
      //创建一个script，并指定onlaod方法和onerror方法
      createScript = function (src, onload, onerror) {
        var s = D.createElement("script");
        s.type = "text/javascript";
        s.async = !0;
        s.src = src;
        addEventListener(s, onload);
        onerror && (s.onerror = onerror);
        appendElement(s)
      },
      //创建一个iframe,并指定onload方法，返回创建成功的对iframe对象
      createIframe = function (src, onload) {
        var iframe = D.createElement("iframe");
        iframe.height = "0";
        iframe.width = "0";
        iframe.style.display = "none";
        iframe.style.visibility = "hidden";
        void 0 !== src && (iframe.src = src);//先给src赋值，在append到页面，如果反之会认为是二次更新
        appendElement(iframe);
        addEventListener(iframe, onload);
        return iframe
      },
      //创建一个img,并指定onlaod事件和onerror事件
      createImg = function (src, onload, onerror) {//TODO 暂时没用
        var img = new Image(1, 1);
        img.onload = function () {
          img.onload = null;
          onload && onload()
        };
        img.onerror = function () {
          img.onerror = null;
          onerror && onerror()
        };
        img.src = src
      },
      //通用的增加事件方法，useCapture, 一个bool类型。当为false时为冒泡获取(由里向外)，true为capture方式(由外向里)。
      addEventListener = function (element, eventType, callback, useCapture) {
        element.addEventListener ? element.addEventListener(eventType, callback, !!useCapture) : element.attachEvent && element.attachEvent("on" + eventType, callback)
      },
      // The remove method allows us to remove previously assigned code from an event
      removeEventListener = function(element, eventType, callback,useCapture) {
        return element.removeEventListener ? element.removeEventListener(eventType, callback, !!useCapture) : element.detachEvent && element.detachEvent("on" + eventType, callback)
      },
      trim = function (str) {//字符串转换的UnicodeDecodeError—— ‘\xa0’问题unicode中的‘\xa0’字符在转换成gbk编码时会出现问题，gbk无法转换'\xa0'字符。所以，在转换的时候必需进行一些前置动作：
        return str ? str.replace(/^[\s\uFEFF\xa0]+|[\s\uFEFF\xa0]+$/g, "") : ""
      },
      logLevel = 0,// 日志提示级别
      log = function (message) {//日志输出方法
        logLevel>1 && W.console && W.console.log && W.console.log(message)
      },
      warn = function (message) {
        logLevel>2 && W.console && W.console.warn && W.console.warn(message)
      },
      error = function (message) {
        logLevel>0 && W.console && W.console.error && W.console.error(message)
      },
      getHostName = function(){
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
      },
      getBrowserData=function(browserInfo){//初始化参数代码，用来收集广告主传递的需要回传到服务端的数据
        var browserInfo={};
        browserInfo["did"]=ipy.getInfo("ipydeviceid")||_getDeviceId();//获取设备id，优先使用cookie存储的，cookie没有则用url的
        return browserInfo;
      },
      getPageData=function(){
        var pageInfo={};
        var url = location.href,referrer=D.referrer;
        W.parent != W && (url= referrer, referrer = "");//处理在iframe中的情况，部署代码要避免这种情况发生
        pageInfo["tt"]=D.title;
        pageInfo["u"]= url
        pageInfo["r"]= referrer;//获取referrer
        return pageInfo;
      },
      _prop = function (name, shortName, required) {
        this.name = name;//属性名称
        this.shortName = shortName;//属性缩写
        this.required = required;//必填
      }
    _object = function () {
      this.keys = [];//属性的key值，顺序有特别含义
      this.props = {};
      this.values = {};
    },
      _object.prototype.addProp = function(name,shortName){
        this.keys.push(name);
        this.props[":"+name]=new _prop(name,shortName);
      },
      _object.prototype.hasKey = function (key) {
        for(var i=0;i<this.keys.length;i++){
          if(key==this.keys[i])return true;
        }
        return false;
      },
      _object.prototype.set = function (key, value) {//同名的key值会覆盖设置内容
        if(this.hasKey(key)){
          var v=this.get(key);
          isObject(value)?this.values[":"+key] = extend(v,value):this.values[":"+key] = value;
        }else{
          this.addProp(key,key);
          this.values[":"+key] = value;
        }
      },
      _object.prototype.get = function (key) {//返回的是_prop对象
        return this.values[":" + key]
      },
      _object.prototype.merge = function (obj) {
        for (var key in obj)if (hasOwnProperty(obj, key)) {
          this.set(key,obj[key])
        }
      },
      _object.prototype.clear = function (obj) {//清除对象的值
        this.values={};
      },
      _object.prototype.toObject = function(){
        var obj={};
        for(var i=0;i<this.keys.length;i++){
          var key=this.keys[i];
          var value=this.get(key);
          var shortName=this.props[":"+key].shortName;
          if(void 0 != value)obj[shortName]=value;
        }
        return obj;
      },
      _eventObject = function(name, shortName){
        this.prop=new _prop(name,shortName);
        this.obj=new _object;
      },
      _eventObject.prototype.addProps = function(propArray){
        for(var i=0;i<propArray.length;i++){
          var prop=propArray[i];
          this.obj.addProp(prop[0],prop[1]);//内部设置使用，保证不会出现设置错误
        }
        return this;
      },
      _eventObject.prototype.addProp = function(name,shortName,required){
        this.obj.addProp(name,shortName,required);
        return this;
      },
      _eventObject.prototype.get = function(key){
        return this.obj.get(key);
      },
      //选择器
      sEle=function(select){
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
      },
      getChild = function(parent,id){//通过id查找的递归
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
      },
      find=function(select,result){
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
                result = D.getElementById(id);//存在bug
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
      },
      getNameChild = function(parent,name,tag){//通过name值查找的递归
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
      },
      josEncode = (function() {
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
      })(),
      // 本地存储逻辑封装
      store=(function() {
        var store = {},
          localStorageName = 'localStorage',
          scriptTag = 'script',
          storage

        store.disabled = false
        store.set = function(key, value) {}
        store.get = function(key, defaultVal) {}
        store.has = function(key) { return store.get(key) !== undefined }
        store.remove = function(key) {}
        store.clear = function() {}
        store.transact = function(key, defaultVal, transactionFn) {
          if (transactionFn == null) {
            transactionFn = defaultVal
            defaultVal = null
          }
          if (defaultVal == null) {
            defaultVal = {}
          }
          var val = store.get(key, defaultVal)
          transactionFn(val)
          store.set(key, val)
        }
        store.getAll = function() {
          var ret = {}
          store.forEach(function(key, val) {
            ret[key] = val
          })
          return ret
        }
        store.forEach = function() {}
        store.serialize = function(value) {
          return JSON.stringify(value)
        }
        store.deserialize = function(value) {
          if (typeof value != 'string') { return undefined }
          try { return JSON.parse(value) }
          catch(e) { return value || undefined }
        }

        function isLocalStorageNameSupported() {
          try { return (localStorageName in W && W[localStorageName]) }
          catch(err) { return false }
        }

        if (isLocalStorageNameSupported()) {
          storage = W[localStorageName]
          store.set = function(key, val) {
            if (val === undefined) { return store.remove(key) }
            storage.setItem(key, store.serialize(val))
            return val
          }
          store.get = function(key, defaultVal) {
            var val = store.deserialize(storage.getItem(key))
            return (val === undefined ? defaultVal : val)
          }
          store.remove = function(key) { storage.removeItem(key) }
          store.clear = function() { storage.clear() }
          store.forEach = function(callback) {
            for (var i=0; i<storage.length; i++) {
              var key = storage.key(i)
              callback(key, store.get(key))
            }
          }
        }

        try {
          var testKey = '__storejs__'
          store.set(testKey, testKey)
          if (store.get(testKey) != testKey) { store.disabled = true }
          store.remove(testKey)
        } catch(e) {
          store.disabled = true
        }
        store.enabled = !store.disabled

        return store
      }()),
      _pykey_ = "",
      _setPykey = function(){
        var ckey=ipy.cookie.get('_pykey_');
        if (store.enabled) {
          var skey=store.get('_pykey_');//本地存储的值
          if(ckey){//存在第一方cookie时，使用第一方cookie
            _pykey_=ckey;
          }else {
            if(skey) {//存在本地存储且不存在第一方cookie时，使用本地存储
              _pykey_ = skey;
            }else{
              _pykey_=ipy.guid();
            }
          }
          ipy.setCookie('_pykey_',_pykey_);
          store.set('_pykey_',_pykey_);
        }else{
          //不支持本地存储
          if(ckey){
            ipy.setCookie('_pykey_',ckey);
            _pykey_=ckey;
          }else{
            var _guid=ipy.guid();_pykey_=_guid;ipy.setCookie('_pykey_',_guid);
          }
          if(ipy.cookie.get('_pykey_')!=_pykey_){
            _pykey_="";
          }
        }
      },
      pageVisibility = (function() {//页面可视处理对象
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
      })(),
      cmf={
        cmFun:function(d){
          try{
            if(!d)return;
            var maps = d.us;
            if(maps && maps.length <= 0){
              return;
            }
            var mpL = eventInfo["mapping"].get("mapping");
            var n =((mpL != void 0) && (mpL < maps.length) ? mpL : maps.length);
            var imgStr = 'function i(a){new Image().src = a};';
            for(var i=0;i<n;i++){
              imgStr += 'i("' + maps[i]  +'");'
            }
            var ifr = createIframe("javascript:'<script>" + imgStr + "<\/script>'",this.timeOutCm);
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
      },
      executeEventName = function(eventName){
        py.q == void 0 && (py.q = []);
        //因为mapping的数据需要在cmf中先使用
        for(var i=0;i<py.q.length;i++){
          if((py.q[i])[1]==eventName){
            execute(py.q[i]);//执行py命令
          }
        }
      },
      execute = function(arg){
        try{
          if(arg&&arg.length<2){/*log("参数不正确！");*/return;}
          if( py.l!=py.L){py.q.push(arg);return ;}//当二个时间不一致时,是因为重复部署了脚本导致
          var c=arg[0];
          if("set"!=c &&"event"!=c){log("目前不支持此命令:"+c);return;}

          var eventName=arg[1],obj=eventInfo[eventName].obj,keys=obj.keys,urlType="adv",ti;
          if("event"==c)obj.clear();
          for(var i=2;i<arg.length;i++){
            var value=arg[i];
            if(i==arg.length-1 && isObject(value)){
              if(value.trackId){
                arg.t = value.trackId;
                delete value.trackId;
              }
              obj.merge(value)
            }else{
              if(keys[i-2]=="trackId" && value !=""){
                arg.t = value;
                continue;
              }
              if(keys.length>i-2){
                obj.set(keys[i-2],value);
              }else{
                error("参数错误");
              }
            }
          }
          if("event"==c){
            if(arg.t){
              ti = (objTypeString(arg.t) == "array" &&arg.t.length > 0 && arg.t[0].length > 0) ? arg.t[0][0] : (objTypeString(arg.t) == "string"  ? arg.t : "");
              if(ti != ""){//如果转化点id不为空，则为转化请求
                urlType = "cvt";
              }
            }
            //开始发送send请求
            var advs =[],
              domain=eventInfo["domain"].get("domain"),
              ds = (void 0==domain)?["stats.ipinyou.com"]:isArray(domain)?domain:[domain],
              extend=eventInfo["extend"].get("extend"),
              j = ipy.getJump();
            userInfo=eventInfo["user"].obj.toObject(),
              siteInfo=eventInfo["site"].obj.toObject(),
              pageInfo=getPageData(),
              eventParams=obj.toObject();
            for(var i=0;i<ds.length;i++){
              var adv=("https:" == location.protocol ? "https" : "http") + "://" + ds[i] + "/"+urlType+"?a="+E(py.a) +  //a参数,广告主ID
                (void 0!=ti && ""!=ti?"&ti="+ti:"")+ //ti参数，转化点id
                (ipy.getInfo("ipycookie")?("&c="+ipy.getInfo("ipycookie")):"")+//c参数
                (j == 0?"":"&s="+j)+//s参数,jump的cookie
                "&ev="+eventInfo[eventName].prop.shortName + //ev参数，事件名称
                "&v=3" +//v参数
                (isEmptyObject(userInfo)?"":("&"+eventInfo["user"].prop.shortName+"="+josEncode(userInfo)))+//ur参数，用户信息
                (isEmptyObject(siteInfo)?"":("&"+eventInfo["site"].prop.shortName+"="+josEncode(siteInfo)))+//st参数，站点信息
                "&_c="+_pykey_+//增加生成的第一方cookie和本地存储的key
                "&b=" +josEncode(browserInfo)+//b参数，终端信息
                "&pg=" +josEncode(pageInfo)+//p参数，页面信息
                (isEmptyObject(eventParams)?"":("&ep="+josEncode(eventParams)))+//ep参数，事件对应的参数信息
                ((void 0==extend)?"":"&e="+E(extend))+
                "&rd=" + (new Date()).getTime(); //rd参数，时间戳
              createScript(adv);
            }
          }
        }catch(e){error(e)}
      },
      removeFun = function(pyc){//根据配置删除栈中没有执行的事件
        if(!isArray(pyc)){
          return;
        }
        var revArr = [],a,i,j;
        for(i = pyc.length -1; i >= 0; i--){
          a = pyc[i];
          if(a[0] == "remove"){//记录需要删除的指令，事件，同时去除该删除指令remove
            revArr.push(a);
            pyc.splice(i,1);
          }else{
            for(j = 0 ; j < revArr.length; j++){
              if(a[0] == revArr[j][1] && a[1] == revArr[j][2]){
                pyc.splice(i,1);
                break;
              }
            }
          }
        }
      },
      exeFun = function(){//执行命令入口方法
        var commandArray = dcpy(py.q);
        py.q=[];
        removeFun(commandArray);//先执行remove命令的逻辑
        for(var i=0;i<commandArray.length;i++){//对当前命令进行排序处理
          for(var j=i+1;j<commandArray.length;j++){
            if(commandArray[i][0]!='set'&&commandArray[j][0]=='set'){
              var c = commandArray[i];
              commandArray[i]=commandArray[j];
              commandArray[j]=c;
            }
          }
        }
        for(var i=0;i<commandArray.length;){
          if((commandArray[i])[1]!="mapping" && (commandArray[i])[1]!="default") {//因mapping在发cm之前已经提前执行,default也是一开始就执行了
            execute(commandArray[i]);//执行py命令
          }
          commandArray.splice(i,1);//执行完py命令后会移除执行过的命令
        }
      },
      dcpy =  function (s){
        var d=objTypeString(s)=="array"?[]:{};
        for(var p in s){
          var a=s[p];
          var t=objTypeString(a);
          if(t=="array"||t=="object") {
            d[p]=dcpya(a);        //递归调用在这里
          }else{
            d[p]=s[p];
          }
        }
        return d;
      },
      dcpya =  function (s){
        var d={};
        for(var i=0;i<s.length;i++){
          d[i]=s[i];
        }
        s.t && (d.t=s.t);
        d.length=s.length;
        return d;
      },
      clonePy = function(w,l,py){
        var _py =  function(){var r = arguments;r.length && w[l].$.e(r);
          w[l].track = function(a){ (r.t =[]).push(arguments);  if(a){w[l].$.t(r)}};return w[l]};
        extend(_py,py);
        return _py;
      },
      _getClickParam = function(){
        var clickParam;
        py.q == void 0 && (py.q = []);
        for(var i=0;i<py.q.length;i++){
          if((py.q[i])[1]=="clickParam"){
            clickParam=(py.q[i])[2];
          }
        }
        clickParam = clickParam || "pyck";
        return clickParam;
      },
      _setIpycookie = function(){
        var ck = _getClickParam();
        var d= ipy.getQueryString(ck)||ipy.getReferrerQueryString(ck);
        d = d ? d:ipy.getInfo("ipycookie");
        ipy.setInfo('ipycookie',d);//clickParam的cookie存储
      },
      _getDeviceId = function(){
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
      },
      _setIpydeviceid = function(){
        var did = _getDeviceId();
        if(ipy.getInfo("ipydeviceid") != did){
          ipy.setInfo('ipydeviceid',did);
        }//cookie存储，初次以ipydeviceid为key存储，再次存储如果deviceID不同则重置cookie
      },
      bodyReady = function (bodyReadyFun) {
        if (D.body) {
          bodyReadyFun();
        } else W.setTimeout(function () {
          bodyReady(bodyReadyFun)
        }, 200)
      },
      isReady = !1,//false
      readyFunctionArray = [],
      readyFunction = function (a) {//dom ready时触发的事件
        if (!isReady) {
          var createEventObject = D.createEventObject, complete = "complete" == D.readyState, interactive = "interactive" == D.readyState;
          if (!a || "readystatechange" != a.type || complete || !createEventObject && interactive) {
            isReady = !0;
            for (var i = 0; i < readyFunctionArray.length; i++)readyFunctionArray[i]()
          }
        }
      },
      ieScrollCount = 0,
      ieReadyFunction = function () {//低版本浏览器dom ready触发
        if (!isReady && 140 > ieScrollCount) {
          ieScrollCount++;
          try {
            //ie有个特有的doScroll方法，当页面DOM未加载完成时，调用doScroll方法时，就会报错，反过来，只要一直间隔调用doScroll直到不报错，那就表示页面DOM加载完毕了。
            D.documentElement.doScroll("left"), readyFunction()
          } catch (a) {
            W.setTimeout(ieReadyFunction, 50)
          }
        }
      },
      completeFlag = !1,
      completeFunctionArray = [],
      //onload触发发事件
      completeFunction = function () {
        if (!completeFlag) {
          completeFlag = !0;
          for (var a = 0; a < completeFunctionArray.length; a++)completeFunctionArray[a]()
        }
      };
    W.ipy = {
      r: /(^|&)jump=(\d*)/i,
      cookie: {
        set: function(n, j, k, m, l) {
          var z = new Date();
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
        try{
          var b = this.cookie.get("ipysession");
          return b && (b = b.match(this.r)) ? parseInt(b[2]) : 0;
        }catch(e){return 0;}

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
      setJumpSession:function(){
        var c = ipy.getInfo("ipycookie");
        if (c && c != null) {
          var j = ipy.getJump();
          ipy.setJump(++j);
        };
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
    log("加载adv脚本方法完成...");
    //得到命令方法对像
    var commandName =isString(W._CommandName_) && trim(W._CommandName_) || "py";
    var py=W[commandName];
    py.L=py.l;//识别多次部署的参数
    if(!py.a)return;//广告主id为必填参数,如果为空则无法处理任何事情
    //设置些方法暴露出去
    py.$={addEvent:addEventListener,removeEvent:removeEventListener,selector:sEle,e:execute,t:execute,getCookie:ipy.cookie.get,setCookie:ipy.setCookie,pv:pageVisibility,encode:josEncode};
    extend(py.$,ipy);
    var browserInfo=getBrowserData(),//获取浏览器信息
      pageInfo=getPageData(),//获取页面信息,提前获取方便preadv返回时校验url的匹配规则
      eventInfo={};
    eventInfo["domain"] = new _eventObject("domain","d").addProps([["domain","d"]]);//不会传递后台
    eventInfo["mapping"] = new _eventObject("mapping","mp").addProps([["mapping","mp"]]);//不会传递后台
    eventInfo["default"] = new _eventObject("default","df").addProps([["events","evs"]]);//不会传递后台
    eventInfo["extend"] = new _eventObject("extend","e").addProps([["extend","e"]]);
    eventInfo["user"] = new _eventObject("user","ur").addProps([["id","i",!0],["name","n"],["cookieId","ci"],["email","em"],["type","t"],["category","ca"]]);
    eventInfo["clickParam"] = new _eventObject("clickParam","cp").addProps([["clickParam","cp"]]);//不会传递后台
    eventInfo["site"] = new _eventObject("site","st").addProps([["type","t"],["id","i"],["industry","ind"]]);
    //event事件
    eventInfo["viewHome"] = new _eventObject("viewHome","vh");
    eventInfo["viewList"] = new _eventObject("viewList","vl").addProps([["categoryPath","cp",!0]]);
    eventInfo["viewItem"] = new _eventObject("viewItem","vi").addProps([["area","aa"],["android_brand_schema","abs"],["activity_content","ac"],["activity_end_time","ae"],["airplane_model","am"],["addr","ar"],["activity_start_time","as"],["android_shop_schema","ass"],["android_schema_url","asu"],["start_area","str"],["start_time","stt"],["activity_url","au"],["brand","b"],["business_area","ba"],["brand_id","bi"],["brand_logo","bl"],["brand_url","bu"],["category","ca",!0],["currency_code","cc",!0],["classify","cf"],["category_id","cid"],["category_path","cp"],["city","cty"],["country","cy"],["discount","dc"],["decoration","de"],["duration","du"],["extend","e"],["end_airport","ea"],["end_area","er"],["end_time","et"],["feature","ft"],["house_area","ha"],["house_mode","hd"],["has_meals","hm"],["house_type","ht"],["ios_brand_schema","ibs"],["ios_shop_schema","iss"],["ios_schema_url","isu"],["lbs","lb"],["mobile_activity_url","ma"],["mobile_brand_logo","mbl"],["mobile_brand_url","mbu"],["mobile_pic_height","mh"],["mobile_pic_ratio","mm"],["mobile_pc_pic_url","mpu"],["mobile_shop_logo","msl"],["mobile_shop_url","msu"],["mobile_pic_url","mu"],["mobile_pic_width","mw"],["name","n"],["off_time","oft"],["orig_price","op"],["on_time","ot"],["pic_height","ph"],["punctuality_ratio","pl"],["promotion","pm"],["product_no","pn"],["pc_pic_url","ppu"],["price","pr",!0],["pic_ratio","pt"],["product_url","pu",!0],["pic_width","pw"],["removed","rm"],["short_desc","sd"],["score","se"],["spu_id","si"],["shop_logo","sl"],["short_name","sm"],["shop_name","sn"],["sold_out","so"],["shop_id","sp"],["start_airport","sta"],["shop_url","su"],["star_level","sv"],["seat_type","sy"],["total_price","tl"],["type","t"],["mobile_product_url","wap"],["mobile_pic_size","ms"],["pic_size","pis"]]);
    eventInfo["viewSearch"] = new _eventObject("viewSearch","vs").addProps([["keywords","k",!0]]);
    eventInfo["viewActivity"] = new _eventObject("viewActivity","va").addProps([["name","n"]]);
    eventInfo["viewChannel"] = new _eventObject("viewChannel","vn").addProps([["name","n"]]);
    eventInfo["viewUserIndex"] = new _eventObject("viewUserIndex","vu").addProps([["userId","ui"]]);
    eventInfo["viewCart"] = new _eventObject("viewCart","vc").addProps([["money","m"],["id","i"],["count","ct"],["price","pr"]]);
    eventInfo["viewPage"] = new _eventObject("viewPage","vg").addProps([["page","pg"]]);
    eventInfo["collect"] = new _eventObject("collect","cl").addProps([["id","i"],["trackId","ti"]]);
    eventInfo["order"] = new _eventObject("order","od").addProps([["id","i"],["money","m"],["items","it"],["count","ct"],["price","pr"],["trackId","ti"]]);
    eventInfo["addCart"] = new _eventObject("addCart","ad").addProps([["id","i"],["trackId","ti"]]);
    eventInfo["register"] = new _eventObject("register","rg").addProps([["id","i"],["name","n"],["email","em"],["type","t"],["data","d"],["trackId","ti"]]);
    eventInfo["leads"] = new _eventObject("leads","ls").addProps([["id","i"],["name","n"],["email","em"],["type","t"],["data","d"],["trackId","ti"]]);
    eventInfo["custom"] = new _eventObject("custom","cm").addProps([["id","i"],["customEvent","ce"],["data","d"],["trackId","ti"]]);
    eventInfo["consult"] = new _eventObject("consult","co").addProps([["trackId","ti"]]);
    eventInfo["message"] = new _eventObject("message","msg").addProps([["trackId","ti"]]);
    eventInfo["purchase"] = new _eventObject("purchase","pch").addProps([["id","i"],["money","m"],["items","it"],["count","ct"],["price","pr"],["trackId","ti"]]);
    eventInfo["statistics"] = new _eventObject("statistics","sts").addProps([["trackId","ti"]]);
    eventInfo["standingTime"] = new _eventObject("standingTime","ste");
    eventInfo["scrollEvent"] = new _eventObject("scrollEvent","se");
    log("初始化方法完成...");
    _setIpycookie();//设置ipycookie
    //此方法必须保证在getBrowserData方法之后，这样能保证发送的值为上次存储的值
    _setIpydeviceid();//设置设备id，初次以ipydeviceid为key存储，再次存储如果deviceID不同则重置cookie
    _setPykey();//设置标识_pykey_
    ipy.setJumpSession();//设置或增加Jump值

    var callback="cb";
    py[callback] = function(cmd,cvd){
      try{
        //因为mapping的数据需要在cmf中先使用
        executeEventName("mapping");
        log("发送CM请求");
        cmf.cmFun(cmd);
        defaultRunning();
      }catch(a){
        error(a);
      }
    }
    //事件默认直接运行处理
    var defaultRunning = function(){
      try{
        //改变py命令的处理方式，直接执行命令
        py=W[commandName]=clonePy(W,W._CommandName_,W[commandName]);
        //这种情况下没有cookie mapping
        exeFun();
      }catch(e){}
    }
    if(py.r){//当设置为true时，则不需要进行cookie mapping和presadv请求
      defaultRunning();
    }else{
      // 和百度、谷歌、爱奇艺、搜狐、淘宝进行cookie mapping
      py[callback]({t: 1, p: 1000,
        us: "https:"==location.protocol?
          ["https://cm.pos.baidu.com/pixel?dspid=6418041","https://cm.g.doubleclick.net/pixel?google_nid=ipy&google_cm","https://ckm.aty.sohu.com/cm.gif?ver=1&mid=10012","https://cms.tanx.com/t.gif?tanx_nid=29600513&tanx_cm"] :
          ["http://cm.pos.baidu.com/pixel?dspid=6418041","http://cm.g.doubleclick.net/pixel?google_nid=ipy&google_cm","http://ckm.iqiyi.com/pixel?qiyi_nid=71000015&qiyi_sc","http://t.go.sohu.com/cm.gif?ver=1&mid=10012","http://cms.tanx.com/t.gif?tanx_nid=29600513&tanx_cm"]
      })
    }

    //设置dom ready事件
    if ("interactive" == D.readyState && !D.createEventObject || "complete" == D.readyState)
      readyFunction();
    else {
      addEventListener(D, "DOMContentLoaded", readyFunction);
      addEventListener(D, "readystatechange", readyFunction);
      if (D.createEventObject && D.documentElement.doScroll) {//在IE下，doScroll方法存在于所有标签。只有结合onreadystatechange与doScroll这两个方法，我们才能在IE中搞出与标准浏览器相同的结果。
        var isReadyFlag = !0;
        try {
          isReadyFlag = !W.frameElement
        } catch (a) {
        }
        isReadyFlag && ieReadyFunction()
      }
      addEventListener(W, "load", readyFunction)
    }
    //设置onload事件
    "complete" === D.readyState ? completeFunction() : addEventListener(W, "load", completeFunction);
  }catch(e){console.error(e)}
})(window, document,encodeURIComponent);
