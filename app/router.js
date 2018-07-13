import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('chat');
  this.route('login');
  this.route('group');
  this.route('error');
  this.route('userchart');
  this.route('graphgen');
});

export default Router;
