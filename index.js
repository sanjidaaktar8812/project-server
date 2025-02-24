const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.59ljs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const postDatabase = client.db('postDatadb').collection('postData');




        app.get('/postdata', async (req, res) => {
            const { start, end, search } = req.query;

            let query = {};

            // Apply search filter
            if (search) {
                query.$or = [
                    { platform: { $regex: search, $options: 'i' } },
                    { title: { $regex: search, $options: 'i' } },
                    { activist: { $regex: search, $options: 'i' } },
                    { tag: { $regex: search, $options: 'i' } }
                ];
            }

            // Apply date range filter
            if (start && end) {
                query.date = {
                    $gte: start,
                    $lte: end
                };
            }

            const result = await postDatabase.find(query).toArray();
            res.send(result);
        });

        // Insert new post
        app.post('/postdata', async (req, res) => {
            const newPostData = req.body;
            const result = await postDatabase.insertOne(newPostData);
            res.send(result);
        });

        app.post('/postdata', async (req, res) => {
            const newPostData = req.body;
            const result = await postDatabase.insertOne(newPostData);
            res.send(result);
        });

        app.delete('/postdata/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await postDatabase.deleteOne(query);
            res.send(result);
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
    res.send('Projet server is running');
})




app.listen(port, () => {
    console.log(`project server is running on ${port}`)
})