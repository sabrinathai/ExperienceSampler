####Load All Necessary Libraries####
library(tools)
#install.packages("tidyr"); install.packages("stringr"); install.packages("plyr")
library("tidyr")
library("stringr")
library("plyr")

####READ IN THIS FILE TO TEST LONG FORM CONVERSION####
spliced.dataframe <- read.csv("all.spliced.data.csv", header=T)
setwd("/Users/sabrinathai/Documents/Research/Outside Project/Daily Relationship Comparisons Data")
spliced.dataframe <- read.csv("CRC All Spliced Data with Corrected Variable Names and Corrected Unique Keys - USE THIS TO CONVERT TO LONG FORM - ONE COMPARISON PER LINE.csv", header=T)


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
unique.variable.names$spliced.dataframe.variable.name<-gsub("activity1","activity", unique.variable.names$spliced.dataframe.variable.name)
unique.variable.names$spliced.dataframe.variable.name<-gsub("domain1","domain", unique.variable.names$spliced.dataframe.variable.name)
unique.variable.names$spliced.dataframe.variable.name<-gsub("-","", unique.variable.names$spliced.dataframe.variable.name)
###You can use the line below to remove any variables that are not actual variables###
#enter the number of the row you want to delete
#if you have multiple rows to delete use "-c(X, Y, Z,...), where X, Y, and Z are the row numbers
unique.variable.names<-unique.variable.names[-53,]
View(unique.variable.names)
##Now we remove any duplicates that appeared because of strange symbols
unique.variable.names <- unique(unique.variable.names, )
row.names(unique.variable.names)<-NULL
colnames(unique.variable.names)<-NULL
View(unique.variable.names)
unique.variables.list<-as.list(unique.variable.names)
unique.variable.names.unlist<-unlist(unique.variable.names)
complete.data<-c("id","start.time","end.time", unique.variable.names.unlist)

####Find and Replace All Variable Names That Were Converted Weird in the ACTUAL Dataset####
spliced.dataframe$variable.name<-gsub("activity1","activity", spliced.dataframe$variable.name)
spliced.dataframe$variable.name<-gsub("domain1","domain", spliced.dataframe$variable.name)
spliced.dataframe$variable.name<-gsub("-","", spliced.dataframe$variable.name)
write.csv(spliced.dataframe, "all.spliced.data.fixed.csv", row.names=FALSE)

####Save the Fixed Dataset####
setwd("/Users/sabrinathai/Documents/Clean and Convert ExperienceSampler Server Data/No Loops in Data/Spliced Test Data")
data.to.convert <- read.csv("all.spliced.data.fixed.csv", header=TRUE)
data.to.convert <- read.csv("CRC All Spliced Data with Corrected Variable Names and Corrected Unique Keys - USE THIS TO CONVERT TO LONG FORM - ONE COMPARISON PER LINE.csv", header=TRUE, stringsAsFactors=F)


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
end.times <- data.frame(data.to.convert[data.to.convert$find.end.times == FALSE, c(1,2,4)])
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
reorganized.data <- restructured.data[ ,c("id", "unique.key","start.time","end.time","socialComparison","snooze","context", "activity","otherActivity",
                                       "timeSinceComparison","target","imaginaryPerson","celebrity","otherTarget","natureOfComparison","domain",
                                       "domainImportance","partnerDomainImportance","contact","activeComparison","comparisonMood",
                                       "comparisonOptimism","comparisonSatisfaction","comparisonFeelingsAboutPartner","comparisonFeelingsAboutSelf",
                                       "intensity","moreComparisons","timeSinceInteraction","interactionLength","modeOfSocialInteraction",
                                       "soughtSocialSupport","helpfulnessOfOwnSupport","helpfulnessOfOtherSupport","socialInteractionConflict",
                                       "conflictInstigator","conflictIntensity", "conflictResolution",
                                       "interactionAnxious","interactionAngry","interactionHappy","interactionRelaxed","interactionThoughts",
                                       "interactionMemories","interactionInitiator","interactionEnder","closenessToInteractionPartner",
                                       "interactionPartnerAge","interactionPartnerEthnicity","interactionPartnerSex",
                                       "interactionPartnerSexualOrientation", "sameInteraction","mood", "optimism", "satisfaction",
                                       "feelingsAboutPartner","feelingsAboutSelf")]

#check your data frame to determine which variables to sort by                                       
View(reorganized.data)
#organize data by id and uniqu key
reorganized.data <- reorganized.data[order(reorganized.data[,1], reorganized.data[,2]),]
row.names(reorganized.data)<-NULL
#check your data frame before saving it
View(reorganized.data)

#write as a csv file
setwd("/Users/sabrinathai/Documents/Clean and Convert ExperienceSampler Server Data/No Loops in Data")
write.csv(reorganized.data, "CRC Experience Sampling Data - One Comparison Per Line.csv", row.names=FALSE)
