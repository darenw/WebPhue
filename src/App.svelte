<script>
  import { onMount } from 'svelte';
  import svelteLogo from './assets/svelte.svg';
  import Hub from './lib/Hub.svelte';
  import Bulb from './lib/Bulb.svelte';
  
  // Obviously hardcoding Hue system config info here is bad idea. 
  // TODO:  obtain this from a persistent data store
  const hub1_config_dsw = { 
        name: "Hub1",
        ipaddr: "192.168.1.85",
        key: "2SauenjyuxCMB2rHKSFxp06oZGtNhEy4OiCuQel8"
  }
  
  const hub2_config_dsw = { 
        name: "Hub2",
        ipaddr: "192.168.1.9",
        key: "cTiCCIRzOjL1mNuoN1ndDwaQhFSlpsojUIfjKT-u"
  }
  
  
  let hub1;
  let hub2;
  
  let all_hubs = [hub1, hub2];  // ineffective here; good stuff happens in onMount()

  
  let textdump="";
  
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
  
  
  
  // Analyze the JSON from hub's .../lights, 
  // return array of bulb definitions:  hub's id for bulb, 
  function parseLightsJson(json)   {
  }
  
  let all_bulbdefs = [];  
  
  
  
  async function makeBulbCardsForHub(hub)   {
    console.log("Making cards for all bulbs of hub ", hub.name);
    let allbulbinfo = await hub.dumpBulbStates();
    console.log(allbulbinfo);
    let bb = document.getElementById("thebulbcards");
    for (let b in allbulbinfo)  {
        //console.log("B in bulbinfo ", b, " & ", allbulbinfo[b]);
        let bulb = allbulbinfo[b];
        new Bulb( { target:bb, props:{
                myhub:hub, 
                hib:b, 
                unique_id:bulb.uniqueid,
                model:bulb.modelid,
                name: hub.name + ':' + b
        } } );
    }
  }
  
  
  
  
  onMount(() => {
    console.log("MOUNT ", hub1, hub2);
    all_hubs = [hub1, hub2];
    makeBulbCardsForHub(hub1);
    makeBulbCardsForHub(hub2);    
  });
  
  
const stupid_bulb_info = { name: "Foo McFoo", key: "ditz" };
</script>


<main>
    <div class="overall">

    <div class="bunchastuff">
    <Hub {...hub1_config_dsw}  bind:this={hub1}/>
    <Hub {...hub2_config_dsw}  bind:this={hub2}/>
    </div>
    
    <div class="bunchastuff">
    <div class="bulbcards" id="thebulbcards">
    <!-- <Bulb  hib=9876 myhub={stupid_bulb_info} /> -->
    </div>
    </div>

    
    
    </div>
    
    <div class="buttonbunch"> 
        <div class="bunchedbutton"><button on:click={ () => turnAllOnOff(0) }>All Off</button></div>
        <div class="bunchedbutton"><button on:click={ () => turnAllOnOff(1) }>All ON</button></div>
        <div class="bunchedbutton"><button on:click={ dumpAllLights }>All Lights JSON</button></div>
        <div class="bunchedbutton"><button on:click={ () => setAllBulbs( {"bri":140,"hue":7811,"sat":168} )  }>All orange</button></div>
    </div>
    
    
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
