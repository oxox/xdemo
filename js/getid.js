console.log('ab');
function getId(){
	console.log('cd');
	var userInfo = document.getElementById('userName');
	//console.log(uidNode);
	if(userInfo !== null){
		var userName  = userInfo.innerHTML;
		console.log(userName);
		chrome.extension.sendMessage({
				type : 'userName',
		    userName : userName
		});
		// if(getIdInterval !== undefined){
		// 	window.clearTimeout(getIdInterval);
		// }	
	}
}
getId();
