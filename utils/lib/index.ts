import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

interface MongooseGlobal {
  mongoose: {
    connection: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Declaration merging to extend the global object
declare global {
  var mongoose: MongooseGlobal["mongoose"];
}

global.mongoose = global.mongoose || {
  connection: null,
  promise: null,
};

export async function dbConnect() {
  if (global.mongoose && global.mongoose.connection) {
    return global.mongoose.connection;
  } else {
    const connectionPromise = mongoose.connect(MONGO_URI, {
      autoIndex: true,
    });

    global.mongoose = {
      connection: await connectionPromise,
      promise: connectionPromise,
    };

    return connectionPromise;
  }
}
