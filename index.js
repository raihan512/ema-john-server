const express = require("express");
var cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient } = require("mongodb");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Ema John Server Is running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e4yec41.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db("emaJohn");
    const productCollection = database.collection("products");

    app.get("/products", async (req, res) => {
      const currentPage = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log(currentPage, size);
      const query = {};
      const products = await productCollection
        .find(query)
        .skip(currentPage * size)
        .limit(size)
        .toArray();
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count, products });
    });
  } finally {
  }
}
run().catch((error) => console.error(error));

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
