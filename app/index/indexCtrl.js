(function () {
  'use strict';


  angular.module('dhn.controllers')
    .controller('indexCtrl', [
      '$scope', function($scope){

        console.log('indexCtrl');

        ids.widgets.login.render({elementId: 'test'});


      }]);
}());