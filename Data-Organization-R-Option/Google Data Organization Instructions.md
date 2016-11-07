#Google Data - Data Organization Instructions
##Get Google Data
You can use [this script](https://gist.github.com/mderazon/9655893) to download each sheet in your Google Spreadsheet as a comma-separated values (.csv) file. This script will create a folder and create a csv file for each sheet. You can then download this folder onto your computer and use the following R scripts. We recommend downloading the **raw** data and then having R splice and prepare the data for you. This eliminates the need to check whether the Google splicer has spliced every line of data, which will also save you time. 

If you have participants test the app during an information session, you may want to remove this data before converting it so that you do not confuse practice data with actual data when analyzing the data. 

1. Make a copy of your raw data spreadsheet.
  * If you want to delete information session practice data, do so in your **copy** of your raw data, not to the actual spreadsheet that raw data is written. 
2. Go to `Tools` > `Script editor`
3. Delete the following from the Script Editor: `function myFunction(){}`
4. Copy and paste [this script](https://gist.github.com/mderazon/9655893) into the blank Script Editor. Name the script. We named ours "Download All Data."
5. From the dropdown menu, select `onOpen` and click the Play icon. You will then be asked to provide authorization. 
  * Click `Review Permissions` and then `Allow`.
6. After this function has finished running, select `saveAsCSV` from the dropdown menu and click the Play icon. Wait for the data to be downloaded. 
7. Return to your Drive folder. Find the folder that has been created; it will have the same name as your spreadsheet. Right-click the folder to download. 

##Splice, Prepare, and Clean Data

##Convert to Long Form
