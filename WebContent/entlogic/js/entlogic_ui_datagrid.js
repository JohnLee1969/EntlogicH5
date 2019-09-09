// entlogic_ui_list_item: 树形列表节
function entlogic_ui_datagrid_row() {
	
	this.sn = -1;
	this.id = null;
	
	this.isSelected = false;
};

// entlogic_ui_treeview: 树形列表控件
function entlogic_ui_datagrid(containerId, formControls) {
	
	// this副本
	var _this = this;
	
	// 绑定列数据
	var _bindingColData =  null;
	
	// 绑定行数据
	var _bindingData =  null;
	
	// 列表行数组
	var _rows = new Array();
	
	// 当前选中节点序号
	var _selectedIndex = -1;	
		
	// 数据列表容器
	var _container = $("#" + containerId);
	
	// 表头容器
	var _head = $(_container.children("div").get(0));
	
	// 表头内容
	var _headContent = $(_head.children("div").get(0));
	
	// 列模版
	var _colTemplate = _headContent.html();
	
	// 表行内容
	var _body = $(_container.children("div").get(1));
	_body.scroll(function() {
		var h = _body.scrollLeft();
		_head.scrollLeft(h);
	});
	
	// 表行容器
	var _bodyContent = $(_body.children("div").get(0));
	
	// 行模版
	var _rowTemplate = $(_bodyContent.children("div").get(0)).html();
	
	// 多选标志
	var _isMultiselected = false;
	
	
	// 鼠标点击延时Id
	var clickTimeId = null;
	
	// 添加到formControls
	formControls.push(_this);

	// 控件ID
	this.id = containerId;
	
	// 控件类型
	this.type = "ListView";

	// 设置行绑定数据
	this.setBindingData = function(bindingData) {
		// 绑定数据
		_bindingData = bindingData;
		_bindingData.addBindingCtl(this);
	};
	
	// 获取绑定数据
	this.getBindingData = function() {
		return _bindingData;
	};

	// 设置列数据
	this.setColData = function(colData) {
		// 绑定数据
		_bindingColData = colData;
		_this.drawCol();
	};
	
	// 重载数据
	this.loadData = function(data) {
		// 绑定数据
		_bindingData = data;

		// 清空所有节点
		_rows = new Array();
		
		// 添加节点数据
		for(var i = 0;  i < _bindingData.records.length;  i++) {
			var record = _bindingData.getRecord(i);
			var newItem = new entlogic_ui_list_item();	
			newItem.sn = i;
			newItem.id = record.getItemByKey("id").value;
			newItem.isSelected = false;
			_rows.push(newItem);
		}	
		
		//  画出
		_this.draw();
	};
	
	// 重画控件
	this.draw = function() {	
		var html = "";
		
		// 重画列列
		if (_isMultiselected) {
			html += "<input type='checkbox' id='" + id + "_select-all'></input>";
		}	
		if (_bindingColData != null) {
			html += entloigc_template_to_html(_colTemplate, _bindingColData, 0);	
		} else {
			html += _colTemplate;	
		}	
		console.info(html);
		_headContent.html(html);
		
		// 重画列表行
		html = "";
		for(var i = 0;  i < _rows.length; i++) {		
			var rowId = _this.id + "_r" + i;
			var checkBoxId = _this.id + "_c" + i;
			// 行开始
			html += "<div id='" + rowId + "' class='datagrid-row'>";
			// 多选框
			if (_isMultiselected) {
				html += "<input type='checkbox' id='" + checkBoxId + "'></input>";
			}			
			// 输出节点内容
			html += entloigc_template_to_html(_rowTemplate, _bindingData.getRecord(i));	
			// 行开始
			html += "</div>";
		}
		console.info(html);
		_bodyContent.html(html);	
		
		// 初始化列表
		for (i = 0; i < _rows.length; i++) {
			// 添加行点击事件
			var row = $("#" + _this.id+ "_r" + i);
			row.click(_rowClick);
			row.dblclick(_rowDbclick);
			
			var chk = $("#" + _this.id+ "_c" + i);
			chk.click(_checkBox_click);
		}
		
		// 设置当前行
		if (_rows.length > 0) {
			if (_selectedIndex < 0) {
				_this.setSelectedIndex(0);
			}
			else if (_selectedIndex >= _rows.length) {
				_this.setSelectedIndex(_rows.length -1);
			}
			else {
				_this.setSelectedIndex(_selectedIndex);
			}		
		}
		else {
			_selectedIndex = -1;
		}
	};
	
	// 获取列表航速
	this.getSize = function() {
		return _rows.length;
	};
	
	// 设置多选属性
	this.setMultiselected = function(b) {
		_isMultiselected = b;
	};
	
	// 获取控件取值
	this.getValue = function() {
		var value = "";
		if (_isMultiselected) {
			var row = {};
			for(var i = 0; i < _rows.length; i ++) {
				row = _rows[i];
				if (row.isSelected) {
					if (value != "") {
						value += ",";
					}
					value += row.id;
				}
			}
		}
		else {
			if (_selectedIndex >= 0) {
				value = _rows[_selectedIndex].id;
			}
		}
		return value;
	};
	
	// 设置控件取值
	this.setValue = function(v) {
		if (_isMultiselected) {
			for(var i = 0; i < _rows.length; i ++) {
				row = _rows[i];
				var chkId = containerId+ "_c" + i;
				var chk = $("#" + chkId);
				if (v.indexOf(row.id) >= 0) {
					row.isSelected = true;
					chk.prop("checked", true);
				} else {
					row.isSelected = false;
					chk.prop("checked", false);
				}
			}		
		} else {
			for(var i = 0; i < _rows.length; i ++) {
				row = _rows[i];
				if (row.id == v) {
					_this.setSelectedIndex(i);
					return;
				}
			}
		}
	};
	
	// 获取当前行序号
	this.getSelectedIndex = function() {
		return _selectedIndex;
	};
	
	// 设置当前行序号
	this.setSelectedIndex = function(index) {
		$("#" +  _this.id+ "_r" + _selectedIndex).attr("class", "datagrid-row");
		_selectedIndex = index;
		_bindingData.setSelectedIndex(index);	
		$("#" +  _this.id+ "_r" + _selectedIndex).attr("class", "datagrid-row-selected");
	};
	
	// 多选框点击事件
	var _checkBox_click = function() {	
		console.info("节点-【" + nodeIndex + "】checkBox click!");
		var checkBoxId = this.id;
		var checkBox = $("#" + checkBoxId);
		var nodeIndex = parseInt(checkBoxId.replace(containerId+ "_c", ""));	
		_this.setSelectedIndex(nodeIndex);
		var row = _rows[nodeIndex];
		row.isSelected = !row.isSelected;
	};
	
	// 获取行
	this.getItem = function(index) {
		return _rows[index];
	};
	
	// 节点单击事件
	var _rowClick = function() {
		var divRowId = this.id;
		var divRow = $("#" + divRowId);
		
		// 取消上次延时未执行的方法
        clearTimeout(clickTimeId);
        //执行延时
        clickTimeId = setTimeout(function() {
          //此处为单击事件要执行的代码
    		var rowIndex = parseInt(divRowId.replace(containerId+ "_r", ""));
    		_this.setSelectedIndex(rowIndex);		
    		_this.rowClick();
    		console.info("节点-【" + rowIndex + "】 clicked!");
        }, 150);
        
	};
	// 节点单击事件
	this.rowClick = function() {};

	// 节点双击击事件
	var _rowDbclick = function(nodeIndex) {
        // 取消上次延时未执行的方法
        clearTimeout(clickTimeId);
		var divRowId = this.id;
		var divRow = $("#" + divRowId);
		var rowIndex = parseInt(divRowId.replace(containerId+ "_r", ""));
		_this.setSelectedIndex(rowIndex);				
		_this.rowDbclick();
		console.info("节点-【" + rowIndex + "】 dbclicked!");
	};
	this.rowDbclick = function() {};		
};
