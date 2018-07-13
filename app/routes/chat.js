import Route from '@ember/routing/route';

export default Route.extend({
	setupController(controller) {
		this._super(...arguments);
		var temp = localStorage.getItem('temp');
		this.controllerFor('chat').send('loadUsers');
		this.controllerFor('chat').send('loadGroupNames');
		controller.set('currname0','');
		controller.set('currname1','');
		controller.set('currname2','');
		/*if(temp != null || temp != undefined) {
			controller.set('currname',localStorage.getItem('temp'));
			localStorage.removeItem('temp');
			//console.log('first part');
			this.controllerFor('chat').send('loadHistoryMessages',temp);
			//this.controllerFor('chat').send('loadOnlineUser');
		} else if(localStorage.getItem('currentPerson') != null) {
			//console.log('II part');
			controller.set('currname',localStorage.getItem('currentPerson'));
			this.controllerFor('chat').send('loadHistoryMessages',localStorage.getItem('currentPerson'));
			localStorage.removeItem('currentPerson');					
		} else {
			var t = controller.get('currname0');
			if(t != ''){
				this.controllerFor('chat').send('loadHistoryMessages',controller.get('currname'));
			}
		}*/
	}
});
