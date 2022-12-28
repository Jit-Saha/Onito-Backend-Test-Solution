const express = require('express')
const bodyParser = require("body-parser")
const mysql = require("mysql")
const dotEnv = require("dotenv")

const app = express()
app.use(bodyParser.json())
dotEnv.config({path:"./configure/config.env"})

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'onitomovies',
    port: 3306
})
connection.connect(
    (err)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log("successfull")
        }
    }
)

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
  });

app.get('/',(req,res)=>{
    console.log('connection.js')
    res.send(`<h1>Hello</h1>`)
});

app.get('/api/v1/longest-duration-movies',(req,res)=>{
    connection.query(`select tconst, primaryTitle, runtimeMinutes, genres from movies order by runtimeMinutes desc limit 10;`,
        (err,rows)=>{
            res.json(rows)
        }
    )
})

app.post('/api/v1/new-movie', (req,res)=>{
    let tconst = 'hello'
    connection.query(`select tconst from movies order by tconst desc limit 1;`,
        (err,rows)=>{
            if(err){
                console.log(err)
            }
            else{
                let temp = parseInt(rows[0].tconst.slice(2))+1 
                temp = String(temp)
                while(temp.length!=7){
                    temp='0'+temp
                }

                tconst = 'tt'+temp
                // console.log(tconst)
                connection.query(`Insert into movies values('${tconst}', '${req.body.titleType}', '${req.body.primaryTitle}', '${req.body.runtimeMinutes}', '${req.body.genres}')`,
                (err)=>{
                    if(err){
                        res.json({message:"Error!!"})
                    }
                    else{
                        res.json({message:"Success"})
                    }
                })
            }
        }
    )
})

app.get('/api/v1/top-rated-movies',
    (req,res)=>{
        connection.query(`select m.tconst, m.primaryTitle, m.genres, r.averageRating from movies as m inner join ratings as r where m.tconst = r.tconst and r.averageRating>6.0 order by r.averageRating desc;`,
        (err, rows)=>{
            res.json(rows)
        })
    }
)

app.listen(
    process.env.PORT,
    (err)=>{
        if(err){
            console.log(err)
        }else{
            console.log(`Server is working on http://localhost:${process.env.PORT}`)
        }
    }
)
