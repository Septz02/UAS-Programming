// mongodb.js

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client;
let clientPromise;

// Ensure MongoDB URI is defined
if (!uri) {
  throw new Error("Add Mongo URI to .env.local");
}

// Create and connect the MongoClient directly in production
client = new MongoClient(uri, options);
clientPromise = client.connect();

export default clientPromise;
