/**
 * URL解析
 */
function UrlRegEx(urlt)   {      
    //如果加上/g参数，那么只返回$0匹配。也就是说arr.length = 0   
    var re = /(\w+):\/\/([^\:|\/]+)(\:\d*)?(.*\/)([^#|\?|\n]+)?(#.*)?(\?.*)?/gi;   
   	var arr = re.exec(urlt);   
    //var arr = urlt.match(re);   
    return arr;   
   
}

/**
 * 域名匹配
 */
function domainMatch(domain,_domain){
	var arr = domain.split('.');
	var _arr = _domain.split('.');
	var flag = 0;
	if(arr.length == _arr.length){
		for(var i = arr.length-1; i>=0 ; i-- ){
			if(arr[i] == _arr[i]){
				flag = 1;
				continue;
			}else if(_arr[i] == "*"){
				flag = 1;
				continue;
			}else{
				return false;
				break;
			}
		}		
	}else if(arr.length ==2 && arr[0] == _arr[1]){
		flag = 1;
	}
	else{
		return false;
	}
	if(flag == 1){
		return true;
	}

}


var popup = {
	getDemos : function(){
		console.log('eee');
		chrome.tabs.query({active:true},function(tab){

			console.log(tab[0].url);
			var domain = UrlRegEx(tab[0].url)[2];
			console.log(domain);
			if(localStorage.getItem("xDemoLength") !==null){
				console.log('tttttt');
				var xDemoLength = parseInt(localStorage.getItem("xDemoLength"));
				console.log(xDemoLength);
				var demoListHtml = '';
				for(var i = 1; i <=  xDemoLength; i++){

					if(localStorage.getItem("xDemo_"+i) !== null){
							var getXdemoItem = JSON.parse(localStorage.getItem("xDemo_"+i));
							var xDemoName = getXdemoItem.xDemoName,
									xDemoMatches = getXdemoItem.xDemoMatches,
									xDemoStatus = getXdemoItem.xDemoStatus;

							var domain = UrlRegEx(tab[0].url)[2];
							
							for(var j = 0; j < xDemoMatches.length; j++){
								var _domain = UrlRegEx(xDemoMatches[j])[2];
								console.log(xDemoMatches[j]);

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
		console.log('uuuu');
			$('#demoList .make-switch').on('switch-change', function (e, data) {
				console.log('ttttt');
				var el = $(data.el).parent().parent();
				console.log(el);
				var xDemoIndex = el.attr('data-index');
				var getXdemoItem = JSON.parse(localStorage.getItem(xDemoIndex));
				if(getXdemoItem.xDemoStatus == 'on'){
					getXdemoItem.xDemoStatus = 'off';
				}else{
					getXdemoItem.xDemoStatus = 'on';
				}
				localStorage.setItem(xDemoIndex,JSON.stringify(getXdemoItem));				
			});	


	},
	init : function(){
		this.getDemos();
	}
}
popup.init();