<script>
import { onMount } from 'svelte';
import svelteLogo from './assets/svelte.svg';

import Hub from './lib/Hub.svelte';
import Bulb from './lib/Bulb.svelte';
import Group from './lib/Group.svelte';
import TinyColorButtons  from './lib/TinyColorButtons.svelte';
import BulbActionBar from './lib/BulbActionBar.svelte';
import GroupActionBar from './lib/GroupActionBar.svelte';
import * as phue from './lib/phuesystem.js';  // ????????????


import { random_color_cie, unittest_colors } from './lib/phcolor.js';
import {} from './lib/phuesystem.js';

import {bulb_associated_names, 
      hub_associated_names,
      hub_ip_addresses
      }   from './BulbAssignments';
 


let textdump="";

let cards_box;         // var to binded to DIV holding all Bulb cards

let group_all;




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
        phue.all_hubs.push(hub);
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
    for (let hub of phue.all_hubs)  {
        let new_defs = await makeBulbDefinitionsForHub(hub);
        console.log("for hub ", hub.name, "  bulbs reoprted: ", new_defs);
        bulbdefs.push(...new_defs);
    }

    bulbdefs.sort( (a,b) => a.name.localeCompare(b.name) );

    let bulbcards = document.getElementById("bulbcards");
    for (let bdef of bulbdefs)  {
        let newb = new Bulb({target: bulbcards,  props: bdef});
        phue.all_bulbs.push(newb);
        newb.updateMyColorFromReality();
    }

    createAllGroups();

}  



async function createAllGroups()   {
    console.log("ALL Gr ", phue.all_groups);
    
    let gdef = {
        name: "All",
        members: phue.all_bulbs.slice(),
        all_bulbs: phue.all_bulbs
    }
    group_all = new Group({target: groupcards, props: gdef}) 
    
    phue.all_groups.push(group_all)
}



onMount(() => {
    createAllCards();
});
  


</script>





<!----------------------------------   H T M L   ---------------------------->

<main>
        
    
    
    <fieldset class="section">
        <legend>Groups</legend>

        <!-- ALL GROUP CARDS GO HERE -->
        <span id="groupcards" />
        
        <!-- <GroupActionBar /> -->
    </fieldset>
    
    
    <fieldset class="section">
        <legend>Bulbs</legend>

        <BulbActionBar />
        
        <!-- ALL BULB CARDS GO HERE -->
        <span id="bulbcards" />
    
    </fieldset>

    
 
    <fieldset class="buttonbunch"> 
        <legend>System</legend>
        
            <!-- ALL HUB CARDS GO HERE -->
            <span class="cardstack" id="hubcards" />
            
            <div>
            <button on:click={phue.updateAllBulbColorsFromReality}>reality update</button>
            <button on:click={ () => { } }>useless</button>
            </div>
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
