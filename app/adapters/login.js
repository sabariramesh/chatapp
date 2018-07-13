import DS from '@ember/ember-data'
export default DS.RESTAdapter.extend({
  host: 'localhost:8080/chatloginember'
});