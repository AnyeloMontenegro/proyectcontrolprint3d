const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, async (req, res) => {
    try {
        const impresoras = await pool.query('SELECT id, username FROM impresoras');
        res.render('mantenciones/add', { impresoras });
    } catch (error) {
        req.flash('error', 'Error al obtener las impresoras');
        console.error(error);
        res.redirect('/mantenciones');
    }
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { impresora_id, description } = req.body;  // Solo recogemos impresora_id y description
    const newMantencion = {
        impresora_id,   // ID de la impresora seleccionada
        description     // Descripción de la mantención ingresada por el usuario
    };
    
    try {
        await pool.query('INSERT INTO mantenciones SET ?', [newMantencion]);
        req.flash('success', 'Mantención ingresada correctamente');
        res.redirect('/mantenciones');
    } catch (error) {
        req.flash('error', 'Error al ingresar la mantención');
        console.error(error);
        res.redirect('/mantenciones');
    }
});

router.get('/', isLoggedIn, async (req, res) => {
    const { filtro } = req.query; // Obtener el valor del filtro de la query

    let query = `
        SELECT m.*, i.username 
        FROM mantenciones m
        JOIN impresoras i ON m.impresora_id = i.id
    `;

    // Si hay un filtro, agregar la cláusula WHERE
    if (filtro) {
        query += ` WHERE i.username LIKE ?`;
    }

    try {
        const mantenciones = await pool.query(query, [`%${filtro}%`]); // Usar un wildcard para buscar por coincidencias
        res.render('mantenciones/list', { mantenciones, filtro });
    } catch (error) {
        req.flash('error', 'Error al obtener las mantenciones');
        console.error(error);
        res.redirect('/mantenciones');
    }
});

router.get('/delete/:id', isLoggedIn, async (req, res) =>{
    const { id } = req.params;
    await pool.query('DELETE FROM mantenciones WHERE ID = ?', [id]);
    req.flash('success', 'Mantención eliminada');
    res.redirect('/mantenciones');   
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const mantenciones = await pool.query('SELECT * FROM mantenciones WHERE id = ?', [id]);
    res.render('mantenciones/edit', {mantencion: mantenciones[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const {description} = req.body;
    const newMantencion = {
    description
    };
    await pool.query('UPDATE mantenciones set ? WHERE id = ?', [newMantencion, id]);
    req.flash('success', 'Mantención actualizada');
    res.redirect('/mantenciones');
});

module.exports = router;