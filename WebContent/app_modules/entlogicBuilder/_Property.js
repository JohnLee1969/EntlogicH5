/////////////////////////////////////////////////////////////////////////////////////////////////
//  应用常量声明    

// 全局应用
var application = parent.application;

// 应用的根目录
var applicationRoot = parent.applicationRoot;

//应用的根目录
var sessionId = parent.sessionId;

// 页面控件容器
var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
// 数据组件声明    
var data = {};


/////////////////////////////////////////////////////////////////////////////////////////////////
// 交互组件声明   
var txtTagName = {};
var txtId = {};
var txtClass = {};
var txtContent = {};
var txtType = {};
var txtSrc ={};
var txtValue = {};
var txtPattem = {};
var txtPlaceholder = {};
var txtTitle = {};

var selPosition = {};
var txtFlexGrow = {};
var txtMargin = {};
var txtWidth = {};
var txtHeight = {};
var txtWidth = {};
var txtTop = {};
var txtBottom = {};
var txtLeft = {};
var txtRight = {};

var txtPadding = {};
var txtBackgroundColor = {};
var txtBackgroundImage = {};
var txtBorderWidth = {};
var txtBordereColor = {};
var txtBorderRadius = {};
var selOverflowX = {};
var selOverflowY = {};

var txtFontFamily = {};
var txtFontSize = {};
var txtFontColor = {};
var selFontStyle = {};
var selFontWeight = {};
var txtOthers = {};


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量生命
var styles = {};


/////////////////////////////////////////////////////////////////////////////////////////////////
// 函数调用声明

/**
 * 组件初始化
 */ 
function initComponents() {
	// 初始化数据组件
	data = new entlogic_data_record();
	
	// 初始化交互组件
	txtTagName = new entlogic_ui_text("txtTagName", formControls);
	txtId = new entlogic_ui_text("txtId", formControls);
	txtClass = new entlogic_ui_text("txtClass", formControls);
	txtContent = new entlogic_ui_text("txtContent", formControls);
	txtType = new entlogic_ui_text("txtType", formControls);
	txtSrc = new entlogic_ui_text("txtSrc", formControls);
	txtValue = new entlogic_ui_text("txtValue", formControls);
	txtPattem = new entlogic_ui_text("txtPattem", formControls);
	txtPlaceholder = new entlogic_ui_text("txtPlaceholder", formControls);
	txtTitle = new entlogic_ui_text("txtTitle", formControls);
	
	selPosition = new entlogic_ui_select("selPosition", formControls);
	txtFlexGrow = new entlogic_ui_text("txtFlexGrow", formControls);
	txtMargin = new entlogic_ui_text("txtMargin", formControls);
	txtWidth = new entlogic_ui_text("txtWidth", formControls);
	txtHeight = new entlogic_ui_text("txtHeight", formControls);
	txtTop = new entlogic_ui_text("txtTop", formControls);
	txtBottom = new entlogic_ui_text("txtBottom", formControls);
	txtLeft = new entlogic_ui_text("txtLeft", formControls);
	txtRight = new entlogic_ui_text("txtRight", formControls);
	
	txtPadding = new entlogic_ui_text("txtPadding", formControls);
	txtBackgroundColor = new entlogic_ui_text("txtBackgroundColor", formControls);
	txtBackgroundImage = new entlogic_ui_text("txtBackgroundImage", formControls);
	selBorderStyle = new entlogic_ui_select("selBorderStyle", formControls);
	txtBorderWidth = new entlogic_ui_text("txtBorderWidth", formControls);
	txtBorderColor = new entlogic_ui_text("txtBorderColor", formControls);
	txtBorderRadius = new entlogic_ui_text("txtBorderRadius", formControls);
	selOverflowX = new entlogic_ui_select("selOverflowX", formControls);
	selOverflowY = new entlogic_ui_select("selOverflowY", formControls);
	
	txtFontFamily = new entlogic_ui_text("txtFontFamily", formControls);
	txtFontSize = new entlogic_ui_text("txtFontSize", formControls);
	txtFontColor = new entlogic_ui_text("txtFontColor", formControls);
	selFontStyle = new entlogic_ui_select("selFontStyle", formControls);
	selFontWeight = new entlogic_ui_select("selFontWeight", formControls);
	txtOthers = new entlogic_ui_textarea("txtOthers", formControls);

	$("#txtTagName").change(property_change);
	$("#txtId").change(property_change);
	$("#txtClass").change(property_change);
	$("#txtContent").change(property_change);
	$("#txtType").change(property_change);
	$("#txtSrc").change(property_change);
	$("#txtValue").change(property_change);
	$("#txtPattem").change(property_change);
	$("#txtPlaceholder").change(property_change);
	$("#txtTitle").change(property_change);

	$("#selPosition").change(property_change);
	$("#txtFlexGrow").change(property_change);
	$("#txtMargin").change(property_change);
	$("#txtWidth").change(property_change);
	$("#txtHeight").change(property_change);
	$("#txtTop").change(property_change);
	$("#txtBottom").change(property_change);
	$("#txtLeft").change(property_change);
	$("#txtRight").change(property_change);
	
	$("#txtPadding").change(property_change);
	$("#txtBackgroundColor").change(property_change);
	$("#txtBackgroundImage").change(property_change);
	$("#selBorderStyle").change(property_change);
	$("#txtBorderWidth").change(property_change);
	$("#txtBorderColor").change(property_change);
	$("#txtBorderRadius").change(property_change);
	$("#selOverflowX").change(property_change);
	$("#selOverflowY").change(property_change);

	$("#txtFontFamily").change(property_change);
	$("#txtFontSize").change(property_change);
	$("#selFontSizeUnit").change(property_change);
	$("#txtFontColor").change(property_change);
	$("#selFontStyle").change(property_change);
	$("#selFontWeight").change(property_change);
	$("#txtOthers").change(property_change);

	$("#btnBaseProperties").click(btnBaseProperties_click);
	$("#btnContainerProperties").click(btnContainerProperties_click);
	$("#btnItemProperties").click(btnItemProperties_click);
	$("#btnFontProperties").click(btnFontProperties_click);
	$("#btnOthersProperties").click(btnOthersProperties_click);
	
	$("#btnPickBackgroundColor").click(function() {
			parent.popUpDialog("ColorPickerDialog.html", 200, 150, "获取颜色", function(color) {
			txtBackgroundColor.setValue(color);
			property_change();
		});
	});
	
	$("#btnPickBorderColor").click(function() {
			parent.popUpDialog("ColorPickerDialog.html", 200, 150, "获取颜色", function(color) {
			txtBorderColor.setValue(color);
			property_change();
		});
	});
	
	$("#btnPickFontColor").click(function() {
			parent.popUpDialog("ColorPickerDialog.html", 200, 150, "获取颜色", function(color) {
			txtFontColor.setValue(color);
			property_change();
		});
	});
};

function getStyleValue(key) {
	var k = ""; 
	var v = "";
	var a = {};
	for (var i = 0; i < styles.length; i++) {
		k = "";
		v ="";
		a = styles[i].split(":");
		if (a.length != 2) continue;
		k = a[0].trim();
		if (k == key) {
			v = a[1];
			break;
		}
	}
	return v.trim();
};

/**
 * 加载数据
 */
function loadProperty(d) {
	data = d;
	
	var tagName = data.getItemByKey("tagName").value;
	if (tagName == "input" || tagName == "option") {
		$("#grpInputProperties").show();
	} else {
		$("#grpInputProperties").hide();
	}
	
	if (tagName == "image" || tagName == "iframe" || tagName == "video") {
		$("#grpResourceProperties").show();
	} else {
		$("#grpResourceProperties").hide();
	}
	
	txtTagName.setValue(tagName);
	txtId.setValue(data.getItemByKey("id").value);
	txtClass.setValue(data.getItemByKey("class").value);
	txtContent.setValue(data.getItemByKey("content").value);	
	txtSrc.setValue(data.getItemByKey("src").value);
	txtType.setValue(data.getItemByKey("type").value);
	txtValue.setValue(data.getItemByKey("value").value);
	txtPattem.setValue(data.getItemByKey("pattem").value);
	txtPlaceholder.setValue(data.getItemByKey("placeholder").value);
	txtTitle.setValue(data.getItemByKey("title").value);
	
	var styleString = data.getItemByKey("style").value;
	styles = styleString.split(";");
	
	var  position = getStyleValue("position");
//	if (position == "absolute") {
//		$("#grpAbsoluteProperties").show();
//	} else {
//		$("#grpAbsoluteProperties").hide();
//	}
	
	selPosition.setValue(position);
	txtFlexGrow.setValue(getStyleValue("flex-grow"));
	txtMargin.setValue(getStyleValue("margin"));
	txtWidth.setValue(getStyleValue("width"));
	txtHeight.setValue(getStyleValue("height"));
	txtTop.setValue(getStyleValue("top"));
	txtBottom.setValue(getStyleValue("bottom"));
	txtLeft.setValue(getStyleValue("left"));
	txtRight.setValue(getStyleValue("right"));
	
	txtPadding.setValue(getStyleValue("padding"));
	txtBackgroundColor.setValue(getStyleValue("background-color"));	
	txtBackgroundImage.setValue(getStyleValue("background-image"));	
	selBorderStyle.setValue(getStyleValue("border-style"));
	txtBorderWidth.setValue(getStyleValue("border-width"));
	txtBorderColor.setValue(getStyleValue("border-color"));
	txtBorderRadius.setValue(getStyleValue("border-radius"));
	selOverflowX.setValue(getStyleValue("overflow-x"));
	selOverflowY.setValue(getStyleValue("overflow-y"));
	
	txtFontFamily.setValue(getStyleValue("font-family"));
	txtFontSize.setValue(getStyleValue("font-size"));
	txtFontColor.setValue(getStyleValue("color"));
	selFontStyle.setValue(getStyleValue("font-style"));
	selFontWeight.setValue(getStyleValue("font-weight"));
	txtOthers.setValue(getStyleValue(""));
};

/**
 * 保存数据
 */
function saveProperty() {
	data.setItem("id",  txtId.getValue());
	data.setItem("text", "[" + txtTagName.getValue() + " id='" +  txtId.getValue() + "' class='" + txtClass.getValue() + "']");
	data.setItem("tagName", txtTagName.getValue());
	data.setItem("class", txtClass.getValue());
	data.setItem("content", txtContent.getValue());
	data.setItem("src", txtSrc.getValue());
	data.setItem("type", txtType.getValue());
	data.setItem("value", txtValue.getValue());
	data.setItem("pattem", txtPattem.getValue());
	data.setItem("placeholder", txtPlaceholder.getValue());
	data.setItem("title", txtTitle.getValue());
	
	var style ="";
	if (selPosition.getValue() != "") style += "position: " + selPosition.getValue() +";";
	if (txtMargin.getValue() != "") style += "margin: " + txtMargin.getValue() +";";
	if (txtWidth.getValue() != "") style += "width: " + txtWidth.getValue() +";";
	if (txtHeight.getValue() != "") style += "height: " + txtHeight.getValue() +";";
	if (txtFlexGrow.getValue() != "") style += "flex-grow: " + txtFlexGrow.getValue() +";";
	if (txtTop.getValue() != "") style += "top: " + txtTop.getValue() +";";
	if (txtBottom.getValue() != "") style += "bottom: " + txtBottom.getValue() +";";
	if (txtLeft.getValue() != "") style += "left: " + txtLeft.getValue() +";";
	if (txtRight.getValue() != "") style += "right: " + txtRight.getValue() +";";
	
	if (txtPadding.getValue() != "") style += "padding: " + txtPadding.getValue() +";";
	if (txtBackgroundColor.getValue() != "") style += "background-color: " + txtBackgroundColor.getValue() +";";
	if (txtBackgroundImage.getValue() != "") style += "background-image: " + txtBackgroundImage.getValue() +";";
	if (selBorderStyle.getValue() != "") style += "border-style: " + selBorderStyle.getValue() +";";
	if (txtBorderWidth.getValue() != "") style += "border-width: " + txtBorderWidth.getValue() +";";
	if (txtBorderColor.getValue() != "") style += "border-color: " + txtBorderColor.getValue() +";";
	if (txtBorderRadius.getValue() != "") style += "border-radius: " + txtBorderRadius.getValue() +";";
	if (selOverflowX.getValue() != "") style += "overflow-x: " + selOverflowX.getValue() +";";
	if (selOverflowY.getValue() != "") style += "overflow-y: " + selOverflowY.getValue() +";";
	
	if (txtFontFamily.getValue() != "") style += "font-family: " + txtFontFamily.getValue() +";";
	if (txtFontSize.getValue() != "") style += "font-size: " + txtFontSize.getValue() +";";
	if (txtFontColor.getValue() != "") style += "color: " + txtFontColor.getValue() +";";
	if (selFontStyle.getValue() != "") style += "font-style: " + selFontStyle.getValue() +";";
	if (selFontWeight.getValue() != "") style += "font-weight: " + selFontWeight.getValue() +";";
	style += txtOthers.getValue();
	
	data.setItem("style", style);

	return data;
};




/////////////////////////////////////////////////////////////////////////////////////////////////
// 交互事件响应

/**
 * 父页面打开事件处理
 */ 
function bodyOnload() {
	// 调用组件初始化
    initKeys();
	initComponents();
};

/**
 * 
 */
function btnBaseProperties_click() {
	var mode = $("#btnBaseProperties").html();
	if (mode == "▼") {
		$("#btnBaseProperties").html("►");
		$("#grpBaseProperties").hide();
	} else {
		$("#btnBaseProperties").html("▼");
		$("#grpBaseProperties").show();
	};
};

/**
 * 
 */
function btnContainerProperties_click() {
	var mode = $("#btnContainerProperties").html();
	if (mode == "▼") {
		$("#btnContainerProperties").html("►");
		$("#grpContainerProperties").hide();
	} else {
		$("#btnContainerProperties").html("▼");
		$("#grpContainerProperties").show();
	};
};

/**
 * 
 */
function btnItemProperties_click() {
	var mode = $("#btnItemProperties").html();
	if (mode == "▼") {
		$("#btnItemProperties").html("►");
		$("#grpItemProperties").hide();
	} else {
		$("#btnItemProperties").html("▼");
		$("#grpItemProperties").show();
	};
};

/**
 * 
 */
function btnFontProperties_click() {
	var mode = $("#btnFontProperties").html();
	if (mode == "▼") {
		$("#btnFontProperties").html("►");
		$("#grpFontProperties").hide();
	} else {
		$("#btnFontProperties").html("▼");
		$("#grpFontProperties").show();
	};
};

/**
 * 
 */
function btnOthersProperties_click() {
	var mode = $("#btnOthersProperties").html();
	if (mode == "▼") {
		$("#btnOthersProperties").html("►");
		$("#grpOthersProperties").hide();
	} else {
		$("#btnOthersProperties").html("▼");
		$("#grpOthersProperties").show();
	};
};

/**
 * 
 */
function property_change() {
	if (parent.readOnly) {
		loadProperty(data);
		return;
	};
	var tagName = txtTagName.getValue();
	if (tagName == "input") {
		$("#grpInputProperties").show();
	} else {
		$("#grpInputProperties").hide();
	}
	
	if (tagName == "image" || tagName == "iframe") {
		$("#grpResourceProperties").show();
	} else {
		$("#grpResourceProperties").hide();
	}

	var id =  txtId.getValue();
	if (this.id == "txtId" && id != "" && parent.tvwHtmlBodyNode.getNode(id) != null) {
		alert("对象id冲突！！！");
		txtId.setValue(data.getValue("id"));
		return;
	}
	
	var pData = saveProperty();
	parent.updateProperties(pData);
};
