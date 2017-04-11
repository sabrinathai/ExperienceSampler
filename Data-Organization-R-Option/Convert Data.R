####Load All Necessary Libraries####
library(tools)
#install.packages("tidyr"); install.packages("stringr"); install.packages("plyr")
library("tidyr")
library("stringr")
library("plyr")

####READ IN THIS FILE TO TEST LONG FORM CONVERSION####
setwd("") #set directory to where the file with all the merged spliced data is. 
spliced.dataframe <- read.csv("all.spliced.data.csv", header=T)

####CONVERT DATA TO LONG FORM####
####PREPARATION####
####Create List of All Variable Names####
variable.names<-data.frame(spliced.dataframe$variable.name)
unique.variable.names <- unique(variable.names, )
row.names(unique.variable.names)<-NULL
####Inspect the variable names to make sure everything is correct####
View(unique.variable.names)

###Check variable names to see if any numbers or symbols (e.g., "-") have been appended to them. We will remove these symbols now. 
###This ensures that all values for the same variable will be written to the same column in the data frame.  
##find and replace all variable names that were converted weird
#the first argument is the original variable name that is incorrect
#the second argument is the corrected variable name
#the third argument is the column
#below are some examples
unique.variable.names$spliced.dataframe.variable.name<-gsub("activity1","activity", unique.variable.names$spliced.dataframe.variable.name)
unique.variable.names$spliced.dataframe.variable.name<-gsub("domain1","domain", unique.variable.names$spliced.dataframe.variable.name)
unique.variable.names$spliced.dataframe.variable.name<-gsub("-","", unique.variable.names$spliced.dataframe.variable.name)
###You can use the line below to remove any variables that are not actual variables###
#enter the number of the row you want to delete
#if you have multiple rows to delete use "-c(X, Y, Z,...), where X, Y, and Z are the row numbers
unique.variable.names<-unique.variable.names[-X,]
#Check the variable names again
View(unique.variable.names)
##Now we remove any duplicates that appeared because of strange symbols
unique.variable.names <- unique(unique.variable.names, )
row.names(unique.variable.names)<-NULL
colnames(unique.variable.names)<-NULL
#Check the variable names again
View(unique.variable.names)
unique.variables.list<-as.list(unique.variable.names)
unique.variable.names.unlist<-unlist(unique.variable.names)
complete.data<-c("id","start.time","end.time", unique.variable.names.unlist)

####Find and Replace All Variable Names That Were Converted Weird in the ACTUAL Spliced Dataset####
###These should match the lines above, starting from line 28
spliced.dataframe$variable.name<-gsub("activity1","activity", spliced.dataframe$variable.name)
spliced.dataframe$variable.name<-gsub("domain1","domain", spliced.dataframe$variable.name)
spliced.dataframe$variable.name<-gsub("-","", spliced.dataframe$variable.name)
###remove the .completed tag from the unique keys
spliced.dataframe$unique.key<-gsub(".completed","", spliced.dataframe$unique.key)

####Save the Fixed Dataset####
write.csv(spliced.dataframe, "all.spliced.data.fixed.csv", row.names=FALSE)

####Read in the Fixed Spliced Dataset to convert####
data.to.convert <- read.csv("all.spliced.data.fixed.csv", header=TRUE)

###check to see if the spliced data is correct###
View(data.to.convert)
####CONVERSION####
#Handy function to strip prefixes from the column names (of cosmetic value only!) since the reshape process will add a prefix:
#just run the first time you convert data
colnames_removing_prefix <- function(df, prefix) {
  names <- colnames(df)
  indices <- (substr(names,1,nchar(prefix))==prefix)
  names[indices] <- substr(names[indices], nchar(prefix)+1, nchar(names[indices]))
  return(names)
}

####Make dataframe with end times and unique keys####
data.to.convert$find.end.times<-duplicated(data.to.convert[c("unique.key")], fromLast=TRUE)
end.times <- data.frame(data.to.convert[data.to.convert$find.end.times == FALSE, c(1,3,5)])
names(end.times)[names(end.times)=="timestamp"] <- "end.time"
row.names(end.times)<-NULL

####Now Restructure the Data into Long Form####
restructured.data <- reshape(data.to.convert, v.names=c("values"), idvar=c("id","unique.key"),
                             timevar = "variable.name", drop="find.end.times", direction="wide", new.row.names=NULL)
restructured.data1 <- reshape(data.to.convert, v.names=c("variable.name","values"), idvar=c("id","unique.key"),
                            timevar = "timestamp", drop="find.end.times", direction="wide", new.row.names=NULL)
row.names(restructured.data)<-NULL
#rename timestamp to be start.time
names(restructured.data)[names(restructured.data)=="timestamp"] <- "start.time"
#merge restructured dataset with end times
restructured.data <- merge(restructured.data, end.times, by = c("id","unique.key"), all = TRUE)

#remove prefix from restructure data variable names
colnames(restructured.data) <- colnames_removing_prefix(restructured.data, "values.")
View(restructured.data)
#reorder the columns (optional)
#uncomment if you want to reorder. You need to input the variable names in the order you wish.
#Each variable name must be in quotations. 
# reorganized.data <- restructured.data[ ,c("id", "unique.key","start.time","end.time","","","","","",
#                                        "","","","","","","","","","",
#                                        "","","","","","","","","","",
#                                        "","","","","","","","","","",
#                                        "","","","","","","","","","",
#                                        "","","","","","","","","","",
#                                        "","","","","","","","","","",
#                                        "","","","","","","","","","",
#                                        "","","","","","","","","","",
#                                        "","","","","","","","","","",
#                                        "","","","","","","","","","",
#                                        "","","","","","","","","","")]

#check your data frame to determine which variables to sort by                                       
View(reorganized.data)
#organize data by id and unique key
reorganized.data <- reorganized.data[order(reorganized.data[,1], reorganized.data[,2]),]
row.names(reorganized.data)<-NULL
#check your data frame before saving it
View(reorganized.data)

#write as a csv file
setwd("") #set directory to where you want to save your long form data
write.csv(reorganized.data, "ExperienceSampler Long Form Data.csv", row.names=FALSE)
