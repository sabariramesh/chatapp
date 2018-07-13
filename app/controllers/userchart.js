import Controller from '@ember/controller';
import {computed,observer} from '@ember/object';

export default Controller.extend({
	/*names: '',
	chartOptions: {
		chart: {
			type: 'bar'
		},
		title: {
			text: 'Message Counts'
		},
		xAxis: {
			title: {
				text: 'Users'
			},
			categories: []
		},
		yAxis: {
			title: {
				text: ''
			}
		}
	},
 
	chartData: [{
		name: 'Counts',
		data: []
	}],
/*	datas: computed('chartData.[0].data.[]', function(){
		return this.get('chartData');
	}),
	obser: observer('chartData.[0].data.[]', function(){
		console.log(this.get('datas'));
	}),
	
	actions: {
		loadUsers:function(names) {
			
			var s = this;
			//this.get('chartData').objectAt(0).set('name',names);
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					s.get('chartOptions').xAxis.categories.length = 0;
					s.get('chartData').objectAt(0).data.length = 0;
					var val = this.responseText;
					var n = val.split(',');
					console.log(n.length);
					for (var i = 0; i < n.length - 1; i++) {	
						console.log(i);
						s.get('chartOptions').xAxis.categories.pushObject(n[i]);
						i++;
						s.get('chartData').objectAt(0).data.pushObject(parseInt(n[i]));
					}
				} 
			};
			xhttp.open("POST", "chatmessagecountember", true);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send("username=" + names);
		},
		loadData: function() {
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
					s.get('chartOptions').xAxis.categories = [];
					s.get('chartData').objectAt(0).data = [];					
					var n = val.split(',');
					console.log(n.length);
					for (var i = 0; i < n.length - 1; i++) {	
						console.log(i);
						s.get('chartOptions').xAxis.categories.pushObject(n[i]);
						i++;
						s.get('chartData').objectAt(0).data.pushObject(parseInt(n[i]));
					}
				} 
			};
			xhttp.open("POST", "chatmessagecountdateember", true);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send("username=" + this.get('names') + "&startdate=" + stdate + "&enddate=" + eddate);
		}		
	}*/
});
