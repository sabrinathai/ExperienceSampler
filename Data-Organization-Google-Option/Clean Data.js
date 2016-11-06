function cleanData() {
  var totalSheets = SpreadsheetApp.getActiveSpreadsheet().getNumSheets();
  for (var i=0; i< totalSheets; i++) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[i];
    Logger.log(sheet);
    removeDuplicates(sheet);
    removeEmptyRows(sheet);
    completedTag(sheet);
    convertTimestamp(sheet);
    sortData(sheet);    
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

//remove ".completed" from uniqueKeys in spliced dataset
function completedTag(sheet){
  var uniqueKeys = sheet.getRange("a:a");
  var uniqueKey = uniqueKeys.getValues();
  var uniqueKeysArray = [];
  for (var i = 0; i < uniqueKey.length; i++) {
    var uniqueKeyString = String(uniqueKey[i]);
    if (uniqueKeyString.indexOf(".completed") > -1){
      uniqueKey[i] = uniqueKeyString.split(".")[0];
    }
    else {uniqueKey[i] = uniqueKey[i];}
    uniqueKeysArray.push([uniqueKey[i]]);
  }
  uniqueKeys.setValues(uniqueKeysArray);
}

//converts time stamps
function convertTimestamp(sheet){
  var timestamps = sheet.getRange("c:c");
  var timestampElements = [], convertedTimestampsElements = [], convertedTimestampsElementsArray = [], convertedTimestampsArray = [];
  var timestamp = timestamps.getValues();
  for (var i = 0; i < timestamp.length; i++) {
    var timestampString = String(timestamp[i]);
    if (timestampString == "undefined" || timestampString == "0" || timestampString == "") {
      timestamp[i] = " ";
    }
    else {
    timestampElements = timestampString.split("_");
    for (var j = 0; j < timestampElements.length; j++){
      timestampElements[j] = n(timestampElements[j]);
    }
    timestamp[i] = timestampElements[0] + "_" + timestampElements[1] + "_" + timestampElements[2] + "_" + timestampElements[3] + "_" + timestampElements[4] + "_" + timestampElements[5];
  }
  convertedTimestampsArray.push([timestamp[i]]);
  }
  timestamps.setValues(convertedTimestampsArray);
  //Logger.log(convertedTimestampsArray);
}

//then sort the data
function sortData(sheet){
  var lastCol = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange(1,1,lastRow-1, lastCol);
  range.sort([{column:1, ascending:true},{column:3, ascending:true}]);
}



//change single digit numbers to double digits so timestamps can be sorted correctly
function n(n) {
  return n > 9 ? "" + n: "0" + n;
}

//remove all elements that match the following values
//for unique keys removes notification, participant, and snoozed
if(!Array.prototype.remove) {
  Array.prototype.remove = function(vals, all){
    var j, removedItems = [];
    if (!Array.isArray(vals)) vals = [vals];
    for (var k = 0; k < vals.length; k++) {
      if (all) {
        for(j = this.length; j--;){
          if (this[j] === vals[k]) removedItems.push(this.splice(j,1));
        }
      }
      else {
        j = this.indexOf(vals[k]);
        if(j>-1) removedItems = this.splice(j,1);
      }
    }
    return removedItems;
  };
}
