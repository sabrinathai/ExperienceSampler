####Load All Necessary Libraries####
library(tools)
#install.packages("tidyr"); install.packages("stringr"); install.packages("plyr")
library("tidyr")
library("stringr")
library("plyr")

####Set Your Working Directory and Read In Raw Data From Server####
setwd("") #set directory path to folder for raw data
####Read in Raw Server Data and Save to File####
save.raw.data <- function(pid){
  for (i in 1:length(pid)){
    URL <-paste('http://URL/participant', pid[i] ,'data.csv',sep="_") #where URL is your full server URL
    raw.data <-read.delim(URL, header=F)
    write.csv(raw.data, paste(pid[i],".csv",sep=""), row.names=FALSE)
  }
}

####Make Array of PIDs####
#input all PIDs 
#the first number is the first PID, and the second number is the last PID 
#assuming that PIDs are assigned in sequential order
allPIDs <- c(1:154)
#make a vector of missing PIDs
missingPIDs <-c(6,8,33,34,88,92,101,131,156,161,162) #if you don't have any missing ids, comment this line out
#create final vector of PIDs to iterate through
pids <- allPIDs [! allPIDs %in% missingPIDs] #if you don't have any missing ids, comment this line out
#tell R where to save all your raw data
setwd("") #this path should be to your saved data; should be the same as line 9
#get and save all your raw data
save.raw.data(pids)

###Get list of files to process
rawfiles <- list.files(path="", pattern="*.csv", ) #should be the same as line 9

####FUNCTION TO CLEAN AND SPLICE THE DATA####
###Server data is tab delimited### - separtor is "\t"
###Google data is comma-separated values### - separator is ","
clean.data <- function (fileList){
  for (i in 1:length(fileList)){
    setwd("") #same as line 9
    data <- read.csv(fileList[i], sep="\t", header = F) #change sep depending on whether it is tab delimited or comma-separated values
    pid <-file_path_sans_ext(fileList[i])
    colnames(data)<-c("variable.string", "values")
    ####Remove Duplicate Rows from Dataset####
    #Sometimes ExperienceSampler will write the same data more than once 
    #because the participant will try to send the data more than once. 
    data.clean <- unique(data, )
    row.names(data.clean)<-NULL

    ####Splice the Data####
    values <- data.frame(data.clean$values)
    variable.string <- data.frame(data.clean$variable.string)
    spliced.variable.key<-data.frame(variable.string, do.call(rbind, str_split(variable.string$data.clean.variable.string, "_", n=8)))
    spliced.variable.key$data.clean.variable.string<-NULL
    spliced.variable.key.merged<-data.frame(list(spliced.variable.key,values))
    colnames(spliced.variable.key.merged)<-c("unique.key","variable.name","year","month","date","hour","minute","second", "values")  

    ####Convert Timestamps####
    ###Timestamps must have leading 0s so they are sorted correctly.###
    #convert timestamps to have leading 0s so data will be sorted correctly
    ###Add Leading 0s to Timestamps###
    #months
    spliced.variable.key.merged$month<-str_pad(spliced.variable.key.merged$month, 2, side=c("left"), pad="0")
    #dates
    spliced.variable.key.merged$date<-str_pad(spliced.variable.key.merged$date, 2, side=c("left"), pad="0")
    #hours
    spliced.variable.key.merged$hour<-str_pad(spliced.variable.key.merged$hour, 2, side=c("left"), pad="0")
    #minutes
    spliced.variable.key.merged$minute<-str_pad(spliced.variable.key.merged$minute, 2, side=c("left"), pad="0")
    #seconds
    spliced.variable.key.merged$second<-str_pad(spliced.variable.key.merged$second, 2, side=c("left"), pad="0")

    #merge columns together for updated date column
    spliced.data<-unite(spliced.variable.key.merged, "timestamp", year, month, date, hour, minute, second, sep="_", remove=TRUE)
    colnames(spliced.data)<-c("unique.key", "variable.name", "timestamp", "values")


    ####Remove All Non-Data Lines####
    #Remove any line of data that does not have real data
    remove.non.data<-with(spliced.data, spliced.data[!(unique.key=="pause" | unique.key=="notification" |
                                                   unique.key=="weekdayWakeHour"|unique.key== "weekdayWakeMinute" | 
                                                   unique.key== "weekendWakeHour" | unique.key== "weekendWakeMinute" | 
                                                   unique.key== "weekdayDinnerHour" | unique.key== "weekdayDinnerMinute" | 
                                                   unique.key== "weekendDinnerHour" | unique.key== "weekendDinnerMinute" | 
                                                   unique.key== "snoozed" | unique.key== "uniqueKey"| 
                                                   unique.key== "notification1" | unique.key== "notification2" | 
                                                   unique.key== "notification3" | unique.key== "notification4" | 
                                                   unique.key== "notification5" | unique.key== "notification6" | 
                                                   unique.key== "notification7" | unique.key== "notification8" |
                                                   unique.key== ""), ])
    row.names(remove.non.data)<-NULL

    ####Sort Data By Unique Key and then Timestamp####
    sorted.data <- remove.non.data[order(remove.non.data[,1], remove.non.data[,3]),]
    row.names(sorted.data)<-NULL
    
    ####Write Spliced Data to File####
    ###Write this data to a separate folder so you know what difference between spliced data and raw data
    setwd("") #different from line 9; make a new folder
    write.csv(sorted.data, paste(pid,".csv",sep=""), row.names=FALSE)  
  }
}

####CLEAN AND SPLICE THE DATA####
clean.data(rawfiles)

####Make Merged File of ALL Spliced Data####
setwd("") #set to same directory path as line 100
spliced.files <- list.files(pattern="*.csv", full.names = F)
all.spliced.data <- lapply(spliced.files, function(.file){
  dat<-read.csv(.file, header=T)
  dat <- dat[,1:4] 
  dat$id<-as.numeric(file_path_sans_ext(.file))  
  dat    # return the dataframe
})

spliced.dataframe <- do.call(rbind, all.spliced.data)
setwd("") #set directory to be outside the spliced data folder
write.csv(spliced.dataframe, "all.spliced.data.csv", row.names=FALSE)
