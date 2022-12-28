console.log('logs index.js is on.');


async function getData() {
  
  const response = await fetch('/apiLogs'  );   //also there is a route app.get  at the node server side
  const data = await response.json();
  console.log('data received /apiLogs: ', data)
  for (item of data) {
    console.log(item)
    printDivs(item);

    L.marker([item.lat, item.long])
    .bindPopup(`temp ${item.weather.temp}&deg; C. pm25 ${item.pm25} .<br> ${item.location}`)
    .openPopup()
    .addTo(mymap);
  }
  //console.log('data ', JSON.stringify(data));
 // document.getElementById("database").innerText = JSON.stringify(data, null, 2) ;
  
 mymap.addEventListener('mousemove', function(ev) {
  document.getElementById("coordinates").innerHTML = `Lat: ${ev.latlng.lat} °   Lon: ${ev.latlng.lng} °`;  
});


mymap.addEventListener('click', function(ev) {
  console.log(   ev.latlng   );  
  document.getElementById("inputLat").value = ev.latlng.lat;  
  document.getElementById("inputLon").value = ev.latlng.lng ;  
});




  console.log('2.5 Database Query is on.');
}   

getData();


function printDivs(item) {

  const root = document.createElement ('div');
  //root.setAttribute("id","root");
root.style.border = "1px solid";
root.style.maxWidth = "90%";
root.style.display = "flex";
root.style.justifyContent = "space-around"; 
//root.style.flexDirection

//("display:block; width:600px; border:1px;");
  
  const divLat = document.createElement('p');
  const divLon = document.createElement('p')
  const divLoc = document.createElement('p')
 
  const divTime = document.createElement('p')
  const divWeather = document.createElement('p')
  const divpm25 = document.createElement('p')

  divLat.innerHTML= ` latitude:<br>${item.lat}   ` ;
  divLon.innerHTML= ` longitude:<br>${item.long}   `;

  divLoc.innerHTML= `${item.location}`;
 
  const dateString = new Date( item.time).toLocaleString()  ;
  divTime.textContent= ` time: ${dateString}   `; 

  //divWeather.textContent= ` weather: ${ JSON.stringify(item.weather.temp) }   `;
 
 
   
      divWeather.innerHTML = `weather:<br>${ item.weather.temp} °C`;
 console.log('item.weather: ', item.weather.temp )

  divpm25.innerHTML= ` pm25:<br>${item.pm25} µg/m³  `;

  root.append( divLat, divLon, divLoc,  divTime,  divWeather, divpm25);

  document.body.append( root);

}


const  mymap = L.map('map').setView([0, 0], 1);
const attribution= '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, {maxZoom: 19, attribution} );
tiles.addTo(mymap);



    var circle = L.circle([51.508, -0.11], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
  }).addTo(mymap);