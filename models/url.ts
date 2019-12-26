import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const urls = new Schema ({
  _id : {
    type: Number,
    required: true
  },
  url : {
    type: String,
    required: true
  }
});

export default mongoose.model('urls', urls);