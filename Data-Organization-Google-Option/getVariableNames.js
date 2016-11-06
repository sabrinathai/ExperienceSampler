function getVariableNames() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var values = sheet.getRange("B:B").getValues();
  var uniqueVariableNames = [];
  uniqueVariableNames = eliminateDuplicates(values);
  var removedVariables = uniqueVariableNames.remove(["0","1","2","3","4","5","6","7","8","9","id", "time", ""], true);
  var googleVariableNames = [["PID"],["SurveyID"],["startTime"],["endTime"]];
  for (var i = 0; i < uniqueVariableNames.length; i++){
    googleVariableNames.push([uniqueVariableNames[i]]);
  }
  var values = [googleVariableNames];
  Logger.log(values);
  //Logger.log(googleVariableNames.length);
  var longFormDataSheet = SpreadsheetApp.openById("18zWDShdygKpidYpZ0uAYHRStVaamUD2IwzuQlsyIyI8").getSheets()[0];
  var range = longFormDataSheet.getRange(1,1,1, googleVariableNames.length);
  range.setValues(values);
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
