/////////////////////////////////////////////////////////////////////////////////////////////////
// 应用常量声明

// 全局应用
var application = parent.application;

// 应用的根目录
var applicationRoot = parent.applicationRoot;

//应用的根目录
var sessionId = parent.sessionId;

// 页面控件容器
var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
//  数据组件声明    
var dboFW_CODE_TYPE = null;
var dboFW_CODE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var txtSn = null;
var txtTypeCode = null;
var txtTypeName = null;
var txtDescription = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var codeTypeOid = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
   dboFW_CODE_TYPE = new entlogic_dbo("entlogicSystem", "FW_CODE_TYPE");
   dboFW_CODE = new entlogic_dbo("entlogicSystem", "FW_CODE");
	
	// 初始化交互组件
   txtSn = new entlogic_ui_text("txtSn", formControls);
   txtSn.setBindingData(dboFW_CODE_TYPE.dataTable, "SN");

   txtTypeCode = new entlogic_ui_text("txtTypeCode", formControls);
   txtTypeCode.setBindingData(dboFW_CODE_TYPE.dataTable, "TYPE_CODE");

   txtTypeName = new entlogic_ui_text("txtTypeName", formControls);
   txtTypeName.setBindingData(dboFW_CODE_TYPE.dataTable, "TYPE_NAME");

   txtDescription = new entlogic_ui_textarea("txtDescription", formControls);
   txtDescription.setBindingData(dboFW_CODE_TYPE.dataTable, "DESCRIPTION");
   
   $("#btnSave").click(btnSave_click);
};

// 加载编码类型数据
function loadCodeType() {
	// 查询获取数据
	if (codeTypeOid == null) {
		var maxSn = dboFW_CODE_TYPE.getMax("SN");
        if (maxSn == null) {
            maxSn = 1 
        } else {
            maxSn ++;
        }
		var dr = dboFW_CODE_TYPE.execCreate();
        dr.setItem("SN", maxSn + "");
		dr.setItem("TYPE_CODE", "新编码类别");
		dr.setItem("TYPE_NAME", "新编码类别");
		dboFW_CODE_TYPE.dataTable.addRecord(dr);
		dboFW_CODE_TYPE.dataTable.setSelectedIndex(0);
		dboFW_CODE_TYPE.dataTable.synchronizeLayout();
	} else {
		dboFW_CODE_TYPE.whereClause = "where OID = '" + codeTypeOid + "'";
		dboFW_CODE_TYPE.execQuery();
      
		dboFW_CODE.whereClause = "where CODE_TYPE_OID = '" + codeTypeOid + "'";
		if (dboFW_CODE.count() > 0) {
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
    initKeys();
	initComponents();
    
	// 接受传递参数
	codeTypeOid = getUrlParam("codeTypeOid");  
	
	// 用户定义初始化
	loadCodeType();
};

// 保存按钮单击事件响应
function btnSave_click() {
	if (codeTypeOid == null) {
		if (dboFW_CODE_TYPE.getByOid(txtTypeCode.getValue()) != null) {
        	alert("编码类型编码冲突！！");
            return;
        }
        var dr = dboFW_CODE_TYPE.dataTable.getRecord(0);
 		codeTypeOid = txtTypeCode.getValue();
       	dr.setItem("OID", codeTypeOid);
		dboFW_CODE_TYPE.execInsert();
	} else {
		dboFW_CODE_TYPE.execUpdate();
	}
	dialogCallBack(codeTypeOid);
    closeDialog();
};
