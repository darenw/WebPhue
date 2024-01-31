<svelte:options accessors />


<script> 

import './card.css';  
import './Bulb.svelte'; 
import TinyColorButtons  from './TinyColorButtons.svelte';
import { random_color } from './phcolor.js';


export let name = "no-name";
export let selected = false;
export let members = [];
export let all_bulbs = undefined;  // Access to all bulbs in system to select, add/remove, etc


export function takeThisBulb(B)  {
    if (!B) return;
    if (members.includes(B)) return;
    members.push(B);
}


export async function  setAllBulbs(json)   {
    for (let bulb of members)  {
        bulb.setjson( json);
    }
}


export function blinkAllBulbs(params)   {
    const period = params["period"];
    const count  = params["count"];
    //console.log("PRETEND blink bulbs of group " + name + " for " + count + " times over " + (period*count) + " seconds");
}


function selectionClick(ev)  {
    selected = !selected;
}


export function selectMyBulbs(want)   {
    for (let bulb of members) {
        bulb.selected = want;  
    }
}

export function takeSelectedBulbs()  {
    for (let b of all_bulbs)   {
        if (b.available && b.selected)  {
            takeThisBulb(b);
        }
    }
}


export function removeSelectedBulbs()  {
   members = members.filter( (b) => (!b.selected) );
}


async function tinyColorChosen(ev)  {
    for (let bulb of members) {
        bulb.setjson(ev.detail.json);
    }
}

let colorhover=" ";
function tinyColorHovering(ev)  {
    colorhover = ev.detail.name;
}


function randomColors(params)   {
    for (let bulb of members)  {
        let R = random_color();
        console.log(`bulb ${bulb.name} <= ${R.bri}  ${R.ciex} ${R.ciey}`);
        let json = {
            'bri':  Math.trunc(R.bri*255),
            'xy':  [ R.ciex, R.ciey ]
        }
        bulb.setjson(json); 
    }
}

</script>


<!------------------------------   H T M L   ---------------------------->

<fieldset class="card"
        class:selected-card={selected}
        on:click={selectionClick}>
<legend>Group {name} ({members.length})</legend>
    {#each members as bulb, i }
      <span>{bulb.name} </span>
    {/each}

<br>
<div class="buttonbunch">
    <button on:click|stopPropagation={ () => setAllBulbs({on:false}) }>OFF</button>
    <button on:click|stopPropagation={ () => setAllBulbs({on:true}) }>ON</button>
    <button on:click|stopPropagation={ () => setAllBulbs({'bri':1,'hue':4000,'sat':111}) } >dim</button>
    <button on:click|stopPropagation={ () => setAllBulbs({'bri':255,'hue':0,'sat':0}) } >white</button>
    <button on:click|stopPropagation={ () => setAllBulbs({'bri':150, 'xy':[0.48, 0.22]}) } >mag</button>
</div>

<TinyColorButtons style="float:right" 
        on:color_chosen={tinyColorChosen} 
        on:color_hover={tinyColorHovering} 
        on:mouseout={ (ev) => {colorhover="  "} }
        />
<div class="buttonbunch">

    <button on:click|stopPropagation={ () => randomColors({someparam:0.5,another:0.2}) }>Rnd</button>
    <button on:click|stopPropagation={ () => randomColors({someparam:1.0,another:1.0}) }>(test)</button>
    <button on:click|stopPropagation={ () => blinkAllBulbs({count:5,period:0.5}) }>Blink</button>
</div>

<div class="buttonbunch">
    <button on:click|stopPropagation={ () => takeSelectedBulbs() }>Add</button>
    <button on:click|stopPropagation={ () => removeSelectedBulbs() }>Rm</button>
    <button on:click|stopPropagation={ () => selectMyBulbs(true) }>Sel</button>
    <button on:click|stopPropagation={ () => selectMyBulbs(false) }>Desel</button>
</div>

</fieldset>




<!---------------------------   S T Y L E   ---------------------------->

<style>

.card { border-color: #373; background: #cec; }
.card legend { color: #123; }
.selected-card { background-color:#efe; border-color: #595;}

.buttonbunch button { border-color: #060; }
table { border-color: #060; }

</style>

