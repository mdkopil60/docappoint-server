const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express')
const dontenv = require('dotenv')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
dontenv.config()

const uri = process.env.MONGODB_URI;
const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        await client.connect();
        const db = client.db("docappoint")
        const docappointCollection = db.collection("docappoint")

        app.get('/all-appointments', async (req , res) => {
            const result = await docappointCollection.find().toArray()
            res.json(result)
        })

        app.post('/destination' , async(req , res) => {
            const destination = req.body
            console.log(destination);
           const result = await docappointCollection.insertOne(destination)
           res.json(result)
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('server is running on port fine')
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})