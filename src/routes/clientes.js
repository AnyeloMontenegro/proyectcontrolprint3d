const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('clientes/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const {RUT, nombre, email} = req.body;
    const newCliente = {
        RUT,
        nombre,
        email
    };
    try {
    await pool.query('INSERT INTO clientes set ?', [newCliente]);
    req.flash('success', 'Cliente ingresado correctamente.');
    }catch (error) {
         // Manejar el error y enviar un mensaje
         req.flash('message', 'Error al ingresar el cliente');
    }
    res.redirect('/clientes/add');
});

router.get('/', isLoggedIn, async (req, res) =>{
    const clientes = await pool.query('SELECT * FROM clientes');
    res.render('clientes/list', { clientes });
});

router.get('/delete/:RUT', isLoggedIn, async (req, res) =>{
    const { RUT } = req.params;
    await pool.query('DELETE FROM clientes WHERE RUT = ?', [RUT]);
    req.flash('success', 'Cliente eliminado satisfactoriamente');
    res.redirect('/clientes');   
});

router.get('/edit/:RUT', isLoggedIn, async (req, res) => {
    const { RUT } = req.params;
    const clientes = await pool.query('SELECT * FROM clientes WHERE RUT = ?', [RUT]);
    res.render('clientes/edit', {cliente: clientes[0]});
});

router.post('/edit/:RUT', isLoggedIn, async (req, res) => {
    const {RUT} = req.params;
    const {nombre, email} = req.body;
    const newCliente= {
    nombre,
    email
    };
    await pool.query('UPDATE clientes set ? WHERE RUT = ?', [newCliente, RUT]);
    req.flash('success', 'Cliente actualizado correctamente');
    res.redirect('/clientes');
});

module.exports = router;