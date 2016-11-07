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
Download our [Convert Data.R script](https://github.com/sabrinathai/ExperienceSampler/edit/master/Data-Organization-R-Option/Convert%20Data.R). We include detailed comments throughout our R Script describeing what each line is doing and some instructions. Below we point out the lines that require modifications.
###Get Necessary Libraries
1. Lines 2 to 6 load the libraries you'll need to get, splice, and clean your ExperienceSampler Server Data.
  * If you do not have the `tidyr`, `stringr`, and `plyr` libraries, uncomment **line 3** to install the packages. 

###Convert Data###
1. In **line 9**, set the directory to where the merged spliced data file is. 
####Set Variable Names in Long Form Dataset
2. Starting from **line 28**, you can correct any weird variable names.
 * Sometimes ExperienceSampler will append a "1" or a "-" to variable names. You want to ensure that values for the same variable are 
 written in the same column, so you need to correct this. 
 * We included examples in lines 28 to 30. There are three arguments for this function:
   * **First Argument**: The original variable name (aka the weird variable name)
    * **Second Argument**: The corrected variable name (aka what you want to replace the weird variable name with)
    * **Third Argument**: The column
3. If you missed any variable names that are not associated with usable data, you can delete them in **line 34**. 
 * Just input the row numbers.
4. Starting from **line 49**, copy and paste the lines starting from **28**
 * This renames the variables in the **ACTUAL** spliced dataset
5. If you wish to reorganize the columns in your dataset, uncomment **lines 92 - 103**.
 * Rearrange them by typing the variable names in the order you desire. Each variable name should appear between the quotation marks. 
6. In **line 114**, set the directory for where you want your long form data to be saved. You can rename the long form data file in **line 115** if you want. 
7. Run each line by itself in the **PREPARATION** section. Inspect the variable names carefully. 
8. Highlight and run all the lines from the **CONVERSION** section to the end of the script. 
