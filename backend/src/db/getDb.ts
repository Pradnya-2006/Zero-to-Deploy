import mongoose from 'mongoose';

export const getDb = (dbName: string) => {
  return mongoose.connection.useDb(dbName);
};
