import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    allowNull: false,
    unique: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    allowNull: false,
    trim: true,
  },
});

const User = mongoose.model('User', userSchema, 'users');

export default User;

