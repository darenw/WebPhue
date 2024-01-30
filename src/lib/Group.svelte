<svelte:options accessors />


<script> 

import './card.css';  
import './Bulb.svelte'; 
import TinyColorButtons  from './TinyColorButtons.svelte';
import { random_color } from './phcolor.js';

import { createEventDispatcher } from 'svelte';


export let name = "no-name";
export let selected = false;
export let members = [];

const dispatch = createEventDispatcher();


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
    console.log("About to select bulbs who are my members");
    for (let bulb of members) {
        bulb.selected = want;  
    }
}

export function eatSelectedBulbs()  {
    dispatch('takesel', { me:999 });
}

export function removeSelectedBulbs()  {
    dispatch('rmsel', { me:999 });
}

async function tinyColorChosen(ev)  {
    for (let bulb of members) {
        bulb.setjson(ev.detail.json);
    }
}

let colorhover=" ";
function tinyColorHovering(ev)  {
    //console.log("BULB hears TinyColor message!  ", ev.detail);
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
<p>Some group manipulation stuff, add bulbs, ... </p>
<table>
    <tr><th>Bulb</th></tr>
    {#each members as bulb, i }
      <tr><td>{bulb.name}</td></tr>
    {/each}
</table>

<br>
<div class="buttonbunch">
    <button on:click|stopPropagation={ () => setAllBulbs({on:false}) }>All OFF</button>
    <button on:click|stopPropagation={ () => setAllBulbs({on:true}) }>All ON</button>
    <button on:click|stopPropagation={ () => setAllBulbs({'bri':1,'hue':4000,'sat':111}) } >dim</button>
    <button on:click|stopPropagation={ () => setAllBulbs({'bri':255,'hue':0,'sat':0}) } >white</button>
    <button on:click|stopPropagation={ () => setAllBulbs({'bri':150, 'xy':[0.2, 0.1]}) } >mag</button>
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
    <button on:click|stopPropagation={ () => eatSelectedBulbs() }>Add</button>
    <button on:click|stopPropagation={ () => removeSelectedBulbs() }>Add</button>
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

