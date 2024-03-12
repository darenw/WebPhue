

import Hub from './Hub.svelte';
import Bulb from './Bulb.svelte';
import Group from './Group.svelte';


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
