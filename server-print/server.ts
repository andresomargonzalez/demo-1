/**
 * Created by Omar on 4/5/16.
 */

/// <reference path="typings/express/express.d.ts" />
import express = require('express');
var app = express();
import mongoose = require('mongoose');
import bodyParser = require('body-parser');
import morgan = require('morgan')
import passport = require('passport');
import config = require('../config/main');
import User = require('../app/models/user');
import jwt = require('jsonwebtoken');
import {Router} from "../web-print/node_modules/angular2/src/router/router";
var port:number = 3001;

// use body-parser to get POST requests for API Use
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//Log requests to console
app.use(morgan('dev'));

// Initialize passport for use
app.use(passport.initialize());

//connect to db
mongoose.connect(config.database);

//bring in passport strategy we just defined
require('../config/passport')(passport);


//Create API group routes

var apiRoutes:Router = express.Router();

apiRoutes.post('/register',  function(req, res) {
  if(!req.body.email || !req.body.password) {
    res.json({success: false, message: 'Please enter an email and password to register.'});
  }else{
    var newUser = new User({
      email: req.body.email,
      password: req.body.password
    });

    //Attempt to save the new users
    newUser.save(function(err) {
      if(err){
        return res.json({success: false, message: 'That email address already exists.'});
      }
      res.json({success: true, message: 'Successfully created new user.'});
    });
  }
});

// Authenticate the user and get a JWT
apiRoutes.post('/authenticate',  function(req, res) {
  User.findOne({
    email: req.body.email
  },
    function(err, user) {
      if(err) throw  err;

      if(!user){
        res.send({success: false,  message: 'Authentication failed. User not found.'});
      }else {
        // Check if the password matches
        user.comparePassword(req.body.password, function(err, isMatch) {
          if(isMatch && !err) {
            // Create the jwt token
            var token = jwt.sign(user, config.secret, {
              expiresIn: 10080 // in seconds
            });
            res.json({ success: true, token: 'JWT '+ token });
          }else{
            res.send({ success: false, message: 'Authentication failed. Passwords did not match.' });
          }
        });
      }
    }
  )

});


// Protect dashboard route with JWT
apiRoutes.get('/dashboard', passport.authenticate('jwt', { session: false }), function(req, res) {
  res.send('It worked! User id is: ' + req.user.email + '.');
});

// Set url for API group routes
app.use('/api',apiRoutes);

// Home route
app.get('/', function(req,res) {
  res.send("Tranqui ya tenes un server arriba");
});

app.listen(port);
console.log("Your server is running on port" + port + '.');
