import mongoose from 'mongoose';


const vehicleSchema = new mongoose.Schema({
  truckSerialNumber: {
    type: String
  },
  truckModel: {
    type: String
  },
  location: {
    type: String
  },
  geoCoordinates: {
    type: String
  },
  meterHours: {
    type: Number
  },
  ownerName: {
    type: String
  },
  customerId: {
    type: String
  },
  TIRES: {
    TirePressureLeftFront: String,
    TirePressureRightFront: String,
    TireConditionLeftFront: String,
    TireConditionRightFront: String,
    TirePressureLeftRear: String,
    TirePressureRightRear: String,
    TireConditionLeftRear: String,
    TireConditionRightRear: String,
    OverallTireSummary: String,
    AttachedImages: [String] 
  },
  BATTERY: {
    BatteryMake: String,
    BatteryReplacementDate: Date, 
    BatteryVoltage: String,
    BatteryWaterLevel: String,
    ConditionOfBattery: String,
    AnyLeakOrRust: String,
    BatteryOverallSummary: String,
    AttachedImages: [String]
  },
  EXTERIOR: {
    RustDentOrDamage: String,
    OilLeakInSuspension: String,
    OverallSummary: String,
    AttachedImages: [String]
  },
  BRAKES: {
    BrakeFluidLevel: String,
    BrakeConditionFront: String,
    BrakeConditionRear: String,
    EmergencyBrake: String,
    BrakeOverallSummary: String,
    AttachedImages: [String]
  },
  ENGINE: {
    RustDentOrDamageInEngine: String,
    EngineOilCondition: String,
    EngineOilColor: String,
    BrakeFluidCondition: String,
    BrakeFluidColor: String,
    AnyOilLeakInEngine: String,
    OverallSummary: String,
    AttachedImages: [String]
  },
  VoiceOfCustomer: {
    CustomerFeedback: String,
    ImagesRelatedToIssues: [String] 
  }
});


export const Vehicle = mongoose.model('Vehicle', vehicleSchema);
