<svelte:options accessors />


<script>
import { onDestroy, getContext } from 'svelte';
import TinyColorButtons  from './TinyColorButtons.svelte';
import AdjustValue from './AdjustValue.svelte';
import './card.css'; 

// const { open } = getContext('simple-modal');

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
        { name:"Dim",     hexrgb:"#555",  json:{bri: 60, sat:25, hue:1500 }},
        { name:"Medium",    hexrgb:"#aaa",  json:{bri: 144, sat:13, hue:6500 }},
        { name:"Bright",    hexrgb:"#fff",  json:{bri: 255, sat:7, hue:8000 }},
        { name:"Peach",    hexrgb:"#fca",  json:{bri: 233, sat:85, hue:5003 }},

    ],
    [
        { name:"Blue", hexrgb:"#4c41ec",  json:{bri: 200, sat:210, hue:44800 }},
        { name:"Green",   hexrgb:"#22f022",   json:{bri: 220, sat:203, hue:25000 } },
        { name:"Yellow",   hexrgb:"#fdfd94",  json:{bri: 222, sat:201, hue:9710 }},
        { name:"Red",   hexrgb:"#ff1000",  json:{bri: 220, sat:255, hue: 10 }},
        { name:"Magenta",   hexrgb:"#ff10ff",  json:{bri: 220, sat:250, hue: 61000 }},

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



export function setjson_no_update(json)  {
    if (myhub)  {
        myhub.setBulb(hib, json);
    }
}

export  function setjson(json)   {
    setjson_no_update(json);
    updateMyColorFromReality();
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
    //console.log("Reality update:  ", state);
    current_bri = state["bri"]; 
    current_sat = state["sat"]; 
    current_hue = state["hue"];
    let current_xy =  state["xy"];
    current_ciex = current_xy[0];
    current_ciey = current_xy[1];
    bulb_is_on = state["on"];
}


function unOwnMe()  {
    
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
        setjson_no_update({"on":false, transitiontime:1});
        blink_state=false;
    } else {
        setjson_no_update({"on":true, bri:200, transitiontime:1});
        blink_state=true;
    }
}


let blinker = 0;

export function startBlinkingBulb(period_seconds = 1.6)   {
    updateMyColorFromReality();           // unlikely, but just in case our props are not current
    setjson_no_update( {bri: 200, sat: 15, hue: 5000} );   // blinks white; we're not updating current_color
    blinker = setInterval(flip_blink_state, period_seconds/2 *1000.0 /*milliseconds*/ );
}


export function stopBlinkingBulb()    {
        if (blinker) clearInterval(blinker);
        blinker = 0;
        turnBulbOn();
        setjson_no_update( {bri: current_bri,  hue: current_hue,  sat: current_sat} );
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



//------------------------- Adjust Value Dialog ------------------------//

// Variable representing the AdjustValue popup dialog with one slider and an OK button
let theAdjustValueDialog;

const vad_slider_width = 340;
const vad_ticlist = [0, 25, 50, 75, 100];  // % along slider

// Variables used to pass info to/from the AdjustValue Dialog 
let vad_name;
let vad_value;
let vad_value_initial;
let vad_min;
let vad_max;
let vad_step;
let vad_updater;
let vad_ok;

$: {
    console.log("  value changed to ", vad_value);
    if (vad_updater) vad_updater(vad_value);
}


function popupAdjustValue(param_name, init_value, min_value, max_value, value_step, updater=()=>{})  {
    vad_updater = updater;
    vad_name = param_name;
    vad_value = init_value;
    vad_value_initial = init_value;
    vad_min = min_value; 
    vad_max = max_value;
    vad_step = value_step;
    vad_ok = 0;
    console.log(`SHOW ADJVAL   ${vad_name}, current value ${vad_value} (limits ${vad_min} to ${vad_max} for bulb ${name}`);
    theAdjustValueDialog.showModal();
    console.log("CLOSED ADJVAL  vad_value=", vad_value);
    
    if (vad_ok)  {
        console.log("AdjustValue() returning with new value = ", vad_value, " for ", param_name);
        return vad_value;
    } else {
        console.log("AdjustValue() returning CANCEL ret init=", init_value, "    ignored modified value =", vad_value);
        return init_value;
    }
}




function adjust_bri()  {
    let new_bri = popupAdjustValue("Brightness", 
            current_bri, 
            0, 255, 1, 
            (v)=>{setjson({'bri': Math.trunc(v) });}
            );
    // setjson({'bri': Math.trunc(new_bri) });
}

function adjust_sat()  {
    let new_sat = popupAdjustValue("Saturation", 
            current_sat, 
            0, 255, 1,
            (v)=>{setjson({'sat': Math.trunc(v) });}
            );
}

function adjust_hue()  {
    let new_hue = popupAdjustValue("Hue", 
            current_hue, 
            0, 65535, 100,
            (v)=>{ setjson( {'hue': Math.trunc(v)} ); }
            );
    //setjson({'hue': Math.trunc(new_hue) });
}

function adjust_x()  {
    let new_x = popupAdjustValue("CIE x", 
            current_ciex, 
            0.0, 1.0, 0.001,
            (v)=>{setjson( {'xy': [v,current_ciey] } );}
            );
}

function adjust_y()  {
    let new_y = popupAdjustValue("CIE y", 
            current_ciey, 
            0.0, 1.0, 0.001,
            (v)=>{setjson( {'xy': [current_ciex,v] } );}

            );
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
        <th on:click|stopPropagation={adjust_bri}>bri</th>
        <th on:click|stopPropagation={adjust_sat}>sat</th>
        <th on:click|stopPropagation={adjust_hue}>hue</th>
        <th on:click|stopPropagation={adjust_x}>CIE x</th>
        <th on:click|stopPropagation={adjust_y}>y</th>
    </tr>
    <tr>
        <td on:click|stopPropagation={adjust_bri}>{current_bri}</td>
        <td on:click|stopPropagation={adjust_sat}>{current_sat}</td>
        <td on:click|stopPropagation={adjust_hue}>{current_hue}</td>
        <td on:click|stopPropagation={adjust_x}>{current_ciex}</td>
        <td on:click|stopPropagation={adjust_y}>{current_ciey}</td>
    </tr>
</table>


<AdjustValue
            bind:dialog={theAdjustValueDialog}   
            on:close={ () => console.log('AdjustValue closed')}
            >
    <h1>Adjust {vad_name} for {name}</h1>  
    
    <!-- h2>param {vad_name} currently {vad_value} min {vad_min} max {vad_max}</h2 -->
    <span>{vad_value}</span>
    <br>
    <span class="minmax-label">{vad_min}</span>
    <input type="range"  
            class="valueslider"
            min={vad_min}
            max={vad_max}
            step={vad_step}
            
            bind:value={vad_value}
            >
    <span class="minmax-label">{vad_max}</span>
            
    <datalist id="ticlist">
        {#each vad_ticlist as ticpercent, i}
        <!-- value is of variable begin adjusted, not pixels, not fraction along slider -->
        <!-- <option value={ticpercent*(vad_max-vad_min)/100.0 + vad_min} /> -->
        {/each}
    </datalist>
    <br>
    
    <button on:click={  () => {
                vad_ok=false; 
                theAdjustValueDialog.close(); 
                vad_value = vad_value_initial;
                console.log("on:click: Close CANCEL,  vad_ok=", vad_ok); 
                }  
            }
    >Cancel</button>
    
    <button on:click={  () => {
                vad_ok=true; 
                
                theAdjustValueDialog.close(); 
                console.log("on:click: Close SET,  vad_ok=", vad_ok); 
                }  
            }
    >Set</button>    
</AdjustValue>


<div class="buttonbunch">
    <button on:click|stopPropagation={ turnBulbOn } >On</button>
    <button on:click|stopPropagation={ turnBulbOff } >Off</button>
    <button on:click|stopPropagation={ blinkBulb_click } bind:this={blink_button}>blink</button>
    {#if (!available)}
    <button on:click|stopPropagation={ checkPhysicalBulbAvailable } >avail?</button>
    {:else}
    <button on:click|stopPropagation={ unOwnMe } >de-own</button>
    {/if}
    <button on:click|stopPropagation={ () => setjson({'bri':251,'xy':[0.33,0.33]}) } >white</button>
    <button on:click|stopPropagation={ () => setjson({'bri':201,'hue':22000,'sat':171}) } >green</button>
</div>

<p class="status">{colorhover}</p>

</fieldset>





<!---------------------------   S T Y L E   ---------------------------->

<style>

.vam_popup {border:red solid 22px;}

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


valueslider { width:480px;  }

</style>
