import { pool } from './connection.js'

export class Usuario {
    constructor() {
      this.id ;
      this.foto ;
      this.nombre ;
      this.apellido ;
      this.email ;
      this.password;
      this.rut ;
      this.numero_telefonico ;
      this.direccion ;
      this.region ;
      this.comuna ;
      this.saldo ;
    }
    async newuser(nombre,email,password){
        try {
            await pool.query(`INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3)`, [ nombre, email,  password]);
            console.log("funciono");
        } catch (error) {
            console.log(error);
        }
    }
    async getuser(email,password){
        try {
            console.log(email,password);
            const selectUser = await pool.query(`SELECT * FROM usuarios WHERE email = $1 AND password = $2`, [email, password]);
            return selectUser.rows;
        } catch (error) {
            console.log(error);
            
        }
    }
    async getuserid(id){
        try {
            const selectUser = await pool.query(`SELECT * FROM usuarios WHERE id = $1`, [id]);
            return selectUser.rows;
        } catch (error) {
            console.log(error);
            
        }
    }
    async actualizarUsuario(id,nombre,apellido,email,rut,numero,direccion,region,comuna){
        console.log(id,nombre,apellido,email,rut,numero,direccion,region,comuna);
        try {
            await pool.query(
                'UPDATE usuarios SET nombre=$1, apellido=$2, email=$3, rut=$4, numero_telefonico=$5, direccion=$6, region=$7, comuna=$8 WHERE id=$9',
                [nombre, apellido, email, rut, numero, direccion, region, comuna, id]
              );            
              console.log("funciono");
        } catch (error) {
            console.log("update         ",error);
        }

        
    }
    async eliminarUser(id){
        try {
            await pool.query(`DELETE FROM "usuarios" WHERE "id"=$1`,[id]);
        } catch (error) {
           console.log(error); 
        }
    }
    async selecttransferencias(){
        try {
            const transf = await pool.query(`select id, nombre from usuarios`);
            return transf.rows
            
        } catch (error) {
           console.log(error); 
        }
    }
    async transferirenciaUser(idcuenta,iddestino,monto,comentario){
        console.log(typeof monto);
        monto = parseInt(monto);
        try {
            // Inicia una transacción en la base de datos
            await pool.query('BEGIN');
          
            // Obtiene los saldos actuales de las cuentas
            const saldoCuenta1 = await pool.query('SELECT saldo FROM usuarios WHERE id = $1', [idcuenta]);
            const saldoCuenta2 = await pool.query('SELECT saldo FROM usuarios WHERE id = $1', [iddestino]);
          
            const saldoCuenta1Actual = saldoCuenta1.rows[0].saldo;
            const saldoCuenta2Actual = saldoCuenta2.rows[0].saldo;
            console.log(typeof saldoCuenta2Actual);
            // Realiza la transferencia si el saldo de la cuenta 1 es suficiente

            if (saldoCuenta1Actual >= monto) {
              const saldoCuenta1Nuevo = saldoCuenta1Actual - monto;
              const saldoCuenta2Nuevo = saldoCuenta2Actual + monto;
          
              // Actualiza los saldos en las cuentas
              await pool.query('UPDATE usuarios SET saldo = $1 WHERE id = $2', [saldoCuenta1Nuevo, idcuenta]);
              await pool.query('UPDATE usuarios SET saldo = $1 WHERE id = $2', [saldoCuenta2Nuevo, iddestino]);
              // guardar transaccion
            //   await pool.query('UPDATE usuarios SET saldo = $1 WHERE id = $2', [saldoCuenta2Nuevo, iddestino]);
              
          
              // Confirma la transacción
              await pool.query('COMMIT');
          
              console.log('Transferencia exitosa');
            } else {
              // Si el saldo no es suficiente, revierte la transacción
              await pool.query('ROLLBACK');
          
              console.log('Saldo insuficiente');
            }
          } catch (error) {
            // Si ocurre algún error, revierte la transacción
            await pool.query('ROLLBACK');
          
            console.error('Error en la transferencia', error);
          } 
        
        
    }
  }