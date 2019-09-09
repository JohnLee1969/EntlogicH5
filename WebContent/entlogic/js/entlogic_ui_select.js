/**
 * entlogic_ui_select: 下拉选择框
 */ 
function entlogic_ui_select(containerId, formControls) {
	
	// this副本
	var _this = this;
	
	// 绑定数据
	var _bindingData =  {};
	
	// 绑定数据字段
	var _bindingValue = "";
		
	// 树形列表容器
	var _container = $("#" + containerId);
	
	// 节点显示模版
	var _template = _container.html();
	
	// 绑定数据当前序号
	var _selectedIndex = -1;
	
	// 添加到formControls
	formControls.push(_this);
	
	// 控件ID
	this.id = containerId;
	
	// 控件类型
	this.type = "InputOutput";
	
	// 设置选项数据
	this.setOptionsData = function(optionsData) {
		var html = "";		
		for(var i = 0;  i < optionsData.records.length;  i++) {
			html += entloigc_template_to_html(_template, optionsData.getRecord(i));
		}
		_container.html(html);
	};

	// 绑定数据
	this.setBindingData = function(bindingData, bindingSection) {
		// 绑定数据
		_bindingData = bindingData;
		_bindingData.addBindingCtl(_this);
		
		_bindingValue = bindingSection;
	};
	
	// 获取绑定数据
	this.getBindingData = function() {
		return _bindingValue;
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
		if (_bindingData.records.length <= 0) return;	
		var record = _bindingData.getRecord(_bindingData.getSelectedIndex());
		var col = record.getItemByKey(_bindingValue);
		if (col == null) {
			alert("绑定字段：" + _bindingValue + ", 不存在！！");
			return;
		}
		_this.setValue(record.getItemByKey(_bindingValue).value);		
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
	
	// 获取值
	this.getValue = function() {
		var value = _container.find("option:selected").val();
		return value;
	};
	
	// 设置值
	this.setValue = function(v) {
		_container.val(v);
	};
	
	// 设置绑定数据序号
	this.setBindingDataIndex = function(index) {
		_selectedIndex = index;
		var record = _bindingData.getRecord(_selectedIndex);
		_this.setValue(record.getItemByKey(_bindingValue).value);
	};

	// 添加变更事件
	var _changed = function() {
		_this.changed();
	};
	_container.change(_changed);
	this.changed = function() {};
};
