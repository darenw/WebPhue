<svelte:options accessors />


<script>
import { onDestroy } from 'svelte';
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

export const bulb_palette = [
    [
        { name:"Zero",    hexrgb:"000",       json:{bri:1,  sat:0,  hue:0} },
        { name:"Brown",   hexrgb:"#6c5128",   json:{bri: 30, sat:173, hue:7500 }},
        { name:"Dim",     hexrgb:"#555",  json:{bri: 60, sat:5, hue:1500 }},
        { name:"White",    hexrgb:"#fcfcfc",  json:{bri: 248, sat:5, hue:1500 }},

    ],
    [
        { name:"Blue", hexrgb:"#4c41ec",  json:{bri: 200, sat:210, hue:44800 }},
        { name:"Green",   hexrgb:"#22f022",   json:{bri: 150, sat:203, hue:25000 } },
        { name:"Yellow",   hexrgb:"#fdfd94",  json:{bri: 252, sat:201, hue:9710 }},
        { name:"Red",   hexrgb:"#ff1000",  json:{bri: 190, sat:255, hue: 10 }},

    ]
];


let blink_button;

let keep_blinking = false; 


export async function checkPhysicalBulbAvailable()  {
    if (myhub)  {
        console.log("I, ", name, " am asking hub ", myhub.name, " to check me at id=", hib);
        available = myhub.checkAvailOfBulbByIndex(hib);
    }
}


export  function setjson(json, want_update=false)  {
    if (myhub)  {
        console.log(`   SETJSON bulb ${name} hib ${hib}  json=${json}`, json);
        myhub.setBulb(hib, json);
        updateMyColorFromReality();
    }
}



export  function setjson_no_update_color_props(json, want_update=false)  {
    if (myhub)  {
        myhub.setBulb(hib, json);
    }
}

export function turnBulbOn() {
    setjson({on:true})
    bulb_is_on = true;
}

export function turnBulbOff() {
clearInterval();
    setjson({on:false});
    bulb_is_on = false;
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



// NOTE on bulb color/on transition time
// Along with bri:, sat:, on: etc there is a transitiontime: property.
// The number is integer (integer only?) deciseconds, default 4 (acc'd to rumor)
//
let blink_state = false;
function flip_blink_state()  {
    if (blink_state)  {
        setjson_no_update_color_props({"on":false, transitiontime:1});
        blink_state=false;
    } else {
        setjson_no_update_color_props({"on":true, bri:200, transitiontime:1});
        blink_state=true;
    }
}


let blinker = 0;

export function startBlinkingBulb(period_seconds = 1.6)   {
    updateMyColorFromReality();           // unlikely, but just in case our props are not current
    setjson_no_update_color_props( {bri: 200, sat: 15, hue: 5000} );   // blinks white; we're not updating current_color
    blinker = setInterval(flip_blink_state, period_seconds/2 *1000.0 /*milliseconds*/ );
}

export function stopBlinkingBulb()    {
        
        if (blinker) clearInterval(blinker);
        blinker = 0;
        turnBulbOn();
        setjson_no_update_color_props( {bri: current_bri,  hue: current_hue,  sat: current_sat} );
}

function blinkBulb_click() {
    if (blink_button.innerHTML==="STOP")  {
        blink_button.innerHTML = "Blink";
        stopBlinkingBulb();
    } else {
        blink_button.innerHTML = "STOP";
        startBlinkingBulb(0.9);
    }
} 





onDestroy( () => {
    if (blinker)  stopBlinkingBulb();
});


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
        palette={bulb_palette}
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
    <button on:click|stopPropagation={ blinkBulb_click } bind:this={blink_button}>blink</button>
    {#if (!available)}
    <button on:click|stopPropagation={ checkPhysicalBulbAvailable } >avail?</button>
    {/if}
    
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

.status {
    float:right;
}

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


</style>
