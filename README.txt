A bot that sends realistic pokemon data to a webhook url to test your Poracle.js bot. The bot will send a random pokemon between every 18-29 seconds, and will not stop until you kill the process.

To install 
git clone https://github.com/jonathonor/poracle-sender.git
cd poracle-sender
npm install
node send.js

Fill out config file with 
- webhook url where poracle is running
- areas where you want the bot to send a pokemon

Notes:

The lat/long under the area is the center point of an area.

Distance from points is the radius by which a point should be chosen from that center point at random in meters.
5000meters = 5km = 3miles.
