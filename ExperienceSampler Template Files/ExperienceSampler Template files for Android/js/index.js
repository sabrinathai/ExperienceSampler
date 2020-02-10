/*EXPERIENCESAMPLER LICENSE
The MIT License (MIT)
Copyright (c) 2014-2020 Sabrina Thai & Elizabeth Page-Gould
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

/* activate localStorage */
var localStore = window.localStorage;

/* surveyQuestion Model (This time, written in "JSON" format to interface more cleanly with Mustache) */
/* This is used to input the questions you would like to ask in your experience sampling questionnaire*/
var surveyQuestions = [
/*number each question in this variable starting from 0, so it is easy to reference question items when setting up question logic*/
                       /*0*/
                       /*snooze question, where selecting "No" snoozes the app for a predetermined amount of time*/
                       /*this is a multiple choice question*/
                       {
                       "type":"mult1",
                       "variableName": "snooze",
                       "questionPrompt": "Are you able to take the survey now?",
                       "minResponse": 0,
                       "maxResponse": 1,
                       "labels": [
                                {"label": "No"},
                                {"label": "Yes"}
                                ],
                       },
                       /*1*/
                       /*"instructions" or descriptive texts only need 3 properties. You simply need to type in your instructions
                       or descriptive texts in the questionPrompt section*/
                       {
                       "type":"question type",
                       "variableName": "variableName",
                       "questionPrompt": "Exact question wording",
                       },
                       /*2*/
                       /*a "mult1" question is for multiple choice questions and for Likert-scale items that only contain 
                       positive values (including 0). Below is what a multiple choice question would look like*/
                       {
                       "type":"question type",
                       "variableName": "variableName",
                       "questionPrompt": "Exact question wording",
                       "minResponse": /*minimum numerical value of the scale or multiple choice option*/,
                       "maxResponse": /*maximum numerical value of the scale or multiple choice option*/,
                       "labels": [
                                {"label": "label for minimum numerical value of scale or first option for multiple choice question"},
                                {"label": "label for maximum numerical value of scale or second option for multiple choice question"}
                                ],
                       },
                       /*3*/
                       /*this is what a "mult1" for a regular rating scale with only positive values (including 0) looks like*/                       
                       {
                       "type":"question type",
                       "variableName": "variableName",
                       "questionPrompt": "Exact question wording",
                       "minResponse": /*minimum numerical value of rating scale*/,
                       "maxResponse": /*maximum numerical value of rating scale*/,
                       "labels": [
                                {"label": "label for lowest value of rating scale"},
                                {"label": "label for next lowest value of rating scale"},
                                {"label": "label for next lowest value of rating scale"},
                                {"label": "label for midpoint of scale"},
                                {"label": "label for next highest value of rating scale"},
                                {"label": "label for next highest value of rating scale"},
                                {"label": "label for highest value of rating scale"},
                                ]
                       },
                       /*4*/
                       /*a "checklist" question looks exactly the same as a multiple choice option in terms of what properties
                       you need to specify. The different in formatting will appear when ExperiencesSampler renders it. */
                       {
                       "type":"question type",
                       "variableName": "variableName",
                       "questionPrompt": "Exact question wording",
                       "minResponse": /*minimum numerical value of the scale or multiple choice option*/,
                       "maxResponse": /*maximum numerical value of the scale or multiple choice option*/,
                       
                       "labels": [
                                {"label": "label for minimum numerical value of scale or first option for checklist question"},
                                {"label": "label for maximum numerical value of scale or second option for checklist question"}
                                ],
                       },
                       /*5*/
                       /*a "slider" item using a sliding rating scale. It only needs your question prompt and the minimum and
                       maximum values of your sliding scale. ExperienceSampler will set the default value to be the midpoint*/
                       {
                       "type":"question type",
                       "variableName": "variableName",
                       "questionPrompt": "Exact question wording",
                       "minResponse": /*minimum numerical value of the scale or multiple choice option*/,
                       "maxResponse": /*maximum numerical value of the scale or multiple choice option*/,
                       },
                       /*6*/
                       /*mult2 is a question where the scale values are reversed (i.e., max response value is assigned to the 
                       first label and the min value is assigned to the last label). This question format is useful
                       if you have a scale that ranges from a negative value to a positive value. Existing research (e.g., Schwarz & Keus, 2004)
                       suggests mental numbers with both positive numbers and negative numbers have positive numbers on top 
                       and negative numbers towards the bottom */
                       {
                       "type":"mult2",
                       "variableName": "variableName",
                       "questionPrompt": "Exact question wording",
                       "minResponse": /*minimum numerical value of rating scale*/,
                       "maxResponse": /*maximum numerical value of rating scale*/,
                       "labels": [
                       			{"label": "label for highest scale point"},
                       			{"label": "label for next largest scale point"},
                       			{"label": "label for next largest scale point"},
                       			{"label": "label for midpoint of scale point"},
                                {"label": "label for next scale point"},
                                {"label": "label for next smallest scale point"},
                                {"label": "label for smallest scale point"},
                                ]
                       },
                       /*7*/
                       /*a "text" question is an open-ended question in which participants can enter values*/
                       {
                       "type":"question type",
                       "variableName": "variableName",
                       "questionPrompt": "Exact question wording",
                       },
			/*8*/
			/* a "link" question allows participants to access a survey through an onine survey platform*/
			{
                       "type":"question type",
                       "variableName": "variableName",
                       "questionPrompt": “Please click <a href=‘insert your link here’ target=‘_blank’>HERE</a> to open your survey.”,
                       },       
                       /*input additional questions*/
                       ];

/*These are the messages that are displayed at the end of the questionnaire*/
var lastPage = [
		/*input your last-page message*/
                {
                message: "End of questionnaire message"
                },
                /*input snooze last-page message*/
                {
                message: "Snooze message"
                }
                ];

/*Questions to set up participant notifications so that notifications are customized to participant's schedule*/                
var participantSetup = [
                        {
						"type":"text",
						"variableName": "participant_id",
						"questionPrompt": "Please enter your participant ID:"
                        },
						{
						"type":"timePicker",
						"variableName": "weekdayWakeTime",
						"questionPrompt": "What time do you normally wake up on weekdays?"
                        },
						{
						"type":"timePicker",
						"variableName": "weekdaySleepTime",
						"questionPrompt": "What time do you normally sleep on weekdays?"
                        },                        
						{
						"type":"timePicker",
						"variableName": "weekendWakeTime",
						"questionPrompt": "What time do you normally wake up on weekends?"
                        },
						{
						"type":"timePicker",
						"variableName": "weekendSleepTime",
						"questionPrompt": "What time do you normally eat go to sleep on weekends?"
                        }              
                    ];

/*Populate the view with data from surveyQuestion model*/
// Making mustache templates
//This line determines the number of questions in your participant setup
//Shout-out to Rebecca Grunberg for this great feature!
var NUMSETUPQS = participantSetup.length;
//This line tells ExperienceSampler which question in surveyQuestions is the snooze question
//If you choose not to use the snooze option, just comment it out
var SNOOZEQ = 0;
//This section of code creates the templates for all the question formats
var questionTmpl = "<p>{{{questionText}}}</p><ul>{{{buttons}}}</ul>";
var questionTextTmpl = "{{{questionPrompt}}}";
var buttonTmpl = "<li><button id='{{id}}' value='{{value}}'>{{label}}</button></li>";
var textTmpl = "<li><textarea cols=50 rows=5 id='{{id}}'></textarea></li><li><button type='submit' value='Enter'>Enter</button></li>";
var numberTmpl = "<li><input type='number' id='{{id}}'></input></li><br/><br/><li></li><li><button type='submit' value='Enter'>Enter</button></li>";
var checkListTmpl =  "<li><input type='checkbox' id='{{id}}' value='{{value}}'>{{label}}</input></li>";
var instructionTmpl = "<li><button id='{{id}}' value = 'Next'>Next</button></li>";
var linkTmpl = "<li><button id='{{id}}' value = 'Next'>Click here AFTER finishing the survey in the link above</button></li>";
var sliderTmpl = "<li><input type='range' min='{{min}}' max='{{max}}' value='{{value}}' orient=vertical id='{{id}}' oninput='outputUpdate(value)'></input><output for='{{id}}' id='slider'>50</output><script>function outputUpdate(slidervalue){document.querySelector('#slider').value=slidervalue;}</script></li><li><button type='submit' value='Enter'>Enter</button></li>";
var datePickerTmpl = '<li><input id="{{id}}" data-format="DD-MM-YYYY" data-template="D MMM YYYY" name="date"><br /><br /></li><li><button type="submit" value="Enter">Enter</button></li><script>$(function(){$("input").combodate({firstItem: "name",minYear:2015, maxYear:2016});});</script>';
var dateAndTimePickerTmpl = '<li><input id="{{id}}" data-format="DD-MM-YYYY-HH-mm" data-template="D MMM YYYY  HH:mm" name="datetime24"><br /><br /></li><li><button type="submit" value="Enter">Enter</button></li><script>$(function(){$("input").combodate({firstItem: "name",minYear:2015, maxYear:2016});});</script>';
var timePickerTmpl = "<li><input id ='{{id}}' type='time'></input><br /><br /></li><li><button type='submit' value='Enter'>Enter</button></li>";
var lastPageTmpl = "<h3>{{message}}</h3>";
//This line generates the unique key variable. You will not assign the value here, because you want it the value to change
//with each new questionnaire
var uniqueKey;
//If you need to declare any other global variables (i.e., variables to be used in more than one function of ExperienceSampler)
//you should declare them here. 
//For example, you might declare your piped text variable or your question branch response variable
//var name /*sample piped text variable*/

var app = {
    // Application Constructor
initialize: function() {
    this.bindEvents();
},
    // Bind Event Listeners
bindEvents: function() {
    document.addEventListener("deviceready", this.onDeviceReady, false);
    document.addEventListener("resume", this.onResume, false);
    document.addEventListener("pause", this.onPause, false);
},
//these functions tell the app what to do at different stages of running
onDeviceReady: function() {
    app.init();
},

onResume: function() {app.sampleParticipant();},

onPause: function() {app.pauseEvents();},

//Beginning our app functions
/* The first function is used to specify how the app should display the various questions. You should note which questions 
should be displayed using which formats before customizing this function*/
renderQuestion: function(question_index) {
    //First load the correct question from the JSON database
	var question;
    if (question_index <= -1) {question = participantSetup[question_index + NUMSETUPQS];}
    else {question = surveyQuestions[question_index];}
    var questionPrompt = question.questionPrompt;
    //If you want to include piped text in your question wording, you would implement it in this section. 
    //Below is an example of how you would look for the NAME placeholder in your surveyQuestion questionPrompts 
    //and replace it with the response value that you assign to the name variable
    //See our example app to see how you can implement this
	/*if (questionPrompt.indexOf('NAME') >= 0) {
		questionPrompt = questionPrompt.replace("NAME", function replacer() {return name;});
      	}*/
    question.questionText = Mustache.render(questionTextTmpl, {questionPrompt: questionPrompt});    
    //Now populate the view for this question, depending on what the question type is
    //This part of the function will render different question formats depending on the type specified
    //Another shout-out to Rebecca Grunberg for this amazing improvement to ExperienceSampler
    switch (question.type) {
    	case 'mult1': // Rating scales (i.e., small numbers at the top of the screen and larger numbers at the bottom of the screen).
    		question.buttons = "";
        	var label_count = 0;
        	for (var i = question.minResponse; i <= question.maxResponse; i++) {
            	var label = question.labels[label_count++].label;
            	//If you want to implement piped text in your wording choice, you would place it here
    			//Below is an example of how you would look for the NAME placeholder in your surveyQuestion labels 
    			//and replace it with 
//                 if (label.indexOf('NAME') >= 0){
//             		label = label.replace("NAME", function replacer() {return name;});
//             		}            	
            	question.buttons += Mustache.render(buttonTmpl, {
                                                id: question.variableName+i,
                                                value: i,
                                                label: label
                                                });
        	}
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	$("#question ul li button").click(function(){
        		app.recordResponse(this, question_index, question.type);
        	});
        	break;
        case 'mult2': // Rating scales (i.e., positive numbers at the top of the screen and negative numbers at the bottom of the screen).
    		question.buttons = "";
            var label_count = 0;
            for (var j = question.maxResponse; j >= question.minResponse; j--) {
                var label = question.labels[label_count++].label;
                if (label.indexOf('NAME') >= 0){
            		label = label.replace("NAME", function replacer() {return name;});
            		}
                question.buttons += Mustache.render(buttonTmpl, {
                                                    id: question.variableName+j,
                                                    value: j,
                                                    label: label
                                                    });
            }
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	$("#question ul li button").click(function(){
        		app.recordResponse(this, question_index, question.type);
        	});
        	break;		
        case 'checklist':  
        	question.buttons = "";
        	var label_count = 0;
        	var checkboxArray = [];
        	for (var i = question.minResponse; i <= question.maxResponse; i++) {
            	var label = question.labels[label_count++].label;
            	if (label.indexOf('NAME') >= 0){
            		label = label.replace("NAME", function replacer() {return name;});
            		}
            	question.buttons += Mustache.render(checkListTmpl, {
                                                	id: question.variableName+i,
                                                	value: i,
                                                	label: label
                                                	});
        	}
        	question.buttons += "<li><button type='submit' value='Enter'>Enter</button></li>";
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	$("#question ul li button").click( function(){
                                          checkboxArray.push(question.variableName);
                                          $.each($("input[type=checkbox]:checked"), function(){checkboxArray.push($(this).val());});
                                          app.recordResponse(String(checkboxArray), question_index, question.type);
            });
            break;
        case 'slider':
        	question.buttons = Mustache.render(sliderTmpl, {id: question.variableName+"1"}, {min: question.minResponse}, {max: question.maxResponse}, {value: (question.maxResponse)/2});
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	var slider = [];
        	$("#question ul li button").click(function(){
        			slider.push(question.variableName);
        			slider.push($("input[type=range]").val());
        			app.recordResponse(String(slider), question_index, question.type);
        	});
        	break;
        case 'instructions':
        	question.buttons = Mustache.render(instructionTmpl, {id: question.variableName+"1"});
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	var instruction = [];
        	$("#question ul li button").click(function(){ 
        		instruction.push(question.variableName);
        		instruction.push($(this).val());
        		app.recordResponse(String(instruction), question_index, question.type);
        	});
        	break;
        case 'link':
        	question.buttons = Mustache.render(linkTmpl, {id: question.variableName+"1"});
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	var instruction = [];
        	$("#question ul li button").click(function(){ 
        		instruction.push(question.variableName);
        		instruction.push($(this).val());
        		app.recordResponse(String(instruction), question_index, question.type);
        	});
        	break; 
	case 'text': //default to open-ended text
        	question.buttons = Mustache.render(textTmpl, {id: question.variableName+"1"});
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	$("#question ul li button").click(function(){
				//If you want to force a response from your participants for 
				//open-ended questions, you should uncomment this portion of the code
// 				if (app.validateResponse($("textarea"))){
        		 	app.recordResponse($("textarea"), question_index, question.type);
//                 } 
//                 else {
//                     alert("Please enter something.");
//                 }
            });
            break;        
	    case 'number': //default to open-ended text
        	question.buttons = Mustache.render(numberTmpl, {id: question.variableName+"1"});
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	$("#question ul li button").click(function(){
				//If you want to force a response from your participants for 
				//open-ended questions, you should uncomment this portion of the code
				if (app.validateNumber($("input"))){
        		 	app.recordResponse($("input"), question_index, question.type);
                } 
                else {
                    alert("Please enter a number.");
                }
            });
            break; 
		    
        case 'datePicker':
        	question.buttons = Mustache.render(datePickerTmpl, {id: question.variableName+"1"});
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	var date, dateSplit, variableName = [], dateArray = [];
        	$("#question ul li button").click(function(){
        		date = $("input").combodate('getValue');
        		dateArray.push(question.variableName);
        		dateArray.push(date);
        		app.recordResponse(String(dateArray), question_index, question.type);
        	});
        	break;    
        case 'dateAndTimePicker':
        	question.buttons = Mustache.render(dateAndTimePickerTmpl, {id: question.variableName+"1"});
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	var date, dateSplit, variableName = [], dateArray = [];
        	$("#question ul li button").click(function(){
        		date = $("input").combodate('getValue');
        		dateArray.push(question.variableName);
        		dateArray.push(date);
        		app.recordResponse(String(dateArray), question_index, question.type);
        	});
        	break;
        case 'timePicker':
        	question.buttons = Mustache.render(timePickerTmpl, {id: question.variableName+"1"});
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	var time, timeSplit, variableName = [], timeArray = [];
        	$("#question ul li button").click(function(){
				if (app.validateTime($("input"))){
        		 	app.recordResponse($("input"), question_index, question.type);
                } 
                else {
                    alert("Please enter a time.");
                }
        	});
        	break;	        		                 
        }
    },
    
renderLastPage: function(pageData, question_index) {
    $("#question").html(Mustache.render(lastPageTmpl, pageData));
	//This section should be implemented if you choose to use a snooze feature
	//It tells ExperienceSampler that if the participant has chosen to snooze the app,
	//the app should save a snooze value of 1 (this value will be used to reset the unique key, so that
	//this data is does not have the same unique key as the subsequent questionnaire)
    /*if ( question_index == SNOOZEQ ) {
        app.snoozeNotif();
        localStore.snoozed = 1;
        app.saveData();        
    }*/
    //If you choose to implement the snooze function, uncomment the else in the statement below
    /*else*/ if ( question_index == -1) {
    	app.saveDataLastPage();
    }
    //This part of the code says that if the participant has completed the entire questionnaire,
    //ExperienceSampler should create a completed tag for it.
    //This tag will be used to count the number of completed questionnaires participants have completed
    //at the end of each day
    //The time stamp created here will also be used to create an end time for your restructured data
    else {
    	var datestamp = new Date();
    	var year = datestamp.getFullYear(), month = datestamp.getMonth(), day=datestamp.getDate(), hours=datestamp.getHours(), minutes=datestamp.getMinutes(), seconds=datestamp.getSeconds(), milliseconds=datestamp.getMilliseconds();
    	localStore[uniqueKey + '.' + "completed" + "_" + "completedSurvey"  + "_" + year + "_" + month + "_" + day + "_" + hours + "_" + minutes + "_" + seconds  + "_" + milliseconds] = 1;	
    	app.saveDataLastPage();
    }
},

/* Initialize the whole thing */
init: function() {
	//First, we assign a value to the unique key when we initialize ExperienceSampler
	uniqueKey = new Date().getTime();
	//The statement below states that if there is no participant id or if the participant id is left blank,
	//ExperienceSampler would present the participant set up questions
	if (localStore.participant_id === " " || !localStore.participant_id || localStore.participant_id == "undefined") {app.renderQuestion(-NUMSETUPQS);}  
	//otherwise ExperienceSampler should just save the unique key and display the first question in survey questions  
	else {
    	uniqueKey = new Date().getTime();
        localStore.uniqueKey = uniqueKey;
    	var startTime = new Date(uniqueKey);
    	var syear = startTime.getFullYear(), smonth = startTime.getMonth(), sday=startTime.getDate(), shours=startTime.getHours(), sminutes=startTime.getMinutes(), sseconds=startTime.getSeconds(), smilliseconds=startTime.getMilliseconds();
    	localStore[uniqueKey + "_" + "startTime"  + "_" + syear + "_" + smonth + "_" + sday + "_" + shours + "_" + sminutes + "_" + sseconds + "_" + smilliseconds] = 1;	   		
        app.renderQuestion(0);
    }
    localStore.snoozed = 0;
},
  
/* Record User Responses */  
recordResponse: function(button, count, type) {
		//uncomment up to "localStore[uniqueRecord] = response;" to test whether app is recording and sending data correctly (Stage 2 of Customization)
		//This tells ExperienceSampler how to save data from the various formats
    //Record date (create new date object)
//     var datestamp = new Date();
//     var year = datestamp.getFullYear(), month = datestamp.getMonth(), day=datestamp.getDate(), hours=datestamp.getHours(), minutes=datestamp.getMinutes(), seconds=datestamp.getSeconds(), milliseconds=datestamp.getMilliseconds();
//     //Record value of text field
//     var response, currentQuestion, uniqueRecord;
//     if (type == 'text') {
//         response = button.val();
//         // remove newlines from user input
//         response = response.replace(/(\r\n|\n|\r)/g, ""); //encodeURIComponent(); decodeURIComponent()
//         currentQuestion = button.attr('id').slice(0,-1);
//     }
//     else if (type == 'number') {
//         response = button.val();
//         // remove newlines from user input
//         response = response.replace(/(\r\n|\n|\r)/g, ""); //encodeURIComponent(); decodeURIComponent()
//         currentQuestion = button.attr('id').slice(0,-1);
//     }        	
//     else if (type == 'slider') {
//     	response = button.split(/,(.+)/)[1];
//         currentQuestion = button.split(",",1);
//     }
//     //Record the array
//     else if (type == 'checklist') {
//         response = button.split(/,(.+)/)[1];
//         currentQuestion = button.split(",",1);
//     }
//     else if (type == 'instructions') {
//     	response = button.split(/,(.+)/)[1];
//         currentQuestion = button.split(",",1);
//     }
//     //Record value of clicked button
//     else if (type == 'mult1') {
//         response = button.value;
//         //Create a unique identifier for this response
//         currentQuestion = button.id.slice(0,-1);
//     }
//     //Record value of clicked button
//     else if (type == 'mult2') {
//         response = button.value;
//         //Create a unique identifier for this response
//         currentQuestion = button.id.slice(0,-1);
//     }
//     else if (type == 'datePicker') {
// 		response = button.split(/,(.+)/)[1];
//      	currentQuestion = button.split(",",1);
//     }
//     else if (type == 'dateAndTimePicker') {
// 		response = button.split(/,(.+)/)[1];
//      	currentQuestion = button.split(",",1);
//     }
//     else if (type == 'timePicker') {
//     	response = button.val();
//         currentQuestion = button.attr('id').slice(0,-1);
//     }
//     if (count <= -1) {uniqueRecord = currentQuestion}
//     else {uniqueRecord = uniqueKey + "_" + currentQuestion + "_" + year + "_" + month + "_" + day + "_" + hours + "_" + minutes + "_" + seconds + "_" + milliseconds;}
//     //Save this to local storage
//     localStore[uniqueRecord] = response;
//		


//		/*Question Logic Statements*/
		//Stage 3 of Customization
// 		//if your questionnaire has two branches based on the absence or presence of a phenomenon, you will need the next statement
// 		//this statement allows you to record whether the phenomenon was absent or present so you can specify which branch the participant should complete when
// 		//the questionnaire splits into the two branches
// 		//if not then you do not need the next statement and should leave it commented out
//     if (count == 0) {phenomenonPresence = response;}
//		//if you have piped text, you would assign your response variable here
//		//where X is the question index number of the question you ask for response you would like to pipe
//		//In this example, we just use name to consist with our earlier variables
//		if (count ==X) {name = response;}
//		//The line below states that if the app is on the last question of participant setup, it should schedule all the notifications
//		//then display the default end of survey message, and then record which notifications have been scheduled.
//		//You will test local notifications in Stage 4 of customizing the app
//		********IF YOU HAVE NO QUESTION LOGIC BUT HAVE SCHEDULED NOTIFICATIONS, YOU NEED TO UNCOMMENT THE FOLLOWING LINE
//		TO EXECUTE THE scheduleNotifs() FUNCTION********	
//     if (count == -1){app.scheduleNotifs();app.renderLastPage(lastPage[0], count);app.scheduledNotifs();}
//     //Identify the next question to populate the view
//		//the next statement is about the snooze function
// 		//This statement says that if the participant says they are currently unable to complete the questionnaire now,
// 		//the app will display the snooze end of survey message. You can customize the snooze function in Stage 4 of Customization 
//     else if (count == SNOOZEQ && response == 0) {app.renderLastPage(lastPage[1], count);}
// 		//The statement below tells the survey under what conditions should participants be shown one branch of the questionnaire as opposed to the other
// 		//Remember each question logic requires at least two lines of code
// 		//Replace X with the question number where the questionnaire splits into two branches
// 		//Replace Y with the response associated with the presence of the phenomenon and A with the number of the question participants should be presented with
// 		//Replace Z with the response associated with the absence of the phenomenon and B with the number of the question participants should be presented with
//		//The code that preceded the app.renderQuestion function is just telling ExperienceSampler that the previous question should fade out
//		//You can choose not implement this feature; however, we have made the question fade in feature a default function of ExperienceSampler (another shout-out to 
//		//to Rebecca Grunberg for the great idea), and it looks more aesthetically pleasing if the fade in is accompanied by a fade out
//     else if (count == X & response < 10 && phenomenonPresence == Y) {$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(A);});}
//     else if (count == X & response < 10 && phenomenonPresence == Z) {$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(B);});}
// 		//The next two statements illustrate the structure that all other question logic statements will follow
// 		//They are similar to the ones regarding the absence and presence of the phenomenon, except this time the critical condition is the response chosen
// 		//The first statement says if the question number is X and the response is less than Y, display question number Z
//		//In that statement, replace X with the question number where the question logic occurs, Y with the specific response value that will trigger the question logic, 
// 		//and Z with the question number that should be displayed if response Y is chosen
// 		//The second statement, says if the question number is X and the response is not equal to Y, display question number A
//		//Remember that to do question logic for one question, you need to have AT LEAST two conditional statements about what to do if the trigger response is chosen, AND
// 		//what to do if the trigger response is NOT chosen. 
//     else if (count == X && response == Y) {$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(Z);});}
//     else if (count == X && response !== Y) {$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(A);});}


// 		//Uncomment the "/*else*/" below only when customizing question logic (Stage 3), so that the app will just proceed to the next question in the JSON database
// 		//DO NOT uncomment the "/*else*/" below when testing whether questions are being displayed in the right format (Stage 1) OR if you have no question logic 
		//in your questionnaire
	   /*else*/ if (count < surveyQuestions.length-1) {$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(count+1);});}
	   else {app.renderLastPage(lastPage[0], count);};
},
    
/* Prepare for Resume and Store Data */
/* Time stamps the current moment to determine how to resume */
pauseEvents: function() {
    localStore.pause_time = new Date().getTime();
    localStore.uniqueKey = uniqueKey;	
    app.saveData();
},
      
sampleParticipant: function() {
    var current_moment = new Date();
    var current_time = current_moment.getTime();
    //change X to the amount of time the participant is locked out of the app for in milliseconds
    //e.g., if you want to lock the participant out of the app for 10 minutes, replace X with 600000
    //If you don't have a snooze feature, remove the "|| localStore.snoozed == 1"
    if ((current_time - localStore.pause_time) > X || localStore.snoozed == 1) {
        uniqueKey = new Date().getTime();
        localStore.snoozed = 0;
    	var startTime = new Date(uniqueKey);
    	var syear = startTime.getFullYear(), smonth = startTime.getMonth(), sday=startTime.getDate(), shours=startTime.getHours(), sminutes=startTime.getMinutes(), sseconds=startTime.getSeconds(), smilliseconds=startTime.getMilliseconds();
    	localStore[uniqueKey + "_" + "startTime"  + "_" + syear + "_" + smonth + "_" + sday + "_" + shours + "_" + sminutes + "_" + sseconds + "_" + smilliseconds] = 1;	   	    
        app.renderQuestion(0);
    }
    else {
    	uniqueKey = localStore.uniqueKey;
    }
    app.saveData();
},

//uncomment this function to test data saving function (Stage 2 of Customization)
saveDataLastPage:function() {
//     $.ajax({
//            type: 'post',
//            url: 'server url (i.e., url for where to send the data)',
//            data: localStore,
//            crossDomain: true,
//            success: function (result) {
//            var pid = localStore.participant_id, snoozed = localStore.snoozed, uniqueKey = localStore.uniqueKey, pause_time=localStore.pause_time;
//            localStore.clear();
//            localStore.participant_id = pid;
//            localStore.snoozed = snoozed;
// 		localStore.uniqueKey = uniqueKey;
// 		localStore.pause_time=pause_time;
//            $("#question").html("<h3>Your responses have been recorded. Thank you for completing this survey.</h3>");
//            },

//            error: function (request, error) {
// 				console.log(error);
//                 $("#question").html("<h3>Please try resending data. If problems persist, please contact the researchers (uoft.dailylifestudy@gmail.com).</h3><br><button>Resend data</button>");
//                 $("#question button").click(function () {app.saveDataLastPage();});    
// 				}
//            });
},

//uncomment this function to test data saving function (Stage 2 of Customization)
saveData:function() {
//     $.ajax({
//            type: 'post',
//            url: 'server url (i.e., url for where to send the data)',
//            data: localStore,
//            crossDomain: true,
//            success: function (result) {
//            var pid = localStore.participant_id, snoozed = localStore.snoozed, uniqueKey = localStore.uniqueKey;
//            localStore.participant_id = pid;
//            localStore.snoozed = snoozed;
// 			  localStore.uniqueKey = uniqueKey;
//            },
//            error: function (request, error) {console.log(error);}
//            });
},
    
// Local Notifications Javascript
// Stage 5 of Customization
//This code is for a interval-contingent design where all participants answer the questionnaire at the same time
//(i.e., not customized to their schedule)
scheduleNotifs:function(){
//	//Section 1 - Declaring necessary variables
//	//need an interval variable, 
//	var interval;
// 	//a variable for the notification id
//	var a;
//  //one to represent each of new dates to be calculated for each signal
// 	var date1;
// 	//Then you need a variable to represent the amount of time from now until the first signal
//	var nextDiaryLag
//	//Then you can declare any values that you might use more than once such as the number of milliseconds in a day
//	var day = 86400000; 
//	//You'll also need to get time the app is being installed
//	var now = new Date().getTime();
// 	//Now you can use the date object approach to set the time of the first signal
//	//in this example, we will set it to 8PM
//	var startDate = new Date();
// 	var startDay = startDate.getDate();
//	var startTime = startDate.setDate((startDay+1), 20,0,0,0);
//	//Now calculate the amount of time between installation time and the first signal
//	nextDiaryLag = parseInt(startTime) - parseInt(now);

//	//Section 2 to 5 go inside the for loop
//	// Set X to the length of your experience sampling period (i.e., how many days you will 
//	// be collecting data from your participants)
// for (i = 0; i < X; i++){
	
// 	//Section 2 - Calculate time intervals
//	//For this design you just calculate how many milliseconds until the first signal and then add multiples of the 
//	//number of milliseconds in day to this so that it fires everyday of your experience sampling data collection period
//	 interval = nextDiaryLag + day*i;
// 	//now convert this interval into a new date object that the plugin can use to schedule your notification
// 	date1 = new Date(now + interval);

//	//Section 3 - Creating Unique Ids - create a unique notification id so notifications don't overwrite each other
// 	//set it to the counter value to ensure it is unique
// 	a = i;

// 	//Section 4 - Scheduling the notification
// 	//Now put all these properties into the scheduling function of the plugin
// 	cordova.plugins.notification.local.schedule({icon: 'ic_launcher', id: a, at: date1, text: 'Time for your next Diary Survey!', title: 'Diary Survey'});

// 	//Section 5 - Recording notifications
// 	//Now you want to record your notifications to make sure that they have been scheduled
// 	//You can also calculate response latencies if you with these values later if you want
//	localStore['notification_' + a] = localStore.participant_id + "_" + a + "_" + date1; 
// }
},

// This code is for signal-contingent designs with varying time intervals between notifications
// scheduleNotifs:function() {
//		//Section 1 - Declaring necessary variables
// 		//Declares the number of intervals between the notifications for each day (i.e., if beeping participants 6 times, declare 6 intervals)
//     var interval1, interval2, interval3, interval4, interval5, interval6;

// 		//Declares a variable to represent the id of each notification for the day
// 		//Declare as many letters as you have intervals (i.e., 6 intervals, declare 6 ids)
//     var a, b, c, d, e, f;

// 		//Declare a variable to represent new date to be calculated for each beep
//		//That is, if there are 6 intervals, declare 6 new dates
//     var date1, date2, date3, date4, date5, date6;

// 		//The statement below declares the start and end time of the daily data collection period
// 		//These variables are not necessary if the start and end time of the daily data collection period do not vary across the experience
// 		//sampling data collection period
//     var currentMaxHour, currentMaxMinute, currentMinHour, currentMinMinute, nextMinHour, nextMinMinute;

// 		//The next three lines create variables for the present time when the notifications are being scheduled
//     var dateObject = new Date();
//     var now = dateObject.getTime();
//     var dayOfWeek = dateObject.getDay(), currentHour = dateObject.getHours(), currentMinute = dateObject.getMinutes();

// 		//The next variables represent the amount of time between the end of the data collection to the start of the next one (nightlyLag), 
// 		//the interval between the scheduling time and the start of the first data collection period (currentLag), the maximum amount of time
// 		//in the data collection period (maxInterval), and the time between until the end of the next data collection period (in our case 
// 		//dinner time; dinnerInterval)
//     var currentLag, maxInterval, dinnerInterval;

// 		//These represents the participants time values 
// 		var weekendDinnerTime = localStore.weekendDinnerTime.split(":");
// 		var weekendWakeTime = localStore.weekendWakeTime.split(":");
// 		var weekdayDinnerTime = localStore.weekdayDinnerTime.split(":");
// 		var weekdayWakeTime = localStore.weekdayWakeTime.split(":");

// 		//Then you can declare any values that you might use more than once such as the number of milliseconds in a day
//    	var day = 86400000;
//    	var minDiaryLag = 6300000;
//    	var randomDiaryLag = 1800000;
//    	var minDiaryLagAfterDinner = 5400000;

// 		//This is a loop that repeats this block of codes for the number of days there are in the experience sampling period
// 		//Replace X with the number of days in the experience sampling period (e.g., collecting data for 7 days, replace X with 7)
// 		//Note that iOS apps can only have 64 unique notifications, so you should keep that in mind if you are collecting data 
// 		//for more than longer periods of time
//     for (i = 0; i < X; i++)
//     {
// 		//The code below (up to "else { nightlyLag = ...}" is only necessary if you allow the daily data collection period to vary across 
// 		//weekdays and weekends
//         var alarmDay = dayOfWeek + 1 + i;
//         if (alarmDay > 6) {alarmDay = alarmDay-7;}
//         //enter time weekendDinnerTime hour and then enter weekendDinnerTime minute
//    			if (alarmDay > 6) {alarmDay = alarmDay - 7;}
//    			if (alarmDay == 0 || alarmDay == 6) {
//    				currentMaxHour = weekendDinnerTime[0];
//    				currentMaxMinutes = weekendDinnerTime[1];
//    				currentMinHour = weekendWakeTime[0];
//    				currentMinMinutes = weekendWakeTime[1];
//    				if (alarmDay == 0) {
//    					nextMinHour = weekdayWakeTime[0];
//    					nextMinMinutes = weekdayWakeTime[1];
//    				}
//    				else {
//    					nextMinHour = weekendWakeTime[0];
//    					nextMinMinutes = weekendWakeTime[1];
//    				}
//    				currentLag = (((((24 - parseInt(currentHour) + parseInt(weekendWakeTime[0]))*60) - parseInt(currentMinute) + parseInt(weekendWakeTime[1]))*60)*1000);
// 				
//    			}
//    			else {
//    				currentMaxHour = weekdayDinnerTime[0];
//    				currentMaxMinutes = weekdayDinnerTime[1];
//    				currentMinHour = weekdayWakeTime[0];
//    				currentMinMinutes = weekdayWakeTime[1];   				
//    				if (alarmDay == 5) {
//    					nextMinHour = weekendWakeTime[0];
//    					nextMinMinutes = weekendWakeTime[1];
//    				}
//    				else {
//    					nextMinHour = weekdayWakeTime[0];
//    					nextMinMinutes = weekdayWakeTime[1];   				
//    				}
//                 currentLag = (((((24 - parseInt(currentHour) + parseInt(weekdayWakeTime[0]))*60) - parseInt(currentMinute) + parseInt(weekdayWakeTime[1]))*60)*1000);
//    			}
//    			if (alarmDay == 5 || alarmDay == 0) {nightlyLag = currentLag;}
//    			else {
//             	nightlyLag= (((((24 - parseInt(currentHour) + parseInt(nextMinHour))*60) - parseInt(currentMinute) + parseInt(nextMinMinutes))*60)*1000);
//    			}

//         //The maxInterval is the number of milliseconds between wakeup time and dinner time
//         maxInterval = (((((parseInt(currentMaxHour) - parseInt(currentMinHour))*60) + parseInt(currentMaxMinute) - parseInt(currentMinMinute))*60)*1000);
// 			//This part of the code calculates how much time there should be between the questionnaires
// 			//Change X to the minimum amount of time that should elapse between beeps in seconds
// 			//Change Y to the amount of additional time in seconds that should elapse to reach the maximum amount of time
// 			//The part of the code that accompanies Y randomly generates a number that allows for notifications to occur randomly between X and X+Y after the previous beep
// 			//That is, X + Y = maximum amount of time that can elapse between beeps
// 
// 			//If designing an interval-based design, delete "Math.round(Math.random()*Y)+" and replace X with the amount of time in seconds between each beep
//    			interval1 = parseInt(currentLag) + (parseInt(Math.round(Math.random()*randomDiaryLag)+minDiaryLag)) + day*i;
//    			interval2 = interval1 + (parseInt(Math.round(Math.random()*randomDiaryLag)+minDiaryLag));
//    			interval3 = interval2 + (parseInt(Math.round(Math.random()*randomDiaryLag)+minDiaryLag));
//    			interval4 = interval3 + (parseInt(Math.round(Math.random()*randomDiaryLag)+minDiaryLag));
//    			interval5 = interval4 + (parseInt(Math.round(Math.random()*randomDiaryLag)+minDiaryLag));
//         		interval6 = interval5 + (parseInt(Math.round(Math.random()*randomDiaryLag)+minDiaryLag));

//    
// 			//This part of the code calculates a unique ID for each notification     
//         a = 101+(parseInt(i)*100);
//         b = 102+(parseInt(i)*100);
//         c = 103+(parseInt(i)*100);
//         d = 104+(parseInt(i)*100);
//         e = 105+(parseInt(i)*100);
//         f = 106+(parseInt(i)*100);

//
// 			//This part of the code calculates the time when the notification should be sent by adding the time interval to the current date and time        
//         date1 = new Date(now + interval1);
//         date2 = new Date(now + interval2);
//         date3 = new Date(now + interval3);
//         date4 = new Date(now + interval4);
//         date5 = new Date(now + interval5);
//         date6 = new Date(now + interval6);

//         
// 			//This part of the code schedules the notifications
//         	cordova.plugins.notification.local.schedule([
//         		{icon: 'ic_launcher', id: a, at: date1, text: 'Time for your next Diary Survey!', title: 'Diary Surveys'}, 
//         		{icon: 'ic_launcher', id: b, at: date2, text: 'Time for your next Diary Survey!', title: 'Diary Surveys'},
//         		{icon: 'ic_launcher', id: c, at: date3, text: 'Time for your next Diary Survey!', title: 'Diary Surveys'},
//         		{icon: 'ic_launcher', id: d, at: date4, text: 'Time for your next Diary Survey!', title: 'Diary Surveys'},
//         		{icon: 'ic_launcher', id: e, at: date5, text: 'Time for your next Diary Survey!', title: 'Diary Surveys'},
//         		{icon: 'ic_launcher', id: f, at: date6, text: 'Time for your next Diary Survey!', title: 'Diary Surveys'}]);
        		
// 			//This part of the code records when the notifications are scheduled for and sends it to the server
//         	localStore['notification_' + i + '_1'] = localStore.participant_id + "_" + a + "_" + date1;
//         	localStore['notification_' + i + '_2'] = localStore.participant_id + "_" + b + "_" + date2;
//         	localStore['notification_' + i + '_3'] = localStore.participant_id + "_" + c + "_" + date3;
//         	localStore['notification_' + i + '_4'] = localStore.participant_id + "_" + d + "_" + date4;
//         	localStore['notification_' + i + '_5'] = localStore.participant_id + "_" + e + "_" + date5;
//         	localStore['notification_' + i + '_6'] = localStore.participant_id + "_" + f + "_" + date6;
//     }
// },

//Stage 4 of Customization
//Uncomment lines inside the snoozeNotif function to test the snooze scheduling notification function
//Replace X with the number of seconds you want the app to snooze for (e.g., 10 minutes is 600 seconds)
//You can also customize the Title of the message, the snooze message that appears in the notification
snoozeNotif:function() {
//     var now = new Date().getTime(), snoozeDate = new Date(now + X*1000);
//     var id = '99';
//     cordova.plugins.notification.local.schedule({
//                                          icon: 'ic_launcher',
//                                          id: id,
//                                          title: 'Title of message',
//                                          text: 'Snooze message',
//                                          at: snoozeDate,
//                                          });
},
//This function forces participants to respond to an open-ended question if they have left it blank
validateResponse: function(data){
        var text = data.val();
//         console.log(text);
        if (text === ""){
        	return false;
        } else { 
        	return true;
        }
    }, 
validateNumber: function(data){
        var num = data.val();
//         console.log(text);
		if (num === "") {
			return false
		}
        else if (isNaN(num)){
        	return false;
        } 
        else { 
        	return true;
        }
    },  
validateTime: function(data){
	var time = data.val();
	if (time=== ""){
		return false	
	}
	else {
		return true
	}
}  	
};
