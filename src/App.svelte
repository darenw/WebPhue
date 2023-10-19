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
  
  async function dumpAllLights()  {
    let dt = "";
    for (let hub of all_hubs)   {
        let jsonx = await hub.dumpBulbStates();
        dt +=  JSON.stringify( jsonx );
    }
    textdump = dt;
  }
  
  
  
  async function turnAllOnOff(want)   {
    for (let hub of all_hubs)  {
        hub.turnAllOnOff(want); 
    }
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


  
  
  async function makeBulbCardsForHub(hub)   {
    console.log("Making cards for all bulbs of hub ", hub.name);
    let allbulbinfo = await hub.dumpBulbStates().catch((e)=>console.log(e));
    let bb = document.getElementById("bulbcards");
    for (let b in allbulbinfo)  {
        let bulb = allbulbinfo[b];
        const buid = bulb.uniqueid;
        let z = bulb_associated_names.find( (ba) =>  buid.includes(ba.hwid) );
        let found_name = (z)? z.name :  hub.name + ':' + b;
        let avail = bulb.state.reachable;
        let newb = new Bulb( { target:bb, props:{
                myhub:hub, 
                hib:b, 
                unique_id:bulb.uniqueid,
                model:bulb.modelid,
                name: found_name,
                available: avail
        }});
        all_bulbs.push(newb);
    }
  }
  
  
  async function makeHubCards()  {
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
        makeBulbCardsForHub(hub);
    }
  }
  
  onMount(() => {
    makeHubCards();
//    makeBulbCardsForHub(hub1);
  });
  
  
</script>




<main>
    <div class="overall">

    <div class="cardstack" id="hubcards">
      <!-- ALL HUB CARDS GO HERE -->
    </div>
    
    <div class="cardstack" id="bulbcards">
      <!-- ALL BULB CARDS GO HERE -->
    </div>
    
    </div>
    
    <fieldset class="buttonbunch">
        <legend>Selected Bulbs</legend>
        <div class="bunchedbutton"><button on:click={ () => setSelectionAll(true)}>All</button></div>
        <div class="bunchedbutton"><button on:click={ () => setSelectionAll(false)}>None</button></div>
        <div class="bunchedbutton"><button on:click={ () => setSelBulbs({"on":false} )}>Off</button></div>
        <div class="bunchedbutton"><button on:click={ () => setSelBulbs({"on":true} )} >ON</button></div>
        <div class="bunchedbutton"><button on:click={ () => setSelBulbs({"bri":160,"hue":1811,"sat":208})  }>red</button></div>
        <div class="bunchedbutton"><button on:click={ () => setSelBulbs({"bri":200,"hue":29111,"sat":158})  }>green</button></div>
        <TinyColorButtons  on:color_chosen={tinyColorChosenSelected} />
    </fieldset>

    <fieldset class="buttonbunch"> 
        <legend>All Bulbs</legend>
        <div class="bunchedbutton"><button on:click={ () => turnAllOnOff(0) }>All Off</button></div>
        <div class="bunchedbutton"><button on:click={ () => turnAllOnOff(1) }>All ON</button></div>
        <div class="bunchedbutton"><button on:click={ dumpAllLights }>All Lights JSON</button></div>
        <div class="bunchedbutton"><button on:click={ checkAllAvail }>Avail?</button></div>
        <div class="bunchedbutton"><button on:click={ () => setAllBulbs( {"bri":140,"hue":7811,"sat":168} )  }>orange</button></div>
        <div class="bunchedbutton"><button on:click={ () => setAllBulbs( {"bri":140,"hue":7811,"sat":168} )  }>white</button></div>
    </fieldset>
    
    
    <div class="dumpzone">
    <textarea bind:value={textdump}></textarea>
    </div>
    
    
    <address>
    Source: <a href="https://github.com/darenw/WebPhue">WebPhue</a> at GitHub 
    <span style="margin-left:5em;" />
    Made using
        <a href="https://svelte.dev" target="_blank" rel="noreferrer">Svelte <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" /></a>
    </address>
    
</main>




<style>
.cardstack {
    display: flex;
    flex-direction: column;
    /*border:1px #777 dotted;*/
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
.bunchedbutton {
    padding:.013em;
    margin:2px;
    border:2px solid #448;
    border-radius:6px;
}

.overall {
    display:flex;
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
