// backend/routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const Application = require('../models/Application'); // Our schema from Step 3
const { sendConfirmationEmails } = require('../services/emailService'); // Our service from Step 4

// --- ENDPOINT 1: SUBMIT THE FORM ---
// This runs when the user clicks 'Submit' in React
router.post('/submit', async (req, res) => {
  try {
    // 1. Create a new application object from the data React sent
    const newApplication = new Application(req.body);
    
    // 2. Save it to the MongoDB database
    const savedApplication = await newApplication.save();

    // 3. Generate the unique download link
    //    We use the new application's ID (`savedApplication._id`)
    //    In production, change 'http://localhost:5000' to your live backend URL
    const baseUrl = process.env.RENDER_EXTERNAL_URL || 'http://localhost:5000';
    const downloadLink = `${baseUrl}/api/download-pdf/${savedApplication._id}`;

    // 4. Send the confirmation emails
    await sendConfirmationEmails(savedApplication, downloadLink);

    // 5. Send a success response back to React
    res.status(201).json({ 
      message: 'Application submitted successfully! Confirmation emails sent.',
      applicationId: savedApplication._id 
    });

  } catch (error) {
    console.error('Submission Error:', error);
    // If anything fails (db save, email send), send an error to React
    res.status(500).json({ message: 'Server error during submission.', error: error.message });
  }
});

// --- ENDPOINT 2: DOWNLOAD THE PDF ---
// This runs when the user clicks the link in their email
router.get('/download-pdf/:id', async (req, res) => {
  try {
    // 1. Get the ID from the URL (e.g., .../download-pdf/60f8abc123...)
    const applicationId = req.params.id;
    
    // 2. Find the matching application in the database
    const application = await Application.findById(applicationId);

    // 3. Handle if application not found (bad link)
    if (!application) {
      return res.status(404).send('<h1>Application not found.</h1><p>The link may be invalid or expired.</p>');
    }

    // 4. Generate the FULL HTML content for the PDF
    const htmlContent = `
      <html>
        <head>
          <style>
            body { 
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
              margin: 40px; 
              font-size: 14px; 
              line-height: 1.6; 
            }
            h1 { 
              color: #333; 
              text-align: center; 
              border-bottom: 2px solid #333; 
              padding-bottom: 10px; 
            }
            h3 { 
              color: #555; 
              border-bottom: 1px solid #eee; 
              padding-bottom: 5px; 
              margin-top: 30px; 
            }
            .section { 
              margin-bottom: 25px; 
              page-break-inside: avoid; /* Prevents sections from splitting across pages */
            }
            .field { 
              margin-bottom: 10px; 
            }
            .field strong { 
              display: inline-block; 
              width: 250px; 
              color: #555; 
            }
            p { 
              white-space: pre-wrap; /* This respects newlines in textareas */
              margin: 0;
            }
            .ref-group {
              border-top: 1px dashed #ccc;
              padding-top: 15px;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <h1>PSNA Technology Foundation - Application</h1>

          <div class="section">
            <h3>1. Name of the Business</h3>
            <p>${application.businessName}</p>
          </div>

          <div class="section">
            <h3>2. Primary Applicant / Entrepreneur</h3>
            <div class="field"><strong>Full Name:</strong> ${application.fullName}</div>
            <div class="field"><strong>Age:</strong> ${application.age}</div>
            <div class="field"><strong>Mobile Number:</strong> ${application.mobile}</div>
            <div class="field"><strong>Email ID:</strong> ${application.email}</div>
            <div class="field"><strong>Postal Address:</strong> ${application.address}</div>
            <div class="field"><strong>City:</strong> ${application.city}</div>
            <div class="field"><strong>State:</strong> ${application.state}</div>
            <div class="field"><strong>Postal Code:</strong> ${application.postalCode}</div>
            <div class="field"><strong>Country:</strong> ${application.country}</div>
            <div class="field"><strong>Highest Education:</strong> ${application.education}</div>
          </div>
          
          <div class="section">
            <h3>3. Type of the Business</h3>
            <p>${application.businessType.join(', ')}</p>
          </div>
          
          <div class="section">
            <h3>4. Present status of the business</h3>
            <p>${application.status}</p>
          </div>

          <div class="section">
            <h3>5. Legal entity (Startup Only)</h3>
            <p>${application.legalEntity.join(', ')}</p>
          </div>

          <div class="section">
            <h3>6. Brief description of the business</h3>
            <p>${application.businessDescription}</p>
          </div>

          <div class="section">
            <h3>7. Brief description of product/Service offered</h3>
            <p>${application.productDescription}</p>
          </div>

          <div class="section">
            <h3>8. Novelty of your product/Service</h3>
            <p>${application.novelty}</p>
          </div>

          <div class="section">
            <h3>9. Team / Number of the employees</h3>
            <p>${application.teamSize}</p>
          </div>

          <div class="section">
            <h3>10. Competitors & Competitive Advantage</h3>
            <p>${application.competitors}</p>
          </div>

          <div class="section">
            <h3>11. Potential market size</h3>
            <p>${application.marketSize}</p>
          </div>

          <div class="section">
            <h3>12. Market survey details</h3>
            <p>${application.marketSurvey}</p>
          </div>

          <div class="section">
            <h3>13. Validation survey/Research</h3>
            <p>${application.validationSurvey}</p>
          </div>

          <div class="section">
            <h3>14. Estimated project cost</h3>
            <p>${application.projectCostEstimate}</p>
          </div>

          <div class="section">
            <h3>15. Revenue model</h3>
            <p>${application.revenueModel}</p>
          </div>

          <div class="section">
            <h3>16. Break-up</h3>
            <div class="field"><strong>Pre-operative expenses (Rs.):</strong> ${application.costs.preOp}</div>
            <div class="field"><strong>Prototype Development cost (Rs.):</strong> ${application.costs.prototype}</div>
            <div class="field"><strong>Test & Marketing cost (Rs.):</strong> ${application.costs.marketing}</div>
            <div class="field"><strong>Equipment cost (Rs.):</strong> ${application.costs.equipment}</div>
            <div class="field"><strong>Working Capital cost (Rs.):</strong> ${application.costs.capital}</div>
            <div class="field"><strong>Other Requirements (Rs.):</strong> ${application.costs.other}</div>
            <div class="field"><strong>Total cost (Rs.):</strong> ${application.totalCost}</div>
          </div>

          <div class="section">
            <h3>17. Machinery / Capital item needed</h3>
            <p>${application.machineryNeeded}</p>
          </div>

          <div class="section">
            <h3>18. Services expected from PSNA Technology Foundation</h3>
            <div class="field"><strong>Laboratory access:</strong> ${application.labAccess}</div>
            <div class="field"><strong>Library access:</strong> ${application.libraryAccess}</div>
            <div class="field"><strong>Technical Consulting:</strong> ${application.technicalConsulting}</div>
            <div class="field"><strong>Market Assessment:</strong> ${application.marketAssessment}</div>
            <div class="field"><strong>Techno-Economic:</strong> ${application.technoEconomic}</div>
            <div class="field"><strong>Process Development:</strong> ${application.processDevelopment}</div>
            <div class="field"><strong>Product Evaluation:</strong> ${application.productEvaluation}</div>
            <div class="field"><strong>IPR Assistance:</strong> ${application.iprAssistance}</div>
            <div class="field"><strong>Advisory Services:</strong> ${application.advisoryServices}</div>
            <div class="field"><strong>Branding/Marketing:</strong> ${application.brandingMarketing}</div>
            <div class="field"><strong>Any Other:</strong> ${application.anyOther}</div>
            ${application.anyOther === 'Yes' ? `<div class="field"><strong>Explanation:</strong> ${application.anyOtherExplanation}</div>` : ''}
          </div>

          <div class="section">
            <h3>19. References</h3>
            
            <div class="ref-group">
              <div class="field"><strong>Reference 1 - Name:</strong> ${application.ref1Name}</div>
              <div class="field"><strong>Organization / Designation:</strong> ${application.ref1Org}</div>
              <div class="field"><strong>Address:</strong> ${application.ref1Address}</div>
              <div class="field"><strong>Phone Number:</strong> ${application.ref1Phone}</div>
              <div class="field"><strong>Email ID:</strong> ${application.ref1Email}</div>
            </div>

            <div class="ref-group">
              <div class="field"><strong>Reference 2 - Name:</strong> ${application.ref2Name}</div>
              <div class="field"><strong>Organization / Designation:</strong> ${application.ref2Org}</div>
              <div class="field"><strong>Address:</strong> ${application.ref2Address}</div>
              <div class="field"><strong>Phone Number:</strong> ${application.ref2Phone}</div>
              <div class="field"><strong>Email ID:</strong> ${application.ref2Email}</div>
            </div>
          </div>

          <div class="section">
            <h3>20. Declaration</h3>
            <div class="field"><strong>Agreed to Declaration:</strong> ${application.declaration ? 'Yes' : 'No'}</div>
            <div class="field"><strong>Date:</strong> ${application.date}</div>
            <div class="field"><strong>Place:</strong> ${application.place}</div>
          </div>

        </body>
      </html>
    `;

    // 5. Generate PDF with Puppeteer
    const browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // Good for server environments
    });
    const page = await browser.newPage();
    
    // Set the HTML content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Create the PDF in memory
    const pdfBuffer = await page.pdf({ 
      format: 'A4',
      printBackground: true,
      margin: { // Add some margins for a cleaner look
        top: '40px',
        right: '40px',
        bottom: '40px',
        left: '40px'
      }
    });
    
    // Close the browser
    await browser.close();

    // 6. Send the PDF as a download
    // Set headers to tell the browser it's a file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Application-${application.fullName}.pdf"`);
    
    // Send the PDF buffer
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).send('<h1>Error generating PDF</h1><p>Sorry, we were unable to generate your PDF. Please try again later.</p>');
  }
});

module.exports = router;