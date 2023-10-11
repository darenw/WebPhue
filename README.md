# WebPhue

An attempt at a webapp for controlling Philips Hue bulbs

My previous project for controlling Hue bulbs was command line. It does the job, but is limited in what 
it can do, and the user has to remember the commands.  What about a slick UI with drag-and-drop, click on icons
and color pickers, and using Svelte?

WORK IN PROGRESS!

## Build

This web app is build using Yarn, Vite, Svelte. After editing, run 

    yarn run dev    

The WebPhue app should appear in any browser viewing localhost:8842  (or any other port you may set in package.json)  
The web app should also work fine on any mobile device set to http://_your dev machine ip addr_:8842.


## Usage

Before using, in the likely event that you are not me, alter the hub (Hue Bridge) config info in the <script> of App.svelte. 
Change the all_hubs assignment in onMount() to match the number of hubs actually in use. 
A future version of WebPhue will auto-detect hubs or get their config data from some persistent storage.

Each Hub (aka Bridge) in the system shows as a green box with its IP address and other info. Buttons
allow the user to turn on all lights, turn them all off, and other things depending on the version.

A blue bar with buttons lets you turn off  or turn on all the bulbs in the system, of all hubs 
known to WebPhue.


The "lights json" appears to do nothing. What it does is send info about all bulbs known to a hub to console.log(). 
Enable your browser's developer tools to see this.

Every light bulb known to a hub is shown in a yellow box.  These are requested from the hub every time
the web app is started or reloaded. Each yellow box has a name for the bulb (braindead atm), its 
"unique id" which I think has to do with Zigbee, how it's known to a hub, and buttons to turn it on/off, 
set certain hardcoded colors, and who knows what else depending on the version. 



## To Be Done:

* Define tiny color buttons to put into Bulbs so there's a larger number of hardcoded colors that work apart from any higher level color scene mechanisms.
* Gather more info from hubs about each bulb. Keep it in each bulb's component. Make a button or something to pop up the whole mess for viewing.
* Define a ColorPatch component. Click to adjust color. Drag to a bulb to set its color.
* Define a ColorPalette to hold any number of ColorPatches, and give them names.
* hardcoded bridge IP and ID - obviously won't work for non-me people! Also, hardcoded to use two not arbitrary number of bridges.
* If lights are off, then setAllBulbs( json with new color ), then lights are turned on, they show old color. Would like new color to show w/o re-do setting color state.
* UI will be ugly for a while. Emphasis for short term is functionality, advanced automation.



## 

