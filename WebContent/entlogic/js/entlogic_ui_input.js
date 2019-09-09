/**
 * 
 */
function entlogic_ui_button(containerId) {
	// this副本
	var _this = this;
		
	// 树形列表容器
	var _container = $("#" + containerId);
	
	_container.click(_this.click);
	
	this.click = function() {
		
	};
};

/**
 * entlogic_ui_textarea: 多行文本输入框
 * 
 * @parameter containerId
 * @parameter formControls
  */ 
function entlogic_ui_textarea(containerId, formControls) {
	
	// this副本
	var _this = this;
	
	// 绑定数据
	var _bindingData =  null;
	
	// 绑定值
	var _bindingValue =  null;
	
	// 当前选中节点序号
	var _selectedIndex = -1;	
		
	// 树形列表容器
	var _container = $("#" + containerId);
	
	// 警告信息
	var war = "";
	
	// 错误信息
	var err = "";
	
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
		_container.val("");
		if (_bindingData == null) return;
		if (_bindingData.records.length <= 0) return;
		if (_bindingData.getSelectedIndex() < 0) _bindingData.setSelectedIndex(0);
		var index = _bindingData.getSelectedIndex();
		var dr = _bindingData.getRecord(index);
		_container.val(dr.getValue(_bindingValue));
	};		
	
	// 获取控件取值
	this.getValue = function() {
		return _container.val();
	};
	
	// 设置控件取值
	this.setValue = function(v) {
		_container.val(v);
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
			_container.css("border", "solid");
			_container.css("border-color", "#F00");
			_container.css("border-width", "1px");
		} else {
			_container.css("border", "none");
		}
	};
	
	// 设置警告信息
	this.setWarMessage = function(message) {
		war = message;
		if (war != "") {
			_container.css("border", "solid");
			_container.css("border-color", "#FF0");
			_container.css("border-width", "1px");
		} else {
			_container.css("border", "none");
		}
	};
};

/**
 * entlogic_ui_text: 文本输入框
 * 
 * @parameter containerId
 * @parameter formControls
  */ 
function entlogic_ui_text(containerId, formControls) {
	
	// this副本
	var _this = this;
	
	// 绑定数据
	var _bindingData =  null;
	
	// 绑定值
	var _bindingValue =  null;
	
	// 当前选中节点序号
	var _selectedIndex = -1;	
		
	// 树形列表容器
	var _container = $("#" + containerId);
	
	// 警告信息
	var war = "";
	
	// 错误信息
	var err = "";
	
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
		_container.val("");
		if (_bindingData == null) return;
		if (_bindingData.records.length <= 0) return;
		if (_bindingData.getSelectedIndex() < 0) _bindingData.setSelectedIndex(0);
		var index = _bindingData.getSelectedIndex();
		var dr = _bindingData.getRecord(index);
		_container.val(dr.getValue(_bindingValue));
	};		
	
	// 获取控件取值
	this.getValue = function() {
		return _container.val();
	};
	
	// 设置控件取值
	this.setValue = function(v) {
		_container.val(v);
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
			_container.css("border", "solid");
			_container.css("border-color", "#F00");
			_container.css("border-width", "1px");
		} else {
			_container.css("border", "none");
		}
	};
	
	// 设置警告信息
	this.setWarMessage = function(message) {
		war = message;
		if (war != "") {
			_container.css("border", "solid");
			_container.css("border-color", "#FF0");
			_container.css("border-width", "1px");
		} else {
			_container.css("border", "none");
		}
	};
};

/**
 * entlogic_ui_number: 数字输入框
 * 
 * @parameter containerId
 * @parameter formControls
  */ 
function entlogic_ui_number(containerId, formControls) {
	
	// this副本
	var _this = this;
	
	// 绑定数据
	var _bindingData =  null;
	
	// 绑定值
	var _bindingValue = null;
		
	// 树形列表容器
	var _container = $("#" + containerId);
		
	// 警告信息
	var war = "";
	
	// 错误信息
	var err = "";
	
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
		_container.val("0");
		if (_bindingData == null) return;
		if (_bindingData.records.length <= 0) return;
		if (_bindingData.getSelectedIndex() < 0) _bindingData.setSelectedIndex(0);
		var index = _bindingData.getSelectedIndex();
		var dr = _bindingData.getRecord(index);
		_container.val(dr.getValue(_bindingValue));
	};
		
	// 获取控件取值
	this.getValue = function() {
		return _container.val();
	};
	
	// 设置控件取值
	this.setValue = function(v) {
		_container.val(v);
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
			_container.css("border", "solid");
			_container.css("border-color", "#F00");
			_container.css("border-width", "1px");
		} else {
			_container.css("border", "none");
		}
	};
	
	// 设置警告信息
	this.setWarMessage = function(message) {
		war = message;
		if (war != "") {
			_container.css("border", "solid");
			_container.css("border-color", "#FF0");
			_container.css("border-width", "1px");
		} else {
			_container.css("border", "none");
		}
	};
};

/**
 * entlogic_ui_datetiime: 日期时间输入框
 * 
 * @parameter containerId
 * @parameter formControls
  */ 
function entlogic_ui_datetime(containerId, formControls) {
	
	// this副本
	var _this = this;
	
	// 绑定数据
	var _bindingData =  null;
	
	// 绑定值
	var _bindingValue = null;
	
	// 当前选中节点序号
	var _selectedIndex = -1;
	
	// 显示时间
	var _showTime = false;
	
	// 时间值
	var _dateValue = new Date();
	
	// 字符串值
	var _stringValue = _dateValue.toString();
	
	//  字符串值年
	var _stringYear = _dateValue.getFullYear();
	
	//  字符串值月
	var _stringMonth = _dateValue.getMonth() + 1;
	
	//  字符串值日
	var _stringDate = _dateValue.getDate();
	
	//  字符串值时
	var _stringHour = _dateValue.getHours();
	
	//  字符串值分
	var _stringMinute = _dateValue.getMinutes();
	
	//  字符串值秒
	var _stringSecond = _dateValue.getSeconds();
	
	// 警告信息
	var war = "";
	
	// 错误信息
	var err = "";
			
	// 树形列表容器
	var _container = $("#" + containerId);
	
	// 正整数检测器
	var r = /^\+?[1-9][0-9]*$/;
	
	// 日期合法性检查
	var _correctDate = function() {
		var d = new Date(_stringYear, _stringMonth - 1,  _stringDate);
		if (_stringYear != d.getFullYear() || d.getMonth() !=  _stringMonth - 1 || d.getDate() != _stringDate) {
			if (_stringDate < 29) return;
			_stringDate --;
			_inputDate.val(_stringDate);
			_correctDate();
		}
	};
	
	// 年输入框
	var _inputYear = $("<input type='text' class='date-year' value=''></input>");
	_inputYear.appendTo(_container);
	var _lblYear = $("<span>年</span>");
	_lblYear.appendTo(_container);
	_inputYear.val(_stringYear);
	_inputYear.on("input", function() {
		if (_inputYear.val().length == 0) return;
		if (_inputYear.val().length > 4) _inputYear.val(_stringYear);
		if (!r.test(_inputYear.val())) _inputYear.val(_stringYear);
		_stringYear = _inputYear.val();
		_correctDate();
	});

	// 月输入框
	var _inputMonth = $("<input type='text' class='date-month' value=''></input>");
	_inputMonth.appendTo(_container);
	var _lblMonth = $("<span>月</span>");
	_lblMonth.appendTo(_container);
	_inputMonth.val(_stringMonth);
	_inputMonth.on("input", function() {
		if (_inputMonth.val().length == 0) return;
		if (_inputMonth.val().length > 2) _inputMonth.val(_stringMonth);
		if (!r.test(_inputMonth.val())) _inputMonth.val(_stringMonth);
		var m = parseInt(_inputMonth.val());
		if (m > 12 || m < 1)  _inputMonth.val(_stringMonth);
		_stringMonth = _inputMonth.val();
		_correctDate();
	});

	//日输入框
	var _inputDate = $("<input type='text' class='date-date' value=''></input>");
	_inputDate.appendTo(_container);
	var _lblDate = $("<span>日</span>");
	_lblDate.appendTo(_container);
	_inputDate.val(_stringDate);
	_inputDate.on("input", function() {
		if (_inputDate.val().length == 0) return;
		if (_inputDate.val().length > 2) _inputDate.val(_stringDate);
		if (!r.test(_inputDate.val()))  _inputDate.val(_stringDate);
		var d = parseInt(_inputDate.val());
		if (d > 31 || d < 1) _inputDate.val(_stringDate);
		_stringDate = _inputDate.val();
		_correctDate();
	});
	
	// 时输入框
	var _inputHour = $("<input type='text' class='time' value=''></input>");
	_inputHour.appendTo(_container);
	var _lblHour = $("<span>时</span>");
	_lblHour.appendTo(_container);
	_inputHour.val(_stringHour);
	_inputHour.on("input", function() {
		if (_inputHour.val().length == 0) return;
		if (_inputHour.val().length > 2) _inputHour.val(_stringHour);
		if (!r.test(_inputHour.val())) _inputHour.val(_stringHour);
		var h = parseInt(_inputHour.val());
		if (h > 23 || h < 0) _inputHour.val(_stringHour);
		_stringHour = _inputHour.val();
	});

	// 分输入框
	var _inputMinute = $("<input type='text' class='time' value=''></input>");
	_inputMinute.appendTo(_container);
	var _lblMinute = $("<span>分</span>");
	_lblMinute.appendTo(_container);
	_inputMinute.val(_stringMinute);
	_inputMinute.on("input", function() {
		if (_inputMinute.val().length == 0) return;
		if (_inputMinute.val().length > 2) _inputMinute.val(_stringMinute);
		if (!r.test(_inputMinute.val())) _inputMinute.val(_stringMinute);
		var m = parseInt(_inputMinute.val());
		if (m > 59 || m < 0) _inputMinute.val(_stringMinute);
		_stringMinute = _inputMinute.val();
	});

	// 秒输入框
	var _inputSecond = $("<input type='text' class='time' value=''></input>");
	_inputSecond.appendTo(_container);
	var _lblSecond = $("<span>秒</span>");
	_lblSecond.appendTo(_container);
	_inputSecond.val(_stringSecond);
	_inputSecond.on("input", function() {
		if (_inputSecond.val().length == 0) return;
		if (_inputSecond.val().length > 2) _inputSecond.val(_stringSecond);
		if (!r.test(_inputSecond.val())) _inputSecond.val(_stringSecond);
		var s = parseInt(_inputSecond.val());
		if (s > 59 || s < 0) _inputSecond.val(_stringSecond);
		_stringSecond = _inputSecond.val();
	});
	
	// 添加到formControls
	formControls.push(_this);

	// 设置鼠标进入事件
	_container.mouseover( function() {
		if (err != "") {			
			showErrTip(_container, err);
			return;
		}
		if (war != "") {		
			showWarTip(_container, war);
			return;
		}
	});
	
	// 设置鼠标进入事件
	_container.mouseout( function() {
		closeTip();
	});

	// 屏蔽鼠标移动事件
	_container.mousemove(function() {
		return false;
	});
	
	// 内容改变事件
	_container.change(function() {
		return false;
	});
	
	// 控件ID
	this.id = containerId;
	
	// 控件类型
	this.type = "InputOutput";
	
	// 显示时间
	this.setShowTime = function(b) {
		_showTime = b;
		if (_showTime) {
			_inputHour.show();
			_lblHour.show();
			_inputMinute.show();
			_lblMinute.show();
			_inputSecond.hide();
			_lblSecond.hide();
		} else {
			_inputHour.hide();
			_lblHour.hide();
			_inputMinute.hide();
			_lblMinute.hide();
			_inputSecond.hide();
			_lblSecond.hide();
		}
	};	

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
		_this.setShowTime(_showTime);
		if (_bindingData == null) return;
		if (_bindingData.records.length <= 0) return;
		if (_bindingData.getSelectedIndex() < 0) _bindingData.setSelectedIndex(0);
		var index = _bindingData.getSelectedIndex();
		var dr = _bindingData.getRecord(index);
		_stringValue = dr.getValue(_bindingValue);
		_this.setValue(_stringValue);
	};		
	
	// 获取控件取值
	this.getValue = function() {
		if (!_showTime) {
			_stringHour = "00";
			_stringMinute = "00";
		}
		_stringSecond = "00";
		
		_dateValue = new Date(_stringYear, _stringMonth - 1, _stringDate, _stringHour, _stringMinute, _stringSecond, 0);
		_stringValue = _stringYear  + "-" + _stringMonth + "-" + _stringDate;
		if (_showTime)	_stringValue +=	" " + _stringHour + ":" + _stringMinute + ":" + _stringSecond;
		
		return _stringValue;
	};
	
	// 设置控件取值
	this.setValue = function(v) {
		_dateValue = new Date(v);
		
		_stringYear = _dateValue.getFullYear();
		_inputYear.val(_stringYear);
		
		_stringMonth = _dateValue.getMonth() + 1;
		_inputMonth.val(_stringMonth);
		
		_stringDate = _dateValue.getDate();
		_inputDate.val(_stringDate);
		
		_stringHour = _dateValue.getHours();
		_inputHour.val(_stringHour);
		
		_stringMinute = _dateValue.getMinutes();
		_inputMinute.val(_stringMinute);
		
		_stringSecond = _dateValue.getSeconds()
		_inputSecond.val(_stringSecond);
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
			_container.css("border", "solid");
			_container.css("border-color", "#F00");
			_container.css("border-width", "1px");
		} else {
			_container.css("border", "none");
		}
	};
	
	// 设置警告信息
	this.setWarMessage = function(message) {
		war = message;
		if (war != "") {
			_container.css("border", "solid");
			_container.css("border-color", "#FF0");
			_container.css("border-width", "1px");
		} else {
			_container.css("border", "none");
		}
	};
	
};

/**
 * entlogic_ui_date: 日期输入框
 * 
 * @parameter containerId
 * @parameter formControls
  */ 
function entlogic_ui_date(containerId, formControls) {
	
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
	
	// 警告信息
	var war = "";
	
	// 错误信息
	var err = "";
	
	// 添加到formControls
	formControls.push(_this);

	// 控件ID
	this.id = containerId;
	
	// 控件类型
	this.type = "InputOutput";
		
	// 内容改变事件
	_container.change(function() {
		return false;
	});

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
		_container.val("");
		if (_bindingData == null) return;
		if (_bindingData.records.length <= 0) return;
		if (_bindingData.getSelectedIndex() < 0) _bindingData.setSelectedIndex(0);
		var index = _bindingData.getSelectedIndex();
		var dr = _bindingData.getRecord(index);
		_this.setValue(dr.getValue(_bindingValue));
	};		
	
	// 获取控件取值
	this.getValue = function() {
		return _container.val();
	};
	
	// 设置控件取值
	this.setValue = function(v) {
		if (v.indexOf("1900-01-01") >= 0 ) v = "";
		_container.val(v);
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
			_container.css("border", "solid");
			_container.css("border-color", "#F00");
			_container.css("border-width", "1px");
		} else {
			_container.css("border", "none");
		}
	};
	
	// 设置警告信息
	this.setWarMessage = function(message) {
		war = message;
		if (war != "") {
			_container.css("border", "solid");
			_container.css("border-color", "#FF0");
			_container.css("border-width", "1px");
		} else {
			_container.css("border", "none");
		}
	};
	
};

