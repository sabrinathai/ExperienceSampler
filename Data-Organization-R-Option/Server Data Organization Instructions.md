#Server Data - Data Organization Instructions
##Get, Splice, and Clean Data
Download our [Get, Splice, and Clean Data.R script](https://github.com/sabrinathai/ExperienceSampler/blob/master/Data-Organization-R-Option/Get,%20Splice,%20and%20Clean%20Data.R). We include detailed comments throughout our R Script describing what each line is doing. Below we point out the lines that require modifications. 

###Get Necessary Libraries
1. Lines 2 to 6 load the libraries you'll need to get, splice, and clean your ExperienceSampler Server Data.
  * If you do not have the `tidyr`, `stringr`, and `plyr` libraries, uncomment **line 3** to install the packages. 

###Get, Splice, and Clean Server Data
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
9. In **line 123**, set the directory to be different from spliced data folder. 

##Convert to Long Form
