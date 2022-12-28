


               var lat = 0; //52.2298
               var lon = 0;  //21.0118
               var location1 = 'location';
               var summary ='nice';
               var aq_value = '1';
               var weather;


               const  mymap = L.map('map').setView([0, 0], 1);
               const attribution= '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
               const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
               const tiles = L.tileLayer(tileUrl, {maxZoom: 19, attribution} );
               tiles.addTo(mymap);

       
          if ("geolocation" in navigator) {
           /* geolocation is available */
           console.log('geolocation available');
       
           navigator.geolocation.getCurrentPosition( async position => {
                   
              
               // Show a map centered at latitude / longitude.
               lat = position.coords.latitude;
               lon = position.coords.longitude;
               //var marker = L.marker([lat, lon]).addTo(mymap);

               var circle = L.circle([lat, lon], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 500
            }).addTo(mymap);
              
               document.getElementById('latitude').innerText= lat;
               document.getElementById('longitude').innerText= lon;
               document.getElementById("inputLat").value = lat;  
               document.getElementById("inputLon").value = lon;  


               const apiUrl = `weather/${lat},${lon}`;
         
               const response = await fetch(apiUrl);
               const json = await response.json();
               console.log('json weather: ',json);

               try {
               document.getElementById('chuckJoke').innerText =  JSON.stringify(json.airQuality.results[0].measurements, null, 2 ) 
                        
               var measurementsArr = json.airQuality.results[0].measurements;

 
              //  console.log('measurementsArr ', measurementsArr)
              //  console.log('pm 25 index of: ', filterIt(measurementsArr, 'pm25' )   )
              //  console.log('pm 10 index of: ', filterIt(measurementsArr, 'pm10' )   )
               var indOfpm25 = filterIt(measurementsArr, 'pm25' );
               if (indOfpm25 === null)  {indOfpm25 =0;  console.log('NO PM25 READING !!')};

                location1 = `${json.airQuality.results[0].location}<br>${json.airQuality.results[0].country}`;
               
             

                summary = json.weather.weather[0]["description"];
                aq_value = json.airQuality.results[0].measurements[indOfpm25].value;
                weather = json.weather.main;
                
                console.log('weather json: ', json);
                console.log('weather main: ', weather);
               
                let lastUpdated = json.airQuality.results[0].measurements[indOfpm25].lastUpdated
           
           
               document.getElementById('temperature').innerText= `${json.weather.main.temp}`;
               document.getElementById('summary').innerText= `${json.weather.weather[0]["description"]}`;
               document.getElementById('aq_parameter').innerText= `${json.airQuality.results[0].measurements[indOfpm25].parameter}`;
               document.getElementById('aq_value').innerText= `${json.airQuality.results[0].measurements[indOfpm25].value}`;
               document.getElementById('aq_units').innerText= `${json.airQuality.results[0].measurements[indOfpm25].unit}`;
               document.getElementById('aq_date').innerText= `${lastUpdated.split('T')[0]} at ${lastUpdated.split('T')[1].split('+')[0]} o'clock`;
               document.getElementById('aq_location').innerText= `${json.airQuality.results[0].location}, ${json.airQuality.results[0].country}`;

              } 
              catch(error) {
                console.error('DAS ERROR', error);
               aq_value = -1;
                document.getElementById('aq_value').innerText= 'NO READING';
                document.getElementById('chuckJoke').innerText =  'open AQ - NO READING ';
  
              }

               console.log('position object: ',position)
       

            });
       
          
          
          
          } else {
           /* geolocation is not available */
          }
       



          
      async function sendGeolocation() {
        console.log('sendGeolocation click');
         const data = { lat, lon, location1, summary, aq_value, weather};
       // const data = { lat, lon };

        const options2 = {
          method: 'POST',
          headers: { "Content-Type": "application/json", },
          body: JSON.stringify(data),
          };

          
        const response = await fetch('/api', options2);
        const data2 = await response.json();
     
        console.log( 'data2 response from NODE: ', data2 );


      }
          
       //when a response comes back after a Fetch call , it comes in as a data stream
       //So it's up to you to specify how you want to read that,
       // is it a text, is it a blob, is it json,  and we want Json object
       
       // changing function to    .getCurrentPosition(async position => {  na ASYNC
       // to add: AWAIT ,  const response = await fetch
       
       
       const submitButton = document.getElementById('submitButton');
       submitButton.addEventListener('click', sendGeolocation, false);



const fetchWeather = (lat,lon) => {
  apiUrl = `weather/${lat},${lon}`;
  console.log('Will fetch work with: ',  apiUrl )

  fetch(apiUrl) 
       .then(res => {
        return res.json()
   })
   .then(data => {
    document.getElementById('chuckJoke').innerText =  JSON.stringify(data, null, 2 ) 
    console.log('openweather data this: ', data)

      // let opts = {timeZone:'Europe/Warsaw', timeZoneName:'short', hour12:false};
      // let sunrise = new Date(data["sys"]["sunrise"] * 1000).toLocaleString('en-CA', opts)
      // let sunset = new Date(data["sys"]["sunset"] * 1000).toLocaleString('en-CA', opts)
      
      // console.log(`Sunrise: ${sunrise}\n` +
      //             `Sunset : ${sunset.split(' ')[1]}\n` +
      //             `Temperature: ${data.main.temp}`);


        measurementsArr = data.airQuality.results[0].measurements;
        indOfpm25 = filterIt(measurementsArr, 'pm25' );
        if (indOfpm25 === null)  {indOfpm25 =0;  console.log('NO PM25 READING !!')};

   
      document.getElementById('temperature').innerText= `${data.weather.main.temp}`;
      document.getElementById('summary').innerText= `${data.weather.weather[0]["description"]}`;
      document.getElementById('aq_parameter').innerText= `${data.airQuality.results[0].measurements[indOfpm25].parameter}`;
      document.getElementById('aq_value').innerText= `${data.airQuality.results[0].measurements[indOfpm25].value}`;
      document.getElementById('aq_units').innerText= `${data.airQuality.results[0].measurements[indOfpm25].unit}`;
      document.getElementById('aq_date').innerText= `${data.airQuality.results[0].measurements[indOfpm25].lastUpdated}`;
      document.getElementById('aq_location').innerText= `${data.airQuality.results[0].location}, ${data.airQuality.results[0].country}`;
 
       
      location1 = `${data.airQuality.results[0].location}, ${data.airQuality.results[0].country}`; 
      summary = `${data.weather.weather[0]["description"]}`;
      aq_value = `${data.airQuality.results[0].measurements[indOfpm25].parameter}`;
      weather = data.weather.main;
      console.log(' data.weather.main: ',  data.weather.main)

   })
   .catch(error => console.log('fetchWeather ERROR'))

  
  


}




  
  //  axios.get(apiUrl)
  //   .then( response => {
  //     console.log('axios response: ', response.data )
      
  //     let opts = {timeZone:'Europe/Warsaw', timeZoneName:'short', hour12:false};
  //     let sunrise = new Date(response.data["sys"]["sunrise"] * 1000).toLocaleString('en-CA', opts)
  //     let sunset = new Date(response.data["sys"]["sunset"] * 1000).toLocaleString('en-CA', opts)
      
  //     console.log(`Sunrise: ${sunrise}\n` +
  //                 `Sunset : ${sunset.split(' ')[1]}`);

  //   })
  //   .catch( (error) => console.log(error));




  const filterIt = (arr, searchKey) => {
    let ind = null;
       arr.forEach( obj => {
        
        Object.values(obj).indexOf(searchKey)!=-1 ? 
        
          ind = arr.indexOf(obj)  
        : 
        
         { } //console.log('check the next object for: ', searchKey);
        
     })
  
     return ind;
  
    }
      




  
  //console.log('data ', JSON.stringify(data));
 // document.getElementById("database").innerText = JSON.stringify(data, null, 2) ;
  




 mymap.addEventListener('mousemove', function(ev) {
  document.getElementById("database").innerHTML = `Lat: ${ev.latlng.lat} °   Lon: ${ev.latlng.lng} °`;  
});


mymap.addEventListener('click', function(ev) {
  console.log(   ev.latlng   );  
  document.getElementById("inputLat").value = ev.latlng.lat;  
  document.getElementById("inputLon").value = ev.latlng.lng ;  
  lat = ev.latlng.lat;  
  lon = ev.latlng.lng ;  
  fetchWeather(lat,lon);

});







