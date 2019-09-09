/**
 * Android Decive
 */ 
window.androidDevice = function(){
	/**
	 * 拨打电话
	 */
	this.openCall = function(phoneNum) { window.jysmApp_and.goTel(phoneNum); };
	
	/**
	 * 获取设备编码
	 */
	this.getDeviceID = function () { window.jysmApp_and.goDevID(); };
	this.onDeviceIDReturn =  function(res) {};

    /**
     * 打开相机
     */
    this.openCamara = function() { window.jysmApp_and.goAppCamera(); };
   
    /**
     * 选择相册
     */
   this. selectPhoto = function() { window.jysmApp_and.goSltPhoto();  };
   this.onPhotoReturn = function(res) {};
    
    /**
     * 打开扫码
     */
    this.scanCode = function() { window.jysmApp_and.goScanCode(); };
    this.onScanerReturn = function(res) {};
       
    /**
     * 打开录像机
     */
    this.takeCode = function() { window.jysmApp_and.goAppTakeVideo(); };
    this.onVideoReturn = function(res) {};
};

/**
 * IOS设备
 */
window.iosDevice = function(){
    if (!window.webkit) {
    	popUpMobMessage("设备接口不存在！！！");
    	return;
    }
	var _Modal = window.webkit.messageHandlers.jysmApp_ios;

	/**
	 * 拨打电话
	 */
	this.openCall = function (phoneNum) {
	    var sendMsg="telphone|"+ phoneNum;
	    _Modal.postMessage(sendMsg);
	};
	
	/**
	 * 获取设备编码
	 */
	this.getDeviceID = function () {
		var sendMsg="getuuid";
		_Modal.postMessage(sendMsg);
	};
    this.onDeviceIDReturn =function(res) {};

    /**
     * 打开相机
     */
    this.openCamara = function() {
        var sendMsg="camphoto";
        _Modal.postMessage(sendMsg);
    };
    
    /**
     * 选择相册
     */
   this. selectPhoto = function() { 
    	var sendMsg="getphoto";
    	_Modal.postMessage(sendMsg);
    };
    this.onPhotoReturn = function(res) {};
       
    /**
     * 打开扫码
     */
    this.scanCode = function() {
        var sendMsg="qrcode";
        _Modal.postMessage(sendMsg);
    };
    this.onScanerReturn = function(res) {};
    
    /**
     * 打开录像机
     */
    this.takeVideo = function() {
        var sendMsg="takevideo";
        _Modal.postMessage(sendMsg);
    };
    this.onVideoReturn = function(res) {}
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

/**
 * 获取当前设备类型
 */
window.getDeviceType = function() {
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
    } else if (u.indexOf('windows Phone') > -1) {
        //winphone手机
        return "Windows Phone";
    }else{
        return "pc";
    }	
};

/**
 * 获取当前设备
 */
window.getDevice = function() {
	var deviceType = window.getDeviceType();
    if (deviceType == "android") {
    	return new window.androidDevice();
    } else if  (deviceType == "iPad" || deviceType == "iPhone"){
    	return device = new window.iosDevice();
    }
};

