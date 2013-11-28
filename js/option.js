


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
				localStorage.setItem("xDemoLength",xDemoLength);
				localStorage.setItem("xDemo_" + xDemoLength,JSON.stringify(xDemoData));

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
					if(has !== 1){
						if(localStorage.getItem("xDemoLength") == null){
							localStorage.setItem("xDemoLength",1);
						}else{
							xDemoLength = parseInt(xDemoLength) + 1;
							localStorage.setItem("xDemoLength",xDemoLength);
						}
						
						localStorage.setItem("xDemo_" + xDemoLength,JSON.stringify(xDemoData));
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
							xDemoGroup = getXdemoItem.xDemoGroup || '易迅',
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

	xDemoListEvent : function(){
		$('#myXdemoList').click(function(e){
			e.preventDefault();

			if($(e.target).data('updateIndex')){
				// 更新DEMO
				var xDemoIndex =  $(e.target).data('updateIndex');
				xdemoOption.updateXdemoEvent(xDemoIndex);

			}else if($(e.target).data('switchIndex')){
				// 开关DEMO
				xdemoOption.switchXdemoEvent(e);

			}else if($(e.target).data('deleteIndex')){
				//删除DEMO
				var xDemoIndex =  $(e.target).data('deleteIndex');
				xdemoOption.delXdemoEvent(xDemoIndex);
			}else if($(e.target).data('editIndex')){
				var xDemoIndex =  $(e.target).data('editIndex');
				xdemoOption.editXdemoEvent(xDemoIndex);
			}else if($(e.target).data('uploadIndex')){
				var xDemoIndex =  $(e.target).data('uploadIndex');
				xdemoOption.uploadXdemoEvent(xDemoIndex);
			}

		})
	},

	uploadXdemoEvent : function(xDemoIndex){
		



		var checkAuthor = function(demoIndex,localAuthor){
			var getXdemoItem = JSON.parse(localStorage.getItem(demoIndex));
			if(getXdemoItem.xDemoAuthor == ''){
				getXdemoItem.xDemoAuthor = localAuthor;
			}

			if(getXdemoItem.xDemoAuthor !== localAuthor){
				alert('您要提交的DEMO作者与您的用户名不符，无法提交，请联系reeqiwu解决');
			}else{
			//var inputUploadXdemoAuthor = getXdemoItem.xDemoAuthor;
				var postData = {
				  name : getXdemoItem.xDemoName,
				  version : getXdemoItem.xDemoVersion,
				  css : getXdemoItem.xDemoCss,
				  js : getXdemoItem.xDemoJs,
				  matches : getXdemoItem.xDemoMatches,
				  ename : getXdemoItem.xDemoEname,
				  group : getXdemoItem.xDemoGroup,
				  author : localAuthor,
				  descrition : getXdemoItem.xDemoDes
				}				
				if(getXdemoItem.xDemoManifestFile == ''){
					getXdemoItem.xDemoManifestFile = 'http://xdemo.reeqi.me/upload/'+ getXdemoItem.xDemoEname +'.js';

					$.ajax({
						type: 'POST',
						url: 'http://xdemo.reeqi.me/index.php/welcome/upload_unoption' ,
						data : {
							name : getXdemoItem.xDemoName,
							ename :getXdemoItem.xDemoEname,
							data : JSON.stringify(postData),
							author : getXdemoItem.xDemoAuthor,
							des : getXdemoItem.xDemoDes,
				  		group : getXdemoItem.xDemoGroup,							
							url :	getXdemoItem.xDemoManifestFile
						},
						success: function(data){

							localStorage.setItem(demoIndex,JSON.stringify(getXdemoItem));
							//localStorage.setItem('author',inputUploadXdemoAuthor);
							if(data == 'done'){
								alert('提交成功');
							}else if(data == 'writeError'){
								alert('文件写入失败，请联系reeqiwu,谢谢！');
							}
						}
					});
				}else if(UrlRegEx(getXdemoItem.xDemoManifestFile)[2] !== 'xdemo.reeqi.me'){
					$.ajax({
						type: 'POST',
						url: 'http://xdemo.reeqi.me/index.php/welcome/upload_unoption' ,
						data : {
							name : getXdemoItem.xDemoName,
							ename :getXdemoItem.xDemoEname,
							author : getXdemoItem.xDemoAuthor,
							des : getXdemoItem.xDemoDes,
							group : getXdemoItem.xDemoGroup,
							url :	getXdemoItem.xDemoManifestFile
						},
						success: function(data){

							//localStorage.setItem(demoIndex,JSON.stringify(getXdemoItem));
							//localStorage.setItem('author',inputUploadXdemoAuthor);
							if(data == 'done'){
								alert('提交成功');
							}
						}
					});						
				}else{
					$.ajax({
						type: 'POST',
						url: 'http://xdemo.reeqi.me/index.php/welcome/upload_unoption' ,
						data : {
							name : getXdemoItem.xDemoName,
							ename :getXdemoItem.xDemoEname,
							author : getXdemoItem.xDemoAuthor,
							des : getXdemoItem.xDemoDes,
							group : getXdemoItem.xDemoGroup,							
							data : JSON.stringify(postData),
							url :	getXdemoItem.xDemoManifestFile
						},
						success: function(data){

							//localStorage.setItem(demoIndex,JSON.stringify(getXdemoItem));
							//localStorage.setItem('author',inputUploadXdemoAuthor);
							if(data == 'done'){
								alert('提交成功');
							}else if(data == 'writeError'){
								alert('文件写入失败，请联系reeqiwu,谢谢！');
							}
						}
					});
				}
			}			
		}

		if(!localStorage.getItem("local_author")){
			
			var local_author = prompt("这是您第一次提交DEMO，请输入您的用户名","");
			localStorage.setItem('local_author',local_author);
			checkAuthor(xDemoIndex,local_author);
		}else{
			var local_author = localStorage.getItem("local_author");
			checkAuthor(xDemoIndex,local_author);
		}	


	},



	updateXdemoEvent : function(xDemoIndex){

				
		var xDemoIndex = xDemoIndex;
		var xDemoOldData = JSON.parse(localStorage.getItem(xDemoIndex));
		var updateOptionUrl = xDemoOldData.xDemoManifestFile;
		var xDemoOldStatus = xDemoOldData.xDemoStatus;
		if(updateOptionUrl == ''){
			alert('本DEMO是手动添加的，无远程配置文件，无法更新');
			return ;
		}
		$.ajax({
			type: 'GET',
			url: updateOptionUrl + "?t=" + Date.parse(new Date()) ,
			dataType: 'json',
			success: function(data){

				var xDemo = data;
				var xDemoNewData = {
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
			}
		});


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
			}
			
		});
	},
	getPlatformItem : function(){
		$('#xDemoPlatformList').click(function(e){
			e.preventDefault();
			if($(e.target).data('url')){
				var optionFileUrl = $(e.target).data('url');
				//var optionFileUrl = "http://127.0.0.1/xdemo/option.js";
				$.ajax({
					type: 'GET',
					url: optionFileUrl ,
					dataType: 'json',
					success: function(data){
						var xDemo = data;


						var xDemoLength = localStorage.getItem("xDemoLength") || 1;
						if(xDemo.group == undefined){
							xDemo.group = '易迅';
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
			}
		})
	},
	getPlatformList : function(){
		var xDemoPlatformListHtmlTemple = '';
		$.ajax({
			type: 'GET',
			url: 'http://xdemo.reeqi.me/index.php/welcome/getlist_json' ,
			dataType: 'json',
			success: function(data){
				$("#xDemoPlatformList").html('');
				var pListData = data;

				var xDemoListArr = {
					items : []
				};

				for(var i in pListData){
					console.log(pListData[i].name);
					xDemoListArr.items.push({
						xDemoName : pListData[i].name,
						xDemoDes : pListData[i].des,
						xDemoAuthor : pListData[i].author,
						xDemoGroup : pListData[i].group || '易迅',
						xDemoUrl : pListData[i].url
					})
				}
				var template = $('#demoPlatformTemplate').html();
					var xDemoItemHtml = html_decode(Mustache.to_html(template, xDemoListArr));
					console.log(xDemoItemHtml);
				$('#xDemoPlatformList').append(xDemoItemHtml);
				xdemoOption.getCommonGroup('platformList');
				xdemoOption.getPlatformItem();
			}
		});
	},


	// 获取业务列表
	getGroupList : function(){
		$.ajax({
			type: 'GET',
			url: 'http://xdemo.reeqi.me/index.php/welcome/getGroupList_json' ,
			dataType: 'json',
			success: function(data){
				var groupListArr = {
					items : []
				};
				var template = $('#groupItemTemplate').html();
				for(var i in data){
					groupListArr.items.push({groupItem : data[i].groupName});
				}
				console.log(groupListArr);
				var xDemoItemHtml = Mustache.to_html(template, groupListArr);

				$('#createDemoGroup,#myDemoGroup,#demoListGroup,#autoLoadDemoGroup').append(xDemoItemHtml);
				if(localStorage.getItem("commonGroup") !== null){
					var commonGroup = localStorage.getItem("commonGroup");
					$('#createDemoGroup option,#myDemoGroup option,#demoListGroup option').each(function(index, el) {
						_this = el;
						if($(_this).html() == commonGroup){
							$(_this).attr('selected','selected');
						}
					});
				}
				xdemoOption.demoListFilter();
				xdemoOption.myDemoFilter();
				xdemoOption.setCommonGroup();
			}
		});		
	},

	// DEMO列表业务过滤
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
	}
} 

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
