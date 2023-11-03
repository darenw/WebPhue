<script>
  import { onMount } from 'svelte';
  import svelteLogo from './assets/svelte.svg';

  import Hub from './lib/Hub.svelte';
  import Bulb from './lib/Bulb.svelte';
  import TinyColorButtons  from './lib/TinyColorButtons.svelte';

  import {bulb_associated_names, 
          hub_associated_names,
          hub_ip_addresses
          }   from './BulbAssignments';
  
  
  
  let textdump="";
  
  let all_hubs = [];
  let all_bulbs = [];      // all Bulb UI components, hope they match physical bulbs
  let bulbcardsbox;         // var to binded to DIV holding all Bulb cards
  
  
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
  
  
  
  
  async function setAllBulbs(json)   {
    for (let hub of all_hubs)   {
        hub.setAllBulbs(json);
    }
  }
  
  
  function setSelectionAll(want)  {
    for (let b of all_bulbs)   {
        b.selected = want;
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



  async function makeHubCards()  {
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
  
  
  
  async function makeBulbCardDefinitionsForHub(hub)   {
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
    
    await makeHubCards();
    
    // Get bulb info from _all_ hubs first before trying to sort them
    let bulbdefs = []
    for (let hub of all_hubs)  {
        let new_defs = await makeBulbCardDefinitionsForHub(hub);
        console.log("for hub ", hub.name, "  bulbs reoprted: ", new_defs);
        bulbdefs.push(...new_defs);
    }
    bulbdefs.sort( (a,b) => a.name.localeCompare(b.name) );
    
    let bulbcards = document.getElementById("bulbcards");
    for (let bdef of bulbdefs)  {
        let newb = new Bulb({target: bulbcards,  props: bdef});
        console.log("Made ",  newb.name);
        all_bulbs.push(newb);
    }
  }  


  onMount(() => {
    createAllCards();
  });
  
  
</script>




<main>
    <div class="overall">

    
    <fieldset class="section">
        <legend>Bridges</legend>
        <!-- ALL HUB CARDS GO HERE -->
        <span class="cardstack" id="hubcards" />
    </fieldset>
    
        
        
    
    <fieldset class="section">
        <legend>Bulbs</legend>
            <!-- ALL BULB CARDS GO HERE -->
            <span id="bulbcards" />
    
    
    <fieldset class="buttonbunch">
        <legend>Selected Bulbs</legend>
        <button on:click={ () => setSelectionAll(true)}>All</button>
        <button on:click={ () => setSelectionAll(false)}>None</button>
        <button on:click={ () => setSelBulbs({"on":false} )}>Off</button>
        <button on:click={ () => setSelBulbs({"on":true} )} >ON</button>
        <TinyColorButtons  on:color_chosen={tinyColorChosenSelected} />
    </fieldset>
    </fieldset>

    
    </div>
    
    <fieldset class="buttonbunch"> 
        <legend>All Bulbs</legend>
        <button on:click={ () => setAllBulbs({on:false}) }>All Off</button>
        <button on:click={ () => setAllBulbs({on:true}) }>All ON</button>
        <button on:click={ dumpAllLights }>All Lights JSON</button>
        <button on:click={ checkAllAvail }>Avail?</button>
        <button on:click={ () => setAllBulbs( {"bri":140,"hue":7811,"sat":168} )  }>orange</button>
        <button on:click={ () => setAllBulbs( {"bri":140,"hue":7811,"sat":168} )  }>white</button>
    </fieldset>
    
    
    
    <address>
    Source: <a href="https://github.com/darenw/WebPhue">WebPhue</a> at GitHub 
    <span style="margin-left:5em;" />
    Made using
        <a href="https://svelte.dev" target="_blank" rel="noreferrer">Svelte <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" /></a>
    </address>
    
</main>




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
    margin-top:1em;
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
