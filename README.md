# WebPhue

A webapp for controlling Philips Hue bulbs

WORK IN PROGRESS! May be buggy. 

## Build

This web app is build using Yarn, Vite, Svelte. Run yarn's http server

    yarn run dev    

then edit. Saving source should cause automatic refreshing of the web app in the browser.

The WebPhue app should work in any browser set to localhost:8842   Use any other port number by editing package.json.
The web app should also work fine on any mobile device set to http://{your dev machine's ip addr}:8842.


## Usage

WebPhue looks at the IP addresses listed in BulbAssignments.js for Hue bridges, what I call "hubs".
From each hub a list of bulbs is fetched. BulbAssignments.js gives names for bulbs associated with 
their MAC addresses. 

A future version of WebPhue will auto-detect hubs or get their config data from some persistent storage. For now, 
user must edit BulbAssignments.js

Each Hub (aka Bridge) in the system shows as a green box with its user-defined name, IP address and other info. Buttons
allow the user to turn on all lights, turn them all off, and do a few other things depending on the version of WebPhue.

Every light bulb known to every hub is shown in a yellow box, with the bulb's name, the hub its controlled by,
"unique id" and other info, and buttons to turn it on/off and set colors.  The small grid of colored squares
gives a bunch of predefined colors. Larger regular buttons may also exist for setting colors. 

Clicking on a Bulb's box turns it light blue (as of this writing). This means the Bulb is "selected".
Selected bulbs may be dealt with all at once as a group. At the bottom of the web page, 
a blue-violet horizontal bar offers buttons to set colors and turn on/off all the selected bulbs.

If there's an "avail?" button, in the Bulb boxes or in the Selected bar, 
that is to tell the hub to look again for bulbs that weren't responding, 
for example if they've been removed or physically turned off at the lighting fixture. 
Their boxes are gray not yellow.
This feature is buggy for now: An unreachable bulb may appear to resolve ok, but it's still unreachable in reality.





## To Be Done:
* handle case of no nework to hubs, eg pulled eth cable - got bad page, cryptic errmsg
* Gather more info from hubs about each bulb. Keep it in each bulb's component. Make a button or something to pop up the whole mess for viewing.
    (firmware update, colorgamut, mfr name, ...)
* Define a ColorPatch component. Click to adjust color. Drag to a bulb to set its color.
* Define a ColorPalette to hold any number of ColorPatches, and give them names.
* re-order Bulb cards.  draggable?  
* Put hub ipaddr, keys, bulb names & MACs into some sort of persistent storage. Now is in BulbAssignments.js
* if a bulb is off (as sw state, not physically), color button, turned on, comes up w previous color. Makes sense for new color to show?
* UI will be ugly for a while. Emphasis for short term is functionality, advanced automation.



## 

