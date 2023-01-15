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

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: Number,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        min: 8
    },
    role:{
        type: String,
        required: true,
        default: 'public',
        enum: ['admin', 'employee', 'public']
    },
    dept:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    problems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;