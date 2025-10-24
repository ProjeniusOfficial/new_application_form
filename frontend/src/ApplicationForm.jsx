// frontend/src/ApplicationForm.jsx

import React, { useState } from 'react'; 
// We no longer need useRef, jsPDF, or html2canvas
import './ApplicationForm.css'; // We'll create this file next

const ApplicationForm = () => {
  // --- All your state (formData, costs) stays EXACTLY THE SAME ---
  const [formData, setFormData] = useState({
    businessName: '',
    fullName: '',
    age: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    education: '',
    businessDescription: '',
    productDescription: '',
    novelty: '',
    teamSize: '',
    competitors: '',
    marketSize: '',
    marketSurvey: '',
    validationSurvey: '',
    projectCostEstimate: '',
    revenueModel: '',
    machineryNeeded: '',
    labAccess: '',
    libraryAccess: '',
    technicalConsulting: '',
    marketAssessment: '',
    technoEconomic: '',
    processDevelopment: '',
    productEvaluation: '',
    iprAssistance: '',
    advisoryServices: '',
    brandingMarketing: '',
    anyOther: '',
    anyOtherExplanation: '',
    ref1Name: '',
    ref1Org: '',
    ref1Address: '',
    ref1Phone: '',
    ref1Email: '',
    ref2Name: '',
    ref2Org: '',
    ref2Address: '',
    ref2Phone: '',
    ref2Email: '',
    declaration: false,
    date: '',
    place: '',
  });

  const [costs, setCosts] = useState({
    preOp: '', prototype: '', marketing: '', equipment: '', capital: '', other: ''
  });

  const [showAnyOtherTextarea, setShowAnyOtherTextarea] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ visible: false, title: '', message: '' });
  // We no longer need: const formRef = useRef();

  // --- All your handler functions (handleChange, etc.) stay EXACTLY THE SAME ---
  const totalCost = Object.values(costs).reduce((acc, val) => acc + (Number(val) || 0), 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: checked }));
  };

  const handleCostChange = (e) => {
    const { name, value } = e.target;
    setCosts(prevCosts => ({ ...prevCosts, [name]: value }));
  };

  const handleSelectChange = (e) => {
    handleChange(e);
    if (e.target.name === 'anyOther') {
      setShowAnyOtherTextarea(e.target.value === 'Yes');
    }
  };

  // --- THIS IS THE MAIN CHANGE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.declaration) {
      alert('Please agree to the declaration before submitting.');
      return;
    }

    setIsSubmitting(true);
    setModal({ visible: true, title: 'Processing...', message: 'Please wait while your application is submitted.' });

    try {
      // 1. Gather all form data
      const fullFormData = {
        ...formData,
        costs,
        totalCost,
        // This is the correct way to get checkbox/radio data
        businessType: Array.from(e.target.querySelectorAll('input[name="businessType"]:checked')).map(el => el.value),
        status: e.target.querySelector('input[name="status"]:checked')?.value || '',
        legalEntity: Array.from(e.target.querySelectorAll('input[name="legalEntity"]:checked')).map(el => el.value),
      };

      // 2. REMOVED all html2canvas and jsPDF logic

      // 3. Send data to the new backend endpoint
      // This must match the URL your backend is running on
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullFormData), // Send the data, NOT a PDF
      });

      const result = await response.json();

      if (response.ok) {
        setModal({
          visible: true,
          title: 'Success!',
          message: 'Your application has been submitted successfully.',
          submessage: 'A confirmation email is on its way. The page will refresh now.'
        });
        // Reload the page after a successful submission
        setTimeout(() => window.location.reload(), 4000);
      } else {
        // Use the error message from the backend
        throw new Error(result.message || 'Server error during submission.');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      setModal({
        visible: true,
        title: 'Submission Failed',
        message: `An error occurred: ${error.message}`,
        submessage: 'Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const requiredLabel = (text) => (
    <label>{text} <span style={{ color: 'red' }}>*</span></label>
  );

  const closeModal = () => setModal({ visible: false, title: '', message: '' });

  // --- Your ENTIRE return() block (the JSX) stays THE SAME ---
  // We just remove the ref={formRef} from the <div className="form-container">
  return (
    <>
      {modal.visible && (
        <div className="form-modal-overlay">
          <div className="form-popup-card">
            <h2 className="form-popup-title">{modal.title}</h2>
            {modal.title === 'Processing...' && <div className="form-loader"></div>}
            <p className="form-popup-message">{modal.message}</p>
            {modal.submessage && <p className="form-popup-submessage">{modal.submessage}</p>}
            {modal.title !== 'Processing...' && (
              <button
                onClick={modal.title === 'Success!' ? () => window.location.reload() : closeModal}
                className="form-popup-button"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}

      <div className="form-container"> {/* REMOVED ref={formRef} */}
        <h1>PSNA Technology Foundation - Application Form</h1>
        <form className="online-form" onSubmit={handleSubmit}>
          
          {/* --- Questions 1 through 18 --- */}
          {requiredLabel("1. Name of the Business")}
          <input type="text" name="businessName" className="input-field" value={formData.businessName} onChange={handleChange} required />

          <h3>2. Primary Applicant / Entrepreneur</h3>
          {requiredLabel("Full Name")}
          <input type="text" name="fullName" className="input-field" value={formData.fullName} onChange={handleChange} required />
          {requiredLabel("Age")}
          <input type="number" name="age" className="input-field" value={formData.age} onChange={handleChange} required />
          {requiredLabel("Mobile Number")}
          <input type="tel" name="mobile" className="input-field" pattern="[0-9]{10}" value={formData.mobile} onChange={handleChange} required />
          {requiredLabel("Email ID")}
          <input type="email" name="email" className="input-field" value={formData.email} onChange={handleChange} required />
          {requiredLabel("Postal Address")}
          <input type="text" name="address" className="input-field" value={formData.address} onChange={handleChange} required />
          {requiredLabel("City")}
          <input type="text" name="city" className="input-field" value={formData.city} onChange={handleChange} required />
          {requiredLabel("State")}
          <input type="text" name="state" className="input-field" value={formData.state} onChange={handleChange} required />
          {requiredLabel("Postal Code")}
          <input type="text" name="postalCode" className="input-field" value={formData.postalCode} onChange={handleChange} required />
          {requiredLabel("Country")}
          <input type="text" name="country" className="input-field" value={formData.country} onChange={handleChange} required />
          {requiredLabel("Highest Education / Degree")}
          <input type="text" name="education" className="input-field" value={formData.education} onChange={handleChange} required />

          <h3>3. Type of the Business</h3>
          <label><input type="checkbox" name="businessType" value="Services" /> Services</label>
          <label><input type="checkbox" name="businessType" value="Manufacturing" /> Manufacturing Technology</label>
          <label><input type="checkbox" name="businessType" value="Others" /> Others</label>

          <h3>4. Present status of the business</h3>
          <label><input type="radio" name="status" value="Conceptual" required /> Conceptual Stage</label>
          <label><input type="radio" name="status" value="Existing" /> Existing</label>

          <h3>5. Legal entity (Startup Only)</h3>
          <label><input type="checkbox" name="legalEntity" value="LLP" /> LLP</label>
          <label><input type="checkbox" name="legalEntity" value="Private Ltd" /> Private Ltd.</label>

          <h3>6. Brief description of the business</h3>
          <textarea name="businessDescription" className="input-field textarea" value={formData.businessDescription} onChange={handleChange} rows="4" required></textarea>

          <h3>7. Brief description of product/Service offered</h3>
          <textarea name="productDescription" className="input-field textarea" value={formData.productDescription} onChange={handleChange} rows="4" required></textarea>

          <h3>8. Novelty of your product/Service</h3>
          <textarea name="novelty" className="input-field textarea" value={formData.novelty} onChange={handleChange} rows="4" required></textarea>

          <h3>9. Team / Number of the employees</h3>
          <textarea name="teamSize" className="input-field textarea" value={formData.teamSize} onChange={handleChange} rows="2" required></textarea>

          <h3>10. Competitors & Competitive Advantage</h3>
          <textarea name="competitors" className="input-field textarea" value={formData.competitors} onChange={handleChange} rows="3" required></textarea>

          <h3>11. Potential market size</h3>
          <textarea name="marketSize" className="input-field textarea" value={formData.marketSize} onChange={handleChange} rows="3" required></textarea>

          <h3>12. Market survey details</h3>
          <textarea name="marketSurvey" className="input-field textarea" value={formData.marketSurvey} onChange={handleChange} rows="3" required></textarea>

          <h3>13. Validation survey/Research</h3>
          <textarea name="validationSurvey" className="input-field textarea" value={formData.validationSurvey} onChange={handleChange} rows="3" required></textarea>

          <h3>14. Estimated project cost</h3>
          <textarea name="projectCostEstimate" className="input-field textarea" value={formData.projectCostEstimate} onChange={handleChange} rows="3" required></textarea>

          <h3>15. Revenue model</h3>
          <textarea name="revenueModel" className="input-field textarea" value={formData.revenueModel} onChange={handleChange} rows="3" required></textarea>

          <h3>16. Break-up</h3>
          {requiredLabel("Pre-operative expenses (Rs.)")}
          <input type="number" name="preOp" className="input-field" value={costs.preOp} onChange={handleCostChange} required />
          {requiredLabel("Prototype Development cost (Rs.)")}
          <input type="number" name="prototype" className="input-field" value={costs.prototype} onChange={handleCostChange} required />
          {requiredLabel("Test & Marketing cost (Rs.)")}
          <input type="number" name="marketing" className="input-field" value={costs.marketing} onChange={handleCostChange} required />
          {requiredLabel("Equipment cost (Rs.)")}
          <input type="number" name="equipment" className="input-field" value={costs.equipment} onChange={handleCostChange} required />
          {requiredLabel("Working Capital cost (Rs.)")}
          <input type="number" name="capital" className="input-field" value={costs.capital} onChange={handleCostChange} required />
          {requiredLabel("Other Requirements (Rs.)")}
          <input type="number" name="other" className="input-field" value={costs.other} onChange={handleCostChange} required />
          {requiredLabel("Total cost (Rs.)")}
          <input type="number" className="input-field" value={totalCost} readOnly style={{ backgroundColor: '#eef' }} />

          <h3>17. Machinery / Capital item needed</h3>
          <textarea name="machineryNeeded" className="input-field textarea" value={formData.machineryNeeded} onChange={handleChange} rows="3" required></textarea>

          <h3>18. Services expected from PSNA Technology Foundation</h3>
          <select name="labAccess" className="input-field" value={formData.labAccess} onChange={handleChange} required>
            <option value="" disabled>Laboratory access</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <select name="libraryAccess" className="input-field" value={formData.libraryAccess} onChange={handleChange} required>
            <option value="" disabled>Library access</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <select name="technicalConsulting" className="input-field" value={formData.technicalConsulting} onChange={handleChange} required>
            <option value="" disabled>Technical Consulting</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <select name="marketAssessment" className="input-field" value={formData.marketAssessment} onChange={handleChange} required>
            <option value="" disabled>Market Assessment</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <select name="technoEconomic" className="input-field" value={formData.technoEconomic} onChange={handleChange} required>
            <option value="" disabled>Techno-Economic</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <select name="processDevelopment" className="input-field" value={formData.processDevelopment} onChange={handleChange} required>
            <option value="" disabled>Process Development</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <select name="productEvaluation" className="input-field" value={formData.productEvaluation} onChange={handleChange} required>
            <option value="" disabled>Product Evaluation</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <select name="iprAssistance" className="input-field" value={formData.iprAssistance} onChange={handleChange} required>
            <option value="" disabled>IPR Assistance</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <select name="advisoryServices" className="input-field" value={formData.advisoryServices} onChange={handleChange} required>
            <option value="" disabled>Advisory Services</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <select name="brandingMarketing" className="input-field" value={formData.brandingMarketing} onChange={handleChange} required>
            <option value="" disabled>Branding/Marketing</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
Note: There seems to be a small typo in your original HTML for "Process Development". It had `value_a="No"`. I have corrected it to `value="No"`.
          </select>

          <div className="dropdown-group">
            {requiredLabel("Any Other")}
            <select name="anyOther" className="input-field" value={formData.anyOther} onChange={handleSelectChange} required>
              <option value="" disabled>Select an option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {showAnyOtherTextarea && (
            <textarea
              name="anyOtherExplanation"
              className="input-field textarea"
              value={formData.anyOtherExplanation}
              onChange={handleChange}
              rows="3"
              placeholder="Please explain your other requirements"
              required
            ></textarea>
          )}

          {/* --- ADDED: Question 19: References --- */}
          <h3>19. References</h3>
          {requiredLabel("1. Name")}
          <input type="text" name="ref1Name" className="input-field" value={formData.ref1Name} onChange={handleChange} required />
          {requiredLabel("Organization / Designation")}
          <input type="text" name="ref1Org" className="input-field" value={formData.ref1Org} onChange={handleChange} required />
          {requiredLabel("Address")}
          <input type="text" name="ref1Address" className="input-field" value={formData.ref1Address} onChange={handleChange} required />
          {requiredLabel("Phone Number")}
          <input type="tel" name="ref1Phone" className="input-field" pattern="[0-9]{10}" value={formData.ref1Phone} onChange={handleChange} required />
          {requiredLabel("Email ID")}
          <input type="email" name="ref1Email" className="input-field" value={formData.ref1Email} onChange={handleChange} required />

          {requiredLabel("2. Name")}
          <input type="text" name="ref2Name" className="input-field" value={formData.ref2Name} onChange={handleChange} required />
          {requiredLabel("Organization / Designation")}
          <input type="text" name="ref2Org" className="input-field" value={formData.ref2Org} onChange={handleChange} required />
          {requiredLabel("Address")}
          <input type="text" name="ref2Address" className="input-field" value={formData.ref2Address} onChange={handleChange} required />
          {requiredLabel("Phone Number")}
          <input type="tel" name="ref2Phone" className="input-field" pattern="[0-9]{10}" value={formData.ref2Phone} onChange={handleChange} required />
          {requiredLabel("Email ID")}
          <input type="email" name="ref2Email" className="input-field" value={formData.ref2Email} onChange={handleChange} required />

          {/* --- ADDED: Question 20: Declaration --- */}
          <h3>20. Declaration</h3>
          <div className="declaration-container">
            <input
              type="checkbox"
              name="declaration"
              id="declaration-checkbox"
              checked={formData.declaration}
              onChange={handleCheckboxChange}
              required
            />
            <label htmlFor="declaration-checkbox" className="declaration-label">
              I/We declare that the information provided is true and not proprietary. I understand and accept the terms mentioned in the disclaimer.
            </label>
          </div>

          {requiredLabel("Date")}
          <input type="date" name="date" className="input-field" value={formData.date} onChange={handleChange} required />
          {requiredLabel("Place")}
          <input type="text" name="place" className="input-field" value={formData.place} onChange={handleChange} required />

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </>
  );
};

export default ApplicationForm;