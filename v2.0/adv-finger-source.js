/*
 * fingerprintJS 0.5.4 - Fast browser fingerprint library
 * https://github.com/Valve/fingerprintjs
 * Copyright (c) 2013 Valentin Vasilyev (valentin.vasilyev@outlook.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

;(function (name, context, definition) {
    if (typeof module !== 'undefined' && module.exports) { module.exports = definition(); }
    else if (typeof define === 'function' && define.amd) { define(definition); }
    else { context[name] = definition(); }
})('Fingerprint', this, function () {
    'use strict';

    var Fingerprint = function (options) {
        var nativeForEach, nativeMap;
        nativeForEach = Array.prototype.forEach;
        nativeMap = Array.prototype.map;

        this.each = function (obj, iterator, context) {
            if (obj === null) {
                return;
            }
            if (nativeForEach && obj.forEach === nativeForEach) {
                obj.forEach(iterator, context);
            } else if (obj.length === +obj.length) {
                for (var i = 0, l = obj.length; i < l; i++) {
                    if (iterator.call(context, obj[i], i, obj) === {}) return;
                }
            } else {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (iterator.call(context, obj[key], key, obj) === {}) return;
                    }
                }
            }
        };

        this.map = function(obj, iterator, context) {
            var results = [];
            // Not using strict equality so that this acts as a
            // shortcut to checking for `null` and `undefined`.
            if (obj == null) return results;
            if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
            this.each(obj, function(value, index, list) {
                results[results.length] = iterator.call(context, value, index, list);
            });
            return results;
        };

        if (typeof options == 'object'){
            this.hasher = options.hasher;
            this.screen_resolution = options.screen_resolution;
            this.canvas = options.canvas;
            this.ie_activex = options.ie_activex;
        } else if(typeof options == 'function'){
            this.hasher = options;
        }
    };

    Fingerprint.prototype = {
        get: function(){
            var keys = [];
//keys.push(navigator.userAgent);

            keys.push(navigator.language);
            keys.push(screen.colorDepth);
            if (this.screen_resolution) {
                var resolution = this.getScreenResolution();
                if (typeof resolution !== 'undefined'){ // headless browsers, such as phantomjs
                    keys.push(this.getScreenResolution().join('x'));
                }
            }

            keys.push(new Date().getTimezoneOffset());
            keys.push(this.hasSessionStorage());
            //keys.push(this.hasLocalStorage());
            keys.push(!!window.indexedDB);
            //body might not be defined at this point or removed programmatically
            if(document.body){
                keys.push(typeof(document.body.addBehavior));
            } else {
                keys.push(typeof undefined);
            }

            // keys.push(typeof(window.openDatabase));
            keys.push(navigator.cpuClass);

            keys.push(navigator.platform);

            keys.push(navigator.doNotTrack);

            keys.push(this.getPluginsString());
            if(this.canvas && this.isCanvasSupported()){
                keys.push(this.getCanvasFingerprint());
            }

            if(this.hasher){
                return this.hasher(keys.join('###'), 31);
            } else {
                return this.murmurhash3_32_gc(keys.join('###'), 31);
            }
        },

        /**
         * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
         *
         * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
         * @see http://github.com/garycourt/murmurhash-js
         * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
         * @see http://sites.google.com/site/murmurhash/
         *
         * @param {string} key ASCII only
         * @param {number} seed Positive integer only
         * @return {number} 32-bit positive integer hash
         */

        murmurhash3_32_gc: function(key, seed) {
            var remainder, bytes, h1, h1b, c1, c2, k1, i;

            remainder = key.length & 3; // key.length % 4
            bytes = key.length - remainder;
            h1 = seed;
            c1 = 0xcc9e2d51;
            c2 = 0x1b873593;
            i = 0;

            while (i < bytes) {
                k1 =
                    ((key.charCodeAt(i) & 0xff)) |
                        ((key.charCodeAt(++i) & 0xff) << 8) |
                        ((key.charCodeAt(++i) & 0xff) << 16) |
                        ((key.charCodeAt(++i) & 0xff) << 24);
                ++i;

                k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
                k1 = (k1 << 15) | (k1 >>> 17);
                k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

                h1 ^= k1;
                h1 = (h1 << 13) | (h1 >>> 19);
                h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
                h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
            }

            k1 = 0;

            switch (remainder) {
                case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
                case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
                case 1: k1 ^= (key.charCodeAt(i) & 0xff);

                    k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
                    k1 = (k1 << 15) | (k1 >>> 17);
                    k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
                    h1 ^= k1;
            }

            h1 ^= key.length;

            h1 ^= h1 >>> 16;
            h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
            h1 ^= h1 >>> 13;
            h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
            h1 ^= h1 >>> 16;

            return h1 >>> 0;
        },

        // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
        hasLocalStorage: function () {
            try{
                return !!window.localStorage;
            } catch(e) {
                return true; // SecurityError when referencing it means it exists
            }
        },

        hasSessionStorage: function () {
            try{
                return !!window.sessionStorage;
            } catch(e) {
                return true; // SecurityError when referencing it means it exists
            }
        },

        isCanvasSupported: function () {
            var elem = document.createElement('canvas');
            return !!(elem.getContext && elem.getContext('2d'));
        },

        isIE: function () {
            if(navigator.appName === 'Microsoft Internet Explorer') {
                return true;
            } else if(navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent)){// IE 11
                return true;
            }
            return false;
        },

        getPluginsString: function () {
            if(this.isIE() && this.ie_activex){
                return this.getIEPluginsString();
            } else {
                return this.getRegularPluginsString();
            }
        },

        getRegularPluginsString: function () {
            return this.map(navigator.plugins, function (p) {
                var mimeTypes = this.map(p, function(mt){
                    return [mt.type, mt.suffixes].join('~');
                }).join(',');
                return [p.name, p.description, mimeTypes].join('::');
            }, this).join(';');
        },

        getIEPluginsString: function () {
            if(window.ActiveXObject){
                var names = ['ShockwaveFlash.ShockwaveFlash',//flash plugin
                    'AcroPDF.PDF', // Adobe PDF reader 7+
                    'PDF.PdfCtrl', // Adobe PDF reader 6 and earlier, brrr
                    'QuickTime.QuickTime', // QuickTime
                    // 5 versions of real players
                    'rmocx.RealPlayer G2 Control',
                    'rmocx.RealPlayer G2 Control.1',
                    'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)',
                    'RealVideo.RealVideo(tm) ActiveX Control (32-bit)',
                    'RealPlayer',
                    'SWCtl.SWCtl', // ShockWave player
                    'WMPlayer.OCX', // Windows media player
                    'AgControl.AgControl', // Silverlight
                    'Skype.Detection'];

                // starting to detect plugins in IE
                return this.map(names, function(name){
                    try{
                        new ActiveXObject(name);
                        return name;
                    } catch(e){
                        return null;
                    }
                }).join(';');
            } else {
                return ""; // behavior prior version 0.5.0, not breaking backwards compat.
            }
        },

        getScreenResolution: function () {
            return [screen.height, screen.width];
        },

        getCanvasFingerprint: function () {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            // https://www.browserleaks.com/canvas#how-does-it-work
            var txt = 'http://valve.github.io';
            ctx.textBaseline = "top";
            ctx.font = "14px 'Arial'";
            ctx.textBaseline = "alphabetic";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125,1,62,20);
            ctx.fillStyle = "#069";
            ctx.fillText(txt, 2, 15);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.fillText(txt, 4, 17);
            return canvas.toDataURL();
        }
    };


    return Fingerprint;

});

(function(win, doc, enc) {
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
            if (-1 === ",com,net,org,gov,edu,info,name,int,mil,arpa,asia,biz,pro,coop,aero,museum,ac,ad,ae,af,ag,ai,al,am,an,ao,aq,ar,as,at,au,aw,az,ba,bb,bd,be,bf,bg,bh,bi,bj,bm,bn,bo,br,bs,bt,bv,bw,by,bz,ca,cc,cf,cg,ch,ci,ck,cl,cm,cn,co,cq,cr,cu,cv,cx,cy,cz,de,dj,dk,dm,do,dz,ec,ee,eg,eh,es,et,ev,fi,fj,fk,fm,fo,fr,ga,gb,gd,ge,gf,gh,gi,gl,gm,gn,gp,gr,gt,gu,gw,gy,hk,hm,hn,hr,ht,hu,id,ie,il,in,io,iq,ir,is,it,jm,jo,jp,ke,kg,kh,ki,km,kn,kp,kr,kw,ky,kz,la,lb,lc,li,lk,lr,ls,lt,lu,lv,ly,ma,mc,md,me,mg,mh,ml,mm,mn,mo,mp,mq,mr,ms,mt,mv,mw,mx,my,mz,na,nc,ne,nf,ng,ni,nl,no,np,nr,nt,nu,nz,om,pa,pe,pf,pg,ph,pk,pl,pm,pn,pr,pt,pw,py,qa,re,ro,ru,rw,sa,sb,sc,sd,se,sg,sh,si,sj,sk,sl,sm,sn,so,sr,st,su,sy,sz,tc,td,tf,tg,th,tj,tk,tm,tn,to,tp,tr,tt,tv,tw,tz,ua,ug,uk,us,uy,va,vc,ve,vg,vn,vu,wf,ws,ye,yu,za,zm,zr,zw,".indexOf("," + a[e] + ",")) {
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
            if (this[a][0] == e) {
                return this[a][1];
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

    /*
     * 延迟发送cookie Mapping
     * */
    if(!_py.getLast("mapping")){
        var f = "setTimeout(function() {var f=document;e = f.createElement('iframe');e.src='" + ("http:" != location.protocol ? "https://cm.ipinyou.com/cmas.html" : "http://cm.ipinyou.com/cma.html") + "';f.body.insertBefore(e,f.body.firstChild);e.style.display='none';}, 5000)";
    }
    var personId = new Fingerprint({
        canvas: true
    }).get() + "-" + new Fingerprint({
        ie_activex: true
    }).get() + "-" + new Fingerprint({
        canvas: false
    }).get() + "-" + new Fingerprint({
        screen_resolution: true
    }).get();


    var p = location.href, q = doc.referrer,e,pi,id;
    win.parent != win && (p = q, q = "");
    p && _py.push([ "u", p ]);
    q && _py.push([ "r", q ]);
    var u = _py.getLast('urlParam') || "pyck",d = ipy.getQueryString(u);
    d = d ? d:ipy.getInfo("ipycookie");
    ipy.setInfo('ipycookie',d);
    d && _py.push([ "c", d ]);
    s = _py.getLast("domain");
    e= _py.getLast("e");
    if (e != '' && e) {
        e='e='+_py.getLast("e")+"&p="+personId;
    }else{
        e='p='+personId;
    };
    //pi 用于商品库对接
    pi = ipy.itemInfo(_py.getLast("pi"));
    p = ("https:" == location.protocol ? "https" : "http") + "://" + s + "/adv?" + _py.serialize() +ipy.getSession()+"&pi="+enc(pi)+"&p="+enc(ipy.getP())+"&e="+enc(e)+"&rd=" + new Date().getTime();
    q = doc.createElement("iframe");
    q.src = "javascript:false;";
    q.style.display = "none";
    _py.push = function(data){
        setConver(data);
    }
    function setConver(arg){

        var str = "";
        for(var i in arg){
            str += "&"+i+"="+arg[i];
        }
        var url = ("https:" == location.protocol ? "https" : "http") + "://" + s + "/cvt?c="+personId+str;
        new Image().src = url;
    }
    function adv(){
        if (doc.body) {
            doc.body.insertBefore(q, doc.body.firstChild);
            try {
                c = q.contentWindow.document, c.write('<!doctype html><html><body onload="' + f + '"><script src="' + p + '"></script></body></html>'),
                    c.close();
            } catch (b) {
                q.contentWindow.location.replace('javascript:void((function(){document.write("<!doctype html><html><body onload=\\"' + f + "\\\"><script>document.domain='" + document.domain + "';var s=document.createElement('script');document.body.insertBefore(s,document.body.firstChild);win.src='" + p + "';</script></body></html>\");document.close()})());");
            }
        } else {
            setTimeout(adv, 50);
        }
    }
    setTimeout(adv,10);
})(window, document, encodeURIComponent);