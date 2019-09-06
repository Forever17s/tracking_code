// 表单提交
// https://www.ibm.com/account/reg/cn-zh/signup?.*
!function(){
  var i = 0;
  var max = 10;
  var timer = setInterval(function(){
    try{
      if(py.$.selector("#signupForm") != null){
        addEvent();
        clearInterval(timer)
      }
      if(i < max){
        i++;
      }else{
        clearInterval(timer)
      }
    }catch(e){}
  },500)
  function addEvent(){
    try {
      py.$.addEvent(py.$.selector("#signupForm"), "submit", function () {
        var data = {};
        data.gbtid = py.gbtid;
        if (py.$.selector("#email") != null) {
          data.email = py.$.selector("#email").value;
        }
        if (py.$.selector("#firstName") != null) {
          data.firstName = py.$.selector("#firstName").value;
        }
        if (py.$.selector("#lastName") != null) {
          data.lastName = py.$.selector("#lastName").value;
        }
        if (py.$.selector("#company") != null) {
          data.company = py.$.selector("#company").value;
        }
        if (py.$.selector("#jobTitle") != null) {
          data.jobTitle = py.$.selector("#jobTitle").value;
        }
        if (py.$.selector("#select2-urxCountryId-container") != null) {
          data.region = py.$.selector("#select2-urxCountryId-container").value;
        }
        if (py.$.selector("#select2-state-container") != null) {
          data.city = py.$.selector("#select2-state-container").innerHTML;
        }
        if (py.$.selector("[name='Q_HELP']") != null) {
          data.help = py.$.selector("[name='Q_HELP']")[0].value;
        }
        if(py.$.selector("[name='phone-visiblePhone']").length != 0){
          data.tel = py.$.selector("[name='phone-visiblePhone']")[0].value;
        }
        py("event", "register", { "trackId": "Ass8T.qT.DK6Qf8V0ypMyEOguLajsXX", "data": data });
      })
    }catch(e){
    }
  }
}();

// 在线购买
// https://www.ibm.com/marketplace/purchase/configuration/zh/cn/checkout.*
try {
  py.$.addEvent(py.$.selector("#checkout_buyButton"), "click", function () {
    var data = {};
    data.gbtid = py.gbtid;
    data.editionID = location.search.split("&")[0].split("=")[1];
    py("event", "statistics", { "trackId": "Ass8T.QT.6GfJ8PSmu688_tmyWK4uxP", "data": data });
  })
} catch (e) {
}

// 联系IBM *
try {
  py.$.addEvent(py.$.selector(".cm-pill-container")[0], "click", function () {
    var data = {};
    data.gbtid = py.gbtid;
    py("event", "statistics", { "trackId": "Ass8T.GT.ZZclpRpPSkonDPtZN2XIJX" ,"data":data});
  })
} catch (e) {
}

// 播放视频 *
try{
  var doms = document.querySelectorAll('[data-videoid]');
  for(var i=0;i<doms.length;i++){
    py.$.addEvent(doms[i],"click",function(){
      var data = {};
      data.videoid = this.getAttribute("data-videoid");
      data.gbtid = py.gbtid;
      py("event", "statistics", { "trackId": "Ass8T.BT.3waDt1vTq2aws30N4dTN0X" ,"data":data});
    })
  }
} catch (e) {
}

// 监测a标签点击事件 *
try{
  var doms = document.getElementsByTagName('a');
  for(var i=0;i<doms.length;i++){
    py.$.addEvent(doms[i],"click",function(){
      try{
        var data = {};
        if(typeof this.href != "undefined"){
          data.url = this.href;
        }
        data.text = this.innerHTML;
        data.gbtid = py.gbtid;
        py("event", "statistics", { "trackId": "Ass8T.XT.wsAN0k6qUNQKRrNAPr6q50" ,"data":data});
      } catch (e) {
      }
    })
  }
} catch (e) {
}

// 全部页面
!function () {
  try {
    var d = [];
    if (digitalData != undefined) {
      if (digitalData.page != undefined) {
        if (digitalData.page.category != undefined) {
          if (digitalData.page.category.ibm != undefined) {
            var a = digitalData.page.category.ibm;
            if (a.gbt10 != undefined) {
              d.push({ "gbt10": a.gbt10, "globalBrandTableL10": a.globalBrandTableL10 })
            }
            if (a.gbt17 != undefined) {
              d.push({ "gbt17": a.gbt17, "globalBrandTableL17": a.globalBrandTableL17 })
            }
            if (a.gbt20 != undefined) {
              d.push({ "gbt20": a.gbt20, "globalBrandTableL20": a.globalBrandTableL20 })
            }
            if (a.gbt30 != undefined) {
              d.push({ "gbt30": a.gbt30, "globalBrandTableL30": a.globalBrandTableL30 })
            }
          }
        }
      }
    }
    function getCookie(cookie_name) {
      var allcookies = document.cookie;
      var cookie_pos = allcookies.indexOf(cookie_name);
      if (cookie_pos != -1) {
        cookie_pos = cookie_pos + cookie_name.length + 1;
        var cookie_end = allcookies.indexOf(";", cookie_pos);
        if (cookie_end == -1) {
          cookie_end = allcookies.length;
        }
        var value = unescape(allcookies.substring(cookie_pos, cookie_end));
      }
      return value;
    }
    var im = new Image();
    im.src="https://cm.ipinyou.com/xcms/ibmdmp/s.gif?tid=" + getCookie("optimizelyEndUserId");
    document.body.appendChild(im);
    py.gbtid=JSON.stringify(d);
    py("remove", "event", "viewPage");
    py("event", "viewPage", { "data": py.gbtid })
  } catch (e) { }
}();
