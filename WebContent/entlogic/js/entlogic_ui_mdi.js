/**
 * entlogic_ui_mdi: 多页控件
 */ 
function entlogic_ui_mdi_tab(containerId, defaultUrl) {
	
	// this副本
	var _this = this;
			
	// 容器
	var _container = $("#" + containerId);
	
	// 标题数组
	var _urls = new Array();
	
	// 标题数组
	var _heads = new Array();

	// 内嵌帧数组
	var _iframes = new Array();
	
	// 当前显示页序号
	var _selectedIndex = -1;
	
	// 序号
	var _tabSn = 0;
	
	// 初始化容器
	_container.attr("class", "mdi");
	
	var _mdi_head = $('<div></div>');
	_mdi_head.attr("id" , containerId + "_header");
	_mdi_head.attr("class" , "mdi-head");
	_mdi_head.appendTo(_container);
	
	var _mdi_content = $('<div></div>');
	_mdi_content.attr("id" , containerId + "_content");
	_mdi_content.attr("class" , "mdi-content");
	_mdi_content.appendTo(_container);
		
	// 关闭页
	var _closePage = function() {
		var tabId = this.id.replace("_btn_", "_tab_");
		for(var i = 0; i < _heads.length; i++) {
			if(_heads[i].attr("id") == tabId) break;
		}
		var sn = i;
		_this.closePage(sn);
	};
	
	// 选择页
	var _selectPage = function() {
		var tabId = this.id;
		for(var i = 0; i < _heads.length; i++) {
			if(_heads[i].attr("id") == tabId) break;
		}
		var sn = i;
		_this.selectPage(sn);
	};
	
	// 对象Id
	this.id = containerId;
	
	// 默认页
	this.defaultPageUrl = null;

	// 添加一页
	this.addPage = function(title, url) {
		for (var i = 0; i < _urls.length; i++) {
			if (url == _urls[i]) {
				_this.selectPage(i);
				return;
			}
		}
		
		_tabSn ++;
		
		_urls.push(url);
		
		var newFrame =  $("<iframe style=‘width: 100%; height:100%;’></iframe>");
		newFrame.attr("src", url);
		newFrame.appendTo(_mdi_content);
		_iframes.push(newFrame);
		
		var newTab =  $("<div></div>");
		newTab.attr("id", _this.id + "_tab_" + _tabSn);
		newTab.attr("class", "mdi-tab");
		var newButton = $("<button class='iconfont' style='font-size:16px;'>&#xe615;</button>");
		if (url == _this.defaultPageUrl)  newButton = $("<button class='iconfont' style='font-size:16px;'>&#xe663;</button>");
		newButton.attr("id", _this.id + "_btn_" + _tabSn);
		newButton.attr("class", "mdi-close-btn");
		newButton.click(_closePage);
		newButton.appendTo(newTab);
		var newText = $("<div></div>");
		newText.html(title);
		newText.attr("id", _this.id + "_title_" + _tabSn);
		newText.appendTo(newTab);
		newTab.click(_selectPage);
		newTab.appendTo(_mdi_head);
		_heads.push(newTab);
		
		_this.selectPage(_heads.length - 1);
	};
	
	// 关闭一页
	this.closePage = function(sn) {
		var url = _urls[sn];
		if (url == _this.defaultPageUrl) return;
		
		_heads[sn].remove();
		_iframes[sn].remove();
		
		_urls.splice(sn, 1);
		_heads.splice(sn, 1);
		_iframes.splice(sn, 1);
			
		if (sn < _selectedIndex) sn  = _selectedIndex - 1;
		if (sn > _iframes.length - 1) sn --;
		if (_iframes.length == 0) {
			_selectedIndex = -1; 
			return false;
		}
		_this.selectPage(sn);
		
		return false;
	};
	
	// 选择一页
	this.selectPage = function(sn) {
		if (_selectedIndex >= 0 && _selectedIndex < _heads.length) {
			_heads[_selectedIndex].attr("class", "mdi-tab");
			_iframes[_selectedIndex].hide();
		}
		
		_selectedIndex =sn;
		_heads[_selectedIndex].attr("class", "mdi-tab-selected");
		_iframes[_selectedIndex].show();
		if (typeof(_iframes[_selectedIndex][0].contentWindow.refresh) != "undefined") _iframes[_selectedIndex][0].contentWindow.refresh();
	};
	
	// 修改页面标题
	this.setPageTitle = function(url, title) {
		for (var i = 0; i < _urls.length; i++) {
			if (url == _urls[i]) {
				var t = $("#" + _this.id + "_title_" + i);
				t.html(title);
				return;
			}
		}
	};
	
	// 获取当前页索引
	this.getSelectedIndex = function() {
		return _selectedIndex;
	};
	
	// 初始化首页
	if (typeof(defaultUrl) != "undefined") {
		_this.defaultPageUrl = defaultUrl;
		_this.addPage("首页",  _this.defaultPageUrl);
	} else {
		_this.defaultPageUrl = null;
	}	
};

/**
 * entlogic_ui_mdi: 多页控件
 */ 
function entlogic_ui_mdi(containerId) {
	
	// this副本
	var _this = this;
			
	// 容器
	var _container = $("#" + containerId);
	
	// 内嵌帧数组
	var _iframes = new Map();
		
	// 初始化
	_container.attr("class", "mdi");
	
	// 对象Id
	this.id = containerId;
	
	// 当前显示页
	this.currentPage = null;
	
	// 显示页
	this.getPage = function(title) {
		var selectPage = _iframes.get(title);
		return selectPage;
	};

	// 清空
	this.clear = function() {
		_container.empty();
		_iframes.clear();
	};

	// 添加一页
	this.addPage = function(title, url, mod) {
		var newFrame =  $("<iframe class='eb-iframe'></iframe>");
		if (mod == "Mobile")  newFrame =   $("<iframe class='eb-iframe-mobile'></iframe>");
		newFrame.attr("src", url);
		newFrame.appendTo(_container);
		_iframes.set(title, newFrame);
		
		return newFrame;
	};
	
	// 关闭一页
	this.closePage = function(title) {
		_iframes.remove(title);
	};
	
	// 显示页
	this.showPage = function(title) {
		var selectPage = _iframes.get(title);
		if (selectPage == null) return;
		
		if (_this.currentPage != null) _this.currentPage.hide();
		_this.currentPage = selectPage;
		_this.currentPage.show();
	};
};
