import mongoose from 'mongoose';
import bcrypt from "bcrypt"

// Define the employee schema
const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    EmployeeId: {
        type: String,
        required: true,
    },
    signature: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle"
    }],
    refreshToken: {
        type: String,
    }
}, {
    timestamps: true 
});


employeeSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

employeeSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

employeeSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


employeeSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Employee = mongoose.model('Employee', employeeSchema);
