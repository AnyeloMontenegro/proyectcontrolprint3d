const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('impresoras/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const {username, ubicacion, material, tiempo} = req.body;
    const newImpresora = {
        username,
        ubicacion,
        material,
        tiempo
    };
    await pool.query('INSERT INTO impresoras set ?', [newImpresora]);
    req.flash('success', 'Impresora ingresada correctamente.');
    res.redirect('/impresoras');
});

router.get('/', isLoggedIn, async (req, res) => {
    try {
        const impresoras = await pool.query('SELECT * FROM impresoras');
        res.render('impresoras/list', { impresoras });
    } catch (error) {
        req.flash('error', 'Error al obtener las impresoras');
        console.error(error);
        res.redirect('/impresoras');
    }
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    try {
        // Eliminar registros relacionados
        await pool.query('DELETE FROM registros WHERE impresora_id = ?', [id]);
        
        // Ahora elimina la impresora
        await pool.query('DELETE FROM impresoras WHERE ID = ?', [id]);
        req.flash('success', 'Impresora eliminada satisfactoriamente');
    } catch (error) {
        req.flash('error', 'Error al eliminar la impresora');
        console.error(error);
    }
    res.redirect('/impresoras');   
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const impresoras = await pool.query('SELECT * FROM impresoras WHERE id = ?', [id]);
    res.render('impresoras/edit', {impresora: impresoras[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const {username, ubicacion, material, tiempo} = req.body;
    const newImpresora = {
    username,
    ubicacion,
    material,
    tiempo
    };
    await pool.query('UPDATE impresoras set ? WHERE id = ?', [newImpresora, id]);
    req.flash('success', 'Impresora actualizada correctamente');
    res.redirect('/impresoras');
});

module.exports = router;