#Implementing the Google Script Data Organizer

##Prepare the Data
1. Make a copy of your spliced data. **Never** alter your raw data. 
2. Check that all the data has been spliced. That is, the unique key is in the first column, the variable name is in the second column, 
the timestamp is in the third column, and the participant's responses are in the fourth column.
  * If some of the data has not been spliced, use the **"Splicer Only"** script to splice the unspliced data.
    1. Open a new Google Script file and name it Splicer Only.
    2. Delete the following from the Script Editor:  `function myFunction(){}`
    3. Copy and paste the script found [here](https://github.com/sabrinathai/ExperienceSampler/blob/master/Data-Organization-Google-Option/Splicer%20Only.js)
    into the blank script editor. 
    4. Copy the id of the spliced data spreadsheet that you're working with in line 1. Remember this is a long string of letters, 
    numbers, and symbols that appears before `/edit#gid=...`
    5. Then enter the sheet name, which is usually the participant's id, in line 4 of the script. 
    6. You can also adjust the startRow (line 9 and comment out the **for** loop in lines 12 to 15) and lastRow (line 6), 
    depending on what rows need to be spliced. 
    7. When you are ready to splice the data, select `spliceVariableName` in the dropdown menu and hit play. You will be asked to provide
    authorization for the function. Click on `Review Permissions` in the first popup window, and `Allow` in the second popup window. 
 
##Clean the Data
1. Once you are sure all the data has been spliced, go to `Tools` and select `Script Editor`
2. This will open a new script editor and name it **"Clean Data"**
3. Delete the following from the Script Editor:  `function myFunction(){}`
4. Copy and paste the Clean Data script (https://github.com/sabrinathai/ExperienceSampler/blob/master/Data-Organization-Google-Option/Clean%20Data.js) 
into the blank script editor. 
  * This script performs multiple functions for each sheet in the spliced data spreadsheet. 
    * **removeDuplicates**: Removes duplicate lines of data. Sometimes participants will send the data from one survey more than once. 
    This function will remove these duplicate entries.
    * **removeEmptyRows**: Removes empty rows from each sheet in the spliced data spreadsheet.
    * **completedTag**: Removes the "completed" tag from the unique keys
    * **convertTimestamp**: Adds leading 0s to date values so that participant responses will be ordered correctly.
    * **sortData**: Sorts the data based on unique keys and the timestamp.
5. Select the `cleanData` function from the dropdown menu, and then hit the **play button icon**. 
  * You will be asked to provide authorization.
    * Click `Review Permissions` in the first popup window
    * Click `Allow` in the second popup window
6. Wait for the script to execute these functions on all the sheets in your spliced data spreadsheet.

##Make Long Form Spreadsheet
1. Create a New Spreadsheet and name it **"Converted Long Form"**. 
2. Return to your **Clean Data** Google Script. Go to `File` > `New` > `Script file`. Name it **"Get Variable Names"**.
3. Delete the following from the Script Editor:  `function myFunction(){}`
4. Copy and paste the getVariableNames script (https://github.com/sabrinathai/ExperienceSampler/blob/master/Data-Organization-Google-Option/getVariableNames.js) 
into the blank script editor. 
5. Copy and paste the id of your **Converted Long Form** spreadsheet into line 12, where it says **Google sheet ID**. Remember, this is a long string of letters, numbers, and symbols that appears before `/edit#gid=...`
6. Check that the values in the **removedVariables** line (line 6) include all the values that should be removed in **Column B** 
of the **Spliced Data Spreadsheet**. This should include pause time rows (i.e., "time"), participant id (i.e., "id"), and the list of 
notifications (i.e,. the numbers), and any blank rows (i.e., ""). 
7. Select the `getVariableNames` function from the dropdown menu, and then hit the **play button icon**. 
  * You will be asked to provide authorization.
    * Click `Review Permissions` in the first popup window
    * Click `Allow` in the second popup window
 * This will set the header of the **Converted Long Form** spreadsheet with the variable names from your data. Be sure to compare these to the variable names in your questionniare in your ExperienceSampler `index.js` file. Be sure that no variables are omitted and that the variables are ordered the way you want. If a variable name is omitted in the header, the values associated with that variable name will not be written into the converted long form spreadsheet. 

##Convert Spliced Data to Long Form - No Loops
1. Return to your **Clean Data** Google Script. Go to `File` > `New` > `Script file`. Name it **"Long Form Converter"**.
2. Delete the following from the Script Editor:  `function myFunction(){}`
3. Copy and paste the getVariableNames script (https://github.com/sabrinathai/ExperienceSampler/blob/master/Data-Organization-Google-Option/Long%20Form%20Converter.js) 
4. Copy and paste the id of your **Spliced Data** spreadsheet into line 1, where it says **Google Sheet ID**. Remember, this is a long string of letters, numbers, and symbols that appears before `/edit#gid=...`
5. Copy and paste the id of your **Converted Long Form** spreadsheet into line 3, where it says **Google Sheet ID**. Remember, this is a long string of letters, numbers, and symbols that appears before `/edit#gid=...`
6. Check that the values in the **removedVariables** line (line 120 of **Long Form Converter**) include all the values that should be removed in **Column A** 
of the **Spliced Data Spreadsheet**. This should include pause time rows (i.e., "pause"), participant id (i.e., "participant"), and the list of notifications (i.e,. "notification"), participant's times (e.g., "weekendDinnerTime", "weekendeWakeTime"), snoozed (e.g., "snoozed"), unique keys ("uniqueKeys"), and any blank rows (i.e., ""). 
7. Select the `convertToLongForm` function from the dropdown menu, and then hit the **play button icon**. 
  * You will be asked to provide authorization.
    * Click `Review Permissions` in the first popup window
    * Click `Allow` in the second popup window
8. Your data will be converted from spliced to long form. Change the format of *startTime* and *endTime* by highlighting the entire column. Then go to `Format` > `Number` > `Date time`.
 * Before you analyze your data, check all the start times. If the start time is "**12/31/1969 19:00:00**", then you need to find the timestamp in the spliced data and enter it into the appropriate column. 
 

