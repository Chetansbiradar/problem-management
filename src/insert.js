const mongoose = require('mongoose');
const userDocument = new USER({
            U_ID: 3,
            U_PASS: '@ARATHI09',
            U_NAME: 'ARATHI M B',
            U_PHONE: 6677889900,
            U_MAIL: 'ARATHI12@GMAIL.COM'
          
})
userDocument.save();

// {
//     _id: ObjectId("63bfc31574544459f4574806"),
//     U_ID: 4,
//     U_PASS: 'LAVA@1235',
//     U_NAME: 'LAVANYA LENKA',
//     U_PHONE: 4455667788,
//     U_MAIL: 'LAVALENKA@GMAIL.COM'
// }