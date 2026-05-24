const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express')
const dontenv = require('dotenv')
const cors = require('cors')

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dontenv.config()


const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT
const uri = process.env.MONGODB_URI;

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
        const bookingCollection = db.collection("booking")
        const userCollection = db.collection("users")

        app.get('/all-appointments', async (req, res) => {
            const result = await docappointCollection.find().toArray()
            res.json(result)
        })

        app.get('/all-appointments/:id', async (req, res) => {
            try {
                const id = req.params.id;
                // Check valid ObjectId
                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({
                        message: "Invalid ID"
                    });
                }
                const query = {
                    _id: new ObjectId(id)
                };
                const result = await docappointCollection.findOne(query);
                if (!result) {
                    return res.status(404).json({
                        message: "Doctor not found"
                    });
                }
                res.json(result);
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message: "Server Error"
                });
            }
        });
        app.patch("/bookings/:id", async(req, res) => {
            const {id} = req.params
            const updateData = 
        })
        app.get("/bookings", async (req, res) => {
            const result = await bookingCollection.find().toArray();
            res.json(result);
        });
        app.get("/booking/:id", async (req, res) => {
            try {
                const { id } = req.params;

                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid ID"
                    });
                }

                const booking = await bookingCollection.findOne({
                    _id: new ObjectId(id)
                });

                if (!booking) {
                    return res.status(404).json({
                        success: false,
                        message: "Booking not found"
                    });
                }

                res.json(booking);

            } catch (error) {
                console.log(error);
                res.status(500).json({
                    success: false,
                    message: "Server error"
                });
            }
        });
        app.post('/destination', async (req, res) => {
            const destination = req.body
            const result = await docappointCollection.insertOne(destination)
            res.json(result)
        })
        app.post("/booking", async (req, res) => {
            const bookingData = req.body
            const result = await bookingCollection.insertOne(bookingData)
            res.json(result);
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