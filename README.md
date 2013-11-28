XDEMO
=====

XDEMO（音译：“插DEMO”），用于向指定的页面注入远程脚本及样式，以达到改变页面元素，增强用户体验的效果。
开发XDEMO的初衷是为了方便将自己的想法落地到实际项目的页面上，方便其他角色体验。如果你有同样的需求，欢迎使用。


###使用

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
    "matches": ["http://*.51buy.com/*","http://127.0.0.1/","http://localhost/"]
}   
	
```

3.左侧菜单 我的DEMO 中可以查看、更新、编辑、删除、启用、停用DEMO，也可以将DEMO`提交至平台`

4.左侧菜单 DEMO平台 中可以获取其他提交的DEMO

5.在使用过程中如有问题或有任何建议，欢迎联系ReeQi ，[GitHub](https://github.com/simplelife7) ,[微博](http://weibo.com/u/1913890364)。^_^

6.感谢OXOX.IO团队成员对XDEMO的大力支持及宝贵意见！