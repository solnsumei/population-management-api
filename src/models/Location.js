import mongoose from 'mongoose';


const locationSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    allowNull: false,
    unique: true,
    trim: true,
    index: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    default: null,
  },
  population: {
    male: {
      type: Number,
      allowNull: false,
    },
    female: {
      type: Number,
      allowNull: false,
    },
    total: {
      type: Number,
      allowNull: false,
    }
  },
}, { toJSON: { virtuals: true } });

locationSchema.virtual('children', {
  ref: 'Location',
  localField: '_id',
  foreignField: 'parent',
});

locationSchema.post('findOneAndDelete', async function (doc, next) {
  if (!doc) {
    next();
  }
  await Location.deleteMany({ parent: doc._id });
  next();
});

const Location = mongoose.model('Location', locationSchema, 'locations');

export default Location;
