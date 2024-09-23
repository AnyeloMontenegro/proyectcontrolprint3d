CREATE DATABASE  proyecto_titulo;

USE proyecto_titulo;

--TABLA DE USUARIOS
CREATE TABLE users(
    id INT(11) NOT NULL,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    email VARCHAR(60) NOT NULL
);

ALTER TABLE users ADD PRIMARY KEY(id);

ALTER TABLE users MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE users;

--TABLA DE IMPRESORAS
CREATE TABLE impresoras(
    id INT(11) NOT NULL,
    username VARCHAR(50) NOT NULL,
    ubicacion INT(11),
    user_id INT(11),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE impresoras ADD PRIMARY KEY(id);

ALTER TABLE impresoras MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE impresoras;

ALTER TABLE impresoras ADD tiempo INT(11);

ALTER TABLE impresoras ADD material INT(11);

--TABLA DE MANTENCIONES
CREATE TABLE mantenciones(
    id INT(11) NOT NULL,
    description TEXT,
    impresora_id INT(11),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_impresora FOREIGN KEY (impresora_id) REFERENCES impresoras(id)
);

ALTER TABLE mantenciones ADD PRIMARY KEY(id);

ALTER TABLE mantenciones MODIFY id INT(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE mantenciones ADD nombre_impresora VARCHAR(50) NOT NULL;

--TABLA DE CLIENTES
CREATE TABLE clientes(
    RUT INT(11) PRIMARY KEY,
    nombre VARCHAR(16) NOT NULL,
    email VARCHAR(60) NOT NULL UNIQUE
);

ALTER TABLE clientes MODIFY nombre VARCHAR(25) NOT NULL;

ALTER TABLE clientes MODIFY nombre VARCHAR(30) NOT NULL;

ALTER TABLE clientes MODIFY nombre VARCHAR(35) NOT NULL;

ALTER TABLE clientes MODIFY COLUMN RUT VARCHAR(12);
