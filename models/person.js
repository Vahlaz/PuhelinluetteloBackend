const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
console.log(process.argv + 'bruh')
const uri = process.env.MONGODB_URI

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
.then(result => console.log('connected'))
.catch((error) => {
    console.log('error connecting : ' , error.message)
})

const personSchema = new mongoose.Schema({
  name: {type: String, minlength: 3, required: true, unique: true},
  number: {type: String, minlength: 8, required: true}
})

personSchema.plugin(uniqueValidator)

const Person = mongoose.model('person',personSchema)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('person',personSchema)