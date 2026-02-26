const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to match content width
  await page.setViewport({ width: 1400, height: 1200 });
  
  const htmlPath = path.join(__dirname, 'poster.html');
  const fileUrl = `file://${htmlPath}`;
  
  // Wait for all network activity and images to load
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const pdfPath = path.join(__dirname, 'poster.pdf');
  
  // Get page dimensions
  const dimensions = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight
  }));
  
  await page.pdf({
    path: pdfPath,
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
  });
  
  await browser.close();
  
  console.log(`✓ PDF saved to: ${pdfPath}`);
})();
