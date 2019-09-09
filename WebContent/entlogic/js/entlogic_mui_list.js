// entlogic_mui_list_item: 树形列表节
function entlogic_mui_list_item() {
	
	this.sn = -1;
	this.id = "";
	
	this.isSelected = false;
	this.isActived = false;
};

// entlogic_mui_treeview: 树形列表控件
function entlogic_mui_list(containerId, formControls) {
	
	// this副本
	var _this = this;
	
	// 绑定数据
	var _bindingData =  null;
	
	// 列表项数组
	var _items = new Array();
	
	// 当前选中列表项序号
	var _selectedIndex = -1;	
		
	// 列表容器Jquery对象
	var _container = $("#" + containerId);
		
	// 列表据项HTML模版
	var _itemTemplate = _container.html();
	
	// 多选标志
	var _isMultiselected = false;
	
	// 多选标志
	var _isCssActived = false;
	
	// 添加到formControls
	formControls.push(_this);

	// 控件ID
	this.id = containerId;
	
	// 控件类型
	this.type = "ListView";
	
	// 数据项样式
	this.itemCssNormal = "list-item-normal";
	this.itemCssSelected = "list-item-selected";
	this.itemCssActived = "list-item-actived";

	// 数据点击内部触发源
	this.itemClickTrigger = "";
	
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
			var newItem = new entlogic_mui_list_item();	
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
		// 清空容器
		_container.html("");
		
		// 重画列表
		for(var i = 0;  i < _items.length; i++) {		
			var itemId = _this.id + "_r" + i;
			// 输出列表项
			var html = entloigc_template_to_html(_itemTemplate, _bindingData.getRecord(i));	
			// 为列表项添加id
			var item = $(html);
			item.attr("id", itemId);
			item.addClass( _this.itemCssNormal);
			item.click(_itemClick);
			item.dblclick(_itemDbclick);
			item.appendTo(_container);
		}
		var blank = $("<div class='" + _this.itemCssNormal + "' style='flex-grow:1;'></div>");
		blank.appendTo(_container);
		
		// 设置当前行
		if (_isMultiselected) return;
		
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
	this.setMultiselected = function(b) {
		_isMultiselected = b;
	};
	
	// 设置多选时当前选中样式
	this.setCssActived = function(b) {
		_isCssActived = b;
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
		if (!_isMultiselected) return;
		
		for(var i = 0; i < _items.length; i ++) {
			item = _items[i];
			item.isSelected = false;
			var itemObj = $("#" +_this.id + "_r" + i);
			itemObj.removeClass(_this.itemCssSelected);
			itemObj.addClass(_this.itemCssNormal);
			for (var j = 0; j < values.length; j++) {
				if (item.id == values[j]) {
					item.isSelected = true;
					itemObj.removeClass(_this.itemCssNormal);
					itemObj.addClass(_this.itemCssSelected);
					break;
				}
			}
		}
	};

	
	// 设置控件多选值
	this.setValuesByDataTable = function(dataTable,column) {
		if (!_isMultiselected) return;
		
		for(var i = 0; i < _items.length; i ++) {
			item = _items[i];
			item.isSelected = false;
			var itemObj = $("#" +_this.id + "_r" + i);
			itemObj.removeClass(_this.itemCssSelected);
			itemObj.addClass(_this.itemCssNormal);
			for (var j = 0; j < dataTable.getSize(); j++) {
				if (item.id == dataTable.getRecord(j).getValue(column)) {
					item.isSelected = true;
					itemObj.removeClass(_this.itemCssNormal);
					itemObj.addClass(_this.itemCssSelected);
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
		if (_isMultiselected) {
			if (_isCssActived) {
				var item = _items[_selectedIndex];
				if(_selectedIndex>=0)
				{
					var itemObj = $("#" +_this.id + "_r" + _selectedIndex);
					itemObj.removeClass(_this.itemCssActived);	
					if (item.isSelected) {
						itemObj.addClass(_this.itemCssSelected);	
					} else {
						itemObj.addClass(_this.itemCssNormal);
					}
				}
				_selectedIndex = index;
				
				item = _items[_selectedIndex];
				var itemObj = $("#" +_this.id + "_r" + _selectedIndex);
				if (item.isSelected) {
					itemObj.removeClass(_this.itemCssSelected);	
				} else {
					itemObj.removeClass(_this.itemCssNormal);
				}	
				itemObj.addClass(_this.itemCssActived);	
			}
			else{
				var item = _items[index];
				item.isSelected = !item.isSelected;
				var itemObj = $("#" +_this.id + "_r" + index);
				if (item.isSelected) {
					itemObj.removeClass(_this.itemCssNormal);	
					itemObj.addClass(_this.itemCssSelected);	
				} else {
					itemObj.removeClass(_this.itemCssSelected);	
					itemObj.addClass(_this.itemCssNormal);
				}

				_selectedIndex = index;
				_bindingData.setSelectedIndex(index);	
			}
			
		} else {
			var itemObj = $("#" +_this.id + "_r" + _selectedIndex);
			itemObj.removeClass(_this.itemCssSelected);	
			itemObj.addClass(_this.itemCssNormal);	
			
			_selectedIndex = index;
			_bindingData.setSelectedIndex(index);	
			
			var itemObj = $("#" +_this.id + "_r" + _selectedIndex);
			itemObj.removeClass(_this.itemCssNormal);	
			itemObj.addClass(_this.itemCssSelected);	
		}
	};
	
	// 获取行
	this.getItem = function(index) {
		return _items[index];
	};
	
	// 节点单击事件
	var _itemClick = function() {
		var divRowId = this.id;

        //此处为单击事件要执行的代码
		var itemIndex = parseInt(divRowId.replace(containerId+ "_r", ""));
		_this.setSelectedIndex(itemIndex);		
		_this.itemClick($("#" + divRowId));
		console.info("节点-【" + itemIndex + "】 clicked!");
	};
	
	// 节点单击事件
	this.itemClick = function(obj) {};

	// 节点双击击事件
	var _itemDbclick = function() {
        // 取消上次延时未执行的方法
        clearTimeout(clickTimeId);
        var divRowId = this.id;
		var divRow = $("#" + divRowId);
		var itemIndex = parseInt(divRowId.replace(containerId+ "_r", ""));
		_this.setSelectedIndex(itemIndex);				
		_this.itemDbclick($("#" + divRowId));
		console.info("节点-【" + itemIndex + "】 dbclicked!");
	};
	this.itemDbclick = function(obj) {};		
};
