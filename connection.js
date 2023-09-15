import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    database: 'fidelisbank',
    password: '199899Sep#',
    port: 5432
});

pool.connect();

export { pool };
// TABLA USUARIOS
// CREATE TABLE usuarios (
//     id serial PRIMARY KEY,
//     foto VARCHAR(50),
//     nombre VARCHAR(30),
//     apellido VARCHAR(30),
//     email VARCHAR(30),
//     password VARCHAR(30) NOT NULL,
//     rut VARCHAR(11),
//     numero_telefonico VARCHAR(15),
//     direccion VARCHAR(40),
//     region VARCHAR(47),
//     comuna VARCHAR(22),
//     saldo integer 
// );
// USUARIOS DE PRUEBA
// INSERT INTO usuarios (foto, nombre, apellido, email, password, rut, numero_telefonico, direccion, region, comuna, saldo)
// VALUES
//     ('img/avatars/5.png', 'Juan', 'Pérez', 'juan@example.com','123', '12345678-9', '+56912345678', 'Calle 123', 'Arica y Parinacota', 'Arica', 100000),
//     ('img/avatars/6.png', 'María', 'Gómez', 'maria@example.com','123', '98765432-1', '+56987654321', 'Avenida 456', 'Valparaíso', 'Viña del Mar', 150000),
//     ('img/avatars/7.png', 'Pedro', 'López', 'pedro@example.com','123', '11223344-5', '+56911223344', 'Calle 789', 'Región del Libertador Gral. Bernardo O`Higgins', 'Rancagua', 200000);
// TABLA TRANSACCIONES
// CREATE TABLE transacciones (
//     id serial PRIMARY KEY,
//     referencia INTEGER,
//     fecha DATE,
//     comentario VARCHAR(100),
//     monto INTEGER,
//     destinatario VARCHAR(50)
// );
