var express = require('express');
var router = express.Router();

module.exports = function(dbUtils){

  var handleError = function(res, error) {
    res.json({status: 'failed', error: error});
  };

  function getAll(req, res) {
    var collection = req.params.collection;
    var model = dbUtils.getModel(collection);
    console.log('getAll(), collection: %s', collection);
    if (model) {
      model.find('-password', function (err, data) {
        if (err) { return handleError(res, err); }
        res.json(data);
      });
    } else {
      res.json({});
    }
  }

  function getOne(req, res) {
    var collection = req.params.collection;
    var id = req.params.id;
    var model = dbUtils.getModel(collection);
    console.log('getOne(), collection: %s | id: %s', collection, id);
    if (model) {
      model.findById(id, function(err, data) {
        if (err) { return handleError(res, err); }
        res.json(data);
      });
    } else {
      res.json({});
    }
  }

  function getOneWithSelect(req, res) {
    var collection = req.params.collection;
    var id = req.params.id;
    var model = dbUtils.getModel(collection);
    var select = req.params.select.replace(/\./g, ' ');
    console.log('getOneWithSelect(), collection: %s | id: %s | select: %s', collection, id, select);
    if (model) {
      model.findById(id).select(select).exec(function(err, data) {
        if (err) { return handleError(res, err); }
        res.json(data);
      });
    } else {
      res.json({});
    }
  }

  function deleteOne(req, res) {
    var collection = req.params.collection;
    var id = req.params.id;
    var model = dbUtils.getModel(collection);
    console.log('delete(), collection: %s | id: %s', collection, id);
    if (model) {
      model.findByIdAndRemove(id, function(err, data) {
        if (err) { return handleError(res, err); }
        res.json(data);
      });
    } else {
      res.json({});
    }
  }

  function add(req, res) {
    var collection = req.params.collection;
    var model = dbUtils.getModel(collection);
    var item = req.body;
    console.log('add(), collection: %s | item: %s', collection, JSON.stringify(item));
    if (model) {
      model.create(item, function(err, data) {
        if (err) { return handleError(res, err); }
        return res.json({status: 'success', data: data});
      });
    } else {
      return handleError(res, 'Model not found.');
    }
  }

  function update(req, res) {
    var collection = req.params.collection;
    var id = req.params.id;
    var model = dbUtils.getModel(collection);
    var item = req.body;
    console.log('update(), collection: %s | id: %s | item: %s', collection, id, JSON.stringify(item));
    if (model) {
      model.findOneAndUpdate({'_id': id}, item, function(err, data) {
        if (err) { return handleError(res, err); }
        res.json(data);
      });
    } else {
      res.json({});
    }
  }

  router.get('/:collection', getAll);
  router.get('/:collection/:id', getOne);
  router.get('/:collection/:id/:select', getOneWithSelect);
  router.delete('/:collection/:id', deleteOne);
  router.post('/:collection', add);
  router.put('/:collection/:id', update);

  return router;
};