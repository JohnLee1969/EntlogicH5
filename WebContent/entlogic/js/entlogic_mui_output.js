/**
 * entlogic_mui_output: 输出
 * 
 * @parameter containerId
 * @parameter formControls
  */ 
function entlogic_mui_output(containerId, formControls) {	
	// this副本
	var _this = this;
	
	// 绑定数据
	var _bindingData =  null;
	
	// 绑定值
	var _bindingValue = null;
		
	// 树形列表容器
	var _container = $("#" + containerId);
	
	// 添加到formControls
	formControls.push(_this);

	// 控件ID
	this.id = containerId;
	
	// 控件类型
	this.type = "InputOutput";

	// 绑定数据
	this.setBindingData = function(bindingData,bindingSection) {
		// 绑定数据
		_bindingData = bindingData;
		_bindingData.addBindingCtl(this);
		
		_bindingValue = bindingSection;
	};
	
	// 获取绑定数据
	this.getBindingData = function() {
		return _bindingData;
	};
	
	// 获取绑定数据
	this.getBindingValue = function() {
		return _bindingValue;
	};
	
	// 重载数据
	this.loadData = function(data) {
		_bindingData = data;
		_this.draw();
	};
	
	// 重画控件
	this.draw = function() {	
		_container.html("");
		if (_bindingData.records.length <= 0) return;
		_container.html(_bindingData.getRecord( _bindingData.getSelectedIndex()).getValue(_bindingValue));	
	};		
	
	// 获取控件取值
	this.getValue = function() {
		return _container.html();
	};
	
	// 设置控件取值
	this.setValue = function(v) {
		_container.html(v);
	};
};

/**
 * entlogic_mui_number: 数字输入框
 * 
 * @parameter containerId
 * @parameter formControls
  */ 
function entlogic_mui_image(containerId, formControls) {
	
	// this副本
	var _this = this;
	
	// 绑定数据
	var _bindingData =  null;
	
	// 绑定值
	var _bindingValue = null;
	
	// 当前选中节点序号
	var _selectedIndex = -1;	
		
	// 树形列表容器
	var _container = $("#" + containerId);
	
	// 路径
	var _path = "";
				
	// 添加到formControls
	formControls.push(_this);
	
	// 设置加载完成
	_container.load(function() {
		var imageObj = document.getElementById(_this.id);
		var naturalWidth = imageObj.naturalWidth;
		var naturalHeight = imageObj.naturalHeight;
		if (_this.displayMode  ==  "FitWidth") {
			_container.height(naturalHeight * _container.width() / naturalWidth);
		} else if(_this.displayMode  ==  "FitHeight") {
			_container.width(naturalWidth * _container.height() / naturalHeight);
		}
		_this.onLoad();
	});

	// 控件ID
	this.id = containerId;
	
	// 控件类型
	this.type = "InputOutput";
	
	// 显示模式：FitWidth/FitWidth/FitSize
	this.displayMode = ""

	// 绑定数据
	this.setBindingData = function(bindingData,bindingSection) {
		// 绑定数据
		_bindingData = bindingData;
		_bindingData.addBindingCtl(this);
		
		_bindingValue = bindingSection;
	};
	
	// 获取绑定数据
	this.getBindingData = function() {
		return _bindingData;
	};
	
	// 获取绑定数据
	this.getBindingValue = function() {
		return _bindingValue;
	};
	
	// 重载数据
	this.loadData = function(data) {
		// 绑定数据
		_bindingData = data;
		_this.draw();
	};
	
	// 重画控件
	this.draw = function() {	
		_container.attr("src", applicationRoot + "/common/images/null.jpg");
		if (_bindingData.records.length <= 0) return;
		_this.setValue(_bindingData.getRecord( _bindingData.getSelectedIndex()).getValue(_bindingValue));	
	};
	
	// 获取当前编订数据序号
	this.getBindingDataIndex = function() {
		return _selectedIndex;
	};
	
	// 设置当前绑定数据序号
	this.setBindingDataIndex = function(index) {
		_selectedIndex = index;
		_this.loadData();
		_this.draw();
	};
		
	// 获取控件取值
	this.getValue = function() {
		return _path;
	};
	
	// 设置控件取值
	this.setValue = function(v) {
		if (v == null, v == "null" || v == "") {
			_path = "";
			_container.attr("src", applicationRoot + "/common/images/null.jpg");
			return;
		}
		var d = new Date();
		var  t = d.getTime();
		_path = v;
		_container.attr("src", applicationRoot + _path +"?d=" +   t);
	};
	
	// 设置宽度
	this.setWidth = function(w) {
		var src = _this.getValue();
		if (src == null || src == "") return;
		_container.width(w);
		var imagaObj = document.getElementById(_this.id);
		var naturalWidth = imagaObj.naturalWidth;
		var naturalHeight = imagaObj.naturalHeight;
		_container.height(_container.width() * naturalHeight / naturalWidth);
	};
	
	// 设置宽度
	this.setHeight = function(h) {
		var src = _this.getValue();
		if (src == null || src == "") return;
		_container.height(h);
		var imagaObj = document.getElementById(_this.id);
		var naturalWidth = imagaObj.naturalWidth;
		var naturalHeight = imagaObj.naturalHeight;
		_container.width(_container.height() * naturalWidth / naturalHeight);
	};
	
	// 设置控件有效否
	this.setEnabled = function(b) {
		if (b) {
			_container.removeAttr("disabled");
		}
		else {
			_container.attr("disabled","disabled");
		}
	};
	
	// 单击事件
	this.onLoad = function() {	};
	
	// 单击事件
	this.onClick = function() {	};
	
	// 双击击事件
	this.onDbclick = function() {};
};
