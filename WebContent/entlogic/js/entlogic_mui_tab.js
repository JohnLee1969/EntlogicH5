/**
 * entlogic_ui_mdi: 多页控件
 */
function entlogic_mui_tab(containerId, mode) {

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

	// 整体容器样式
	var _cssContainer = "emui-tab-container-h";
	if (mode != "h")
		_cssContainer = "emui-tab-container-v";

	// 头容器样式
	var _cssHead = "emui-tab-head-h";
	if (mode != "h")
		_cssHead = "emui-tab-head-v";

	// 内容容器样式
	var _cssContent = "emui-tab-content";

	// 标签样式
	var _cssTab = "emui-tab-h";
	if (mode != "h")
		_cssTab = "emui-tab-v";
	var _cssTabSelected = "emui-tab-selected-h";
	if (mode != "h")
		_cssTabSelected = "emui-tab-selected-v";

	// 初始化容器
	_container.attr("class", _cssContainer);

	var _mdi_head = $('<div></div>');
	_mdi_head.attr("id", containerId + "_header");
	_mdi_head.attr("class", _cssHead);
	_mdi_head.appendTo(_container);

	var _mdi_content = $('<div></div>');
	_mdi_content.attr("id", containerId + "_content");
	_mdi_content.attr("class", _cssContent);
	_mdi_content.appendTo(_container);

	// 选择页
	var _selectPage = function() {
		
		var tabId = this.id;
		for (var i = 0; i < _heads.length; i++) {
			if (_heads[i].attr("id") == tabId)
				break;
		}
		var sn = i;
		_this.selectPage(sn);
		_this.setCtlStatus();
	};

	// 对象Id
	this.id = containerId;

	// 获取内嵌帧
	this.getCurrentPage = function() {
		return _iframes[_selectedIndex][0].contentWindow;
	};

	// 添加一页
	this.addPage = function(title, url) {
		for (var i = 0; i < _urls.length; i++) {
			if (url == _urls[i]) {
				_this.selectPage(i);
				return;
			}
		}

		_tabSn++;

		_urls.push(url);

		var newFrame = $('<iframe style=‘width: 100%; height:100%;’></iframe>');
		newFrame.attr("src", url);
		newFrame.appendTo(_mdi_content);
		_iframes.push(newFrame);

		var newTab = $("<div></div>");
		newTab.attr("id", _this.id + "_tab_" + _tabSn);
		newTab.attr("class", _cssTab);
		var newText = $("<span></span>");
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
		if (url == _this.defaultPageUrl)
			return;

		_heads[sn].remove();
		_iframes[sn].remove();

		_urls.splice(sn, 1);
		_heads.splice(sn, 1);
		_iframes.splice(sn, 1);

		if (sn < _selectedIndex)
			sn = _selectedIndex - 1;
		if (sn > _iframes.length - 1)
			sn--;
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
			_heads[_selectedIndex].attr("class", _cssTab);
			_iframes[_selectedIndex].hide();
		}

		_selectedIndex = sn;
		_heads[_selectedIndex].attr("class", _cssTabSelected);
		_iframes[_selectedIndex].show();
		if (typeof (_iframes[_selectedIndex][0].contentWindow.refresh) != "undefined")
			_iframes[_selectedIndex][0].contentWindow.refresh();
	};
	
	// 获取当前行序号
	this.getSelectedIndex = function() {
		return _selectedIndex;
	};
	
	// 获取当前行序号
	this.getSize = function() {
		return _iframes.length;
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

	this.setCtlStatus = function() {
	};
};
