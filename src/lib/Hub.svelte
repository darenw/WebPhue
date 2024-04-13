<svelte:options accessors />


<script>
import TinyColorButtons  from './TinyColorButtons.svelte';
import './card.css'; 
import { makeBulbDefinitionsFromHub, addNewBulbCardsFromDefs } from './phuesystem.js';


export let name = "unnamed";
export let ipaddr = "192.168.x.x";
export let mac = "00:00:00:00:00:00";
export let key = "0123456789".repeat(4);

let show_note = false;
let note = "-?-";

$: key_or_note = (show_note)? note : key;

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


export async function getBulbStateJson(hib)   {
  let url = url0 + "/lights/" + hib + "/";
  const reply = await fetch(url);
  const bulbjson = await reply.json();
  return  bulbjson["state"];
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




      
async function checkNewStatus(url_scan_report)  {

    const http_scan_check_options = {
        method: "GET",
        delay: 6000,
        headers: {
            "Content-Type":  "application/json"
        } 
    };
    
    let x = await fetch(url_scan_report, http_scan_check_options);
    let j = await x.json();
    return j;
    
}


const delayFetch = (url, http_options) =>
  new Promise( (resolve) => {
    setTimeout(() => {
      resolve(fetch(url, http_options));
    }, http_options.delay);
});

  
async function findNewBulbs()  {
    const ok=confirm("Turn on all un-owned bulbs to be found by " +name+ ". Turn off ones to be ignored. Ready?");
    if (!ok) return;
    
    note = "Searching for new and old un-owned bulbs..."
    show_note = true;
    console.log("Hub \"" + name+ "\" Searching for un-owned bulb..."); // only for debugging
    
    
    //---- Tell hub to start search for new bulbs by POST (blank content) to .../lights
    
    const lights_url = url0 + "/lights";
    const http_post_options = {
        method: "POST",
        delay: 100,
        headers: {
            "Content-Type":  "application/json"
        } 
    };
    fetch(lights_url, http_post_options)
        .then( (scanreply) => scanreply.json() )
        .then( (json) => console.log("POST scan reply: ", json) )
        .catch( (error) => console.log(error.message) );
    
    
    //------ Repeat asking for .../lights/new until we no longer see "active"
    // have a timeout of 90 seconds
    
    let scan_finished = false;
    const url_scan_report = lights_url + "/new";
    let report ;
    while (!scan_finished)  {
    
        report = checkNewStatus();
        
        let state = report["lastscan"] ?? "active";
        if (state==="none") {
            confirm("No bulbs found in this scan");
            show_note=false;
            scan_finished = true;
            return;
        }
        if (report["lastscan"]==="active") {
            console.log("still searching...");
        } else {
            scan_finished = true;
        }
    }
    
    show_note=false;
    // Ask hub for list of just the new bulbs by the usual GET from .../lights  
    console.log("GETTING list of NEW bulbs from ", lights_url);
    const lights_reply = await fetch(lights_url);
    const new_bulbs = await lights_reply.json();
    console.log("FOUND THESE BULBS:    ");
    console.log(new_bulbs);
    
    // Make yellow bulb cards  
    // Note that addNewBulbCardsFromDefs() checks for already existing bulbs using .uniqueid
    
    let defs = makeBulbDefinitionsFromHub(this);
    addNewBulbCardsFromDefs(defs);
}




function findMeNewBulbs()  {
    findNewBulbs();
}


</script>



<!----------------------------------   H T M L   ---------------------------->
<fieldset class="card">
<legend>{name}</legend>
<p>{name} at {ipaddr}</p>
<p id="key">{key_or_note}</p>
<p class="technobabble">{mac}</p>
<div class="buttonbunch">
    <button on:click|stopPropagation={ () => setAllBulbs({on:false}) }>All OFF</button>
    <button on:click|stopPropagation={ () => setAllBulbs({on:true}) }>All ON</button>
    <button on:click|stopPropagation={ () => findMeNewBulbs() }>Find new bulbs (unimpl)</button>
</div>
</fieldset>



<!----------------------------------   S T Y L E   ---------------------------->
<style>

.card  { 
    border-color: #284;
    background:#e6ffef;
}
.card legend {  color: #152; }


.buttonbunch button {
    border-color: #263;
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
