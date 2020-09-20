var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var userModel = require('../models/users');

var uid2 = require("uid2");
var SHA256 = require("crypto-js/sha256");
var encBase64 = require("crypto-js/enc-base64");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/sign-up', async function(req, res, next) {
  var salt = uid2(32);
  var result;
  var errorMessage = '';

  if ((req.body.usernameFromFront === "") || (req.body.emailFromFront === "") || (req.body.passwordFromFront === "")) {
    result = false;
    errorMessage = 'Please fill all inputs';
  } else {
    var searchUser = await userModel.findOne({email: req.body.emailFromFront});

    if (searchUser === null) {
      var newUser = new userModel(({
        username: req.body.usernameFromFront,
        email: req.body.emailFromFront,
        password: SHA256(req.body.passwordFromFront + salt).toString(encBase64),
        salt: salt,
        token: uid2(32),
        wishlist: [],
        language: 'fr'
      }));
      var userSaved = await newUser.save();
      var userToken = userSaved.token;

      result = true;
    } else {
      result = false;
      errorMessage = 'This email address is not available'
    }
  }

  res.json({result, token: userToken, errorMessage})
})

router.post('/sign-in', async function(req, res, next) {
  var result;
  var errorMessage = '';

  if (req.body.emailFromFront === "" || req.body.passwordFromFront === "") {
    result = false;
    errorMessage = 'Please fill all inputs';
  } else {
    var searchUser = await userModel.findOne({email: req.body.emailFromFront});

    if (searchUser === null) {
      result = false;
      errorMessage = 'Wrong email or password';
    } else {
      if (SHA256(req.body.passwordFromFront + searchUser.salt).toString(encBase64) === searchUser.password) {
        result = true;
        var userToken = searchUser.token;
      } else {
        result = false;
        errorMessage = 'Wrong email or password';
      }
    } 
  }

  res.json({result, token: userToken, errorMessage})
})

router.post('/wishlist', async function(req, res, next) {
  var searchUser = await userModel.findOne({token: req.body.tokenFromFront});

  if (searchUser !== null) {
    const data = {
      articleTitle: req.body.title,
      articleContent: req.body.content,
      articleDesc: req.body.description,
      articleImage: req.body.image
    };
    let wishlist = searchUser.wishlist;
    wishlist.push(data);
    
    var updateUser = await userModel.updateOne(
      {token: req.body.tokenFromFront},
      {wishlist: wishlist}
    );
  }

  var result = false;
  if (updateUser) {
    result = true;
  }

  res.json({result});
})

router.delete('/wishlist', async function(req, res, next) {
  var searchUser = await userModel.findOne({token: req.body.tokenFromFront});

  var updatedWishlist = searchUser.wishlist.filter(article => article.articleTitle !== req.body.articleTitleFromFront);

  var updateUser = await userModel.updateOne(
    {token: req.body.tokenFromFront},
    {wishlist: updatedWishlist}
  );

  var result = false;
  if (updateUser) {
    result = true;
  }

  res.json({result});
})

router.get('/wishlist', async function(req, res, next) {
  var searchUser = await userModel.findOne({token: req.query.tokenFromFront});

  var wishlist;
  if (searchUser !== null) {
    wishlist = searchUser.wishlist;
  }

  var result = false;
  if (wishlist) {
    result = true;
  }

  res.json({result, wishlist: wishlist});
})

router.post('/update-language', async function(req, res, next) {
  var updateUser = await userModel.updateOne(
    {token: req.body.tokenFromFront},
    {language: req.body.languageFromFront}
  );

  var result = false;
  if (updateUser) {
    result = true;
  }

  res.json({result});
})

router.post('/user-informations', async function(req, res, next) {
  var searchUser = await userModel.findOne({token: req.body.tokenFromFront});

  var wishlist = searchUser.wishlist;
  var language = searchUser.language;

  var result = false;
  if (wishlist) {
    result = true;
  }

  res.json({result, wishlist, language});
})

module.exports = router;
