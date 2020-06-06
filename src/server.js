const express = require("express")
const server = express()

const db = require("./database/db.js")

//Configurar a pasta publica
server.use(express.static("public"))

server.use(express.urlencoded({ extended: true }))

//Utulizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})


//Configurar a reposta do servidor
server.get("/", (req, res) => {
    return res.render("index.html")
})

//Esse serve para configurar as rotas 
server.get("/create-point", (req, res) => {

    console.log(req.query)

    return res.render("create-point.html")
})

server.post("/create-point", (req, res) => {

    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?); 
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.itens
    ]

    function afterInsertData(err) {
        if (err) {
            console.log(err)
            return res.render("create-point.html", { errorInsertPlaces: true, errorMessagePlaces: err })
        }

        console.log("Cadastrado com secusso")
        console.log(this)

        return res.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInsertData)
})

server.get("/search", (req, res) => {

    const search = req.query.search

    if (search == "") {
        return res.render("search-results.html", { total: 0 })
    } else {
        db.all(`SELECT * FROM places WHERE city like '%${search}%'`, function (err, rows) {
            if (err) {
                return console.log(err)
            }

            const total = rows.length

            return res.render("search-results.html", { places: rows, total: total })
        })
    }
})


//ligar o servidor
server.listen(3000)