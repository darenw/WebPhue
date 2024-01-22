<svelte:options accessors />


<script>
import TinyColorButtons  from './TinyColorButtons.svelte';


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

const plain_class = "whole,backcolor-green";
const selected_class = "whole,backcolor-red";
const dead_class = "whole,backcolor-white";
let mystate_class = selected_class;


export async function checkAvail()  {
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
    if (myhub)  {
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
    if (selected) {
        mystate_class = selected_class;
    }else {
        mystate_class = plain_class;
    }
}


</script>



<fieldset class="whole" 
        class:selected={selected} 
        class:deadbulb={!available} 
        draggable={false} 
        on:click={selectionClick}
>
<legend>{name}</legend>
<p> {selected? "√ ":" "} <b>{name} </b> <span class="pale">{model}</span> {myhub.name}:{hib} </p>
<p><span class="pale">{unique_id} {available? "avail":"dead"}</span></p>

<table>
    <tr>
        <th>bri</th>
        <th>sat</th>
        <th>hue</th>
        <th>CIE x,y</th>
    </tr>
    <tr>
        <td>{current_bri}</td>
        <td>{current_sat}</td>
        <td>{current_hue}</td>
        <td>{current_ciex},{current_ciey}</td>
    </tr>
</table>

<div class="tinybuttonbox">
 
<TinyColorButtons style="float:right" 
        on:color_chosen={tinyColorChosen} 
        on:color_hover={tinyColorHovering} 
        on:mouseout={ (ev) => {colorhover="  "} }
        />
</div>

<div class="buttonbunch">
    <button on:click|stopPropagation={ turnBulbOn } >On</button>
    <button on:click|stopPropagation={ turnBulbOff } >Off</button>
    {#if (!available)}
    <button on:click|stopPropagation={ checkAvail } >avail?</button>
    {/if}
    <button on:click|stopPropagation={ () => setjson({'bri':2,'hue':44000,'sat':111}) } >dim</button>
    <button on:click|stopPropagation={ () => setjson({'bri':251,'hue':8000,'sat':11}) } >white</button>
</div>

<p class="status">{colorhover}</p>

</fieldset><!-- class whole -->


<style>
.whole  { 
    border: #773 solid 5px;  
    border-radius:0.7em; 
    padding-top:12em;
    
    background:#fffad9;
    padding: .3rem;
    margin:2px;
    width:23rem; 
    
    resize:none;
    text-align: center;
    cursor:move;
    display: inline;
}

.whole.over { 
    border:dotted 5px #aa6; 
}

.whole legend {
    margin-left:1em;
    color: #662;
}

.over { border:dotted 5px #fa0; }

.selected { background:#f4f8ff; border:#886 solid 5px;}
.deadbulb { background:#ccc;  border:#888 solid 5px; }


p {
    padding:0;
    margin:0;
}

table {
    border: 1px #996 solid;
    background: #f9f9f1;
    border-collapse: collapse;
    margin-bottom:3px;
    float: left;
}
th {    
    padding-left:.35em;
    padding-right:.35em; 
    padding-bottom:3px;
    font-size:0.7em;
    font-weight:normal;
    color:#555;
}
td { 
    padding-left:.35em; 
    padding-right:.35em; 
    padding-top:0;
    font-weight:500;
}


div.tinybuttonbox {
    
}

button { margin:0; }

.pale { color:#686838; font-size:.7em; }

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
