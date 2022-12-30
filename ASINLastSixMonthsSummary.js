/**
* Accepts one ASIN as input and counts positive, negative,
* and the total number of reviews for the given ASIN based
* on the sheet, "Reviews" over the last six months.
* @param {string} asin - Target ASIN
*/

function sixMonthReviewSummary(asin) {
    let reviewCount = {
      "Positive": 0,
      "Negative": 0,
      "Total": 0,
    };
  
    // Stop function if ASIN input is empty
    if (asin === '') {
      return [[0, 0, 0]]
    }
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const reviewsSheet = spreadsheet.getSheetByName("Reviews"); // Gets table data from 'Reviews' sheet
    const lastRow = reviewsSheet.getLastRow();
    const range = reviewsSheet.getRange([`A2:D${lastRow}`]);
    const reviews = range.getValues();
  
    // Dates are used in Epoch (UNIX) Time to measure up to 6 months prior
    const today = new Date();
    const todayEpochTime = Date.parse(today);
    const sixMonthsInMilliseconds = 15552000000;
    const sixMonthsPrior = new Date(todayEpochTime - sixMonthsInMilliseconds);
    const sixMonthsPriorEpochTime = Date.parse(sixMonthsPrior);
  
    // Helper function to pull targeted reviews  
    (function selectReview() {
      for (let reviewRow of reviews) { 
        if (asin === "") break;
        if (reviewRow[1] === '') {
          continue; // Accounts for empty rows
        }
        const currentReviewDate = Date.parse(reviewRow[1]);
  
        if (currentReviewDate < sixMonthsPriorEpochTime) {
          break; // break out of loop if over 6 months prior
        }
        
        currentASIN = reviewRow[0].trim()
        currentCategory = reviewRow[3].trim().toUpperCase()
        // Loops through the ASIN parameter(s) and determines if the current
        // review contains a targeted ASIN. If so, updates the reviewCount
        if (asin === currentASIN) {
          if (currentCategory === "POSITIVE") {
            reviewCount["Positive"] += 1;
            reviewCount["Total"] += 1;
          } else {
          reviewCount["Negative"] += 1;
          reviewCount["Total"] += 1;
          }
        } 
      }
    })();
  
    let negativeReviewPercentage = 0;
    if (reviewCount["Total"] !== 0) {
      negativeReviewPercentage = reviewCount["Negative"] / reviewCount["Total"];
    }
  
    const  reviewCountTable = [[reviewCount["Total"], reviewCount["Negative"], negativeReviewPercentage]];
  
    return reviewCountTable;
  }