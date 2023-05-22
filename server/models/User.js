const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');// for encryption

// import schema for book
const bookSchema = require('./Book');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Requires a valid email'],
    },
    password: {
      type: String,
      required: true,
    },
    // savedBooks set to an array of data 
    savedBooks: [bookSchema],
  },
  
  {
    toJSON: {
      virtuals: true,
    },
  }
);


userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    //pass hashinng
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// password validation
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};


userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length;
});

const User = model('User', userSchema);

module.exports = User;
