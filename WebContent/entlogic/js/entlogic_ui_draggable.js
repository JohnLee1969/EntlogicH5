/**
 * 
 * @param obj
 */
function entlogic_ui_draggable(objName, scale) {

	var obj = $("#" + objName);
	obj.bind("mousedown", start);
	obj.css("cursor", "move");

	var _this = this;

	var gapX = 0;
	var gapY = 0;
	
	this.x = 0;
	this.y = 0;

	function start(event) {
		if (event.button == 0) {
			_this.x = obj.offset().left + obj.width() / 2 * scale;
			_this.y = obj.offset().top + obj.height() / 2 * scale;

			gapX = event.clientX;
			gapY = event.clientY;

			obj.css("cursor", "move");

			$(document).bind("mousemove", move);
			$(document).bind("mouseup", stop);
		}
		// return false; //阻止默认事件或冒泡
	};

	function move(event) {
		 _this.x = _this.x + event.clientX - gapX - obj.width() / 2;
		 _this.y = _this.y + event.clientY - gapY - obj.height() / 2;

		obj.css({
			"left" : _this.x + "px",
			"top" : _this.y + "px"
		});
		
		_this.dragMove();
		
		// return false; //阻止默认事件或冒泡
	};

	function stop() {
		obj.css("cursor", "move");

		// 解绑定，这一步很必要，前面有解释
		$(document).unbind("mousemove", move);
		$(document).unbind("mouseup", stop);
		
		_this.dragStop();
	}
	
	this.dragMove = function() {
		
	};
	
	this.dragStop = function() {
		
	};
};

/**
 * 
 * @param obj
 */
function entlogic_ui_draggable_v(objName, scale) {

	var obj = $("#" + objName);
	obj.bind("mousedown", start);
	obj.css("cursor", "s-resize");

	var _this = this;

	var gapY = 0;
	
	this.y = 0;
	this.offsetY = 0;

	function start(event) {
		if (event.button == 0) {
			_this.y = obj.offset().top;

			gapY = event.clientY;

			obj.css("cursor", "s-resize");

			$(document).bind("mousemove", move);
			$(document).bind("mouseup", stop);
		}
		
		_this.dragStart();
		
		return false; //阻止默认事件或冒泡
	};

	function move(event) {
		 _this.y = event.clientY - 26;
		 _this.offsetY = event.clientY - gapY;
		 
		obj.css({
			"top" : _this.y + "px"
		});
		
		_this.dragMove();
		
		return false; //阻止默认事件或冒泡
	};

	function stop() {
		obj.css("cursor", "s-resize");

		// 解绑定，这一步很必要，前面有解释
		$(document).unbind("mousemove", move);
		$(document).unbind("mouseup", stop);
		
		_this.dragStop();
	}
	
	this.dragStart = function() {
		
	};
	
	this.dragMove = function() {
		
	};
	
	this.dragStop = function() {
		
	};
};


/**
 * 
 * @param obj
 */
function entlogic_ui_draggable_h(objName) {

	var obj = $("#" + objName);
	obj.bind("mousedown", start);
	obj.css("cursor", "w-resize");
	
	var _this = this;

	var gapX = 0;
	
	this.x = 0;
	this.offsetX = 0;

	function start(event) {
		if (event.button == 0) {
			_this.x = obj.offset().left;

			gapX = event.clientX;

			obj.css("cursor", "w-resize");

			$(document).bind("mousemove", move);
			$(document).bind("mouseup", stop);
		}
		
		_this.dragStart();
		
		return false; //阻止默认事件或冒泡
	};

	function move(event) {
		 _this.x = event.clientX;
		 _this.offsetX = event.clientX - gapX;

		obj.css({
			"left" : _this.x + "px"
		});
		
		_this.dragMove();
		
		return false; //阻止默认事件或冒泡
	};

	function stop() {
		obj.css("cursor", "w-resize");

		// 解绑定，这一步很必要，前面有解释
		$(document).unbind("mousemove", move);
		$(document).unbind("mouseup", stop);
		
		_this.dragStop();
	}
	
	this.dragStart = function() {
		
	};
	
	this.dragMove = function() {
		
	};
	
	this.dragStop = function() {
		
	};
};