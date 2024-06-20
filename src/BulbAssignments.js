

// Obviously hardcoding Hue system config info here is bad idea. 
// TODO: get most of this info from a persistent store, maybe a local file, maybe something else


// PLAN: eliminate this line, get from some sort of persistent storage
const _hub_ip_addresses = [ "192.168.1.85" ];    // , "192.168.1.9" ];

export function get_hub_ip_addresses()   {
    return _hub_ip_addresses;
}





// PLAN: eliminate this line, get from some sort of persistent storage
export const _hardcoded_hub_info = [
    {  
	   mac:  "00:17:88:4d:97:4d",
       name: "Hub1",  
       key:  "2SauenjyuxCMB2rHKSFxp06oZGtNhEy4OiCuQel8",
       bridgeid: "001788FFFE4D974D",
       location: "Rat's nest by Arsenic"
    },
    {  
	   mac:   "00:17:88:21:8a:2e",
       name:  "QuestionableHub",  
       key: "OLoCEqUQJ22mLEpNQFp5FKQa7rmq53TSWd6RedAY",
       bridgeid: "001788FFFE218A2E",
       location: "Rat's nest by Arsenic"
    }
];


export function get_hub_info() {
    return _hardcoded_hub_info;
}




// PLAN: eliminate this line, get from some sort of persistent storage
// .hwid is some unique part of the MAC, not need be the whole MAC
export const _bulb_associated_names = [
    { hwid:"65:b6:1e", name:"Desk1" },
    { hwid:"ad:88:c5", name:"Underdesk" },
    { hwid:"b1:af:d4", name:"Books Right" },
    { hwid:"67:9c:1c", name:"Books Center" },
    { hwid:"b1:7d:6f", name:"Books Left" },
    { hwid:"54:9b:8b", name:"Hydra1" },
    { hwid:"b2:31:0f", name:"Hydra2" },
    { hwid:"b1:af:42", name:"Hydra3" },
    { hwid:"ed:9b:b8", name:"Hydra4" },
    { hwid:"7c:e9:70", name:"Hydra5" },
    { hwid:"f2:61:5a", name:"BedPole1" },
    { hwid:"b1:c8:da", name:"bathroom Mid"}
    
    
];

export function get_bulb_associated_names()  {
    return _bulb_associated_names;
}
