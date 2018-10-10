# TrainTime

## Deployed Project

https://sgliput.github.io/TrainTime/

## Description

This train scheduler consists of a form for adding trains and their times, as well as a table displaying train information from a Firebase database. The form for adding a train asks for its name, destination, first departure time (in military time), and frequency. Hitting the submit button adds this data to an external Firebase database and generates a new row in the table.

Utilizing the Moment.js library, the first departure time is used to calculate the next departure time and the number of minutes remaining, which are displayed in the table, along with the name, destination, and frequency. I used the .split() method to turn all the words and numbers in the table into arrays and place a border around each letter/number to imitate the look of a split-flap display in train stations.

Each row is also generated with an Update button and a Delete button connected to the key of the corresponding Firebase data record. Clicking Update will populate the form fields with the record's saved information and allow for changes, which are then submitted with the button at the bottom, triggering a confirmation alert. Clicking Delete will delete the corresponding record, triggering a confirmation alert as well.

I also tried to make the value for number of minutes to the next train dynamic, so that it would change every minute. I did so by causing the page to reload every minute, though there is likely a more subtle way of localizing this effect. When the page reloads, though, all time values update accordingly based on the current time.
