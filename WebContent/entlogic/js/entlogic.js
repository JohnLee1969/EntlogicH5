/**
 * 自动获取applicationRoot
 * @returns
 */
function getApplicationRoot() {
	if (typeof(applicationRoot) != "undefined") return;
	
	var parentWindow = this;
	while (typeof(applicationRoot) == "undefined") {
		parentWindow = parentWindow.parent;
		if (typeof(parentWindow) == "undefined" || parentWindow == null) return;
		applicationRoot = parentWindow.applicationRoot;
	}
	application = parentWindow.application;
	sessionId = parentWindow.sessionId;
};

/**
 * 屏蔽一些快捷键
 */
function initKeys() {
	$(window).keydown(function(e) {
        e = e || window.event;
        var key = e.keyCode || e.which || e.charCode;
		if (e.ctrlKey && key == 83) return false;
	});
	
	$('#body').on('keydown','input',function(e){
        e = e || window.event;
        var key = e.keyCode || e.which || e.charCode;
        if(key == 13){
            var inputarray =  $('#body input');
            console.log(inputarray.length);
            nextindex = inputarray.index(this)+1;
            if (nextindex>=inputarray.length)
            {//最后一个验证码回车登录
                OK();
            }else{
                next = inputarray[nextindex];
                next.focus();
                next.select();
            }
        }
        
     });
	
	 // 去掉文字选择
	 document.onselectstart = function(){return false;};
}


/**
 * 窗口默认提交
 * 
 * @returns
 */
function OK() {
	
};
    
/**
 * 向后台发送数据服务请求
 * 
 * @param applicationRoot
 * @param bpId
 * @param command
 * @param data
 * @returns {String}
 */
function postBpForm(bpId, command, formControls, userParameters) {
	// 在设计模式下自动获取application
	getApplicationRoot();
	
	// 创建参数容器
	var parameters = new entlogic_data_record();

	// 提取form控件参数
	var ctl;
	for (var i = 0; i < formControls.length; i++) {
		ctl = formControls[i];
		parameters.addItem(ctl.id, base64_encode(ctl.getValue()));
	}

	// 提取自定义参数
	if (userParameters) {
		for (var j = 0; j < userParameters.items.length; j++) {
			var item = userParameters.items[j];
			parameters.addItem(item.key, base64_encode(item.value));
		}
	}

	// 发出Post请求
	var parameterXML = parameters.toXML();
	var dataPackage = new entlogic_data_package();
	$.ajaxSettings.async = false;
	var data = $.post(applicationRoot + "/BpMaster", {
		a: Math.random(),
		sessionId: sessionId,
		bpId : bpId,
		command : command,
		data : (typeof (parameterXML) === "undefined") ? "" : parameterXML
	}).responseText;
	
	if (data) {
		var result = $(data).find("result").text();
		if (result == "success") {
			var dataXML = $(data).find("data_package").html();
			dataXML = "<data_package>" + dataXML + "</data_package>";
			dataPackage.loadXML(dataXML);
			sessionId = dataPackage.getReturn("sessionId");
			var result = dataPackage.getReturn("result");
			var errorMessage = dataPackage.getReturn("errorMessage");
			if (errorMessage != null) {
				popUpError("错误", errorMessage);
				return null;
			}
		} else {
			alert("业务请求失败，请检查网络是否联通，或服务器是否工作正常！！");
			return null;
		}
		return dataPackage;
	}	
	alert("业务请求失败，请检查网络是否联通，或服务器是否工作正常！！");
	return null;
};

/**
 * 向后台发送数据服务请求
 * 
 * @param applicationRoot
 * @param bpId
 * @param command
 * @param data
 * @returns {String}
 */
function postBpService( bpId, command, userParameters) {
	// 在设计模式下自动获取application
	getApplicationRoot();

	// 创建参数容器
	var parameters = new entlogic_data_record();
	
	// 提取自定义参数
	for (var j = 0; j < userParameters.items.length; j++) {
		var item = userParameters.items[j];
		parameters.addItem(item.key, base64_encode(item.value));
	}

	// 发出Post请求
	var parameterXML = parameters.toXML();
	var dataPackage = new entlogic_data_package();
	$.ajaxSettings.async = false;
	var data = $.post(applicationRoot + "/BpMaster", {
		a: Math.random(),
		sessionId: sessionId,
		bpId : bpId,
		command : command,
		data : (typeof (parameterXML) === "undefined") ? "" : parameterXML
	}).responseText;
	
	if (data) {
		var result = $(data).find("result").text();
		if (result == "success") {
			var dataXML = $(data).find("data_package").html();
			dataXML = "<data_package>" + dataXML + "</data_package>";
			dataPackage.loadXML(dataXML);
			sessionId = dataPackage.getReturn("sessionId");
			var result = dataPackage.getReturn("result");
			var errorMessage = dataPackage.getReturn("errorMessage");
			if (errorMessage != null) {
				popUpError("错误", errorMessage);
				return null;
			}
		} else {
			alert("业务请求失败，请检查网络是否联通，或服务器是否工作正常！！");
			return null;
		}
		return dataPackage;
	}	
	alert("业务请求失败，请检查网络是否联通，或服务器是否工作正常！！");
	return null;
};

/**
 * 服务器链接测试
 * @returns
 */
function testService() {
	var parameter = new entlogic_data_record();
	var dataPackage = postBpService("com.entlogic.h5.services.SYSService", "test", parameter);
	if (dataPackage == null) return false;
	if (dataPackage != null) sessionId = dataPackage.getReturn("sessionId");
	return true;
};

/**
 * 获取应用后台档案库路径
 * @param appName
 * @returns
 */
function getAFSPath(appName) {
	var result = null;
	
	var parameter = new entlogic_data_record();
	parameter.addItem("appName", appName);
	var dataPackage = postBpService("com.entlogic.h5.services.FileService", "getAFSPath", parameter);
	if (dataPackage != null) result = dataPackage.getReturn("result");
	
    return result;
};

/**
 * 上传大文件
 * @param filePaht
 * @returns
 */
function uploadBigFile(filePath, callBackFunction) {
	application.fileUploadPath = filePath;
	application.uploadBigFileCallBack = callBackFunction;
	application.fileUpload.click();
};

/**
 * 上传大文件回调函数
 * @returns
 */
function uploadBigFileCallBack() {
	
};

/**
 * 上传本地文件
 * @param applicationRoot
 * @param appName
 * @param fileName
 * @param file
 * @returns
 */
function uploadFile(appName, fileName, data, path) {
	var result = null;
	
	var parameter = new entlogic_data_record();
	parameter.addItem("appName", appName);
	parameter.addItem("fileName", fileName);
	parameter.addItem("path", path);
	parameter.addItem("fileContent", data);
	var dataPackage = postBpService("com.entlogic.h5.services.FileService", "saveBinaryFile", parameter);
	if (dataPackage != null) result = dataPackage.getReturn("result");
	
    return result;
};

/**
 * 上传本地文件
 * @param applicationRoot
 * @param appName
 * @param fileName
 * @param file
 * @returns
 */
function copyFile(appName, fileName,path) {
	var result = null;
	
	var parameter = new entlogic_data_record();
	parameter.addItem("appName", appName);
	parameter.addItem("fileName", fileName);
	parameter.addItem("filePath", path);
	var dataPackage = postBpService("com.entlogic.h5.services.FileService", "copyFile", parameter);
	if (dataPackage != null) result = dataPackage.getReturn("result");
	
    return result;
};

/**
 * 删除文件
 * 
 * @returns
 */
function deleteFile(path) {
	var parameter = new entlogic_data_record();
	parameter.addItem("path", path);
	var dataPackage = postBpService("com.entlogic.h5.services.FileService", "deleteFile", parameter);
};

/**
 * 系统登录
 * 
 * @param userTable
 * @param userNameCol
 * @param passwordCol
 * @param userName
 * @param password
 * @param checkCode
 * @returns
 */
function login(dsn, userTable, userNameCol, passwordCol, userName, password, checkCode) {
	var parameter = new entlogic_data_record();
	parameter.addItem("dsn", dsn);
	parameter.addItem("userTable", userTable);
	parameter.addItem("userNameCol", userNameCol);
	parameter.addItem("passwordCol", passwordCol);
	parameter.addItem("userName", userName);
	parameter.addItem("password", password);
	parameter.addItem("checkCode", checkCode);
	var dataPackage = postBpService("com.entlogic.h5.services.SYSService", "login", parameter);
	if (dataPackage == null) return false;
	var result = dataPackage.getReturn("result");
	return result == "success";
};

/**
 * 页面跳转
 * @param url
 * @returns
 */
function jumpTo(url) {
    var d = new Date();
	var t = d.getTime();
    if (url.indexOf("?") > 0) {
        url = url + "&t=" + t;
    } else {
         url = url + "?t=" + t;
    }
    url = url + "&applicationRoot=" + applicationRoot;
    url = url + "&sessionId=" + sessionId;
    window.location.href  = url;
};

/**
 * 弹出右键菜单
 * @param menu
 */
function popUpMouseRightMenu(x, y, menu) {
	var mouseRightMenu = $("#divMouseRightMenu");
	if (mouseRightMenu.length == 0) {
		var html = "";
		html += "<div id='divMouseRightMenu' class='eui-mouse-right-menu'>";
		for(var i = 0; i < menu.length; i++) {
			html += "<div id='divMouseRightMenu_" + i + "' class='eui-mouse-right-menu-item' onclick='" + menu[i].action + "()'>";
			html += menu[i].text;
			html +="</div>";
		}
		html += "</div>";
		$("body").append(html);
		mouseRightMenu = $("#divMouseRightMenu");
	}
	mouseRightMenu.css("left", x + "px");
	mouseRightMenu.css("top", y + "px");
	mouseRightMenu.show();
};

/**
 * 关闭右键菜单
 */
function closeMouseRightMenu() {
	   var mouseRightMenu = $("#divMouseRightMenu");
	   if( mouseRightMenu.length > 0 ){
		   mouseRightMenu.hide();
 	  }
};

/**
 * 弹出对话框窗口
 * 
 * @param applicationRoot
 * @param bpFormUrl
 * @param parameters
 */
function popUpDialog(bpFormUrl, width, height, title, closeFunction) {
	var dialogId = (new Date()).getTime();
	var bgId = "bg_" + dialogId;
	var iframeId = "iframe_" + dialogId;
	
	var html = "";
	html += "<div  id='"+ bgId + "' style='z-index:9998;left:0px;top:0px;bottom:0px;right:0px;position:absolute;filter:Alpha(Opacity=45);opacity:0.45;background-color:#000;'>";
	html += "</div>";	
	html += "<div id='" + dialogId + "' class='eui-modal-dialog' style='width: " + width + "px; height: " + height + "px; z-index: 9999;'>";
	html += "	<div class='group-h eui-panel-title-bar'>";
	html += "		<div class='eui-panel-title'>" + title + "</div>";
	html += "		<div class='space'></div>";
	html += "		<button class='eui-link-btn float-right' onclick=' closePopUpDialog(\"" + dialogId + "\");'>✖</button>";
	html += "	</div>	";
	html += "	<div class='group-v' style='width: 100%; height: 100%; flex-grow: 1;'>";
	html += "		<iframe id='" + iframeId + "'  class='eui-iframe' style='width: 100%; height: 100%;' src='" + bpFormUrl + "'>";
	html += "		</iframe>";
	html += "	</div>";
	html += "</div>";
	$("body").append(html);
	
	$("#" + iframeId).load(function() {
		var iframe = $("#" + iframeId);
		var divScreen = iframe.contents().find("#divScreen");	
		$("#" + dialogId).width(divScreen.outerWidth());
		$("#" + dialogId).height(divScreen.outerHeight() + 36);
		iframe[0].contentWindow.dialogCallBack = closeFunction;
		iframe[0].contentWindow.closeDialog = function() {
			closePopUpDialog(dialogId)
		};
	});	
};

/**
 * 关闭弹出对话框
 */
function closePopUpDialog(dialogId) {
	var bgId = "bg_" + dialogId;	
	$("#" + bgId).remove();
	$("#" + dialogId).remove();
};

/**
 * 对话框回调函数
 */
function dialogCallBack() {	
};

/**
 * 关闭弹出对话框
 */
function closeDialog() {
};

/**
 * 弹出覆盖子窗口
 * 
 * @param bpFormUrl
 */
function popUpSubForm(bpFormUrl,  closeFunction) {
	subFormCallBack = closeFunction;
	var html = "";
	html += "<div id='divSubForm' class='subform'>";
	html += "	<iframe id='frameDialog'  style='width: 100%; height: 100%;'  src='" + bpFormUrl + "'>";
	html += "	</iframe>";
	html += "</div>";
	$("body").append(html);
};

/**
 * 子窗口回调函数
 */
function subFormCallBack() {
	
};

/**
 * 关闭覆盖子窗口
 */
function closeSubForm() {
	$("#divSubForm").remove();
};

/**
 * 弹出查找子窗口
 * 
 * @param bpFormUrl
 */
function popUpLookupForm(bpFormUrl,  closeFunction) {
	lookupCallBack = closeFunction;
	var html = "";
	html += "<div id='divLookupForm' class='lookup-form'>";
	html += "	<iframe id='frameDialog'  style='width: 100%; height: 100%;'  src='" + bpFormUrl + "'>";
	html += "	</iframe>";
	html += "</div>";
	$("body").append(html);
};

/**
 * 子窗口回调函数
 */
function lookupCallBack() {
	
};

/**
 * 关闭覆盖子窗口
 */
function closeLookup() {
	$("#divLookupForm").remove();
};



/**
 * 弹出查找子窗口
 * 
 * @param bpFormUrl
 */
function popUpMobLookupForm(bpFormUrl,  closeFunction) {
    var d = new Date();
	var t = d.getTime();
    if (bpFormUrl.indexOf("?") > 0) {
        bpFormUrl = bpFormUrl + "&t=" + t;
    } else {
         bpFormUrl = bpFormUrl + "?t=" + t;
    }
    bpFormUrl = bpFormUrl + "&applicationRoot=" + applicationRoot;
    bpFormUrl = bpFormUrl + "&sessionId=" + sessionId;

    lookupCallBack = closeFunction;
	var html = "";
	html += "<div id='divMobLookupForm' class='group-v-m' style='position: absolute;top: 0rem;left: 0rem;right: 0rem;bottom: 0rem;z-index: 2000;background-color:rgba(0,0,0,0.6);'>";
	html += "<div  class='group-v-m' style='width: 70%; height: 60%;'>";
	html += "	<iframe id='frameDialog'  style='width: 100%; height: 100%;border-radius: 1rem;'  src='" + bpFormUrl + "'>";
	html += "	</iframe>";
	html += "</div>";
	html += "</div>";
	$("body").append(html);
};

/**
 * 关闭覆盖子窗口
 */
function closeMobLookup() {
	$("#divMobLookupForm").remove();
};

/**
 * 弹出错误提示框
 * 
 * @param applicationRoot
 * @param bpFormUrl
 * @param parameters
 */
function popUpError(title, message) {
	var html = "";
	html += "<div  id='divError_bg' style='z-index:10;left:0px;top:0px;bottom:0px;right:0px;position:absolute;filter:Alpha(Opacity=45);opacity:0.45;background-color:#000;'>";
	html += "</div>";	
	html += "<div id='divError' class='group-v popup-error'>";
	html += "	<div class='group-h popup-error-title-bar'>";	
	html += "		<span style='font-size: 18px; color: #FF0;'>&#xe662;</span>";
	html += "		<span class='popup-error-title'>" + title + "</span>";
	html += "		<div class='space'></div>";
	html += "		<button class='popup-error-close-button' onclick='closeError();'>✖</button>";
	html += "	</div>	";
	html += "	<div class='group-v' style='heigh: 30px; width: 100%; flex-grow: 1;'>";
	html += "		<textarea class='popup-error-content note'>" + message + "</textarea>";
	html += "	</div>";
	html += "</div>";
	$("body").append(html);
};

/**
 * 关闭短时信息提示框
 */
function closeError() {
	$("#divError").remove();
	$("#divError_bg").remove();
};

/**
 * 弹出错误提示框
 * 
 * @param applicationRoot
 * @param bpFormUrl
 * @param parameters
 */
function popUpMobError(title, message,iconFont,iconColor) {
	var html = "";
	html += "<div id='divMobError' class='group-v-m' style='position: absolute;top: 0;left: 0;right: 0;bottom: 0;z-index: 2000;background-color:rgba(0,0,0,0.6);padding:1rem;'>";
	html += "	<div class='group-v-m' style='padding:2rem 3rem;border-radius: 0.5rem;background-color:#FFF;'>";
	html += "		<span style='font-size:1.8rem;margin-bottom:1rem;'>"+title+" </span>";
	if(typeof(iconFont)==="undefined"||iconFont==="")
	{
		html += "		<span class='hsboss-color-blue' style='font-size: 5rem;"+(typeof(iconColor)==="undefined"||iconColor===""?"":"color:"+iconColor+";")+"'>&#xe662;</span>";
	}
	else
	{
		html += "		<span class='hsboss-color-blue' style='font-size: 5rem;"+(typeof(iconColor)==="undefined"||iconColor===""?"":"color:"+iconColor+";")+"''>"+iconFont+"</span>";
	}
	html += "		<span style='margin-top:1rem;margin-bottom:2rem;overflow-y: auto;'>" + message + "</span>";
	html += "		<div class='group-h' style='width:100%;justify-content: center;'>";
	html += "			<span id='btnClose' class='hsboss-color-blue'  onclick='closeMobError();' style='height:3rem;font-size: 1.5rem;'>确定</span>";
	html += "		</div>";
	html += "	</div>";
	html += "</div>";
	$("body").append(html);
};

/**
 * 关闭短时信息提示框
 */
function closeMobError() {
	$("#divMobError").remove();
};


/**
 * 弹出短时信息提示框
 * 
 * @param applicationRoot
 * @param bpFormUrl
 * @param parameters
 */
function popUpMessage(message) {
	var html = "";
	html += "<div id='myAlert' class='eui-message-box' style='max-width:360px; z-index: 2000;'>";
	html += "	<strong id='message'>" + message + "</strong>";
	html += "</div>";
	$("body").append(html);
	$('#myAlert').css("height", $('#message').height() + 24);
	$('#myAlert').css("width", $('#message').width() + 24);
	setTimeout('closeMessage()', 2000);
};

/**
 * 关闭短时信息提示框
 */
function closeMessage() {
	$("#myAlert").remove();
};

/**
 * 弹出短时信息提示框
 * 
 * @param applicationRoot
 * @param bpFormUrl
 * @param parameters
 */
function popUpMobMessage(message,fontIcon,iconColor) {
	var html = "";
	html += "<div id='divMobMessage' class='eui-message-box' style='background-color:#FFF;max-width:280px;z-index: 2000;'>";
	html += "	<div id='message' class='group-h-m'>";
	if(typeof(iconFont)==="undefined"||iconFont==="")
	{
		html += "		<span class='hsboss-color-blue' style='font-size: 2rem;padding-right:1rem;"+(typeof(iconColor)==="undefined"||iconColor===""?"":"color:"+iconColor+";")+"'>&#xe6e4;</span>";
	}
	else
	{
		html += "		<span class='hsboss-color-blue' style='font-size: 2rem;padding-right:1rem;"+(typeof(iconColor)==="undefined"||iconColor===""?"":"color:"+iconColor+";")+"''>"+iconFont+"</span>";
	}
	html += "		<span style='overflow-y: auto;'>" + message + "</span>";
	html += "	</div>";
	html += "</div>";
	$("body").append(html);

	$('#divMobMessage').css("height", $('#message').height());
	$('#divMobMessage').css("width", $('#message').width());
	setTimeout('closeMobMessage()', 2000);
};

/**
 * 关闭短时信息提示框
 */
function closeMobMessage() {
	$("#divMobMessage").remove();
};


/**
 * 弹出信息提示框
 * 
 * @param applicationRoot
 * @param bpFormUrl
 * @param parameters
 */
function popUpTips(message,fontIcon,confirmText,confirmFunction,isShowConfirm) {
	var html = "";
	html += "<div id='divTips' class='group-v-m' style='position: absolute;top: 0;left: 0;right: 0;bottom: 0;z-index: 2000;background-color:rgba(0,0,0,0.6);'>";
	html += "	<div class='group-v-m' style='padding:2rem 3rem;border-radius: 0.5rem;background-color:#FFF;'>";
	html += "		<span style='font-size:1.8rem;'>系统提示 </span>";
	html += "		<span class='lable hsboss-color-blue' style='font-size: 7rem;'>" + fontIcon + "</span>";
	html += "		<span style='padding-top:1rem;padding-bottom:2rem;'>" + message + "</span>";
	html += "		<div class='group-h-m' style='width:100%;'>";
	html += "			<span id='btnClose' class='button' style='height:3rem;font-size: 1.5rem;flex-grow:1;text-align:center;'>取消</span>";
	html += "			<span id='btnConfirm' class='button hsboss-color-blue' style='height:3rem;font-size: 1.5rem;flex-grow:1;text-align:center;'>"+confirmText+"</span>";
	html += "		</div>";
	html += "	</div>";
	html += "</div>";
	$("body").append(html);
	$('#btnClose').click(closeTips);
	$('#btnConfirm').click(confirmFunction);
};


/**
 * 关闭信息提示框
 */
function closeTips() {
	$("#divTips").remove();
};

/**
 * 弹出等待
 * @returns
 */
function popUpLoading() {
	var html = "";
	html += "<div id='divLoading' class='eui-loading-view'>";
	html += "	<image src='../../entlogic/icons/loading.gif' style='margin: auto'/>";
	html += "</div>";
	$("body").append(html);
};

/**
 * 关闭等待
 */
function closeLoading() {
	$("#divLoading").remove();
};



/**
 * 弹出等待
 * @returns
 */
function popUpMobLoading() {
	var html = "";
	html += "<div id='divMobLoading' class='eui-loading-view'>";
	html += "	<image src='../../entlogic/icons/loading.gif' style='margin: auto'/>";
	html += "</div>";
	$("body").append(html);
};

/**
 * 关闭等待
 */
function closeMobLoading() {
	$("#divMobLoading").remove();
};

/**
 * 显示错误提示标签
 */
function showErrTip(obj, text) {
	var top = obj.offset().top + 10;
	var left = obj.offset().left + 10;
	var html = "";
	html += "<div id='divTip' class='eui-err-tip' style='top: " + top + "px; left: " + left + "px; width: " + obj.width() + "px;'>";
	html += text;
	html += "</div>";
	$("body").append(html);
};

/**
 * 显示警告提示标签
 */
function showWarTip(obj, text) {
	var top = obj.offset().top + 10;
	var left = obj.offset().left + 10;
	var html = "";
	html += "<div id='divTip' class='eui-war-tip' style='top: " + top + "px; left: " + left + "px; width: " + obj.width() + "px;'>";
	html += text;
	html += "</div>";
	$("body").append(html);
	$("#divTip").attr("class", "eui-war-tip");
};

/**
 * 关闭提示标签
 */
function closeTip() {
	$("#divTip").remove();
};

/**
 * 
 * @param obj
 */
function setDraggable(obj, scale) {

	obj.bind("mousedown", start);

	var x = 0;
	var y = 0;

	var gapX = 0;
	var gapY = 0;

	function start(event) {
		if (event.button == 0) {
			x = obj.offset().left + obj.width() / 2 * scale;
			y = obj.offset().top + obj.height() / 2 * scale;

			gapX = event.clientX;
			gapY = event.clientY;

			obj.css("cursor", "pointer");

			$(document).bind("mousemove", move);
			$(document).bind("mouseup", stop);
		}
		// return false; //阻止默认事件或冒泡
	};

	function move(event) {
		var left = x + event.clientX - gapX - obj.width() / 2;
		var top = y + event.clientY - gapY - obj.height() / 2;

		obj.css({
			"left" : left + "px",
			"top" : top + "px"
		});
		// return false; //阻止默认事件或冒泡
	};

	function stop() {
		obj.css("cursor", "default");

		// 解绑定，这一步很必要，前面有解释
		$(document).unbind("mousemove", move);
		$(document).unbind("mouseup", stop);
	}
};


/**
 * 获取指定的URL参数值
 * URL:http://www.quwan.com/index?name=tyler
 * 参数：paramName URL参数
 * 调用方法:getParam("name")
 * 返回值:tyler
 */
function getUrlParam(paramName) {
    paramValue = "", isFound = !1;
    var url = decodeURI(this.location.search);
    if (url.indexOf("?") == 0 && url.indexOf("=") > 1) {
        arrSource = unescape(url).substring(1, url.length).split("&"), i = 0;
        while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
    }
    return paramValue == "" && (paramValue = null), paramValue
}

/**
 * 获取文件扩展名
 * @param fileName
 * @returns
 */
function getFileExt(fileName) {
	var i = fileName.indexOf("."); 
	if (i < 0) return "";
	while (i >= 0) {
		fileName = fileName.substring(i+1);
		i = fileName.indexOf("."); 
	}
	return fileName;
};

/**
 * 获取用户会话数据项
 * @key 数据项ID 
 * @returns 后台验证码图片url， null：表示发送失败
 */
function getUserSessionItem(key) {
	var parameter = new entlogic_data_record();
	parameter.addItem("key", key);
	var dataPackage = postBpService("com.entlogic.h5.services.SYSService", "getUserSessionItem", parameter);
	if (dataPackage == null) return null;
	var result = dataPackage.getReturn("result");
	if (result == "null") return null;
	if (result == "faild") return null;
	return result;
};

/**
 * 删除用户会话数据项
 * @key 数据项ID 
 * @returns 后台验证码图片url， null：表示发送失败
 */
function removeUserSessionItem(key) {
	var parameter = new entlogic_data_record();
	parameter.addItem("key", key);
	var dataPackage = postBpService("com.entlogic.h5.services.SYSService", "removeUserSessionItem", parameter);
	if (dataPackage == null) return null;
	var result = dataPackage.getReturn("result");
	if (result == "null") return null;
	if (result == "faild") return null;
	return result;
};

/**
 * 设置用户会话数据项
 * @key 数据项ID
 * @value 数据项取值
 * @returns 后台验证码图片url， null：表示发送失败
 */
function setUserSessionItem(key, value) {
	var parameter = new entlogic_data_record();
	parameter.addItem("key", key);
	parameter.addItem("value", value);
	var dataPackage = postBpService("com.entlogic.h5.services.SYSService", "setUserSessionItem", parameter);
	if (dataPackage == null) return null;
	var result = dataPackage.getReturn("result");
	if (result == "null") return null;
	if (result == "faild") return null;
	return result;
};

/**
 * 获取后台验证码图像
 * 
 * @returns 后台验证码图片url， null：表示发送失败
 */
function getCheckCodeImage() {
	var parameter = new entlogic_data_record();
	var dataPackage = postBpService("com.entlogic.h5.services.SYSService", "getCheckCodeImage", parameter);
	if (dataPackage == null) return null;
	var result = dataPackage.getReturn("result");
	if (result == "null") return null;
	if (result == "faild") return null;
	return result;
};

/**
 * 获取后台验证码图像
 * 
 * @returns 后台验证码图片url， null：表示发送失败
 */
function verifyCheckCode(checkCode) {
	var parameter = new entlogic_data_record();
	parameter.addItem("checkCode", checkCode);
	var dataPackage = postBpService("com.entlogic.h5.services.SYSService", "verifyCheckCode", parameter);
	if (dataPackage == null) return false;
	var result = dataPackage.getReturn("result");
	if (result == "faild" || result == "not success") return false;
	return true;
};

/**
 * 人员身份验证
 * @param name
 * @param certCode
 * @param phone
 * @returns 0：符合，-1：不符合，null：查询失败
 */
function auditCert(name, certCode) {
	var parameter = new entlogic_data_record();
	parameter.addItem("name", name);
	parameter.addItem("certCode", certCode);
	var dataPackage = postBpService("com.entlogic.h5.services.SYSService", "auditCert", parameter);
	if (dataPackage == null) return null;
	var result = dataPackage.getReturn("result");
	if (result == "null") return null;
	if (result == "faild") return null;
	return result;
};

/**
 * 格式化日期时间
 * 
 * @param d
 * @param f
 * @returns
 */
function formatDateTime(d, f) {
	var year = d.getFullYear() + "";
	var month = d.getMonth() + 1;
	if (month < 10) {
		month = "0" + month;
	}
	var date = d.getDate();
	if (date < 10) {
		data = "0" + date;
	}
	var hours = d.getHours();
	if (hours < 10) {
		hours = "0" + hours;
	}
	var minutes = d.getMinutes();
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	var seconds = d.getSeconds();
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	
	var str = f.replace("YYYY", year);
	str = str.replace("MM", month);
	str = str.replace("DD", date);
	str = str.replace("hh", hours);
	str = str.replace("mm", minutes);
	str = str.replace("ss", seconds);
	
	return str;
};

