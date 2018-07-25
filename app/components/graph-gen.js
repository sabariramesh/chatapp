import Component from '@ember/component';
import $ from 'jquery';
import Ember from 'ember';

export default Component.extend({
	init:function(){
		this._super();
		this.get('notifications').setDefaultAutoClear(true);
		this.get('notifications').setDefaultClearDuration(1200);
    },
	test:0,
	Labels:[],
	randomcolor:'',
	randomcolora:'',
	Groups:[],
	Values:[],
	filedata: [],
	datedata:[['/',0,1,2],['/',2,0,1],['/',2,1,0],['-',0,1,2],['-',2,0,1],['-',2,1,0],['.',0,1,2],['.',2,0,1],['.',2,1,0]],
	notifications: Ember.inject.service('notification-messages'),	
	actions: {
		loadUpload: function(event) {
			var file = event.target.files[0];
			var filereader = new FileReader();
			var s = this;
			filereader.onload = () => {
				var content = filereader.result;
				s.send('convertToJson',content);				
				if(this.get('test') == 1) {
					s.send('loadContent');
				}
			}
			filereader.readAsText(file);		
		},
		loadContent:function() {
			if(this.get('Groups').length > 0) {
					this.get('Groups').removeAt(0,this.get('Groups').length);
				}
				if(this.get('Labels').length > 0) {
					this.get('Labels').removeAt(0,this.get('Labels').length);
				}
				if(this.get('Values').length > 0) {
					this.get('Values').removeAt(0,this.get('Values').length);
				} 
				$('#Labels').empty();
				$('#Groups').empty();
				$('#Values').empty();
				$('<option selected value="select">select</option>').appendTo('#Labels');
				$('<option selected value="select">select</option>').appendTo('#Groups');
				$('<option selected value="select">select</option>').appendTo('#Values');
				var header = Object.keys(this.get('filedata')[0]);
				for (var i = 0;i < header.length;i++) {
					$('<option value="'+ header[i] +'">' + header[i] + '</option>').appendTo('#Labels');
					$('<option value="'+ header[i] +'">' + header[i] + '</option>').appendTo('#Groups');
					$('<option value="'+ header[i] +'">' + header[i] + '</option>').appendTo('#Values');
				}	
				$('<option value="c">Count</option>').appendTo('#Values');
				document.getElementById('base').style.display = "block";
				document.getElementById('show').style.display = "block";
		},
		add: function(idName) {
			var label = document.getElementById(idName);
			var baseLabelValue = label.options[label.selectedIndex].value;
			if(baseLabelValue != 'select') {	
				this.get('notifications').success(baseLabelValue + ' has been added',{
					autoClear: true
				});
				this.get(idName).pushObject(baseLabelValue);
				$("#Labels option[value= " +baseLabelValue + "]").remove();
				$("#Groups option[value= " +baseLabelValue + "]").remove();
				$("#Values option[value= " +baseLabelValue + "]").remove();
			}
		},
		
		remove:function(labelName,idName) {
			this.get(idName).removeObject(labelName);
			this.get('notifications').error(labelName + ' has been removed',{
					autoClear: true
				});
			$('<option value="'+ labelName +'">' + labelName + '</option>').appendTo('#Groups');
			$('<option value="'+ labelName +'">' + labelName + '</option>').appendTo('#Labels');
			$('<option value="'+ labelName +'">' + labelName + '</option>').appendTo('#Values');
		},
		validatePoints:function() {
			var chartType = document.getElementById('chartype');
			var chartTypeValue = chartType.options[chartType.selectedIndex].value;
			if(chartTypeValue == 'Pie') {
				this.send('pie');
			} else if(chartTypeValue == 'date1') {
				this.send('date','area');
			} else if(chartTypeValue == 'date2'){
				this.send('date','line');
			}else {
				this.send('generateGraph',chartTypeValue);
			}
		},
		generateGraph:function(charttype) {
			var opt ={chart: {type: ''},title:{text: ''},xAxis: {categories: [],title:{text:''}},yAxis: {title: {text: ''}},series: [],plotOptions:{}};
			if(charttype == 'stacked') {
				opt.plotOptions = {column:{stacking:'normal'},dataLabels:{enabled:true}};
				opt.chart.type = 'column';
			} else {
				opt.chart.type = charttype;
			}
			opt.title.text = document.getElementById('title').value;
			var check = document.getElementById('avg').checked;
			var valueitems = [];
			var labelitems = [];
			var labelName = this.get('Labels')[0];
			var value = this.get('Values')[0];
			opt.xAxis.text = labelName;
			opt.yAxis.title.text = value;
			if(this.get('Labels').length == 1 && this.get('Groups').length == 0 && this.get('Values').length == 1 && this.get('Values')[0] != 'c') {					
				var avgcount = [];				
				for(var i = 0;i < this.get('filedata').length;i++) {
					var temp = this.get('filedata')[i];
					var index = labelitems.indexOf(temp[labelName]);
					if(index == -1) {
						labelitems.push(temp[labelName]);
						valueitems.push(parseInt(temp[value]));
						avgcount.push(1);
						
					} else {
						valueitems[index] += parseInt(temp[value]);
						avgcount[index] += 1;
					}
				}
				var temp = {name:'',data:[]};
				temp.name = value;
				opt.yAxis.title.text = value;
				for(var i = 0;i < valueitems.length;i++) {
					opt.xAxis.categories.push(labelitems[i]);
					if(check == false) {
						temp.data.push(valueitems[i]);
					} else {
						temp.data.push(valueitems[i]/avgcount[i]);
					}
				}
				opt.series.push(temp);
				$('#chartspace').highcharts(opt).highcharts();
			} else if(this.get('Labels').length == 1 && this.get('Groups').length == 1 && this.get('Values').length == 1 && this.get('Values')[0] != 'c') {
				var groupBy = this.get('Groups')[0];
				var groupitems = []; 
				var fulldata = [];
				var mainset = [];
				var avgcount = [];
				for(var i = 0;i < this.get('filedata').length;i++) {
					var temp = this.get('filedata')[i];
					if(opt.xAxis.categories.indexOf(temp[labelName]) == -1) {
						opt.xAxis.categories.push(temp[labelName]);
						mainset.push(0);
					}
				}
				for(var i = 0;i < this.get('filedata').length;i++) {
					var temp = this.get('filedata')[i];
					if(groupitems.indexOf(temp[groupBy]) == -1) {
						groupitems.push(temp[groupBy]);
						fulldata.push(mainset.slice(0));
						avgcount.push(mainset.slice(0));
					}
				}
				for(var i = 0;i < groupitems.length;i++) {
					for(var j = 0;j < opt.xAxis.categories.length;j++) {
						for(var k = 0;k < this.get('filedata').length;k++) {
							var temp = this.get('filedata')[k];
							if(groupitems[i] == temp[groupBy] && opt.xAxis.categories[j] == temp[labelName]) {
								fulldata[i][j] += parseInt(temp[value]);
								avgcount[i][j] += 1;
							}
						}
					}
				}
				if(check == true) {
					for(var i = 0;i < groupitems.length;i++) {
						for(var j = 0;j < opt.xAxis.categories.length;j++) {
							fulldata[i][j] /= avgcount[i][j];
						}
					}
				}
				for(var i = 0;i < groupitems.length;i++) {
					var temp = {name:'',data:[]};
					temp.name = groupitems[i];
					temp.data = Object.values(fulldata[i]);
					opt.series.push(temp);
				}
				$('#chartspace').highcharts(opt).highcharts();
			} else if(this.get('Labels').length == 1 && this.get('Groups').length == 1 && this.get('Values').length == 1 && this.get('Values')[0] == 'c') {	
				var groupBy = this.get('Groups')[0];
				opt.yAxis.title.text = groupBy + ' Count';
				for(var i = 0;i < this.get('filedata').length;i++) {
					var temp = this.get('filedata')[i];
					var index = labelitems.indexOf(temp[labelName]);
					if(index == -1) {
						labelitems.push(temp[labelName]);
						opt.xAxis.categories.push(temp[labelName]);
						valueitems.push(1);
					} else {
						valueitems[index] += 1;
					}
				}
				opt.series.push({name:groupBy,data:valueitems});
				$('#chartspace').highcharts(opt).highcharts();
			}
		},
		
		pie:function() {
			if(this.get('Labels').length == 1 && this.get('Groups').length == 0 && this.get('Values').length == 1 && this.get('Values')[0] != 'c') {
				var opt = {chart: {type: 'pie'},title: {text: ''},plotOptions: {pie: { allowPointSelect: true,cursor: 'pointer', dataLabels: { enabled: true} }},series: [{name: '',colorByPoint: true,data: []}]};
				opt.title.text = document.getElementById('title').value;	
				var check = document.getElementById('avg').checked;				
				var labelName = this.get('Labels')[0];
				var labelitems = [];
				var valueitems = [];
				var avgcount = [];
				var value = this.get('Values')[0];
				opt.series[0].name = value;
				for(var i = 0;i < this.get('filedata').length;i++) {
					var temp = this.get('filedata')[i];
					var index = labelitems.indexOf(temp[labelName]);
					if(index == -1) {
						labelitems.push(temp[labelName]);
						valueitems.push(parseInt(temp[value]));
						avgcount.push(1);
					} else {
						valueitems[index] += parseInt(temp[value]);
						avgcount[index] += 1;
					}
				}
				for(var i = 0;i < labelitems.length;i++) {
					var temp = {name:'',y:0};
					temp.name = labelitems[i];
					if(check == false) {
						temp.y = parseInt(valueitems[i]);
					} else {
						temp.y = parseInt(valueitems[i]/avgcount[i]);
					}
					opt.series[0].data.push(temp);
				}
				
				$('#chartspace').highcharts(opt).highcharts();
			} else if(this.get('Labels').length == 1 && this.get('Groups').length == 1 && this.get('Values').length == 1 && this.get('Values')[0] != 'c') {
				var opt = {chart: {type: 'pie'},title: {text: ''},series: [{name: '',data: [],size: '60%',dataLabels: {formatter: function () {return this.point.name;},color: '#0122ff',distance: -50}}, {name: '',data: [],size: '80%',innerSize: '76%',dataLabels: {formatter: function () {return this.y > 1 ? '<b>' + this.point.name + ':</b> ' +this.y: null;}},id: ''}]};
				opt.title.text = document.getElementById('title').value;
				var labelName = this.get('Labels')[0];
				var groupBy = this.get('Groups')[0];  
				var value = this.get('Values')[0];    
				opt.series[0].name = groupBy;         
				opt.series[1].name = value;           
				opt.series[1].id = value;
				var sideset = [];
				var sidesettotalvalues = [];
				var mainset = [];
				var mainsetvalue = [];
				for(var i = 0;i < this.get('filedata').length;i++) {
					var temp = this.get('filedata')[i];
					var index = mainset.indexOf(temp[groupBy]);
					if(index == -1) {
						mainset.push(temp[groupBy]);
						mainsetvalue.push(parseInt(temp[value]));
						var sidesetvalues = [];
						var tempsideset = [];
						tempsideset.push(temp[labelName]);
						sideset.push(tempsideset);
						sidesetvalues.push(parseInt(temp[value]));
						sidesettotalvalues.push(sidesetvalues);
					} else {
						mainsetvalue[index] += parseInt(temp[value]);
						var sideindex = sideset[index].indexOf(temp[labelName]);
						if(sideindex == -1) {
							sideset[index].push(temp[labelName]);
							sidesettotalvalues[index].push(parseInt(temp[value]));
						} else {
							sidesettotalvalues[index][sideindex] += parseInt(temp[value]);
						}
					}					
				}
				for(var i = 0;i < mainset.length;i++) {
					var temp = {name:'',y:0,color:''};
					temp.name = mainset[i];
					temp.y = mainsetvalue[i];
					this.send('random_rgba');
					temp.color = this.get('randomcolor');
					for(var j = 0;j < sideset[i].length;j++) {
						var sidetemp = {name:'',y:0,color:''};
						sidetemp.name = sideset[i][j];
						sidetemp.y = sidesettotalvalues[i][j];
						sidetemp.color = this.get('randomcolora');
						opt.series[1].data.push(sidetemp);
					}
					this.set('randomcolor','');
					this.set('randomcolora','');
					opt.series[0].data.push(temp);
				}
				//console.log(opt);
				$('#chartspace').highcharts(opt).highcharts();
			}
		},
		
		date: function(type) {
			var formattype = document.getElementById('dateformat');
			var formattypeValue = formattype.options[formattype.selectedIndex].value;
			var opt = {chart:{zoomType: 'x'},title: {text: ''},xAxis: {type: 'datetime'},yAxis: {title: {text: ''}},legend: {enabled: false},plotOptions: {area: { marker: {radius: 1},lineWidth: 1,threshold: null,lineWidth: 0.5,states: {hover: {lineWidth: 0.5}},threshold: null,fillColor: {linearGradient: {x1: 0,y1: 0,x2: 0,y2: 1},stops: [[0, 'rgba(122,53,43,0.4)'],[1,'rgba(122,53,0,0)']]}},line: { marker: {radius: 1},lineWidth: 1,threshold: null,lineWidth: 0.5,states: {hover: {lineWidth: 0.5}},threshold: null}},series: [{ type: '',name: '',data: []}]};
			if(this.get('Labels').length == 1 && this.get('Values').length == 1 && this.get('Values')[0] != 'c' && formattypeValue != 'select') {
				try{
					var yearindex,monthindex,dateindex,hourindex,minindex,secindex,delimiter;
					var year,month,date,hours,mins,secs;
					formattypeValue = parseInt(formattypeValue);
					var tempd = this.get('datedata')[formattypeValue];
					yearindex = tempd[1];
					monthindex = tempd[2];
					dateindex = tempd[3];
					delimiter = tempd[0];
					var labelName = this.get('Labels')[0];
					var value = this.get('Values')[0];
					opt.title.text = document.getElementById('title').value;
					opt.yAxis.title.text = value;
					opt.series[0].type = type;
					opt.series[0].name = value;
					for(var i = 0;i < this.get('filedata').length;i++) {
						var temp = this.get('filedata')[i];
						var tempdate = temp[labelName];
						tempdate = tempdate.split(' ');
						if(tempdate.length == 2) {
							var tempdate1 = tempdate[0].split(delimiter);
							var temphrs = tempdate[1].split(':');
							year = parseInt(tempdate1[yearindex]);
							month = parseInt(tempdate1[monthindex]);
							month -= 1;
							date = parseInt(tempdate1[dateindex]);
							hours = parseInt(temphrs[0]);
							mins = parseInt(temphrs[1]);
							secs = parseInt(temphrs[2]);
						} else {
							tempdate = tempdate[0].split(delimiter);
							year = parseInt(tempdate[yearindex]);
							month = parseInt(tempdate[monthindex]);
							month -= 1;
							date = parseInt(tempdate[dateindex]);
							hours = 0;
							mins = 0;
							secs = 0;
						}
						var d = new Date(year,month,date,hours,mins,secs);
						var tempdata = [];
						if(d == 'Invalid Date') {
							throw 'Invalid Date';
						}
						tempdata.push(d.getTime() + (21600000 - 1800000));
						if(temp[value].indexOf('.') == -1) {
							tempdata.push(parseInt(temp[value]));
						} else {
							tempdata.push(parseFloat(temp[value]));
						}
						opt.series[0].data.push(tempdata);
					}
					console.log(opt);
					$('#chartspace').highcharts(opt).highcharts();
				} catch(err) {
					console.log(err);
					alert('Invalid date format!!!!');
				}
			}
		},
		
		loaddateformat:function() {
			var chartType = document.getElementById('chartype');
			var chartTypeValue = chartType.options[chartType.selectedIndex].value;
			if(chartTypeValue == 'date1' || chartTypeValue == 'date2') {
				document.getElementById('datecheck').style.display = 'block';
			} else {
				document.getElementById('datecheck').style.display = 'none';
			}
		},
		
		random_rgba() {
			var o = Math.round, r = Math.random, s = 255;
			var temp =  o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s);
			var rgb = 'rgb(' + temp + ')';
			var rgba = 'rgba(' + temp + ',0.5)';
			this.set('randomcolor',rgb);
			this.set('randomcolora',rgba);
		},
		convertToJson: function(data) {
			try{
				if(this.get('filedata').length > 0) {
					this.get('filedata').removeAt(0,this.get('filedata').length);
				}
				var record = data.split('\n');
				var header = record[0].split(',');
				for(var i = 1;i < record.length;i++) {
					var temp = '{';
					var field = record[i].split(',');
					for(var j = 0;j < field.length;j++) {
						var value;
						field[j] = field[j].trim();
						header[j] = header[j].trim();
						value = '"' + field[j] + '",'; 
						temp = temp.concat('"' + header[j] + '":' + value);
					}
					temp = temp.substring(0,temp.length - 1);
					temp = temp.concat('}');
					this.get('filedata').push(JSON.parse(temp));
				}
				this.set('test',1);
			} catch(err) {
				console.log(err);
				alert("Invalid CSV file");
				this.set('test',0);
			}	
		},
	}
});