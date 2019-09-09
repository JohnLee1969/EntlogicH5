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
var dboBD_BUG = null;
var dboBD_BUG_IMAGES = null;

/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var lstBugImage = null;
var txtBugName = null;
var selPriority = null;
var selStatus = null;
var txtTestDesc = null;
var txtTestUser = null;
var txtTestTime = null;
var txtRepairDesc = null;
var txtRepairUser = null;
var txtRepairTime = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var userOid = parent.userOid;
var moduleOid = getUrlParam("moduleOid");
var bugOid = getUrlParam("bugOid");

 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	// 初始化数据组件
    dboBD_BUG = new entlogic_dbo("entlogicBuilder", "BD_BUG");
    dboBD_BUG_IMAGES = new entlogic_dbo("entlogicBuilder", "BD_BUG_IMAGES");  
   
	// 初始化交互组件
    lstBugImage = new entlogic_ui_list("lstBugImage", formControls);
    lstBugImage.setBindingData(dboBD_BUG_IMAGES.dataTable);
    
    txtBugName = new entlogic_ui_text("txtBugName", formControls);
    txtBugName.setBindingData(dboBD_BUG.dataTable, "BUG_NAME");
    
    selPriority = new entlogic_ui_select("selPriority", formControls);
    selPriority.setBindingData(dboBD_BUG.dataTable, "PRIORITY");
    
    selStatus = new entlogic_ui_select("selStatus", formControls);
    selStatus.setBindingData(dboBD_BUG.dataTable, "STATUS");
    selStatus.setEnabled(false);
    
    txtTestDesc = new entlogic_ui_textarea("txtTestDesc", formControls);
    txtTestDesc.setBindingData(dboBD_BUG.dataTable, "TEST_DESC");
    
    txtTestUser = new entlogic_ui_text("txtTestUser", formControls);
    txtTestUser.setBindingData(dboBD_BUG.dataTable, "TEST_USER");
    txtTestUser.setEnabled(false);
    
    txtTestTime = new entlogic_ui_text("txtTestTime", formControls);
    txtTestTime.setBindingData(dboBD_BUG.dataTable, "TEST_TIME");
    txtTestTime.setEnabled(false);
     
    txtRepairDesc = new entlogic_ui_textarea("txtRepairDesc", formControls);
    txtRepairDesc.setBindingData(dboBD_BUG.dataTable, "REPAIR_DESC");
    
    txtRepairUser = new entlogic_ui_text("txtRepairUser", formControls);
    txtRepairUser.setBindingData(dboBD_BUG.dataTable, "REPAIR_USER");
    txtRepairUser.setEnabled(false);
    
    txtRepairTime = new entlogic_ui_text("txtRepairTime", formControls);
    txtRepairTime.setBindingData(dboBD_BUG.dataTable, "REPAIR_TIME");
    txtRepairTime.setEnabled(false);
  
    $("#btnUploadBugImage").click(btnUploadBugImage_click);
    $("#btnDeleteBugImage").click(btnDeleteBugImage_click);
    $("#btnSave").click(btnSave_click);
    $("#btnAccept").click(btnAccept_click);
    $("#btnRollBack").click(btnRollBack_click);
    $("#btnCommit").click(btnCommit_click);
};

// 加载数据
function loadBug() {
    if (bugOid == null) {
      	var drNew = dboBD_BUG.execCreate();
      	drNew.setItem("MODULE", moduleOid);
      	drNew.setItem("BUG_NAME", "新错误");
      	drNew.setItem("TEST_USER", userOid);
       	drNew.setItem("STATUS", "创建中");
      
      	dboBD_BUG.dataTable.addRecord(drNew);
      	dboBD_BUG.dataTable.setSelectedIndex(0);
        
        var url = "../entlogicCommon/AccessoryImageFrame.html?bizOid=" + drNew.getValue("id");
        $("#iframeAccessory").attr("src", url);
    }
    else {
        dboBD_BUG.whereClause = "where OID = '" + bugOid + "'";
        dboBD_BUG.execQuery();
        
        var url = "../entlogicCommon/AccessoryImageFrame.html?bizOid=" +bugOid;
        $("#iframeAccessory").attr("src", url);
    }
};

// 加载错误截图
function loadBugImage() {
    dboBD_BUG_IMAGES.whereClause = "where BUG = '" + bugOid + "'";
    dboBD_BUG_IMAGES.orderByClause = "order by SN";
	dboBD_BUG_IMAGES.execQuery();
};

// 根据状态设置显示
function setStatusView() {
    var status = selStatus.getValue();
    var testUser = txtTestUser.getValue();
    var repairUser = txtRepairUser.getValue();
    if (status == "创建中") {
       	$("#btnAccept").hide();
        $("#btnRollBack").hide();
        if (userOid == testUser) {
       		$("#btnSave").show();
        	$("#btnCommit").show();      
       	} else {
       		$("#btnSave").hide();
        	$("#btnCommit").hide();      
        }
    } else if (status == "等待纠错") {
        $("#btnSave").hide();
        $("#btnAccept").show();
        $("#btnRollBack").show();
        $("#btnCommit").hide();      
    } else if (status == "纠错中") {
        $("#btnAccept").hide();
        $("#btnCommit").show();      
        if (userOid == repairUser) {
       		$("#btnSave").show();
        	$("#btnRollBack").show();
        	$("#btnCommit").show();      
       	} else {
       		$("#btnSave").hide();
        	$("#btnRollBack").hide();
        	$("#btnCommit").hide();      
        }
    } else if (status == "纠错完成") {
        $("#btnSave").hide();
        $("#btnAccept").hide();
        $("#btnRollBack").hide();
        $("#btnCommit").show();      
    }
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
    var dt = formatDateTime(new Date(), "YYYY-MM-DD hh:mm:ss");
    
    var dr = dboBD_BUG.dataTable.getRecord(0);
	if (bugOid == null) {
        bugOid = dr.getValue("id");
        dr.setItem("OID", bugOid);
        txtTestTime.setValue(dt);
        txtTestUser.setValue(userOid);
		dboBD_BUG.execInsert();
	} else {
        var status = selStatus.getValue();
        if (status == "创建中") {
            txtTestTime.setValue(dt);
            txtTestUser.setValue(userOid);
        } else {
            txtRepairTime.setValue(dt);
            txtRepairUser.setValue(userOid);
        }
		dboBD_BUG.execUpdate();
	}
}


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {  
    // 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
	loadBug();
    loadBugImage();
    setStatusView();
};

// 添加错去截图按钮事件
function btnUploadBugImage_click() {
    // 检查数据合法性
    if (!checkData()) return;
    
    // 保存数据
    saveData();

    // 弹出上传文件对话框
    popUpDialog("../entlogicCommon/UploadBigFileDialog.html", 200, 150, "上传错误截图", function(imgUrl, ft) {
        var sn = parseInt(dboBD_BUG_IMAGES.getMax("SN")) + 1;
        var dr = dboBD_BUG_IMAGES.execCreate();
        var oid = dr.getValue("id");
        dr.setItem("OID", oid);
        dr.setItem("BUG", bugOid);
        dr.setItem("SN", sn);
        dr.setItem("PATH", imgUrl);
        dboBD_BUG_IMAGES.execInsert(dr);

        loadBugImage();
        lstBugImage.setValue(oid);        
    });    
};

// 删除错去截图按钮事件
function btnDeleteBugImage_click() {
    var drBugImage = dboBD_BUG_IMAGES.dataTable.getRecord(lstBugImage.getSelectedIndex());
    var filePath = drBugImage.getValue("PATH");
    deleteFile(filePath);
    dboBD_BUG_IMAGES.execDelete();

    loadBugImage();
};

// 保存按钮单击事件响应
function btnSave_click() {
    // 检查数据合法性
    if (!checkData()) return;
    
    // 保存数据
    saveData();
	
	// 返回父窗口
	dialogCallBack(bugOid);
};

// 处理按钮单击事件响应
function btnAccept_click() {
    var dr = dboBD_BUG.dataTable.getRecord(0);
    dr.setItem("REPAIR_USER", userOid);
 	dr.setItem("STATUS", "纠错中");
    dboBD_BUG.execUpdate(dr);
	
    loadBug();
    setStatusView();
	dialogCallBack(bugOid);
};

// 回退按钮单击事件响应
function btnRollBack_click() {
    // 检查数据合法性
    if (!checkData()) return;
    
    // 保存数据
    saveData();
    
    // 更改状态
    var dr = dboBD_BUG.dataTable.getRecord(0);
    var status = selStatus.getValue();
    if (status == "创建中") {
       return;
    } else if (status == "等待纠错") {
        dr.setItem("STATUS", "创建中");
    } else if (status == "纠错中") {
        dr.setItem("STATUS", "等待纠错");
    } else if (status == "纠错完成") {
        dr.setItem("STATUS", "纠错中");
    }
    dboBD_BUG.execUpdate(dr);
	
    loadBug();
    setStatusView();
	dialogCallBack(bugOid);
};

// 提交按钮单击事件响应
function btnCommit_click() {
    // 检查数据合法性
    if (!checkData()) return;
    
    // 保存数据
    saveData();
    
    // 更改状态
    var dr = dboBD_BUG.dataTable.getRecord(0);
    var status = selStatus.getValue();
    if (status == "创建中") {
        dr.setItem("STATUS", "等待纠错");
    } else if (status == "等待纠错") {
        dr.setItem("STATUS", "纠错中");
    } else if (status == "纠错中") {
        dr.setItem("STATUS", "纠错完成");
    }
    dboBD_BUG.execUpdate(dr);
	
	dialogCallBack(bugOid);
    closeDialog();
};

