var complianceSheet = SpreadsheetApp.openById("16VZAKlW0thWRyWwwxvUrq2xfjSJHgWKTZN7oDq5gDvw"); //replace this string of numbers & letters with your compliance sheet ID
var splicedDataset = SpreadsheetApp.openById("1Q7mStN6L8_ABLv0T8scH3obDoWaJxXkSsNrHABhDo9o"); //replace this string of numbers & letters with your spliced database ID
function findCell(PID) {
  var compliance = complianceSheet.getSheets()[0];
  var dataRange = compliance.getDataRange();
  var values = dataRange.getValues();
  for (var i = 0; i < values.length; i++) {
    var row = "";
    for (var j = 0; j < values[i].length; j++) {     
      if (values[i][j] == PID) {
        row = i + 1;
        return row; 
        break;
      }
    }    
  }  
}

function findNextEmptyColumn(rowNum) {
  var compliance = complianceSheet.getSheets()[0];
  var dataRange = compliance.getDataRange();
  var values = dataRange.getValues()[rowNum - 1];
  Logger.log("find next empty column values: " + values);
  var column = "";
  for (var j = 5; j < values.length; j++) {
    if (values[j] === "") {
      column = j + 1;
      return column; 
      break;
    }
  }    
}  

function endOfDataCollectionPeriod(rowNum){
  var compliance = complianceSheet.getSheets()[0];
  var dataRange = compliance.getDataRange();
  var values = dataRange.getValues()[rowNum - 1];
  Logger.log(values);
  var endOfDataCollection = new Date(values[4]).getTime();
  return endOfDataCollection;
}

function startOfDataCollectionPeriod(rowNum){
  var compliance = complianceSheet.getSheets()[0];
  var dataRange = compliance.getDataRange();
  var values = dataRange.getValues()[rowNum - 1];
  var startOfDataCollection = new Date(values[3]).getTime();
  return startOfDataCollection;
}

/*function isValidDate(date)
{
    var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
    if (matches == null) return false;
    var d = matches[2];
    var m = matches[1] - 1;
    var y = matches[3];
    var composedDate = new Date(y, m, d);
    return composedDate.getDate() == d &&
            composedDate.getMonth() == m &&
            composedDate.getFullYear() == y;
}*/

function checkCompletedSurveys() {
  var sheetIndex = splicedDataset.getNumSheets();
  var sheetNames = [];
  var sheets = splicedDataset.getSheets();
  for (var i = 0; i < sheetIndex; i++){
    sheetNames.push(sheets[i].getSheetName());
  }
  for (var i = 0; i < sheetNames.length; i++) {
    var rowNum = Number(findCell(sheetNames[i]));
    var endDate = endOfDataCollectionPeriod(rowNum);
    var startDate = startOfDataCollectionPeriod(rowNum);
    var today = new Date().getTime();
    if (today <= endDate && today > startDate) {
      getUniqueKeys(sheetNames[i]);
    }
  }
}

function spliceData() {
  var sheetIndex = splicedDataset.getNumSheets();
  var sheetNames = [];
  var sheets = splicedDataset.getSheets();
  for (var i = 0; i < sheetIndex; i++){
    sheetNames.push(sheets[i].getSheetName());
  }
  for (var i = 0; i < sheetNames.length; i++) {
    Logger.log(sheetNames[i]);
    var rowNum = Number(findCell(sheetNames[i]));
    Logger.log("row number: " + rowNum);
    var endDate = endOfDataCollectionPeriod(rowNum);
    var startDate = startOfDataCollectionPeriod(rowNum);
    var today = new Date().getTime();
    if (today <= endDate && today > startDate) {
      spliceVariableName(sheetNames[i]);
    }
  }
}

function spliceVariableName(sheetName){
  var sheet = splicedDataset.getSheetByName(sheetName);
  var uniqueResponses = [], uniqueKeysArray = [], variableNames = [], variableNameTimestamp = [], 
      timestamp = [], responseLabel = [], splicedVariableName = [], lastRow = sheet.getLastRow(), 
      startColumn = sheet.getRange("e:e"); 
  var values = startColumn.getValues();
  var startRow = 0;
  var rowsToCheck;
  while (values[startRow][0] != "") {
    startRow++
  }
  rowsToCheck = lastRow - startRow;
  var actualStartRow = startRow + 1;
  if (rowsToCheck > 1){
    responseLabel = sheet.getRange(actualStartRow,1,rowsToCheck,1).getValues();
  //splice the variable name into appropriate names
  for (var i = 0; i < responseLabel.length; i++) {
    uniqueResponses.push(responseLabel[i][0]);
    //String(uniqueResponses[i]);  
    if (typeof uniqueResponses[i] !== 'string') return;
    var numberOfUnderscores = uniqueResponses[i].split(/_(.+)/).length-1;
      if (numberOfUnderscores == 0) {
        uniqueKeysArray.push(uniqueResponses[i].split("_",1)[0]);
        variableNames.push("");
        variableNameTimestamp.push("");
        timestamp.push("");
      }
      else if (numberOfUnderscores == 1){
        uniqueKeysArray.push(uniqueResponses[i].split("_",1)[0]);
        variableNames.push(uniqueResponses[i].split("_",2)[1]);
        variableNameTimestamp.push("");
        timestamp.push("");
      }
      else if (numberOfUnderscores > 1) {
        uniqueKeysArray.push(uniqueResponses[i].split("_",1)[0]);
        variableNames.push(uniqueResponses[i].split("_",2)[1]);
        variableNameTimestamp.push(uniqueResponses[i].split(/_(.+)/)[1]);
        timestamp.push(variableNameTimestamp[i].split(/_(.+)/)[1]);
      }
      splicedVariableName.push([ uniqueKeysArray[i], variableNames[i], timestamp[i]]);
      sheet.getRange(actualStartRow, 1, splicedVariableName.length, 3).setValues(splicedVariableName);
    }
  }
}

function getUniqueKeys(sheetName) {
  var sheet = splicedDataset.getSheetByName(sheetName);
  var compliance = complianceSheet.getSheets()[0];
  var PID = sheet.getSheetName();
  var uniqueKeys = [], uniqueKeysArray = [], removedItems, completedSurveys = [], date, today, yesterday, numberOfEntries, checkDate; 
  var lastRow = sheet.getLastRow();
  var startColumn = sheet.getRange("e:e"); 
  var values = startColumn.getValues();
  var startRows = [];
  var startRow = 0;
  var rowsToCheck;
  for (startRow = 0; startRow < values.length && values[startRow][0] != ""; ++startRow) {
    startRows.push(values[startRow][0]);
    startRow = startRows.length;
  }
  rowsToCheck = lastRow - startRow;
  var actualStartRow = startRow + 1;
  if (rowsToCheck > 1){
    var actualStartRow = startRow + 1;
    var range = sheet.getRange(actualStartRow + 1,1);
    var newData = range.getValue();
   uniqueKeys = sheet.getRange(actualStartRow,1,rowsToCheck,1).getValues();
    for (var i = 0; i < uniqueKeys.length; i++){
      uniqueKeysArray.push(uniqueKeys[i][0]);
    }    
    for (var i = 0; i < uniqueKeysArray.length; i++) {
      var value = uniqueKeysArray[i];
      var string = new RegExp(".completed");
      if (string.test(value)) {
        var splicedCompletedSurvey = value.split(".");
        Logger.log(splicedCompletedSurvey);
        var completedUniqueKey = splicedCompletedSurvey[0];
        Logger.log(completedUniqueKey);
        completedSurveys.push(completedUniqueKey);
      }
    }
    //this will only count unique keys onces; sometimes participants may send their data more than once by accident
    //this will prevent these duplicate entries from being counted
    var uniqueCompletedSurveys = eliminateDuplicates(completedSurveys);
    date = new Date();
    today = date.getTime();
    yesterday = date.setDate(date.getDate() - 1); 
    var numberOfEntries = 0;
    for (var i = 0; i < uniqueCompletedSurveys.length; i++){
      if (completedSurveys[i] < today && yesterday < uniqueCompletedSurveys[i]){
        numberOfEntries++;
      }
    }
    checkDate = new Date();
    var rowNum = findCell(PID);
    var complianceColumn = findNextEmptyColumn(rowNum);
    //Logger.log("Original compliance column: " + complianceColumn);
    /*if (complianceColumn < 6) {
      complianceColumn = 6;
    }*/
    Logger.log(complianceColumn);
    compliance.getRange(rowNum,complianceColumn,1,1).setValue(numberOfEntries);
    compliance.getRange(rowNum,complianceColumn+1,1,1).setValue(checkDate);
    sheet.getRange(actualStartRow, 5, rowsToCheck, 1).setValue("Checked");
  }
  else {
    var checkDate = new Date();
    var numberOfEntries = 0;
    var rowNum = findCell(PID);
    var complianceColumn = findNextEmptyColumn(rowNum);
    compliance.getRange(rowNum,complianceColumn,1,1).setValue(numberOfEntries);
    compliance.getRange(rowNum,complianceColumn+1,1,1).setValue(checkDate);
  }
 }

function spliceVariableNameIntakeSession(sheetName){
  var sheet = splicedDataset.getSheetByName(sheetName);
  var uniqueResponses = [], uniqueKeysArray = [], variableNames = [], variableNameTimestamp = [], 
      timestamp = [], responseLabel = [], splicedVariableName = [], lastRow = sheet.getLastRow(), 
      startColumn = sheet.getRange("e:e"); 
  var values = startColumn.getValues();
  var startRow = 0;
  var rowsToCheck;
  var startRows = [];
  for (var startRow = 0; startRow < values.length && values[startRow][0] != ''; ++startRow) {
    startRows.push(values[startRow][0]);
    startRow = startRows.length;
  }
  rowsToCheck = lastRow - startRow;
  var actualStartRow = startRow + 1;
  if (rowsToCheck > 1){
    responseLabel = sheet.getRange(actualStartRow,1,rowsToCheck,1).getValues();
  //splice the variable name into appropriate names
  for (var i = 0; i < responseLabel.length; i++) {
    uniqueResponses.push(responseLabel[i][0]);
    //String(uniqueResponses[i]);  
    if (typeof uniqueResponses[i] !== 'string') return;
    var numberOfUnderscores = uniqueResponses[i].split(/_(.+)/).length-1;
      if (numberOfUnderscores == 0) {
        uniqueKeysArray.push(uniqueResponses[i].split("_",1)[0]);
        variableNames.push("");
        variableNameTimestamp.push("");
        timestamp.push("");
      }
      else if (numberOfUnderscores == 1){
        uniqueKeysArray.push(uniqueResponses[i].split("_",1)[0]);
        variableNames.push(uniqueResponses[i].split("_",2)[1]);
        variableNameTimestamp.push("");
        timestamp.push("");
      }
      else if (numberOfUnderscores > 1) {
        uniqueKeysArray.push(uniqueResponses[i].split("_",1)[0]);
        variableNames.push(uniqueResponses[i].split("_",2)[1]);
        variableNameTimestamp.push(uniqueResponses[i].split(/_(.+)/)[1]);
        timestamp.push(variableNameTimestamp[i].split(/_(.+)/)[1]);
      }
      splicedVariableName.push([ uniqueKeysArray[i], variableNames[i], timestamp[i]]);
      sheet.getRange(actualStartRow, 1, splicedVariableName.length, 3).setValues(splicedVariableName);
      sheet.getRange(actualStartRow, 5, rowsToCheck, 1).setValue("Intake Session");
    }
  }
}

function eliminateDuplicates(arr) {
  var i,
      len=arr.length,
      out=[],
      obj={};

  for (i=0;i<len;i++) {
    obj[arr[i]]=0;
  }
  for (i in obj) {
    out.push(i);
  }
  return out;
}
