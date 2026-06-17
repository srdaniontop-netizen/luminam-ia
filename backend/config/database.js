import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Evitar múltiples conexiones en serverless
    if (mongoose.connections[0].readyState) {
      console.log('✅ MongoDB ya conectado');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📦 Base de datos: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Error conectando a MongoDB: ${error.message}`);
    throw error; // No hacer process.exit en serverless
  }
};

export default connectDB;
