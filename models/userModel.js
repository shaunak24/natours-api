const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please provide Name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your Email Address'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid Email']
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide password confirmation'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are different!'
    }
  },
  passwordChangedAt: Date
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(
  userPassword,
  savedPassword
) {
  return await bcrypt.compare(userPassword, savedPassword);
};

userSchema.methods.hasPasswordChange = function(jwtCreateTime) {
  if (this.passwordChangedAt) {
    return this.passwordChangedAt.getTime() / 1000 > jwtCreateTime;
  }
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
