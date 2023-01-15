const mongoose = require("mongoose");

// problem{
//     dept { ref dept}
//     description
//     fromDate
//     resolved? (boolean)
//     submittedby: {ref user}
// }

// user{
//     name
//     email
//     phonenumber
//     password
//     problem [{ref problem}]
//     role: admin or employee or public
//     belongsTo: {ref dept}
// }

// dept{
//     deptCode
//     name
//     address:{
//         taluk
//         street
//         city
//         pincode
//     }
//     phoneNumber
//     problems: [{ref problem}]
// }

// govtSchemes{
//     name
//     description
//     url
//     deptment: {ref dept}
// }

const deptSchema = new mongoose.Schema({
  deptCode: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    taluk: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true
    },
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  problems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
    },
  ],
  govtSchemes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GovtScheme",
    },
  ],
});

//eg of deptSchema

// {
//   "deptCode": 1,
//   "name": "Public Works Department",
//   "address": {
//     "street": "Koramangala",
//     "taluk": "Bangalore",
//     "city": "Bangalore",
//     "pincode": 560034
//   },
//   "phoneNumber": 1234567890,
//   "problems": []
// }

const Department = mongoose.model("Department", deptSchema);
module.exports = Department;
