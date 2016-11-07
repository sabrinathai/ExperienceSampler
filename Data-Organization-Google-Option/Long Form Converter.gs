var splicedDataset = SpreadsheetApp.openById('Google Sheet ID');
//var sheet = splicedDataset.getSheets()[0];
var longFormDataSet = SpreadsheetApp.openById('Google Sheet ID');
var longFormSheet = longFormDataSet.getSheets()[0];

function convertToLongForm(){
  var sheetIndex = splicedDataset.getNumSheets();
  for (var i = 0; i < sheetIndex; i++){
  var sheet = splicedDataset.getSheets()[i];
    setIds(sheet);
    values(sheet);  
  }
}

function setIds(sheet){
  var ids = [];
  var surveyIds = getUniqueKeys(sheet);
  var PID = sheet.getSheetName();
  var surveyIDs = [];
  var PIDs = [];
  var startTimes = [];
  for (var i = 0; i < surveyIds.length; i ++){
    surveyIDs.push([surveyIds[i]]);
    //startTimes.push([new Date(surveyIds[i])]);
    //var startTime = new Date(surveyIds[i]);
    for (var j = 0; j < surveyIds.length; j++) {
      PIDs.push(PID);
    }
    ids.push([PIDs[i],surveyIDs[i]]);
  }
  //Logger.log(startTimes);
  //Logger.log(surveyIds);
  var longFormLastRow = longFormSheet.getLastRow() + 1;
  //if (longFormLastRow == 1) {longFormLastRow = longFormSheet.getLastRow() + 1;}
  longFormSheet.getRange(longFormLastRow,1,ids.length,2).setValues(ids);
}

//work on this with only two uniqueKeys
//values are being written into the wrong row
function values(sheet) {
  var surveyIds = getUniqueKeys(sheet);
  var lastCol = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange(1,1,lastRow-1, lastCol);
  var surveyData = range.getValues();
  //remove all values that are not uniquekeys
  var removedItems = surveyData.remove(["participant","snoozed","notification","weekendDinnerMinute","weekendDinnerHour","weekdayDinnerMinute","weekdayWakeHour","weekdayWakeMinute","weekendWakeMinute","weekdayDinnerHour","weekendWakeHour", "uniqueKey", "pause", "notification_6", ""], true);
  var longFormLastRow = longFormSheet.getLastRow();
  var variableNames = longFormSheet.getSheetValues( 1, 1, 1, longFormSheet.getLastColumn() )[0];
  var ids = longFormSheet.getSheetValues(2,2,longFormSheet.getLastRow(),1);
  for (var i = 0; i < ids.length; i++){
    var id = surveyIds[i];
    var longFormRow = Number( isElement(ids, id)) + 2;
    var keys = [];
    var values = [];
    var timestamps = [];
    for (var j = 0; j < surveyData.length; j++){
      var surveyId = surveyData[j][0];
      if (surveyId == surveyIds[i]){
        //Logger.log(ids[i]);
        keys.push(surveyData[j][1]); 
        timestamps.push(surveyData[j][2]);
        values.push(surveyData[j][3]);
        if (surveyData[j][1] === "completedSurvey"){
          keys.push('endTime');
          //Logger.log(j);
          var endDate = (surveyData[j][2]).split("_");
          var year = endDate[0], month = endDate[1], date = endDate[2], hour = endDate[3], minute = endDate[4], seconds = endDate[5];
          var endTime = new Date(year,month,date,hour,minute,seconds);
          values.push(endTime);
        }
      }
    }
    var responses = {};
    for (var k = 0; k < values.length; k++){
      responses[keys[k]] = values[k];
    }
    var containsEndTime = 'endTime' in responses;
    if (containsEndTime === false){
      var endDate = timestamps[timestamps.length - 1];
      if (endDate != undefined){
      var endDateObject = endDate.split("_");
      var endYear = endDateObject[0], endMonth = endDateObject[1], endDay = endDateObject[2], endHour = endDateObject[3], endMinutes = endDateObject[4], endSeconds = endDateObject[5];
      var endTime = new Date(endYear, endMonth, endDay, endHour, endMinutes, endSeconds);
      responses["endTime"] = endTime;  
      }
    }
    var startTime = timestamps[0];
    if (startTime != undefined){
      var startTimeObject = startTime.split("_");
      var startYear = startTimeObject[0], startMonth = startTimeObject[1], startDay = startTimeObject[2], startHour = startTimeObject[3], startMinutes = startTimeObject[4], startSeconds = startTimeObject[5];
      var startTime = new Date(startYear, startMonth, startDay, startHour, startMinutes, startSeconds);
      responses["startTime"] = startTime;  
    }
    //Logger.log(responses);
    for (var key = 0; key < Object.keys(responses).length; key++) {
      var variable = Object.keys(responses)[key];
      if (variable != 'PID' &&
          variable != 'SurveyID'){
        if (isElement(variableNames, variable)){
        var longFormColumn = Number(isElement(variableNames, variable)) + 1;
        longFormSheet.getRange(longFormRow, longFormColumn).setValue(responses[variable]);
        }
      }
    }
  }
}


//makes an array of unique keys or survey ids for each participant
function getUniqueKeys(sheet) {
  //sheet.getSheets()[x];
  //var PID = sheet.getSheetName();
  var uniqueKeys = [], uniqueKeysArray = [], removedItems, completedSurveys = []; 
  var range = sheet.getRange("a:a"); 
  uniqueKeys = range.getValues();
    for (var i = 0; i < uniqueKeys.length; i++){
      uniqueKeysArray.push(uniqueKeys[i][0]);
    }
    removedItems = uniqueKeysArray.remove(["participant","snoozed","notification","weekendDinnerMinute","weekendDinnerHour","weekdayDinnerMinute","weekdayWakeHour","weekdayWakeMinute","weekendWakeMinute","weekdayDinnerHour","weekendWakeHour", "uniqueKey", "pause", "notification_6", ""], true);
    uniqueKeysArray.sort(function(a,b){return a-b});
    completedSurveys = compressArray(uniqueKeysArray);
    return completedSurveys;
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

//counts how many times a unique key appears and only pushes unique keys into array if it appears
//more than a certain number of times
//for us snoozed responses should not count as completed responses so only unique keys that appear more 
//than twice will be pushed into the array
//should double the number of entries so if 2 questions are answered for each snooze, should make it more than 4 
//in case data is sent more than once
function compressArray(original) {
  var compressed = [];
  //make a copy of the input array
  var copy = original.slice(0);
  //first loop goes over every element
  for (var i = 0; i < original.length; i++) {
    var myCount = 0;
    //loop over every element in the copy and see if it's the same
    for (var w = 0; w < copy.length; w++) {
      if (original[i] == copy[w]) {
        //increase amount of times duplicate is found
        myCount++;
        //sets item to undefined
        delete copy[w];
      }
    }
    if (myCount > 1) {
      var a = [];
      compressed.push(original[i]);
    }
  }
  return compressed;
}
//test to see if object is an element of an array
function isElement( array, testObject ) {
  for ( var i = 0; i < array.length; i++ ) {
    if ( array[ i ] == testObject ) {
      return i;
    }
  }
  return false;
}

Array.prototype.getDuplicates = function () {
    var duplicates = {};
    for (var i = 0; i < this.length; i++) {
        if(duplicates.hasOwnProperty(this[i])) {
            duplicates[this[i]].push(i);
        } else if (this.lastIndexOf(this[i]) !== i) {
            duplicates[this[i]] = [i];
        }
    }

    return duplicates;
};
