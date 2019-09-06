# 品友微信小程序 SDK

## 参考资料

- [阿拉丁](http://doc.aldwx.com/aldwx/gao-ji-gong-neng/sdkjie-ru-zhi-nan.html)
- [神策数据](https://www.sensorsdata.cn/manual/mp_sdk_new.html)

## 新收集参数

- 微信 app 启动后生成的 uuid，用于比较识别多个请求是一用户(参数缩写 uid)
- 微信的 openid、unionid，需对方技术配合(参数缩写 oi、uni)

## 安装方法

1. 引入 SDK 代码

   从 github 下载小程序 SDK（py-stat.min.js），放入小程序项目的 utils 文件夹中

2. 引入并配置参数

   在 app.js 中通过 require() 引入文件，调用 init() 方法设置初始化参数

   ```
     const py= require('./utils/py-stat.min.js');

     py.init({a:"广告主ID"});
   ```

   > 注意：必须在 require() 之后，立即调用 init() 方法设置,广告主 ID 是必填项

   ***

   在获取 openId 的回调中上传 openId

   ```
   wx.login({
     success : function(res){
       wx.request({
         url : "",
         data : {
           jscode : res.code
         },
         success : function(res){
           // .....业务代码
           py.setOpenid("请传入获取的openid"); //调用上传openid
         }
       })
     }
   })

   ```
   
   在获取 unionId 后上传 unionId
   ```
   py.setUnionid("请传入获取的unionId"); //调用上传unionId
   ```

3. 自定义事件

   在触发函数中添加相应的数据收集，以<a href="#事件介绍">事件介绍</a>中"加入购物车"为例

   ```
   var app = getApp();
   Page({
       onLoad(){},
       onShow(){},
       //加入购物车
       addCart:function(){
         // 加入自定义事件
         app.globalData.py("event", "addCart",{
           "id":"111222333",
           "money":"90.00",
           ...其它参数
         })
       }
   })
   ```

4. 添加品友域名到小程序 request 合法域名中

   管理员或开发者身份在微信小程序后台 → 设置 → 开发者设置中添加 request 合法域名

## 检查方法

1. 在小程序开发编辑器中，查看控制台中的 Network 是否有*adv?a*开头的请求发送给*https://stats.ipinyou.com*

2. 检查广告主 Id 是否正确

3. 检查添加的自定义事件简写是否携带在参数中

## 微信基础库版本

> 2.6.6 及以上

## 事件介绍

| 事件名称      | 事件缩写 | 事件介绍            | 备注                                                                                                                                                                |
| :------------ | :------- | :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| viewHome      | vh       | 首页查看            |
| viewList      | vl       | 分类列表页查看      |
| viewItem      | vi       | 单品页查看 API 对接 |
| viewSearch    | vs       | 搜索关键词信息      |
| viewActivity  | va       | 访问活动页          |
| viewChannel   | vn       | 访问频道页          |
| viewUserIndex | vu       | 访问用户中心        |
| viewCart      | vc       | 购物车查看          | 金额对应 Money 字段<br>订单信息对应 ProductList 字段                                                                                                                |
| collect       | cl       | 收藏                |
| addCart       | ad       | 添加购物车          |
| order         | od       | 订单提交            | id：订单编号对应 OrderNo 字段<br>金额对应 Money 字段<br>订单信息对应 ProductList 字段，规则：<br>商品 1ID,商品 1 数量,商品 1 价格;商品 2ID,商品 2 数量,商品 2 价格; |
| purchase      | pch      | 支付成功            | id：订单编号对应 OrderNo 字段<br>金额对应 Money 字段<br>订单信息对应 ProductList 字段，规则：<br>商品 1ID,商品 1 数量,商品 1 价格;商品 2ID,商品 2 数量,商品 2 价格; |
| consult       | co       | 在线咨询            |
| message       | msg      | 在线留言            |
| statistics    | sts      | 统计                |
| register      | rg       | 注册                | id：注册用户 ID 对应 OrderNo 字段<br>data：注册信息，JSON 格式，对应 Productlist 字段                                                                               |
| leads         | ls       |                     | id：LeadsID 对应 OrderNo 字段<br>data：Leads 信息，JSON 格式，对应 Productlist 字段                                                                                 |
| appShow       | as       | 小程序启动          |
| appHide       | ah       | 小程序切换到后台    |
| appLauch      | al       | 小程序加载          |
| appPage       | ap       | 小程序页面跳转      |
