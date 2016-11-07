#Implementing the Google Script Data Collector

For the Google option, you will need to go to Google Drive and create three spreadsheets in Google Sheets. 
One sheet will be used to store the raw data (`database`), one sheet will be used to store spliced data (`splicedDataset`), 
which will then be used to check compliance, and one sheet will be used to store compliance rates (`compliance`). For each 
spreadsheet, note the ID of the sheet. The sheet id is used to tell the web app where to write the data and is found in 
the URL for the Google sheet. It is a long string of letters, numbers, and symbols that appears before “`/edit#gid=…`” 
You can also create a Google Document that will act as a log of the web app’s activities. 

1. Go to [Google Script](http://www.google.com/script/start/). 
2. Select a Blank Project in the top left of the menu of the pop-up dialog. You can copy and paste the script from [this page](https://script.google.com/d/1P5dCtwPQxsXYFcN68sE8egkfyhKs0WDcXqFDXm3jactwxvbUXP8sLJlR/edit?usp=sharing) 
or from [GitHub](https://github.com/sabrinathai/ExperienceSampler/blob/master/Google-Script-Data-Collector/DataCollector.gs). 
3. You will then replace the variables `databaseID`, `splicedDatabaseID`, `complianceID`, and `DocumentID`, in the example code with the ids you stored for the raw data spreadsheet, the spliced data spreadsheet, the compliance data spreadsheet, and the web app log, 
respectively. 
4. Save the script. 

You are now ready the test and potentially deploy the data storage web app. 

1.  Click on the debug icon, which looks like a bug and is located beside the dropdown menu titled **Select function**. 
2.  The script will then ask for Authorization. Select `Continue` and then `Accept` to authorize the web app. 
3.  To deploy as a web app, a project version needs to be created. 
4.  Go to `Publish` then `Deploy as web app`. 
5.  In the dropdown menu for Who has access to the app, select `Anyone, even anonymous`. 
6.  Then click `Deploy`. Copy the URL that appears below `Current web app URL`. You need this URL to input into your ExperienceSampler 
code so that the app knows where to send the data. 

##saveData functions
Next, you will need to tell the ExperienceSampler where to send the data by locating the saveData 
and saveDataLastPage functions in the `index.js` file and copying and pasting the URL for the Google web app. In these functions, the only 
other property that you should double-check is the `type` property, which should be set to `get`. The `type` property indicates how the 
data will be sent to the web app. 

The only difference between the `saveData` and `saveDataLastPage` functions is that participants will be notified whether the data was 
sent to the server successfully when the `saveDataLastPage` function is executed but not when the `saveData` function is executed. These 
functions ensure that the data is being sent to the server as often as possible so that participant data files are as up-to-date as 
possible. This allows for the most accurate records of response compliance (i.e., using the `saveData` function) that can be checked 
daily using our automated compliance checking program but not annoy participants by notifying them every time their data has been 
sent successfully. We chose to only notify participants when they would naturally expect to receive such confirmation – when they 
have completed the survey. If you choose not to notify participants, then you only need to implement the saveData function; however, 
we would advise you to use the `saveDataLastPage` function during testing to ensure that your data is being sent and saved correctly. 

##ExperienceSampler HTML file
Once you have set up your server or your Google database, you will need to copy and paste the URL of your Google Data Collector Script into the `index.html` file in your ExperienceSampler file. This will let ExperienceSampler know that your 
Data Collector has permission to access the data, and the Data Collector is not doing anything malicious. If you are using the Google 
option, you will need to copy two URLs into the `index.html` file. This is the only change you have to make to the `index.html` file. 

1. Open your `index.html` file in your `www` folder. You will see a line that contains Content-Security-Policy. 
2. In this line, you will add the additional property of `connect-src`, followed by the URL of your data collector. 
  * You will need the same URL that you copied and pasted into the `saveData` and `saveDataLastPage` functions. 
3. After your Google data collector URL, you will need to type https://script.googleusercontent.com/macros/echo with a space separating the this URL and the URL of your Google Data Collector and a double quotation mark after echo. 

Your entire `Content-Security-Policy` will look like this  

`<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 
'unsafe-eval' data: gap: https://ssl.gstatic.com; style-src 'self' 'unsafe-inline'; media-src *; 
connect-src https://script.google.com/macros/s/AKfycbzzbp0437BkTqx95W9THF9JhWcydzn-K-FJTbwIHF23-S0JbDXG/exec 
https://script.googleusercontent.com/macros/echo">`.  
