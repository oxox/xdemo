/**
 * 截屏
 */
;
(function() {
	var m = {
		imgType: 'png',
		exportImgType: 'image/png',
		quality: 100,
		scrollBarX: 17,
		scrollBarY: 17,
		canvas: document.createElement("canvas")
	}
	/**
	 * 事件监听
	 */
	var addMessageListener = function() {
		console.info('addMessageListener init');
		chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
			// console.info(request, sender, sendResponse)
			var data = request;
			switch (data.msg) {
				case "capture_selected":
					captureSelected(data);
					break;
				case "capture_window":
					captureWindow(data);
					break;
				case "capture_area":
					captureSelectionArea(data);
					break;
				case "capture_webpage":
					captureWebpage(data);
					break
			}
		})
	};

	/**
	 * 发送一个消息到选中的标签页内的content js
	 * @param request 响应的JSON对象
	 * @param callback 回调函数
	 */
	var sendMessage = function(request, callback) {
		//获取特定窗口指定的标签,null为当前窗口
		chrome.tabs.getSelected(null,
			function(tab) {
				// http://open.chrome.360.cn/html/dev_tabs.html#method-sendRequest
				chrome.tabs.sendRequest(tab.id, request, callback)
			})
	};

	/**
	 * 截取选定的区域
	 */
	var captureSelectionArea = function(data) {

	};

	/**
	 * 截取选中区域
	 * @param data
	 */
	var captureSelected = function(data) {
		chrome.tabs.captureVisibleTab(null, {
			format: m.imgType,
			quality: m.quality
		}, function(dataUrl) {
			var img = new Image();
			img.onload = function() {
				m.canvas.width = data.width;
				m.canvas.height = data.height;
				//canvas 生成图片
				var ctx = m.canvas.getContext("2d");
				//Y从顶部开始截取，在content.js中确保截取点在屏幕最上方
				ctx.drawImage(img, data.x, 0, data.width, data.height, 0, 0, data.width, data.height);
				var selectedImgData = m.canvas.toDataURL(m.exportImgType);
				sendMessage({
					msg: data.msg,
					imgdata: selectedImgData,
					status: 'success',
					data: data
				})

			}
			img.src = dataUrl;

		});
	}

	var init = function() {
		addMessageListener();
	}
	init();
})()


chrome.tabs.onActivated.addListener(function(data) {
	chrome.tabs.get(data.tabId, function(tab) {

		var domain = UrlRegEx(tab.url)[2];

		if (localStorage.getItem("xDemoLength") !== null) {
			var num = 0;
			var xDemoLength = parseInt(localStorage.getItem("xDemoLength"));
			console.log(xDemoLength);
			for (var i = 1; i <= xDemoLength; i++) {

				if (localStorage.getItem("xDemo_" + i) !== null) {
					var getXdemoItem = JSON.parse(localStorage.getItem("xDemo_" + i));
					console.log(getXdemoItem);
					var xDemoMatches = getXdemoItem.xDemoMatches;
					var domain = UrlRegEx(tab.url)[2];

					for (var j = 0; j < xDemoMatches.length; j++) {
						var _domain = UrlRegEx(xDemoMatches[j])[2];
						console.log(xDemoMatches[j]);

						if (domainMatch(domain, _domain)) {
							num++;
							break;
						}
					}
				} else {
					continue;
				}
			}
			if (num !== 0) {
				chrome.browserAction.setBadgeText({
					text: num.toString()
				})
			} else {
				chrome.browserAction.setBadgeText({
					text: ''
				})
			}
		}

	});

})



chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	console.log('tttt');
	// 判断页面是否加载完毕
	if (changeInfo.status == "complete") {
		var domain = UrlRegEx(tab.url)[2];

		if (localStorage.getItem("xDemoLength") !== null) {
			var xDemoLength = parseInt(localStorage.getItem("xDemoLength"));
			console.log(xDemoLength);
			num = 0;
			for (var i = 1; i <= xDemoLength; i++) {

				if (localStorage.getItem("xDemo_" + i) !== null) {
					var getXdemoItem = JSON.parse(localStorage.getItem("xDemo_" + i));
					console.log(getXdemoItem);
					var xDemoJs = getXdemoItem.xDemoJs,
						xDemoCss = getXdemoItem.xDemoCss,
						xDemoName = getXdemoItem.xDemoName,
						xDemoMatches = getXdemoItem.xDemoMatches,
						xDemoStatus = getXdemoItem.xDemoStatus;
					var domain = UrlRegEx(tab.url)[2];

					var flag = 0;

					for (var j = 0; j < xDemoMatches.length; j++) {
						var _domain = UrlRegEx(xDemoMatches[j])[2];
						console.log(xDemoMatches[j]);


						// 判断demo状态是否打开，及域名是否匹配
						if (xDemoStatus == "on" && domainMatch(domain, _domain)) {
							flag = 1;
							break;
						}
					}
					console.log(flag);

					if (flag == 1) {
						if (xDemoStatus == "on" && domainMatch(domain, _domain)) {


							//嵌入样式的函数
							var includeLinkFunction = 'function includeLinkStyle(url) {var link = document.createElement("link");link.rel = "stylesheet";link.type = "text/css";link.href = url;document.getElementsByTagName("head")[0].appendChild(link);};';
							var cssLink = '';
							for (var j in xDemoCss) {
								cssLink += 'includeLinkStyle("' + xDemoCss[j] + '?t=' + Date.parse(new Date()) + '");';
							}
							var cssRequest = includeLinkFunction + cssLink;

							//嵌入脚本的函数script.async = "async";script.defer = "defer";
							var includeScriprtFunction = 'function includeScriprt(url){var script = document.createElement("script");script.type="text/javascript";script.src = url;document.getElementsByTagName("body")[0].appendChild(script);};'

							var jsLink = '';
							for (var k in xDemoJs) {
								jsLink += 'includeScriprt("' + xDemoJs[k] + '?t=' + Date.parse(new Date()) + '");';
							}
							var jsRequest = includeScriprtFunction + jsLink;

							//注入当前页面，并执行        
							var code = cssRequest + ';' + jsRequest;
							chrome.tabs.executeScript(null, {
								code: code
							});
							num++;
						}

					}

				} else {
					continue;
				}
			}
			console.log(num);
			if (num !== 0) {
				chrome.browserAction.setBadgeText({
					text: num.toString()
				})
			} else {
				chrome.browserAction.setBadgeText({
					text: ''
				})
			}
		}
	}


});



// chrome.browserAction.onClicked.addListener(function() {
// 	chrome.tabs.create({
// 		"url": "option.html"
// 	})
// });



/**
 * URL解析
 */
function UrlRegEx(urlt) {
	//如果加上/g参数，那么只返回$0匹配。也就是说arr.length = 0   
	var re = /(\w+):\/\/([^\:|\/]+)(\:\d*)?(.*\/)([^#|\?|\n]+)?(#.*)?(\?.*)?/gi;
	var arr = re.exec(urlt);
	//var arr = urlt.match(re);   
	return arr;

}



/**
 * 域名匹配
 */
function domainMatch(domain, _domain) {
	var arr = domain.split('.');
	var _arr = _domain.split('.');
	var flag = 0;
	if (arr.length == _arr.length) {
		for (var i = arr.length - 1; i >= 0; i--) {
			if (arr[i] == _arr[i]) {
				flag = 1;
				continue;
			} else if (_arr[i] == "*") {
				flag = 1;
				continue;
			} else {
				return false;
				break;
			}
		}
	} else if (arr.length == 2 && arr[0] == _arr[1]) {
		flag = 1;
	} else {
		return false;
	}
	if (flag == 1) {
		return true;
	}

}