const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(express.json())
app.use(cors())



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.ebhxdyy.mongodb.net/?retryWrites=true&w=majority`;

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
    const carCollection = client.db('mainDB').collection('cars');
    const addToCartCollection = client.db('mainDB').collection('cart');
    const membersCollection = client.db('mainDB').collection('member');
    app.get('/products',async(req,res)=>{
      const cursor = carCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/products/:id',async(req,res)=>{
      const id = req.params.id;
      const quary = {_id: new ObjectId(id)}
      const result = await carCollection.findOne(quary)
      res.send(result)
    })
    app.get('/products/:brand',async(req,res)=>{
      const brand = req.params.brand;
      const quary = {carBrand: brand}
      const result = await carCollection.find(quary).toArray();
      res.send(result)
    })
    app.post('/products',async(req,res)=>{
      const cars = req.body;
      const result = await carCollection.insertOne(cars)
      console.log(result);
       res.send(result)

    })

    app.post('/cart',async(req,res)=>{
      const cars = req.body
      const result = await addToCartCollection.insertOne(cars)
      console.log(result)
      res.send(result)
    })
  app.get('/cart',async(req,res)=>{
    const cursor = addToCartCollection.find()
    const result = await cursor.toArray()
    res.send(result)
  })
    app.put('/products/:id',async(req,res)=>{
      const id = req.params.id
      console.log(id);
      const filter = {_id: new ObjectId(id)}
      console.log(filter);
      const options = {upsert: true};
      const updateCar = req.body;
      const products = {
        $set:{
          carName: updateCar.carName,
          carPhoto: updateCar.carPhoto,
          carModel: updateCar.carModel,
          carBrand: updateCar.carBrand,
          carPrice: updateCar.carPrice,
          carDescription: updateCar.carDescription,
          rating: updateCar.rating
        }
        
      }
      const result = await carCollection.updateOne(filter, products, options)
      res.send(result)
    })
    app.delete('/cart/:id',async(req,res)=>{
      const id = req.params.id;
      const quary = {_id: id}
      const result = await addToCartCollection.deleteOne(quary)
      res.send(result)
    })

    // work with user data

    app.get('/users',async(req,res)=>{
      const cursor = membersCollection.find()
      const result = await cursor.toArray()
      res.send(result);
      
    })

    app.post('/users',async(req,res)=>{
      const user = req.body
      console.log(user);
      const result = await membersCollection.insertOne(user)
      console.log(result)
      res.send(result)
    })

    // Autantication api

    app.post('/jwt',async(req,res)=>{
       const user = req.body;
       console.log(user);
       res.send(user)
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