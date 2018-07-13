import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
	options: {
    chart: {
        type: 'column'
    },
    title: {
      text: 'MessageCounts'
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
          text: 'Counts'
      }
    }
  },
  series: [
    {
      name: 'Messages',
      data: []
    }
  ],
  
  classNames:   [ 'highcharts-wrapper' ],
  content:      undefined,
  chartOptions: undefined,
  chart:        null,
  
  buildOptions: Em.computed('chartOptions', 'content.@each.isLoaded', function() {
    var chartContent, chartOptions, defaults;
    chartOptions = this.get('options');
    chartContent = this.get('series');
    defaults = {
      series: chartContent
    };
    return Em.merge(defaults, chartOptions);
  }),
  
  _renderChart: (function() {
    this.drawLater();
	Highcharts.theme = {
			colors: [
			'#258be2', 
			'#666666', 
			'#f45b5b', 
			'#8085e9', 
			'#8d4654', 
			'#7798bf', 
			'#aaeeee', 
			'#ff0066', 
			'#eeaaee', 
			'#55bf3b', 
			'#df5353', 
			'#7798bf', 
			'#aaeeee'
			],
			chart: {
				backgroundColor: null,
				style: {
					fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
				}
			},
			title: {
				style: {
					color: 'black',
					fontSize: '18px',
					fontWeight: 'bold'
				}
			},
			subtitle: {
				style: {
					color: 'black'
				}
			},
			legend: {
				itemStyle: {
					fontWeight: 'bold',
					fontSize: '14px'
				}
			},
			xAxis: {
				labels: {
					style: {
						color: '#6e6e70',
						fontSize: '16px'
					}
				},
				title: {
					style: {
						fontSize: '14px'
					}
				}
			},
			yAxis: {
				labels: {
					style: {
						color: '#6e6e70',
						fontSize: '16px'
					}
				},
				title: {
					style: {
						fontSize: '14px'
					}
				}
			},
			plotOptions: {
				series: {
					shadow: true
				},
				candlestick: {
					lineColor: '#404048'
				},
				pie : {
					headerFormat:'',
					dataLabels: {
						enabled: true,
						formatter: function() {
							var cat = this.series.chart.xAxis[0].categories,
							x = this.point.x;
							return 'name: ' + cat[x] + '<br>' +  Math.round(this.percentage*100)/100 + ' %';
						}
					},
					events: {
						click: function(event) {
							var name = event.point.category;
							console.log(name)
							var xhttp = new XMLHttpRequest();
							xhttp.onreadystatechange = function() {
								if (this.readyState == 4 && this.status == 200) {
									document.getElementById('dispmsg').innerHTML = '';
									var historyMessages = JSON.parse(this.responseText);
									for(var i = 0;i < historyMessages.length - 1;i++) {
										var newele = document.createElement('div');
										var newTimeElement = document.createElement('div');
										var time = historyMessages[i].time.split(' ');
										var hrsAndMins = time[1].split(':');
										newele.setAttribute('id',time);
										newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
										if(historyMessages[i].type == 'text') {
											if(historyMessages[i].sender == name) {
												newele.setAttribute('class', 'cus-textmsg-remoteuser');
												newele.innerHTML = '<xmp class="text-user-id-xmp">' + historyMessages[i].message + '</xmp>';
												newTimeElement.setAttribute('class','time-remoteuser');					
											} else {
												newele.setAttribute('class', 'cus-textmsg-user');
												newele.innerHTML = '<xmp class="text-user-id-xmp">' + historyMessages[i].message + '</xmp>';
												newTimeElement.setAttribute('class','time-user');
											}
											document.getElementById('dispmsg').appendChild(newele);
											document.getElementById(time).appendChild(newTimeElement);	
										} else if(historyMessages[i].type == 'file'){
											var desc = document.createElement("div");
											var img = new Image();
											img.src = historyMessages[i].message;
											img.width = 280;
											img.height = 170;
											img.setAttribute('id',historyMessages[i].id);
											if(historyMessages[i].sender == name) {
												newele.setAttribute('class', 'cus-img-remoteuser');
												newTimeElement.setAttribute('class','time-remoteuser');
												if(historyMessages[i].desc != '') {
													desc.setAttribute('class','desc-img-remoteuser');
													desc.innerHTML = historyMessages[i].desc;
												}
											} else {
												newele.setAttribute('class', 'cus-img-user');
												newTimeElement.setAttribute('class','time-user');	
												if(historyMessages[i].desc != '') {
													desc.setAttribute('class','desc-img-user');
													desc.innerHTML = historyMessages[i].desc;
												}										
											}
											document.getElementById('dispmsg').appendChild(newele);
											document.getElementById(time).appendChild(img);
											document.getElementById(time).appendChild(desc);
											document.getElementById(time).appendChild(newTimeElement);
										} else {
											var desc = document.createElement("div");
											newele.setAttribute('id',time);
											newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
											var video = document.createElement("VIDEO");
											video.src = historyMessages[i].message;
											video.setAttribute('id',historyMessages[i].id);
											video.width = 280;
											video.height = 170;
											video.setAttribute('controls','controls');
											if(historyMessages[i].sender == name) {
												newele.setAttribute('class', 'cus-img-remoteuser');
												newTimeElement.setAttribute('class','time-remoteuser');
												if(historyMessages[i].desc != '') {
													desc.setAttribute('class','desc-img-remoteuser');
													desc.innerHTML = historyMessages[i].desc;
												}
											} else {
												newele.setAttribute('class', 'cus-img-user');
												newTimeElement.setAttribute('class','time-user');	
												if(historyMessages[i].desc != '') {
													desc.setAttribute('class','desc-img-user');
													desc.innerHTML = historyMessages[i].desc;
												}
											}
											document.getElementById('dispmsg').appendChild(newele);
											document.getElementById(time).appendChild(video);
											document.getElementById(time).appendChild(desc);
											document.getElementById(time).appendChild(newTimeElement);							
										}
									}
									var objDiv = document.getElementById("dispmsg");
									objDiv.scrollTop = objDiv.scrollHeight;
								}
							};
							xhttp.open("POST", "chathistoryembertwo", true);
							xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
							xhttp.send("personFirst=" + localStorage.getItem('name') + "&personSecond=" + name + "&limit=100");
						}
					}
				},
				column: {
					events: {
						click: function(event) {
							var name = event.point.category;
							console.log(name)
							var xhttp = new XMLHttpRequest();
							xhttp.onreadystatechange = function() {
								if (this.readyState == 4 && this.status == 200) {
									document.getElementById('dispmsg').innerHTML = '';
									var historyMessages = JSON.parse(this.responseText);
									for(var i = 0;i < historyMessages.length - 1;i++) {
										var newele = document.createElement('div');
										var newTimeElement = document.createElement('div');
										var time = historyMessages[i].time.split(' ');
										var hrsAndMins = time[1].split(':');
										newele.setAttribute('id',time);
										newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
										if(historyMessages[i].type == 'text') {
											if(historyMessages[i].sender == name) {
												newele.setAttribute('class', 'cus-textmsg-remoteuser');
												newele.innerHTML = '<xmp class="text-user-id-xmp">' + historyMessages[i].message + '</xmp>';
												newTimeElement.setAttribute('class','time-remoteuser');					
											} else {
												newele.setAttribute('class', 'cus-textmsg-user');
												newele.innerHTML = '<xmp class="text-user-id-xmp">' + historyMessages[i].message + '</xmp>';
												newTimeElement.setAttribute('class','time-user');
											}
											document.getElementById('dispmsg').appendChild(newele);
											document.getElementById(time).appendChild(newTimeElement);	
										} else if(historyMessages[i].type == 'file'){
											var desc = document.createElement("div");
											var img = new Image();
											img.src = historyMessages[i].message;
											img.width = 280;
											img.height = 170;
											img.setAttribute('id',historyMessages[i].id);
											if(historyMessages[i].sender == name) {
												newele.setAttribute('class', 'cus-img-remoteuser');
												newTimeElement.setAttribute('class','time-remoteuser');
												if(historyMessages[i].desc != '') {
													desc.setAttribute('class','desc-img-remoteuser');
													desc.innerHTML = historyMessages[i].desc;
												}
											} else {
												newele.setAttribute('class', 'cus-img-user');
												newTimeElement.setAttribute('class','time-user');	
												if(historyMessages[i].desc != '') {
													desc.setAttribute('class','desc-img-user');
													desc.innerHTML = historyMessages[i].desc;
												}										
											}
											document.getElementById('dispmsg').appendChild(newele);
											document.getElementById(time).appendChild(img);
											document.getElementById(time).appendChild(desc);
											document.getElementById(time).appendChild(newTimeElement);
										} else {
											var desc = document.createElement("div");
											newele.setAttribute('id',time);
											newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
											var video = document.createElement("VIDEO");
											video.src = historyMessages[i].message;
											video.setAttribute('id',historyMessages[i].id);
											video.width = 280;
											video.height = 170;
											video.setAttribute('controls','controls');
											if(historyMessages[i].sender == name) {
												newele.setAttribute('class', 'cus-img-remoteuser');
												newTimeElement.setAttribute('class','time-remoteuser');
												if(historyMessages[i].desc != '') {
													desc.setAttribute('class','desc-img-remoteuser');
													desc.innerHTML = historyMessages[i].desc;
												}
											} else {
												newele.setAttribute('class', 'cus-img-user');
												newTimeElement.setAttribute('class','time-user');	
												if(historyMessages[i].desc != '') {
													desc.setAttribute('class','desc-img-user');
													desc.innerHTML = historyMessages[i].desc;
												}
											}
											document.getElementById('dispmsg').appendChild(newele);
											document.getElementById(time).appendChild(video);
											document.getElementById(time).appendChild(desc);
											document.getElementById(time).appendChild(newTimeElement);							
										}
									}
									var objDiv = document.getElementById("dispmsg");
									objDiv.scrollTop = objDiv.scrollHeight;
								}
							};
							xhttp.open("POST", "chathistoryembertwo", true);
							xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
							xhttp.send("personFirst=" + localStorage.getItem('name') + "&personSecond=" + name + "&limit=100");
						}
					}
				},
				area: {
					events: {
						click: function(event) {
							var name = event.point.category;
							console.log(name)
							var xhttp = new XMLHttpRequest();
							xhttp.onreadystatechange = function() {
								if (this.readyState == 4 && this.status == 200) {
									document.getElementById('dispmsg').innerHTML = '';
									var historyMessages = JSON.parse(this.responseText);
									for(var i = 0;i < historyMessages.length - 1;i++) {
										var newele = document.createElement('div');
										var newTimeElement = document.createElement('div');
										var time = historyMessages[i].time.split(' ');
										var hrsAndMins = time[1].split(':');
										newele.setAttribute('id',time);
										newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
										if(historyMessages[i].type == 'text') {
											if(historyMessages[i].sender == name) {
												newele.setAttribute('class', 'cus-textmsg-remoteuser');
												newele.innerHTML = '<xmp class="text-user-id-xmp">' + historyMessages[i].message + '</xmp>';
												newTimeElement.setAttribute('class','time-remoteuser');					
											} else {
												newele.setAttribute('class', 'cus-textmsg-user');
												newele.innerHTML = '<xmp class="text-user-id-xmp">' + historyMessages[i].message + '</xmp>';
												newTimeElement.setAttribute('class','time-user');
											}
											document.getElementById('dispmsg').appendChild(newele);
											document.getElementById(time).appendChild(newTimeElement);	
										} else if(historyMessages[i].type == 'file'){
											var desc = document.createElement("div");
											var img = new Image();
											img.src = historyMessages[i].message;
											img.width = 280;
											img.height = 170;
											img.setAttribute('id',historyMessages[i].id);
											if(historyMessages[i].sender == name) {
												newele.setAttribute('class', 'cus-img-remoteuser');
												newTimeElement.setAttribute('class','time-remoteuser');
												if(historyMessages[i].desc != '') {
													desc.setAttribute('class','desc-img-remoteuser');
													desc.innerHTML = historyMessages[i].desc;
												}
											} else {
												newele.setAttribute('class', 'cus-img-user');
												newTimeElement.setAttribute('class','time-user');	
												if(historyMessages[i].desc != '') {
													desc.setAttribute('class','desc-img-user');
													desc.innerHTML = historyMessages[i].desc;
												}										
											}
											document.getElementById('dispmsg').appendChild(newele);
											document.getElementById(time).appendChild(img);
											document.getElementById(time).appendChild(desc);
											document.getElementById(time).appendChild(newTimeElement);
										} else {
											var desc = document.createElement("div");
											newele.setAttribute('id',time);
											newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
											var video = document.createElement("VIDEO");
											video.src = historyMessages[i].message;
											video.setAttribute('id',historyMessages[i].id);
											video.width = 280;
											video.height = 170;
											video.setAttribute('controls','controls');
											if(historyMessages[i].sender == name) {
												newele.setAttribute('class', 'cus-img-remoteuser');
												newTimeElement.setAttribute('class','time-remoteuser');
												if(historyMessages[i].desc != '') {
													desc.setAttribute('class','desc-img-remoteuser');
													desc.innerHTML = historyMessages[i].desc;
												}
											} else {
												newele.setAttribute('class', 'cus-img-user');
												newTimeElement.setAttribute('class','time-user');	
												if(historyMessages[i].desc != '') {
													desc.setAttribute('class','desc-img-user');
													desc.innerHTML = historyMessages[i].desc;
												}
											}
											document.getElementById('dispmsg').appendChild(newele);
											document.getElementById(time).appendChild(video);
											document.getElementById(time).appendChild(desc);
											document.getElementById(time).appendChild(newTimeElement);							
										}
									}
									var objDiv = document.getElementById("dispmsg");
									objDiv.scrollTop = objDiv.scrollHeight;
								}
							};
							xhttp.open("POST", "chathistoryembertwo", true);
							xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
							xhttp.send("personFirst=" + localStorage.getItem('name') + "&personSecond=" + name + "&limit=100");
						}
					}
				},
				line: {
					events: {
						click: function(event) {
							var name = event.point.category;
							console.log(name)
							var xhttp = new XMLHttpRequest();
							xhttp.onreadystatechange = function() {
								if (this.readyState == 4 && this.status == 200) {
									document.getElementById('dispmsg').innerHTML = '';
									var historyMessages = JSON.parse(this.responseText);
									for(var i = 0;i < historyMessages.length - 1;i++) {
										var newele = document.createElement('div');
										var newTimeElement = document.createElement('div');
										var time = historyMessages[i].time.split(' ');
										var hrsAndMins = time[1].split(':');
										newele.setAttribute('id',time);
										newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
										if(historyMessages[i].type == 'text') {
											if(historyMessages[i].sender == name) {
												newele.setAttribute('class', 'cus-textmsg-remoteuser');
												newele.innerHTML = '<xmp class="text-user-id-xmp">' + historyMessages[i].message + '</xmp>';
												newTimeElement.setAttribute('class','time-remoteuser');					
											} else {
												newele.setAttribute('class', 'cus-textmsg-user');
												newele.innerHTML = '<xmp class="text-user-id-xmp">' + historyMessages[i].message + '</xmp>';
												newTimeElement.setAttribute('class','time-user');
											}
											document.getElementById('dispmsg').appendChild(newele);
											document.getElementById(time).appendChild(newTimeElement);	
										} else if(historyMessages[i].type == 'file'){
											var desc = document.createElement("div");
											var img = new Image();
											img.src = historyMessages[i].message;
											img.width = 280;
											img.height = 170;
											img.setAttribute('id',historyMessages[i].id);
											if(historyMessages[i].sender == name) {
												newele.setAttribute('class', 'cus-img-remoteuser');
												newTimeElement.setAttribute('class','time-remoteuser');
												if(historyMessages[i].desc != '') {
													desc.setAttribute('class','desc-img-remoteuser');
													desc.innerHTML = historyMessages[i].desc;
												}
											} else {
												newele.setAttribute('class', 'cus-img-user');
												newTimeElement.setAttribute('class','time-user');	
												if(historyMessages[i].desc != '') {
													desc.setAttribute('class','desc-img-user');
													desc.innerHTML = historyMessages[i].desc;
												}										
											}
											document.getElementById('dispmsg').appendChild(newele);
											document.getElementById(time).appendChild(img);
											document.getElementById(time).appendChild(desc);
											document.getElementById(time).appendChild(newTimeElement);
										} else {
											var desc = document.createElement("div");
											newele.setAttribute('id',time);
											newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
											var video = document.createElement("VIDEO");
											video.src = historyMessages[i].message;
											video.setAttribute('id',historyMessages[i].id);
											video.width = 280;
											video.height = 170;
											video.setAttribute('controls','controls');
											if(historyMessages[i].sender == name) {
												newele.setAttribute('class', 'cus-img-remoteuser');
												newTimeElement.setAttribute('class','time-remoteuser');
												if(historyMessages[i].desc != '') {
													desc.setAttribute('class','desc-img-remoteuser');
													desc.innerHTML = historyMessages[i].desc;
												}
											} else {
												newele.setAttribute('class', 'cus-img-user');
												newTimeElement.setAttribute('class','time-user');	
												if(historyMessages[i].desc != '') {
													desc.setAttribute('class','desc-img-user');
													desc.innerHTML = historyMessages[i].desc;
												}
											}
											document.getElementById('dispmsg').appendChild(newele);
											document.getElementById(time).appendChild(video);
											document.getElementById(time).appendChild(desc);
											document.getElementById(time).appendChild(newTimeElement);							
										}
									}
									var objDiv = document.getElementById("dispmsg");
									objDiv.scrollTop = objDiv.scrollHeight;
								}
							};
							xhttp.open("POST", "chathistoryembertwo", true);
							xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
							xhttp.send("personFirst=" + localStorage.getItem('name') + "&personSecond=" + name + "&limit=100");
						}
					}
				},
				scatter: {
					tooltip: {
						headerFormat: '',
						pointFormatter:function() {
							return this.series.name + ' :  '+ this.y;
						}
					},
					events: {
						click: function(event) {
							var name = event.point.category;
							console.log(name)
							var xhttp = new XMLHttpRequest();
							xhttp.onreadystatechange = function() {
								if (this.readyState == 4 && this.status == 200) {
									document.getElementById('dispmsg').innerHTML = '';
									var historyMessages = JSON.parse(this.responseText);
									for(var i = 0;i < historyMessages.length - 1;i++) {
										var newele = document.createElement('div');
										var newTimeElement = document.createElement('div');
										var time = historyMessages[i].time.split(' ');
										var hrsAndMins = time[1].split(':');
										newele.setAttribute('id',time);
										newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
										if(historyMessages[i].type == 'text') {
											if(historyMessages[i].sender == name) {
												newele.setAttribute('class', 'cus-textmsg-remoteuser');
												newele.innerHTML = '<xmp class="text-user-id-xmp">' + historyMessages[i].message + '</xmp>';
												newTimeElement.setAttribute('class','time-remoteuser');					
											} else {
												newele.setAttribute('class', 'cus-textmsg-user');
												newele.innerHTML = '<xmp class="text-user-id-xmp">' + historyMessages[i].message + '</xmp>';
												newTimeElement.setAttribute('class','time-user');
											}
											document.getElementById('dispmsg').appendChild(newele);
											document.getElementById(time).appendChild(newTimeElement);	
										} else if(historyMessages[i].type == 'file'){
											var desc = document.createElement("div");
											var img = new Image();
											img.src = historyMessages[i].message;
											img.width = 280;
											img.height = 170;
											img.setAttribute('id',historyMessages[i].id);
											if(historyMessages[i].sender == name) {
												newele.setAttribute('class', 'cus-img-remoteuser');
												newTimeElement.setAttribute('class','time-remoteuser');
												if(historyMessages[i].desc != '') {
													desc.setAttribute('class','desc-img-remoteuser');
													desc.innerHTML = historyMessages[i].desc;
												}
											} else {
												newele.setAttribute('class', 'cus-img-user');
												newTimeElement.setAttribute('class','time-user');	
												if(historyMessages[i].desc != '') {
													desc.setAttribute('class','desc-img-user');
													desc.innerHTML = historyMessages[i].desc;
												}										
											}
											document.getElementById('dispmsg').appendChild(newele);
											document.getElementById(time).appendChild(img);
											document.getElementById(time).appendChild(desc);
											document.getElementById(time).appendChild(newTimeElement);
										} else {
											var desc = document.createElement("div");
											newele.setAttribute('id',time);
											newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
											var video = document.createElement("VIDEO");
											video.src = historyMessages[i].message;
											video.setAttribute('id',historyMessages[i].id);
											video.width = 280;
											video.height = 170;
											video.setAttribute('controls','controls');
											if(historyMessages[i].sender == name) {
												newele.setAttribute('class', 'cus-img-remoteuser');
												newTimeElement.setAttribute('class','time-remoteuser');
												if(historyMessages[i].desc != '') {
													desc.setAttribute('class','desc-img-remoteuser');
													desc.innerHTML = historyMessages[i].desc;
												}
											} else {
												newele.setAttribute('class', 'cus-img-user');
												newTimeElement.setAttribute('class','time-user');	
												if(historyMessages[i].desc != '') {
													desc.setAttribute('class','desc-img-user');
													desc.innerHTML = historyMessages[i].desc;
												}
											}
											document.getElementById('dispmsg').appendChild(newele);
											document.getElementById(time).appendChild(video);
											document.getElementById(time).appendChild(desc);
											document.getElementById(time).appendChild(newTimeElement);							
										}
									}
									var objDiv = document.getElementById("dispmsg");
									objDiv.scrollTop = objDiv.scrollHeight;
								}
							};
							xhttp.open("POST", "chathistoryembertwo", true);
							xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
							xhttp.send("personFirst=" + localStorage.getItem('name') + "&personSecond=" + name + "&limit=100");
						}
					}
				}
			},
			navigator: {
				xAxis: {
					gridLineColor: '#D0D0D8'
				}
			},
			rangeSelector: {
				buttonTheme: {
					fill: 'white',
					stroke: '#C0C0C8',
					'stroke-width': 1,
					states: {
						select: {
							fill: '#D0D0D8'
						}
					}
				},
				
			},
			scrollbar: {
				trackBorderColor: '#C0C0C8'
			},
			background2: '#E0E0E8',
			global: {
				timezoneOffset: new Date().getTimezoneOffset()
			}
		};
		Highcharts.setOptions(Highcharts.theme);
  }).on('didInsertElement'),
  
  contentDidChange: Em.observer('content.@each.isLoaded', function() {
    var chart;
    if (!(this.get('content') && this.get('chart'))) {
      return;
    }
    chart = this.get('chart');
	console.log(chart);
    return this.get('content').forEach(function(series, idx) {
      var _ref;
      if ((_ref = chart.get('noData')) != null) {
        _ref.remove();
      }
      if (chart.series[idx]) {
        return chart.series[idx].setData(series.data);
      } else {
        return chart.addSeries(series);
      }
    });
  }),
  
  actions: {
	changechart:function() {
		var s = this;
		var stdate = document.getElementById('startdate').value;
		var eddate = document.getElementById('enddate').value;
		console.log(stdate);
		console.log(eddate);
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var val = this.responseText;
				console.log(val);
				s.get('options').xAxis.categories = [];
				s.get('series').objectAt(0).data = [];					
				var n = val.split(',');
				console.log(n.length);
				for (var i = 0; i < n.length - 1; i++) {	
					console.log(i);
					s.get('options').xAxis.categories.pushObject(n[i]);
					i++;
					s.get('series').objectAt(0).data.pushObject(parseInt(n[i]));
				}
				 s.set('buildOptions.series',s.get('series'));
				console.log(s.get('buildOptions'));
				s.set('chart', s.$('#chartSpace').highcharts(s.get('buildOptions')).highcharts());
			} 
		};
		xhttp.open("POST", "chatmessagecountdateember", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send("username=" + localStorage.getItem('name') + "&startdate=" + stdate + "&enddate=" + eddate);
	},
	changeChartType: function(type) {		
		this.set('buildOptions.chart.type',type);
		this.set('chart', this.$('#chartSpace').highcharts(this.get('buildOptions')).highcharts());
	}
  },
  drawLater: function() {
    Ember.run.scheduleOnce('afterRender', this, 'draw');
  },
  
  draw: function() {
    var s = this;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			s.get('options').xAxis.categories.length = 0;
			s.get('series').objectAt(0).data.length = 0;
			var val = this.responseText;
			var n = val.split(',');	
			for (var i = 0; i < n.length - 1; i++) {	
				s.get('options').xAxis.categories.pushObject(n[i]);
				i++;
				s.get('series').objectAt(0).data.pushObject(parseInt(n[i]));
			}
			 console.log(s.get('buildOptions'));
			 s.set('buildOptions.series',s.get('series'));
			 //s.set('buildOptions.xAxis',s.get('options.xAxis.categories'));
			 console.log(s.get('buildOptions'));
			 s.set('chart', s.$('#chartSpace').highcharts(s.get('buildOptions')).highcharts());
		} 
	};
	xhttp.open("POST", "chatmessagecountember", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("username=" + localStorage.getItem('name'));
  },
  
  _destroyChart: (function() {
    this._super();
    this.get('chart').destroy();
  }).on('willDestroyElement')
});
