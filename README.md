# The owLED Guessing Game

A Small Experiment with Node.JS, Arduino, Johnny Five, Sphero, Cylon.js, Socket.IO, Redis, and Angular.

###[Click HERE For VIDEO](https://www.youtube.com/watch?v=_T9TdatSAsI)

## What Is This?

This is an Arduino device interacting with a web browser.  Buttons and lights on a breadboard interact with users connected to a Node.JS server. The underlying technologies to make this work are all (pretty much) based on JavaScript.

Basically this is me playing with stuff.

## What does it do?

This allows an Arduino or Spark Core to randomly blink two differently colored LED lights for a few seconds.  When the lights stop blinking, the state of each LED (on or off) is communicated with any connected web client.  

It is up to the user to guess which LEDs will be lit (or off) at the end of the blinking sequence.  The user confirms the guess by clicking on the red & green buttons on the page served by the Node.JS application.  In this case, the red and green buttons look like owl eyes.

Guessing correctly scores a point.

The history of the blinking sequences is stored in a Redis database, and the most recent 25 results can be viewed by the user (by clicking the hamburger icon in the upper left corner of the screen).

# Setup

1. Install Node.jS
2. Install Redis
3. Download/Clone this repository
4. Run `npm install` to fetch the dependencies
5. **Bonus**  Check out the *sphero* branch of this repo for extra Sphero functionality (only if you have a Sphero).

## Test Mode - No Hardware Needed

1. Run `node index.js` to start the server.
2. Open a web browser to `http://localhost:3000/#?debug`
3. Click the **Auto Blink** checkbox and wait a few seconds. 
4. The Node console should output some information, and your browser window should update.

## Spark Core

1. Connect a Spark Core with 2 LEDs and a Pushbutton (see diagram below).
2. Make sure it is running the [voodoospark](https://github.com/voodootikigod/voodoospark) firmware.
3. In `index.js`, *comment out* this line: `var owled = require('./server/owled-fake');`
4. In `index.js`, *uncomment* this line: `//var owled = require('./server/owled');`
5. Ensure the Spark Core is on and connected to the 'cloud' (pulsing cyan).
6. Run `node index.js`

### Spark Core Diagram

![Spark Core Diagram](https://github.com/ericterpstra/owled/blob/master/owLED_bb.jpg)

## Arduino Uno

Basically the same setup as the spark core, but go to `/server/owled.js` and comment out the Spark Core board init code (lines 10-15) and the Spark Core pins (lines 28-30).

Then uncomment the Arduino board init (line 19) and the Arduino pins (34-36)

Change the pin numbers depending on how you wired up your board.

## Bonus Sphero Action

1. 1. Check out the `sphero` branch of this project.
2. 2. Pair a Sphero to your computer via bluetooth. See the [Cylon docs](http://cylonjs.com/documentation/platforms/sphero/) for more info. 
3. 3. Find the Sphero connection ID.  On a Mac, do `ls /dev/tty.*` and look for `tty.Sphero-ABC-DEF` in the output.
4. Open `/server/mysphero.js` and replace the Sphero id on line 17 with your own.
5. Run `node index.js` and hopefully your Sphero will connect. (It may take a few tries).
6. There is a 5 second calibration period to orient Sphero.
7. Whenever a user guesses correctly and scores a point, Sphero will roll forward.