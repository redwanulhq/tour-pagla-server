const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const port = process.env.PORT || 5000
require('dotenv').config()
const app = express()
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { DB_USER, DB_PASS } = process.env;
const { MongoClient, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.baiua.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
     useNewUrlParser: true,
     useUnifiedTopology: true
})
console.log(uri)
async function run() {
     try {
       await client.connect();
       const database = client.db("tour_pagla");
       const tourCollection = database.collection("tours");
       const bookingCollection = database.collection("all_booking");
       
          // GET Tours API
          app.get('/tours', async (req, res) => {
               const cursor = tourCollection.find({});
               const tours = await cursor.toArray();
               res.send(tours)
          })
          //GET Individual tour information with _id
          app.get('/tours/:id', async (req, res) => {
               const id = req.params.id;
               const query = { _id: ObjectId(id) };
               const tour = await tourCollection.findOne(query);
               console.log('load tour with id', id);
               res.send(tour)
          })
          // Add booking API
          app.post('/all-booking', async(req, res) => {
               const booking = req.body;
               const result = await bookingCollection.insertOne(booking);
               res.json(result);
          })
          // GET all booking API
          app.get('/all-booking', async (req, res) => {
               const cursor = bookingCollection.find({});
               const tours = await cursor.toArray();
               res.send(tours)
          })
          // GET my booking API
          app.get("/all-booking/:email", async (req, res) => {
               const result = await bookingCollection.find({
                 email: req.params.email
               }).toArray();
               res.send(result);
          });
          // DELETE booking API
          app.delete("/all-booking/:id", async (req, res) => {
               const id = req.params.id;
               console.log(id)
               const query = { _id: ObjectId(id) };
               const result = await bookingCollection.deleteOne(query);
               res.json(result)
               console.log(result)
          })
          // UPDATE booking API
          app.put("/all-booking/:id", async (req, res) => {
               const id = req.params.id;
               const updatedBooking = req.body;
               const filter = { _id: ObjectId(id) };
               const options = { upsert: true };
               const updateDoc = {
                    $set: {
                         status: updatedBooking.status
                    },
               };
               const result = await bookingCollection.updateOne(filter, updateDoc, options);
               res.json(result)
          })
          // Add Tour package API
          app.post('/tours', async(req, res) => {
               const tour = req.body;
               const result = await tourCollection.insertOne(tour);
               res.json(result);
          })
          // DELETE all new tours API
          app.delete("/tours", async (req, res) => {
               const query = { new_added: { $regex: "yes" } };
               const result = await tourCollection.deleteMany(query);
               console.log("Deleted " + result.deletedCount + " documents");
               res.json(result)
               // console.log(result)
          })
     } finally {
     //   await client.close();
     }
}
run().catch(console.dir);






app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

/* 2WHNviW9BsGRWUuw */
// Tour_Pagla_Admin