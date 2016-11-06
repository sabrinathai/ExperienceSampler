#Checking Compliance
We have created a script using Google script to check participant’s compliance at the end of each day. The script can be downloaded 
from this [page](https://script.google.com/d/1I-Uo_phZEM94YYvjWMwZPi5hGG3V3YwBSm4yOabD4Q-t0bvntCiHNw-i/edit?usp=sharing). You can also find it on [GitHub](https://github.com/sabrinathai/ExperienceSampler/blob/master/Google-Script-Participant-Compliance/Google%20Script%20Compliance%20Checker.js). Below 
we will outline how to implement the compliance checker. This script checks each participant’s data sheet and determines the number of 
entirely completed questionnaires at the end of each day. The script will then record this to the Compliance Google spreadsheet. 

##The Script
Now, we will briefly describe what each of the functions within the script does so that you understand how the script works. The 
compliance checker script performs two primary functions. 
The first function splices the variable name into its three components: 
the unique key, the variable name, and the time stamp. 
The second function uses the unique key to determine how many questionnaires 
the participant has completed on a given day and record this value in the compliance spreadsheet along with a date stamp of when the 
responses were checked. This second function only includes completed questionnaires in this count. That is, if a participant does not 
complete a questionnaire, it is not included in the day’s count. The script does this by looking a unique key that also has the tag 
“completed” appended to it. The `renderLastPage` function in ExperienceSampler only appends this tag to the unique key when the 
participant has completed the entire questionnaire. These functions are only executed during the participant’s experience 
sampling data collection period. The compliance checker script does this by finding the dates in the compliance spreadsheet and then 
checking whether the day the script is being run falls between the experience sampling data collection period date ranges using the 
`startOfDataCollectionPeriod` and the `endOfDataCollectionPeriod` functions. 

If your participants attend an in-lab information session as part of your experimental protocol, you may encourage your participants 
to try using ExperienceSampler during this session. This practice questionnaire should not count towards the compliance total; thus, 
you can implement an additional function that will exclude this practice intake data. This function, `intakeSessionTestData`, only checks 
the intake session data, and will only run in the time between the intake session and the first day of the experience sampling data 
collection period. 

To have the script run automatically each day, we will use a feature of Google Scripts called triggers. A trigger tells the script to 
run if a specific condition has been met. The triggers can be either event-based (e.g., every time the spreadsheet is updated), or 
time-based (e.g., at a certain time each day). Because the splice data function can take a while to run depending on how much data 
has been collected on a given day, we would advise you to run this function one hour before the compliance checking 
(i.e., `checkCompletedSurveys`) function. 

##Implementing the script. 
###Create Compliance Spreadsheet
First, you will need to create your compliance spreadsheet. This spreadsheet should have the following headers in this order: 
**Participant ID**, **Participant’s Name**, **Participant Email**, **App Installation Day**, **First Day of Data Collection**, 
**Day After Last Day of Data Collection**, **Compliance 1**, **Compliance Check Date 1**, **Compliance 2**, **Compliance Check Date 2**, 
… **Compliance X**, **Compliance Check X**. 
* If you wish to use our compliance email reminder tool as well, which we will describe in 
greater detail below, you should also add the following to the header: 
**Compliance1 Email Sent**, **Compliance2 Email Sent**, … **ComplianceX-1 Email Sent**. 
You can see an example of a compliance sheet on this [page](https://docs.google.com/spreadsheets/d/16VZAKlW0thWRyWwwxvUrq2xfjSJHgWKTZN7oDq5gDvw/edit?usp=sharing). 
* In both cases, **X** is the number of days of data collection. 

###Create Compliance Script
Next, you will have to set up the script. 
1. Download our Compliance Checker script. You will then copy this script into a new 
Google Script project. To do this, go to Google Script and create a blank project. Then copy our code into the script.  In this code, 
you will have to make two changes. First, you will need to tell the script the Google Sheet ID of your compliance spreadsheet. Remember 
that the sheet id is found in the Google Sheet URL, and it is a long string of letters, numbers, and symbols that appears before 
“`/edit#gid=…`”. You will also need to tell the script the Google Sheet ID of your spliced database. 

Once you have made these changes to the script, you should save your script. We named our script Compliance Script. Then you will 
need to authorize the script to run. That is, you need to provide your script with permission to look at the data in your spreadsheet. 
To do this, you need to click on the debug icon, which looks like a bug and is located beside the dropdown menu in the toolbar. 

Next, we want our script to run automatically each day. To do this, we will have to set triggers. A trigger tells the script to run if a 
specific condition has been met. For example, you can tell the script to run every time the spreadsheet is updated or you can tell 
the script to run between two specific times every day. We will use a time-based trigger to our script. We will want to specify two 
time-based trigger. The first one will splice the long variable string into a unique key, a variable name, and a timestamp. The second 
one will count the number of completed questionnaires. 

To specify a time-based trigger, you first click on the clock icon that appears 
beside the play icon. Then click **Add a new trigger**, then select **spliceData** in the first dropdown menu and **Day timer** in the 
third menu, and **3am to 4am** in the last menu. Then you create your second trigger by selecting Select **checkCompletedSurveys** in the 
first dropdown menu, **Day timer** in the third dropdown menu, and **4am to 5am** in the last dropdown menu. We selected these times 
for our triggers because most participants will probably be sleeping and not be providing new data; however, you can select the 
most appropriate trigger times based on the population of participants they are studying. If you have chosen to use the 
`intakeSessionTestData` function, you will need a third trigger. You can run this function between 2am to 3am. 

