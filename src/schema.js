const mongoose=require('mongoose');

const user= new mongoose.Schema({
    U_ID:{ 
        type: Number,
        required: true
    },
    U_PASS: {
        type:String,
        required: true
    },
    U_NAME: {
        type: String,
        required: true
    },
    U_PHONE: {
        type: Number,
        required: true
    },
    U_MAIL: {
        type:String
    }
})
//c------------------------------CREATE COLLECTION WITH THE HELP OF model which returns a class
const USER=new mongoose.model('USER',user)

const department=new mongoose.Schema({
    D_ID: {
        type: Number,
        required: true
    },
    D_NAME: {
        type: String,
        required: true   
    },
    D_PROBEM_TYPE: {
        type: String,
        required: true
    },
    D_LOC: {
        type: String,
        required: true
    }
})
const DEPART=new mongoose.model('DEPART',department)

const employee=new mongoose.Schema({
    EMP_ID: {
        type: Number,
        required: true
    },
    EMP_PASS: {
        type:String,
        required: true
    },
    EMP_NAME: {
        type:String,
        required:true
    },
    EMP_DESIGN: {
        type: String,
        required: true
    },
    EMP_CONATCT: {
        type: String,
        required: true
    },
    EMP_MAIL: {
        type:String,
        required: true
    },
    EMP_DID: {
        type: Number,
        required: true
    }
})
const EMPLOYEE= new mongoose.model('EMLOYEE',employee)

const problem = new mongoose.Schema({
    PROB_NO: {
        type: Number,
         required: true
    },
    U_ID: {
        type: Number,
        required: true
    },
    D_ID: {
        type: Number,
        required: true
    },
    D_PROBEM_TYPE: {
        type: String,
        required: true
    },
    PROB_DESCRIP: {
        type: String,
        required: false
    },
    FROM_WHEN:{
        type: Date,
        required: false
    },
    VILL_NAME: {
        type: String,
        required: true
    },
    TALUK: {
        type: String,
        required: true
    },
    DISTRICT:{
        type: String,
        required: true
    }
})
const PROB= new mongoose.model('PROB',problem)

const scheme=new mongoose.Schema({
    S_ID: {
        type: Number,
        required: true
    },
    S_NAME: {
        type: String,
        required: true
    },
    S_URL: {
        type: String,
        required: true
    }
})
const SCHEME = new mongoose.model('SCHEME',scheme)
