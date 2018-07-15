const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//express-validator
const {check, validationResult} = require('express-validator/check');

// Register Form

router.get('/register', function (req, res) {
    res.render('register', {
        title: 'Register'
    });
});

//Login Form
router.get('/login', function (req, res) {
    res.render('login', {
        title: 'Login'
    });
});

//Login process
//TODO: Need to check null(username/password)

/*
router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});
*/



router.post('/login', function (req, res) {
    console.log('login');
    let user =  {
        username: req.body.username,
        password : req.body.password
    };

    console.log('login')

    req.getConnection((err, con)=>{
        if(err) throw console.log(err);
        query = 'select * from user where username = ? and password = ?' ;
        con.query(query, [user.username, user.password],
            (err, rows)=>{
                if(err) throw console.log(err);
                if(rows.length > 0){
                    console.log('login success');
                    console.log(rows[0].username + rows[0].password);

                    res.send('login')

                } else {
                    res.send('login_fail');
                }

            }
        );
    })

});


router.post('/uploadImage', function (req, res) {


    let image =  {
        url: req.body.imageUrl,
    };
    req.getConnection((err, con)=>{
        console.log('upload Image'+ req.body.imageUrl);
        if(err) throw console.log(err);
        query = 'insert into photography(url) values (?)';
        con.query(query, [image.url], (err, result)=>{
          if(err) throw console.log(err);
          console.log('insert urL ' + image.url + 'success');
        })
    })
    res.send('update okay.');

});

router.get('/getPhotographyUrl', (req, res)=>{
    let photos = new Array();
    req.getConnection((err, con)=>{
        if(err) throw console.log(err);
        query = 'select * from photography order by photo_id desc';
        con.query(query, (err, rows, field)=>{
           if(err) console.log(err);
           console.log(rows[0].url);
           photos.push({'id': '1', 'url': rows[0].url});
           console.log(photos);
           res.send(photos);
        });
    });

});

router.post('/register', function (req, res) {
    newUser.name = req.body.name;
    newUser.username = req.body.username;
    newUser.email = req.body.email;
    newUser.password = req.body.password;
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) {
                console.log(err);
            } else {
                newUser.password = hash;
                console.log('Hash pwd: ' + newUser.password);
                console.log('DATA: ' + newUser)
                // newUser.save(function (err) {
                //     if (err) {
                //         console.log(err)
                //     } else {
                //         console.log('submitted: ' + newUser.username);
                //         req.flash('success', 'Welcome to my website <3');
                //         res.render('users/register', {
                //             title: 'Register'
                //         });
                //     }
                // })
                req.flash('success', 'register successful');
                res.render('register', {
                    title: 'Register'
                });
            }
        });
    });
});

router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register'
    })
});

router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
});

router.get('/test', (req, res)=>{

    res.render('test');
});

router.get('/admin', (req, res)=>{

    console.log('redirect admin');

    res.render('admin');
});


module.exports = router;