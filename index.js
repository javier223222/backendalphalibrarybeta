const express=require("express")


const path=require("path")
const app=express()

const mysql=require("mysql")
const cors=require("cors")
const accountSid = 'ACfc2c06172b2b7ed0ad1df3a358cdd001';
const authToken = '829798f2c7f63dda6d0299b09f8f0752'

const client = require('twilio')(accountSid, authToken);


app.use(cors())
app.use(express.json())
const db=mysql.createConnection({
    host:"databaseportafolio.ccdfxtjwuqux.us-east-2.rds.amazonaws.com",
    user:"admin",
    password:"ELTopn4590",
    database:"AlphaLibrary"
})


app.post("/login",(req,res)=>{
    
    const {email,password}=req.body
    const values=[email,password]
    db.query("SELECT * FROM Usuario WHERE email =?  AND password = ? ",values,(err,result)=>{
        if(err){
            console.log(err)
        }else{
            if(result.length>0){
                res.send(true)
            }else{
                res.send(false)
            }

        }
    })

  
})
app.post("/eliminarLibros",(req,res)=>{
    const {id}=req.body;
    const values=id

    db.query("DELETE FROM Libro WHERE id_libro=? ",values,(err,result)=>{
        if(err){
            console.log(err)
        }else{
            res.send("Libro eliminado correctamente")
        }
    })
})
app.post("/eliminarprestamo",(req,res)=>{
    const {id}=req.body
    const values=[id]
    db.query(`
        DELETE FROM Prestamo WHERE id_prestamo=? 
    `,values,(err,result)=>{
        if(err){
            console.log(err)

        }else{
            res.send("Libro eliminado correctamente")
        }
    })
})
app.post("/actualizarPrestamo",(req,res)=>{
    const {id,fecha}=req.body;
    const values=[fecha,id]
    db.query(`
    UPDATE Prestamo SET fecha_final=? WHERE id_prestamo=?
    `,values,(err,result)=>{
        if(err){
            console.log(err)
        }else{
            res.send("Prestamo actualizado")
        }
    })
})
app.post("/actualizarLibro",(req,res)=>{
    const {value,id}=req.body
    const values=[value,id]
    db.query("UPDATE Libro SET cantidad=? WHERE id_libro=?",values,(err,result)=>{
        if(err){
            console.log(err)
        }else{
            res.send("Libro actualizado correctamente")
        }
    })
})
app.get("/libros",(req,res)=>{
    db.query("select * from Libro",(err,result)=>{
        if(err){
            console.log(err)
        }else{
         res.send(result)   
        }
    })
  
});
app.post("/getcantidad",(req,res)=>{
    const {id}=req.body
    const values=[id]
    db.query(`
    SELECT cantidad 
    FROM Libro
    WHERE id_libro =?
    `,values,(err,result)=>{
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})

app.post("/idlibro",(req,res)=>{
  const {libro}=req.body
  const values=[libro]
  db.query(`
  SELECT id_libro,cantidad 
     FROM Libro
     WHERE titulo=?;
  `,values,(err,result)=>{
    if(err){
        console.log(err)
    }else{
        res.send(result)
    }
  })
    
    

  
});
app.post("/registerPrest",(req,res)=>{
    const {nombre,grado,grupo,numero_de_telefono,apellidopaterno,apellidomaterno}=req.body
    const values=[nombre,grado,grupo,numero_de_telefono,apellidopaterno,apellidomaterno]
    db.query(`
    insert into Prestatario(nombre,grado,grupo,numero_de_telefono,apellidopaterno,apellidomaterno) 
    VALUES(?,?,?,?,?,?)
    `,values,(err,res)=>{
        if(err){
            console.log(err)
        }else{
          
        }
    })
})

app.post("/idprestatario",(req,res)=>{
    const{nombre,grado,grupo,apellidopaterno,apellidomaterno}=req.body
    const values=[nombre,grado,grupo,apellidopaterno,apellidomaterno]
    db.query(`
    
    SELECT id_prestatario
    FROM Prestatario
    where nombre=? and grado=? and grupo=? and apellidopaterno=? and apellidomaterno=?
    `,values,(err,result)=>{
        if(err){
            console.log(err)
        }else{
            if(result.length>0){
               
                res.send(result)
            }else{
                res.send(false)
            }
        }
    })
})
    1
app.get("/allprestamos",(req,res)=>{
    db.query(`
    select Prestamo.id_prestamo,Libro.id_libro,Libro.titulo,Prestatario.nombre,Prestatario.apellidopaterno,Prestatario.apellidomaterno,Prestatario.grado,Prestatario.grupo,Prestatario.numero_de_telefono,Prestamo.fecha_inicio,Prestamo.fecha_final from 
    Libro
    natural join 
    Prestamo
    natural join
    Prestatario
    `,(err,result)=>{
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})
app.get("/allextraviados",(req,res)=>{
   db.query("select * from Extraviados ",(err,result)=>{
    if(err){
        console.log(err)

    }else{
        res.send(result)
    }
   })
})
app.post("/agregarPrestamo",(req,res)=>{
    const {fecha_inicio,fecha_final,id_libro,id_prestatario}=req.body
    const values=[fecha_inicio,fecha_final,id_libro,id_prestatario]
    db.query(`
    Insert into
     Prestamo(fecha_inicio,fecha_final,id_libro,id_prestatario) values (?,?,?,?)`,values,(err,result)=>{
        if(err){
            console.log(err)
        }else{
            res.send("Prestatario agregado exitosamente")
        }
    })
   

})
app.get("/titulosLibros",(req,res)=>{
    db.query(`
    SELECT titulo 
   from Libro
  where cantidad>0
    `,(err,result)=>{
        if(err){
            console.log(err)
        }else{
            res.send(result)

        }
    })
})
app.post("/saveextraviado",(req,res)=>{
    const numeroDeLibro=req.body.numeroDeLibro
    const titulo=req.body.titulo
    const editorial=req.body.editorial
    const autor=req.body.autor
    const categoria=req.body.categoria
    const cantidad=req.body.cantidad
    const isbn=req.body.isbn
    db.query('INSERT INTO  Extraviados VALUES(?,?,?,?,?,?,?)',[numeroDeLibro,titulo,editorial,autor,categoria,cantidad,isbn],
    (err,result)=>{
        if(err){
           res.send(err)
        }else{
            
            res.send("Libro agregado exitosamente")
        }
    }
    )
 
})
app.post("/deleteextraviado",(req,res)=>{
    const {id}=req.body
    const values=[id]
    db.query("DELETE FROM Extraviados WHERE id_libroextraviado=?",values,(err,result)=>{
        if(err){
            console.log(err)
        }else{
            res.send("Libro extraviado eliminado correctamente")
        }
    })
})

app.post("/create",(req,res)=>{
    const numeroDeLibro=req.body.numeroDeLibro
    const titulo=req.body.titulo
    const editorial=req.body.editorial
    const autor=req.body.autor
    const categoria=req.body.categoria
    const cantidad=req.body.cantidad
    const isbn=req.body.isbn
    db.query('INSERT INTO Libro VALUES(?,?,?,?,?,?,?)',[numeroDeLibro,titulo,editorial,autor,categoria,cantidad,isbn],
    (err,result)=>{
        if(err){
           res.send(err)
        }else{
            
            res.send("Libro agregado exitosamente")
        }
    }
    )
 
})

app.listen(3001,()=>{
    console.log("corriendo el servidor")
})