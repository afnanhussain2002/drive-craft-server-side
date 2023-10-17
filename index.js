const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

app.use(express.json())
app.use(cors())

app.get('/',(req , res)=>{
    res.send('assignment 10 server is running')
})
app.listen(port, ()=>{
    console.log(`port is running on ${port}`);
})