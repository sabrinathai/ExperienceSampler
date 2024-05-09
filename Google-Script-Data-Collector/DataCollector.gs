function doPost(e) {
  var lock = LockService.getPublicLock();
  lock.waitLock(180000);
  
  try {
    var database = SpreadsheetApp.openById(""); //replace this string of numbers & letters with your database ID
    var splicedDataset = SpreadsheetApp.openById(""); //replace this string of numbers & letters with your spliced database id // https://docs.google.com/spreadsheets/d/1b_flXWXDJnVyWp2eb5JgyPzRZbPDKduFF4dbY75cHsI/edit#gid=0
    var compliance = SpreadsheetApp.openById("");
    
    var participant_id = e.parameters['participant_id'][0];
    var PIDJSON = JSON.stringify(participant_id); 
    var PID = JSON.parse(PIDJSON);

    var sheet = database.getSheetByName(PID);
    var splicedSheet = splicedDataset.getSheetByName(PID);
    
    if (!sheet) {
      var sheetIndex = database.getNumSheets() + 1;
      sheet = database.insertSheet(PID, sheetIndex).setName(PID);
      splicedSheet = splicedDataset.insertSheet(PID, sheetIndex).setName(PID);
      // populate the complicant sheet with relevant data
      // Code to populate compliance sheet...
      var complianceSheet = compliance.getSheets()[0];
      var complianceNewRow = complianceSheet.getLastRow()+1;
      var today = new Date();
      complianceSheet.getRange(complianceNewRow,1).setValue(PID);
      complianceSheet.getRange(complianceNewRow,4).setValue(today);
      var startYear = today.getFullYear(), startMonth = today.getMonth();
      var startDate = today.getDate() + 1; 
      var startDay = new Date(startYear, startMonth, startDate);
      complianceSheet.getRange(complianceNewRow,5).setValue(startDay);
      var endYear = today.getFullYear(), endMonth = today.getMonth();
      var endDate = today.getDate() + 16;
      var daysAfterDataCollection = new Date(endYear, endMonth, endDate);
      complianceSheet.getRange(complianceNewRow,6).setValue(daysAfterDataCollection);
       //this code will delete the extra columns in each sheet so can write more data to each spreadsheet
      //Each spreadsheet can only have a maximum of 2 million cells
      sheet.deleteColumns(3, 24);
      splicedSheet.deleteColumns(6, 21);
    } 
    var dataKeys = Object.keys(e.parameters);
    var numRows = dataKeys.length;
    var newData = new Array(numRows);
    for (var key = 0; key < numRows; key++) {
      newData[key] = [dataKeys[key], e.parameters[dataKeys[key]]];
    }
    
    var newRowIndex = sheet.getLastRow() + 1;
    sheet.getRange(newRowIndex, 1, numRows, 2).setValues(newData);
    splicedSheet.getRange(newRowIndex, 1, numRows, 2).setValues(newData);
    
    // Logging to a separate sheet in Google Sheets...
    
    return ContentService.createTextOutput(JSON.stringify({"result":"success", "row": newRowIndex}));
  } catch (e) {
    // Logging error details...
    
    return ContentService.createTextOutput(JSON.stringify({"result":"error", "error": e}));
  } finally {
    lock.releaseLock();
  }
}
