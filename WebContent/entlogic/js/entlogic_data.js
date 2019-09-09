/////////////////////////////////////////////////
// entlogic _bindingdata数据类定义

/**
 * 将模版数据中的数据项替换成真实值
 * 
 * 返回：
 * 		替换后的HTML串
 * 参数：
 * 		template			为需要替换的模版串
 * 		dataIndex		绑定数据表的行号
 */
function entloigc_template_to_html(template, dataRecord) {
	var html = template.replace("#[applicationRoot]#", applicationRoot);
	
	var pStart = html.indexOf("#[");
	var pEnd = html.indexOf("]#");
	var itemName = "";
	var dataItem = {};
	var dataValue = "";
	while (pStart >= 0 && pEnd >=0) {
		itemName = html.substring(pStart + 2, pEnd);
		dataItem = dataRecord.getItemByKey(itemName);
		if (dataItem == null) {
			dataValue = "";
		} else {
			dataValue = dataItem.value;
		}		
		html = html.replace("#[" + itemName + "]#", dataValue);
		pStart = html.indexOf("#[");
		pEnd = html.indexOf("]#");
	};
	
	return html;
};

/**
 * 数据项定义
 */
var entlogic_data_item = function() {
	
	var _this = this;
	
	this.key = "";
	
	this.value = "";
	
	this.loadXML = function(xml) {
		_this.key = $(xml).find("key").html();
		_this.value = $(xml).find("value").html();
	};
	
	this.toXML = function() {
		var xml = "";
		xml += "<item>";
		xml += "<key>" + _this.key + "</key>";
		xml += "<value>" + _this.value + "</value>";
		xml += "</item>";
		return xml;
	};
	
	this.clone = function() {
		var o = new entlogic_data_item();
		o.key = _this.key;
		o.value = _this.value;
	};
};

/**
 * 记录数据结构
 */
var entlogic_data_record  = function() {
	
	var _this = this;
	
	this.status = "0";
	
	this.items = new Array();
	
	this.loadXML = function(xml) {
		$(xml).find("item").each(function() {
			var itemXML = "<item>" + $(this).html() + "</item>";
			var item = new entlogic_data_item();
			item.loadXML(itemXML);
			_this.items.push(item);
		});
	};
	
	this.toXML = function() {
		var xml = "";
		xml += "<record>";
		for(var i = 0; i < this.items.length; i++) {
			xml += _this.items[i].toXML();
		};
		xml += "</record>";
		return xml;
	};

	this.getItemByIndex = function(index) {
		if (index < 0 || index >=  _this.items.length) return null;
		return _this.items[index];
	};

	this.getItemByKey = function(key) {
		for(var i = 0; i < this.items.length; i++) {
			if (_this.items[i].key == key) {
				return _this.items[i];
			};
		};
		return null;
	};
	
	this.addItem = function(key, value) {
		var item = new entlogic_data_item();
		item.key = key;
		item.value = value;
		_this.items.push(item);		
		return true;
	};
	
	this.setItem = function(key, value) {
		var item = _this.getItemByKey(key);
		if (item == null) return false;
		item.value = value;
		return true;
	};
	
	this.getValue = function(key) {
		var item = _this.getItemByKey(key);
		if (item == null) return null;
		return item.value;
	};
	
	this.clone = function() {
		var o = new entlogic_data_record();
		for(var i = 0; i < _this.items.length; i++ ) {
			o.addItem(_this.items[i].key, _this.items[i].value);
		}
		return o;
	};
	
	this.toJSON = function() {
		var json = "{";
		var item = null;
		for(var i = 0; i < _this.items.length; i++) {
			item = _this.items[i];
			if (i > 0) json += ","
			json += "'" + item.key+ "': '" + item.value + "'";
		}
		json += "}";			
		return JSON.parse(json);
	};
};

/**
 * 数据表数据结构
 */
var entlogic_data_table  = function() {
	
	var _this = this;
	
	var _selectedIndex = -1;
	
	this.bindingCtls = new Array();
	
	this.id = "";
	
	this.records = new Array();
	
	this.currentRecord = null;
	
	this.clear = function() {
		this.records = new Array();
		_selectedIndex = -1;
	};
	
	this.loadXML = function(xml) {
		_this.records = new Array();
		_this.id = $(xml).find("id").text();		
		$(xml).find("record").each(function() {
			var recordXML = "<record>" + $(this).html() + "</record>";
			var record = new entlogic_data_record();
			record.loadXML(recordXML);
			_this.records.push(record);
		});
		
		if (_this.records.length > 0) {
			_selectedIndex = 0;
		};
		
		_this.synchronizeLayout(false);
	};
	
	this.toXML = function() {
		var xml = "";
		xml += "<data_table>";
		xml += "<id>" + this.id + "</id>";
		xml += "<records>";
		for(var i = 0; i < this.records.length; i++) {
			xml += this.records[i].toXML();
		};
		xml += "</records>";
		xml += "</data_table>";
		return xml;
	};
	
	this.addBindingCtl = function(ctl) {
		var o = {};
		for(var i = 0; i < this.bindingCtls.length; i++) {
			o = _this.bindingCtls[i];
			if (ctl.id == o.id) return;
		};
		_this.bindingCtls.push(ctl);
	};

	this.synchronizeLayout = function(isRowOnly) {
		var ctl = {};
		var ctlType = null;
		for(var i = 0; i < this.bindingCtls.length; i++) {
			ctl = _this.bindingCtls[i];
			if (isRowOnly) {
				ctlType = ctl.type;
				if (ctlType == "ListView") continue;
			}
			ctl.loadData(_this);
		};
	};
	
	this.synchronizeData = function() {
		if (_this.getSize() <= 0 ) return;
		var ctl = {};
		var ctlType = null;
		var dr = null;
		for(var i = 0; i < this.bindingCtls.length; i++) {
			ctl = _this.bindingCtls[i];
			ctlType = ctl.type;
			if (ctlType == "ListView") continue;
			dr = _this.getRecord(_selectedIndex);
			dr.setItem(ctl.getBindingValue(), ctl.getValue());
		};
	};
	
	this.getSelectedIndex = function() {
		return _selectedIndex;
	};
	
	this.setSelectedIndex = function(index) {
		if (index < 0 || index >= _this.records.length) return false;
		_selectedIndex = index;
		_this.currentRecord = _this.records[_selectedIndex];
		_this.synchronizeLayout(true);
		return true;
	};
	
	this.getSize = function() {
		return _this.records.length;
	};
	
	this.getRecord = function(index) {
		if (index < 0 || index >= _this.records.length) return null;
		return _this.records[index];
	};
	
	this.addRecord = function(dr) {
		_this.records.push(dr);
		return true;
	};
	
	this.setRecord = function(index, dr) {
		if (index < 0 || index >= _this.records.length) return false;
		_this.records.splice(index, 1, dr);
		return true;
	};
	
	this.insertRecord = function(index, dr) {
		if (index < 0 || index > _this.records.length) return false;
		_this.records.splice(index, 0, dr);
		return true;
	};
	
	this.removeRecord = function(index) {
		if (index < 0 || index >= _this.records.length) return false;
		_this.records.splice(index, 1);
		return true;
	};

	this.linkTable = function(dt) {
		if (dt == null) return false;
		
		var dr = {};
		for(var i = 0; i < dt.getSize(); i++) {
			dr = dt.getRecord(i);
			_this.addRecord(dr);
		};
		
		return true;
	};
	
	this.columnToStringArray = function(colKey) {
		var arr = new Array(this.getSize());
		for(var i = 0; i < arr.length; i++) {
			arr[i] = this.getRecord(i).getItemByKey(colKey).value;
		};
		return arr;
	};
	
	this.columnToIntArray = function(colKey) {
		var arr = new Array(this.getSize());
		for(var i = 0; i < arr.length; i++) {
			arr[i] = parseInt(this.getRecord(i).getItemByKey(colKey).value);
		};
		return arr;
	};
	
	this.columnToFloatArray = function(colKey) {
		var arr = new Array(this.getSize());
		for(var i = 0; i < arr.length; i++) {
			arr[i] = parseFloat(this.getRecord(i).getItemByKey(colKey).value);
		}
		return arr;
	};
	
	this.clone = function() {
		var o = new entlogic_data_table();
		for (var i = 0; i < _this.getSize(); i++) {
			o.addRecord(_this.records[i].clone());
		}
		return o;
	};
	
	this.toJSONArray = function() {
		var jsonArray = new Array();
		for (var i = 0; i < _this.records.length; i++) {
			jsonArray.push(_this.records[i].toJSON());
		}	
		return jsonArray;
	};
};

/**
 * 数据包数据结构
 */
var entlogic_data_package = function() {
	
	var _this = this;
	
	this.dataTables = new Array();
	
	this.loadXML = function(xml) {	
		_this.dataTables.slice(0, _this.dataTables.length);
		// load data_tables
		$(xml).find("data_table").each(function() {
			var dataTableXML = "<data_table>" + $(this).html() + "</data_table>";
			var dataTable = new entlogic_data_table();
			dataTable.loadXML(dataTableXML);
			_this.dataTables.push(dataTable);
		});
	};
	
	this.toXML = function() {
		var xml = "";
		xml += "<data_package>";
		
		// 生成数据表XML
		for(var i = 0; i < this.dataTables.length; i++) {
			xml += this.dataTables[i].toXML();
		}
		
		xml += "</data_package>";
		return xml;
	};
	
	this.getDataTable = function(tName) {
		for (var i = 0; i < this.dataTables.length; i++) {
			if (this.dataTables[i].id == tName) {
				return this.dataTables[i];
			};
		};
		return null;
	};
	
	this.fillDataTable = function(t, tName) {
		var rt = this.getDataTable(tName);
		if (rt == null) return false;
		t.loadXML(rt.toXML());
		if (t.getSize() >= 0) t.setSelectedIndex(0);
		return true;
	};
	
	this.getReturn = function(key) {
		var rt = this.getDataTable("dtReturn");
		var rc = rt.getRecord(0);
		var item = rc.getItemByKey(key);
		if (item == null) return null;
		return item.value;
	};
};

var entlogic_dbo = function(an, objN) {
	var _this = this;
	
	this.appName = an;
	
	this.name = objN;
	
	this.dataTable = new entlogic_data_table();
	
	this.pageSize = 8000;

	this.pageCount = 1;

	this.pageIndex = 0;
	
	this.whereClause = "";
	
	this.whereClauseMssql = "";
	
	this.whereClauseOracle = "";
	
	this.orderByClause = "order by OID";
	
	this.execCreate = function() {
		var parameter = new entlogic_data_record();
		parameter.addItem("appName", _this.appName);
		parameter.addItem("dboName", _this.name);
		var dataPackage = postBpService("com.entlogic.h5.services.DBOService", "create", parameter);
		if (dataPackage == null) return null;
		var dtNew = dataPackage.getDataTable("dtNew");
		return dtNew.getRecord(0);
	};
	
	this.execInsert = function(dr) {		
		if (typeof(dr) == "undefined") {
			_this.dataTable.synchronizeData();
			dr = _this.dataTable.getRecord(_this.dataTable.getSelectedIndex());
		}
		var xmlData = dr.toXML();
		var parameter = new entlogic_data_record();
		parameter.addItem("appName", _this.appName);
		parameter.addItem("dboName", _this.name);
		parameter.addItem("xmlData", xmlData);
		var dataPackage = postBpService("com.entlogic.h5.services.DBOService", "insert", parameter);
		if (dataPackage == null) return false;
		return true;
	};
	
	this.execDelete = function() {
		var dr = _this.dataTable.getRecord(_this.dataTable.getSelectedIndex());
		if (dr == null) return;
		var oid = dr.getItemByKey("OID").value;
		var parameter = new entlogic_data_record();
		parameter.addItem("appName", _this.appName);
		parameter.addItem("dboName", _this.name);
		parameter.addItem("OID", oid);
		var dataPackage = postBpService("com.entlogic.h5.services.DBOService", "delete", parameter);
		if (dataPackage == null) return false;
		return true;
	};
	
	this.execUpdate = function(dr) {		
		if (typeof(dr) == "undefined") {
			_this.dataTable.synchronizeData();
			dr = _this.dataTable.getRecord(_this.dataTable.getSelectedIndex());
		}
		if (dr == null) return;
		var xmlData = dr.toXML();
		var parameter = new entlogic_data_record();
		parameter.addItem("appName", _this.appName);
		parameter.addItem("dboName", _this.name);
		parameter.addItem("xmlData", xmlData);
		var dataPackage = postBpService("com.entlogic.h5.services.DBOService", "update", parameter);
		if (dataPackage == null) return false;
		return true;
	};
	
	this.execQuery = function() {
		var parameter = new entlogic_data_record();
		parameter.addItem("appName", _this.appName);
		parameter.addItem("dboName", _this.name);
		parameter.addItem("operation", "query");
		parameter.addItem("whereClause", _this.whereClause);
		parameter.addItem("whereClauseMssql", _this.whereClauseMssql);
		parameter.addItem("whereClauseOracle", _this.whereClauseOracle);
		parameter.addItem("orderByClause", _this.orderByClause);
		parameter.addItem("pageIndex", _this.pageIndex);
		parameter.addItem("pageSize", _this.pageSize);
		var dataPackage = postBpService("com.entlogic.h5.services.DBOService", "query", parameter);
		if (dataPackage == null) return false;
		dataPackage.fillDataTable(_this.dataTable, "dtQuery");
		var recordCount = _this.count();
		_this.pageCount = parseInt(recordCount / _this.pageSize);
		if (_this.pageCount == 0) _this.pageCount = 1;
		return true;
	};	
	
	this.count = function() {
		var parameter = new entlogic_data_record();
		parameter.addItem("appName", _this.appName);
		parameter.addItem("dboName", _this.name);
		parameter.addItem("operation", "max");
		parameter.addItem("whereClause", _this.whereClause);
		parameter.addItem("whereClauseMssql", _this.whereClauseMssql);
		parameter.addItem("whereClauseOracle", _this.whereClauseOracle);
		var dataPackage = postBpService("com.entlogic.h5.services.DBOService", "count", parameter);
		if (dataPackage == null) return null;
		var countValue = dataPackage.getReturn("count");
		return parseInt(countValue);
	};
	
	this.getMax = function(colName) {
		var parameter = new entlogic_data_record();
		parameter.addItem("appName", _this.appName);
		parameter.addItem("dboName", _this.name);
		parameter.addItem("operation", "max");
		parameter.addItem("colName", colName);
		parameter.addItem("whereClause", _this.whereClause);
		parameter.addItem("whereClauseMssql", _this.whereClauseMssql);
		parameter.addItem("whereClauseOracle", _this.whereClauseOracle);
		var dataPackage = postBpService("com.entlogic.h5.services.DBOService", "max", parameter);
		if (dataPackage == null) return 0;
		var maxValue = dataPackage.getReturn("max");
		if (maxValue == "null") return 0;
		return maxValue;
	};
	
	this.getMin = function(colName) {
		var parameter = new entlogic_data_record();
		parameter.addItem("appName", _this.appName);
		parameter.addItem("dboName", _this.name);
		parameter.addItem("operation", "max");
		parameter.addItem("colName", colName);
		parameter.addItem("whereClause", _this.whereClause);
		parameter.addItem("whereClauseMssql", _this.whereClauseMssql);
		parameter.addItem("whereClauseOracle", _this.whereClauseOracle);
		var dataPackage = postBpService("com.entlogic.h5.services.DBOService", "min", parameter);
		if (dataPackage == null) return 0;
		var minValue = dataPackage.getReturn("min");
		if (minValue == "null") return 0;
		return minValue;
	};
	
	this.getByOid = function(oid) {
		var parameter = new entlogic_data_record();
		parameter.addItem("appName", _this.appName);
		parameter.addItem("dboName", _this.name);
		parameter.addItem("operation", "query");
		parameter.addItem("whereClause", "where OID = '" + oid + "'");
		parameter.addItem("whereClauseMssql", "where OID = '" + oid + "'");
		parameter.addItem("whereClauseOracle", "where OID = '" + oid + "'");
		parameter.addItem("orderByClause", _this.orderByClause);
		parameter.addItem("pageIndex", _this.pageIndex);
		parameter.addItem("pageSize", _this.pageSize);
		var dataPackage = postBpService("com.entlogic.h5.services.DBOService", "query", parameter);
		if (dataPackage == null) return null;
		var dtQuery = dataPackage.getDataTable("dtQuery");
		return dtQuery.getRecord(0);		
	};
	
	this.deleteByOid = function(oid) {
		var parameter = new entlogic_data_record();
		parameter.addItem("appName", _this.appName);
		parameter.addItem("dboName", _this.name);
		parameter.addItem("OID", oid);
		var dataPackage = postBpService("com.entlogic.h5.services.DBOService", "delete", parameter);
		if (dataPackage == null) return false;
		return true;
	};
	
	this.resetOrderCode = function() {
		var parameter = new entlogic_data_record();
		parameter.addItem("appName", _this.appName);
		parameter.addItem("dboName", _this.name);
		var dataPackage = postBpService("com.entlogic.h5.services.DBOService", "resetOrderCode", parameter);
		if (dataPackage == null) return false;
		return true;
	};	
	
	this.resetSN = function() {
		var recordCount = _this.count();
		if (recordCount >  _this.pageSize) {
			alert("使用查询分页情况下，不可以使用resetSN方法！")
			return false;
		}
		_this.execQuery();
		var dr = null;
		for(var i = 0;  i < _this.dataTable.getSize(); i++) {
			dr = _this.dataTable.getRecord(i);
			dr.setItem("SN", i + "");
			_this.execUpdate(dr);
		}
		return _this.execQuery();
	};
};

var entlogic_dba = function(dsn) {
	var _this = this;
	
	this.dsn = dsn;
	
	this.SQL = "";
	
	this.SQL_MSSQL = "";
	
	this.SQL_ORACLE = "";
	
	this.setParameter = function(par, val) {
		var reg = new RegExp("#" + par + "#", "g");
		_this.SQL = _this.SQL.replace(reg, val);
		_this.SQL_MSSQL = _this.SQL_MSSQL.replace(reg, val);
		_this.SQL_ORACLE = _this.SQL_ORACLE.replace(reg, val);
	};
	
	this.transactionBegin = function() {
		var parameter = new entlogic_data_record();
		var dataPackage = postBpService("com.entlogic.h5.services.DBAService", "transactionBegin", parameter);
		var transactionId = dataPackage.getReturn("transactionId");
		if (dataPackage == null) return null;
		return transactionId;
	};
	
	this.transactionCommit = function(transactionId) {
		var parameter = new entlogic_data_record();
		parameter.addItem("transactionId", transactionId);
		var dataPackage = postBpService("com.entlogic.h5.services.DBAService", "transactionCommit", parameter);
		if (dataPackage == null) return false;
		return true;
	};
	
	this.transactionRollback = function(transactionId) {
		var parameter = new entlogic_data_record();
		parameter.addItem("transactionId", transactionId);
		var dataPackage = postBpService("com.entlogic.h5.services.DBAService", "transactionRollback", parameter);
		if (dataPackage == null) return false;
		return true;
	};
	
	this.execQuery = function(transactionId) {
		var parameter = new entlogic_data_record();
		if (typeof(transactionId) != "undefined") {
			parameter.addItem("transactionId", transactionId);
		}
		parameter.addItem("dsn", _this.dsn);
		parameter.addItem("SQL", _this.SQL);
		parameter.addItem("SQL_MSSQL", _this.SQL_MSSQL);
		parameter.addItem("SQL_ORACLE", _this.SQL_ORACLE);
		var dataPackage = postBpService("com.entlogic.h5.services.DBAService", "query", parameter);
		if (dataPackage == null) return null;
		var dtQuery = dataPackage.getDataTable("dtQuery");
		return dtQuery;
	};
	
	this.execUpdate = function(transactionId) {
		var parameter = new entlogic_data_record();
		if (typeof(transactionId) != "undefined") {
			parameter.addItem("transactionId", transactionId);
		}
		parameter.addItem("dsn", _this.dsn);
		parameter.addItem("SQL", _this.SQL);
		parameter.addItem("SQL_MSSQL", _this.SQL_MSSQL);
		parameter.addItem("SQL_ORACLE", _this.SQL_ORACLE);
		var dataPackage = postBpService("com.entlogic.h5.services.DBAService", "update", parameter);
		if (dataPackage == null) return false;
		return true;
	};
};