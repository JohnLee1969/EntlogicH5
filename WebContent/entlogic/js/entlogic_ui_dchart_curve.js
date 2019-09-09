/**
 * 
 * @param containerId
 * @param formControls
 */
function entlogic_ui_dchart_curve(containerId) {
	
	// this副本
	var _this = this;
	
	// 绑定数据
	var _bindingData =  {};
		
	// 图表容器
	var _container = $("#" + containerId);
	
	// 图表标题
	var _title = "标题";
	
	var _subTitle = "副标题";
	
	// x轴数据类型
	var _xType = "linear"; 	//The types are 'linear', 'logarithmic' and 'datetime'
	
	// x轴标题
	var _xTitle = "X: []";
	
	// x轴数据
	var _xData = [];
	
	// x轴标题
	var _yTitle = "Y: []";
	
	// y轴数据
	var _yData = [];
	
	// 明细图表
	var _detailChart = null;
	
	// 控制图表
	var _masterChart = null;

	// 创建明细图表
	function _createDetail(masterChart) {
		var detailData = [];
		Highcharts.each(masterChart.series[0].data, function(d) {
			detailData.push(d.y);
		});
		_detailChart = Highcharts.chart(containerId + "_D", {
			chart: {
				marginBottom: 60,
				reflow: false,
				marginTop: 20,
				marginLeft: 50,
				marginRight: 20,
				style: {
					position: 'absolute'
				}
			},
			credits: {
				enabled: false
			},
			title: {
				text: _title
			},
			subtitle: {
				text: _subTitle
			},
			xAxis: {
				type: _xType,
				categories: _xData
			},
			yAxis: {
				title: {
					text: _yTitle
				},
				maxZoom: 0.1
			},
			tooltip: {
				formatter: function () {
					var point = this.points[0];
					return '<b>数据</b><br/>' + 'x: ' + point.x+ ':<br/>' + 'y: ' + Highcharts.numberFormat(point.y, 2);
				},
				shared: true
			},
			legend: {
				enabled: false
			},
			plotOptions: {
				series: {
					marker: {
						enabled: false,
						states: {
							hover: {
								enabled: true,
								radius: 3
							}
						}
					}
				}
			},
			series: [{
				data: detailData
			}],
		});
	}
	
	// 创建导航图
	function _createMaster() {
		_masterChart = Highcharts.chart(containerId + "_M", {
			chart: {
				reflow: false,
				borderWidth: 0,
				backgroundColor: null,
				marginLeft: 50,
				marginRight: 20,
				zoomType: 'x',
				events: {
					// listen to the selection event on the master chart to update the
					// extremes of the detail chart
					selection: function (event) {
						var extremesObject = event.xAxis[0];
						var min = extremesObject.min;
						var max = extremesObject.max;
						var detailData = [];
						var xAxis = this.xAxis[0];
						Highcharts.each(this.series[0].data, function(d) {
							if(d.x > min && d.x < max) {
								detailData.push([d.x, d.y]);
							}	
						});
						// move the plot bands to reflect the new detail span
						xAxis.removePlotBand('mask-before');
						xAxis.addPlotBand({
							id: 'mask-before',
							from: _xData.min,
							to: min,
							color: 'rgba(0, 0, 0, 0.2)'
						});
						xAxis.removePlotBand('mask-after');
						xAxis.addPlotBand({
							id: 'mask-after',
							from: max,
							to: _xData.max,
							color: 'rgba(0, 0, 0, 0.2)'
						});
						_detailChart.series[0].setData(detailData);
						return false;
					}
				}
			},
			title: {
				text: null
			},
			xAxis: {
				type: _xType,
				showLastTickLabel: true,
				maxZoom: _xData.length,
				plotBands: [{
					id: 'mask-before',
					from: 0,
					to: 10000000,
					color: 'rgba(0, 0, 0, 0.2)'
				}],
				title: {
					text: null
				},
				categories: _xData
			},
			yAxis: {
				gridLineWidth: 0,
				labels: {
					enabled: false
				},
				title: {
					text: null
				},
				min: 0.6,
				showFirstLabel: false
			},
			tooltip: {
				formatter: function () {
					return false;
				}
			},
			legend: {
				enabled: false
			},
			credits: {
				enabled: false
			},
			plotOptions: {
				series: {
					fillColor: {
						linearGradient: [0, 0, 0, 70],
						stops: [
							[0, Highcharts.getOptions().colors[0]],
							[1, 'rgba(255,255,255,0)']
						]
					},
					lineWidth: 1,
					marker: {
						enabled: false
					},
					shadow: false,
					states: {
						hover: {
							lineWidth: 1
						}
					},
					enableMouseTracking: false
				}
			},
			series: [{
				data: _yData
			}],
			exporting: {
				enabled: false
			}
		}, function (masterChart) {
			_createDetail(masterChart);
		});
	};
	
	this.setTitle = function(t) {
		_title = t;
	}
	
	this.setSubTitle = function(t) {
		_subTitle = t;
	}
	
	this.setXData = function(d) {
		_xData = d;
	};
	
	this.setYData = function(d) {
		_yData = d;
	};
	
	// 重画控件
	this.draw = function() {	
		/*
		 * 创建 detailContainer 并 append 到 container 中
		 */
		var detailContainer = document.createElement('div');
		detailContainer.id = containerId + "_D";
		detailContainer.style.position = 'absolute';
		detailContainer.style.bottom = '100px';
		detailContainer.style.top = '0px';
		detailContainer.style.left = '0px';
		detailContainer.style.right = '0px';
		_container.append(detailContainer);
		
		/*
		 * 创建 masterContainer 并 append 到 container 中
		 */
		var masterContainer = document.createElement('div');
		masterContainer.id = containerId + "_M";
		masterContainer.style.position = 'absolute';
		masterContainer.style.bottom = '0px';
		masterContainer.style.height = '100px';
		masterContainer.style.left = '0px';
		masterContainer.style.right = '0px';
		_container.append(masterContainer);
		
		/*
		 * 开始创建导航图，详细的图是在导航图的回调函数中创建的
		 * 代码入口
		 */
		_createMaster();		
	};		
}
