# Google Data - Data Organization Instructions

**NOTE**: The month for the timestamp ranges from 0-11 . Thus, January is actually indicated by a 0, February is actually indicated by 1, and so forth. Please remember to keep this in mind.

## Get Google Data
You can use [this script](https://gist.github.com/mderazon/9655893) to download each sheet in your Google Spreadsheet as a comma-separated values (.csv) file. This script will create a folder and create a csv file for each sheet. You can then download this folder onto your computer and use the following R scripts. We recommend downloading the **raw** data and then having R splice and prepare the data for you. This eliminates the need to check whether the Google splicer has spliced every line of data, which will also save you time. 

If you have participants test the app during an information session, you may want to remove this data before converting it so that you do not confuse practice data with actual data when analyzing the data. 

1. Make a copy of your raw data spreadsheet.
  * If you want to delete information session practice data, do so in your **copy** of your raw data, not to the actual spreadsheet that raw data is written. 
2. Go to `Tools` > `Script editor`
3. Delete the following from the Script Editor: `function myFunction(){}`
4. Copy and paste [this script](https://gist.github.com/mderazon/9655893) into the blank Script Editor. Name the script. We named ours "Download All Data."
5. From the dropdown menu, select `onOpen` and click the Play icon. You will then be asked to provide authorization. 
  * Click `Review Permissions` and then `Allow`.
6. After this function has finished running, select `saveAsCSV` from the dropdown menu and click the Play icon. Wait for the data to be downloaded. Alternatively, you can go back to your raw data file, and you will see a new option in the toolbar titled **csv**. Then you can select the option **export as csv files**.
7. Return to your Drive folder. Find the folder that has been created; it will have the same name as your spreadsheet. Right-click the folder to download. 

**NOTE**: You should remove any raw data files in the folder that do not contain any actual data. That is, if the participant's data file only includes pause times, unique keys, notifications, etc., you should remove the data file from the raw data folder otherwise the script to splice, prepare, and clean Google data will stop processing the data once it encounters this file. 

## Splice, Prepare, and Clean Data
Download our [Splice, Prepare, and Clean Google Data Script](https://github.com/sabrinathai/ExperienceSampler/blob/master/Data-Organization-R-Option/Splice%2C%20Prepare%2C%20and%20Clean%20Google%20Data.R). We include detailed comments throughout our R script describing waht each line is doing and some instructions. Below we point out lines that require modification and how to ensure the script runs smoothly. 

### Check Data Files

1. Remove any data files that do not include any actual data. 
 * Files do **NOT** contain rows of data that have a unique key, variable name, and timestamp in the first column do not contain actual data. These files should be removed from the raw data file folder on your computer otherwise the script will stop processing files once it encounters this file. 

### Get Necessary Libraries

1. Lines 2 to 6 load the libraries you'll need to get, splice, and clean your ExperienceSampler Server Data.
  * If you do not have the `tidyr`, `stringr`, and `plyr` libraries, uncomment **line 3** to install the packages. 

### Splice, Prepare, and Clean Google Data

1. Copy the directory for your raw Google data folder in **lines 9 and 15** between the quotation marks. 
2. In **lines 55-65**, enter all the unique key values that are not associated with real data such as **pause**, **notification**, **snoozed**, etc. 
3. Create a folder for your spliced data. Copy and paste the directory for your **spliced** data folder in **lines 74 and 83**
4. In **line 93**, set the directory for where you want to save the **merged** file of all the spliced data. 
 * Do not save this file in the same folder as your spliced data. If you have to recreate this merged file of all the spliced data, you will have duplicate entries of data because the data in the original merged file will also be used in the recreated file. 
5. Highlight and run the entire script. Alternatively, you can do this in two parts. 
 * In the first run, highlight and runall the lines up to and including line 80. This section of the script will clean and splice the raw data. 
 * In the second run, highlight and runlines 83 to the end of the script. This section of the script will merge all the spliced data together. 

## Convert to Long Form
Download our [Convert Data.R script](https://github.com/sabrinathai/ExperienceSampler/edit/master/Data-Organization-R-Option/Convert%20Data.R). We include detailed comments throughout our R script describing what each line is doing and some instructions. Below we point out the lines that require modifications.

This process is the same for both Server and Google Data. 
### Get Necessary Libraries
1. Lines 2 to 6 load the libraries you'll need to get, splice, and clean your ExperienceSampler Server Data.
  * If you do not have the `tidyr`, `stringr`, and `plyr` libraries, uncomment **line 3** to install the packages. 

### Convert Data
1. In **line 9**, set the directory to where the merged spliced data file is. 
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
 **For Google Data**. Uncomment **line 53**. This line will remove the ".completed" tag from your unique keys. 
5. If you wish to reorganize the columns in your dataset, uncomment **lines 96 - 107**.
 * Rearrange them by typing the variable names in the order you desire. Each variable name should appear between the quotation marks. 
6. In **line 118**, set the directory for where you want your long form data to be saved. You can rename the long form data file in **line 119** if you want. 
7. Run each line by itself in the **PREPARATION** section. Inspect the variable names carefully. 
8. Highlight and run all the lines from the **CONVERSION** section to the end of the script. 
