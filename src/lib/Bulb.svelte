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

export function setjson(json)  {
    if (myhub)  {
        myhub.setBulb(hib, json);
    }
}

function tinyColorChosen(ev)  {
    //console.log("BULB hears TinyColor message!  ", ev.detail);
    setjson(ev.detail.json);
}

let colorhover="";
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
        draggable={true} 
        on:click={selectionClick}
>
<legend>Bulb</legend>
<p><b>{name}</b> <span class="pale">{model}</span> {myhub.name}:{hib} </p>
<p><span class="pale">{unique_id}</span></p>
<div class="tinybuttonbox">
<TinyColorButtons 
        on:color_chosen={tinyColorChosen} 
        on:color_hover={tinyColorHovering} 
        on:mouseout={ (ev) => {colorhover="  "} }
        />
<p>{selected? "selected":""}  {available? "avail":"dead"} {colorhover}</p>
</div>

<div class="buttonbunch">
    <div class="bunchedbutton"><button on:click|stopPropagation={ () => setjson({on:true}) } >ON</button></div>
    <div class="bunchedbutton"><button on:click|stopPropagation={ () => setjson({on:false}) } >Off</button></div>
    <div class="bunchedbutton"><button on:click|stopPropagation={ checkAvail } >avail?</button></div>
    <div class="bunchedbutton"><button on:click|stopPropagation={ () => setjson({'bri':2,'hue':44000,'sat':111}) } >dim</button></div>
    <div class="bunchedbutton"><button on:click|stopPropagation={ () => setjson({'bri':251,'hue':8000,'sat':11}) } >white</button></div>   
</div>

</fieldset><!-- class whole -->



<style>
.whole  { 
    border: #773 solid 5px;  
    border-radius:0.7em; 
    background:#fffad9;
    padding: .3rem;
    margin:2px;
    width:25rem;
    height:7rem;
    resize:none;
    text-align: center;
    cursor:move;
}

.whole.over { border:dotted 5px #aa6; }
.over { border:dotted 5px #fa0; }

.selected { background:#f4f8ff; border:#886 solid 5px;}
.deadbulb { background:#ccc;  border:#888 solid 5px; }


p {
    padding:0;
    margin:0;
}

div.tinybuttonbox {
    
}

button { margin:0; }

.pale { color:#663; font-size:.8em; }

.buttonbunch {
    display: flex;
}
.bunchedbutton {
    padding:.013em;
    border:2px solid #263;
    border-radius:6px;
    font-size:0.7em;
}

</style>
