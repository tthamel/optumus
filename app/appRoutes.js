angular.module('hackathon.routes', ['ngRoute']).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  // home page
  $routeProvider.when('/', {
    templateUrl: 'partial/index/index',
    controller: 'indexCtrl'
  });

  $routeProvider.when('/404', {
    templateUrl: 'partial/404/404'
  });

  $routeProvider.otherwise({redirectTo: '/404'});

  $locationProvider.html5Mode(true);

}]);