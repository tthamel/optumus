angular.module('hackathon.services', []);
angular.module('hackathon.directives', []);
angular.module('hackathon.providers', []);
angular.module('hackathon.controllers', ['hackathon.providers', 'hackathon.services', 'jmdobry.angular-cache']);
angular.module('hackathon', ['hackathon.routes', 'hackathon.controllers', 'hackathon.services']);