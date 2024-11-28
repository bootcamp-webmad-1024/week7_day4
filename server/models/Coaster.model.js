const { Schema, model } = require("mongoose");

const coasterSchema = new Schema({
  title: {
    type: String,
    minlength: [5, 'El título debe tener mínimo 5 caracteres'],
    required: true
  },
  description: {
    type: String,
    minlength: [10, 'La descripción debe tener mínimo 10 caracteres'],
    required: true
  },
  length: {
    type: Number,
    required: true
  },
  inversions: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

const Coaster = model('Coaster', coasterSchema)

module.exports = Coaster