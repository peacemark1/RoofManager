const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function generateQuotePDF(quote, company) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Calculate totals from lineItems
    const lineItems = typeof quote.lineItems === 'string' 
      ? JSON.parse(quote.lineItems) 
      : quote.lineItems;

    const logoUrl = company.logo || 'https://via.placeholder.com/200x60?text=RoofManager';
    const primaryColor = company.primaryColor || '#1e40af';

    // HTML template for quote
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Helvetica Neue', Arial, sans-serif; 
            margin: 40px; 
            color: #333;
          }
          .header { 
            text-align: center; 
            margin-bottom: 40px; 
            padding-bottom: 20px;
            border-bottom: 3px solid ${primaryColor};
          }
          .logo { 
            max-width: 200px; 
            max-height: 80px;
            margin-bottom: 15px;
          }
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: ${primaryColor};
            margin-bottom: 10px;
          }
          .quote-info { 
            margin-bottom: 30px; 
            display: flex;
            justify-content: space-between;
          }
          .info-section {
            width: 48%;
          }
          .info-section h3 {
            color: ${primaryColor};
            font-size: 16px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 14px;
          }
          .info-label {
            font-weight: 600;
            color: #666;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0; 
          }
          th { 
            background-color: ${primaryColor}; 
            color: white; 
            padding: 12px; 
            text-align: left; 
            font-weight: 600;
          }
          td { 
            padding: 12px; 
            border-bottom: 1px solid #ddd; 
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .total-section {
            margin-top: 20px;
            text-align: right;
          }
          .total-row {
            display: flex;
            justify-content: flex-end;
            gap: 20px;
            margin-bottom: 5px;
            font-size: 14px;
          }
          .grand-total {
            font-size: 20px;
            font-weight: bold;
            color: ${primaryColor};
            margin-top: 10px;
            padding-top: 10px;
            border-top: 2px solid ${primaryColor};
          }
          .notes {
            margin-top: 40px;
            padding: 15px;
            background-color: #f9fafb;
            border-radius: 8px;
            font-size: 13px;
          }
          .terms {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #999;
            padding-top: 20px;
            border-top: 1px solid #ddd;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          }
          .status-${quote.status.toLowerCase()} {
            background-color: ${quote.status === 'APPROVED' ? '#dcfce7' : quote.status === 'REJECTED' ? '#fee2e2' : '#e0f2fe'};
            color: ${quote.status === 'APPROVED' ? '#166534' : quote.status === 'REJECTED' ? '#991b1b' : '#0369a1'};
          }
        </style>
      </head>
      <body>
        <div class="header">
          ${logoUrl ? `<img src="${logoUrl}" class="logo" alt="${company.name}" />` : `<div class="company-name">${company.name}</div>`}
          <div style="font-size: 14px; color: #666;">Roofing & Construction Services</div>
        </div>
        
        <div class="quote-info">
          <div class="info-section">
            <h3>Quote Information</h3>
            <div class="info-row">
              <span class="info-label">Quote #:</span>
              <span>${quote.quoteNumber}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date:</span>
              <span>${new Date(quote.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Valid Until:</span>
              <span>${new Date(quote.validUntil).toLocaleDateString()}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="status-badge status-${quote.status.toLowerCase()}">${quote.status}</span>
            </div>
          </div>
          
          <div class="info-section">
            <h3>Job Details</h3>
            <div class="info-row">
              <span class="info-label">Project:</span>
              <span>${quote.job?.title || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Address:</span>
              <span>${quote.job?.address || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Property Type:</span>
              <span>${quote.job?.propertyType || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th style="width: 50%;">Description</th>
              <th style="width: 15%;">Quantity</th>
              <th style="width: 17%;">Unit Price</th>
              <th style="width: 18%;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${lineItems.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>$${Number(item.unitPrice).toFixed(2)}</td>
                <td>$${Number(item.total).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>$${Number(quote.subtotal).toFixed(2)}</span>
          </div>
          ${quote.discount > 0 ? `
          <div class="total-row">
            <span>Discount:</span>
            <span style="color: #16a34a;">-$${Number(quote.discount).toFixed(2)}</span>
          </div>
          ` : ''}
          <div class="total-row">
            <span>Tax:</span>
            <span>$${Number(quote.tax).toFixed(2)}</span>
          </div>
          <div class="total-row grand-total">
            <span>Total:</span>
            <span>$${Number(quote.total).toFixed(2)}</span>
          </div>
        </div>
        
        ${quote.notes ? `
        <div class="notes">
          <strong>Notes:</strong><br/>
          ${quote.notes}
        </div>
        ` : ''}
        
        ${quote.termsAndConditions ? `
        <div class="terms">
          <strong>Terms & Conditions:</strong><br/>
          ${quote.termsAndConditions}
        </div>
        ` : ''}
        
        ${quote.approval ? `
        <div class="notes" style="margin-top: 20px;">
          <strong>Approval:</strong><br/>
          Signed by: ${quote.approval.signedBy}<br/>
          Date: ${new Date(quote.approval.signedAt).toLocaleString()}
        </div>
        ` : ''}
        
        <div class="footer">
          <p>Thank you for choosing ${company.name} for your roofing needs!</p>
          <p>${company.name} | ${company.subdomain}.roofmanager.com</p>
        </div>
      </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({ 
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    // Ensure uploads/quotes directory exists
    const uploadsDir = path.join(__dirname, '../uploads/quotes');
    await fs.mkdir(uploadsDir, { recursive: true });

    const filename = `quote-${quote.quoteNumber.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
    const filepath = path.join(uploadsDir, filename);

    await fs.writeFile(filepath, pdfBuffer);

    return {
      filepath,
      filename,
      url: `/uploads/quotes/${filename}`
    };
  } finally {
    await browser.close();
  }
}

module.exports = { generateQuotePDF };
