import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const sequences = new Schema ({
  _id : {
    type: String,
    required: true
  },
 value : {
   type: Number,
   default: 1
 }
});

export default mongoose.model('sequences', sequences);