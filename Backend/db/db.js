const mongoose = require('mongoose');

function connectToDb() {
  const uri = process.env.MONGO_URI;
  console.log('MONGO_URI startsWith mongodb+srv:', !!uri && uri.startsWith('mongodb+srv'));

  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
      console.error('❌ Mongo connect error:', err);
      process.exit(1);
    });
}

module.exports = connectToDb;
