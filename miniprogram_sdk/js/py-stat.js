/*
 * 5.0.0 初始化微信小程序sdk
 * 5.0.1 支持mpyck用于打通dmp点击数据
 * 5.0.2 支持unionid收集
 * 5.0.3 解决发起转化请求时 isObject方法和merge方法的报错
 * 5.0.4 setConfig方法支持设置domain
 * 5.0.5 修复unionId属性问题 设置domain问题修复
 * @version 5.0.5
 * */
var config = {
  name: "py",
  domain: "stats.ipinyou.com",
  uuid: getUUID(),
  openid: "",
  unionid: "",
  a: "",//广告主公司ID
  dev: false,//是否开发模式
  listener: {
    $onAppShow: {
      state: true,
      data: {}
    },
    $onAppHide: {
      state: true,
      data: {}
    },
    $onLaunch: {
      state: true,
      data: {}
    },
    $onPage: {
      state: true,
      data: {}
    }
  },
  url: "",
  reffer: "",
  pyuuid: "",//记录用于设备打通的
  pyck: "",
  mpyck: "",
  historys: [],
  userInfo: {}
}

const event = {
  appShow: "appShow",
  appHide: "appHide",
  appLauch: "appLauch",
  appPage: "appPage",
}

exports.init = (options = {}) => {
  const { a } = options;
  log(wx);
  if (a) {
    config.a = a;
  } else {
    error("需要指定广告主ID");
  }

  setTimeout(() => {
    //注册全局监听事件
    initGlobalListener();
    //在app对象中注册全局变量
    initGlobalParam();
  }, 0)
}

exports.setConfig = (options) => {
  config.name = options.name || "py";
  config.a = options.a || config.a;
  config.domain = options.domain || config.domain;
  config.listener.$onAppShow.state = options.$onAppShow || true;
  config.listener.$onAppHide.state = options.$onAppHide || true;
  config.listener.$onLaunch.state = options.$onLaunch || true;
  config.listener.$onPage.state = options.$onPage || true;
}
//设置openid
exports.setOpenid = (openid) => {
  config.openid = openid;
  py("event", "openId");
}
//设置unionid
exports.setUnionid = (unionid) => {
  config.unionid = unionid;
  py("event", "unionId");
}


//设置自动收集监听器参数
exports.appendAppLaunchData = (data) => {
  config.listener.$onLaunch.data = Object.assign(config.listener.$onLaunch.data, data);
}
exports.appendAppShowData = (data) => {
  config.listener.$onAppShow.data = Object.assign(config.listener.$onAppShow.data, data);
}
exports.appendAppHideData = (data) => {
  config.listener.$onAppHide.data = Object.assign(config.listener.$onAppHide.data, data);
}
exports.appendAppPageData = (data) => {
  config.listener.$onPage.data = Object.assign(config.listener.$onPage.data, data);
}
//初始化用户信息
exports.setUserInfo = (data) => {
  config.userInfo = data;
}
//用户信息赋值
exports.appendUserInfo = (data) => {
  config.userInfo = Object.assign(config.userInfo, data);
}

const py = (...args) => {
  execute(args);
}

function initGlobalListener() {
  //监测小程序初次加载
  if (config.listener.$onLaunch.state) {
    let data = {};
    if (wx.getLaunchOptionsSync) {
      let launch = wx.getLaunchOptionsSync();
      data = Object.assign(launch, config.listener.$onLaunch.data);
    }
    py("event", event.appLauch, data);
  }
  //监测打开小程序
  if (config.listener.$onAppShow.state) {
    wx.onAppShow((option) => {
      log("show");
      log(option);
      clearRecord();
      let data = Object.assign(option, config.listener.$onAppShow.data);
      py("event", event.appShow, data);
    })
  }
  //监测关闭小程序
  if (config.listener.$onAppHide.state) {
    wx.onAppHide((option) => {
      log("hide");
      log(option);
      let data = Object.assign(option, config.listener.$onAppHide.data);
      py("event", event.appHide, data);
    })
  }
  //监测页面跳转
  if (config.listener.$onPage.state) {
    wx.onAppRoute((option) => {
      log("page");
      log(option);
      setRecord(option);
      let data = Object.assign(option, config.listener.$onPage.data);
      py("event", event.appPage, data);
    })
  }
}

function initGlobalParam() {
  let app = getApp();
  app.globalData[config.name] = py;
  log(app);
}

function clearRecord() {
  config.historys = [];
  config.url = "";
  config.reffer = "";
}
function setRecord(option) {
  let url = joinUrl(option.path, option.query);
  let { pyuuid, pyck, mpyck } = option.query;
  config.url = url;
  config.pyuuid = pyuuid;
  config.pyck = pyck;
  config.mpyck = mpyck;
  if (config.historys.length > 0) {
    config.reffer = config.historys[config.historys.length - 1].url;
  }
  let history = option;
  history.url = url;
  config.historys.push(history);
}
function joinUrl(path, data) {
  let url = '';
  let query = [];
  Object.keys(data).forEach((key) => {
    query.push(key + "=" + data[key]);
  });
  if (query.length > 0) {
    url = path + "?" + query.join("&");
  } else {
    url = path;
  }
  return url;
}

const objTypeArg = /\[object (Boolean|Number|String|Function|Array|Date|RegExp)\]/,
  //C判断对象类型字符串,如为null返回'null',
  objTypeString = function (obj) {
    if (null == obj) return String(obj);
    let arr = objTypeArg.exec(Object.prototype.toString.call(Object(obj)));
    return arr ? arr[1].toLowerCase() : "object"
  },
  // 判断对象
  isObject = function (obj) {
    if (objTypeString(obj) === "object" && !isEmptyObject(obj)){
      return true;
    }else{
      return false;
    }
  },
  isEmptyObject = function (obj) {
    let name;
    for (name in obj) {
      return false;
    }
    return true;
  },
  log = function (message) {//日志输出方法
    config.dev && console && console.log && console.log(message)
  },
  warn = function (message) {
    config.dev && console && console.warn && console.warn(message)
  },
  error = function (message) {
    config.dev && console && console.error && console.error(message)
  },
  _prop = function (name, shortName, required) {
    this.name = name;//属性名称
    this.shortName = shortName;//属性缩写
    this.required = required;//必填
  },
  _object = function () {
    this.keys = [];//属性的key值，顺序有特别含义
    this.props = {};
    this.values = {};
  };
_object.prototype.addProp = function (name, shortName) {
  this.keys.push(name);
  this.props[":" + name] = new _prop(name, shortName);
},
  _object.prototype.hasKey = function (key) {
    for (let i = 0; i < this.keys.length; i++) {
      if (key == this.keys[i]) return true;
    }
    return false;
  },
  _object.prototype.set = function (key, value) {//同名的key值会覆盖设置内容
    if (this.hasKey(key)) {
      let v = this.get(key);
      isObject(value) ? this.values[":" + key] = extend(v, value) : this.values[":" + key] = value;
    } else {
      this.addProp(key, key);
      this.values[":" + key] = value;
    }
  },
  _object.prototype.get = function (key) {//返回的是_prop对象
    return this.values[":" + key]
  },
  _object.prototype.merge = function (obj) {
    Object.keys(obj).forEach(key => {
      // if(key != "query"){
      this.set(key, obj[key]);
      // }
    })
  },
  _object.prototype.clear = function (obj) {//清除对象的值
    this.values = {};
  },
  _object.prototype.toObject = function () {
    let obj = {};
    for (let i = 0; i < this.keys.length; i++) {
      let key = this.keys[i];
      let value = this.get(key);
      let shortName = this.props[":" + key].shortName;
      if (void 0 != value) obj[shortName] = value;
    }
    return obj;
  };
const _eventObject = function (name, shortName) {
  this.prop = new _prop(name, shortName);
  this.obj = new _object;
};
_eventObject.prototype.addProps = function (propArray) {
  for (let i = 0; i < propArray.length; i++) {
    let prop = propArray[i];
    this.obj.addProp(prop[0], prop[1]);//内部设置使用，保证不会出现设置错误
  }
  return this;
};
_eventObject.prototype.addProp = function (name, shortName, required) {
  this.obj.addProp(name, shortName, required);
  return this;
};
_eventObject.prototype.get = function (key) {
  return this.obj.get(key);
};
const browserInfo = {},//获取浏览器信息
  eventInfo = {};
eventInfo["domain"] = new _eventObject("domain", "d").addProps([["domain", "d"]]);//不会传递后台
eventInfo["mapping"] = new _eventObject("mapping", "mp").addProps([["mapping", "mp"]]);//不会传递后台
eventInfo["default"] = new _eventObject("default", "df").addProps([["events", "evs"]]);//不会传递后台
eventInfo["extend"] = new _eventObject("extend", "e").addProps([["extend", "e"]]);
eventInfo["user"] = new _eventObject("user", "ur").addProps([["id", "i", !0], ["name", "n"], ["cookieId", "ci"], ["email", "em"], ["type", "t"], ["category", "ca"]]);
eventInfo["clickParam"] = new _eventObject("clickParam", "cp").addProps([["clickParam", "cp"]]);//不会传递后台
eventInfo["site"] = new _eventObject("site", "st").addProps([["type", "t"], ["id", "i"], ["industry", "ind"]]);
//event事件
eventInfo["viewHome"] = new _eventObject("viewHome", "vh");
eventInfo["viewList"] = new _eventObject("viewList", "vl").addProps([["categoryPath", "cp", !0]]);
eventInfo["viewItem"] = new _eventObject("viewItem", "vi").addProps([["area", "aa"], ["android_brand_schema", "abs"], ["activity_content", "ac"], ["activity_end_time", "ae"], ["airplane_model", "am"], ["addr", "ar"], ["activity_start_time", "as"], ["android_shop_schema", "ass"], ["android_schema_url", "asu"], ["start_area", "str"], ["start_time", "stt"], ["activity_url", "au"], ["brand", "b"], ["business_area", "ba"], ["brand_id", "bi"], ["brand_logo", "bl"], ["brand_url", "bu"], ["category", "ca", !0], ["currency_code", "cc", !0], ["classify", "cf"], ["category_id", "cid"], ["category_path", "cp"], ["city", "cty"], ["country", "cy"], ["discount", "dc"], ["decoration", "de"], ["duration", "du"], ["extend", "e"], ["end_airport", "ea"], ["end_area", "er"], ["end_time", "et"], ["feature", "ft"], ["house_area", "ha"], ["house_mode", "hd"], ["has_meals", "hm"], ["house_type", "ht"], ["ios_brand_schema", "ibs"], ["ios_shop_schema", "iss"], ["ios_schema_url", "isu"], ["lbs", "lb"], ["mobile_activity_url", "ma"], ["mobile_brand_logo", "mbl"], ["mobile_brand_url", "mbu"], ["mobile_pic_height", "mh"], ["mobile_pic_ratio", "mm"], ["mobile_pc_pic_url", "mpu"], ["mobile_shop_logo", "msl"], ["mobile_shop_url", "msu"], ["mobile_pic_url", "mu"], ["mobile_pic_width", "mw"], ["name", "n"], ["off_time", "oft"], ["orig_price", "op"], ["on_time", "ot"], ["pic_height", "ph"], ["punctuality_ratio", "pl"], ["promotion", "pm"], ["product_no", "pn"], ["pc_pic_url", "ppu"], ["price", "pr", !0], ["pic_ratio", "pt"], ["product_url", "pu", !0], ["pic_width", "pw"], ["removed", "rm"], ["short_desc", "sd"], ["score", "se"], ["spu_id", "si"], ["shop_logo", "sl"], ["short_name", "sm"], ["shop_name", "sn"], ["sold_out", "so"], ["shop_id", "sp"], ["start_airport", "sta"], ["shop_url", "su"], ["star_level", "sv"], ["seat_type", "sy"], ["total_price", "tl"], ["type", "t"], ["mobile_product_url", "wap"], ["mobile_pic_size", "ms"], ["pic_size", "pis"]]);
eventInfo["viewSearch"] = new _eventObject("viewSearch", "vs").addProps([["keywords", "k", !0]]);
eventInfo["viewActivity"] = new _eventObject("viewActivity", "va").addProps([["name", "n"]]);
eventInfo["viewChannel"] = new _eventObject("viewChannel", "vn").addProps([["name", "n"]]);
eventInfo["viewUserIndex"] = new _eventObject("viewUserIndex", "vu").addProps([["userId", "ui"]]);
eventInfo["viewCart"] = new _eventObject("viewCart", "vc").addProps([["money", "m"], ["id", "i"], ["count", "ct"], ["price", "pr"]]);
eventInfo["viewPage"] = new _eventObject("viewPage", "vg").addProps([["page", "pg"]]);
eventInfo["collect"] = new _eventObject("collect", "cl").addProps([["id", "i"], ["trackId", "ti"]]);
eventInfo["order"] = new _eventObject("order", "od").addProps([["id", "i"], ["money", "m"], ["items", "it"], ["count", "ct"], ["price", "pr"], ["trackId", "ti"]]);
eventInfo["addCart"] = new _eventObject("addCart", "ad").addProps([["id", "i"], ["trackId", "ti"]]);
eventInfo["register"] = new _eventObject("register", "rg").addProps([["id", "i"], ["name", "n"], ["email", "em"], ["type", "t"], ["data", "d"], ["trackId", "ti"]]);
eventInfo["leads"] = new _eventObject("leads", "ls").addProps([["id", "i"], ["name", "n"], ["email", "em"], ["type", "t"], ["data", "d"], ["trackId", "ti"]]);
eventInfo["custom"] = new _eventObject("custom", "cm").addProps([["id", "i"], ["customEvent", "ce"], ["data", "d"], ["trackId", "ti"]]);
eventInfo["consult"] = new _eventObject("consult", "co").addProps([["trackId", "ti"]]);
eventInfo["message"] = new _eventObject("message", "msg").addProps([["trackId", "ti"]]);
eventInfo["purchase"] = new _eventObject("purchase", "pch").addProps([["id", "i"], ["money", "m"], ["items", "it"], ["count", "ct"], ["price", "pr"], ["trackId", "ti"]]);
eventInfo["statistics"] = new _eventObject("statistics", "sts").addProps([["trackId", "ti"]]);
eventInfo["standingTime"] = new _eventObject("standingTime", "ste");
eventInfo["scrollEvent"] = new _eventObject("scrollEvent", "se");
eventInfo["appShow"] = new _eventObject("appShow", "as").addProps([["path", "path"]]);
eventInfo["appHide"] = new _eventObject("appHide", "ah").addProps([["path", "path"]]);
eventInfo["appLauch"] = new _eventObject("appLauch", "al").addProps([["path", "path"]]);
eventInfo["appPage"] = new _eventObject("appPage", "ap").addProps([["path", "path"]]);
eventInfo["openId"] = new _eventObject("openId", "oi").addProps([["path", "path"]]);
eventInfo["unionId"] = new _eventObject("unionId", "uni").addProps([["path", "path"]]);

// 对参数进行编码方法
const josEncode = (function () {
  "use strict"
  let dict = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-abcdefghijklmnopqrstuvwxyz_"

  //jos编码，将JS对象序列化为字符串
  function encode(obj) {
    if (void 0 == obj) obj = "";
    let typ = typeof (obj)
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
    let ret = dict.charAt(obj & 0x1f)
    let h = obj >>> 5
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
    let str = obj.toString()
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
    let isb64 = true
    for (let i = 0; i < obj.length; i++) {
      let c = obj.charCodeAt(i)
      //最常见64字符，大小写字母、点、下划线
      if (!(c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || c == 95 || c == 46)) {
        isb64 = false
        break
      }
    }
    if (isb64) {
      return dict.charAt(4) + encodeUint(obj.length) + obj.replace(/\./g, "-")
    }
    let ret = dict.charAt(5) + encodeUint(obj.length)
    for (let i = 0; i < obj.length; i++) {
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
    let fields = []
    for (let f in obj) {
      if (obj.hasOwnProperty(f)) {
        fields[fields.length] = f
      }
    }
    let ret = dict.charAt(6) + encodeUint(fields.length)
    for (let i in fields) {
      ret += (encodeString(fields[i]) + encode(obj[fields[i]]))
    }
    return ret
  }

  function encodeArray(obj) {
    let ret = dict.charAt(7) + encodeUint(obj.length)
    for (let i in obj) {
      ret += encode(obj[i])
    }
    return ret
  }

  return encode;
})();
const execute = function (arg) {
  try {
    if (arg && arg.length < 2) {/*log("参数不正确！");*/
      return;
    }
    let c = arg[0];
    if ("set" != c && "event" != c) {
      log("目前不支持此命令:" + c);
      return;
    }
    let eventName = arg[1], obj = eventInfo[eventName].obj, keys = obj.keys, urlType = "adv", ti;
    if ("event" == c) obj.clear();
    for (let i = 2; i < arg.length; i++) {
      let value = arg[i];
      if (i == arg.length - 1 && isObject(value)) {
        if (value.trackId) {

          arg.t = value.trackId;
          delete value.trackId;
        }
        obj.merge(value)
      } else {
        if (keys[i - 2] == "trackId" && value != "") {
          arg.t = value;
          continue;
        }
        if (keys.length > i - 2) {
          obj.set(keys[i - 2], value);
        } else {
          error("参数错误");
        }
      }
    }
    if ("event" == c) {
      if (arg.t) {
        ti = (objTypeString(arg.t) == "array" && arg.t.length > 0 && arg.t[0].length > 0) ? arg.t[0][0] : (objTypeString(arg.t) == "string" ? arg.t : "");
        if (ti != "") {//如果转化点id不为空，则为转化请求
          urlType = "cvt";
        }
      }
      //开始发送send请求
      const domain = eventInfo["domain"].get("domain"),
        ds = (void 0 == domain) ? [config.domain] : isArray(domain) ? domain : [domain],
        extend = eventInfo["extend"].get("extend"),
        // j = ipy.getJump();
        userInfo = eventInfo["user"].obj.toObject(),
        siteInfo = eventInfo["site"].obj.toObject(),
        pageInfo = {},
        eventParams = obj.toObject();
      // 设置当前的url和reffer
      pageInfo.u = config.url, pageInfo.r = config.reffer;
      for (let i = 0; i < ds.length; i++) {
        let adv = "https://" + ds[i] + "/" + urlType + "?a=" + config.a +  //a参数,广告主ID
          (void 0 != ti && "" != ti ? "&ti=" + ti : "") + //ti参数，转化点id
          (void 0 != config.pyuuid && "" != config.pyuuid ? "&pyuuid=" + config.pyuuid : "") + // pyuuid,用于设备打通
          (void 0 != config.pyck && "" != config.pyck ? "&c=" + config.pyck : "") + // pyck,用于打通dsp广告投放
          (void 0 != config.mpyck && "" != config.mpyck ? "&mc=" + config.mpyck : "") + // mpyck,用于打通dmp广告投放
          "&ev=" + eventInfo[eventName].prop.shortName + //ev参数，事件名称
          "&v=3" +//v参数
          "&oi=" + config.openid +
          "&uni=" + config.unionid +
          "&uid=" + config.uuid +
          (isEmptyObject(userInfo) ? "" : ("&" + eventInfo["user"].prop.shortName + "=" + josEncode(userInfo))) +//ur参数，用户信息
          (isEmptyObject(siteInfo) ? "" : ("&" + eventInfo["site"].prop.shortName + "=" + josEncode(siteInfo))) +//st参数，站点信息
          // "&_c="+_pykey_+//增加生成的第一方cookie和本地存储的key
          (isEmptyObject(browserInfo) ? "" : ("&b=" + josEncode(browserInfo))) +//b参数，终端信息
          (isEmptyObject(pageInfo) ? "" : ("&pg=" + josEncode(pageInfo))) +//p参数，页面信息
          (isEmptyObject(eventParams) ? "" : ("&ep=" + josEncode(eventParams))) +//ep参数，事件对应的参数信息
          ((void 0 == extend) ? "" : "&e=" + josEncode(extend)) +
          "&rd=" + (new Date()).getTime(); //rd参数，时间戳
        log(adv);//后台没有正式上线前，不直接发送请求过去
        request(adv, {});
      }
    }
  } catch (e) {
    error(e)
  }
}

function request(url, data) {
  wx.request({
    url: url,
    data: data
  });
}

function getUUID() {
  return 'py' + (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
