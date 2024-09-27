const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, async (req, res) => {
    try {
        const impresoras = await pool.query('SELECT id, username FROM impresoras');
        res.render('registros/add', { impresoras });
    } catch (error) {
        req.flash('error', 'Error al obtener las impresoras');
        console.error(error);
        res.redirect('/registros');
    }
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { impresora_id, material, tiempo } = req.body;  
    const newRegistro = {
        impresora_id,   
        material,
        tiempo   
    };
    
    try {
        // Inserta el nuevo registro
        await pool.query('INSERT INTO registros SET ?', [newRegistro]);

        // Actualiza la impresora correspondiente
        await pool.query(`
            UPDATE impresoras 
            SET material = material + ?, tiempo = tiempo + ? 
            WHERE id = ?
        `, [material, tiempo, impresora_id]);

        req.flash('success', 'Registro ingresado correctamente');
        res.redirect('/registros');
    } catch (error) {
        req.flash('error', 'Error al ingresar el registro');
        console.error(error);
        res.redirect('/registros');
    }
});

//FILTRO
router.get('/', isLoggedIn, async (req, res) => {
    const { filtro } = req.query; // Obtener el valor del filtro de la query

    let query = `
        SELECT m.*, i.username 
        FROM registros m
        JOIN impresoras i ON m.impresora_id = i.id
    `;

    // Si hay un filtro, agregar la cláusula WHERE
    if (filtro) {
        query += ` WHERE i.username LIKE ?`;
    }

    try {
        const registros = await pool.query(query, [`%${filtro}%`]); // Usar un wildcard para buscar por coincidencias
        res.render('registros/list', { registros, filtro });
    } catch (error) {
        req.flash('error', 'Error al obtener los registros');
        console.error(error);
        res.redirect('/registros');
    }
});

router.get('/delete/:id', isLoggedIn, async (req, res) =>{
    const { id } = req.params;
    await pool.query('DELETE FROM registros WHERE ID = ?', [id]);
    req.flash('success', 'Registro eliminado');
    res.redirect('/registros');   
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const registros = await pool.query('SELECT * FROM registros WHERE id = ?', [id]);
    res.render('registros/edit', {registro: registros[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const {material, tiempo} = req.body;
    const newRegistro = {
    material,
    tiempo
    };
    await pool.query('UPDATE registros set ? WHERE id = ?', [newRegistro, id]);
    req.flash('success', 'Registro actualizado');
    res.redirect('/registros');
});

module.exports = router;