const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('mantenciones/add');
});

//PRUEBA DE FILTRO

router.get('/mantenciones', async (req, res) => {
    const { filtro } = req.query;  // Obtener el valor del filtro de la query string
    let query = {};

    // Si hay un filtro, buscar en el nombre o la descripción de la impresora
    if (filtro) {
        query = {
            $or: [
                { nombre_impresora: { $regex: filtro, $options: 'i' } },  // 'i' es para case-insensitive
            ]
        };
    }

    try {
        // Buscar impresoras en la base de datos
        const mantenciones = await Mantencion.find(query).lean();

        // Renderizar la vista con las impresoras y el filtro
        res.render('mantenciones/list', { mantenciones, filtro });
    } catch (error) {
        res.status(500).send('Error al obtener impresoras');
    }
});

//FIN DE PRUEBA FILTRO

router.post('/add', isLoggedIn, async (req, res) => {
    const {nombre_impresora, description} = req.body;
    const newMantencion = {
        nombre_impresora,
        description
    };
    await pool.query('INSERT INTO mantenciones set ?', [newMantencion]);
    req.flash('success', 'Mantención ingresada correctamente')
    res.redirect('/mantenciones');
});

router.get('/', isLoggedIn, async (req, res) =>{
    const mantenciones = await pool.query('SELECT * FROM mantenciones');
    res.render('mantenciones/list', { mantenciones });
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
    const {nombre_impresora, description} = req.body;
    const newMantencion = {
    nombre_impresora,
    description
    };
    await pool.query('UPDATE mantenciones set ? WHERE id = ?', [newMantencion, id]);
    req.flash('success', 'Mantención actualizada');
    res.redirect('/mantenciones');
});

module.exports = router;