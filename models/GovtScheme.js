const mongoose = require('mongoose');

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

const govtSchemeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    }
});

const GovtScheme = mongoose.model("GovtScheme", govtSchemeSchema);
module.exports = GovtScheme;