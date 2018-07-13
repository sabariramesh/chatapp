import Controller from '@ember/controller';
import Ember from 'ember';
import {inject} from '@ember/service';

export default Controller.extend({
	init: function() {
		this._super();
		this.set('socket',this.get('websockets').socketFor('ws://localhost:8080/chatroomgroupserverember'));
		this.get('socket').on('open', this.myOpenHandler, this);
		this.get('socket').on('message', this.myMessageHandler, this);
		this.get('socket').on('close', function() {
			localStorage.removeItem("name");
			this.get('socket').close();
		}, this);
		this.set('name',localStorage.getItem('name'));
		
		this.set('socket2',this.get('websockets').socketFor('ws://localhost:8080/websocketgroupimageserver'));
		this.get('socket2').on('open', this.myOpenImage, this);
		this.get('socket2').on('message', this.myMsgImage, this);
		this.get('socket2').on('close', function() {
			localStorage.removeItem("name");
			this.get('socket2').close();
		}, this);
		
		this.set('sock3',this.get('websockets').socketFor('ws://localhost:8080/videogroupserverember'));
		this.get('sock3').on('open',this.myopenvideo,this);
		this.get('sock3').on('message',this.mymessgvideo,this);
		this.get('sock3').on('close',function() {
			this.get('sock3').close();
		},this);
	},
	socket: '',
	socket2: '',
	sock3: '',
	message: '',
	grouptypers: [],
	groupMembersList:[],
	name: '',
	groupList: [],
	currentGroupName: '',
	check: [],
	addnNewUserList: [],
	//removeUserList: [],
	router: inject(),
	isAdmin: false,
	limits: 10,
	makeAdminList: [],
	
	myopenvideo: function() {
		this.get('sock3').send(this.get('name'));
	},
	mymessgvideo:function(event) {
		var videoMessage = JSON.parse(event.data);
		if(videoMessage.groupname == this.get('currentGroupName')) {
			if(videoMessage.sender == this.get('name')) {
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
				video.setAttribute('controls','controls');
				video.setAttribute('id',videoMessage.id);
				newele.setAttribute('class', 'cus-img-user');
				newTimeElement.setAttribute('class','time-user');
				if(videoMessage.desc != '') {
					desc.setAttribute('class','desc-img-user');
					desc.innerHTML = videoMessage.desc;
				}
				document.getElementById('text-box-group').appendChild(newele);
				document.getElementById(time).appendChild(video);
				document.getElementById(time).appendChild(desc);
				document.getElementById(time).appendChild(newTimeElement);
				var objDiv = document.getElementById("text-box-group");
				objDiv.scrollTop = objDiv.scrollHeight;
			} else {
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
				video.setAttribute('controls','controls');
				video.setAttribute('id',videoMessage.id);
				newele.setAttribute('class', 'cus-img-remoteuser');
				newTimeElement.setAttribute('class','time-remoteuser');
				if(videoMessage.desc != '') {
					desc.setAttribute('class','desc-img-user');
					desc.innerHTML = videoMessage.desc;
				}
				var senderName = document.createElement('div');
				senderName.setAttribute('class','name-group-user');
				senderName.innerHTML = videoMessage.sender;
				document.getElementById('text-box-group').appendChild(newele);
				document.getElementById(time).appendChild(video);
				document.getElementById(time).appendChild(desc);
				document.getElementById(time).appendChild(senderName);
				document.getElementById(time).appendChild(newTimeElement);
				var objDiv = document.getElementById("text-box-group");
				objDiv.scrollTop = objDiv.scrollHeight;
			}
		}
	},
	
	myOpenImage: function() {
		this.get('socket2').send(this.get('name'));
	},
	
	myMsgImage: function(event) {
		var imageMessage = JSON.parse(event.data);
		if(imageMessage.groupname == this.get('currentGroupName')) {
			if(imageMessage.sender == this.get('name')) {
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
				document.getElementById('text-box-group').appendChild(newele);
				document.getElementById(time).appendChild(img);
				document.getElementById(time).appendChild(desc);
				document.getElementById(time).appendChild(newTimeElement);
				var objDiv = document.getElementById("text-box-group");
				objDiv.scrollTop = objDiv.scrollHeight;
			} else {
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
					desc.setAttribute('class','desc-img-user');
					desc.innerHTML = imageMessage.desc;
				}
				var senderName = document.createElement('div');
				senderName.setAttribute('class','name-group-user');
				senderName.innerHTML = imageMessage.sender;
				document.getElementById('text-box-group').appendChild(newele);
				document.getElementById(time).appendChild(img);
				document.getElementById(time).appendChild(desc);
				document.getElementById(time).appendChild(senderName);
				document.getElementById(time).appendChild(newTimeElement);
				var objDiv = document.getElementById("text-box-group");
				objDiv.scrollTop = objDiv.scrollHeight;
			}
		}
	},
	
	myOpenHandler: function() {
		//var socket = this.get('websockets').socketFor('ws://localhost:8080/chatroomgroupserverember');
		this.get('socket').send(this.get('name'));
	},
	myMessageHandler: function(event) {
		if(event.data.indexOf("#") == 0) {
			var nametypers = event.data.split("#");
			this.get('grouptypers').pushObject(nametypers[2]);
			if(nametypers[1] == this.get('currentGroupName')) {
				var len = this.get('grouptypers').length;
				if(len > 1) {
					document.getElementById('grouptyping').innerHTML = this.get('grouptypers').objectAt(0) + " and " + (len - 1) + ' others typing...';
				} else if( len == 1) {
					document.getElementById('grouptyping').innerHTML = this.get('grouptypers').objectAt(0) + " typing... ";
				} else {
						document.getElementById('grouptyping').innerHTML = '';
				}
			}
			
		} else if(event.data.indexOf("!") == 0) {
			 var namestoptypers = event.data.split("!");
			this.get('grouptypers').removeObject(namestoptypers[2]);
			if(namestoptypers[1] == this.get('currentGroupName')) {
				var len2 = this.get('grouptypers').length;
				if(len2 > 1) {
					document.getElementById('grouptyping').innerHTML = this.get('grouptypers').objectAt(0) + " and " + (len - 1) + ' others typing...';
				} else if(len2 == 1){
					document.getElementById('grouptyping').innerHTML = this.get('grouptypers').objectAt(0) + " typing... ";
				} else {
						document.getElementById('grouptyping').innerHTML = '';				
				}
			}
					
		} else if(event.data.indexOf('$') == 0){
			var names3 = event.data.split('$');
			if(this.get('grouptypers').indexOf(names3[1]) != - 1) {
				this.get('grouptypers').removeObject(names3[1]);
			}
		} 
		else if (event.data.toString().trim() == 'XzNm!+_&%&^@&@&*^#') {
			this.set('limits',10); //to reset the load history
			document.getElementById('admin').innerHTML = "";
			if(this.get('addnNewUserList').length > 0) {
				this.get('addnNewUserList').removeAt(0,this.get('addnNewUserList').length);
			}
			/*if(this.get('removeUserList').length > 0) {
				this.get('removeUserList').removeAt(0,this.get('removeUserList').length);
			}*/
			if(this.get('makeAdminList').length > 0) {
				this.get('makeAdminList').removeAt(0,this.get('makeAdminList').length);
			}
			alert("You can't Message!!!");
			this.get('router').transitionTo('chat');
		} else {
			var newMessage = JSON.parse(event.data);
			
			var newele = document.createElement('div');
			var newTimeElement = document.createElement('div');
			var time = newMessage.time.split(' ');
			var hrsAndMins = time[1].split(':');
			if(newMessage.sender == this.get('name')) {
				newele.setAttribute('class', 'cus-textmsg-user');
				newele.setAttribute('id',time);
				newele.innerHTML = '<xmp class="text-user-id-xmp">' + newMessage.message + '</xmp>';
				newTimeElement.setAttribute('class','time-user');
				newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
				document.getElementById('text-box-group').appendChild(newele);
				document.getElementById(time).appendChild(newTimeElement);
			} else {
				newele.setAttribute('class', 'cus-textmsg-remoteuser');
				newele.setAttribute('id',time);
				newele.innerHTML = '<xmp class="text-user-id-xmp">' + newMessage.message + '</xmp>';
				newTimeElement.setAttribute('class','time-remoteuser');
				newTimeElement.innerHTML =  hrsAndMins[0] + ':' + hrsAndMins[1];
				var senderName = document.createElement('div');
				senderName.setAttribute('class','name-group-user');
				senderName.innerHTML = newMessage.sender;
				document.getElementById('text-box-group').appendChild(newele);
				document.getElementById(time).appendChild(senderName);
				document.getElementById(time).appendChild(newTimeElement);
			}
			var objDiv = document.getElementById("text-box-group");
			objDiv.scrollTop = objDiv.scrollHeight;
		} 
	},
	adminCheck : function() {
		return this.get('isAdmin');
	}.property('content.adminCheck'),
	actions: {
		typing : function() {
			//var socket = this.get('websockets').socketFor('ws://localhost:8080/chatroomgroupserverember');
			this.get('socket').send(this.get('currentGroupName')+ ":" + this.get('name') + ":" + "typing");
		},
		stoptyping : function() {
			//var socket = this.get('websockets').socketFor('ws://localhost:8080/chatroomgroupserverember');
			this.get('socket').send(this.get('currentGroupName')+ ":" + this.get('name') + ":" + "not");
		},
		enter: function(event) {
			if(event.keyCode === 13) {
			//var socket = this.get('websockets').socketFor('ws://localhost:8080/chatroomgroupserverember');
			var msg = document.getElementById('msg').value;
			document.getElementById('msg').value = '';
			this.get('socket').send(this.get('currentGroupName')+ ":" + this.get('name') + ":" + msg); 
			}
		},
		
		loadGroupImage:function(event) {
			const reader = new FileReader();
			const file = event.target.files[0];
			reader.onload = () => {
				//console.log(reader.result);
				document.getElementById("pre").style.display = "block";
				document.getElementById("send").style.display = "none";
				document.getElementById("preview").src = reader.result;
			};
			if (file) {
				reader.readAsDataURL(file);
			}	
		},
		
		
		uploadGroupImage: function() {
			var desc = document.getElementById("preview-input").value;
			var img = document.getElementById("preview");
			if(desc == '') {
				this.get('socket2').send('data:' + this.get('currentGroupName') + ':' + 'desc:' + ':' + ((img.src).toString()));
			} else {
				this.get('socket2').send('data:' + this.get('currentGroupName') + ':' + 'desc:' + desc + ':' + ((img.src).toString()));
				document.getElementById("preview-input").value = '';
			}
			document.getElementById("pre").style.display = "none";
			document.getElementById("send").style.display = "block";
		},
		
		loadGroupVideo:function(event) {
			const reader = new FileReader();
			const file = event.target.files[0];
			reader.onload = () => {
				//console.log(reader.result);
				document.getElementById("prevideo").style.display = "block";
				document.getElementById("send").style.display = "none";
				document.getElementById("preview-video").src = reader.result;
			};
			if (file) {
				reader.readAsDataURL(file);
			}	
		},
		
		uploadGroupVideo:function(event) {
			var desc = document.getElementById("preview-input-video").value;
			var video = document.getElementById("preview-video");
			if(desc == '') {
				this.get('sock3').send('data:' + this.get('currentGroupName') + ':' + 'desc:' + ':' + ((video.src).toString()));
			} else {
				this.get('sock3').send('data:' + this.get('currentGroupName') + ':' + 'desc:' + desc + ':' + ((video.src).toString()));
				document.getElementById("preview-input-video").value = '';
			}
			document.getElementById("prevideo").style.display = "none";
			document.getElementById("send").style.display = "block";
		},
		
		loadhistory2 : function(groupName,name) {
			if(document.getElementById('text-box-group') != null) {
				document.getElementById('text-box').innerHTML = '';
			}
			this.set('currentGroupName',groupName);
			if(this.get('groupMembersList').length > 0) {
				this.get('groupMembersList').removeAt(0,this.get('groupMembersList').length);
			}	
			var s = this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var historyMessages = JSON.parse(this.responseText);
					//console.log(historyMessages);
					document.getElementById('send').style.display = "block";
					if(historyMessages.length == 0) {
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
								if(historyMessages[i].sender == s.get('name')) {
									newele.setAttribute('class', 'cus-textmsg-user');
									
									newele.innerHTML = '<xmp class="text-user-id-xmp">' + historyMessages[i].message + '</xmp>';
									newTimeElement.setAttribute('class','time-user');
									
									document.getElementById('text-box-group').appendChild(newele);
									document.getElementById(time).appendChild(newTimeElement);
								} else {
									
									newele.setAttribute('class', 'cus-textmsg-remoteuser');
									newele.innerHTML = '<xmp class="text-user-id-xmp">' + historyMessages[i].message + '</xmp>';
									newTimeElement.setAttribute('class','time-remoteuser');
									
									var senderName = document.createElement('div');
									senderName.setAttribute('class','name-group-user');
									senderName.innerHTML = historyMessages[i].sender;
									document.getElementById('text-box-group').appendChild(newele);
									document.getElementById(time).appendChild(senderName);
									document.getElementById(time).appendChild(newTimeElement);
								}
							} else if(historyMessages[i].type == 'file') {
								var desc = document.createElement("div");
								var img = new Image();
								img.src = historyMessages[i].message;
								img.setAttribute("id",historyMessages[i].id);
								img.width = 200;
								img.height = 90;
								if(historyMessages[i].sender == s.get('name')) {
									newele.setAttribute('class','cus-img-user');
									newTimeElement.setAttribute('class','time-user');
									if(historyMessages[i].desc != '') {
										desc.setAttribute('class','desc-img-user');
										desc.innerHTML = historyMessages[i].desc;
									}
									document.getElementById('text-box-group').appendChild(newele);
									document.getElementById(time).appendChild(img);
									document.getElementById(time).appendChild(desc);
									document.getElementById(time).appendChild(newTimeElement);
								} else {
									newele.setAttribute('class','cus-img-remoteuser');
									newTimeElement.setAttribute('class','time-remoteuser');
									if(historyMessages[i].desc != '') {
										desc.setAttribute('class','desc-img-user');
										desc.innerHTML = historyMessages[i].desc;
									}
									var senderName = document.createElement('div');
									senderName.setAttribute('class','name-group-user');
									senderName.innerHTML = historyMessages[i].sender;
									document.getElementById('text-box-group').appendChild(newele);
									document.getElementById(time).appendChild(img);
									document.getElementById(time).appendChild(desc);
									document.getElementById(time).appendChild(senderName);
									document.getElementById(time).appendChild(newTimeElement);
								}
							} else {
								var desc = document.createElement("div");
								var video = document.createElement("VIDEO");
								video.src = historyMessages[i].message;
								video.setAttribute("id",historyMessages[i].id);
								video.width = 200;
								video.height = 90;
								video.setAttribute('controls','controls');
								if(historyMessages[i].sender == s.get('name')) {
									newele.setAttribute('class','cus-img-user');
									newTimeElement.setAttribute('class','time-user');
									if(historyMessages[i].desc != '') {
										desc.setAttribute('class','desc-img-user');
										desc.innerHTML = historyMessages[i].desc;
									}
									document.getElementById('text-box-group').appendChild(newele);
									document.getElementById(time).appendChild(video);
									document.getElementById(time).appendChild(desc);
									document.getElementById(time).appendChild(newTimeElement);
								} else {
									newele.setAttribute('class','cus-img-remoteuser');
									newTimeElement.setAttribute('class','time-remoteuser');
									if(historyMessages[i].desc != '') {
										desc.setAttribute('class','desc-img-user');
										desc.innerHTML = historyMessages[i].desc;
									}
									var senderName = document.createElement('div');
									senderName.setAttribute('class','name-group-user');
									senderName.innerHTML = historyMessages[i].sender;
									document.getElementById('text-box-group').appendChild(newele);
									document.getElementById(time).appendChild(video);
									document.getElementById(time).appendChild(desc);
									document.getElementById(time).appendChild(senderName);
									document.getElementById(time).appendChild(newTimeElement);
								}
							}
						}
						var objDiv = document.getElementById("text-box-group");
						objDiv.scrollTop = objDiv.scrollHeight;
					}
				} 	
			};
			xhttp.open("POST", "chatgrouphistoryembertwo", true);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send("groupName=" + groupName + "&limit=5");
		},
		grpmem : function(user) {
			this.set('limits',10); //to reset the load history
		//	console.log(user);
			var temp = user.split('-');
			document.getElementById('admin').innerHTML = "";
			localStorage.setItem('temp',temp[0]);
			this.get('router').transitionTo('chat');
		},
		
		loadLazyHistory:function() {
			var textareapos = document.getElementById("text-box-group").scrollTop;
			var scrollheight = document.getElementById("text-box-group").scrollHeight;
			if(textareapos == 0) {
				document.getElementById('text-box-group').innerHTML = '';
				var s = this;
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						document.getElementById('text-box-group').setAttribute('class','cus-textarea');
						var historyMessages = JSON.parse(this.responseText);
						if(historyMessages.length == 0) {
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
									if(historyMessages[i].sender == s.get('name')) {
										newele.setAttribute('class', 'cus-textmsg-user');
										
										newele.innerHTML = '<xmp class="text-user-id-xmp">' + historyMessages[i].message + '</xmp>';
										newTimeElement.setAttribute('class','time-user');
										
										document.getElementById('text-box-group').appendChild(newele);
										document.getElementById(time).appendChild(newTimeElement);														
									} else {
										newele.setAttribute('class', 'cus-textmsg-remoteuser');
										newele.innerHTML = '<xmp class="text-user-id-xmp">' + historyMessages[i].message + '</xmp>';
										newTimeElement.setAttribute('class','time-remoteuser');
										var senderName = document.createElement('div');
										senderName.setAttribute('class','name-group-user');
										senderName.innerHTML = historyMessages[i].sender;
										document.getElementById('text-box-group').appendChild(newele);
										document.getElementById(time).appendChild(senderName);
										document.getElementById(time).appendChild(newTimeElement);
									}
								} else if(historyMessages[i].type == 'file') {
									var desc = document.createElement("div");
									var img = new Image();
									img.src = historyMessages[i].message;
									img.setAttribute("id",historyMessages[i].id);
									img.width = 200;
									img.height = 90;
									if(historyMessages[i].sender == s.get('name')) {
										newele.setAttribute('class','cus-img-user');
										newTimeElement.setAttribute('class','time-user');
										if(historyMessages[i].desc != '') {
											desc.setAttribute('class','desc-img-user');
											desc.innerHTML = historyMessages[i].desc;
										}
										document.getElementById('text-box-group').appendChild(newele);
										document.getElementById(time).appendChild(img);
										document.getElementById(time).appendChild(desc);
										document.getElementById(time).appendChild(newTimeElement);
									} else {
										newele.setAttribute('class','cus-img-remoteuser');
										newTimeElement.setAttribute('class','time-remoteuser');
										if(historyMessages[i].desc != '') {
											desc.setAttribute('class','desc-img-user');
											desc.innerHTML = historyMessages[i].desc;
										}
										var senderName = document.createElement('div');
										senderName.setAttribute('class','name-group-user');
										senderName.innerHTML = historyMessages[i].sender;
										document.getElementById('text-box-group').appendChild(newele);
										document.getElementById(time).appendChild(img);
										document.getElementById(time).appendChild(desc);
										document.getElementById(time).appendChild(senderName);
										document.getElementById(time).appendChild(newTimeElement);
									}
								} else {
									var desc = document.createElement("div");
									var video = document.createElement("VIDEO");
									video.src = historyMessages[i].message;
									video.setAttribute("id",historyMessages[i].id);
									video.width = 200;
									video.height = 90;
									video.setAttribute('controls','controls');
									if(historyMessages[i].sender == s.get('name')) {
										newele.setAttribute('class','cus-img-user');
										newTimeElement.setAttribute('class','time-user');
										if(historyMessages[i].desc != '') {
											desc.setAttribute('class','desc-img-user');
											desc.innerHTML = historyMessages[i].desc;
										}
										document.getElementById('text-box-group').appendChild(newele);
										document.getElementById(time).appendChild(video);
										document.getElementById(time).appendChild(desc);
										document.getElementById(time).appendChild(newTimeElement);
									} else {
										newele.setAttribute('class','cus-img-remoteuser');
										newTimeElement.setAttribute('class','time-remoteuser');
										if(historyMessages[i].desc != '') {
											desc.setAttribute('class','desc-img-user');
											desc.innerHTML = historyMessages[i].desc;
										}
										var senderName = document.createElement('div');
										senderName.setAttribute('class','name-group-user');
										senderName.innerHTML = historyMessages[i].sender;
										document.getElementById('text-box-group').appendChild(newele);
										document.getElementById(time).appendChild(video);
										document.getElementById(time).appendChild(desc);
										document.getElementById(time).appendChild(senderName);
										document.getElementById(time).appendChild(newTimeElement);
									}
								}
							}
							var objDiv = document.getElementById("text-box-group");
							objDiv.scrollTop = objDiv.scrollHeight - scrollheight;
						}
					} else {
						document.getElementById('text-box-group').setAttribute('class','loader');
					}
				};
				xhttp.open("POST", "chatgrouphistoryembertwo", true);
				xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhttp.send("groupName=" + this.get('currentGroupName') + "&limit=" + this.get('limits'));
				this.set('limits', this.get('limits') + 5);
				//console.log(this.get('limits'));
			}
		},
		
		addNewUser : function() {
			this.send('cancelAddUsers');
			document.getElementById('temp').style.display = "block";
			document.getElementById('temp1').style.display = "block";
			document.getElementById('temp').innerHTML = "click to add user";
			var s = this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var newnames = (this.responseText).split(',');
					if((newnames.length) == 1) {
							document.getElementById('temp').innerHTML = "All were added!";
					} else {
						for (var i = 0; i < newnames.length - 1; i++) {
							s.get('addnNewUserList').pushObject(newnames[i]);
						}	
					}
				} 	
			};
			xhttp.open("POST", "addusergroupember", true);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send("groupName=" + s.get('currentGroupName') + "&username=" + s.get('name'));
		},
		
		deleteGroup:function() {
		var result = confirm("Are you Sure to Delete " + this.get('currentGroupName') + " ?");
			var s = this;
			if(result == true) {
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						s.get('router').transitionTo('chat');
					} 	
				};
				xhttp.open("POST", "deletegroupember", true);
				xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhttp.send("groupname=" + s.get('currentGroupName') + "&username=" + s.get('name'));
			}	
		},
		
		cancelAddUsers:function() {
			if(document.getElementById('temp') != null) {
				document.getElementById('temp').style.display = "none";
				document.getElementById('temp1').style.display = "none";
			}
			if(this.get('addnNewUserList').length > 0) {
				this.get('addnNewUserList').removeAt(0,this.get('addnNewUserList').length);
			}
			/*if(this.get('removeUserList').length > 0) {
				this.get('removeUserList').removeAt(0,this.get('removeUserList').length);
			}*/
			if(this.get('makeAdminList').length > 0) {
				this.get('makeAdminList').removeAt(0,this.get('makeAdminList').length);
			}
		},
		
		confirmAddUser: function(newUserName) {
			var result = confirm("Are you Sure to add " + newUserName + " ?");
			var s = this;
			if(result == true) {
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						if(this.responseText.toString().trim() == 'success') {
							s.get('addnNewUserList').removeObject(newUserName);
							s.send('loadGroupMembers',s.get('currentGroupName'));
							if(s.get('addnNewUserList').length == 0) {
								document.getElementById('temp').innerHTML = "All were added!";
							}
						}
					} 	
				};
				xhttp.open("POST", "confirmaddgroupuserember", true);
				xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhttp.send("groupName=" + s.get('currentGroupName') + "&newUserName=" + newUserName);
			}	 
		},
	
		/*removeUser : function(userName) {
			this.send('cancelAddUsers');
			document.getElementById('temp').style.display = "block";
			document.getElementById('temp1').style.display = "block";
			document.getElementById('temp').innerHTML = "click to remove user";
			for(var i = 0;i < this.get('groupMembersList').length;i++) {
				this.get('removeUserList').pushObject(this.get('groupMembersList').objectAt(i));
			}
		},
		confirmRemoveUser:function(userName) {
			var result = confirm("Are you Sure to Remove " + userName + " from " + this.get('currentGroupName') + " ? ");
			var s = this;
			if(result == true) {
				var tempName = userName.split('-');
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					if(this.responseText.toString().trim() == 'success') {
						s.get('removeUserList').removeObject(userName);
						s.get('groupMembersList').removeObject(userName);
						if(s.get('removeUserList').length == 0) {
							document.getElementById('temp').innerHTML = "All were deleted!";
						}
					}
				} 	
			};
			xhttp.open("POST", "confirmremovegroupuserember", true);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send("groupName=" + s.get('currentGroupName') + "&userName=" + tempName[0]);
			} 
		},*/
		
		removeDemo : function(userName) {
			var result = confirm("Are you Sure to Remove " + userName + " from " + this.get('currentGroupName') + " ? ");
			var s = this;
			if(result == true) {
				var tempName = userName.split('-');
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					if(this.responseText.toString().trim() == 'success') {
						//s.get('removeUserList').removeObject(userName);
						s.get('groupMembersList').removeObject(userName);
						document.getElementById(tempName[0]).style.display = "none";
						if(s.get('groupMembersList').length == 0) {
							document.getElementById('temp').innerHTML = "All were deleted!";
						}
					}
				} 	
			};
			xhttp.open("POST", "confirmremovegroupuserember", true);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send("groupName=" + s.get('currentGroupName') + "&userName=" + tempName[0]);
			}
		},
		
		makeAdmin:function() {
			this.send('cancelAddUsers');
			document.getElementById('temp').style.display = "block";
			document.getElementById('temp1').style.display = "block";
			document.getElementById('temp').innerHTML = "click to make admin";
			var s =this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var newnames = (this.responseText).split(',');
					if((newnames.length) == 1) {
							document.getElementById('temp').innerHTML = "All are admin";
					} else {
						for (var i = 0; i < newnames.length - 1; i++) {
							s.get('makeAdminList').pushObject(newnames[i]);
						}	
					}
				} 	
			};
			xhttp.open("POST", "makeuseradmin", true);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send("groupName=" + s.get('currentGroupName') + "&username=" + s.get('name'));
		},
	
		confirmMakeAdmin: function(userName) {
			var result = confirm("Are you Sure to Make " + userName + " Admin for " + this.get('currentGroupName') + " ? ");
			var s = this;
			if(result == true) {
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					if(this.responseText.toString().trim() == 'success') {
						s.get('makeAdminList').removeObject(userName);
						s.send('loadGroupMembers',s.get('currentGroupName'));
						if(s.get('makeAdminList').length == 0) {
							document.getElementById('temp').innerHTML = "All are Admin";
						}
					}
				} 	
			};
			xhttp.open("POST", "confirmmakeuseradminember", true);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send("groupName=" + s.get('currentGroupName') + "&userName=" + userName);
			}
		},
	
		loadIsAdmin: function(groupName,nameOfUser){
			this.set(name,nameOfUser);
			var s = this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var result = this.responseText;
					if(result.toString().trim() == 't') {
						s.set('isAdmin',true);
						document.getElementById('adduser').style.display = "block";
						document.getElementById('admin').innerHTML = "(ADMIN)";
						document.getElementById('makeadmin').style.display = "block";
						document.getElementById('deletegroup').style.display = "block";
					} else {
						s.set('isAdmin',false);
						document.getElementById('admin').innerHTML = "";
						document.getElementById('adduser').style.display = "none";
						document.getElementById('makeadmin').style.display = "none";
						document.getElementById('deletegroup').style.display = "none";
					}
				} 	
			};
			xhttp.open("POST", "isadminember", true);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send("groupName=" + groupName + "&username=" + nameOfUser);			
		},
		loadGroupMembers : function(groupNameTemp) {
			if(this.get('groupMembersList').length > 0) {
				this.get('groupMembersList').removeAt(0,this.get('groupMembersList').length);
			}
			var s = this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var mems = (this.responseText).split('-');
					for (var i = 0; i < mems.length - 1; i++) {
						var nameAndAdmin = mems[i].split(':');
						if(nameAndAdmin[0] != s.get('name')) {
							if(nameAndAdmin[1] == 't') {
									s.get('groupMembersList').pushObject(nameAndAdmin[0] + '-(A)');
							} else {
									s.get('groupMembersList').pushObject(nameAndAdmin[0] + '-(U)');
							}
						}
					}
				} 	
			};
			xhttp.open("POST", "chatgroupmemberstwo", true);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send("groupName=" + groupNameTemp + "&username=" + s.get('name'));
		}
	}
});