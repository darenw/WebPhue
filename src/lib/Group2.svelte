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
    members = [...members, B];
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
return;  // turn off selection effect. no user actions make use of selected groups
    selected = !selected;
}


export function selectMyBulbs(want)   {
    for (let bulb of members) {
        bulb.selected = want;  
    }
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

<div class="contents">

<div class="bulbnames">
<ul>
{#each members as bulb, i }
      <li class="bulbnames">{bulb.name}&nbsp;</li>
{/each} 
</ul>
</div>


<div class="button_pair_stack">
    <button on:click|stopPropagation={ () => setAllBulbs({on:true}) }>ON</button>
    <button on:click|stopPropagation={ () => setAllBulbs({on:false}) }>OFF</button>
    
    <button on:click|stopPropagation={ () => blinkAllBulbs_click() } 
                bind:this={blink_button}
                class="double" >Blink</button>
                
    <button on:click|stopPropagation={ () => selectMyBulbs(true) }>Sel</button>
    <button on:click|stopPropagation={ () => selectMyBulbs(false) }>Desel</button>
    
    <button on:click|stopPropagation={ () => takeSelectedBulbs() }>Add</button>
    <button on:click|stopPropagation={ () => removeSelectedBulbs() }>Rm</button>
</div>

</div><!-- .contents -->
</fieldset>




<!---------------------------   S T Y L E   ---------------------------->

<style>

.card { border-color: #373; background: #cec; }
.card legend { color: #123; }
.selected-card { background-color:#efe; border-color: #595;}

.contents {
    background:#446688;
}


.button_pair_stack   {
    float:right;
    clear: none;
    display: grid;
    grid-gap: 6px;
    grid-template-columns: [col1-start] 70px [col2-start] 70px [col2-end];
}
.double {
    grid-column: col1-start / col2-end;
    
}

.button_pair_stack button { border-color: #060; }

ul {
    float: left;
    clear: none;
}


li   {
    list-style-type: none;
    margin:0;
    padding:0;
    text-align:left;
}

bulbnames { 
        font-size:.81em; 
        text-align:left;
}

</style>

