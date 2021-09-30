// const apiKey = "&appid=45bb91d664f0e678d9a99e88e2efe20e";

// function getForecastData(latitude, longtitude) {
//     const data = [];
//     let URL = "https://api.openweathermap.org/data/2.5/onecall?appid=45bb91d664f0e678d9a99e88e2efe20e&lat=" + latitude + "&lon=" + longtitude;
//     console.log(URL)
//     $.ajax({
//         url: URL,
//         method: "GET",
//         dataType: "json",
//         success: function (response) {
//             console.log(response);
//           const daily = (response.daily);

//           for (let i = 0; i < daily.length; i++) {
//             const date = daily[i].dt;
//             const wind = daily[i].wind_speed;
//             const humidity = daily[i].humidity;
//             const icon = "https://openweathermap.org/img/w/" + daily[i].weather[0].icon + ".png";
//             const uv = daily[i].uvi;

//             data.push({[date]: {wind, humidity, icon, uv}})
            
//           }
           
//         },
//         error: function (response) {
//             console.log(response);
//         }
        
// })
// return data }

// const d = getForecastData(-33.8679, 151.2073);
// console.log(d)

function convertUnix(unix_timestamp) {
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  let date = new Date(unix_timestamp * 1000);
  // Hours part from the timestamp
  let year = date.getFullYear();
  // Minutes part from the timestamp
  let months = date.getMonth() + 1;
  // Seconds part from the timestamp
  let days = date.getDate();

  // Will display time in 10:30:23 format
  return days + '/' + months + '/' + year;

}

function addToLocalStorage(searchTerm) {
  // get existing items in local storage
  var searches = JSON.parse(localStorage.getItem("searches")) || [];
  // add this city
  searches.push(searchTerm)
  // add all data to local storage
  localStorage.setItem('searches', JSON.stringify(searches));

  console.log(searches)
}

function checkLocalStorage() {
  // get existing items in local storage
  var searches = JSON.parse(localStorage.getItem("searches")) || [];
  if (searches.length > 0) {
    // if there is existing data in the list
    // just get the unique names
    let uniqueSearches = [...new Set(searches)]
    for (let i = 0; i < uniqueSearches.length; i++) {
      // render the history dom elements
      createRow(uniqueSearches[i])
  }
}}

// on page ready
$(document).ready(function () {
  // init cityName
  let cityName = "";

  // check for values in local storage to render on page
  checkLocalStorage()

  // if user clicks on previous search item
  $('#searches').on('click', function (event) {
    // clear current UI
    $(".display").empty();
    // get text from target
    let clickEvent = $(event.target)[0];
    cityName = clickEvent.innerText;
    // query weather api
    queryData()
  })


  // string.toLowerCase()
  // Goal: when adding to local storage, make sure Sydney and sydney are the same 'sydney'
  // Goal 2: in the create row function, make sure the text is nicely formatted
  // css text-transform

  // user searches via input
  $('#searchbtn').click(function (event) {
      event.preventDefault();
      
      // a new search has started, clear any error text
      $("#error").empty();

      // get name of the city
      cityName = $("#cityname").val();

      // if the input isn't empty
      if (cityName !== "") {
        // clear current UI
        $(".display").empty();

        // search for the city
        queryData()

         // save search term to local storage
         addToLocalStorage(cityName)

        // add search in history
         createRow(cityName);
      } else {
        // user didn't enter a value
        $("#error").html("Field cannot be empty");
      }
  })

  // remove local storages items if button clicked
  $('#clearSearch').click(function () {
    // clear storage
    localStorage.clear()
    // clear UI 
    $(".location-list").empty()

    console.log('Local storage cleared!')
  })

  // call weather api for data
  function queryData() {
    const apiKey = "appid=45bb91d664f0e678d9a99e88e2efe20e"
    $.ajax({
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric" + "&" + apiKey,
      type: "GET",
      dataType: "json",
      success: function (response) {
        let iconcode = response.weather[0].icon;
        let iconlink = "https://openweathermap.org/img/w/" + iconcode + ".png";
        $(".citynamedisplay").text(response.name + " " + convertUnix(response.dt));
        $('#wicon').attr('src', iconlink);
        $(".temp").text(response.main.temp + " °C");
        $(".humidity").text(response.main.humidity + " %");
        $(".wind").text(response.wind.speed + " KM/H");
        $(".uvindex").text(response.coord + " UV Index");
        longtitude = response.coord.lon;
        latitude = response.coord.lat;
        console.log(response);

        let secondIcon;
        // display weather forecast of 5 days
        let thirdqueryURL = "https://api.openweathermap.org/data/2.5/onecall?appid=45bb91d664f0e678d9a99e88e2efe20e&lat=" + latitude + "&lon=" + longtitude;
        $.ajax({
            url: thirdqueryURL,
            method: "GET"
        }).then(function (response) {

            let fiveDayWeather = response.daily.slice(-5);
            for (let i = 0; i < fiveDayWeather.length; i = i + 1) {
                let newDiv = $("<div>");
                newDiv.addClass("col forecast");
                let date = $("<h3>").text(new Date (fiveDayWeather[i].dt * 1000).toDateString());
                secondIcon = fiveDayWeather[i].weather[0].icon;
                let secondIconlink = "https://openweathermap.org/img/w/" + secondIcon + ".png";
                let icon = $("<img>").attr('src', secondIconlink);
                let temp = $("<p>").text("Temperature: " + (fiveDayWeather[i].temp.day - 273.15).toFixed(2) + " °C");
                let wind = $("<p>").text("Wind Speed: " + fiveDayWeather[i].wind_speed + " KM/H");
                let humidity = $("<p>").text("Humidity: " + fiveDayWeather[i].humidity + " %");
                let uvindex = $("<p>").text("UV Index: " + fiveDayWeather[i].uvi);

                newDiv.append(date, icon, temp, humidity, wind, uvindex);
                $(".display").append(newDiv);
            };           
        });

        // display uv index using longtitude and latitude
        
        let secondqueryURL = "https://api.openweathermap.org/data/2.5/uvi?" + apiKey + "&lat=" + latitude + "&lon=" + longtitude;
        $.ajax({
            url: secondqueryURL,
            method: "GET",
        }).then(function (response) {

          if (response <= 2) {
            // Display Green for favorable Uvi
            document.getElementsByClassName("uvindex").style.backgroundColor = "green";

          } if (response >= 3 && response < 6) {
            // Display orange for morderate Uvi
           
            document.getElementsByClassName("uvindex").style.backgroundColor = "yellow";
         
          } else if (response>= 6 && response< 8){
            
            document.getElementsByClassName("uvindex").style.backgroundColor = "orange";
           
          } else if (response > 8) {
            
            document.getElementsByClassName("uvindex").style.backgroundColor = "red";
            
          }
            
        });
      },
      error: function (error) {
        $("#error").html("No city found");
      }
    });
  }
});

// Create a list of locations that have been searched
let createRow = function (cityName) {
  let button = $("<button>").text(cityName);
  button.addClass("locationname list-group-item list-group-item-action");
  button.attr("type", "button");
  $(".location-list").prepend(button);
};