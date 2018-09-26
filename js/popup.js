
// 把背景页面传过来
var bg = chrome.extension.getBackgroundPage();
// 解析URL的函数
var UrlRegEx = bg.UrlRegEx;
// 解析域名的函数
var domainMatch = bg.domainMatch;
// 打开时候直接插入
var xOneDemo = bg.xOneDemo;
console.log(bg);

var popup = {
	tabId: 0,
	getDemos : function(){
		console.log('popupJs:popup:getDemos');
		chrome.tabs.query({currentWindow:true,active:true},function(tab){

			popup.tabId = tab[0].id;
			console.log('popupJs:popup:getDemos:tab[0]:'+tab[0].url);
			var domain = UrlRegEx(tab[0].url)[2];
			console.log("popupJs:popup:domain:"+domain);
			if(localStorage.getItem("xDemoLength") !==null){
				console.log('has xDemo in localStorage');
				var xDemoLength = parseInt(localStorage.getItem("xDemoLength"));
				console.log('xDemo Num:' + xDemoLength);
				var demoListHtml = '';
				for(var i = 1; i <=  xDemoLength; i++){

					if(localStorage.getItem("xDemo_"+i) !== null){
							var getXdemoItem = JSON.parse(localStorage.getItem("xDemo_"+i));
							var xDemoName = getXdemoItem.xDemoName,
									xDemoMatches = getXdemoItem.xDemoMatches,
									xDemoStatus = getXdemoItem.xDemoStatus;

							var domain = UrlRegEx(tab[0].url)[2];

							
							for(var j = 0; j < xDemoMatches.length; j++){

								var urlRegExResult = UrlRegEx(xDemoMatches[j]);
								var _domain = urlRegExResult && urlRegExResult[2];
								if(!_domain) {break;};
								console.log("domain:"+_domain);
								if(domainMatch(domain,_domain)){
										$('#demoList').append('<li>'+ xDemoName +' <div  class="make-switch switch-small" data-index="xDemo_'+i+'"><input type="checkbox"></div></li>');
										$('div[data-index="xDemo_' + i + '"]').bootstrapSwitch();

									if(xDemoStatus == "on"){
										$('div[data-index="xDemo_' + i + '"]').bootstrapSwitch('setState', true);
									}else{
										$('div[data-index="xDemo_' + i + '"]').bootstrapSwitch('setState', false);
									}
									
									break;
								}
							}
					}else{
						continue;
					}
				}
				popup.setStatus();
			}	
			if($('#demoList').html() == ''){
				console.log('none');
				$('#demoList').append('<li class="empty">当前页面没有可用的DEMO<br/>可进入插件设置界面添加</li>')
			}
		})
	},
	setStatus : function(){
		console.log('popupJs:setStatus:');
        $('#demoList .make-switch').on('switch-change', function (e, data) {
            console.log('clickOn trigger switch-change');
            var el = $(data.el).parent().parent();
            console.log("change Item:");
            console.log(el);
            var xDemoIndex = el.attr('data-index');
            var getXdemoItem = JSON.parse(localStorage.getItem(xDemoIndex));
            if(getXdemoItem.xDemoStatus == 'on'){
								getXdemoItem.xDemoStatus = 'off';
								// 保存更改
								localStorage.setItem(xDemoIndex,JSON.stringify(getXdemoItem));
								// 关闭的时候reload一次
								chrome.tabs.query({currentWindow:true,active:true},function(tab){
									chrome.tabs.reload(tab.id);
								});
            }else{
								getXdemoItem.xDemoStatus = 'on';
								// 打开的时候不需要reload直接插入
								console.log(popup.tabId);
								xOneDemo(xDemoIndex, popup.tabId);
								// 保存更改
								localStorage.setItem(xDemoIndex,JSON.stringify(getXdemoItem));

            }
						// localStorage.setItem(xDemoIndex,JSON.stringify(getXdemoItem));
        });


	},
	init : function(){
		this.getDemos();
	}
}
popup.init();
