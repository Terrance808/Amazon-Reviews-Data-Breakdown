/**
* Accepts ASIN(s) as input and breaks down the percentages
* of each review type within the last 12 months
* @param {string[]} param - Can be one or multiple ASINs
*/
function getReviewBreakdownLastTwelveMonths(...param) {
    const asins = param.map(el => String(el))
    let reviewCount = {
      "BAD ODOR": 0,
      "ITEM QUALITY": 0,
      "PRICE ISSUES": 0,
      "EXPECTATIONS MISMANAGED": 0,
      "DOG DIDN'T LIKE IT": 0,
      "MADE DOG SICK": 0,
      "CHOKING HAZARD": 0,
      "TOTAL": 0
    }
  
    // Stop function if first ASIN input is empty
    if (asins[0] === '') {
      return Object.entries(reviewCount)
    }
  
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const reviewsSheet = spreadsheet.getSheetByName("Reviews"); // Gets table data from 'Reviews' sheet
    const lastRow = reviewsSheet.getLastRow();
    const range = reviewsSheet.getRange([`A2:D${lastRow}`]);
    const reviews = range.getValues();
  
    // Dates are used in Epoch (UNIX) Time to measure up to 6 months prior
    const today = new Date();
    const todayEpochTime = Date.parse(today);
    const twelveMonthsInMilliseconds = 31536000000;
    const twelveMonthsPrior = new Date(todayEpochTime - twelveMonthsInMilliseconds);
    const twelveMonthsPriorEpochTime = Date.parse(twelveMonthsPrior);
    
    let selectedReviews = []; // Holds reviews for ASIN(s) inputs
  
    // Helper function to pull targeted reviews
    (function selectReview() {
      for (let reviewRow of reviews) {
        const currentReviewDate = Date.parse(reviewRow[1]);
        if (currentReviewDate < twelveMonthsPriorEpochTime) {
          break; // break out of loop if over 12 months prior
        }
  
        // format spreadsheet for case and whitespace
        currentASIN = reviewRow[0].trim()
        currentDate = reviewRow[1]
        currentRating = String(reviewRow[2]).trim()
        currentCategory = reviewRow[3].trim().toUpperCase()
        
        if (currentDate === "" || currentCategory === "") {
          continue; // skip empty rows
        }
  
        if (currentCategory === "POSITIVE") {
          continue; // Ignore positive review
        }
        // Loops through the ASIN parameter(s) and determines if the current
        // review contains a targeted ASIN. If so, updates the reviewCount and selectedReviews objects
        for (let asin of asins) {
          if (asin === currentASIN) {
            reviewCount[currentCategory] += 1;
            reviewCount["TOTAL"] += 1;
            selectedReviews.push(reviewRow);
            break;
          }
        }
      }
    })();
    
    let reviewCountTable = [];
    const reviewCountArray = Object.entries(reviewCount);
    for (let tableRow of reviewCountArray) {
      negativeReviewPercent = tableRow[1] / reviewCount["TOTAL"]
      if (!negativeReviewPercent) negativeReviewPercent = 0 // avoid 0 division error
      
      reviewCountTable.push([...tableRow, negativeReviewPercent]) // Format table to get returned to sheet
    }
  
    return reviewCountTable;
  }
  