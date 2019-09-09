/**
 * 
 * @param htmlString
 */
function entlogic_html_node() {
	this.lable = "";
	this.id = "";
	this.attrType = "";
	this.attrClass = "";
	this.attrStyle = "";
	
	this.parent = {};
	this.children =new Array();
	
	var _this = this;
	
	this.loadText = function(text) {
		// 将字符串转换为DOM对象
		var div = document.createElement("div");
		div.innerHTML  = text;
		
		_this.lable = "root";
		_this.id = "root";
		_this.attrType ="";
		_this.attrClass = "";
		_this.attrStyle = "";
		_this.parent = {};
		
		var n = div.childNodes.length;
		for (var i = 0; i < n; i++) {
			_this.children.push(_this.loadNode(div.childNodes[i], _this));
		}
	};
	
	this.loadNode = function(domObject, parentNode) {
		var childNode = new entlogic_html_node();
		childNode.lable = domObject.tagName;
//		childNode.id = domObject.attr("id");
//		childNode.attrType = domObject.attr("type");
//		childNode.attrClass = domObject.attr("class");
//		childNode.attrStyle = domObject.attr("style");
		childNode.parent = parentNode;
		
		var n = domObject.childNodes.length;
		for (var i = 0; i < n; i++) {
			childNode.children.push(childNode.loadNode(domObject.childNodes[i], childNode));
		}
		return childNode;
	};
	
	this.exportDataTable = function(node, dt, level) {
		var dr = new entlogic_data_record();
		dr.addItem("id", node.id);
		dr.addItem("lv", level);
		dr.addItem("lable", node.lable);
		dr.addItem("attrType", node.attrType);
		dr.addItem("attrClass", node.attrClass);
		dr.addItem("attrStyle", node.attrStyle);
		dt.addRecord(dr);
		
		var n = node.children.length;
		level++;
		for(var  i = 0; i < n; i++) {
			dt = _this.exportDataTable(node.children[i], dt, level);
		}
		
		return dt;
	};
};