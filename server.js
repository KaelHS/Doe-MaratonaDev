const express = require('express');

const server = express();

//Configurar o servidor para apresentar arquivos estaticos
server.use(express.static('public'))

//Habilitar body do formulario ( utilizada no metodo POST para pegar os dados)
server.use(express.urlencoded({extended: true}))

//Configurando a Template Engine
const nunjucks = require('nunjucks');
nunjucks.configure("./", {
    express: server,
    noCache: true
})

//Configurar a conexão com o banco de dados -- foi instalado o npm install pg
const Pool = require('pg').Pool;
const db = new Pool({
    user:'postgres',
    password: 'ka100182',
    host: 'localhost',
    port: 5432,
    database: 'Doe'
});

const donors = [];

server.get('/', function(req, res){
    db.query("SELECT * FROM donors ", function(err, result){
        if (err) return res.send('Erro de banco de dados!')

        const donors = result.rows;
        res.render("index.html", {donors});
    })
   
   
})

server.post('/', function(req, res){
    //pegar dados do formulario
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    //colocando valores no array
    donors.push({
        name: name,
        blood: blood,
    });

    //Colocando valores dentro do Banco de Dados
    const query = 
    `INSERT INTO donors ("name", "email", "blood")
     VALUES ($1, $2, $3)`


    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios!!")
    }
    db.query(query, [name, email, blood], function(err){
        if(err) return res.send("erro no banco de dados")

        return res.redirect('/');
    })

})

server.listen(3000, function(){
    console.log("Servidor funcionando!!")
}) ;