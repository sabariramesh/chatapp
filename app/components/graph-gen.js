import Component from '@ember/component';
import $ from 'jquery';
import Ember from 'ember';

export default Component.extend({
	init:function(){
		this._super();
		this.get('notifications').setDefaultAutoClear(true);
		this.get('notifications').setDefaultClearDuration(1200);
    },
	filedata: [],
	notifications: Ember.inject.service('notification-messages'),
	datasets:[],
	yAxes:[],
	myChart:'',
	yAxesID:'',
	stacked:false,
	options:{
		type: 'bar',
		data: {
			labels: [],
			datasets: []
		},
		options: {
			title: {
				display:true,
				text: ''
			},
			scales: {
				yAxes: [],
				xAxes: [{stacked:false}]
			}
		}
	},
	actions: {
		loadUpload: function(event) {
			var file = event.target.files[0];
			var filereader = new FileReader();
			var s = this;
			filereader.onload = () => {
				var content = filereader.result;
				s.send('convertToJson',content);
				console.log(content);
				$('#baselabel').empty();
				document.getElementById('title').value = '';
				var header = Object.keys(s.get('filedata')[0]);
				for (var i = 0;i < header.length;i++) {
					s.$('<option value="'+ header[i] +'">' + header[i] + '</option>').appendTo('#baselabel');
				}
				document.getElementById('base').style.display = "block";
			}
			filereader.readAsText(file);
		},
		loadGroups: function() {
			var title = document.getElementById('title').value;
			this.set('options.options.title.text',title);
			var baseLabel = document.getElementById("baselabel");
			var baseLabelValue = baseLabel.options[baseLabel.selectedIndex].value;
			$('#group').empty();
			var t = this.get('filedata').objectAt(0);
			if(isNaN(t[baseLabelValue]) && title != '') {
				var header = Object.keys(this.get('filedata')[0]);
				for (var i = 0;i < header.length;i++) {
					if(header[i] != baseLabelValue) {
						$('<option value="'+ header[i] +'">' + header[i] + '</option>').appendTo('#group');
					}
				}
				
				for(var i = 0;i < this.get('filedata').length;i++) {
					var t = this.get('filedata')[i];
					this.get('options').data.labels.push(t[baseLabelValue]);
				}
				if(document.getElementById('stacked').checked) {
					this.set('stacked',true);
					this.get('options').options.scales.xAxes.objectAt(0).stacked = true;
					this.set('yAxesID','1');
				}
				document.getElementById('groups').style.display = "block";
			} else {
				alert("Invalid Details...");
			}	
		},
		
		addgroups:function() {
			var group = document.getElementById("group");
			var groupName = group.options[group.selectedIndex].value;
			var temp = JSON.parse('{"label":"","yAxisID":"","data":[],"backgroundColor":""}');
			temp.label = groupName;
			$("#group option[value= " +groupName + "]").remove();
			temp.backgroundColor = document.getElementById('myColor').value;
			if(this.get('stacked') == true) {
				temp.yAxisID = this.get('yAxesID');
			} else {
				temp.yAxisID = groupName;
			}	
			for(var i = 0;i < this.get('filedata').length;i++) {
				var t = this.get('filedata')[i];
				temp.data.push(t[groupName]);
			}
			this.get('datasets').push(temp);
			var tempy = JSON.parse('{"stacked":false,"id":"","position":""}');
			if(this.get('stacked') == true) {
				tempy.stacked = true;
				tempy.id = this.get('yAxesID');
			} else {
				tempy.stacked = false;
				tempy.id = groupName;
			}
			if(this.get('yAxes').length == 0) {
				tempy.position = 'left';
			} else if (this.get('stacked') == true) {
				tempy.position = 'left';
			} else {
				tempy.position = 'right';
			}
			this.get('notifications').info(groupName + ' has been added',{
					autoClear: true
				});
			this.get('yAxes').push(tempy);
			console.log(this.get('yAxes'));
			console.log(this.get('datasets'));
			document.getElementById('create').style.display = 'block';
		},
		
		convertToJson: function(data) {
			if(this.get('filedata').length > 0) {
				this.get('filedata').removeAt(0,this.get('filedata').length);
				console.log(11);
				console.log(this.get('filedata'));
			}
			var record = data.split('\n');
			var header = record[0].split(',');
			console.log(record);
			console.log(header);
			for(var i = 1;i < record.length - 1;i++) {
				var temp = '{';
				var field = record[i].split(',');
				for(var j = 0;j < field.length;j++) {
					var value;
					field[j] = field[j].trim();
					header[j] = header[j].trim();
					if(isNaN(field[j])) {
						value = '"' + field[j] + '",'; 
					} else {
						value = field[j] + ',';
					}
					temp = temp.concat('"' + header[j] + '":' + value);
				}
				temp = temp.substring(0,temp.length - 1);
				temp = temp.concat('}');
				this.get('filedata').push(JSON.parse(temp));
			}
			console.log(this.get('filedata'));
		},
		generateGraph: function() {
			for(var i = 0;i < this.get('datasets').length;i++) {
				this.get('options.data.datasets').push(this.get('datasets')[i]);
				this.get('options.options.scales.yAxes').push(this.get('yAxes')[i]);
			}
			var ctx = document.getElementById("myChart").getContext('2d');
			if(this.get('myChart')) {
				this.get('myChart').destroy();
			}
			console.log(this.get('options'));
			var temp = $.extend(true,{},this.get('options'));
			this.set('myChart',new Chart(ctx, temp));		
			
			document.getElementById('update').style.display = "block";
			document.getElementById('create').style.display = "none";
		},
		loadUpdate: function() {
			if(this.get('options.data.labels').length > 0) {
				this.get('options.data.labels').removeAt(0,this.get('options.data.labels').length);
			}
			if(this.get('options.data.datasets').length > 0) {
				this.get('options.data.datasets').removeAt(0,this.get('options.data.datasets').length);
				this.get('options.options.scales.yAxes').removeAt(0,this.get('options.options.scales.yAxes').length);
			}
			if(this.get('datasets').length > 0) {
				this.get('datasets').removeAt(0,this.get('datasets').length);
			}
			if(this.get('yAxes').length > 0) {
				this.get('yAxes').removeAt(0,this.get('yAxes').length);
			}
			this.get('options.options.scales.xAxes').objectAt(0).stacked = false;
			this.set('stacked',false);
			this.set('yAxesID','');
			document.getElementById('create').style.display = 'none';
			document.getElementById('update').style.display = "none";
			document.getElementById('base').style.display = "block";
			document.getElementById('groups').style.display = "none";
			document.getElementById('baselabel').innerHTML = '';
			var header = Object.keys(this.get('filedata')[0]);
			for (var i = 0;i < header.length;i++) {
				$('<option value="'+ header[i] +'">' + header[i] + '</option>').appendTo('#baselabel');
			}
		}
	}
	
});
