var express = require('express');
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var app = express();

var PostSchema = new mongoose.Schema();
PostSchema.plugin(mongoosePaginate);
var Post = mongoose.model('Post', PostSchema);

app.get('/', function(req, res, next) {
    var term = {};
    var limit = 10;
    if(req.query.term) {
        var regex = new RegExp(req.query.term, 'i');
        term = { Title: regex, $or: [{ Snippet: regex }, { Contents: regex }] };
    }
    if(req.query.limit) {
        if(req.query.limit > 0 && req.query.limit <= 100) limit = req.query.limit;
        if(req.query.limit > 100) limit = 100;
    }
    Post.paginate(term, req.query.page, limit, function(error, pageCount, paginatedResults, itemCount) {
        if(error) return res.json(403, { error: error });
        res.json(200, {
            currentPage: req.query.page || 1,
            pages: pageCount,
            total: itemCount,
            results: paginatedResults
        });
    });
});

mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://admin:hollow@kahana.mongohq.com:10055/app26509339', function() {
   app.listen(process.env.PORT || 3000); 
});