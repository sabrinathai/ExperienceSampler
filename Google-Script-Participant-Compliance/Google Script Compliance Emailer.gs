var sent = "EMAIL SENT"

function sendComplianceEmails() {
  var sheet = SpreadsheetApp.openById("16VZAKlW0thWRyWwwxvUrq2xfjSJHgWKTZN7oDq5gDvw"); //replace this with your compliance sheet ID
  var complianceSheet = sheet.getSheets()[0];
  var values = complianceSheet.getDataRange();
  var data = values.getValues();
  var scriptDate = new Date();
  var scriptMonth = scriptDate.getMonth() + 1;
  var scriptDay = scriptDate.getDate();
  var scriptYear = scriptDate.getFullYear();
  var startRow = 1;
  for (var i = 0; i < data.length; ++i){
    if (i>0) {
      var column = data[i];
      var name = column [1];
      var emailAddress = column[2];
      var firstDataDayDate = new Date(column[3]);
      var firstDataDayMonth = firstDataDayDate.getMonth() + 1;
      var firstDataDayDay = firstDataDayDate.getDate();
      var firstDataDayYear = firstDataDayDate.getFullYear();
      var dayAfterLastDataDayDate = new Date(column[4]);
      var dayAfterLastDataDayMonth = dayAfterLastDataDayDate.getMonth() + 1;
      var dayAfterLastDataDayDay = dayAfterLastDataDayDate.getDate();
      var dayAfterLastDataDayYear = dayAfterLastDataDayDate.getFullYear();
      var c1 = column[5];
      var c1Date = new Date(column[6]);
      var c2 = column[7];
      var c2Date = new Date(column[8]);
      var c3 = column[9];
      var c3Date = new Date(column[10]);
      var c4 = column[11];
      var c4Date = new Date(column[12]);
      var c5 = column[13];
      var c5Date = new Date(column[14]);
      var c6 = column[15];
      var c6Date = new Date(column[16]);
      var c7 = column[17];
      var c7Date = new Date(column[18]);
      var c1Email = column[20];
      var c2Email = column[21];
      var c3Email = column[22];
      var c4Email = column[23];
      var c5Email = column[24];
      var c6Email = column[25];
      var c7Email = column[26];
      var daysFromFirstDataDay = 0;
      if (firstDataDayYear === scriptYear) {//This will prevent the script from randomly re-emailing people in one year
        if (firstDataDayMonth === scriptMonth) {
          daysFromFirstDataDay = firstDataDayDay - scriptDay;
        }
        else if (firstDataDayMonth > scriptMonth) {
          daysFromFirstDataDay = firstDataDayDay + (daysInMonth(scriptMonth) - scriptDay);
        }
        //want to make intakeSessionMonth = scriptMonth and then add scriptDay from value
        else if (firstDataDayMonth < scriptMonth) {
          daysFromFirstDataDay = firstDataDayDay - (daysInMonth(firstDataDayMonth) + scriptDay);
        }
        //check this date logic
        else if ((intakeSessionMonth === 12 && scriptMonth === 1) && (firstDataDayMonth === 1 || scriptMonth === 12)) {
          if (firstDataDayMonth > scriptMonth) {
            daysFromFirstDataDay = scriptDay + (daysInMonth(firstDataDayMonth) - firstDataDayDay);
          }
          else if (firstDataDayMonth < scriptMonth) {
            daysFromFirstDataDay = firstDataDayDay + (daysInMonth(scriptMonth) - scriptDay);
          }
        }
        Logger.log(daysFromFirstDataDay);
        var complianceEmailColumn = 20 - daysFromFirstDataDay;
        Logger.log(complianceEmailColumn);
        if ((daysFromFirstDataDay === -1 && c1 < 5 && c1 !== "" && c1Email !== sent && c1Email !== "Survey Completed")
        || (daysFromFirstDataDay === -2 && c2 < 5 && c2 !== "" && c2Email !== sent && c2Email !== "Survey Completed")
        || (daysFromFirstDataDay === -3 && c3 < 5 && c3 !== "" && c3Email !== sent && c3Email !== "Survey Completed")
        || (daysFromFirstDataDay === -4 && c4 < 5 && c4 !== "" && c4Email !== sent && c4Email !== "Survey Completed")
        || (daysFromFirstDataDay === -5 && c5 < 5 && c5 !== "" && c5Email !== sent && c5Email !== "Survey Completed")
        || (daysFromFirstDataDay === -6 && c6 < 5 && c6 !== "" && c6Email !== sent && c6Email !== "Survey Completed")
        || (daysFromFirstDataDay === -7 && c7 < 5 && c7 !== "" && c7Email !== sent && c7Email !== "Survey Completed")
        ){
          if (emailAddress !== ""){
            var messageTxt = "Dear " + name + ", \n\n" + "Thank you again for participating in our study. " + 
              "We noticed that you did not finish yesterday's smartphone survey. \n" + "Remember that you will be compensated " +
                "$2.00 for every daily smartphone survey that you complete ($2.00 per day x 10 days = $20 if you complete all the daily surveys).\n\n If you could please complete your survey from yesterday " + 
                  "before your next team practice, we will still compensate you for completing the survey. " + 
                    "\n\n Thank you again for participating in our research! We greatly appreciate it!\n\n" +
                      "Best wishes,\n" + "Sabrina \n\n" + "Sabrina Thai\nDepartment of Psychology\nUniversity of Toronto";
           //an HTML message allows you to change the font of the text of the message, so you can bold, italicize, or underline text   
            var messageHTML = "Dear " + name + ", " + "<br><br>" + "Thank you again for participating in our study. " + 
                "We noticed that you did not finish yesterday's smartphone survey. " + "<br>" + "Remember that you will be compensated " + "<b>" + 
                  "$2.00 for every daily smartphone survey that you complete " + "</b>" + "($2.00 per day x 10 days = $20 if you complete all the daily surveys). " + "<br><br>" + "If you could please complete your survey from yesterday " + 
                    "<b>" + "before your next team practice" + "</b>" + ", we will still compensate you for completing the survey. " + 
                      "<br><br>" + "Thank you again for participating in our research! We greatly appreciate it!" + "<br><br>" + 
                        "Best wishes," + "<br>" + "Sabrina" + "<br><br>" + "Sabrina Thai" + "<br>" + "Department of Psychology"+ "<br>" + "University of Toronto"; 
            var subject = "Yesterday's Smartphone Survey";
            MailApp.sendEmail(emailAddress, subject, messageTxt, {name: "Daily Survey Study Reminder"/*, htmlBody: messageHTML*/});
            complianceSheet.getRange(startRow + i, complianceEmailColumn).setValue(sent);
            }        
          }
        else if ((daysFromFirstDataDay === -1 && c1 >= 5 && c1Email !== sent && c1Email !== "Survey Completed") 
          || (daysFromFirstDataDay === -2 && c2 >= 5 && c2Email !== sent && c2Email !== "Survey Completed")
          || (daysFromFirstDataDay === -3 && c3 >= 5 && c3Email !== sent && c3Email !== "Survey Completed")
          || (daysFromFirstDataDay === -4 && c4 >= 5 && c4Email !== sent && c4Email !== "Survey Completed")
          || (daysFromFirstDataDay === -5 && c5 >= 5 && c5Email !== sent && c5Email !== "Survey Completed")
          || (daysFromFirstDataDay === -6 && c6 >= 5 && c6Email !== sent && c6Email !== "Survey Completed")
          || (daysFromFirstDataDay === -7 && c7 >= 5 && c7Email !== sent && c7Email !== "Survey Completed")) {
          complianceSheet.getRange(startRow + i, complianceEmailColumn).setValue("Survey Completed");
        }
        if (daysFromFirstDataDay === -11) {
          //the line below is an example of how you can debug these scripts
          Logger.log("I'm in the -11 if statement");
          var completedSurveys = c1 + c2 + c3 + c4 + c5 + c6 + c7;
          //var totalCompensation = completedSurveys*2;
          //if (totalCompensation > 20) {totalCompensation = 20;}
          complianceSheet.getRange(startRow + i, 27).setValue(completedSurveys);
          //complianceSheet.getRange(startRow + i, 28).setValue(totalCompensation);
        }
       } //if intakeSessionYear statement closing bracket 
      } 
    }
}

function daysInMonth(integer) {
        var daysInMonth = 0;
        if (integer === 1 || integer === 3 || integer === 5 || integer === 7 || integer === 8 || integer === 10 || integer === 12) {
          var daysInMonth = 31;
        }
        else if (integer === 4 || integer === 6 || integer === 9 || integer === 11) {
          var daysInMonth = 30;
        }
        else {
          var daysInMonth = 28;
        }
        return daysInMonth;
      }
