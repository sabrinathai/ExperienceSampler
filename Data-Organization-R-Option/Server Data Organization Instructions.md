# Server Data - Data Organization Instructions

**NOTE**: The month for the timestamp ranges from 0-11 . Thus, January is actually indicated by a 0, February is actually indicated by 1, and so forth. Please remember to keep this in mind.

## Get, Splice, and Clean Data
Download our [Get, Splice, and Clean Data.R script](https://github.com/sabrinathai/ExperienceSampler/blob/master/Data-Organization-R-Option/Get%2C%20Splice%2C%20and%20Clean%20Server%20Data.R). We include detailed comments throughout our R Script describing what each line is doing. Below we point out the lines that require modifications. 

### Get Necessary Libraries
1. Lines 2 to 6 load the libraries you'll need to get, splice, and clean your ExperienceSampler Server Data.
  * If you do not have the `tidyr`, `stringr`, and `plyr` libraries, uncomment **line 3** to install the packages. 

### Get, Splice, and Clean Server Data
1. Create a folder to store your **raw** data on your computer. 
2. Copy this directory and paste it between the double quotation marks in **lines 9, 29, and 41**. 
3. In **line 13**, insert the server URL where the **URL** placeholder is.
  * This is what precedes data_collector.cgi in your `saveData` and `saveLastPageData` functions. 
4. In **line 23**, set the range of participant IDs. Presumably this is a range of numbers that has been assigned sequentially.
5. If there are missing participant IDs, you will need to make a vector of missing ids in **line 25**.
  * If there is are no missing participant IDs, comment out **lines 25 and 27**. 
6. In **lines 81-91**, enter all the unique key values that are not associated with real data such as **pause**, **notification**, **snoozed**, etc. 
7. Create a new folder to save your **spliced** data on your computer. 
8. Copy this directory and paste it between the double quotation marks in **lines 100 and 109**.
  * Do **NOT** store in your spliced data in the same folder as your raw data. 
9. In **line 119**, set the directory to be different from spliced data folder. 
10. Highlight and run the entire script. 

## Convert to Long Form
Download our [Convert Data.R script](https://github.com/sabrinathai/ExperienceSampler/edit/master/Data-Organization-R-Option/Convert%20Data.R). We include detailed comments throughout our R Script describing what each line is doing and some instructions. Below we point out the lines that require modifications.

This process is the same for both Server and Google Data. 
### Get Necessary Libraries
1. Lines 2 to 6 load the libraries you'll need to get, splice, and clean your ExperienceSampler Server Data.
  * If you do not have the `tidyr`, `stringr`, and `plyr` libraries, uncomment **line 3** to install the packages. 

### Convert Data ###
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
5. If you wish to reorganize the columns in your dataset, uncomment **lines 92 - 103**.
 * Rearrange them by typing the variable names in the order you desire. Each variable name should appear between the quotation marks. 
6. In **line 114**, set the directory for where you want your long form data to be saved. You can rename the long form data file in **line 115** if you want. 
7. Run each line by itself in the **PREPARATION** section. Inspect the variable names carefully. 
8. Highlight and run all the lines from the **CONVERSION** section to the end of the script. 
