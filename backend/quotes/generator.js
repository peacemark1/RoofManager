async function generateQuotePDF(quote, company) {
  // PDF generation placeholder - returns null URL
  // In production, use puppeteer or a PDF library
  console.log(`PDF generation requested for quote ${quote.quoteNumber}`);
  return null;
}

module.exports = { generateQuotePDF };
