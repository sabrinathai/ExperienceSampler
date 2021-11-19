function doPost(e) {
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var database = SpreadsheetApp.openById(""); //insert your database ID between the quotation marks
    var splicedDataset = SpreadsheetApp.openById(""); //insert your spliced database id between the quotation marks
    var compliance = SpreadsheetApp.openById(""); //insert your compliance database id between the quotation marks
    var participant_id = e.parameters['participant_id'][0];
    var PIDJSON = JSON.stringify(participant_id); 
    var PID = JSON.parse(PIDJSON);
    var sheet = database.getSheetByName(PID);
    var splicedSheet = splicedDataset.getSheetByName(PID);
    if (database.getSheetByName(PID) == null){
    //inserts sheet at the end
      var sheetIndex = database.getNumSheets()+1;
      sheet = database.insertSheet(PID, sheetIndex).setName(PID);
      splicedSheet = splicedDataset.insertSheet(PID, sheetIndex).setName(PID);
      var complianceSheet = compliance.getSheets()[0];
      var complianceNewRow = complianceSheet.getLastRow()+1;
      var today = new Date();
      complianceSheet.getRange(complianceNewRow,1).setValue(PID);
      complianceSheet.getRange(complianceNewRow,4).setValue(today);
      var endYear = today.getFullYear(), endMonth = today.getMonth();
      //the number of days you add is equal to the number of days you collect data. If you choose to use the compliance checker, add 2 to the number of 
      //data colsection days
      var endDate = today.getDate() + 9;
      var daysAfterDataCollection = new Date(endYear, endMonth, endDate);
      complianceSheet.getRange(complianceNewRow,5).setValue(daysAfterDataCollection);
      //this code will delete the extra columns in each sheet so can write more data to each spreadsheet
      //Each spreadsheet can only have a maximum of 2 million cells
      sheet.deleteColumns(3, 24);
      splicedSheet.deleteColumns(6, 21);
    } 
    var newRow = sheet.getLastRow()+1;
    for (var key = 0; key < Object.keys(e.parameters).length; key++){ 
      sheet.getRange(newRow, 1).setValue(Object.keys(e.parameters)[key]);
      splicedSheet.getRange(newRow, 1).setValue(Object.keys(e.parameters)[key]);
      sheet.getRange(newRow, 2).setValue(e.parameters[Object.keys(e.parameters)[key]]);
      splicedSheet.getRange(newRow, 4).setValue(e.parameters[Object.keys(e.parameters)[key]]);
      newRow = newRow + 1;
    }
    //create a log of what is going on
    //var doc = DocumentApp.openById("1bGnqx4Iw8yoXSn8z6hSfiuxFQE9Rq16rHYUfr1_5fpM");
    //var body = doc.getBody();
    //body.appendParagraph(Logger.getLog());
    //return HtmlService.createHtmlOutput(Logger.getLog());
    return ContentService.createTextOutput(JSON.stringify({"result":"success", "row": nextRow})).setMimeType(ContentService.MimeType.JSON);
  } catch(e) {
    //if error return this
    return ContentService.createTextOutput(JSON.stringify({"result":"error", "error": e})).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}



