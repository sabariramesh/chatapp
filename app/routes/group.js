import Route from '@ember/routing/route';

export default Route.extend({
	setupController(controller) {
		this._super(...arguments);
		var temp = localStorage.getItem('groupName');
		var name = localStorage.getItem('name');
		if(temp != null || temp != undefined) {
			controller.set('currentGroupName',temp);
			controller.set('name',name);
			controller.set('limits',10);
			localStorage.removeItem('groupName');
			this.controllerFor('group').send('loadIsAdmin',temp,name);
			this.controllerFor('group').send('loadhistory2',temp,name);
			this.controllerFor('group').send('cancelAddUsers');
			this.controllerFor('group').send('loadGroupMembers',temp);
		}
	}
});
