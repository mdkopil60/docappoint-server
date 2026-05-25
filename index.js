const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const {
    MongoClient,
    ServerApiVersion,
    ObjectId,
} = require("mongodb");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

if (!uri) throw new Error("MONGODB_URI is missing");

// ================= MONGODB =================

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

// ================= JWT MIDDLEWARE =================

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "Forbidden",
            });
        }

        req.decoded = decoded;
        next();
    });
};

// ================= MAIN =================

async function run() {
    try {
        // await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("docappoint");

        const docappointCollection = db.collection("docappoint");
        const bookingCollection = db.collection("booking");
        const userCollection = db.collection("user");

        // ================= JWT =================

        app.post("/jwt", async (req, res) => {
            const user = req.body;

            const token = jwt.sign(user, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });

            res.send({ success: true, token });
        });

        // ================= USER =================

        app.get("/user", async (req, res) => {
            const email = req.query.email;

            const user = await userCollection.findOne({ email });

            res.send(user);
        });

        app.patch("/user/update", async (req, res) => {
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

            res.send({
                success: true,
                message: "Profile updated",
                result,
            });
        });

        // ================= APPOINTMENTS =================

        app.get("/all-appointments", async (req, res) => {
            const result = await docappointCollection.find().toArray();
            res.send(result);
        });

        app.get("/all-appointments/:id", async (req, res) => {
            const { id } = req.params;

            const result = await docappointCollection.findOne({
                _id: new ObjectId(id),
            });

            res.send(result);
        });

        app.post("/destination", async (req, res) => {
            const result = await docappointCollection.insertOne(req.body);

            res.send({
                success: true,
                result,
            });
        });

        // ================= BOOKINGS =================

        app.get("/bookings", async (req, res) => {
            const result = await bookingCollection.find().toArray();
            res.send(result);
        });

        app.post("/booking", async (req, res) => {
            const result = await bookingCollection.insertOne(req.body);

            res.send({
                success: true,
                result,
            });
        });

        app.patch("/booking/:id", async (req, res) => {
            const result = await bookingCollection.updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: req.body }
            );

            res.send(result);
        });

        app.delete("/booking/:id", async (req, res) => {
            const result = await bookingCollection.deleteOne({
                _id: new ObjectId(req.params.id),
            });

            res.send(result);
        });

        // await client.db("admin").command({ ping: 1 });
        console.log("MongoDB Connected");
    } catch (err) {
        console.log(err);
    }
}

run().catch(console.dir);

// ================= ROOT =================

app.get("/", (req, res) => {
    res.send("Server running");
});

app.listen(PORT, () => {
    console.log("Server running on", PORT);
});