const express = require("express")
const mysql = require("mysql")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cors())


const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"my_datbase"
})

db.connect(err=>{
    if(err){
        console.log(`Error while connecting to Database ${err}`)
    }else{
        console.log("Successfully Connected to Database")
    }
})

// GET API. TO FETCH THE DATA 

app.get('/',(req,res)=>{
    const getquery = "Select * from quant_assignment"
    db.query(getquery,(error,data)=>{
        if (error){
            console.log(`Error: ${error}`)
            return res.send("Error")
        }else{
            console.log("Data Fetched")
            return res.send(data)
        }
    })
})

// POST API. TO CREATE A NEW DATA

app.post('/create',(req,res)=>{
    const {ticker,date,revenue,gp,fcf,capex} = req.body;

    const postquary = `INSERT INTO quant_assignment (ticker, date, revenue, gp, fcf, capex) VALUES ('${ticker}', '${date}', '${revenue}', '${gp}', '${fcf}','${capex}')`

    db.query(postquary,(error,data)=>{
        if(error){
            console.log(`Error: ${error}`)
            return res.send("Error")
        }else{
            console.log("Data Inserted Successfully")
            return res.send("Data Inserted Successfully")
        }
    })
})

// PUT API. TO UPDATE THE DATA

app.put('/update/:id',(req,res)=>{
    const id  = req.params.id
    const {ticker,date,revenue,gp,fcf,capex} = req.body;

    const updatequary = `UPDATE quant_assignment SET ticker = '${ticker}', date = '${date}', revenue = '${revenue}', gp='${gp}', fcf = '${fcf}', capex='${capex}' WHERE id = '${id}'`

    db.query(updatequary,(error,data)=>{
        if(error){
            console.log(`Error: ${error}`)
            return res.send("Error")
        }else{
            console.log("Data Updated Successfully")
            return res.send("Data Updated Successfully")
        }
    })
})

//DELETE API. TO DELETE THE RECORD FROM DATABASE

app.delete("/delete/:id",(req,res)=>{
    const id = req.params.id;
    console.log(id)
    const sql = "DELETE FROM quant_assignment where id = ?";

    db.query(sql,[id],(error,data) =>{
        if (error) return res.json("Error");
        return res.json("Deleted");
    })
})

//API TO GET DATA ACCORDING TO QUERY PARAMETERS

app.get('/Api/',(req,res)=>{
    const {ticker,column,period} = req.query;
    console.log(ticker)
    let col = column.split(',')
    let rev = col[0]
    let gp = col[1]
    

    let currentTime = new Date()
    let year = currentTime.getFullYear()
    let p = parseInt(period)
    let x = (year- p)
    let y = (`${x}/01/01`)

    const query = `SELECT * FROM quant_assignment WHERE ticker LIKE '%${ticker}%'  && date >= '${y}' && revenue >= '${rev}'&& gp >='${gp}' ORDER BY ticker ASC`

    db.query(query,(error,data)=>{
        if (error){
            console.log(error)
            return res.send(error)
        }else{
            console.log(data)
            return res.send(data)
        }
    })
})


app.listen(3000,()=>{
    console.log('Server running on http://localhost:3000/')
})