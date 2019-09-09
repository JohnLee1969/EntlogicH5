/**
 * 常用的AI算法调用
 * @returns
 */
function entlogic_util_ai() {
	/**
	 * 识别身份证
	 */
	this.recognizeSFZ = function(imgPath) {
		var parameter = new entlogic_data_record();
		parameter.addItem("imgPath", imgPath);
		var dataPackage = postBpService(applicationRoot, "com.entlogic.h5.services.AIService", "recognizeSFZ", parameter);
		var result = dataPackage.getReturn("result");
		return result;
	};
	
	/**
	 * 识别营业执照
	 */
	this.recognizeYYZZ = function(imgPath) {
		var parameter = new entlogic_data_record();
		parameter.addItem("imgPath", imgPath);
		var dataPackage = postBpService(applicationRoot, "com.entlogic.h5.services.AIService", "recognizeYYZZ", parameter);
		var result = dataPackage.getReturn("result");
		return result;
	};
	
};

EntlogicUtilAI = new entlogic_util_ai();