/////////////////////////////////////////////////////////////////////////////////////////////////
// 应用常量声明

// 全局应用
var application = parent.application;

// 应用的根目录
var applicationRoot = parent.applicationRoot;

//应用的根目录
var sessionId = parent.sessionId;

//本页面控件容器
var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
//  数据组件声明    

var dboHS_CODE_TYPE = null;
var dboHS_CODE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var txtSn = null;
var txtTypeCode = null;
var txtTypeName = null;
var txtDescription = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var codeTypeOid = getUrlParam("codeTypeOid");


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
   dboHS_CODE_TYPE = new entlogic_dbo("HSBOSS", "HS_CODE_TYPE");
   dboHS_CODE = new entlogic_dbo("HSBOSS", "HS_CODE");
	
	// 初始化交互组件
   txtSn = new entlogic_ui_text("txtSn", formControls);
   txtSn.setBindingData(dboHS_CODE_TYPE.dataTable, "SN");

   txtTypeCode = new entlogic_ui_text("txtTypeCode", formControls);
   txtTypeCode.setBindingData(dboHS_CODE_TYPE.dataTable, "TYPE_CODE");

   txtTypeName = new entlogic_ui_text("txtTypeName", formControls);
   txtTypeName.setBindingData(dboHS_CODE_TYPE.dataTable, "TYPE_NAME");

   txtDescription = new entlogic_ui_textarea("txtDescription", formControls);
   txtDescription.setBindingData(dboHS_CODE_TYPE.dataTable, "DESCRIPTION");
   
   $("#btnSave").click(btnSave_click);
    OK = btnSave_click;
};

// 加载编码类型数据
function loadCodeType() {
	// 查询获取数据
	if (codeTypeOid == null) {
		var maxSn = dboHS_CODE_TYPE.getMax("SN");
        if (maxSn == null) {
            maxSn = 1 
        } else {
            maxSn ++;
        }
		var dr = dboHS_CODE_TYPE.execCreate();
        dr.setItem("SN", maxSn + "");
		dr.setItem("TYPE_CODE", "新编码类别");
		dr.setItem("TYPE_NAME", "新编码类别");
		dboHS_CODE_TYPE.dataTable.addRecord(dr);
		dboHS_CODE_TYPE.dataTable.setSelectedIndex(0);
		dboHS_CODE_TYPE.dataTable.synchronizeLayout();
	} else {
		dboHS_CODE_TYPE.whereClause = "where OID = '" + codeTypeOid + "'";
		dboHS_CODE_TYPE.execQuery();
      
		dboHS_CODE.whereClause = "where HS_CODE_TYPE = '" + codeTypeOid + "'";
		if (dboHS_CODE.count() > 0) {
            txtSn.setEnabled(false);
			txtTypeCode.setEnabled(false);
		}
	}
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
    // 调用组件初始化
    inittKeys();
	initComponents();
   
    // 加载数据
	loadCodeType();
};

// 保存按钮单击事件响应
function btnSave_click() {
    // 更新数据
	if (codeTypeOid == null) {
		if (dboHS_CODE_TYPE.getByOid(txtTypeCode.getValue()) != null) {
        	alert("编码类型编码冲突！！");
            return;
        }
        var dr = dboHS_CODE_TYPE.dataTable.getRecord(0);
        dr.setItem("OID", txtTypeCode.getValue());
		dboHS_CODE_TYPE.execInsert();
	} else {
		dboHS_CODE_TYPE.execUpdate();
	}
	codeTypeOid = txtTypeCode.getValue();
    
    // 返回主页面
	dialogCallBack(codeTypeOid);
    closeDialog();
};
