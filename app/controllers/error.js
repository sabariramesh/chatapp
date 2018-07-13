import Controller from '@ember/controller';
import {inject} from '@ember/service'

export default Controller.extend({
	router: inject(),
	actions: {
			back: function() {
				localStorage.removeItem('currentPerson');
				this.get('router').transitionTo('chat');
			}
	}
	
});
