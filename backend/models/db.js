import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, require: true},
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    phone: {type: String},
    booking: [{type: mongoose.Schema.Types.ObjectId, ref: "booking"}] 
}, {timestamps: true});

const adminSchema = new Schema({
     name: {type: String, require: true},
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
})


const bikeSchema = new Schema({
    model: { type: String, required: true},
    type: { type: String, required: true,
        enum: ["scooter", "motorbike", "electric"]
    },
    pricePerHour: {type: Number, required: true},
    pricePerDay: {type: Number, required: true},
    pricePerWeek: {type: Number, required: true},
    status: {type: String, 
            enum: ["available", "booked", "maintenance"],
            default: "avialable"
    },
    imageUrl: { type: String}
}, {timestamps: true});


const helmetSchema = new Schema({
    model: { type: String, required: true},
    pricePerHour: {type: Number, required: true},
    pricePerDay: {type: Number, required: true},
    pricePerWeek: {type: Number, required: true},
    status: { 
    type: String, 
    enum: ["available", "booked", "maintenance"], 
    default: "available" 
  },
    imageUrl: { type: String}
}, { timestamps: true});


const bookingSchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
    bike: {type: mongoose.Schema.Types.ObjectId, ref: "bike", required: true},
    helmet: {type: mongoose.Schema.Types.ObjectId, ref: "helmet"},
    pickupDate: { type: Date, required: true },  
    pickupTime: { type: String, required: true },
    dropDate: { type: Date, required: true },     
    dropTime: { type: String, required: true }, 
    totalPrice : { type: Number, required: true},
    paymentStatus: {type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    }  
}, {timestamps: true});

const userModel = mongoose.model("user",userSchema);
const adminModel = mongoose.model("admin", adminSchema)
const bikeModel = mongoose.model("bike",bikeSchema);
const helmetModel = mongoose.model("helmet", helmetSchema);
const bookingModel = mongoose.model("booking",bookingSchema);

export { userModel, adminModel, bikeModel, helmetModel, bookingModel };
