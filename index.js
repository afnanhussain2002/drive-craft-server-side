const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(express.json())
app.use(cors())



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.ebhxdyy.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const carCollection = client.db('mainDB').collection('cars')
    app.post('/products',async(req,res)=>{
      const cars = req.body;
      const result = await carCollection.insertOne(cars)
      console.log(result);
       res.send(result)

    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req , res)=>{
    res.send('assignment 10 server is running. I am happy')
})
app.listen(port, ()=>{
    console.log(`port is running on ${port}`);
})