Amazon Review Data Breakdown
============================================================================
Extracts review data from a Google Sheet and provides tables to summarize
feedback from customers.

The sheet, titled "Reviews" by default, has four columns (ASIN, Date, Star Rating, Category).

There are several of pieces of code that could call for the use of a library. However Google advises
against this as it could lead to slower performance. The tables generated and this reposititory
is ideally suited for sellers with a lot ASINs and reviews, where tracking can be difficult manually.

Usage
----------------------------------------------------------------------------
* Copy the code from each Javascript file into seperate Google Apps Scripts
* Title each script with the extention ".gs"
* Create a sheet with the title "Reviews"
* The Reviews sheet should have four columns, from left to right, ASIN, Date, Star Rating, Category
* The Date column should be in descending order
* Use the functions provided in a seperate sheet.
* The functions can take multiple cells of ASINs as input