
/**
 * entlogic_ui_lookup: 查找输入框
 * 
 * @parameter containerId
 * @parameter formControls
  */ 
function entlogic_ui_lookup(containerId, formControls) {
	
	// this副本
	var _this = this;
	
	// 绑定数据
	var _bindingData =  null;
	
	// 绑定值
	var _bindingValue =  null;
	
	// 绑定文本
	var _bindingText =  null;
	
	// 当前选中节点序号
	var _selectedIndex = -1;	
	
	// 值
	var _value = null;
	
	// 警告信息
	var war = "";
	
	// 错误信息
	var err = "";
	
	// 弹出对话框回调函数
	var _callBackFuction = function(v, t) {
		_this.setValue(v);
		_this.setText(t);
		_this.changed();
	};
		
	// 查找框容器
	var _container = $("#" + containerId);
	
	// 查找框文本输入组件
	var _input = $("<input type='text' class='lookup-input' value=''></input>");
	_input.appendTo(_container);
	_input.attr("readonly","readonly");
	
	// 查找框文查找按钮
	var _button = $("<button class='lookup-btn' value=''>&#xe65c;</button>");
	_button.appendTo(_container);	
	_button.click(function() {
		application.popUpDialog(_this.lookupDialogUrl, 420, 336, "查找输入选项", _callBackFuction);
	});
	
	// 添加到formControls
	formControls.push(_this);
	
	// 控件ID
	this.id = containerId;
	
	// 控件类型
	this.type = "InputOutput";
	
	// 查找对话框
	this.lookupDialogUrl = null;
	
	// 绑定数据
	this.setBindingData = function(bindingData, bindingValue, bindingText) {
		// 绑定数据
		_bindingData = bindingData;
		_bindingData.addBindingCtl(this);
		
		_bindingValue = bindingValue;
		_bindingText = bindingText;
	};
	
	// 获取绑定数据
	this.getBindingData = function() {
		return _bindingData;
	};
	
	// 获取绑定值
	this.getBindingValue = function() {
		return _bindingValue;
	};
	
	// 获取绑定文本
	this.getBindingText = function() {
		return _bindingText;
	};
	
	// 重载数据
	this.loadData = function(data) {
		_bindingData = data;
		_this.draw();
	};
	
	// 重画控件
	this.draw = function() {	
		_input.val("");
		_value = null;
		
		if (_bindingData == null) return;
		if (_bindingData.records.length <= 0) return;
		if (_bindingData.getSelectedIndex() < 0) _bindingData.setSelectedIndex(0);
		var index = _bindingData.getSelectedIndex();
		var dr = _bindingData.getRecord(index);
		_input.val(dr.getValue(_bindingText));
		_value = dr.getValue(_bindingValue)
	};		
	
	// 获取控件取值
	this.getValue = function() {
		return _value;
	};
	
	// 获取控件文本
	this.getText = function() {
		return _input.val();
	};
	
	// 设置控件取值
	this.setValue = function(v) {
		_value = v;
	};
	
	// 设置控件文本
	this.setText = function(t) {
		_input.val(t);
	};

	// 获取当前编订数据序号
	this.getBindingDataIndex = function() {
		return _selectedIndex;
	};
	
	// 设置当前绑定数据序号
	this.setBindingDataIndex = function(index) {
		_selectedIndex = index;
		this.loadData();
		this.draw();
	};
	
	// 设置控件有效否
	this.setEnabled = function(b) {
		if (b) {
			_container.removeAttr("disabled");
			_container.removeClass("disabled");
		}
		else {
			_container.attr("disabled","disabled");
			_container.addClass("disabled");
		}
	};
	
	// 设置错误信息
	this.setErrMessage = function(message) {
		err = message;
		if (err != "") {
			_input.css("border", "solid");
			_input.css("border-color", "#F00");
			_input.css("border-width", "1px");
		} else {
			_input.css("border", "none");
		}
	};
	
	// 设置警告信息
	this.setWarMessage = function(message) {
		war = message;
		if (war != "") {
			_input.css("border", "solid");
			_input.css("border-color", "#FF0");
			_input.css("border-width", "1px");
		} else {
			_input.css("border", "none");
		}
	};
	
	// 变更事件接口
	this.changed = function() {};
};
