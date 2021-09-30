const apiKey = "&appid=45bb91d664f0e678d9a99e88e2efe20e";

function getForecastData(latitude, longtitude) {
    const data = [];
    let URL = "https://api.openweathermap.org/data/2.5/onecall?appid=45bb91d664f0e678d9a99e88e2efe20e&lat=" + latitude + "&lon=" + longtitude;
    console.log(URL)
    $.ajax({
        url: URL,
        method: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response);
          const daily = (response.daily);

          for (let i = 0; i < daily.length; i++) {
            const date = daily[i].dt;
            const wind = daily[i].wind_speed;
            const humidity = daily[i].humidity;
            const icon = "https://openweathermap.org/img/w/" + daily[i].weather[0].icon + ".png";
            const uv = daily[i].uvi;

            data.push({[date]: {wind, humidity, icon, uv}})
            
          }
           
        },
        error: function (response) {
            console.log(response);
        }
        
})
return data }

const d = getForecastData(-33.8679, 151.2073);
console.log(d)