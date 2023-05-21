const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.fs0mclr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    client.connect((err) => {
      if(err){
        console.error(err);
        return
      }
    })

    const allToysCollection = client.db('toyLand').collection('allToys')



    app.get('/allToys', async (req, res) => {
      // console.log(req.query.email);
      let query = {};
      if (req.query?.sellerEmail) {
        query = { sellerEmail: req.query.sellerEmail }
      }
      const result = await allToysCollection.find(query).toArray();
      res.send(result)
    })

    app.get('/allToys/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await allToysCollection.findOne(query)
      res.send(result)
    })

   
    app.post('/allToys', async (req, res) => {
      const addToys = req.body;
      console.log(addToys);
      const result = await allToysCollection.insertOne(addToys);
      res.send(result)
    })

    //delete
    app.delete('/allToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await allToysCollection.deleteOne(query)
      res.send(result)
    })

    //update

    app.put('/allToys/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updateToy =req.body;
      const toy = {
        $set:{
          price: updateToy.price,
          availableQuantity: updateToy.availableQuantity,
          detailsDescription: updateToy.detailsDescription
        }
      }
      const result = await allToysCollection.updateOne(filter, toy,options);
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



app.get('/', (req, res) => {
  res.send('toyland server is running')
})
app.listen(port, () => {
  console.log(`toyland server is running on port : ${port}`);
})