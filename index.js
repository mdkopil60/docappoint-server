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
        const userCollection = db.collection("user")

        app.get("/user", async (req, res) => {
            try {
                const email = req.query.email;

                if (!email) {
                    return res.status(400).json({
                        success: false,
                        message: "Email required"
                    });
                }

                const user = await userCollection.findOne({ email });

                res.json(user);
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Server error"
                });
            }
        });

        app.patch("/user/update", async (req, res) => {
            try {
                const { name, image, email } = req.body;

                const result = await userCollection.updateOne(
                    { email },
                    {
                        $set: {
                            name,
                            image,
                            updatedAt: new Date(),
                        },
                    }
                );

                res.json({
                    success: true,
                    message: "Profile updated",
                    result,
                });

            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Update failed",
                });
            }
        });

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
        app.delete("/booking/:id", async (req, res) => {
            try {
                const { id } = req.params;

                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid ID",
                    });
                }

                const result = await bookingCollection.deleteOne({
                    _id: new ObjectId(id),
                });

                if (result.deletedCount === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "Booking not found",
                    });
                }

                res.json({
                    success: true,
                    message: "Booking deleted successfully",
                });

            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Delete failed",
                });
            }
        });
        app.patch("/booking/:id", async (req, res) => {
            try {
                const { id } = req.params;

                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid ID",
                    });
                }

                const updatedData = req.body;

                const result = await bookingCollection.updateOne(
                    { _id: new ObjectId(id) },
                    {
                        $set: updatedData,
                    }
                );

                if (result.modifiedCount === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "Nothing updated",
                    });
                }

                res.json({
                    success: true,
                    message: "Booking updated successfully",
                    result,
                });

            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Update failed",
                });
            }
        });


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