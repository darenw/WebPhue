<script>
export let name = "unnamed";
export let ipaddr = "192.168.x.x";
export let mac = "00:00:00:00:00:00";
export let key = "0123456789".repeat(4);


$: url0 =  "http://" + ipaddr + "/api/" + key;

function urlForBulb(hib)  {
    let url = url0+ "/lights/" + (ibhub) + "/state";
    console.log("url bulb ", hib, " = ",  url);
    return url;
}



export async function dumpBulbStates()   {
    const reply = await fetch(url0 + "/lights");
    const bulbjson = await reply.json();
    
    console.log("EEE]]] ", bulbjson);
    return bulbjson;
}


export function dumpBulbStatesXXX()  {
  let bulbjson = "";
  fetch(url0 + "/lights")
    .then( response => response.json() )
    .then( data => bulbjson = (data) )
    .catch( error => console.error(error) );
  console.log(bulbjson);
  return bulbjson;
}


export function setBulbOnOff(hib, want_on)  {
  let url = url0 + "/lights/" + hib + "/state";
  let json = {"on": (want_on>0)? true : false};
  const req = {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
    };
  fetch(url,  req)
    .then( response => response.json() );
}




export async function  turnAllOnOff(want)   {
    let bulbs = await dumpBulbStates();
    for (let ibulb in bulbs)  {
        setBulbOnOff(ibulb, want);
    }
}


</script>


<div class="whole">
<p>Hub {name} at {ipaddr}</p>
<p id="key">{key}</p>
<p class="technobabble">{mac}</p>
<div class="buttonbar">
    <div class="hubbutton"><button on:click={dumpBulbStates}>bulbdump</button></div>
    <div class="hubbutton"><button on:click={ () => turnAllOnOff(0) }>All OFF</button></div>
    <div class="hubbutton"><button on:click={ () => turnAllOnOff(1) }>All ON</button></div>
</div>
</div>


<style>
.whole  { 
    border: #263 solid 5px;  
    border-radius:0.7em; 
    background:#e6ffef;
    padding: .2rem;
    margin:2px;
    width:25rem;
    text-align: center;
}

.buttonbar {
    display: flex;
}
.hubbutton {
    padding:.013em;
    border:2px solid #263;
    border-radius:6px;
}


p { 
    margin-top:  .14rem; 
    margin-bottom: .14rem; 
}

#key  {
    font-size:0.85rem;
    color: #349;
}

.technobabble { 
    font-size:.75rem;
    color: #485;
}
</style>
