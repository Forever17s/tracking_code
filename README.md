# 访客代码
品友部署到广告主页面的代码，用于统计到达，访客收集，商品信息收集，线索收集等功能。

# 项目的目录结构
* miniprogram_sdk -微信小程序sdk实现
* v2.0 -最初版本的访客代码，绝大部分已使用smart pixel部署，参考4.0
    * cm  -cookie mapping
* v3.0 -2014的版本，目前几乎没有广告主使用过
* v4.0 -最近版本访客代码实现
    * doc -说明文档目录
    * js -访客代码实现脚本目录
        * adv-source.js -adv.4.0代码，当前是4.1，基于2.0代码改进
        * adv-vip-source.js -为唯品会定制代码
        * adv-yoho-source.js -有货定制代码
        * py-airbnb-source.js -Airbnb特别处理代码，为了能安全审核能正常通过
        * py-analysis-source.js -smart pxiel,v4.2.x版本实现，参数使用v2请求逻辑发出
        * py-analysis-source-4.3.js -smart pxiel,v4.3.x版本实现，参数兼容v2,支持v3参数请求逻辑发出，后续主要维护此版本
        * py-analysis-source-public.js -提交给阿里云进行安全审核的源代码,去掉了执行后台配置代码的逻辑
        * selector.js 目前无用
    * json -gulp压缩使用
    * test -测试访客代码页面
    * gulpfile -用于访客代码压缩
# 项目文档
如下二个文档涵盖了所有访客实现和调用说明
* [smart pxiel各事件详细说明](./v4.0/doc/基础信息表v1.4.xlsx)
* [smart pxielV3访客参数规划](./v4.0/doc/V3访客参数规划.xlsx)

# 部署前压缩
1. 进入v4.0目录
2. 执行gulp    

# 服务器部署
* ip:192.168.153.11
* 目录位置:/data/nginx/html/sites/fm.p0y.cn/j/
* 各版本备份目录:/data/nginx/html/sites/fm.p0y.cn/j/backup/
* 曾经测试目录位置:/data/nginx/html/sites/fm.p0y.cn/j/t/

# 上线流程
1. 首先得有服务器权限，sshkey登陆
2. 在备份目录存储当前版本，参考/data/nginx/html/sites/fm.p0y.cn/j/backup/目录中的文件
3. 覆盖服务器使用的脚本
4. cdn更新
   * 登陆地址：https://signin.aliyun.com/1119657216509898.onaliyun.com/login.htm
   * 用户名：front-end@1119657216509898.onaliyun.com
   * 密码：50b5dd
5. 更新地址：
   http://fm.p0y.cn/j/a.js
   https://fm.p0y.cn/j/a.js
   http://fm.ipinyou.com/j/a.js
   https://fm.ipinyou.com/j/a.js
   http://fm.userback.cn/j/a.js
   https://fm.userback.cn/j/a.js
   http://fm.p0y.cn/j/t/a.js
   https://fm.p0y.cn/j/t/a.js
   http://fm.ipinyou.com/j/t/a.js
   https://fm.ipinyou.com/j/t/a.js
   http://fm.userback.cn/j/t/a.js
   https://fm.userback.cn/j/t/a.js
6. 发送邮件通知，记录本次修改   