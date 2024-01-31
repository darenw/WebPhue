<script>
import { onMount } from 'svelte';
import svelteLogo from './assets/svelte.svg';

import Hub from './lib/Hub.svelte';
import Bulb from './lib/Bulb.svelte';
import Group from './lib/Group.svelte';
import TinyColorButtons  from './lib/TinyColorButtons.svelte';
import { random_color, unittest_colors } from './lib/phcolor.js';

import {bulb_associated_names, 
      hub_associated_names,
      hub_ip_addresses
      }   from './BulbAssignments';



let textdump="";

let all_hubs = [];
let all_bulbs = [];      // all Bulb UI components, hope they match physical bulbs
let all_groups = [];
let cards_box;         // var to binded to DIV holding all Bulb cards

let group_all;


function order_experiment() {
    /* ? */
}

async function dumpAllLights()  {
    let dt = "";
    for (let hub of all_hubs)   {
        let jsonx = await hub.dumpBulbStates();
        dt +=  JSON.stringify( jsonx );
    }
    textdump = dt;
}


function updateAllBulbColorsFromReality()  {
    for (let bulb of all_bulbs)   {
        bulb.updateMyColorFromReality();
    }
}
  
  
  function dumpBulbStates()   {
  
    updateAllBulbColorsFromReality();  
    const listdiv = document.getElementById("bulbcolorslist");
    let ss="";
    for (let bulb of all_bulbs)  {
        const cc = {bulb: bulb.name, color:{on: bulb.bulb_is_on }};
        const s =`bulb ${bulb.name} ${bulb.bulb_is_on? "on":"off"} B=${bulb.current_bri} S=${bulb.current_sat} H=${bulb.current_hue} x=${bulb.current_ciex} y=${bulb.current_ciey}`;
        console.log(s);
        ss += s + "\n";
    }
    listdiv.textContent = ss;
  }



  function setBulbStatesFromText()   {
    
  }
  
  async function setAllBulbs(json)   {
    for (let hub of all_hubs)   {
        hub.setAllBulbs(json);
    }
  }
  
  
 function setSelectionAll(want)  {
    for (let b of all_bulbs)   {
        if (b.available)  {
            if (want <0) {
                    b.selected = !b.selected;
            } else {
                b.selected = want;
            }
        }
    }
  }
  
  
  async function setSelBulbs(json)  {
    console.log("set selected   json=", json);
    for (let b of all_bulbs)   {
        console.log("SetSelBulbs: is ", b, " selected?",  b.selected);
        if (b.selected)  {
            b.setjson(json);
        }
    }
  }
  

  function tinyColorChosenSelected(ev) {
    setSelBulbs(ev.detail.json);
  }
  
  function checkAllAvail()   {
    for (let b of all_bulbs)   {
        b.checkAvail();
    }
  }



async function createAllHubCards()  {
    console.log("Fetching Hub info, making Hub Cards");
    let hh = document.getElementById("hubcards");
    for (let ip of hub_ip_addresses)  {
        console.log("making hub for ", ip);
        let url =  "http://" + ip + "/api/config";
        const reply = await fetch(url);
        const conf =  await reply.json();
        const mac = conf.mac;
        let hinfo = hub_associated_names.find( (a) => mac === a.mac );
        let hub = new Hub( { target:hh, props:{
            name: hinfo.name,
            key: hinfo.key,
            mac: conf.mac,
            ipaddr: ip
        }});
        all_hubs.push(hub);
    }
    console.log("Done making hubs");
}
  
  

async function makeBulbDefinitionsForHub(hub)   {
    console.log("Making cards for all bulbs of hub ", hub.name);
    let allbulbinfo = await hub.dumpBulbStates().catch((e)=>console.log(e));
    let defs =[];
    for (let b in allbulbinfo)  {
        let bulb = allbulbinfo[b];
        const buid = bulb.uniqueid;
        let z = bulb_associated_names.find( (ba) =>  buid.includes(ba.hwid) );
        let found_name = (z)? z.name :  hub.name + ':' + b;
        let avail = bulb.state.reachable;
        let bulb_props ={
                myhub:hub, 
                hib:b, 
                unique_id:bulb.uniqueid,
                model:bulb.modelid,
                name: found_name,
                available: avail
        };
        console.log(" $$ ", bulb_props);
        defs.push(bulb_props);
    }
    return defs;
}





async function createAllCards()  {

    await createAllHubCards();

    // Get bulb info from _all_ hubs first before trying to sort them
    let bulbdefs = []
    for (let hub of all_hubs)  {
        let new_defs = await makeBulbDefinitionsForHub(hub);
        console.log("for hub ", hub.name, "  bulbs reoprted: ", new_defs);
        bulbdefs.push(...new_defs);
    }

    bulbdefs.sort( (a,b) => a.name.localeCompare(b.name) );

    let bulbcards = document.getElementById("bulbcards");
    for (let bdef of bulbdefs)  {
        let newb = new Bulb({target: bulbcards,  props: bdef});
        console.log("Made ",  newb.name,  "(", newb , " ) ");
        all_bulbs.push(newb);
        console.log("all_bulbs.length = ", all_bulbs.length, "  newb.name=", newb.name);
        newb.updateMyColorFromReality();
    }

    createAllGroups();

}  


function createNewGroup()  {
    
    let selected_bulbs = all_bulbs.filter( (b) => b.selected );
    let gdef = {
        name: "NEW_"+all_groups.length,  // Need to let user enter name
        members: selected_bulbs,
        all_bulbs: all_bulbs
    }
    group_all = new Group({target: groupcards, props: gdef}) 
    
    all_groups.push(group_all)
}


async function createAllGroups()   {
    console.log("ALL Gr ", all_groups);
    
    let gdef = {
        name: "All",
        members: all_bulbs.slice(),
        all_bulbs: all_bulbs
    }
    group_all = new Group({target: groupcards, props: gdef}) 
    
    all_groups.push(group_all)
}



onMount(() => {
    createAllCards();
});
  


</script>





<!----------------------------------   H T M L   ---------------------------->

<main>
        
    
    
    
    <fieldset class="section">
        <legend>Bulbs &amp; Groups</legend>

        <!-- ALL GROUP CARDS GO HERE -->
        <span id="groupcards" />
        
        <fieldset class="buttonbunch">
            <legend>Selection</legend>
            <button on:click={ () => setSelectionAll(true)}>All</button>
            <button on:click={ () => setSelectionAll(false)}>None</button>
            <button on:click={ () => setSelectionAll(-1)}>Inv</button>
            <button on:click={ () => createNewGroup() }>+Group</button>
            <button on:click={ () => setSelBulbs({"on":false} )}>Off</button>
            <button on:click={ () => setSelBulbs({"on":true} )} >ON</button>
            <TinyColorButtons  on:color_chosen={tinyColorChosenSelected} />
        </fieldset>
        
        <!-- ALL BULB CARDS GO HERE -->
        <span id="bulbcards" />
    
    </fieldset>

    
    
    <fieldset class="section">
        <legend>Memory</legend>
        <button on:click={dumpBulbStates}>Dump</button>
        <button on:click={setBulbStatesFromText}>Set</button>
        <textarea id="bulbcolorslist"></textarea>
    </fieldset>
    
 
    <fieldset class="buttonbunch"> 
        <legend>System</legend>

        
            <!-- ALL HUB CARDS GO HERE -->
            <span class="cardstack" id="hubcards" />
    </fieldset>
    
    
    <button on:click={unittest_colors}>phcolor.js UT</button>
    
    <address>
    Source: <a href="https://github.com/darenw/WebPhue">WebPhue</a> at GitHub 
    <span style="margin-left:5em;" />
    Made using
        <a href="https://svelte.dev" target="_blank" rel="noreferrer">Svelte <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" /></a>
    </address>
    
</main>




<!----------------------------------   S T Y L E   ---------------------------->

<style>
.section   {
    
    border: #aaa solid 5px;  
    border-radius:0.7em; 
    padding: .3rem;
    margin:2px;
    margin-bottom:.8rem;
    display: block;
}
.section legend { color: #666; }


.cardstack {
    display: flex;
    padding:2px;
}

.buttonbunch {
    display: flex;
    background:#d8d8fd;
    border:4px solid #55a;
    border-radius:0.7em;
    padding:.53rem;
    margin-top:.6em;
}

.buttonbunch button  {
    margin:2px;
    border:2px solid #448;
    border-radius:6px;
}

.overall {
}


address  {
    margin-top:2em;
    padding-top:1em;
    background: #ccc;
}

textarea  {
    width: 90%;
    height: 8em;
    margin-top:0.6rem;
}

  .logo {
    height: 1.6em;
    padding: 0;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
