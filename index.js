const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { parse } = require("dotenv");
const uri =
  "mongodb+srv://pagination:G9ux3vLqpXv7q6bz@cluster0.6tngyrc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db("emaJohnDB").collection("products");

    app.post("/productByIds", async (req, res) => {
      const ids = req.body;
      const idsWithObjectId = ids.map((id) => new ObjectId(id));
      const query = {
        _id: {
          $in: idsWithObjectId,
        },
      };
      const result = await productCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const result = await productCollection
        .find()
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
    });
    app.get("/productsCount", async (req, res) => {
      // estimated document will be count =>

      const count = await productCollection.estimatedDocumentCount();
      console.log(count);
      res.send({ count });
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("john is busy shopping");
});

app.listen(port, () => {
  console.log(`ema john server is running on port: ${port}`);
});
