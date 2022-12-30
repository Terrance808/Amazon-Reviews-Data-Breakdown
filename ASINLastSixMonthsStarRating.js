/**
* Accepts an ASIN(s) as input and breaks down star ratings
* for the given ASIN based on the sheet, "Reviews"
* @param {string[]} params - Target ASIN(s). Can be one or multiple
*/

function asinStarRating(...params) {
    const asins = params.map(el => String(el));
    if (params[0] == "") return;
    
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
  
    let starRating = {
      "BAD ODOR": {"1":0, "2":0, "3":0, "4":0, "5": 0, "TOTAL":0},
      "ITEM QUALITY": {"1":0, "2":0, "3":0, "4":0, "5": 0, "TOTAL":0},
      "PRICE ISSUES": {"1":0, "2":0, "3":0, "4":0, "5": 0, "TOTAL":0},
      "EXPECTATIONS MISMANAGED": {"1":0, "2":0, "3":0, "4":0, "5": 0, "TOTAL":0},
      "DOG DIDN'T LIKE IT": {"1":0, "2":0, "3":0, "4":0, "5": 0, "TOTAL":0},
      "MADE DOG SICK": {"1":0, "2":0, "3":0, "4":0, "5": 0, "TOTAL":0},
      "CHOKING HAZARD": {"1":0, "2":0, "3":0, "4":0, "5": 0, "TOTAL":0},
      "POSITIVE": {"1":0, "2":0, "3":0, "4":0, "5": 0, "TOTAL":0},
      "NEGATIVE": {"1":0, "2":0, "3":0, "4":0, "5": 0, "TOTAL":0},
      "TOTAL": {"1":0, "2":0, "3":0, "4":0, "5": 0, "TOTAL":0},
    };
  
    // Helper function to pull targeted reviews  
    (function selectReview() {
      
      for (let reviewRow of reviews) { 
        // format spreadsheet for case and whitespace
        currentASIN = reviewRow[0].trim()
        currentRating = String(reviewRow[2]).trim()
        currentCategory = reviewRow[3].trim().toUpperCase()
  
        if (currentASIN === "" || currentRating === "" || currentCategory === "") {
          continue; // Accounts for empty rows
        }
        const currentReviewDate = Date.parse(reviewRow[1]);
  
        if (currentReviewDate < sixMonthsPriorEpochTime) {
          break; // break out of loop if over 6 months prior
        }
        
        
  
        // Loops through the ASIN parameter(s) and determines if the current
        // review contains a targeted ASIN. If so, updates the starRating hash table
        asins.forEach(asin => {
          if (asin === currentASIN) {
            starRating[currentCategory][currentRating] += 1; // update category[star rating] count
            starRating[currentCategory]["TOTAL"] += 1; // update category[total ratings] count
            starRating["TOTAL"][currentRating] += 1; // update total[star rating] count
            starRating["TOTAL"]["TOTAL"] += 1; // update total[total] count
            
            // code accounts for all categories except "NEGATIVE". This last measure adds them
            if (currentCategory !== "POSITIVE") {
              starRating["NEGATIVE"][currentRating] += 1;
              starRating["NEGATIVE"]["TOTAL"] += 1;
            }
          }
        });
      }
    })();
  
    let percentageOfComplaints = 0;
    
    let starRatingTable = [["Notes", "1", "2", "3", "4", "5", "Total", "% of Complaints"]];
    const starRatingArray = Object.entries(starRating);
    for (let tableRow of starRatingArray) {
      const ratings = Object.values(tableRow[1]);
  
      if (starRating["NEGATIVE"]["TOTAL"] !== 0) {
      percentageOfComplaints = ratings[5] / starRating["NEGATIVE"]["TOTAL"]
      }
      starRatingTable.push([tableRow[0], ...ratings, percentageOfComplaints]);
    }
  
    starRatingTable[starRatingTable.length - 3].splice(-1, 1);
    starRatingTable[starRatingTable.length - 1].splice(-1, 1);
    console.log(starRatingTable)
  
    return starRatingTable;
  }