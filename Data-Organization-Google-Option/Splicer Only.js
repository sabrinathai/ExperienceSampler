var splicedDataset = SpreadsheetApp.openById("1KLSJncOEYlIbq5BhOZqgOJQwrUhyXfIdD6qbKi6XDqA");

function spliceVariableName(){
  var sheet = splicedDataset.getSheetByName('089'); //enter sheet name here. It should be the participant's ID number
  var uniqueResponses = [], uniqueKeysArray = [], variableNames = [], variableNameTimestamp = [], 
      timestamp = [], responseLabel = [], splicedVariableName = [], lastRow = sheet.getLastRow(), 
      startColumn = sheet.getRange("e:e"); 
  var values = startColumn.getValues();
  var startRow = 0; //You can adjust the startRow number to the specific row that needs to be spliced
  var rowsToCheck;
  var startRows = [];
  for (var startRow = 0; startRow < values.length && values[startRow][0] != ''; ++startRow) {
    startRows.push(values[startRow][0]);
    startRow = startRows.length;
  }
  rowsToCheck = lastRow - startRow; //you can also set the lastRow to check
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
