import Controller from '@ember/controller';
import {inject} from '@ember/service'


export default Controller.extend({
username: null,
router: inject(),
 actions: {
    sendButton: function() {
		var name = this.get('username');
		var pass = this.get('password');
		var xhttp = new XMLHttpRequest();
		localStorage.setItem("name",name);
		var rout = this.get('router');
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var val = this.responseText;
				if(val.toString().trim() === 'success') {
					localStorage.setItem("name",name);
					rout.transitionTo('chat');
				} 	
			} 
		};
		xhttp.open("POST", "chatloginember", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send("username=" + name + "&password=" + pass);
    }
 }
});