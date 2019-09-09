/////////////////////////////////////////////////////////////////////////////////////////////////
// 应用常量声明

// 应用的根目录
var applicationRoot = localStorage.getItem("applicationRoot");

//本页面控件容器
 var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
//  数据组件声明    
var dboXXX = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   



/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var xxxOid = null;

 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	// 初始化数据组件
    dboXXX = new entlogic_dbo("XXXSYS", "XXX");
   
	// 初始化交互组件
   
    $("#btnSave").click(btnSave_click);
};

// 加载数据
function loadData() {
    /*
    if (xxxOid == null) {
      	var drNew = dboXXX.execCreate();
        drNew.setItem("PARENT_OID", parentOid);
      	drNew.setItem("TYPE_CODE", "新类型编码");
      	drNew.setItem("TYPE_NAME", "新类型名称");
       
      	dboXXX.dataTable.addRecord(drNew);
      	dboXXX.dataTable.setSelectedIndex(0);
      	dboXXX.dataTable.synchronizeLayout();
    }
    else {
        dboXXX.whereClause = "where OID = '" + xxxOid + "'";
        dboXXX.execQuery();
    }
    */
};

// 数据检查
function checkData() {
    // 检查结果
    var result = true;
    var prompt = "错误提示：";
    
    // 检查用户名冲突
    /*
    txtUserName.setErrMessage("");
    txtUserName.setErrMessage("");
    if (txtUserName.getValue() == "") {
        txtUserName.setErrMessage("登陆账号不能为空！！");
        prompt += "\n登陆账号不能为空！！";
        result = result & false;
    }
    var currentUser = dboFW_USER.dataTable.getRecord(0);
    if (currentUser.getValue("OID") == "" && dboFW_USER.getByOid(txtUserName.getValue()) != null) {
        txtUserName.setErrMessage("登录账号已存在！！");
        prompt += "\n登录账号已存在！！";
        result = result & false;
    }
    */
    
    // 弹出提示框
    if (!result) {
        alert(prompt);
    }
    
    return result;
};

// 保存数据
function saveData() {
    /*
	if (xxxOid == null) {
        var dr = dboXXX.dataTable.getRecord(0);
        xxxOid = dr.getValue("id");
        dr.setItem("OID", xxxOid);
		dboXXX.execInsert();
        dboXXX.resetOrderCode();
	} else {
		dboXXX.execUpdate();
	}
    */
    return true;
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 接受传递参数
    // xxxOid = getUrlParam("xxxOid");

    // 调用组件初始化
	initComponents();
	
	// 用户定义初始化
	loadData();
};

// 保存按钮单击事件响应
function btnSave_click() {
    // 检查数据合法性
    if (!checkData()) return;
    
    // 保存数据
    saveData();
	
	// 返回父窗口
	dialogCallBack(xxxOid);
    closeDialog();
};
