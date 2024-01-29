<svelte:options accessors />


<script>
import TinyColorButtons  from './TinyColorButtons.svelte';
import './card.css'; 

export let name = "unnamed";
export let myhub;           // ref to a Hub component created in App
export let hib=-1;          // hub's id number for this bulb, used like in .../lights/25/state
export let model;
export let unique_id = "";

export let selected = false;
export let available = true;    //  Optimism. False if physically turned off, out of reach

export let bulb_is_on = true;
export let current_bri = 0;
export let current_sat = 0;
export let current_hue = 0;
export let current_ciex = 0;
export let current_ciey = 0;



export async function checkPhysicalBulbAvailable()  {
    if (myhub)  {
        console.log("I, ", name, " am asking hub ", myhub.name, " to check me at id=", hib);
        available = myhub.checkAvailOfBulbByIndex(hib);
    }
}


export async function updateMyColorFromReality()  {
    const state = await myhub.getBulbStateJson(hib);
    current_bri = state["bri"]; 
    current_sat = state["sat"]; 
    current_hue = state["hue"];
    let current_xy =  state["xy"];
    current_ciex = current_xy[0];
    current_ciey = current_xy[1];
    bulb_is_on = state["on"];
}



export  function setjson(json)  {
console.log(`I am ${name} and my ?ub is ${myhub.name}:${hib}`);
    if (myhub)  {
console.log(`I am ${name} and my hub is ${myhub.name}:${hib} setting ${json}`);
        myhub.setBulb(hib, json);
        updateMyColorFromReality();
    }
}




export function turnBulbOn() {
    setjson({on:true})
    bulb_is_on = true;
}

export function turnBulbOff() {
    setjson({on:false});
    bulb_is_on = false;
}



async function tinyColorChosen(ev)  {
    //console.log("BULB hears TinyColor message!  ", ev.detail);
    setjson(ev.detail.json);
}



let colorhover=" ";
function tinyColorHovering(ev)  {
    //console.log("BULB hears TinyColor message!  ", ev.detail);
    colorhover = ev.detail.name;
}



function selectionClick(ev)  {
    selected = !selected;
}


</script>

<!---------------------------   H T M L   ---------------------------->



<fieldset class="card" 
        class:selected-card={selected} 
        class:deadbulb={!available} 
        draggable={false} 
        on:click={selectionClick}
>
<legend>{name}</legend>
<p> {selected? "√ ":" "} <b>{name} </b> <span class="pale-tech">{model}</span> {myhub.name}:{hib} </p>
<p><span class="pale">{unique_id} {available? "avail":"dead"}</span></p>

<div class="tinybuttonbox" style="float:right" >
<TinyColorButtons 
        on:color_chosen={tinyColorChosen} 
        on:color_hover={tinyColorHovering} 
        on:mouseout={ (ev) => {colorhover="  "} }
        />
</div>

<table>
    <tr>
        <th>bri</th>
        <th>sat</th>
        <th>hue</th>
        <th>CIE x</th>
        <th>y</th>
    </tr>
    <tr>
        <td>{current_bri}</td>
        <td>{current_sat}</td>
        <td>{current_hue}</td>
        <td>{current_ciex}</td><td>{current_ciey}</td>
    </tr>
</table>


<div class="buttonbunch">
    <button on:click|stopPropagation={ turnBulbOn } >On</button>
    <button on:click|stopPropagation={ turnBulbOff } >Off</button>
    {#if (!available)}
    <button on:click|stopPropagation={ checkPhysicalBulbAvailable } >avail?</button>
    {/if}
    <button on:click|stopPropagation={ () => setjson({'bri':2,'hue':44000,'sat':111}) } >dim</button>
    <button on:click|stopPropagation={ () => setjson({'bri':251,'hue':8000,'sat':11}) } >white</button>
</div>

<p class="status">{colorhover}</p>

</fieldset>





<!---------------------------   S T Y L E   ---------------------------->

<style>
.card { 
    border-color:#773; 
    background:#fffad9;
}
.card legend {     color: #662;
}

.deadbulb { background:#ccc;  border:#888 solid 5px; }
.selected-card { background-color:#fff; border-color: #773;}


p {
    padding:0;
    margin:0;
}


div.tinybuttonbox {
    
}

button { margin:0; }

.pale-tech { color:#686838; font-size:.7em; }

.buttonbunch {
    clear:left;
    float:left;
    margin-top:3px;
}
.buttonbunch button {
    border:2px solid #263;
    border-radius:6px;
    font-size:0.7em;
}

.status {
    float:right;
}

</style>
