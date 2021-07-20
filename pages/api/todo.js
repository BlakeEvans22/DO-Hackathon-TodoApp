import { connectToDatabase } from "../../util/mongodb";
const mongodb = require("mongodb");
const ObjectID = require("mongodb").ObjectID;

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { db } = await connectToDatabase();

    try {
      const todos = await db.collection("todos").find({}).limit(20).toArray();
      res.send(todos);
    } catch (error) {
      res.send(500);
    }
  } else if (req.method === "POST") {
    const { db } = await connectToDatabase();

    var myobj = { name: req.body.newTodo, complete: false };
    try {
      db.collection("todos").insertOne(myobj);
      res.send(200);
    } catch (error) {
      res.send(500);
    }
  } else if (req.method === "DELETE") {
    const { db } = await connectToDatabase();

    try {
      db.collection("todos").deleteOne({
        _id: new mongodb.ObjectID(req.body.id.toString()),
      });
      res.send(200);
    } catch (error) {
      res.send(500);
    }
  } else if (req.method === "PUT") {
    const { db } = await connectToDatabase();

    try {
      var myquery = { _id: new mongodb.ObjectID(req.body.id.toString()) };
      var newvalues = { $set: { complete: req.body.complete } };
      db.collection("todos").updateOne(myquery, newvalues);
      res.send(200);
    } catch (error) {
      res.send(500);
    }
  }
}
