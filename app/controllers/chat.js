import Controller from '@ember/controller';
import {inject} from '@ember/service';
import Ember from 'ember';
import $ from 'jquery';

export default Controller.extend({
	init: function() {
		this._super();
		this.set('socket',this.get('websockets').socketFor('ws://localhost:8080/chatroomserverember'));
		this.get('socket').on('open', this.myOpenHandler, this);
		this.get('socket').on('message', this.myMessageHandler, this);
		this.get('socket').on('close', function() {
		//localStorage.removeItem("name");
		this.get('socket').close();
		}, this);
		var names = localStorage.getItem("name");
		this.set('name',names);
		
		this.set('sock2',this.get('websockets').socketFor('ws://localhost:8080/imageEcho'));
		this.get('sock2').on('open',this.myopen,this);
		this.get('sock2').on('message',this.mymessg,this);
		this.get('sock2').on('close',function() {
			this.get('sock2').close();
		},this);
		
		this.set('sock3',this.get('websockets').socketFor('ws://localhost:8080/videoserverember'));
		this.get('sock3').on('open',this.myopenvideo,this);
		this.get('sock3').on('message',this.mymessgvideo,this);
		this.get('sock3').on('close',function() {
			this.get('sock3').close();
		},this);
		this.get('notifications').setDefaultAutoClear(true);
		this.get('notifications').setDefaultClearDuration(2200);
	},
	messages:[],
	notifications: Ember.inject.service('notification-messages'),
	active: [],
	inactive: [],
	searcher: [],
	actsearcher: [],
	socket: '',
	sock2: '',
	sock3: '',
	message: '',
	typers0: '',
	typers1: '',
	typers2: '',
	fname: '',
	name: '',
	total: [],
	curr: '',
	currno:-1,
	currname0: '',
	currname1: '',
	currname2: '',
	lastname: -1,
	check: [],
	groupList: [],
	router: inject(),
	limits0: 10,
	limits1: 10,
	limits2: 10,
	profile: '',
	dob0:'',
	place0:'',
	dob1:'',
	place1:'',
	dob2:'',
	place2:'',
	broadcastusers: [],
	selectBroadUsers: [],
	forwardusers: [],
	selectedforwardusers: [],
	source: '',
	temp: '',
	temps: [],
	myopen: function() {
		this.get('sock2').send(this.get('name'));
	},
	
	myopenvideo: function() {
		this.get('sock3').send(this.get('name'));
	},
	
	mymessgvideo:function(event) {
		var videoMessage = JSON.parse(event.data);
		var name = 'From ' + videoMessage.sender;
		if(document.visibilityState == 'hidden') {
			Notification.requestPermission(function (permission) {
				if (permission !== 'granted') return;
				var notification = new Notification('You have new message...', {
					body: name,
				});
				notification.onclick = function () {
					window.focus();
					notification.close();
				};
			});	
		}
		if(videoMessage.sender == this.get('currname0') || videoMessage.sender == this.get('currname1') || videoMessage.sender == this.get('currname2')) {
			var no;
				if(videoMessage.sender == this.get('currname0')) {
					no = "0";
				}else if (videoMessage.sender == this.get('currname1')) {
					no = "1";
				} else if (videoMessage.sender == this.get('currname2')) {
					no = "2";
				}
			var newele = document.createElement('div');
			var newTimeElement = document.createElement('div');
			var desc = document.createElement("div");
			var time = videoMessage.time.split(' ');
			var hrsAndMins = time[1].split(':');
			newele.setAttribute('id',time);
			newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
			var video = document.createElement("VIDEO");
			video.src = videoMessage.message;
			video.width = 200;
			video.height = 90;
			video.setAttribute('id',videoMessage.id);
			video.setAttribute('controls','controls');
			newele.setAttribute('class', 'cus-img-remoteuser');
			newTimeElement.setAttribute('class','time-remoteuser');
			if(videoMessage.desc != '') {
				desc.setAttribute('class','desc-img-remoteuser');
				desc.innerHTML = videoMessage.desc;
			}
			document.getElementById('text-box'+no).appendChild(newele);
			document.getElementById(time).appendChild(video);
			document.getElementById(time).appendChild(desc);
			document.getElementById(time).appendChild(newTimeElement);
			var objDiv = document.getElementById("text-box"+no);
			objDiv.scrollTop = objDiv.scrollHeight;
		} else if(videoMessage.sender == this.get('name')) {
			var newele = document.createElement('div');
			var newTimeElement = document.createElement('div');
			var desc = document.createElement("div");
			var time = videoMessage.time.split(' ');
			var hrsAndMins = time[1].split(':');
			newele.setAttribute('id',time);		
			newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
			var video = document.createElement("VIDEO");
			video.src = videoMessage.message;
			video.width = 200;
			video.height = 90;
			video.setAttribute('id',videoMessage.id);
			video.setAttribute('controls','controls');
			newele.setAttribute('class', 'cus-img-user');
			newTimeElement.setAttribute('class','time-user');
			if(videoMessage.desc != '') {
				desc.setAttribute('class','desc-img-user');
				desc.innerHTML = videoMessage.desc;
			}
			document.getElementById('text-box'+this.get('currno')).appendChild(newele);
			document.getElementById(time).appendChild(video);
			document.getElementById(time).appendChild(desc);
			document.getElementById(time).appendChild(newTimeElement);
			var objDiv = document.getElementById("text-box"+this.get('currno'));
			objDiv.scrollTop = objDiv.scrollHeight;
		} else {
			this.get('notifications').info('You have new message ' + name,{
					autoClear: true
				});
			this.send('loadMessageCount');	
		}
	},
	
	mymessg: function(event) {
		var imageMessage = JSON.parse(event.data);
		var name = 'From ' + imageMessage.sender;
		if(document.visibilityState == 'hidden') {
			Notification.requestPermission(function (permission) {
				if (permission !== 'granted') return;
				var notification = new Notification('You have new message...', {
					body: name,
				});
				notification.onclick = function () {
					window.focus();
					notification.close();
				};
			});		
		}
		if(imageMessage.sender == this.get('currname0') || imageMessage.sender == this.get('currname1') || imageMessage.sender == this.get('currname2')) {
			var no;
				if(imageMessage.sender == this.get('currname0')) {
					no = "0";
				}else if (imageMessage.sender == this.get('currname1')) {
					no = "1";
				} else if (imageMessage.sender == this.get('currname2')) {
					no = "2";
				}
			var newele = document.createElement('div'); 
			var newTimeElement = document.createElement('div');
			var desc = document.createElement("div");
			var time = imageMessage.time.split(' ');
			var hrsAndMins = time[1].split(':');
			newele.setAttribute('id',time);
			newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
			var img = new Image();
			img.src = imageMessage.message;
			img.width = 200;
			img.height = 90;
			img.setAttribute('id',imageMessage.id);
			newele.setAttribute('class', 'cus-img-remoteuser');
			newTimeElement.setAttribute('class','time-remoteuser');
			if(imageMessage.desc != '') {
				desc.setAttribute('class','desc-img-remoteuser');
				desc.innerHTML = imageMessage.desc;
			}
			document.getElementById('text-box'+no).appendChild(newele);
			document.getElementById(time).appendChild(img);
			document.getElementById(time).appendChild(desc);
			document.getElementById(time).appendChild(newTimeElement);
			var objDiv = document.getElementById("text-box"+no);
			objDiv.scrollTop = objDiv.scrollHeight;
		} else if(imageMessage.sender == this.get('name')) {
			var newele = document.createElement('div');
			var newTimeElement = document.createElement('div');
			var desc = document.createElement("div");
			var time = imageMessage.time.split(' ');
			var hrsAndMins = time[1].split(':');
			newele.setAttribute('id',time);
			newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
			var img = new Image();
			img.src = imageMessage.message;
			img.width = 200;
			img.height = 90;
			img.setAttribute('id',imageMessage.id);
			newele.setAttribute('class', 'cus-img-user');
			newTimeElement.setAttribute('class','time-user');
			if(imageMessage.desc != '') {
				desc.setAttribute('class','desc-img-user');
				desc.innerHTML = imageMessage.desc;
			}
			document.getElementById('text-box'+this.get('currno')).appendChild(newele);
			document.getElementById(time).appendChild(img);
			document.getElementById(time).appendChild(desc);
			document.getElementById(time).appendChild(newTimeElement);
			var objDiv = document.getElementById("text-box"+this.get("currno"));
			objDiv.scrollTop = objDiv.scrollHeight;
		} else {
			this.get('notifications').info('You have new message ' + name,{
					autoClear: true
				});
			this.send('loadMessageCount');	
		}
		
	},
	
	myOpenHandler: function() {
		this.get('socket').send(this.get('name'));
		var s = this;
			var xhttp1 = new XMLHttpRequest();
			xhttp1.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
			} 
		};
		xhttp1.open("POST", "setonlineember", true);
		xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp1.send("username=" + s.get('name'));
	},

	myMessageHandler: function(event) {
		if(event.data.indexOf("#") == 0) {
			var names = event.data.split("#");
			if(this.get('currname0') == names[1]) {
				this.set('typers0','Typing...');
			} else if(this.get('currname1') == names[1]) {
				this.set('typers1','Typing...');
			} else if(this.get('currname2') == names[1]) {
				this.set('typers2','Typing...');
			}
		} else if(event.data.indexOf("!") == 0) {
			var names1 = event.data.split("!");
			if(this.get('currname0') == names1[1]) {
				this.set('typers0','');
			} else if(this.get('currname1') == names1[1]) {
				this.set('typers1','');
			} else if(this.get('currname2') == names1[1]) {
				this.set('typers2','');
			}
		} else if(event.data.indexOf('@') == 0){
			var names = event.data.split('@');
			this.get('notifications').info(names[1] + ' is Online',{
				autoClear: true
			});
			this.send('loadUsers');
			this.send('loadMessageCount');
		} else if(event.data.indexOf('*') == 0) {
			var names = event.data.split('*');
			this.get('notifications').info(names[1] + ' is Offline',{
				autoClear: true
			});
			this.send('loadUsers');
			this.send('loadMessageCount');
		}else if(event.data.indexOf('%') == 0) {
			this.set('currname'+this.get('currno'),'');
			this.get('router').transitionTo('error');
		} else {
			var newMessage = JSON.parse(event.data);
			var name = 'From ' + newMessage.sender;
			if(document.visibilityState == 'hidden') {
				Notification.requestPermission(function (permission) {
					if (permission !== 'granted') return;
					var notification = new Notification('You have new message...', {
						icon:'images/chat.png',
						body: name,
					});
					notification.onclick = function () {
						window.focus();
						notification.close();
					};
				});
			}
			var newele = document.createElement('div');
			var newTimeElement = document.createElement('div');
			var time = newMessage.time.split(' ');
			var hrsAndMins = time[1].split(':');
			if(newMessage.sender == this.get('currname0') || newMessage.sender == this.get('currname1') || newMessage.sender == this.get('currname2')) {
				var no;
				if(newMessage.sender == this.get('currname0')) {
					no = "0";
				}else if (newMessage.sender == this.get('currname1')) {
					no = "1";
				} else if (newMessage.sender == this.get('currname2')) {
					no = "2";
				}
				newele.setAttribute('class', 'cus-textmsg-remoteuser');
				newele.setAttribute('id',time);
				newele.innerHTML = '<xmp class="text-user-id-xmp">' + newMessage.message + '</xmp>';
				newTimeElement.setAttribute('class','time-remoteuser');
				newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
				document.getElementById('text-box'+no).appendChild(newele);
				document.getElementById(time).appendChild(newTimeElement);
				var objDiv = document.getElementById("text-box"+no);
				objDiv.scrollTop = objDiv.scrollHeight;
			} else if(newMessage.sender == this.get('name')) {
				newele.setAttribute('class', 'cus-textmsg-user');
				newele.setAttribute('id',time);
				newele.innerHTML = '<xmp class="text-user-id-xmp">' + newMessage.message + '</xmp>';
				newTimeElement.setAttribute('class','time-user');
				newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
				document.getElementById('text-box'+this.get('currno')).appendChild(newele);
				document.getElementById(time).appendChild(newTimeElement);
				var objDiv = document.getElementById("text-box"+this.get('currno'));
				objDiv.scrollTop = objDiv.scrollHeight;
			} else {	
				this.get('notifications').info('You have new message ' + name,{
					autoClear: true
				});
				this.send('loadMessageCount');
			}
		}
	},
	actions: {
		setcurrent: function(no) {
			if(this.get('currno') != -1) {
				document.getElementById("pre"+this.get('currno')).style.display = "none";
				document.getElementById("prevideo"+this.get('currno')).style.display = "none";
				document.getElementById("send"+this.get('currno')).style.display = "block";	
			}
			this.set('curr',this.get('currname'+no));
			this.set('currno',no);
		},
		typing : function(no) {
			//var socket = this.get('websockets').socketFor('ws://localhost:8080/chatroomserverember');
			this.send('setcurrent',no);
			this.get('socket').send(this.get('curr') + ":" + "typing" + ":" + "0");
		},
		stoptyping : function() {
			//var socket = this.get('websockets').socketFor('ws://localhost:8080/chatroomserverember');
			this.get('socket').send(this.get('curr') + ":" + "not" + ":" + "0");
		},
		enter: function(event) {
			if(event.keyCode === 13) {
				//var socket = this.get('websockets').socketFor('ws://localhost:8080/chatroomserverember');
				var msg = document.getElementById('msg'+this.get('currno')).value;
				if(msg != '') {
					document.getElementById('msg'+this.get('currno')).value = '';
					this.get('socket').send(this.get('curr')+ ":" + msg + ":" + "0");
				}
			}
		},

		loadUpload: function(event) {
			const reader = new FileReader();
			const file = event.target.files[0];
			reader.onload = () => {
				//console.log(reader.result);
				document.getElementById("pre"+this.get('currno')).style.display = "block";
				document.getElementById("send"+this.get('currno')).style.display = "none";
				document.getElementById("preview"+this.get('currno')).src = reader.result;
			};
			if (file) {
				reader.readAsDataURL(file);
			}
		},
		uploadImage: function() {
			var desc = document.getElementById("preview-input"+this.get('currno')).value;
			var img = document.getElementById("preview"+this.get('currno'));
			console.log(this.get('curr'));
			if(desc == '') {
				this.get('sock2').send('data:' + this.get('curr') + ':' + 'desc:' + ':' + ((img.src).toString()));
			} else {
				this.get('sock2').send('data:' + this.get('curr') + ':' + 'desc:' + desc + ':' + ((img.src).toString()));
				document.getElementById("preview-input"+this.get('currno')).value = '';
			}
			document.getElementById("pre"+this.get('currno')).style.display = "none";
			document.getElementById("send"+this.get('currno')).style.display = "block";
		},
		loadUploadVideo: function(event) {
			const reader = new FileReader();
			const file = event.target.files[0];
			reader.onload = () => {
				//console.log(reader.result);
				document.getElementById("prevideo"+this.get('currno')).style.display = "block";
				document.getElementById("send"+this.get('currno')).style.display = "none";
				document.getElementById("preview-video"+this.get('currno')).src = reader.result;
			};
			if (file) {
				reader.readAsDataURL(file);
			}
		},
		
		uploadVideo:function() {
			var desc = document.getElementById("preview-input-video"+this.get('currno')).value;
			var video = document.getElementById("preview-video"+this.get('currno'));
			console.log(this.get('curr'));
			if(desc == '') {
				this.get('sock3').send('data:' + this.get('curr') + ':' + 'desc:' + ':' + ((video.src).toString()));
			} else {
				this.get('sock3').send('data:' + this.get('curr') + ':' + 'desc:' + desc + ':' + ((video.src).toString()));
				document.getElementById("preview-input-video").value = '';
			}
			document.getElementById("prevideo"+this.get('currno')).style.display = "none";
			document.getElementById("send"+this.get('currno')).style.display = "block";	
		},
		
		loadBroadImage:function(event) {
			const reader = new FileReader();
			const file = event.target.files[0];
			reader.onload = () => {
				//console.log(reader.result);
				document.getElementById("pre-broad").style.display = "block";
				document.getElementById("broadsend").style.display = "none";
				document.getElementById("broad-preview").src = reader.result;
			};
			if (file) {
				reader.readAsDataURL(file);
			}
		},
		uploadBroadImage:function() {
			if(this.get('selectBroadUsers').length > 0) {
				var desc = document.getElementById("broad-preview-input").value;
				var img = document.getElementById("broad-preview");
				var names = '';
				for(var i = 0;i < this.get('selectBroadUsers').length;i++) {
					names += this.get('selectBroadUsers').objectAt(i) + '-';
				}
				if(desc == '') {
					this.get('sock2').send('datum:' + names + ':' + 'desc:' + ':' + ((img.src).toString()));
				} else {
					this.get('sock2').send('datum:' + names + ':' + 'desc:' + desc + ':' + ((img.src).toString()));
					document.getElementById("broad-preview-input").value = '';
				}
				this.send('removeBroadcast');
			} else {
				document.getElementById("warn").style.display = "block";
				document.getElementById("removewarn").style.display = "block";
			}
		},
		
		/*uploadBroadFile: function(event) {
			if(this.get('selectBroadUsers').length > 0) {
				const reader = new FileReader();
				const file = event.target.files[0];
				reader.onload = () => {
					var img = new Image();
					img.src = reader.result;
					var names = '';
					for(var i = 0;i < this.get('selectBroadUsers').length;i++) {
						names += this.get('selectBroadUsers').objectAt(i) + '-';
					}
					var desc = document.getElementById("broadcastmsg").value;
					if(desc == '') {
						this.get('sock2').send('datum:' + names + ':' + 'desc:' + ':' + ((img.src).toString()));
					} else {
						this.get('sock2').send('datum:' + names + ':' + 'desc:' + desc + ':' + ((img.src).toString()));
						document.getElementById("broadcastmsg").value = '';
					}
					this.send('removeBroadcast');
				};
				if (file) {
					reader.readAsDataURL(file);
				}
			} else {
				document.getElementById("warn").style.display = "block";
				document.getElementById("removewarn").style.display = "block";
			}
		},*/
		
		uploadBroadVideoFile: function(event) {
			if(this.get('selectBroadUsers').length > 0) {
				const reader = new FileReader();
				const file = event.target.files[0];
				reader.onload = () => {
					var video = document.createElement("VIDEO");
					video.src = reader.result;
					var names = '';
					for(var i = 0;i < this.get('selectBroadUsers').length;i++) {
						names += this.get('selectBroadUsers').objectAt(i) + '-';
					}
					var desc = document.getElementById("broadcastmsg").value;
					if(desc == '') {
						this.get('sock3').send('datum:' + names + ':' + 'desc:' + ':' + ((video.src).toString()));
					} else {
						this.get('sock3').send('datum:' + names + ':' + 'desc:' + desc + ':' + ((video.src).toString()));
						document.getElementById("broadcastmsg").value = '';
					}
					this.send('removeBroadcast');
				};
				if (file) {
					reader.readAsDataURL(file);
				}
			} else {
				document.getElementById("warn").style.display = "block";
				document.getElementById("removewarn").style.display = "block";
			}
		},
		
		broadcast: function(event) {
			if(event.keyCode === 13) {
				if(this.get('selectBroadUsers').length > 0) {
					//var socket = this.get('websockets').socketFor('ws://localhost:8080/chatroomserverember');
					var msg = document.getElementById('broadcastmsg').value;
					document.getElementById('broadcastmsg').value = '';
					var names = '';
					for(var i = 0;i < this.get('selectBroadUsers').length;i++) {
						names += this.get('selectBroadUsers').objectAt(i) + '-';
					}
					//console.log(names);
					this.get('socket').send(names + ":" + msg + ":" + "1"); 
					this.send('removeBroadcast');
				} else {
					document.getElementById("warn").style.display = "block";
					document.getElementById("removewarn").style.display = "block";
				}
			}
		},
		
		loadBroadCast: function() {
			if(this.get('broadcastusers').length == 0) {
				document.getElementById("broadcast").style.display = "block";
				for(var i  = 0;i < this.get('total').length;i++) {
					this.get('broadcastusers').pushObject(this.get('total').objectAt(i));
				}
			}
		},
		
		addUsersBroad: function(username) {
			this.send('removeWarn');
			document.getElementById("warn").style.display = "none";
			document.getElementById("removewarn").style.display = "none";
			if(this.get('selectBroadUsers').indexOf(username) == -1) {
				this.get('selectBroadUsers').pushObject(username);
			} else {
				this.get('selectBroadUsers').removeObject(username);
			}
		},
		
		forward: function(event) {
			this.set('source',event.target.id);
			if(this.get('source').indexOf('.') != -1) {
				if(document.getElementById(this.get('source')).border == '') {
					document.getElementById("forward").style.display = "block";
					document.getElementById(this.get('source')).border = 2;
					for(var i  = 0;i < this.get('total').length;i++) {
						this.get('forwardusers').pushObject(this.get('total').objectAt(i));
					}
				} else {
					this.send('removeForward');
				}
			} else {
				this.set('source','');
			}
		},
		addforward:function(name) {
			//this.send('removeWarn');
			//document.getElementById("warn").style.display = "none";
			//document.getElementById("removewarn").style.display = "none";
			if(this.get('selectedforwardusers').indexOf(name) == -1) {
				document.getElementById("frd-btn").style.display = "block";	
				this.get('selectedforwardusers').pushObject(name);
			} else {
				this.get('selectedforwardusers').removeObject(name);
				if(this.get('selectedforwardusers').length == 0) {
					document.getElementById("frd-btn").style.display = "none";
				}
			}
		},
		sendForward: function() {
			var names = '';
			for(var i = 0;i < this.get('selectedforwardusers').length;i++) {
				names += this.get('selectedforwardusers').objectAt(i) + '-';
			}
			this.get('sock2').send('forward:'+this.get('source')+':'+this.get('name')+':'+names);
			this.send('removeForward');
			/*var s = this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					s.send('removeForward');
				} 	
			};
			xhttp.open("POST", "forwardimageember", true);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send("filename=" + this.get('source') + "&username=" + this.get('name') + "&receivers=" + names);	*/
		},
		
		removeForward: function() {
			document.getElementById(this.get('source')).border = '';
			this.set('source','');
			document.getElementById("forward").style.display = "none";
			//this.send('removeWarn');
			if(this.get('forwardusers').length > 0) {
				this.get('forwardusers').removeAt(0,this.get('forwardusers').length);
			}
			if(this.get('selectedforwardusers').length > 0) {
				this.get('selectedforwardusers').removeAt(0,this.get('selectedforwardusers').length);
			}		
		},
		
		removeWarn : function() {
			document.getElementById("warn").style.display = "none";
			document.getElementById("removewarn").style.display = "none";
		},
		
		removeBroadcast: function() {
			document.getElementById("pre-broad").style.display = "none";
			document.getElementById("broadsend").style.display = "block";
			document.getElementById("broadcast").style.display = "none";
			document.getElementById('broadcastmsg').value = '';
			this.send('removeWarn');
			if(this.get('broadcastusers').length > 0) {
				this.get('broadcastusers').removeAt(0,this.get('broadcastusers').length);
			}
			if(this.get('selectBroadUsers').length > 0) {
				this.get('selectBroadUsers').removeAt(0,this.get('selectBroadUsers').length);
			}
		},
		
		createGroup: function(event) {
			if(event.keyCode === 13) {
				var groupname = document.getElementById('groupName').value;
				if(groupname != '') {
					//console.log(groupname);
					var s = this;
					var xhttp1 = new XMLHttpRequest();
					xhttp1.onreadystatechange = function() {
						if (this.readyState == 4 && this.status == 200) {
							var res = this.responseText;
							if(res.toString().trim() == 'true') {
								document.getElementById('groupName').value = '';
								document.getElementById('createGroupDiv').style.display = "none";
								s.send('loadGroupNames');
							} else {
								document.getElementById('grpexits').innerHTML = 'Oops!!! Try another name...';
							}
						} 
					};
					xhttp1.open("POST", "creategroupember", true);
					xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					xhttp1.send("username=" + s.get('name') + "&groupname=" + groupname);	
				} else {
					document.getElementById('grpexits').innerHTML = 'Enter Valid Name';
				}
			}
		},
		
		loadCreateGroup:function() {
			if(document.getElementById('createGroupDiv').style.display == 'block') {
				document.getElementById('createGroupDiv').style.display = "none";
			} else {
				document.getElementById('createGroupDiv').style.display = "block";
			}
		},
		removeMe : function(groupName) {
			var result = confirm("Are you Sure to Leave  " + groupName + " ?");
			var s = this;
			if(result == true) {
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						s.send('loadGroupNames');
					} 	
				};
				xhttp.open("POST", "leavegroupember", true);
				xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhttp.send("groupname=" + groupName + "&username=" + s.get('name'));
			}
		},
		test:function(event) {
			var vl = event.srcElement.id;
			var nos = vl.charAt(vl.length - 1);
			var textareapos = document.getElementById("text-box"+nos).scrollTop;
			var scrollheight = document.getElementById("text-box"+nos).scrollHeight;
			if(textareapos == 0 && this.get('temp') == '0') {
				document.getElementById('text-box'+nos).innerHTML = '';
				var s = this;
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						document.getElementById('text-box'+nos).setAttribute('class','cus-textarea');
						var historyMessages = JSON.parse(this.responseText);
						if(historyMessages.length == 1) {
							s.set('message','No messages yet');
						} else {
							for(var i = 0; i < historyMessages.length - 1; i++) {
								var newele = document.createElement('div');
								var newTimeElement = document.createElement('div');
								var time = historyMessages[i].time.split(' ');
								var hrsAndMins = time[1].split(':');
								newele.setAttribute('id',time);
								newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
								if(historyMessages[i].type == 'text') {
									if(historyMessages[i].sender == s.get('currname'+nos)) {
										newele.setAttribute('class', 'cus-textmsg-remoteuser');
										newele.innerHTML = '<xmp class="text-user-id-xmp">' + historyMessages[i].message + '</xmp>';
										newTimeElement.setAttribute('class','time-remoteuser');					
									} else {
										newele.setAttribute('class', 'cus-textmsg-user');
										newele.innerHTML = '<xmp class="text-user-id-xmp">' + historyMessages[i].message + '</xmp>';
										newTimeElement.setAttribute('class','time-user');
									}
									document.getElementById('text-box'+nos).appendChild(newele);
									document.getElementById(time).appendChild(newTimeElement);	
								} else if(historyMessages[i].type == 'file'){
									var desc = document.createElement("div");
									var img = new Image();
									img.src = historyMessages[i].message;
									img.width = 200;
									img.height = 90;
									img.setAttribute('id',historyMessages[i].id);
									if(historyMessages[i].sender == s.get('currname'+nos)) {
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
									document.getElementById('text-box'+nos).appendChild(newele);
									document.getElementById(time).appendChild(img);
									document.getElementById(time).appendChild(desc);
									document.getElementById(time).appendChild(newTimeElement);
								} else {
									var desc = document.createElement("div");
									//time = historyMessages[i].time;
									newele.setAttribute('id',time);
									newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
									var video = document.createElement("VIDEO");
									video.src = historyMessages[i].message;
									video.setAttribute('id',historyMessages[i].id);
									video.width = 200;
									video.height = 90;
									video.setAttribute('controls','controls');
									if(historyMessages[i].sender == s.get('currname'+nos)) {
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
									document.getElementById('text-box'+nos).appendChild(newele);
									document.getElementById(time).appendChild(video);
									document.getElementById(time).appendChild(desc);
									document.getElementById(time).appendChild(newTimeElement);							
								}
							}
							var objDiv = document.getElementById("text-box"+nos);
							objDiv.scrollTop = objDiv.scrollHeight - scrollheight;
						}
					} else {
							document.getElementById('text-box'+nos).setAttribute('class','loader');
					}
				};
				xhttp.open("POST", "chathistoryembertwo", true);
				xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhttp.send("personFirst=" + s.get('name') + "&personSecond=" + s.get('currname'+nos) + "&limit=" + this.get('limits'+nos));
				this.set('limits'+nos, this.get('limits'+nos) + 5);
			}
		},
		loadGroup : function(groupName) {
			//this.set('limits',10);
			localStorage.setItem('groupName',groupName);
			this.send('removeBroadcast');
			this.get('router').transitionTo('group');
		},
	
		loadGroupNames: function() {
			var s = this;
			if(this.get('groupList').length > 0) {
				this.get('groupList').removeAt(0,this.get('groupList').length);
			}
			var xhttp1 = new XMLHttpRequest();
			xhttp1.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var val = this.responseText;
				//console.log('load Group Names happened : ' + val);
				var n = val.split(',');
				for (var i = 0; i < n.length - 1; i++) {
						s.get('groupList').pushObject(n[i]);
				}
				//s.send('loadOnlineUser');
				s.send('loadMessageCount');
			} 
		};
		xhttp1.open("POST", "chatgroupnamestwo", true);
		xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp1.send("username=" + s.get('name'));
		},
		
		loadUserProfile:function() {
			document.getElementById("profiledetial").style.display = "block";
			var s = this;
			var xhttp1 = new XMLHttpRequest();
			xhttp1.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var userProfile = JSON.parse(this.responseText);
					document.getElementById('dobuser').value = userProfile.dob;
					document.getElementById('placeuser').value = userProfile.place;
				} 
			};
			xhttp1.open("POST", "loadprofileember", true);
			xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp1.send("username=" + s.get('name'));
		},
		removeUserProfile:function() {
			document.getElementById('profiledetial').style.display = "none";
		},
		
		updateUserProfile:function() {
			var dob = document.getElementById("dobuser").value;
			var place = document.getElementById("placeuser").value;
			if(dob != '' && place != '') {
				var s = this;
				var xhttp1 = new XMLHttpRequest();
				xhttp1.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
					
					} 
				};
				xhttp1.open("POST", "updateuserprofileember", true);
				xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhttp1.send("username=" + s.get('name') + "&dob=" + dob + "&place=" + place);
			}
		},
		
		loadProfile: function() {
			var s = this;
			$.ajax({
				type:"POST",
				async:false,
				data:{username:s.get('currname0')},
				url:"loadprofileember",
				success:function(data){
					var userProfile = JSON.parse(data);
					s.set('profile','PROFILE');
					s.set('dob',userProfile.dob);
					s.set('place',userProfile.place);
					document.getElementById("imgname").style.display = "block";
					document.getElementById("imgdob").style.display = "block";
					document.getElementById("imgloc").style.display = "block";
				}
			});
		},
		
		loadinfo:function(no) {
			console.log('e');
			if(document.getElementById('info'+no).style.display == "block") {
				console.log('e');
				document.getElementById('info'+no).style.display = "none";
				return;
			}
			var s = this;
			$.ajax({
				type:"POST",
				async:false,
				data:{username:s.get('currname'+no),user:s.get('name')},
				url:"loadprofileember",
				success:function(data){
					var userProfile = JSON.parse(data);
					s.set('profile','PROFILE');
					s.set('dob'+no,userProfile.dob);
					s.set('place'+no,userProfile.place);
					if(userProfile.block == 1) {
						var btn = document.getElementById("block"+no);
						btn.setAttribute('class','btn btn-danger');
						btn.innerHTML = "Block";
					} else {
						var btn = document.getElementById("block"+no);
						btn.setAttribute('class','btn btn-success');
						btn.innerHTML = "Unblock";
					}
					document.getElementById("info"+no).style.display = "block";
				}
			});
		},
		exportMessage: function(no) {
			var s = this;
				var xhttp1 = new XMLHttpRequest();
				xhttp1.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var result = this.responseText;
					console.log(result);
					window.location.href = "/dowloaderember?name=" + result;
				} 
			};
			xhttp1.open("POST", "exportmessageember", true);
			xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp1.send("personFirst=" + s.get('name') + "&personSecond=" + s.get('currname'+no));
		},
		
		loadUsers: function() {
			var s = this;
			var users;
			if(this.get('total').length > 0) {
				this.get('total').removeAt(0,this.get('total').length);
			}
			if(this.get('active').length > 0) {
				this.get('active').removeAt(0,this.get('active').length);
			}
			if(this.get('inactive').length > 0) {
				this.get('inactive').removeAt(0,this.get('inactive').length);
			}
			$.ajax({
				type:"POST",
				async:false,
				data:{username:s.get('name')},
				url:"chatusers",
				success:function(data){
					users = JSON.parse(data);
					for(var i = 0;i < users.length - 1;i++) {
						s.get('total').pushObject(users[i].name);
						if(users[i].condn == '1') {
							s.get('active').pushObject(users[i].name);
						} else {
							s.get('inactive').pushObject(users[i].name);
						}
					}
				}
			});
		},
		loadOnlineUser: function() {
			/*for(var i = 0;i < this.get('active').length;i++) {
				console.log(this.get('active').objectAt(i) + ' active');
				document.getElementById(this.get('active').objectAt(i)).style.backgroundColor = "#26e25b";
			}
			for(var i = 0;i < this.get('inactive').length;i++) {
					console.log(this.get('inactive').objectAt(i) + ' inactive');
				document.getElementById(this.get('inactive').objectAt(i)).style.backgroundColor = "red";
			}*/
			/*var s = this;
				var xhttp1 = new XMLHttpRequest();
				xhttp1.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var val = this.responseText;
					//console.log('online usersusers : ' + val);
					var n = val.split(';');
					for (var i = 0; i < s.get('total').length; i++) {
						var flag = 0;
						for(var j = 0;j < n.length;j++) {
							if(s.get('total').objectAt(i) == n[j]) {
								flag = 1;
								document.getElementById(n[j]).style.backgroundColor = "#26e25b";
							} 
						}
						if(flag == 0) {
						document.getElementById(s.get('total').objectAt(i)).style.backgroundColor = "red";
						}
					}
				} 
			};
			xhttp1.open("POST", "onlinecheckember", true);
			xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp1.send("username=" + s.get('name'));*/
		},
	
		loadMessageCount : function() {
			var s = this;
			var xhttp1 = new XMLHttpRequest();
			xhttp1.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var result = JSON.parse(this.responseText);
				if(result.length != 1) {
					for(var i = 0;i < result.length - 1;i++) {
						if(s.get('active').indexOf(result[i].sender) != -1) {
							s.get('temps').pushObject(result[i].sender);
							s.get('active').removeObject(result[i].sender);
							s.set('temps',s.get('temps').concat(s.get('active')));
							if(s.get('active').length > 0) {
								s.get('active').removeAt(0,s.get('active').length);
							}
							s.set('active',s.get('active').concat(s.get('temps')));
						} else {
							s.get('temps').pushObject(result[i].sender);
							s.get('inactive').removeObject(result[i].sender);
							s.set('temps',s.get('temps').concat(s.get('inactive')));
							if(s.get('inactive').length > 0) {
								s.get('inactive').removeAt(0,s.get('inactive').length);
							}
							s.set('inactive',s.get('inactive').concat(s.get('temps')));
						}
						if(s.get('temps').length > 0) {
							s.get('temps').removeAt(0,s.get('temps').length);
						}
						document.getElementById(result[i].sender).innerHTML = result[i].count;
					}
				}
			} 
		};
		xhttp1.open("POST", "messagecountember", true);
		xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp1.send("username=" + s.get('name'));
		},
		
		deleteMessageCount : function() {
			var s = this;
			var xhttp1 = new XMLHttpRequest();
			xhttp1.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
			} 
		};
		xhttp1.open("POST", "deletemessagecountember", true);
		xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp1.send("username=" + s.get('name') + "&sendername=" + s.get('currname0'));
		},
		
		logout: function() {
			localStorage.removeItem('name');
			localStorage.removeItem('currentPerson');
			var xhttp1 = new XMLHttpRequest();
				xhttp1.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
				} 
			};
			xhttp1.open("GET", "chatlogout", true);
			xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp1.send();
		},
		blockcheck: function() {
			var s = this;
			var xhttp1 = new XMLHttpRequest();
				xhttp1.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var result = this.responseText;
					document.getElementById('block').style.display = "block";
					if(result.toString().trim() == 'blocked') {
						document.getElementById('block').innerHTML = "Unblock";
						document.getElementById('block').setAttribute('class','btn btn-success');
					} else {
						document.getElementById('block').innerHTML = "Block";
						document.getElementById('block').setAttribute('class','btn btn-danger');
					}
				} 
			};
			xhttp1.open("POST", "blockcheckember", true);
			xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp1.send("username=" + s.get('name') + "&blockerame=" + s.get('currname0'));
		},
		loadImage: function(name) {
			console.log(name);
		},
		
		blockChanger: function(no) {
			var value = document.getElementById('block'+no).innerHTML;
			var s = this;
			var xhttp1 = new XMLHttpRequest();
			xhttp1.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var result = this.responseText;
					document.getElementById('block'+no).style.display = "block";
					if(result.toString().trim() == 'blocked') {
						document.getElementById('block'+no).innerHTML = "Unblock";
						document.getElementById('block'+no).setAttribute('class','btn btn-success');
					} else if(result.toString().trim() == 'unblocked') {
						document.getElementById('block'+no).innerHTML = "Block";
						document.getElementById('block'+no).setAttribute('class','btn btn-danger');
					} else {
						s.set('currname'+no,'');
						s.set('profile'+no,'');
						s.set('dob'+no,'');
						s.set('place'+no,'');
						s.get('router').transitionTo('error');
					}
				} 
			};
			xhttp1.open("POST", "blockchangerember", true);
			xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp1.send("username=" + s.get('name') + "&blockerame=" + s.get('currname'+no) + "&status=" + value);
		},
	
		loadHistoryMessages : function(person) {
			if(person == this.get('currname0') || person == this.get('currname1') || person == this.get('currname2')) {
				return;
			}
			this.set('temp','1');
			var textbox;
			var send;
			var drop;
			if(this.get('lastname') == -1) {
				this.set('lastname',0);
				this.set('currname0',person);
				this.set('typers0','');
				textbox = 'text-box0';
				send = 'send0';
				drop = 'drop0';
			} else {
				var no = this.get('lastname');
				if(no == 2) {
					no = 0;
					this.set('lastname',no);
				} else {
					no = no + 1;
					this.set('lastname',no);
				}
				this.set('currname'+no,person);
				this.set('typers'+no,'');
				textbox = 'text-box'+no;
				send = 'send'+no;
				drop = 'drop'+no;
			}
			//console.log('textbox value ' + textbox)
			//this.set('currname0',person);
			//localStorage.setItem('currentPerson',person);
			//this.set('typers','');
			if(document.getElementById(textbox) != null) {
				document.getElementById(textbox).innerHTML = '';
			}
			var s = this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					if(document.getElementById(person) != null) {
						document.getElementById(person).innerHTML = '';
					}
					var historyMessages = JSON.parse(this.responseText);
					document.getElementById(send).style.display = "block";
					document.getElementById(drop).style.display = "block";
					if(historyMessages.length == 1) {
						s.set('message','No messages yet');
					} else {
						for (var i = 0; i < historyMessages.length - 1; i++) {
							var newele = document.createElement('div');
							var newTimeElement = document.createElement('div');
							var time = historyMessages[i].time.split(' ');
							var hrsAndMins = time[1].split(':');
							newele.setAttribute('id',time);
							newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
							if(historyMessages[i].type == 'text') {
								if(historyMessages[i].sender == person) {
									newele.setAttribute('class', 'cus-textmsg-remoteuser');
									newele.innerHTML = '<xmp class="text-user-id-xmp">' + historyMessages[i].message + '</xmp>';
									newTimeElement.setAttribute('class','time-remoteuser');
								} else {
									newele.setAttribute('class', 'cus-textmsg-user');
									newele.innerHTML = '<xmp class="text-user-id-xmp">' + historyMessages[i].message + '</xmp>';
									newTimeElement.setAttribute('class','time-user');									
								}
								document.getElementById(textbox).appendChild(newele);
								document.getElementById(time).appendChild(newTimeElement);
							} else if(historyMessages[i].type == 'file') {
								var desc = document.createElement("div");
								//time = historyMessages[i].time;
								newele.setAttribute('id',time);
								newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
								var img = new Image();
								img.src = historyMessages[i].message;
								img.setAttribute('id',historyMessages[i].id);
								img.width = 200;
								img.height = 90;
								if(historyMessages[i].sender == person) {
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
								document.getElementById(textbox).appendChild(newele);
								document.getElementById(time).appendChild(img);
								document.getElementById(time).appendChild(desc);
								document.getElementById(time).appendChild(newTimeElement);
							} else {
								var desc = document.createElement("div");
								//time = historyMessages[i].time;
								newele.setAttribute('id',time);
								newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
								var video = document.createElement("VIDEO");
								video.src = historyMessages[i].message;
								video.setAttribute('id',historyMessages[i].id);
								video.width = 200;
								video.height = 90;
								video.setAttribute('controls','controls');
								if(historyMessages[i].sender == person) {
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
								document.getElementById(textbox).appendChild(newele);
								document.getElementById(time).appendChild(video);
								document.getElementById(time).appendChild(desc);
								document.getElementById(time).appendChild(newTimeElement);							
							}
						}
						s.set('temp','0');
						var objDiv = document.getElementById(textbox);
						objDiv.scrollTop = objDiv.scrollHeight;
					}
				} 	
			};
			xhttp.open("POST", "chathistoryembertwo", true);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send("personFirst=" + s.get('name') + "&personSecond=" + person + "&limit=5");		
			//s.send('loadProfile');
			//s.send('blockcheck');
			if(document.getElementById(person).innerHTML != '') {
				s.send('deleteMessageCount');
			}	
		},
		loadSearch:function(val) {
			if(val == 1) {
				document.getElementById('searcher').style.display = "block";
				var s = this;
				var xhttp1 = new XMLHttpRequest();
				xhttp1.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						s.set('messages',JSON.parse(this.responseText));
					}
				};
				xhttp1.open("POST", "chatsearchember", true);
				xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhttp1.send("username=" + s.get('name'));
			} else {
				document.getElementById('suggestion').innerHTML = '';
				document.getElementById('searcher').style.display = "none";
				document.getElementById('search').value = '';
			}
		},
		loadMessage: function(event) {
			this.set('temp','1');
			var no;
			var val = event.target.id;
			if(val != 'suggestion' && val != '') {
				var name = event.srcElement.childNodes[1].innerText;
				if(name.startsWith('You')) {
					console.log('you');
					var v = name.split(' ');
					if(this.get('currname0') == v[2]) {
						console.log('you currname0');
						no = 0;
					} else if(this.get('currname1') == v[2]) {
						console.log('you currname1');
						no = 1;
					} else if(this.get('currname2') == v[2]) {
						console.log('you currname2');
						no = 2;	
					} else if(this.get('lastname') == -1) {
						console.log('you lastname');
						no = 0;
						this.set('lastname',1);
						this.set('currname0',v[2]);
						this.set('typers0','');
					} else {
						console.log('you lastname ellse');
						var nos = this.get('lastname');
						if(nos == 2) {
							no = 0;
							this.set('lastname',no);
						} else {
							no = nos + 1;
							this.set('lastname',no);
						}
						this.set('currname'+no,v[2]);
						this.set('typers'+no,'');
					}
				} else {
					if(this.get('currname0') == name) {
						console.log(' currname0');
						no = 0;
					} else if(this.get('currname1') == name) {
						console.log(' currname1');
						no = 1;
					} else if(this.get('currname2') == name) {
						console.log(' currname2');
						no = 2;	
					} else if(this.get('lastname') == -1) {
						console.log(' lastname');
						no = 0;
						this.set('lastname',1);
						this.set('currname0',name);
						this.set('typers0','');
					} else {
						console.log('lastname ellse');
						var nos = this.get('lastname');
						if(nos == 2) {
							no = 0;
							this.set('lastname',no);
						} else {
							console.log('no = nos+ 1 elase lastname');
							no = nos + 1;
							this.set('lastname',no);
						}
						this.set('currname'+no,name);
						this.set('typers'+no,'');
					}
				}
				console.log(this.get('lastname'));
				console.log(no);
				var send = 'send' + no;
				var drop = 'drop' + no;
				var textbox = 'text-box'+no;
			var person = this.get('currname'+no);
				this.send('loadSearch',0);
				var s = this;
				document.getElementById(textbox).innerHTML = '';
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						if(document.getElementById(person) != null) {
							document.getElementById(person).innerHTML = '';
						}
						var historyMessages = JSON.parse(this.responseText);
						document.getElementById(send).style.display = "block";
						document.getElementById(drop).style.display = "block";
						if(historyMessages.length == 1) {
							s.set('message','No messages yet');
						} else {
							for (var i = 0; i < historyMessages.length - 1; i++) {
								var newele = document.createElement('div');
								var newTimeElement = document.createElement('div');
								var time = historyMessages[i].time.split(' ');
								var hrsAndMins = time[1].split(':');
								newele.setAttribute('id',time);
								newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
								if(historyMessages[i].type == 'text') {
									if(historyMessages[i].sender == person) {
										newele.setAttribute('class', 'cus-textmsg-remoteuser');
										newele.innerHTML = '<xmp class="text-user-id-xmp">' + historyMessages[i].message + '</xmp>';
										newTimeElement.setAttribute('class','time-remoteuser');
									} else {
										newele.setAttribute('class', 'cus-textmsg-user');
										newele.innerHTML = '<xmp class="text-user-id-xmp">' + historyMessages[i].message + '</xmp>';
										newTimeElement.setAttribute('class','time-user');									
									}
									document.getElementById(textbox).appendChild(newele);
									document.getElementById(time).appendChild(newTimeElement);
								} else if(historyMessages[i].type == 'file') {
									var desc = document.createElement("div");
									//time = historyMessages[i].time;
									newele.setAttribute('id',time);
									newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
									var img = new Image();
									img.src = historyMessages[i].message;
									img.setAttribute('id',historyMessages[i].id);
									img.width = 200;
									img.height = 90;
									if(historyMessages[i].sender == person) {
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
									document.getElementById(textbox).appendChild(newele);
									document.getElementById(time).appendChild(img);
									document.getElementById(time).appendChild(desc);
									document.getElementById(time).appendChild(newTimeElement);
								} else {
									var desc = document.createElement("div");
									//time = historyMessages[i].time;
									newele.setAttribute('id',time);
									newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
									var video = document.createElement("VIDEO");
									video.src = historyMessages[i].message;
									video.setAttribute('id',historyMessages[i].id);
									video.width = 200;
									video.height = 90;
									video.setAttribute('controls','controls');
									if(historyMessages[i].sender == person) {
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
									document.getElementById(textbox).appendChild(newele);
									document.getElementById(time).appendChild(video);
									document.getElementById(time).appendChild(desc);
									document.getElementById(time).appendChild(newTimeElement);							
								}
							}
						}
						s.set('temp','0');
						var temp = historyMessages.length - 2;
						temp = Math.floor(temp / 5) * 5;
						s.set('limits'+no,s.get('limits'+no) + temp);
					} 	
				};
				xhttp.open("POST", "searchmessagehistoryember", true);
				xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhttp.send("messageid=" + val);
			}
		},
		
		search: function() {
			var value = document.getElementById("search").value;
			if(value == '') {
				document.getElementById('suggestion').innerHTML = '';
				return;
			}
			document.getElementById('suggestion').innerHTML = '';
			var flag = 0;
			document.getElementById('suggestion').innerHTML = '';
			for(var i = 0;i < this.get('messages').length - 1;i++) {
				var msg = this.get('messages')[i].message;
				if(msg.search(value) >= 0 && msg.startsWith(value.charAt(0))) {
					flag = 1;
					var name = this.get('messages')[i].sender;
					var time = this.get('messages')[i].time;
					var id = this.get('messages')[i].id;
					var newele = document.createElement("div");
					
					newele.setAttribute("id",id);
					newele.innerHTML = msg;
					var nameele = document.createElement("div");
					nameele.setAttribute("class","name-group-user");
					if(name == this.get('name')) {
						newele.setAttribute("class","cus-textmsg-user");
						nameele.innerHTML = "You -> " + this.get('messages')[i].receiver;
					} else {
						newele.setAttribute("class","cus-textmsg-remoteuser");
						nameele.innerHTML = name;
					}
					var timeele = document.createElement("div");
					timeele.setAttribute("class","time-remoteuser");
					timeele.innerHTML = time;
					document.getElementById('suggestion').appendChild(newele);
					document.getElementById(id).appendChild(nameele);
					document.getElementById(id).appendChild(timeele);
				}
			}
			if(flag == 0) {
				document.getElementById('suggestion').innerHTML = 'No messages found!';
			}
		},
		
		loadusersearch: function(no) {
			if(no == 0) {
				document.getElementById("allusers").style.display = "none";
				document.getElementById("usersearcher").style.display = "block";
			} else {
				document.getElementById("allusers").style.display = "block";
				document.getElementById("usersearcher").style.display = "none";
			}
		},
		usersearch: function() {
			var val = document.getElementById("usersearcherinput").value;
			if(this.get('searcher').length > 0) {
				this.get('searcher').removeAt(0,this.get('searcher').length);
			}
			if(val == '') {
				this.send('loadusersearch',1);
			} else {
				this.send('loadusersearch',0);
				for(var i = 0;i < this.get('inactive').length;i++) {
					var name = this.get('inactive').objectAt(i);
					if(name.search(val) >= 0 && name.startsWith(val.charAt(0))) {
						this.get('searcher').pushObject(name);
					}
				}
			}
		},
		loadactusersearch: function(no) {
			if(no == 0) {
				document.getElementById("actusrs").style.display = "none";
				document.getElementById("actsearcher").style.display = "block";
			} else {
				document.getElementById("actusrs").style.display = "block";
				document.getElementById("actsearcher").style.display = "none";
			}
		},
		useractsearch:function() {
			var val = document.getElementById("useractsearcherinput").value;
			if(this.get('actsearcher').length > 0) {
				this.get('actsearcher').removeAt(0,this.get('actsearcher').length);
			}
			if(val == '') {
				this.send('loadactusersearch',1);
			} else {
				this.send('loadactusersearch',0);
				for(var i = 0;i < this.get('active').length;i++) {
					var name = this.get('active').objectAt(i);
					if(name.search(val) >= 0 && name.startsWith(val.charAt(0))) {
						this.get('actsearcher').pushObject(name);
					}
				}
			}
		}
	}
});



/*img.width = 200;
				img.height = 200;
				var canvas = document.createElement("CANVAS");
				var context = canvas.getContext("2d");
				img.onload = () => {
					context.drawImage(img, 0, 0,img.width,img.height,0,0,canvas.width,canvas.height);
					var image = context.getImageData(0, 0,canvas.width,canvas.height);
					//var buffer = new ArrayBuffer();
					var bytes = new Int8Array(image.data.length);
					for (var i=0; i<bytes.length; i++) {
						bytes[i] = image.data[i];
					}
					//console.log(buffer);
					//console.log(bytes.buffer);
					console.log(bytes.buffer);
					console.log(bytes);
					s.get('sock2').send(bytes);
					document.getElementById("file-upload").value = '';
				};*/
				
				
				/*
			
			console.log("q");
			const reader = new FileReader();
			const file = event.target.files[0];
			reader.onload = () => {
				var img = new Image();
				img.src = reader.result;
				var canvas = document.createElement("CANVAS");
				var context = canvas.getContext("2d");
				img.onload = () => {
					context.drawImage(img, 0, 0);
					var image = context.getImageData(0, 0, canvas.width, canvas.height);
					//var buffer = new ArrayBuffer();
					var bytes = new Uint8Array(image.data.length);
					for (var i=0; i<bytes.length; i++) {
						bytes[i] = image.data[i];
					}
					//console.log(buffer);
					console.log(bytes.buffer);
					console.log(bytes.buffer);
					this.get('sock2').send(bytes.buffer);
					document.getElementById("file-upload").value = '';
				};
			};
			if (file) {
				reader.readAsDataURL(file);
			}*/
			
			
			/*	var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var val = this.responseText;
					//console.log('loadUsers happened : ' + val);
					var n = val.split(',');
					for (var i = 0; i < n.length - 1; i++) {	
						s.get('total').pushObject(n[i]);
					}
				} 
			};
			xhttp.open("POST", "chatusers", true);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send("username=" + s.get('name'));*/