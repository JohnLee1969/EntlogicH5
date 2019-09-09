/**
 * entlogic_ui_treeview_node: 树形列表节
 */ 
function entlogic_ui_treeview_node() {
	// 创建自己
	var _this = this;
	
	// 节点收放按钮点击事件
	var  _foldIcon = null;
	var _foldIcon_click = function() {
		console.info("节点-【" + _this.sn + "】foldIcon click!");

		_this.treeview.setValue(_this.id);
		if (_this.isExpanded) {
			_this.collapse();
		} else {
			_this.expand();
		} 
		//return false;
	};
	
	// 多选框点击事件
	var _checkBox = null;
	var _checkBox_click = function() {
		console.info("节点-【" + _this.sn + "】checkBox click!");
		var b = ! _this.isSelected;
		_this.setMultiselected(b, true);
	};
	
	// 节点单击时间
	var _node = null;
	var _nodeClick = function() {
		console.info("节点-【" + _this.sn + "】 clicked!");
		_this.treeview.setValue(_this.id);
		_this.treeview.nodeClick();
		return false;
	};	
	
	// 节点双击事件
	var _nodeDbclick = function() {
		console.info("节点-【" + _this.sn + "】 dbclicked!");		
		_this.treeview.setValue(_this.id);
		_this.treeview.nodeDbclick();
		return false;
	};
	
	this.treeview = null;
	
	this.sn = -1;
	this.childSn = -1;
	this.id = "";
	this.lv = -1;
	this.text = "";
	this.data = null;
	
	this.isSelected = false;
	this.isExpanded = true;
	this.isEnd = false;
	
	this.parentNode = null;
	this.childNodes = new Array();
	
	this.draw = function() {
		// 画出本节点
		var html = "";
		if (_this.parentNode != null) {
			var containerId = _this.treeview.id;
			var nodeId = containerId + "_r" + _this.sn;
			var foldButtonId = containerId + "_b" +  _this.sn;
			var checkBoxId = containerId + "_c" +  _this.sn;
			// 节点开始
			html += "<div id='" + nodeId + "' class='tree-node'>";
			// 输出级别缩进
			for (var j = 0;  j < _this.lv;  j++) {
				html += "<div class='block'></div>";
			}
			// 展开收起按钮
			var foldIcon = _this.treeview.collapseIcon;
			if (_this.isExpanded) {
				foldIcon = _this.treeview.expandIcon;
			}
			if (_this.childNodes.length == 0) {
				foldIcon = _this.treeview.emptyIcon;
			} 
			html += "<button id='" + foldButtonId + "' class='tree-btn'>" + foldIcon + "</button>";
			// 多选框
			if (_this.treeview.isMultiselected) {
				html += "<div id='" + checkBoxId + "' type='checkbox' class='tree-chk'>&#xe62f;</div>";
			}		
			// 输出节点内容
			html += entloigc_template_to_html(_this.treeview.nodeTemplate, _this.data);				
			// 节点结束
			html += "</div>";
		}
		
		// 画子节点
		for(var i = 0; i < _this.childNodes.length; i ++) {
			html +=  _this.childNodes[i].draw();
		}
	
		return html;
	};
	
	this.init = function() {
		// 画出本节点
		if (_this.parentNode != null) {
			// 获取容器Id
			var containerId = _this.treeview.id;
			// 初始化节点状态
			_node = $("#" + containerId + "_r" + _this.sn);
			if ($.isEmptyObject(_this.parentNode)) {
				_node.show();
			} else if(_this.parentNode.isExpanded) {
				_node.show();
			}
			else {
				_node.hide();
			}
			// 添加收放节点事件
			_foldIcon = $("#" + containerId + "_b" + _this.sn);
			_foldIcon.click(_foldIcon_click);
			// 添加收放节点事件
			_checkBox = $("#" + containerId + "_c" + _this.sn);
			_checkBox.click(_checkBox_click);
			// 添加行点击事件
			var divRow = $("#" + containerId + "_r" + _this.sn);
			_node.click(_nodeClick);
			_node.dblclick(_nodeDbclick);
		}
		
		// 画子节点
		for(var i = 0; i < _this.childNodes.length; i ++) {
			_this.childNodes[i].init();
		}
	};
	
	this.show = function() {
		if (_this.parentNode.data == null) {
			if (_this.id != _this.treeview.currentNode.id) _this.expand();
			return;
		}
		_this.parentNode.isExpanded = true;
		_this.parentNode.show();
	};
	
	this.expand = function() {
		_this.isExpanded = true;
		var row = $("#" + _this.treeview.id + "_b" +  _this.sn);
		if ( _this.childNodes.length > 0) row.html(_this.treeview.expandIcon);
		
		for(var i = 0; i < _this.childNodes.length; i++) {
			row = $("#" + _this.treeview.id+ "_r" + _this.childNodes[i].sn);
			row.show();
			if(_this.childNodes[i].isExpanded) _this.childNodes[i].expand();
		}
	};
	
	this.collapse = function() {
		_this.isExpanded = false;
		var row = $("#" + _this.treeview.id + "_b" +  _this.sn);
		if ( _this.childNodes.length > 0) row.html(_this.treeview.collapseIcon);

		for(var i = 0; i < _this.childNodes.length; i++) {
			row = $("#" + _this.treeview.id+ "_r" + _this.childNodes[i].sn);
			row.hide();
			_this.childNodes[i].collapse();
		}
	};
	
	this.setMultiselected = function(b,  bAll) {
		_this.isSelected = b;
		if (_this.isSelected) {
			_checkBox.html("&#xe66d;");
		} else {
			_checkBox.html("&#xe62f;");
		}

		if (bAll) {
			for(var i = 0; i < _this.childNodes.length; i++) {
				_this.childNodes[i].setMultiselected(b);
			}
		}
	};
	
	this.moveUp = function() {
		if (_this.childSn == 0) return;		
		var previousNode = _this.parentNode.childNodes[_this.childSn - 1];
		var tempId = _this.id;
		var tempData = _this.data;
		var tempChildNodes = _this.childNodes;
		_this.id = previousNode.id;
		_this.data = previousNode.data;
		_this.childNodes = previousNode.childNodes;
		previousNode.id = tempId;
		previousNode.data = tempData;
		previousNode.childNodes = tempChildNodes;
	};
	
	this.moveDown = function() {
		if (_this.childSn >= _this.parentNode.childNodes.length - 1) return;
		var nextNode = _this.parentNode.childNodes[_this.childSn + 1];
		var tempId = _this.id;
		var tempData = _this.data;
		var tempChildNodes = _this.childNodes;
		_this.id = nextNode.id;
		_this.data = nextNode.data;
		_this.childNodes = nextNode.childNodes;
		nextNode.id = tempId;
		nextNode.data = tempData;
		nextNode.childNodes = tempChildNodes;
	};
	
	this.getNode = function(nodeId) {
		var node = null;
		if ( _this.id == nodeId) {
			return _this;
		}
		for(var i = 0; i < _this.childNodes.length; i++) {
			node = _this.childNodes[i].getNode(nodeId);
			if (node != null) break;
		}
		return node;
	};
	
	this.getData = function(dataTable) {
		if (_this.data != null) {
			_this.lv = _this.parentNode.lv + 1;
			_this.data.setItem("lv", _this.lv+ "");
			dataTable.addRecord(_this.data);
		}
		for(var i = 0; i < _this.childNodes.length; i++) {
			this.childNodes[i].getData(dataTable);
		}
		return dataTable;
	};
	
	this.getOrderCodeArray = function(orderCode) {
		var orderCodes = new Array();
		orderCodes.push(orderCode);
		var sn = null;
		var oc = null
		for (var i = 0; i < _this.childNodes.length; i++) {
			if (i < 100) sn = "0";
			if (i < 10) sn = "00";
			sn += i + "";
			ocs = _this.childNodes[i].getOrderCodeArray(orderCode + sn);
			for (var j = 0; j < ocs.length; j ++) {
				orderCodes.push(ocs[j]);
			}
		}
		return orderCodes;
	};
	
	this.clone = function() {
		var o = new entlogic_ui_treeview_node();
		o.treeview  = _this.treeview;
		o.sn = _this.sn;
		o.childSn = _this.childSn;
		o.id = _this.id;
		o.lv = _this.lv;
		o.text = _this.text;
		o.data = _this.data.clone();
		o.parentNode = _this.parentNode;
				
		var child = null;
		for (var i = 0;  i < _this.childNodes.length; i++) {
			child = _this.childNodes[i].clone();
			child.parentNode = o;
			o.childNodes.push(child);
		}
		return o;
	};
};

/**
 * entlogic_ui_treeview: 树形列表控件
 */ 
function entlogic_ui_treeview(containerId, formControls) {
	
	// this副本
	var _this = this;
	
	// 绑定数据
	var _bindingData = null;
	
	// 树形列表根节点
	var _rootNode = new entlogic_ui_treeview_node();
		
	// 树形列表容器
	var _container = $("#" + containerId);
	
	// 添加到formControls
	formControls.push(_this);
	
	// 控件ID
	this.id = containerId;
	
	// 控件类型
	this.type = "ListView";
	
	// 多选标志
	this.isMultiselected = false;

	// 展开控制按钮 
	this.expandIcon = "&#xe607;";
	this.collapseIcon = "&#xe695;";
	this.emptyIcon = "▪";
	
	// 节点显示模版
	this. nodeTemplate = _container.html();
	
	// 根节点
	this.rootNode = _rootNode;
	
	// 当前节点
	this.currentNode = null;

	// 绑定数据
	this.setBindingData = function(bindingData) {
		// 绑定数据
		_bindingData = bindingData;
		bindingData.addBindingCtl(this);
	};
	
	// 获取绑定数据
	this.getBindingData = function() {
		return _bindingData;
	};
	
	// 重载数据
	this.loadData = function(data) {
		// 绑定数据
		_bindingData = data;
		
		// 清空
		_rootNode = new entlogic_ui_treeview_node();
		_this.rootNode = _rootNode;
		
		// 添加节点数据
		var lastNode = _rootNode;
		for(var i = 0;  i < _bindingData.records.length;  i++) {
			var record = _bindingData.getRecord(i);
			var newNode = new entlogic_ui_treeview_node();	
			newNode.treeview = _this;
			newNode.sn = i;
			newNode.lv = parseInt(record.getItemByKey("lv").value);
			newNode.id = record.getItemByKey("id").value;
			newNode.data = record;
			newNode.isExpanded = false;
			newNode.isSelected = false;
			 if (newNode.lv - lastNode.lv == 1) {
				newNode.parentNode = lastNode;
				newNode.childSn = lastNode.childNodes.length;
				lastNode.childNodes.push(newNode);
			} else if (newNode.lv - lastNode.lv == 0) {
				newNode.parentNode = lastNode.parentNode;
				newNode.childSn = lastNode.parentNode.childNodes.length;
				lastNode.parentNode.childNodes.push(newNode);
			} else {
				while(newNode.lv - lastNode.lv < 0) {
					lastNode = lastNode.parentNode;
				}
				newNode.parentNode = lastNode.parentNode;
				newNode.childSn = lastNode.parentNode.childNodes.length;
				lastNode.parentNode.childNodes.push(newNode);
			}
			lastNode = newNode;
		}
		
		//  画出
		_this.draw();
		
		// 默认选中
		if (_rootNode.childNodes.length >0) {
			_this.setValue(_rootNode.childNodes[0].id);
		}
	};
	
	// 重画控件
	this.draw = function() {	
		// 重画树形列表
		var html = _rootNode.draw();
		_container.html(html);	

		// 初始化树形列表
		_rootNode.init();
		
		// 自动选中默认节点
		if (_this.currentNode != null) {
			_this.setValue(_this.currentNode.id);
		}
	};
	
	// 隐藏
	this.hide = function() {
		_container.hide();
	};
	
	// 显示
	this.show = function() {
		_container.show();
	};
	
	// 获取节点数
	this.getSize = function() {
		return _bindingData.getSize();
	};
	
	// 获取节点
	this.getNode = function(id) {
		return _rootNode.getNode(id);
	};
	
	// 获取上一个值
	this.getPreviousNode = function() {
		if (_this.currentNode.childSn == 0) return null;
		return _this.currentNode.parentNode.childNodes[_this.currentNode.childSn - 1];
	};
	
	// 获取上一个值
	this.getNextNode = function() {
		if (_this.currentNode.childSn >= _this.currentNode.parentNode.childNodes.length -1) return null;
		return _this.currentNode.parentNode.childNodes[_this.currentNode.childSn + 1];
	};
		
	// 获取控件取值
	this.getValue = function() {
		if (_this.currentNode == null) return null;
		return _this.currentNode.id;
	};
	
	// 设置控件值
	this.setValue = function(v) {
		var node = _rootNode.getNode(v);
		if (node == null) return;
		
		if (_this.currentNode != null) {
			$("#" +  _this.id+ "_r" + _this.currentNode.sn).attr("class", "tree-node");
		}		
		_this.currentNode = node;
		$("#" +  _this.id+ "_r" + _this.currentNode.sn).attr("class", "tree-node-selected");
		
		_this.currentNode.show();
		
		_bindingData.setSelectedIndex(_this.currentNode.sn);
	};
	
	// 获取多选值
	this.getValues = function() {
		var dt = new entlogic_data_table();
		_rootNode.getData(dt);
		var values = new Array();
		for(var i = 0; i < dt.getSize(); i++) {
			var value = dt.getRecord(i).getValue("OID");
			var node = _this.getNode(value);
			if (node.isSelected) values.push(dt.getRecord(i).getValue("OID"));
		}
		return values;
	};
	
	// 上移节点
	this.moveUpNode = function() {
		var id = _this.currentNode.id;
		_this.currentNode.moveUp();
		
		_bindingData.clear();
		_rootNode.getData(_bindingData);
		_this.loadData(_bindingData);
		_this.setValue(id);
	};
	
	// 下移节点
	this.moveDownNode = function() {
		var id = _this.currentNode.id;
		_this.currentNode.moveDown();
		
		_bindingData.clear();
		_rootNode.getData(_bindingData);
		_this.loadData(_bindingData);
		_this.setValue(id);
	};
	
	// 添加节点
	this.addNode = function(newNode) {
		newNode.parentNode = _this.currentNode;	
		_this.currentNode.childNodes.push(newNode);
		
		_bindingData.clear();
		_rootNode.getData(_bindingData);
		_this.loadData(_bindingData);
		_this.setValue(newNode.id);
	};
	
	this.insertNode = function(newNode) {
		newNode.parentNode = _this.currentNode.parentNode;	
		_this.currentNode.parentNode.childNodes.splice(_this.currentNode.childSn, 0, newNode);
		
		_bindingData.clear();
		_rootNode.getData(_bindingData);
		_this.loadData(_bindingData);
		_this.setValue(newNode.id);
	};
	
	// 删除节点
	this.removeNode = function(id) {
		var node = _this.getNode(id);
		if (node == null) return;
		node.parentNode.childNodes.splice(node.childSn, 1);
		_bindingData.clear();
		_rootNode.getData(_bindingData);
		_this.loadData(_bindingData);
		return true;
	};
	
	// 节点单击事件
	this.nodeClick = function() {};

	// 节点双击击事件
	this.nodeDbclick = function() {};		
};
