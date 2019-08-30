module.exports = app => {
    const Expense = require('../models/Expense.js');
    const passport = require('passport');
    require('../services/passport')(passport);

    getToken = function (headers) {
        if (headers && headers.authorization) {
          var parted = headers.authorization.split(' ');
          if (parted.length === 2) {
            return parted[1];
          } else {
            return null;
          }
        } else {
          return null;
        }
    };

    

    /* GET ALL BOOKS */
    app.get('/api/expense', passport.authenticate('jwt', { session: false}), function(req, res) {
        var token = getToken(req.headers);
        if (token) {
          Expense.find(function (err, expenses) {
            if (err) return next(err);
            res.json(expenses);
          });
        } else {
          return res.status(403).send({success: false, msg: 'Unauthorized.'});
        }
    });

    /* Find One Expense */
    app.get('/api/expense/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
      var token = getToken(req.headers);
      if (token) {
        Expense.findById({_id: req.body.id}, function (err, expenses) {
          if (err) return next(err);
          res.json(expenses);
        });
      } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
      }
  });

  app.delete('/api/expense/', passport.authenticate('jwt', { session: false}), function(req, res, next) {
    var token = getToken(req.headers);
    // console.log({req})
    Expense.findByIdAndRemove(req.body.id, (err, expense) => {
      // As always, handle any potential errors:
      if (err) return res.status(500).send(err);
      // We'll create a simple object to send back with a message and the id of the document that was removed
      // You can really do this however you want, though.
      const response = {
          message: "Todo successfully deleted",
          id: expense._id
      };
      return res.status(200).send(response);
    });
  });
    
    /* CREATE BOOK */
    app.post('/api/expense', passport.authenticate('jwt', { session: false}), function(req, res) {
      // console.log({req})
        var token = getToken(req.headers);
        if (token) {
          Expense.create(req.body, function (err, post) {
            if (err) return next(err);
            res.json(post);
          });
        } else {
          return res.status(403).send({success: false, msg: 'Unauthorized.'});
        }
      });


    app.put('/api/expense', passport.authenticate('jwt', { session: false}), function(req, res) {
      console.log('body', req.body)
      const { title, author, cost, id } = req.body;
        var token = getToken(req.headers);
        if (token) {
          Expense.findOneAndUpdate({_id: id}, {$set:{title: title, author: author, cost: cost }}, function (err, post) {
            if (err) return next(err);
            res.json(post);
          });
        } else {
          return res.status(403).send({success: false, msg: 'Unauthorized.'});
        }
      });
};
