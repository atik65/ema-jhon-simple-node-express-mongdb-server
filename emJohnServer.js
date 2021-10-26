const { MongoClient } = require("mongodb");
const express = require("express");
require("dotenv").config();

const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASS}@cluster0.tx5hg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// const uri = `mongodb+srv://ema-john:LDW3oq5418nohPSJ@cluster0.tx5hg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("emaJohnShop");
    const productCollection = database.collection("products");

    // get api for all products
    app.get("/products", async (req, res) => {
      const page = req.query.page;
      const size = parseInt(req.query.size);

      const cursor = productCollection.find({});
      const count = await cursor.count();
      let products = [];
      if (page) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }

      res.json({
        count,
        products,
      });
    });

    app.post("/products", async (req, res) => {
      const keys = req.body;
      const query = { key: { $in: keys } };
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.json(products);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// get api for default route
app.get("/", (req, res) => {
  res.send("Hello from ema john simple node server");
});

app.listen(port, () => {
  console.log("Listening to port : ", port);
});
