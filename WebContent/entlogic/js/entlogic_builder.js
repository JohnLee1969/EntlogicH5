/**
 * 当前屏幕
 */
var screen = null;

/**
 * 当前选中对象
 */
var selectedObj = null;

/**
 * 设计页面刷新事件
 * @returns
 */
function desingPageOnLoad() {		
	setObjectClick(parent.dtHtmlBodyNode);
	setHighlight(parent.tvwHtmlBodyNode.getValue());
	
	var dataRecord = parent.tvwHtmlBodyNode.currentNode.data;
	parent.docProperty.loadProperty(dataRecord);
};

/**
 * 设置设计对象单击响应
 * 
 * @param dtDomObjects
 */
function setObjectClick(dtDomObjects) {
	var objectId = "";
	var objectTagName = "";
    var domObject = {};
    for(var i = 0; i < dtDomObjects.getSize(); i ++) {
    	objectId = dtDomObjects.getRecord(i).getItemByKey("id").value;
    	domObject = $("#" + objectId);
    	domObject.click(object_click);
   	
    	objectTagName = dtDomObjects.getRecord(i).getItemByKey("tagName").value;
    	if (objectTagName == "div") {
    		domObject.css("border","1px dashed #888");
    	}
   }
};

/**
 * 点亮设计对象
 * 
 * @param objectId
 */
function setHighlight(objectId) {
	if (objectId == "body") {
		divHighlight_click();
		return;
	}
	
	$("#divHighlight").remove();
	closeMouseRightMenu();
	
	selectedObj = $("#" +objectId);
	if (selectedObj.length <= 0)	return;
	 
	var top = selectedObj.offset().top;
	var left = selectedObj.offset().left;
	var width = selectedObj.outerWidth();
	var height = selectedObj.outerHeight();
	if (parent.appName.indexOf(".mob") > 0) {
		width -= 4;
		height -= 4;
	}
	var html = "";
	html += "<div id='divHighlight'  class='eb-highlight' style='left:" + left + "px; top: " + top + "px; width: " + width + "px; height:" + height +"px;' onclick='divHighlight_click()'>";
	html += "</div>";
	$("body").append(html);
	
	$("#divHighlight").bind("contextmenu", function(e) {
		var x = e.pageX;
		var y = e.pageY;
		if (x > 80) x -= 60;
		if (y > 180) y -= 90;
		popUpMouseRightMenu(x, y, [{
    		text: '拷贝',
    		icon: '',
    		action: 'copyElement'
    	}, {
    		text: '粘贴',
        	icon: '',
           	action: 'pasteElement'
       }, {
    		text: '删除',
        	icon: '',
        	action: 'deleteElement'
    	}]);
		return false;
	});
};

/**
 * 拷贝当前对象到剪切板
 */
function copyElement() {
	parent.copyCom();
	closeMouseRightMenu();
};

/**
 * 粘贴剪切板数据到设计视图
 */
function pasteElement() {
	parent.pasteCom();
	closeMouseRightMenu();
};

/**
 * 删除当前设计对象
 */
function deleteElement() {
	parent.deleteCom();
	closeMouseRightMenu();
};

/**
 * 弹出右键菜单
 * @param menu
 */
function popUpMouseRightMenu(x, y, menu) {
	if (parent.readOnly) return;
	
	var mouseRightMenu = $("#divMouseRightMenu");
	if (mouseRightMenu.length == 0) {
		var html = "";
		html += "<div id='divMouseRightMenu' class='eb-mouse-right-menu'>";
		for(var i = 0; i < menu.length; i++) {
			html += "<div id='divMouseRightMenu_" + i + "' class='eb-mouse-right-menu-item' onclick='" + menu[i].action + "()'>";
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
 * 高亮框单击事件
 */
function divHighlight_click() {
	$("#divHighlight").remove();
	closeMouseRightMenu();
	selectedObj ={};
	return false;
}

/**
 * 设计对象点击事件
 * @returns {Boolean}
 */
function object_click() {
	if (this.id == "body") return;
	
	setHighlight(this.id);
	parent.tvwHtmlBodyNode.setValue(this.id);
	
	var dataRecord = parent.tvwHtmlBodyNode.currentNode.data;
	parent.docProperty.loadProperty(dataRecord);

	return false;
};


