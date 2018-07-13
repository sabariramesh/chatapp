
export function initialize( application) {
  application.inject('controller', 'websockets', 'service:websockets');
}

  export default {  
  name: 'websockets',
  initialize: initialize
}
