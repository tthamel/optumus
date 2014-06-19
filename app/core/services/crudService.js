/**
 * Service for handling CRUD operations in a RESTful way
 * @module ids.CrudService
 * @class ids.CrudService
 **/
(function(){
  'use strict';
  angular.module('hackathon.services').
    factory('crudService', ['$http', function($http) {

      var crudService = {};
      var apiUrl = '/api/';

      var getUrl = function(collection, id) {
        return id ? apiUrl + collection + '/' + id : apiUrl + collection;
      };

      var get = function(collection, id, callback) {
        $http.get(getUrl(collection, id)).
          success(function(data, status, headers, config) {
            callback(data);
          }).
          error(function(data, status, headers, config) {
            callback({});
          });
      };

      crudService.getAll = function(collection, callback) {
        get(collection, false, callback);
      };

      crudService.getOne = function(collection, id, callback) {
        get(collection, id, callback);
      };

      crudService.getOneWithSelect = function(collection, id, select, callback) {
        // todo: I'll have to replace ' ' with '.' to feed the get request
        $http.get(getUrl(collection, id) + '/' + select).
          success(function(data, status, headers, config) {
            callback(data);
          }).
          error(function(data, status, headers, config) {
            callback({});
          });
      };

      crudService.add = function(collection, item, callback) {
        $http.post(getUrl(collection), item).
          success(function(data, status, headers, config) {
            callback(data);
          }).
          error(function(data, status, headers, config) {
            callback({});
          });
      };

      crudService.delete = function(collection, id, callback) {
        $http.delete(getUrl(collection, id)).
          success(function(data, status, headers, config) {
            callback(data);
          }).
          error(function(data, status, headers, config) {
            callback({});
          });
      };

      crudService.update = function(collection, id, item, callback) {
        $http.put(getUrl(collection, id), item).
          success(function(data, status, headers, config) {
            callback(data);
          }).
          error(function(data, status, headers, config) {
            callback({});
          });
      };

      return crudService;
    }]);
})();