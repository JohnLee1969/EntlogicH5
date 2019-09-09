/////////////////////////////////////////////////////////////////////////////////////////////////
// 应用常量声明

// 应用全局对象
var application = this;

// 应用的根目录
var applicationRoot = localStorage.getItem("applicationRoot");

//本页面控件容器
 var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
//  数据组件声明    




/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   




/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
/**
 * Android Decive
 */ 
var androidDevice = {
	/**
	 * 拨打电话
	 */
	openCall:   function (phoneNum) { window.jysmApp_and.goTel(phoneNum); },
	
	/**
	 * 获取设备编码
	 */
	getDeviceID:  function () { window.jysmApp_and.goDevID(); },
    onDeviceIDReturn: function(res) {},

    /**
     * 打开相机
     */
    openCamara:  function() { window.jysmApp_and.goAppCamera(); },
   
    /**
     * 选择相册
     */
    selectPhoto:  function() { window.jysmApp_and.goSltPhoto();  },
    onPhotoReturn: function(res) {},
    
    /**
     * 打开扫码
     */
    scanCode:  function() { window.jysmApp_and.goScanCode(); },
    onScanerReturn: function(res) {},
       
    /**
     * 打开录像机
     */
    takeCode:  function() { window.jysmApp_and.goAppTakeVideo(); },
    onVideoReturn: function(res) {}
};

/**
 * IOS设备
 */
var _Modal = null;
var iosDevice = {

	/**
	 * 拨打电话
	 */
	openCall:   function (phoneNum) {
	    var sendMsg="telphone|"+ phoneNum;
	    _Modal.postMessage(sendMsg);
	},
	
	/**
	 * 获取设备编码
	 */
	getDeviceID:  function () {
		var sendMsg="getuuid";
		_Modal.postMessage(sendMsg);
	},
    onDeviceIDReturn: function(res) {},

    /**
     * 打开相机
     */
    openCamara:  function() {
        var sendMsg="camphoto";
        _Modal.postMessage(sendMsg);
    },
    
    /**
     * 选择相册
     */
    selectPhoto:  function() { 
    	var sendMsg="getphoto";
    	_Modal.postMessage(sendMsg);
    },
    onPhotoReturn: function(res) {},
       
    /**
     * 打开扫码
     */
    scanCode:  function() {
        var sendMsg="qrcode";
        _Modal.postMessage(sendMsg);
    },
    onScanerReturn: function(res) {},
    
    /**
     * 打开录像机
     */
    takeVideo:  function() {
        var sendMsg="takevideo";
        _Modal.postMessage(sendMsg);
    },
    onVideoReturn: function(res) {}
};

/**
 * Android 设备回调函数接口
 * @param res
 * @param flag
 * @returns
 */
window.jysmAppResult = function(res,flag) {
    var REQUEST_CODE_SCAN = 1;//扫一扫
    var REQUEST_CODE_PHOTO =2;//暂保留
    var REQUEST_SLT_PHOTO = 3;//选择相片
    var REQUEST_CAP_PHOTO = 4;//拍照
    var REQUEST_TEL_PHOTO = 5;//拨号
    var REQUEST_DEV_CODE = 8;//机器码
    var REQUEST_VDO_CODE = 11;//录像

    if(flag==REQUEST_SLT_PHOTO){ 
     	device.onPhotoReturn(res);
    } else if (flag==REQUEST_CAP_PHOTO) {
    	device.onPhotoReturn(res);
    } else if(flag==REQUEST_CODE_SCAN) {
    	device.onScanerReturn(res);
    } else if(flag==REQUEST_DEV_CODE) {
    	device.onDeviceIDReturn(res);
    }
};

var deviceType = null;
var device = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
	
	// 初始化交互组件
};

function jumpTo(url) {
    var d = new Date();
	var t = d.getTime();
    if (url.indexOf("?") > 0) {
        url = url + "&t=" + t;
    } else {
         url = url + "?t=" + t;
    }
    $("#iframeMain").attr("src", url);
}


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
	
	// 用户定义初始化
	deviceType = getDeviceType();
    if (deviceType == "android") {
        device = androidDevice;
    } else if  (deviceType == "iPad" || deviceType == "iPhone"){
        if (!window.webkit) popUpMessage("设备接口不存在！！！");
        _Modal = window.webkit.messageHandlers.jysmApp_ios;
        device = iosDevice;
    };
};

/**
 * 获取设备类型
 * @returns
 */
function getDeviceType() {
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        //安卓手机
        return "android";
    } else if (u.indexOf('iPhone') > -1) {
        //苹果手机
        return "iPhone";
    } else if (u.indexOf('iPad') > -1) {
        //苹果手机
        return "iPad";
    } else if (u.indexOf('Windows Phone') > -1) {
        //winphone手机
        return "Windows Phone";
    }else{
        return "pc";
    }
};



