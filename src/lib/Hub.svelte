<svelte:options accessors />


<script>
import TinyColorButtons  from './TinyColorButtons.svelte';

export let name = "unnamed";
export let ipaddr = "192.168.x.x";
export let mac = "00:00:00:00:00:00";
export let key = "0123456789".repeat(4);


$: url0 =  "http://" + ipaddr + "/api/" + key;

function urlForBulb(hib)  {
    let url = url0+ "/lights/" + (ibhub) + "/state";
    console.log("url bulb ", hib, " = ",  url);
    return url;
}



export async function dumpBulbStates()   {
    const reply = await fetch(url0 + "/lights");
    const bulbjson = await reply.json();
    return bulbjson;
}



export async function checkAvailOfBulbByIndex(hib)    {
    let url = url0 + "/lights/" + hib + "/state";
    console.log("Hub ", name, "  checking reachability bulbid ", hib);
    const reply = await fetch(url);
    const json = await reply.json();
    console.log("   >> ", json);
    return json.reachable;
}


export async function getBulbColor(hib)   {
  let url = url0 + "/lights/" + hib + "/";
  const reply = await fetch(url);
  const bulbjson = await reply.json();
  const s = bulbjson["state"];
  let color_json = { 
            bri: s["bri"],  
            sat: s["sat"],
            hue: s["hue"],
            xy: s["xy"]
  };
  return color_json;
}


export function setBulb(hib, json)  {
  let url = url0 + "/lights/" + hib + "/state";
  const req = {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
    };
  fetch(url,  req)
    .then( response => response.json() );
    
}


export async function  setAllBulbs(json)   {
    let bulbs = await dumpBulbStates();
    for (let ibulb in bulbs)  {
        setBulb(ibulb, json);
    }
}

function tinyColorChosen(ev)  {
    setAllBulbs(ev.detail.json);
}

</script>


<fieldset class="whole">
<legend>{name}</legend>
<p>{name} at {ipaddr}</p>
<p id="key">{key}</p>
<p class="technobabble">{mac}</p>
<div class="buttonbunch">
    <button on:click|stopPropagation={ () => setAllBulbs({on:false}) }>All OFF</button>
    <button on:click|stopPropagation={ () => setAllBulbs({on:true}) }>All ON</button>
    <TinyColorButtons 
        on:color_chosen={tinyColorChosen} 
        />

</div>
</fieldset>


<style>
.whole  { 
    border: #263 solid 5px;  
    border-radius:0.7em; 
    background:#e6ffef;
    padding: .2rem;
    margin:2px;
    width:25rem;
    text-align: center;
    display: inline;
}

.whole legend {
    margin-left:1em;
    color: #263;
}

.buttonbunch {
    display: flex;
}
.buttonbunch button {
    border:2px solid #263;
    border-radius:6px;
}


p { 
    margin-top:  .14rem; 
    margin-bottom: .14rem; 
}

#key  {
    font-size:0.85rem;
    color: #349;
}

.technobabble { 
    font-size:.75rem;
    color: #485;
}
</style>
