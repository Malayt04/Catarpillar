import mongoose, { Model, Document, Schema } from 'mongoose';

interface IEmployee extends Document {
    name: string;
    EmployeeId: string;
    signature: string;
    password: string;
    email: string;
    phoneNumber: string;
    avatar?: string;
    history: mongoose.Schema.Types.ObjectId[];
    refreshToken?: string;
}

const employeeSchema: Schema<IEmployee> = new mongoose.Schema({
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

const Employee = mongoose.models.Employee || mongoose.model<IEmployee>('Employee', employeeSchema);

export default Employee;
