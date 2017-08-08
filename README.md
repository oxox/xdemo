XDEMO
=====

XDEMO（音译：“插DEMO”），用于向指定的页面注入远程脚本及样式，以达到改变页面元素，增强用户体验的效果。
开发XDEMO的初衷是为了方便将自己的想法落地到实际项目的页面上，方便其他角色体验。如果你有同样的需求，欢迎使用。


## 使用

1.点击左侧 新建DEMO 页卡，可手动按表单提示添加DEMO。

2.如果选择读取配置文件的方式添加DEMO，请按以下格式创建.JS文件放至远程服务器，再将此文件URL填入 自动读取框中。`（注释需全部删除）`

```javascript
{
    //DEMO名称
    "name": "oxox用于测试的oxox",

    //DEMO的英文ID
    "ename" : "ceshi", 

    //DEMO的作者
    "author" : "reeqiwu", 

    //DEMO版本号，如配置文件有更新，务必修改版本号。
    "version": "3.5",

    //DEMO的描述，可以填写用法或链接。
    "descrition" : "这是描述这是描述这是描述",

    //DEMO嵌入目标页面的CSS,如果没有,则为“[]”
    "css": ["http://127.0.0.1/a.css","http://127.0.0.1/b.css"], 

    //DEMO嵌入目标页面的CSS,如果没有,则为“[]”
    "js": ["http://127.0.0.1/c.js","http://127.0.0.1/d.js"], 

    //DEMO的作用域，支持多域名，域名请用斜杆结尾。
    "matches": ["http://*.oxox.com/*","http://127.0.0.1/","http://localhost/"]
}   
	
```

3.左侧菜单 我的DEMO 中可以查看、更新、编辑、删除、启用、停用DEMO，也可以将DEMO`提交至平台`

4.左侧菜单 DEMO平台 中可以获取其他提交的DEMO

5.在使用过程中如有问题或有任何建议，欢迎联系ReeQi ，[GitHub](https://github.com/simplelife7) ,[微博](http://weibo.com/u/1913890364)。 `^_^`

6.感谢OXOX团队成员对XDEMO的大力支持及宝贵意见！

## 文件说明
``` html
+ xdemo
    + css
        - bootstrap.css
        - bootstrap.min.css
        - github.css
        - pupup.css
        - rainbow-min.css
        - style.css
        - switch.css
    + fonts
        - 
    + img
    + js
        - background.js chrome插件必须，
        - bootstrap.js 
        - bootstrap.min.js 
        - bootstrap-switch.min.js 
        - content.js chrome插件必须，
        - generic.js rainbow通用语法匹配
        - getGroupList.json 从服务器上获取
        - getid.js 获取用户名
        - getList.json 从服务器上获取
        - javascript.js rainbow匹配javascript语法
        - jquery.min.js 
        - mustache.js 模版引擎
        - option.js 对应option.html
        - popup.js 对应popup.html
        - rainbow-min.js Rainbow is a code syntax highlighting library written in Javascript.
    - LICENSE
    - manifest.json 插件相关信息
    - option.html 插件设置页面
    - popup.html 页面右上角点击弹出的页面
    - README.md 
    - xdemo.crx 打包后
```

### background.js

    - 截屏？？？
    - onActivated 获取localStorage的内容
    - onUpdated 当标签更新时，此事件被触发。插入样式和js文件。
    - UrlRegEX url解析
    - domainMatch 域名匹配

### option.html

    - css
        - css/bottstrap.min.css
        - css/style.css
        - css/github.css
    - ui_s
    - ui_m
        - 新建DEMO
            - 手动添加
            - 自动添加
        - 我的DEMO
        - XDEMO平台
        - 关于
    - xdemo_edit_layer
    - myDemoTableTemplate
    - demoPlatformTemplate
    - groupItemTemplate
    - js
        - js/jquery.min.js
        - js/bootstrap.min.js
        - js/mustache.js 
        - js/rainbow-min.js
        - js/generic.js
        - js/javascript.js
        - js/option.js
        
### option.js

    - xdemoOption
        - manualCreateXdemoEvent //手工新建DEMO, 然后存入本地
        - autoLoadXdemoEvent //自动读取配置文件
            - ajax请求配置文件
            - 更新localStorage数据
        - getOptionList //我的DEMO列表 从localStorage读取然后渲染
        - xDemoListEvent // 列表里 更新、开关、删除、编辑、上传 在这里监听分发
        - uploadXdemoEvent // 上传DEMO
            - checkAuthor 
                - 从localStorage里拿用户名，如果没有就用传进来的用户名
                - 如果本地用户名与传进来的不符，则提示联系管理员
                - 否则拼装数据上传
                    - 存在就更新
                    - 不存在就新增
                      - 配置文件为空（属于手动建）
                      - 配置文件地址为他人提供
        - updateXdemoEvent //更新
            - 获取本地的demo信息
            - 看看是否有远程源，没有就不用更新啦
            - 有远程源，拉取对版本号，一致不更新，不一致则更新，并存入本地
        - editLayerCnt //编辑浮层内容
        - editXdemoEvent //编辑demo
            - 调用editLayerCnt
            - 监听提交按钮，提交时检测表单，更新
        - switchXdemoEvent //开关我的demo
        - delXdemoEvent 删除我的demo
        - navTab //点击左侧导航作出切换
        - getPlatformItem // DEMO平台中点击“获取”时填入本地
        - getPlatformList // 从远程读入demo列表
        - myDemoFilter // 我的DEMO，选择业务时刷新，过滤
        - demoListFilter // DEMO平台选择业务时刷新，过滤
        - setCommonGroup // 设置常用业务
        - getCommonGroup  // 填充常用业务
        - init // 初始化
    - UrlRegEx //url 解析
    - html_decode
    - xdemoOpiton.init

### popup.html
    - css
        - css/bottstrap.min.css
        - css/popup.css
        - css/switch.css
    - header
        - 插件设置
        - 关于
    - 当前生效demo list
    - demoPlatformTemplate
    - groupItemTemplate
    - js
        - js/jquery.min.js
        - js/bootstrap.min.js
        - js/mustache.js
        - js/bootstrap-switch.min.js
        - js/popup.js

### popup.js
    - UrlRegEX(urlt) //URL解析
    - domainMatch(domain, _domain) //域名匹配
    - popup
        - getDemos
            - chrome.tabs.query({active:true},function(tab){}) //即为向选中的 tab 发送消息,官方例子中的 getSelected 方法已经被废弃了
                - 读取本地数据，设置开关状态
                - 调用setStatus
        - setStatus //监听点击触发开关并保存到localstorage
        - init //入口调用getDemos
    - popup.init() //启动

