

require('dotenv').config();  //assigning weather api key and server port 

const express = require('express');
const Datastore = require('nedb');
const app = express();
const fs = require('fs')   //filesystem
//import fetch from 'node-fetch';
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;  //if not in process.env  it defaults 3000
app.listen( port, () => console.log(`listening at ${port}`)   )  ;
app.use(express.static('public')    );
app.use(express.json( {limit: '1mb'} ));   // without this like, request.body will be UNDEFINED , there are other options too

const database = new Datastore('database.db');
database.loadDatabase(); // load .db file  or create a new one if one doesnt exist
 
const navCoordinates = [];


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.post('/api' , (request, response) => {
       console.log('I got a request from /api!')
       console.log('request body ', request.body);
       navCoordinates.push( request.body );
      
       const data = request.body;
       data.timestamp = Date.now();
       
       console.log('data.timestamp ', data.timestamp)
       console.log( (new Date(data.timestamp)).toLocaleString() );

       database.insert({
              'lat' : data.lat,
              'long' : data.lon,
              'location' : data.location1,
              'time' : data.timestamp, 
              'summary': data.summary,
              'pm25' : data.aq_value,
              'weather' : data.weather,
       });
        
       console.log('database insert, request.body.weather: ', data.weather)
        


       addToFile( `${JSON.stringify(request.body)} \r\n`);
      

       response.json({
              status: 'success',
              timestamp: data.timestamp,
              latitude: request.body.latitude, 
              longitude: request.body.longitude ,
       })
       response.end();
  }) 
  

function addToFile(newLine) {
       if (fs.existsSync('files/navCoordinates.txt')) {
              console.log('file exists, adding up to a file');
              fs.appendFileSync('files/navCoordinates.txt', newLine);
        
            } else {
              console.log('file not found! file created');
              !fs.existsSync('files') ? fs.mkdirSync('files') : console.log('folder files exists, writing a new file')
              fs.writeFileSync('files/navCoordinates.txt', newLine);
            }
}


app.get('/apiLogs' , (request, response) => {
       console.log('I got a request from All!')
       console.log('request body ', request.body);
       

       // const records = database.find({ }, function (err, docs) {
       //        // docs is an array containing documents Mars, Earth, Jupiter
       //        // If no document is found, docs is equal to []
       //        console.log('docs ', docs);
       //        response.json(  docs );
       //      });

            const records = database.find({ }).exec(function (err, docs) {
              console.log('docs ', docs);
              response.json(  docs );
            });
       
});


app.get('/weather/:latlon' , async (request, response) =>  {
//app.get('/weather' , async (request, response) =>  {
       console.log('I got a request from wehather route !');
       console.log('request body ', request.body);
       
    console.log('req params ' ,request.params["latlon"] )
       var lat = request.params["latlon"].split(',')[0]; 
       var lon = request.params["latlon"].split(',')[1]; 
       

    try {   
       
       const apiKey= process.env.WEATHER_API_KEY;
       var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

       console.log('Will fetch work with: ',  weatherUrl )  
       var weatherResponse = await fetch(weatherUrl);
       var weatherData = await weatherResponse.json();
       console.log('openweathermap json cod: ', weatherData.cod,  ' typeof: ', typeof(weatherData.cod) );
      
       if ( JSON.stringify(weatherData.cod) === '401') {
              weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat.slice(0,5)}&longitude=${lon.slice(0,5)}&current_weather=true`;
              console.log('Will fetch work with 2: ',  weatherUrl )  
              weatherResponse = await fetch(weatherUrl);
              weatherData2 = await weatherResponse.json();
              console.log('open-meteo json : ', weatherData );
              console.log('open-meteo json cod: ', weatherData2.cod );
              
              weatherData = 
              {
                     "coord": {
                     "lon": weatherData2.latitude,
                     "lat": weatherData2.longitude
                     },
                     "weather": [
                     {
                     "id": null,
                     "main": "null",
                     "description": "null description",
                     "icon": "10d"
                     }
                     ],
                     "base": "stations",
                     "main": {
                     "temp": weatherData2.current_weather.temperature,
                     "feels_like": 298.74,
                     "temp_min": 297.56,
                     "temp_max": 300.05,
                     "pressure": 1015,
                     "humidity": 64,
                     "sea_level": 1015,
                     "grnd_level": 933
                     },
                     "visibility": 10000,
                     "wind": {
                     "speed": weatherData2.current_weather.windspeed,
                     "deg": weatherData2.current_weather.winddirection,
                     "gust": null
                     },
                     "rain": {
                     "1h": 3.16
                     },
                     "clouds": {
                     "all": 100
                     },
                     "dt": 1661870592,
                     "sys": {
                     "type": 2,
                     "id": 2075663,
                     "country": "null country",
                     "sunrise": null,
                     "sunset": null
                     },
                     "timezone": 7200,
                     "id": 3163858,
                     "name": "null city",
                     "cod": 200
              } 
       }
    } catch(error) {
       console.log(' DAS EINE ERROR  api.openweathermap.org !!!', error);

       var weatherDataNull = 
              {
                     "coord": {
                     "lon": lat,
                     "lat": lon
                     },
                     "weather": [
                     {
                     "id": null,
                     "main": "null",
                     "description": "null description",
                     "icon": "10d"
                     }
                     ],
                     "base": "stations",
                     "main": {
                     "temp": null,
                     "feels_like": 298.74,
                     "temp_min": 297.56,
                     "temp_max": 300.05,
                     "pressure": 1015,
                     "humidity": 64,
                     "sea_level": 1015,
                     "grnd_level": 933
                     },
                     "visibility": 10000,
                     "wind": {
                     "speed": null,
                     "deg": null,
                     "gust": null
                     },
                     "rain": {
                     "1h": 3.16
                     },
                     "clouds": {
                     "all": 100
                     },
                     "dt": 1661870592,
                     "sys": {
                     "type": 2,
                     "id": 2075663,
                     "country": "null country",
                     "sunrise": null,
                     "sunset": null
                     },
                     "timezone": 7200,
                     "id": 3163858,
                     "name": "null city",
                     "cod": 200
              }   
              weatherData = weatherDataNull;       
    }  //end of catch error
               
       

       const airUrl = `https://api.openaq.org/v2/latest?coordinates=${lat.slice(0,5)},${lon.slice(0,5)}&radius=25000&limit=4` ;
       console.log('Will air fetch work with: ',  airUrl )  
       const airResponse = await fetch(airUrl);
       var airData = await airResponse.json();
        if (airData.meta.found == '0') 
              {
                     console.log('No air quality data, increase radius');
                   
                    var airDataNull = {
                     results: [
                            {
                            "location": weatherData.name,
                            "city": null,
                            "country": weatherData.sys.country,
                            "coordinates": {
                            "latitude": lat,
                            "longitude": lon
                            },
                            "measurements": [
                            {
                            "parameter": "um100",
                            "value": "null",
                            "lastUpdated": "2022-12-18T19:00:10+00:00",
                            "unit": "particles/cm³"
                            },
                            {
                            "parameter": "um010",
                            "value": "null",
                            "lastUpdated": "2022-12-18T19:00:10+00:00",
                            "unit": "particles/cm³"
                            },
                            {
                            "parameter": "pm25",
                            "value": "null",
                            "lastUpdated": "2022-12-18T19:00:10+00:00",
                            "unit": "µg/m³"
                            },
                            {
                            "parameter": "pm1",
                            "value": "null",
                            "lastUpdated": "2022-12-18T19:00:10+00:00",
                            "unit": "µg/m³"
                            },
                            {
                            "parameter": "pm10",
                            "value": "null",
                            "lastUpdated": "2022-12-18T19:00:10+00:00",
                            "unit": "µg/m³"
                            },
                            {
                            "parameter": "um025",
                            "value": "null",
                            "lastUpdated": "2022-12-18T19:00:10+00:00",
                            "unit": "particles/cm³"
                            }
                            ]
                            }
                            ]
                     }
                     airData = airDataNull;
                     
                    }
               else  
              console.log('open Air quality Radius ok');

       const data = {
              weather: weatherData,
              airQuality: airData
       }
       response.json(data);
       console.log('json data: ', data)

       
});




