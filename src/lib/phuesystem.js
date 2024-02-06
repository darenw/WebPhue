

import Hub from './Hub.svelte';
import Bulb from './Bulb.svelte';
import Group from './Group.svelte';


export let all_hubs = [];
export let all_bulbs = [];      // all Bulb UI components, hope they match physical bulbs
export let all_groups = [];




export function createNewGroup()  {
    
    let selected_bulbs = all_bulbs.filter( (b) => b.selected );
    let gdef = {
        name: "NEW_"+all_groups.length,  // Need to let user enter name
        members: selected_bulbs,
        all_bulbs: all_bulbs
    }
    let g = new Group({target: groupcards, props: gdef}) 
    
    all_groups.push(g)
}





export function setSelectionAll(want)  {
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
  
  
export function checkAllAvail()   {
    for (let b of all_bulbs)   {
        b.checkAvail();
    }
}



export function updateAllBulbColorsFromReality()  {
    for (let bulb of phue.all_bulbs)   {
        bulb.updateMyColorFromReality();
    }
}
  


export async function setAllBulbs(json)   {
    for (let hub of all_hubs)   {
        hub.setAllBulbs(json);
    }
}
  
  

  
export async function setSelBulbs(json)  {
    console.log("set selected   json=", json);
    
    for (let group of all_groups)  {
        if (group.selected)   {
            group.setAllBulbs(json);
        }
    }
    
    for (let b of all_bulbs)   {
        console.log("SetSelBulbs: is ", b, " selected?",  b.selected); 
        if (b.selected)  {
            b.setjson(json);
        }
    }
}
  


export function randomizeSelectedBulbs(transition_time=0.4 /*sec*/ )  {
console.log("RND!!!!");
    // User may have selected groups and bulbs, with some bulbs being in the selected
    // groups.  Make a list to avoid double-setting those bulbs. 
    
    let bbb = [];
    
    for (let group of all_groups)  {
        if (group.selected)   {
            for (let bulb of group.members) {
                if (!bbb.includes(bulb))  bbb.push(bulb); 
            }
        }
    }
    console.log(" RND bulbs from groups: ",  bbb);
    for (let bulb of all_bulbs)  {
        if (bulb.selected)  {
                if (!bbb.includes(bulb))  bbb.push(bulb); 
        }
    }
    console.log(" RND also individual bubls: ", bbb.length);
    
    const tt = Math.trunc(10*transition_time);
    for (let bulb of bbb) {
        let b =  0.3+0.7*Math.random() ;
        let s = (Math.random() + Math.random()) /2;
        let h = Math.random()*(Math.random()+1)/2;
        
        b = Math.trunc(245*b);
        h = Math.trunc(65535*h);
        s = Math.trunc(250);
        const rand = {bri: b, hue: h, sat: s, transitiontime:tt};
        console.log(`  RND set bulb ${bulb.name} to ${rand.bri} ${rand.hue} now`);
        bulb.setjson(rand); 
    }
}  

