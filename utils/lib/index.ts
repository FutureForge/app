import mongoose, { MongooseError } from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

interface MongooseGlobal {
  connection: any;
  promise: any;
}

declare const global: MongooseGlobal;

global.mongoose = {
  connection: null,
  promise: null,
};

export async function dbConnect() {
  if (global.mongoose && global.mongoose.connection) {
    console.log("connected from previous connection");
  } else {

    console.log({MongooseError})

    const connectionPromise = mongoose.connect(MONGO_URI, {
      autoIndex: true,
    });

    global.mongoose = {
      connection: await connectionPromise,
      promise: connectionPromise,
    };

    console.log("connected to MongoDB");
    return await connectionPromise;
  }
}
