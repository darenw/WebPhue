

// Obviously hardcoding Hue system config info here is bad idea. 
// TODO: get most of this info from a persistent store, maybe a local file, maybe something else

export const hub_ip_addresses = [ "192.168.1.85", "192.168.1.9" ];


export const hub_associated_names = [
    {  
       bridgeid: "001788FFFE4D974D",
	   mac:  "00:17:88:4d:97:4d",
       key:  "2SauenjyuxCMB2rHKSFxp06oZGtNhEy4OiCuQel8",
       name: "Hub1"  
    },
    {  
       bridgeid: "001788FFFE218A2E",
	   mac:   "00:17:88:21:8a:2e",
       key: "cTiCCIRzOjL1mNuoN1ndDwaQhFSlpsojUIfjKT-u",
       name:  "Hub2"  
    }
];



export const bulb_associated_names = [
    { hwid:"65:b6:1e", hub:"Hub2", hib:2, name:"Desk1" },
    { hwid:"ad:88:c5", hub:"Hub2", hib:1, name:"Underdesk" },
    { hwid:"b1:af:d4", hub:"Hub2", hib:3, name:"BooksRight" },
    { hwid:"67:9c:1c", hub:"Hub1", hib:6, name:"BooksLeft" },
    { hwid:"54:9b:8b", hub:"Hub1", hib:1, name:"Hydra1" },
    { hwid:"b2:31:0f", hub:"Hub1", hib:2, name:"Hydra2" },
    { hwid:"b1:af:42", hub:"Hub1", hib:7, name:"Hydra3" },
    { hwid:"ed:9b:b8", hub:"Hub1", hib:4, name:"Hydra4" },
    { hwid:"7c:e9:70", hub:"Hub1", hib:3, name:"Hydra5" },
    { hwid:"f2:61:5a", hub:"Hub1", hib:5, name:"BedPole1" }
    
];

