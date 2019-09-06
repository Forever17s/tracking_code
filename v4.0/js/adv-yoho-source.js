/*
 * @adv
 * @auther Hank
 * 4.0.0 去掉cm调用延迟
 * 4.0.1 反向cookiemapping调用
 * 4.0.2 解决remove属性在ie下不支持问题，使用removeChild方法
 * 4.0.3 增加cm请求后再发送一条监测请求，用于测试
 * 4.0.4 有货定制代码:获取user信息和监测购物车行为
 * 4.0.5 原addGood只针对有货，现做了判断
 * 4.0.6 1> 修改cm发送方式为非iframe，这样可以拿到refer，可以通过该条件过滤出访客收到的请求；
   		 2> 去掉曝光监测的代码，之前已经得出结论，没必要再保留；
         3> tanx平台的曝光监测，写死，每次PV都触发，用来与其他Exchange的数据校准；
 * 4.0.7 1> 修改cm发送方式为iframe,禁止拿到refer；
         2> 修改tanx校准请求的位置，使其发送访客请求之后立即发送tanx请求，无需等待访客返回后再发
 * 4.0.8 有货使用smart pixel方式调用访客代码
 * 4.0.9 因上品与有货使用了同一个脚本，针对广告主ID做了处理
 * 4.0.10 新版访客去掉send指令后，发布代码相关处理，如果没有任何event事件默认发只包含基础数据的访客
 * 4.0.11 添加extend的处理
 * 4.0.12 脚本加载完成直接执行，不push到队列,调整调用代码统一使用2.7.10版本的方式
 * 4.0.13 smart pixel的py命令增加clickParam命令
 * @version 4.0.13
 * */
(function (W,D) {
	try{
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
	    var a = _py.getLast("a"),p= _py.getLast("p"),pi= _py.getLast("pi"),pv= _py.getLast("pv"),e= _py.getLast("e"),d= _py.getLast("domain"),m= _py.getLast("mapping"),c=_py.getLast('urlParam');
		(function(w,d,s,l,a){
	        w._CommandName_=l;w[l]=w[l]||function(){(w[l].q=w[l].q||[]).push(arguments);
				w[l].track = function(){(w[l].q[w[l].q.length-1].t=[]).push(arguments)};return w[l]},
				w[l].a=a,w[l].l=1*new Date();
	        var c = d.createElement(s);c.async=1;
			//var f = 'https:' == d.location.protocol;
			//c.src=(f ? 'https' : 'http') + '://'+(f?'fm.ipinyou.com':'fm.p0y.cn')+'/j/t/a.js';
	        c.src='//fm.ipinyou.com/j/t/a.js';
	        var h = d.getElementsByTagName(s)[0];h.parentNode.insertBefore(c, h);
	    })(W,D,'script','py',a);
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
	        py("event","viewItem",_goodsDataPy);
        }else if(p!=null){
            py("event","viewItem",p)
        }else{
            py("event","viewPage");
        }
	}catch(e){}
})(window, document);