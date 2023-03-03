import { MongoClient } from "mongodb";

const client = new MongoClient(
    "mongodb://volte:qwertyuiop@194.195.117.230:27017/mrits"
).on("error", (err) => {
    console.log(err);
});
export const db = client.db("mrits");
