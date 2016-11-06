function cleanData() {
  var totalSheets = SpreadsheetApp.getActiveSpreadsheet().getNumSheets();
  for (var i=0; i< totalSheets; i++) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[i];
    Logger.log(sheet);
    removeDuplicates(sheet);
    removeEmptyRows(sheet);
    Logger.log("I ran the for function");
  }
}

function removeDuplicates(sheet) {
  //var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var newData = new Array();
  for(i in data){
    var row = data[i];
    var duplicate = false;
    for(j in newData){
      if(row.join() == newData[j].join()){
        duplicate = true;
      }
    }
    if(!duplicate){
      newData.push(row);
    }
  }
  sheet.clearContents();
  sheet.getRange(1, 1, newData.length, newData[0].length).setValues(newData);
}

function removeEmptyRows(sheet){
  //var sheet = SpreadsheetApp.getActiveSheet();
  var maxRows = sheet.getMaxRows(); 
  var lastRow = sheet.getLastRow();
  sheet.deleteRows(lastRow+1, maxRows-lastRow);
}
