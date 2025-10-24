// backend/models/Application.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// We can define the cost breakup as a sub-document
// This keeps our main schema cleaner
const costSchema = new Schema({
  preOp: { type: Number, required: true },
  prototype: { type: Number, required: true },
  marketing: { type: Number, required: true },
  equipment: { type: Number, required: true },
  capital: { type: Number, required: true },
  other: { type: Number, required: true },
}, { _id: false }); // _id: false means don't create a separate ID for this sub-document

// This is the main schema for your application form
const applicationSchema = new Schema({
  // --- From formData state ---
  businessName: { type: String, required: true },
  fullName: { type: String, required: true },
  age: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  education: { type: String, required: true },
  businessDescription: { type: String, required: true },
  productDescription: { type: String, required: true },
  novelty: { type: String, required: true },
  teamSize: { type: String, required: true },
  competitors: { type: String, required: true },
  marketSize: { type: String, required: true },
  marketSurvey: { type: String, required: true },
  validationSurvey: { type: String, required: true },
  projectCostEstimate: { type: String, required: true },
  revenueModel: { type: String, required: true },
  machineryNeeded: { type: String, required: true },
  labAccess: { type: String, required: true },
  libraryAccess: { type: String, required: true },
  technicalConsulting: { type: String, required: true },
  marketAssessment: { type: String, required: true },
  technoEconomic: { type: String, required: true },
  processDevelopment: { type: String, required: true },
  productEvaluation: { type: String, required: true },
  iprAssistance: { type: String, required: true },
  advisoryServices: { type: String, required: true },
  brandingMarketing: { type: String, required: true },
  anyOther: { type: String, required: true },
  anyOtherExplanation: { type: String }, // Not required, only if 'anyOther' is 'Yes'
  ref1Name: { type: String, required: true },
  ref1Org: { type: String, required: true },
  ref1Address: { type: String, required: true },
  ref1Phone: { type: String, required: true },
  ref1Email: { type: String, required: true },
  ref2Name: { type: String, required: true },
  ref2Org: { type: String, required: true },
  ref2Address: { type: String, required: true },
  ref2Phone: { type: String, required: true },
  ref2Email: { type: String, required: true },
  declaration: { type: Boolean, required: true },
  date: { type: String, required: true }, // Using String for simplicity, Date type is also fine
  place: { type: String, required: true },

  // --- From costs state ---
  costs: costSchema,

  // --- From calculated/other fields ---
  totalCost: { type: Number, required: true },
  businessType: [String], // An array of strings (e.g., ["Services", "Others"])
  status: { type: String },
  legalEntity: [String], // An array of strings (e.g., ["LLP"])
}, {
  timestamps: true, // This automatically adds `createdAt` and `updatedAt` fields
});

// This creates the model and exports it
module.exports = mongoose.model('Application', applicationSchema);