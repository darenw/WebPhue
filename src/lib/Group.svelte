<svelte:options accessors />


<script> 

import './card.css';  
import './Bulb.svelte'; 
import TinyColorButtons  from './TinyColorButtons.svelte';


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



let blink_button;  

function startBlinkingAllMemberBulbs()  {
    for (let b of members)   {
        b.startBlinkingBulb();
    }
}

function stopBlinkingAllMemberBulbs()  {
    for (let b of members)  {
        b.stopBlinkingBulb();
    }
}


function blinkAllBulbs_click(params)   { 
    if (blink_button.innerHTML==="STOP")  {
        blink_button.innerHTML = "Blink";
        console.log("start blink members");
        stopBlinkingAllMemberBulbs();
    } else {
        blink_button.innerHTML = "STOP";
        console.log("start blink members");
        startBlinkingAllMemberBulbs();
    }        
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



</script>


<!------------------------------   H T M L   ---------------------------->

<fieldset class="card"
        class:selected-card={selected}
        on:click={selectionClick}>
<legend>Group {name} ({members.length})</legend>
    {#each members as bulb, i }
      <span class="bulbnames">{bulb.name}&nbsp;</span>
    {/each} 

<br>
<div class="tinybuttonbox" style="float:right" >
<TinyColorButtons 
        
        on:color_chosen={tinyColorChosen} 
        on:color_hover={tinyColorHovering} 
        on:mouseout={ (ev) => {colorhover="  "} }
        />
</div>

<div class="buttonbunch">
    <button on:click|stopPropagation={ () => setAllBulbs({on:false}) }>OFF</button>
    <button on:click|stopPropagation={ () => setAllBulbs({on:true}) }>ON</button>
    <button on:click|stopPropagation={ () => setAllBulbs({'bri':255,'hue':0,'sat':0}) } >white</button>
    <button on:click|stopPropagation={ () => blinkAllBulbs_click() } 
                bind:this={blink_button}>Blink</button>
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

.bulbnames { font-size:.71em; }
</style>

