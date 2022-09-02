const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../models/tourModel');

dotenv.config({ path: 'config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB connected successfully !!');
  });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/data/tours.json`, 'utf-8')
);

const importTours = async () => {
  try {
    await Tour.create(tours);
    console.log('Tours created successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteTours = async () => {
  try {
    await Tour.deleteMany();
    console.log('Tours deleted successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importTours();
} else if (process.argv[2] === '--delete') {
  deleteTours();
}
