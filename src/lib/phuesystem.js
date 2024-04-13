

import Hub from './Hub.svelte';
import Bulb from './Bulb.svelte';
import Group from './Group2.svelte';
import {
        hub_ip_addresses,
        hub_associated_names,
        bulb_associated_names
    } from '../BulbAssignments';


export let all_hubs = [];
export let all_bulbs = [];      // all Bulb UI components, hope they match physical bulbs
export let all_groups = [];




export function createNewGroup()  {
    
    let selected_bulbs = all_bulbs.filter( (b) => b.selected );
    if (selected_bulbs.length==0)
        return;
    
    let gdef = {
        name: "NEW_"+all_groups.length,  // Need to let user enter name
        members: selected_bulbs,
        all_bulbs: all_bulbs
    }
    let g = new Group({target: groupcards, props: gdef}) 
    
    all_groups.push(g)
}




/*
 * want = true     selects all bulbs
 * want = false    deselects all bulbs
 * want = -1       flips selection
 */
export function setSelectionAllBulbs(want)  {
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


export function setSelectionAllGroups(want)  {
    for (let g of all_groups)   {
            if (want <0) {
                    g.selected = !g.selected;
            } else {
                g.selected = want;
            }
    } 
}

  
  
export function checkAllAvail()   {
    for (let b of all_bulbs)   {
        b.checkAvail();
    }
}



export function updateAllBulbColorsFromReality()  {
    for (let bulb of all_bulbs)   {
        bulb.updateMyColorFromReality();
    }
}
  


export async function setAllBulbs(json)   {
    for (let hub of all_hubs)   {
        hub.setAllBulbs(json);
    }
}
  
  

  
export async function setSelBulbs(json)  {
    for (let b of all_bulbs)   {
        if (b.selected)  {
            b.setjson(json);
        }
    }
}
  


export function randomBHS()  {
    
    let b =  0.3+0.7*Math.random() ;
    let s = (Math.random() + Math.random()) /2;
    let h = Math.random()*(Math.random()+1)/2;
    
    b = Math.trunc(245*b);
    h = Math.trunc(65535*h);
    s = Math.trunc(250*s);
    
    return { b: b,  h: h,  s: s };
}



export function randomizeSelectedBulbs(transition_time=0.4 /*seconds*/ )  {
    // User may have selected groups and bulbs, with some bulbs being in the selected
    // groups.  Make a list to avoid double-setting those bulbs. 
    
    let selected_bulbs = [];
    for (let bulb of all_bulbs)  {
        if (bulb.selected)  {
            selected_bulbs.push(bulb); 
        }
    }
    
    const tt = Math.trunc(10*transition_time);
    for (let bulb of selected_bulbs) {        
        const bhs = randomBHS();
        const rand = {bri: bhs.b, hue: bhs.h, sat: bhs.s, transitiontime:tt};
        console.log(`  RND set bulb ${bulb.name} to ${rand.bri} ${rand.hue} now`);
        bulb.setjson(rand); 
    }
}  


export function randomSeriesSelectedBulbs(transition_time=0.3 /*seconds*/)  {
    const tt = Math.trunc(10*transition_time);
    
    let selected_bulbs = [];
    for (let bulb of all_bulbs)  {
        if (bulb.selected)  {
            selected_bulbs.push(bulb); 
        }
    }
    
    const nbulbs = selected_bulbs.length;
    if (nbulbs<1)
        return;
    
    if (nbulbs==1) {
        randomizeSelectedBulbs(transition_time=transition_time);
        return;
    }
        
    let bhs0 = randomBHS();
    let bhs1 = randomBHS();
    if (Math.random()>0.5) bhs0.h+=65536;
    if (Math.random()>0.5) bhs1.h+=65536;
    for (let i=0; i<selected_bulbs.length; i+=1)  {
        const f = i/(selected_bulbs.length-1);
        const fbar = 1-f;
        const z = { 
                bri:  Math.trunc(fbar*bhs0.b + f*bhs1.b),
                sat:  Math.trunc(fbar*bhs0.s + f*bhs1.s),
                hue:  Math.trunc(fbar*bhs0.h + f*bhs1.h) % 65536,
                transition_time: tt
                };
        selected_bulbs[i].setjson(z);
    }
}




export
async function createAllHubCards()  {
    console.log("Fetching Hub info, making Hub Cards...");
    let hub_card_div = document.getElementById("hubcards");
    console.log("hub IP addr = ", hub_ip_addresses );
    for (let ip of hub_ip_addresses)  {
        let url =  "http://" + ip + "/api/config";
        const reply = await fetch(url).catch();
        const conf =  await reply.json();
        const mac = conf.mac;
        let hinfo = hub_associated_names.find( (a) => mac === a.mac );
        let hub = new Hub( { target: hub_card_div, props: {
            name: hinfo.name,
            key: hinfo.key,
            mac: conf.mac,
            ipaddr: ip
        }});
        all_hubs.push(hub);
        console.log(`Made card for ${hub.name} ${hub.ipaddr} ${hub.mac}`);
    }
    console.log("Done making hub cards");
}



export
async function makeBulbDefinitionsFromHub(hub)   {
    console.log("Making bulb defs for all bulbs of hub ", hub.name);
    
    let allbulbinfo =  await hub.dumpBulbStates().catch((e)=>console.log("Hub dump fail:", e));
    console.log("allbulbinfo = ", allbulbinfo);
    if (allbulbinfo.length<1) return [];
    
    let defs =[];
    for (let b in allbulbinfo)  {
        const bulb = allbulbinfo[b];
        const buid = bulb.uniqueid;
        let z = bulb_associated_names.find( (ba) =>  buid.includes(ba.hwid) );
        let found_name = (z)? z.name :  hub.name + ':' + b;
        let avail = bulb.state.reachable;
        let def ={
                myhub:hub, 
                hib:b, 
                unique_id:bulb.uniqueid,
                model:bulb.modelid,
                name: found_name,
                available: avail
        };
        console.log("   len defs=", defs.length, "  about to push def=", def);
        defs.push(def);
        console.log(`    -> now defs len = ${defs.length}`);
    }
    
    console.log("DONE. Defs for this hub: ",  defs);
    return defs;
}




export
function addNewBulbCardsFromDefs(bulb_defs)  {

    let all_known_bulb_ids = all_bulbs.map( (b) => b.unique_id );
                console.log("All known bulbid: ", all_known_bulb_ids);

    let bulb_card_div = document.getElementById("bulbcards");

    console.log("Making new Bulb cards...");
    for (let def of bulb_defs)  {
        console.log("Considering bulbdef ", def, " having id ", def.uniqueid);
        if (all_known_bulb_ids.includes(def.uniqueid))  continue;
        console.log("... survived duplication filter!  Making Bulb...");
        let newb = new Bulb({target: bulb_card_div,  props: def});
        console.log("have new Bulb ", newb, "  all_bulbs count = ", all_bulbs.length);
        all_bulbs.push(newb);
        console.log("add to all_bulbs, new len =", all_bulbs.length);
        newb.updateMyColorFromReality();
    }    
    console.log("DONE makinig bulb cards.");
}



export
async function createAllBulbCards()   {
    console.log("START createAllBulbCards");
    let bulbdefs = [];
    for (let hub of all_hubs)  {
        const more_defs = await makeBulbDefinitionsFromHub(hub);
        bulbdefs = bulbdefs.concat(more_defs);
    }
    
    console.log("len=", bulbdefs.length, "List of ALL bulbdefs from all hubs: ",  bulbdefs);
    if (bulbdefs.length===0) {
        return;
    }
    
    bulbdefs.sort( (a,b) => a.name.localeCompare(b.name) );
    
    addNewBulbCardsFromDefs(bulbdefs);
    console.log("DONE createAllBulbCards");
}



export
async function createAllGroups()   {
    console.log("ALL Gr ", all_groups);
    
    let gdef = {
        name: "All",
        members: all_bulbs.slice(),
        all_bulbs: all_bulbs
    }
    let group_all = new Group({target: groupcards, props: gdef}) 
    
    all_groups.push(group_all)
}




