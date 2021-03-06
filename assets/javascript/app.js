// Initialize Firebase
var config = {
    apiKey: "AIzaSyAcYyXaxC4IGhwkcAZko61HzjBxbr6APK4",
    authDomain: "train-time-88003.firebaseapp.com",
    databaseURL: "https://train-time-88003.firebaseio.com",
    projectId: "train-time-88003",
    storageBucket: "train-time-88003.appspot.com",
    messagingSenderId: "552697473981"
};
firebase.initializeApp(config);

var database = firebase.database();

//diffMinutes is number of minutes since midnight which will update every minute
var mmt = moment();
var midnight = mmt.clone().startOf('day');
var diffMinutes = mmt.diff(midnight, 'minutes');


$("#submit").on("click", function () {

    var name = $("#name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTime = $("#firstTime").val().trim();
    var frequency = $("#frequency").val().trim();

    var insertRow = database.ref().push({
        trainName: name,
        trainDestination: destination,
        trainFirstTime: firstTime,
        trainFrequency: frequency,
        timeDiff: diffMinutes
    });

    alert("Train successfully added!");

});

var timeID;

database.ref().on("child_added", function (snapshot) {
    console.log(snapshot.val());
    child = snapshot.val();
    var id = snapshot.key;
    timeID = snapshot.key;
    console.log(id);



    var newRow = $("<tr>");

    var tdName = $("<td id='tdName'>");
    var splitName = child.trainName.split("");
    for (var i = 0; i < splitName.length; i++) {
        var letter = $("<span>" + splitName[i] + "</span>");
        letter.css({ "border": "1px solid darkslategrey", "padding": "2px", "margin": "0 3px" });
        tdName.append(letter);
    }



    var tdDestination = $("<td>");
    var splitDest = child.trainDestination.split("");
    for (var i = 0; i < splitDest.length; i++) {
        var letter = $("<span>" + splitDest[i] + "</span>");
        letter.css({ "border": "1px solid darkslategrey", "padding": "2px", "margin": "0 3px" });
        tdDestination.append(letter);
    }


    var tdFrequency = $("<td>");
    var splitFrequency = child.trainFrequency.split("");
    for (var i = 0; i < splitFrequency.length; i++) {
        var letter = $("<span>" + splitFrequency[i] + "</span>");
        letter.css({ "border": "1px solid darkslategrey", "padding": "2px", "margin": "0 3px" });
        tdFrequency.append(letter);
    }

    var tdNext = $("<td>");
    var currentTime = moment();
    var convertedTime = moment(child.trainFirstTime, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(convertedTime), "minutes");

    var remainder = diffTime % child.trainFrequency;
    var minutesAway = child.trainFrequency - remainder;
    var minAway = minutesAway.toString();
    var nextTrain = moment().add(minutesAway, "minutes").format("hh:mm");


    var splitNext = nextTrain.split("");
    for (var i = 0; i < splitNext.length; i++) {
        var letter = $("<span>" + splitNext[i] + "</span>");
        letter.css({ "border": "1px solid darkslategrey", "padding": "2px", "margin": "0 3px" });
        tdNext.append(letter);
    }
    var tdMinutesAway = $("<td>");
    var splitMinutes = minAway.split("");
    for (var i = 0; i < splitMinutes.length; i++) {
        var letter = $("<span>" + splitMinutes[i] + "</span>");
        letter.css({ "border": "1px solid darkslategrey", "padding": "2px", "margin": "0 3px" });
        tdMinutesAway.append(letter);
    }

    var updateRecord = $("<td>");
    updateRecord.html("<a href='#trainForm'><button class='update btn-success' data-name='" + id + "'>Update</button></a>")

    var deleteRecord = $("<td>");
    deleteRecord.html("<button class='delete btn-danger' data-name='" + id + "'>Delete</button>");

    newRow.append(tdName);
    newRow.append(tdDestination);
    newRow.append(tdFrequency);
    newRow.append(tdNext);
    newRow.append(tdMinutesAway);
    newRow.append(updateRecord);
    newRow.append(deleteRecord);
    $("tbody").append(newRow);
});

//fills input fields with record values and allows them to be updated
$(document.body).on("click", ".update", function () {
    var id = $(this).attr("data-name");
    var updateThis = database.ref().child(id);
    updateThis.once('value', function (snapshot) {
        var nameFromDB = snapshot.val().trainName;
        var destFromDB = snapshot.val().trainDestination;
        var firstFromDB = snapshot.val().trainFirstTime;
        var frequencyFromDB = snapshot.val().trainFrequency;

        $("#name").val(nameFromDB);
        $("#destination").val(destFromDB);
        $("#firstTime").val(firstFromDB);
        $("#frequency").val(frequencyFromDB);
        $("#submit").hide();
        $("#update").show();


        
    });
    
    $("#update").on("click", function () {
        updateThis.update({
            "trainName": $("#name").val(),
            "trainDestination": $("#destination").val(),
            "trainFirstTime": $("#firstTime").val(),
            "trainFrequency": $("#frequency").val()
        }).then(function () {
            alert("You updated a record.");
            location.reload();
        }).catch(function (error) {
            alert("Sorry, something went wrong.");
            console.log("Sorry");
        });


    })
})


//delete record and table row when delete button is clicked
$(document.body).on("click", ".delete", function () {
    var id = $(this).attr("data-name");
    var deleteThis = database.ref().child(id);
    deleteThis.remove().then(function () {
        alert("You deleted a record.");
        location.reload();
    }).catch(function (error) {
        alert("Sorry, something went wrong");
        console.log("Sorry");
    });
})


//timer functions to update the page every minute as the database changes
var number = 0;
var intervalId;

function run() {
    clearInterval(intervalId);
    intervalId = setInterval(increment, 1000);
}

function increment() {
    number++;
    console.log(number);
    if (number === 60) {
        stop();
        var timeChange = database.ref().child(timeID);
        console.log(timeChange);
        timeChange.update({
            timeDiff: moment().diff(midnight, 'minutes')
        });
        database.ref().on("value", function (snapshot) {

            location.reload();

        });
        run();

    }
}

function stop() {
    clearInterval(intervalId);
    number = 0;
}
run();

