const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");

// create application
const app = express();

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/template/home.html`);
});

app.get("/read-file", async (req, res) => {
  // Create a browser instance
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();

  // await page.goto("https://www.daraz.com.bd/#hp-just-for-you");

  //Get HTML content from HTML file
  const html = fs.readFileSync(`${__dirname}/template/home.html`, "utf-8");
  await page.setContent(html, { waitUntil: "domcontentloaded" });

  //To reflect CSS used for screens instead of print
  await page.emulateMediaType("screen");

  // Downlaod the PDF
  const pdf = await page.pdf({
    path: "result.pdf",
    margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
    printBackground: true,
    format: "A4",
    displayHeaderFooter: true,
    footerTemplate: "<h5>Footer Content</h5>",
  });

  // Close the browser instance
  await browser.close();

  res.send("pdf");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`your server is running at port ${PORT}...`);
});
