// entlogic_ui_list_item: 树形列表节
function entlogic_ui_list_item() {
	
	this.sn = -1;
	this.id = "";
	
	this.isSelected = false;
};

// entlogic_ui_treeview: 树形列表控件
function entlogic_ui_list(containerId, formControls) {
	
	// this副本
	var _this = this;
	
	// 绑定数据
	var _bindingData =  null;
	
	// 树形列表
	var _items = new Array();
	
	// 当前选中节点序号
	var _selectedIndex = -1;	
		
	// 树形列表容器
	var _container = $("#" + containerId);
	
	// 节点显示模版
	var _rowTemplate = _container.html();
	
	// 单选框标志
	var _isRadioBox = false;
	
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
	
	// 绑定数据
	this.setBindingData = function(bindingData) {
		// 绑定数据
		_this.loadData(bindingData);
		_bindingData.addBindingCtl(this);
	};
	
	// 获取绑定数据
	this.getBindingData = function() {
		return _bindingData;
	};
	
	// 重载数据
	this.loadData = function(data) {
		// 绑定数据
		_bindingData = data;

		// 清空所有节点
		_items = new Array();
		
		// 添加节点数据
		for(var i = 0;  i < _bindingData.records.length;  i++) {
			var record = _bindingData.getRecord(i);
			var newItem = new entlogic_ui_list_item();	
			newItem.sn = i;
			newItem.id = record.getItemByKey("id").value;
			newItem.isSelected = false;
			_items.push(newItem);
		}	
				
		//  画出
		_this.draw();
	};
	
	// 重画控件
	this.draw = function() {	
		// 获取容器id
		var _containerId = _container.attr("id");
		
		// 重画列表
		var html = "";
		for(var i = 0;  i < _items.length; i++) {		
			var itemId = _containerId + "_r" + i;
			var checkBoxId = _containerId + "_c" + i;
			// 行开始
			html += "<div id='" + itemId + "' class='list-row'>";
			// 多选框
			if (_isMultiselected) {
				html += "<div id='" + checkBoxId + "' class='list-chk'>&#xe62f;</div>";
			} else {
				if (_isRadioBox) html += "<div id='" + checkBoxId + "' class='list-chk'>&#xe713;</div>";
			}
			
			// 输出节点内容
			html += entloigc_template_to_html(_rowTemplate, _bindingData.getRecord(i));	
			// 行开始
			html += "</div>";
		}
		console.info(html);
		_container.html(html);	
		
		// 初始化列表
		for (i = 0; i < _items.length; i++) {
			// 添加行点击事件
			var row = $("#" + containerId+ "_r" + i);
			row.click(_itemClick);
			row.dblclick(_itemDbclick);
			
			var chk = $("#" + containerId+ "_c" + i);
			chk.click(_checkBox_click);
		}
		
		// 设置当前行
		if (_items.length > 0) {
			if (_selectedIndex < 0) {
				_this.setSelectedIndex(0);
			}
			else if (_selectedIndex >= _items.length) {
				_this.setSelectedIndex(_items.length -1);
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
		return _items.length;
	};
	
	// 设置多选属性
	this.setRadioBoxMode = function(b) {
		_isRadioBox = b;
	};
	
	// 设置多选属性
	this.setMultiselected = function(b) {
		_isMultiselected = b;
	};
	
	// 按行号获取行
	this.getItemByIndex = function(index) {
		if (_items.length == 0) return null;
		if (index >= _items.length) return null;
		return _items[index];
	};
	
	// 根据id获取行
	this.getItemById = function(id) {
		for(var i = 0; i < _items.length; i ++) {
			item = _items[i];
			if (item.id == id) {
				return item;
			}
		}
		return null;
	};
	
	// 获取控件取值
	this.getValue = function() {
		if (_items.length == 0) return null;
		
		var value = "";
		value = _items[_selectedIndex].id;
		return value;
	};
	
	// 获取多选值
	this.getValues = function() {
		var values = new Array();
		for(var i = 0; i < _items.length; i ++) {
			item = _items[i];
			if (item.isSelected) {
				values.push(item.id);
			}
		}
		return values;
	};
	
	// 设置控件取值
	this.setValue = function(v) {
		for(var i = 0; i < _items.length; i ++) {
			item = _items[i];
			if (item.id == v) {
				_this.setSelectedIndex(i);
				return;
			}
		}
	};
	
	// 设置控件多选值
	this.setValues = function(values) {
		for(var i = 0; i < _items.length; i ++) {
			item = _items[i];
			item.isSelected = false;
			var checkBox = $("#" + _this.id + "_c" + i);
			checkBox.html("&#xe62f;");
			for (var j = 0; j < values.length; j++) {
				if (item.id == values[j]) {
					item.isSelected = true;
					checkBox.html("&#xe66d;");
					break;
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
		$("#" +  _this.id+ "_r" + _selectedIndex).attr("class", "list-row");
		if (!_isMultiselected && _isRadioBox) $("#" +  _this.id+ "_c" + _selectedIndex).html("&#xe713;");
		
		_selectedIndex = index;
		_bindingData.setSelectedIndex(index);	
		
		$("#" +  _this.id+ "_r" + _selectedIndex).attr("class", "list-row-selected");	
		if (!_isMultiselected && _isRadioBox) $("#" +  _this.id+ "_c" + _selectedIndex).html("&#xe7e9;");
	};
	
	// 多选框点击事件
	var _checkBox_click = function() {			
		console.info("节点-【" + nodeIndex + "】checkBox click!");
		if (!_isMultiselected) return true;

			var checkBoxId = this.id;
		var checkBox = $("#" + checkBoxId);
		var nodeIndex = parseInt(checkBoxId.replace(containerId+ "_c", ""));	
		var item = _items[nodeIndex];
		item.isSelected = !item.isSelected;
		if (item.isSelected) {
			checkBox.html("&#xe66d;");
		} else {
			checkBox.html("&#xe62f;");
		}
	};
	
	// 获取行
	this.getItem = function(index) {
		return _items[index];
	};
	
	// 节点单击事件
	var _itemClick = function() {
		var divRowId = this.id;

		// 取消上次延时未执行的方法
        clearTimeout(clickTimeId);
        //执行延时
        clickTimeId = setTimeout(function() {
          //此处为单击事件要执行的代码
    		var itemIndex = parseInt(divRowId.replace(containerId+ "_r", ""));
    		_this.setSelectedIndex(itemIndex);		
    		_this.itemClick();
    		console.info("节点-【" + itemIndex + "】 clicked!");
        }, 150);
	};
	// 节点单击事件
	this.itemClick = function() {};

	// 节点双击击事件
	var _itemDbclick = function() {
        // 取消上次延时未执行的方法
        clearTimeout(clickTimeId);
        var divRowId = this.id;
		var divRow = $("#" + divRowId);
		var itemIndex = parseInt(divRowId.replace(containerId+ "_r", ""));
		_this.setSelectedIndex(itemIndex);				
		_this.itemDbclick();
		console.info("节点-【" + itemIndex + "】 dbclicked!");
	};
	this.itemDbclick = function() {};		
};
