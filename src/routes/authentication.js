const express = require('express');
const router = express.Router();
const pool = require('../database');

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

//SIGNUP
router.get('/signup', isLoggedIn, (req, res) => {
    // Solo el administrador puede ver esta página
    if (req.user.role !== 'admin') {
        return res.render('auth/access-denied', { user: req.user }); // Renderiza una vista de acceso denegado
    }
    res.render('auth/signup');
});

router.post('/signup', isLoggedIn, (req, res, next) => {
    // Solo el administrador puede registrar nuevos usuarios
    if (req.user.role !== 'admin') {
        return res.status(403).send('No tienes permiso para realizar esta acción.');
    }

    passport.authenticate('local.signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    })(req, res, next);
});

//SIGNIN
router.get('/signin', isNotLoggedIn, (req, res) =>{
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next); 
});

router.get('/', isLoggedIn, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.render('auth/access-denied', { user: req.user });
    }

    const users = await pool.query('SELECT * FROM users');
    res.render('auth/list.hbs', { users });  // Renderiza la vista de usuarios
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
});

router.get('/logout', (req, res, next) =>{
    req.logOut((err) =>{
        if (err) {
            return next(err);
        }
        res.redirect('/signin')
    })
})

module.exports = router;