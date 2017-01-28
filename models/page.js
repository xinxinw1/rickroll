'use strict';
module.exports = function (mongoose) {
  var PageSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true,
      required: true
    },
    pretend: {
      type: String,
      required: true
    },
    redirect: {
      type: String,
      required: true
    },
    metadata: {
      type: Object
    }
  });
  
  var Page = mongoose.model('Page', PageSchema);
  
  return Page;
};