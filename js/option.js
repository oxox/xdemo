// 应用 ID，用来识别应用
var APP_ID = 'j347eTQ9RjXQMkPIo5VJRjTz-gzGzoHsz';

// 应用 Key，用来校验权限（Web 端可以配置安全域名来保护数据安全）
var APP_KEY = 'xPkM719XbnWeAkLOIHzdldxD';

// 初始化
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

var TestObject = AV.Object.extend('TestObject');
var testObject = new TestObject();
/*testObject.save({
  testabc: 'abc123'
}).then(function() {
  alert('LeanCloud works!');
}).catch(function(err) {
  alert('error:' + err);
});*/

var xdemoOption = {

	// 手动新建DEMO
	manualCreateXdemoEvent : function(){
			$('#newXdemoSumbit').click(function(e){
				e.preventDefault();
				if($('#inputNewXdemoName').val() =='' || $('#inputNewXdemoEname').val()==''|| $('#inputNewXdemoMatches').val() ==''){
					alert('请填写完整');
					return false;
				}
				if($('#createDemoGroup').val() == 0){
					alert('请选择DEMO所属的业务');
					return false;
				}

				// 验证URL
				var urlVerify1 = $('#inputNewXdemoMatches').val().match(/(https|http):\/\/.+/),
						urlVerify2 = $('#inputNewXdemoCss').val().match(/(https|http):\/\/.+/),
						urlVerify3 = $('#inputNewXdemoJs').val().match(/(https|http):\/\/.+/);

				if (urlVerify1 == null){
					alert('请输入正确的匹配地址'); 
					return false;
				}

				if($('#inputNewXdemoCss').val() !== ''){
					if (urlVerify2 == null){
						alert('请输入正确的CSS URL');
						return false;
					}
				}

				if($('#inputNewXdemoJs').val() !== ''){
					if (urlVerify3 == null){
						alert('请输入正确的JS URL');
						return false;
					}
				}


				var xDemoName = $('#inputNewXdemoName').val(),
						xDemoVer = '1.0',
						xDemoAuthor = '',
						xDemoCssObj = $('#inputNewXdemoCss').val().split('\n'),
						xDemoJsObj = $('#inputNewXdemoJs').val().split('\n'),
						xDemoMatches = $('#inputNewXdemoMatches').val().split('\n'),
						xDemoEname = $('#inputNewXdemoEname').val(),
						xDemoDes = $('#inputNewXdemoName').val(),
						xDemoGroup = $('#createDemoGroup').val(),
						xDemoLength = localStorage.getItem("xDemoLength") || 0;

				var xDemoData = {
						xDemoName : xDemoName,
						xDemoManifestFile : "",
						xDemoMatches : xDemoMatches,
						xDemoVersion : xDemoVer,
						xDemoCss : xDemoCssObj,
						xDemoJs : xDemoJsObj,
						xDemoEname : xDemoEname,
						xDemoDes : xDemoDes,
						xDemoGroup : xDemoGroup,
						xDemoAuthor :xDemoAuthor,
						xDemoStatus : 'on'
				}

				xDemoLength = parseInt(xDemoLength) + 1;
				localStorage.setItem("xDemoLength", xDemoLength);
				localStorage.setItem("xDemo_" + xDemoLength, JSON.stringify(xDemoData));

				alert('添加成功');
				window.location.reload();
			})		

	},


	// 自动读取配置文件
	autoLoadXdemoEvent : function(){
		$('#toLoadOption').click(function(e){
			e.preventDefault();
			if($('#autoLoadDemoGroup').val() == 0){
				alert('请选择DEMO所属的业务');
				return false;
			}			
			var optionFileUrl = $('#optionFileUrl').val();
			var urlVerify = optionFileUrl.match(/(https|http):\/\/.+/); 
			if (urlVerify == null){
				alert('请输入正确的配置文件URL'); 
				return false;
			}

			$.ajax({
				type: 'GET',
				url: optionFileUrl ,
				dataType: 'json',
				success: function(data){
					var xDemo = data;
					console.log(xDemo.name);
					$("#demoName").html(xDemo.name);
					$("#demoVer").html(xDemo.version);
					$("#demoAuthor").html(xDemo.author);

					$("#demoEname").html(xDemo.ename);
					$("#demoDes").html(xDemo.descrition);
					if(xDemo.group !== undefined){
						$("#demoGroup").html(xDemo.group);
					}else{
						xDemo.group = $('#autoLoadDemoGroup').val();
						$("#demoGroup").html($('#autoLoadDemoGroup').val());
					}
					var xDemoCssCon = '';
					var	xDemoJsCon = '';
					var xDemoMatchesCon = '';
					for(var i in xDemo.css){
						xDemoCssCon +=  xDemo.css[i] + '<br/>';
					}
					for(var j in xDemo.js){
						xDemoJsCon +=  xDemo.js[j] + '<br/>';
					}
					for(var k in xDemo.matches){
						xDemoMatchesCon +=  xDemo.matches[k] + ',';
					}
					$("#demoJs").html(xDemoJsCon);
					$("#demoCss").html(xDemoCssCon);
					$("#demoMatch").html(xDemoMatchesCon);
					$("#autoLoadResultTable").show();

					var xDemoLength = localStorage.getItem("xDemoLength") || 1;

					var xDemoData = {
						xDemoName : xDemo.name,
						xDemoEname : xDemo.ename,
						xDemoDes : xDemo.descrition,
						xDemoGroup : xDemo.group,
						xDemoManifestFile : optionFileUrl,
						xDemoMatches : xDemo.matches,
						xDemoVersion : xDemo.version,
						xDemoCss : xDemo.css,
						xDemoJs : xDemo.js,
						xDemoAuthor : xDemo.author,
						xDemoStatus : 'on'
					}

					var has = 0;
					//防止重复载入，同时检查版本更新
					for(var k = 1; k <= parseInt(xDemoLength); k++){
						console.log(xDemoData);
						//console.log(localStorage.getItem("xDemo_"+k));
						if(localStorage.getItem("xDemo_"+k) !== null){
							var getXdemoItem = JSON.parse(localStorage.getItem("xDemo_"+k));
							if(optionFileUrl == getXdemoItem.xDemoManifestFile){
								if(getXdemoItem.xDemoVersion == xDemo.version){
									alert('这个DEMO无版本更新');
									has++;
									break;
								}else{
									alert('这个DEMO已更新');
									localStorage.setItem("xDemo_" + k,JSON.stringify(xDemoData));
									has++;
									break;
								}
								
							}
						}else{
							continue;
						}
					};
                    // 如果不存在，就存入
					if(has !== 1){
						if(localStorage.getItem("xDemoLength") == null){
							localStorage.setItem("xDemoLength",1);
						}else{
							xDemoLength = parseInt(xDemoLength) + 1;
							localStorage.setItem("xDemoLength", xDemoLength);
						}
						
						localStorage.setItem("xDemo_" + xDemoLength, JSON.stringify(xDemoData));
						alert('添加成功');
						window.location.reload();
					}						
				}
			});				

		});
	},


	//我的DEMO列表

	getOptionList : function(){

		var xDemoListArr = {
			items : []
		};

		if(localStorage.getItem("xDemoLength") !== null){
			var xDemoLength = localStorage.getItem("xDemoLength");
			for(var i = 1; i <= parseInt(localStorage.getItem("xDemoLength"));i++){

				if(localStorage.getItem("xDemo_"+i) !== null){

					var getXdemoItem = JSON.parse(localStorage.getItem("xDemo_"+i));
					console.log(getXdemoItem);
					var xDemoJs = getXdemoItem.xDemoJs,
							xDemoGroup = getXdemoItem.xDemoGroup || 'o2Team',
							xDemoCss = getXdemoItem.xDemoCss,
							xDemoName = getXdemoItem.xDemoName,
							xDemoAuthor = getXdemoItem.xDemoAuthor,
							xDemoDes = getXdemoItem.xDemoDes,
							xDemoMatches = getXdemoItem.xDemoMatches,
							xDemoMainifestUrl = getXdemoItem.xDemoManifestFile,
							xDemoVer = getXdemoItem.xDemoVersion,
							xDemoStatus = getXdemoItem.xDemoStatus;
					var xDemoCssCon = '';
					var	xDemoJsCon = '';
					var xDemoMatchesCon = '';
					for(var j in xDemoCss){
						xDemoCssCon +=  xDemoCss[j] + '<br/>';
					}
					for(var k in xDemoJs){
						xDemoJsCon +=  xDemoJs[k] + '<br/>';
					}
					for(var m in xDemoMatches){
						xDemoMatchesCon +=  xDemoMatches[m] + ',';
					}
					var xDemoStatusOptText = '',
							xdemoNowStatusHtml1 = '',
							xdemoNowStatusHtml2 = '';
					if(xDemoStatus == 'on'){
						xdemoNowStatusHtml1 = 'label-success';
						xdemoNowStatusHtml2 = 'ON';
						xDemoStatusOptText = '关闭';
					}else{
						xdemoNowStatusHtml1 = 'label-danger';
						xdemoNowStatusHtml2 = 'OFF';
						xDemoStatusOptText = '打开';
					}
					var view = {
						row : true,
						xDemoIndex  : "xDemo_"+i,
						xdemoName : xDemoName,
						xdemoNowStatus1 : xdemoNowStatusHtml1,
						xdemoNowStatus2 : xdemoNowStatusHtml2,
						xdemoVer : xDemoVer,
						xdemoAuthor : xDemoAuthor,
						xdemoDes : xDemoDes,
						xdemoGroup : xDemoGroup,
						xDemoStatus : xDemoStatusOptText
					}
					xDemoListArr.items.push(view);
				}else{
					continue;
				}
			}
			if(xDemoListArr.items.length !== 0){
				var template = $('#myDemoTableTemplate').html();
				var xDemoListHtml = html_decode(Mustache.to_html(template, xDemoListArr));
				$('#myXdemoList').html(xDemoListHtml);
				this.getCommonGroup('myDemoList');
				this.xDemoListEvent();
			}

		}

		
		// // 更新DEMO
		// this.updateXdemoEvent();

		// // 编辑DEMO
		// this.editXdemoEvent();

		// // 开关DEMO
		// this.switchXdemoEvent();

		// //删除DEMO
		// this.delXdemoEvent();


		
	},


    // 列表里 更新、开关、删除、编辑、上传 在这里监听分发
	xDemoListEvent : function(){
		$('#myXdemoList').click(function(e){
			e.preventDefault();

			if($(e.target).data('updateIndex')){

				// 更新DEMO
				var xDemoIndex =  $(e.target).data('updateIndex');
				xdemoOption.updateXdemoEvent(xDemoIndex);

			} else if($(e.target).data('switchIndex')){

				// 开关DEMO
				xdemoOption.switchXdemoEvent(e);

			} else if($(e.target).data('deleteIndex')){

				//删除DEMO
				var xDemoIndex =  $(e.target).data('deleteIndex');
				xdemoOption.delXdemoEvent(xDemoIndex);

			} else if($(e.target).data('editIndex')){

                //编辑
				var xDemoIndex =  $(e.target).data('editIndex');
				xdemoOption.editXdemoEvent(xDemoIndex);

			} else if($(e.target).data('uploadIndex')){

                //上传
				var xDemoIndex =  $(e.target).data('uploadIndex');
				xdemoOption.uploadXdemoEvent(xDemoIndex);

			}

		})
	},

	uploadXdemoEvent : function(xDemoIndex){
		
		var checkAuthor = function(demoIndex,localAuthor) {

			var getXdemoItem = JSON.parse(localStorage.getItem(demoIndex));
			var xDemoObjectId = getXdemoItem.xDemoObjectId; // 用xDemoObjectId判断是新增还是更新

			if(getXdemoItem.xDemoAuthor == ''){
				getXdemoItem.xDemoAuthor = localAuthor;
			} else if(getXdemoItem.xDemoAuthor !== localAuthor){
				alert('您要提交的DEMO作者与您的用户名不符，无法提交，请联系开发者解决');
			}

			var postData = {
				name : getXdemoItem.xDemoName,
				ename : getXdemoItem.xDemoEname,
				author : localAuthor,
				descrition : getXdemoItem.xDemoDes,
				group : getXdemoItem.xDemoGroup,
				version : getXdemoItem.xDemoVersion,
				matches : getXdemoItem.xDemoMatches,
				js : getXdemoItem.xDemoJs,
				css : getXdemoItem.xDemoCss
			}

			if(xDemoObjectId) { //存在就更新
				// 第一个参数是 className，第二个参数是 objectId
				var updateItem = AV.Object.createWithoutData('XdemoList', xDemoObjectId);
				// 修改属性
				//todo.set('content', '每周工程师会议，本周改为周三下午3点半。');
				// 保存到云端
				updateItem.set({
						name : getXdemoItem.xDemoName,
						ename : getXdemoItem.xDemoEname,
						author : getXdemoItem.xDemoAuthor,
						des : getXdemoItem.xDemoDes,
						group : getXdemoItem.xDemoGroup,
						url : getXdemoItem.xDemoManifestFile,
						data : JSON.stringify(postData)
				});
				updateItem.save().then(function() {
						alert('提交成功');
				}).catch(function(err) {
						alert('提交失败:' + err);
				});
			} else { //不存在就新增
				if(getXdemoItem.xDemoManifestFile == '') {
					getXdemoItem.xDemoManifestFile = 'http://xdemo.reeqi.me/upload/'+ getXdemoItem.xDemoEname +'.js';
				}

				var XdemoList = AV.Object.extend('XdemoList');
				var xdemoList = new XdemoList();
				xdemoList.save({
						name : getXdemoItem.xDemoName,
						ename : getXdemoItem.xDemoEname,
						author : getXdemoItem.xDemoAuthor,
						des : getXdemoItem.xDemoDes,
						group : getXdemoItem.xDemoGroup,
						url : getXdemoItem.xDemoManifestFile,
						data : JSON.stringify(postData)
				}).then(function(data) {
					getXdemoItem.xDemoObjectId = data.id;
					//存xDemoObjectId哈
						localStorage.setItem(demoIndex, JSON.stringify(getXdemoItem));
						//localStorage.setItem('author',inputUploadXdemoAuthor);
						alert('提交成功');
				}).catch(function(err) {
						alert('文件写入失败，请联系开发者，谢谢！error:' + err);
				});
			}
			
		}

		if(!localStorage.getItem("local_author")){
			
			var local_author = prompt("这是您第一次提交DEMO，请输入您的用户名","");
			localStorage.setItem('local_author',local_author);
			checkAuthor(xDemoIndex, local_author);
		}else{
			var local_author = localStorage.getItem("local_author");
			checkAuthor(xDemoIndex,local_author);
		}	


	},

	updateXdemoEvent : function(xDemoIndex){

		var xDemoIndex = xDemoIndex;
		var xDemoOldData = JSON.parse(localStorage.getItem(xDemoIndex));
		var updateOptionUrl = xDemoOldData.xDemoManifestFile;
		
		if(updateOptionUrl == ''){ // 配置文件为空
			alert('本DEMO是手动添加的，无远程配置文件，无法更新');
			return ;
		} else if(UrlRegEx(updateOptionUrl)[2] !== 'xdemo.reeqi.me') { // 配置文件存在别处
			$.ajax({
				type: 'GET',
				url: updateOptionUrl + "?t=" + Date.parse(new Date()) ,
				dataType: 'json',
				success: function(data){
					xdemoOption.updateXdemoData(data, xDemoOldData, xDemoIndex);
				}
			});
		} else { // 配置文件是自己的
				if(objectId == "") { console.log("没有拿到ID更新不了"); }
				var objectId = xDemoOldData.xDemoObjectId;
				var query = new AV.Query('XdemoList');
						query.get(objectId).then(function(obj){
							var data = obj.get("data");
									data = JSON.parse(data);
									data.xDemoObjectId = objectId;
							xdemoOption.updateXdemoData(data, xDemoOldData, xDemoIndex);
						});
		}
	},

	// updateXdemoEvent里更新数据
	updateXdemoData: function(data, xDemoOldData, xDemoIndex){
				var xDemoOldStatus = xDemoOldData.xDemoStatus;
				var updateOptionUrl = xDemoOldData.xDemoManifestFile;
				var xDemo = data;
				var xDemoNewData = {
					xDemoObjectId : xDemo.xDemoObjectId,
					xDemoName : xDemo.name,
					xDemoManifestFile : updateOptionUrl,
					xDemoMatches : xDemo.matches,
					xDemoAuthor : xDemo.author,
					xDemoVersion : xDemo.version,
					xDemoCss : xDemo.css,
					xDemoGroup : xDemo.group,
					xDemoJs : xDemo.js,
					xDemoDes : xDemo.descrition,
					xDemoEname : xDemo.ename,
					xDemoStatus : xDemoOldStatus
				};
				console.log(xDemoNewData);
				if(xDemoNewData.xDemoVersion == xDemoOldData.xDemoVersion){
					
					alert('此DEMO无需更新')
				}else{
					var xDemoCssCon = '';
					var	xDemoJsCon = '';
					var xDemoMatchesCon = '';
					for(var j in xDemoNewData.xDemoCss){
						xDemoCssCon +=  xDemoNewData.xDemoCss[j] + '<br/>';
					}
					for(var k in xDemoNewData.xDemoJs){
						xDemoJsCon +=  xDemoNewData.xDemoJs[k] + '<br/>';
					}
					for(var m in xDemoNewData.matches){
						xDemoMatchesCon +=  xDemoNewData.matches[m] + ',';
					}
					var xDemoStatusOptText = '',
							xdemoNowStatusHtml1 = '',
							xdemoNowStatusHtml2 = '';

					if(xDemoNewData.xDemoStatus == 'on'){
						xdemoNowStatusHtml1 = 'label-success';
						xdemoNowStatusHtml2 = 'ON';
						xDemoStatusOptText = '关闭';
					}else{
						xdemoNowStatusHtml1 = 'label-danger';
						xdemoNowStatusHtml2 = 'OFF';
						xDemoStatusOptText = '打开';
					}	
					var xDemoListArr = {
						items : [
							{
								row : false,
								xDemoIndex  : xDemoIndex,
								xdemoName : xDemoNewData.xDemoName,
								xdemoNowStatus1 : xdemoNowStatusHtml1,
								xdemoNowStatus2 : xdemoNowStatusHtml2,
								xdemoVer : xDemoNewData.xDemoVersion,
								xdemoAuthor : xDemoNewData.xDemoAuthor,
								xdemoDes : xDemoNewData.xDemoDes,
								xdemoGroup : xDemoNewData.xDemoGroup,
								xDemoStatus : xDemoStatusOptText
							}
						]
					};

					var template = $('#myDemoTableTemplate').html();
					var xDemoItemHtml = Mustache.to_html(template, xDemoListArr);
					console.log(xDemoItemHtml);
					$('tr[data-xdemo-index="'+ xDemoIndex  +'"]').html(xDemoItemHtml);
					localStorage.setItem(xDemoIndex,JSON.stringify(xDemoNewData));
					alert('更新完毕');
				}
	},

	editLayerCnt : function(xDemoIndex){
			var xDemoIndex = xDemoIndex;
			var getXdemoItem = JSON.parse(localStorage.getItem(xDemoIndex));
			$("#xDemoIndex").val(xDemoIndex);
			$('#inputXdemoName').val(getXdemoItem.xDemoName);
			//$('#inputXdemoAuthor').val(getXdemoItem.xDemoAuthor);
			$('#inputXdemoVer').val(getXdemoItem.xDemoVersion);
			$('#inputXdemoDes').val(getXdemoItem.xDemoDes);
			$('#inputXdemoEname').val(getXdemoItem.xDemoEname);
			
			$('#inputXdemoOptionFile').val(getXdemoItem.xDemoManifestFile);
			var xDemoCssCon = '';
			var xDemoJsCon = '';
			var xDemoMatchesCon = '';
			for(var i in getXdemoItem.xDemoCss){
				if(i==0){
					xDemoCssCon +=  getXdemoItem.xDemoCss[i] ;
				}else{
					xDemoCssCon +=  '\n' + getXdemoItem.xDemoCss[i] ;
				}
			}
			for(var j in getXdemoItem.xDemoJs){
				if(j == 0){
					xDemoJsCon +=  getXdemoItem.xDemoJs[j]
				}else{
					xDemoJsCon += '\n' + getXdemoItem.xDemoJs[j] ;
				}	
			}
			for(var k in getXdemoItem.xDemoMatches){
				if(k == 0){
					xDemoMatchesCon +=  getXdemoItem.xDemoMatches[k]
				}else{
					xDemoMatchesCon += '\n' + getXdemoItem.xDemoMatches[k] ;
				}	
			}
			console.log(xDemoCssCon);
			$('#inputXdemoCss').val(xDemoCssCon);
			$('#inputXdemoJs').val(xDemoJsCon);	
			$('#inputXdemoMatches').val(xDemoMatchesCon);
		},



	// 编辑DEMO
	editXdemoEvent : function(xDemoIndex){
		this.editLayerCnt(xDemoIndex);
		$('#editXdemoDone').click(function(e){
			e.preventDefault();
			var urlVerify1 = $('#inputXdemoMatches').val().match(/(https|http):\/\/.+/); 
			var urlVerify2 = $('#inputXdemoCss').val().match(/(https|http):\/\/.+/);
			var urlVerify3 = $('#inputXdemoJs').val().match(/(https|http):\/\/.+/);
			var urlVerify4 = $('#inputXdemoOptionFile').val().match(/(https|http):\/\/.+/);
			if (urlVerify1 == null){
				alert('请输入正确的匹配地址'); 
				return false;
			}

			if($('#inputXdemoCss').val() !== ''){
				if (urlVerify2 == null){
					alert('请输入正确的CSS URL'); 
					return false;
				}
			}

			if($('#inputXdemoJs').val() !== ''){
				if (urlVerify3 == null){
					alert('请输入正确的JS URL'); 
					return false;
				}
			}

			if($('#inputXdemoOptionFile').val() !== ''){
				if (urlVerify4 == null){
					alert('请输入正确的配置文件 URL'); 
					return false;
				}
			}

			var xDemoIndex = $("#xDemoIndex").val();
			var getXdemoItem = JSON.parse(localStorage.getItem(xDemoIndex));
			getXdemoItem.xDemoName = $('#inputXdemoName').val();
			getXdemoItem.xDemoVersion = $('#inputXdemoVer').val();
			getXdemoItem.xDemoDes = $('#inputXdemoDes').val();
			getXdemoItem.xDemoEname = $('#inputXdemoEname').val();
			getXdemoItem.xDemoManifestFile = $('#inputXdemoOptionFile').val();
			getXdemoItem.xDemoMatches = $('#inputXdemoMatches').val().split('\n');
			var xDemoCssObj = $('#inputXdemoCss').val().split('\n');
			var xDemoJsObj = $('#inputXdemoJs').val().split('\n');
			getXdemoItem.xDemoCss = xDemoCssObj;
			getXdemoItem.xDemoJs = xDemoJsObj;
			localStorage.setItem(xDemoIndex,JSON.stringify(getXdemoItem));
			alert('更新完毕!!!!');
			window.location.reload();
		})

	},



	//开关我的DEMO
	switchXdemoEvent : function(e){
		var xDemoIndex =  $(e.target).data('switchIndex');
		console.log(xDemoIndex,e);
		var xDemoStatusTd = $('tr[data-xdemo-index ='+ xDemoIndex +']').find('td[data-xdemo-status]');
		var getXdemoItem = JSON.parse(localStorage.getItem(xDemoIndex));
		console.log(xDemoStatusTd);
		if(getXdemoItem.xDemoStatus == 'on'){
			getXdemoItem.xDemoStatus = 'off';
			$(e.target).html('打开');
			xDemoStatusTd.html('<span class="label label-danger">Off</span>');
		}else{
			getXdemoItem.xDemoStatus = 'on';
			$(e.target).html('关闭');
			xDemoStatusTd.html('<span class="label label-success">On</span>');
		}
		localStorage.setItem(xDemoIndex,JSON.stringify(getXdemoItem));
	},

	//删除我的DEMO
	delXdemoEvent: function(xDemoIndex){
		var xDemoIndex = xDemoIndex;
		$('tr[data-xdemo-index="'+ xDemoIndex  +'"]').fadeOut(function(){
			$(this).remove();
		});
		localStorage.removeItem(xDemoIndex);
		window.location.reload();
	},

	navTab : function(){

		$('#js_ui_menu a').click(function(e) {
			e.preventDefault();
			if(!$(this).parent().hasClass('active')){
				$('#js_ui_menu li').removeClass('active');
				$('.ui_m_item').removeClass('active');
				$(this).parent().addClass('active');
				var id = $(this).attr('href');
				$(id).addClass('active');
                location.hash = id;
			}
			
		});
	},
	getPlatformItem : function(){
		$('#xDemoPlatformList .btn').click(function(e){
			e.preventDefault();
			// 如果找不到就直接返回了
			if(!$(e.target).data('url')){ alert("没有找到配置文件"); return;}

				var optionFileUrl = $(e.target).data('url');
				if(UrlRegEx(optionFileUrl)[2] !== 'xdemo.reeqi.me') {
					$.ajax({
						type: 'GET',
						url: optionFileUrl ,
						dataType: 'json',
						success: function(data){
							var xDemo = data;
							var xDemoLength = localStorage.getItem("xDemoLength") || 1;
							if(xDemo.group == undefined){
								xDemo.group = 'other';
							}

							var xDemoData = {
								xDemoName : xDemo.name,
								xDemoManifestFile : optionFileUrl,
								xDemoMatches : xDemo.matches,
								xDemoVersion : xDemo.version,
								xDemoAuthor : xDemo.author,
								xDemoCss : xDemo.css,
								xDemoGroup : xDemo.group ,
								xDemoJs : xDemo.js,
								xDemoEname : xDemo.ename,
								xDemoDes : xDemo.descrition,
								xDemoStatus : 'on'
							}

							var has = 0;
							//防止重复载入，同时检查版本更新
							for(var k = 1; k <= parseInt(xDemoLength); k++){
								if(localStorage.getItem("xDemo_"+k) !== null){
									var getXdemoItem = JSON.parse(localStorage.getItem("xDemo_"+k));
									if(optionFileUrl == getXdemoItem.xDemoManifestFile){
										if(getXdemoItem.xDemoVersion == xDemo.version){
											alert('这个DEMO无版本更新');
											has++;
											break;							
										}else{
											alert('这个DEMO已更新');
											localStorage.setItem("xDemo_" + k,JSON.stringify(xDemoData));
											has++;
											break;						
										}
										
									}						
								}else{
									continue;
								}
							};
							if(has !== 1){
								if(localStorage.getItem("xDemoLength") == null){
									localStorage.setItem("xDemoLength",1);
								}else{
									xDemoLength = parseInt(xDemoLength) + 1;
									localStorage.setItem("xDemoLength",xDemoLength);
								}
								
								localStorage.setItem("xDemo_" + xDemoLength,JSON.stringify(xDemoData));
								alert('已将此DEMO导入到我的DEMO中');
								window.location.reload();
							}						
						}
					});						
				} else {
						var objectId = $(e.target).data('objectid');
						var query = new AV.Query('XdemoList');
								query.get(objectId).then(function(obj){

							var data = obj.get("data");
							var xDemo = JSON.parse(data);
							var xDemoLength = localStorage.getItem("xDemoLength") || 1;
							if(xDemo.group == undefined){
								xDemo.group = 'other';
							}

							var xDemoData = {
								xDemoObjectId : objectId,
								xDemoName : xDemo.name,
								xDemoManifestFile : optionFileUrl,
								xDemoMatches : xDemo.matches,
								xDemoVersion : xDemo.version,
								xDemoAuthor : xDemo.author,
								xDemoCss : xDemo.css,
								xDemoGroup : xDemo.group ,
								xDemoJs : xDemo.js,
								xDemoEname : xDemo.ename,
								xDemoDes : xDemo.descrition,
								xDemoStatus : 'on'
							}

							var has = 0;
							//防止重复载入，同时检查版本更新
							for(var k = 1; k <= parseInt(xDemoLength); k++){
								if(localStorage.getItem("xDemo_"+k) !== null){
									var getXdemoItem = JSON.parse(localStorage.getItem("xDemo_"+k));
									if(objectId == getXdemoItem.xDemoObjectId){
										if(getXdemoItem.xDemoVersion == xDemo.version){
											alert('这个DEMO无版本更新');
											has++;
											break;
										}else{
											localStorage.setItem("xDemo_" + k,JSON.stringify(xDemoData));
											has++;
											alert('这个DEMO已更新');
											break;
										}
										
									}						
								}else{
									continue;
								}
							};
							if(has !== 1){
								if(localStorage.getItem("xDemoLength") == null){
									localStorage.setItem("xDemoLength",1);
								}else{
									xDemoLength = parseInt(xDemoLength) + 1;
									localStorage.setItem("xDemoLength",xDemoLength);
								}
								
								localStorage.setItem("xDemo_" + xDemoLength,JSON.stringify(xDemoData));
								alert('已将此DEMO导入到我的DEMO中');
								window.location.reload();
							}

									console.log(obj);

									

								},function(error){
									alert("获取demo失败");
									console.log(error);
								});
				}

		})
	},
    
    // 从数据库获取demo列表
	getPlatformList : function(){

        var query = new AV.Query('XdemoList');
        query.select(['objectId','group','name','author','url','des']);
        query.find().then(function(data){

            $("#xDemoPlatformList").html('');
            var pListData = data;
            var xDemoListArr = {
                items : []
            };

            for(var i in pListData){
								console.log("data");
								console.log(data[i].id);
                xDemoListArr.items.push({
										xDemoObjectId : data[i].id,
                    xDemoName : data[i].get("name"),
                    xDemoDes : data[i].get("des"),
                    xDemoAuthor : data[i].get("author"),
                    xDemoGroup : data[i].get("group") || 'o2Team',
                    xDemoUrl : data[i].get("url")
                });
            }


            var template = $('#demoPlatformTemplate').html();

            var xDemoItemHtml = html_decode(Mustache.to_html(template, xDemoListArr));
            $('#xDemoPlatformList').append(xDemoItemHtml);

            xdemoOption.getCommonGroup('platformList');
            xdemoOption.getPlatformItem();

        },function(error){
            console.log("leadcloud error in List:" + error);
        });

    },


    // 获取业务列表
    getGroupList : function(){

        var query = new AV.Query('GroupList');
        query.select(['groupName']);
        query.find().then(function(data){

            var template = $('#groupItemTemplate').html(); //获取模板
            var groupListArr = {
                items : []
            };

            for(var i in data){
                groupListArr.items.push({groupItem : data[i].get("groupName")});
            }

            var xDemoItemHtml = Mustache.to_html(template, groupListArr); //填充模板
            // 填充业务选项
            $('#createDemoGroup,#myDemoGroup,#demoListGroup,#autoLoadDemoGroup').append(xDemoItemHtml);
            // 获取默认业务
            if(localStorage.getItem("commonGroup") !== null){
                var commonGroup = localStorage.getItem("commonGroup");
                $('#createDemoGroup option,#myDemoGroup option,#demoListGroup option').each(function(index, el) {
                    _this = el;
                    if($(_this).html() == commonGroup){
                        $(_this).attr('selected','selected');
                    }
                });
            }
            xdemoOption.demoListFilter(); //业务列表过滤
            xdemoOption.myDemoFilter(); //我的业务列表过滤
            xdemoOption.setCommonGroup(); //设置常用业务

        },function(error){
            console.log("leadcloud error in GroupList:" + error);
        });
	},

	// DEMO列表我的业务过滤
	myDemoFilter : function(){
		$('#myDemoGroup').change(function(){
			var selectItem = $(this).val();
			if(selectItem !== '0'){
				$('#myXdemoList tr').each(function(index, el) {
					_this = $(el);
					if(_this.data('group') !== selectItem){
						$(_this).hide();
					}else{
						$(_this).show();
					}
				});				
			}else{
				$('#myXdemoList tr').show();
			}

		})
	},

	// DEMO列表业务过滤
	demoListFilter : function(){
		$('#demoListGroup').change(function(){
			var selectItem = $(this).val();
			if(selectItem !== '0'){
				$('#xDemoPlatformList tr').each(function(index, el) {
					_this = $(el);
					if(_this.data('group') !== selectItem){
						$(_this).hide();
					}else{
						$(_this).show();
					}
				});				
			}else{
				$('#xDemoPlatformList tr').show();
			}

		})
	},
	// 设置常用业务
	setCommonGroup : function(){
		$('a[data-action="setCommonGroup"]').click(function(event) {
			event.preventDefault();
			var commonGroup = $(event.target).prev().val();
			if(commonGroup !== '0'){
				localStorage.setItem("commonGroup",commonGroup);
				alert('设置成功');
				window.location.reload();
			}

		});
	},
	getCommonGroup : function(type){
		if(type == 'myDemoList'){
			var dom  = '#myXdemoList';
		}else if(type == 'platformList'){
			var dom  = '#xDemoPlatformList';
		}

		if(localStorage.getItem("commonGroup") !== null){
			var commonGroup = localStorage.getItem("commonGroup");
			$(dom + ' tr').each(function(index, el) {
				_this = $(el);
				if(_this.data('group') !== commonGroup){
					$(_this).hide();
				}else{
					$(_this).show();
				}
			});				
		}
	},
	init : function () {
		this.navTab();
		this.manualCreateXdemoEvent();
		this.autoLoadXdemoEvent();
		this.getOptionList();
		this.getPlatformList();
		this.getGroupList();
		$('#showOptionFormat').click(function(event) {
			event.preventDefault();;
			$('#js_ui_menu a[href="#about"]').click();
		});
        if (location.hash !="") {
			$('#js_ui_menu a[href=' + location.hash + ']').click();
        }
	}
};

/**
 * URL解析
 */

 function UrlRegEx(urlt)   {        
    var re = /(\w+):\/\/([^\:|\/]+)(\:\d*)?(.*\/)([^#|\?|\n]+)?(#.*)?(\?.*)?/gi;   
   	var arr = re.exec(urlt);    
    return arr;   
   
}

/**
 * html反编译
 */
function html_decode(str) {   
  var s = "";   
  if (str.length == 0) return "";   
  s = str.replace(/&gt;/g, ">");   
  s = s.replace(/&lt;/g, "<");    
  s = s.replace(/&nbsp;/g, " ");
  s = s.replace(/&#x2F;/g,"/");  
  s = s.replace(/&amp;/g,"&");  
  s = s.replace(/&#39;/g, "\'");   
  s = s.replace(/&quot;/g, "\"");   
  s = s.replace(/<br>/g, "\n");   
  return s;   
};


xdemoOption.init();
