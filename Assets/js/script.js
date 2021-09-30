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
  let searches = JSON.parse(localStorage.getItem("searches")) || [];
  // add this city & don't let 2 of the same name save twice in local storage
  searches.push(searchTerm.toLowerCase());
  // add all data to local storage
  localStorage.setItem('searches', JSON.stringify(searches));

  console.log(searches)
}

function checkLocalStorage() {
  // get existing items in local storage
  let searches = JSON.parse(localStorage.getItem("searches")) || [];
  if (searches.length > 0) {
    // if there is existing data in the list
    // just get the unique names
    let uniqueSearches = [...new Set(searches)]
    for (let i = 0; i < uniqueSearches.length; i++) {
      // render the history dom elements
      createRow(uniqueSearches[i])
    }
  }
}

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
    // add api key & populate section with data
    const apiKey = "appid=45bb91d664f0e678d9a99e88e2efe20e"
    $.ajax({
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric" + "&" + apiKey,
      type: "GET",
      dataType: "json",
      success: function (response) {
        // create sections in the div for data to populate into
        let iconcode = response.weather[0].icon;
        let iconlink = "https://openweathermap.org/img/w/" + iconcode + ".png";
        $(".citynamedisplay").text(response.name + " " + convertUnix(response.dt));
        $('#wicon').attr('src', iconlink).remove("hide");
        $(".temp").text(response.main.temp + " °C");
        $(".humidity").text(response.main.humidity + " %");
        $(".wind").text(response.wind.speed + " KM/H");
        $("#uvindex").text(response.uvi + " UV Index");
        longtitude = response.coord.lon;
        latitude = response.coord.lat;

        let secondIcon;
        let thirdqueryURL = "https://api.openweathermap.org/data/2.5/onecall?appid=45bb91d664f0e678d9a99e88e2efe20e&lat=" + latitude + "&lon=" + longtitude;
        $.ajax({
          url: thirdqueryURL,
          method: "GET"
        }).then(function (response) {
          // only make 5 columns for the 5 day forecast & only grab the next 5 consecutive days
          let fiveDayWeather = response.daily.slice(1, 6);
          console.log(response.daily)
          for (let i = 0; i < fiveDayWeather.length; i = i + 1) {
            let newDiv = $("<div>");
            newDiv.addClass("col forecast");
            let date = $("<h3>").text(new Date(fiveDayWeather[i].dt * 1000).toDateString());
            secondIcon = fiveDayWeather[i].weather[0].icon;
            let secondIconlink = "https://openweathermap.org/img/w/" + secondIcon + ".png";
            let icon = $("<img>").attr('src', secondIconlink).remove("hide");;
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
          $("#uvindex").text(response.value);
          $("#wicon").css("display", "block");
          if (response.value <= 2) {
            // Display Green for favorable Uvi

            $("#uvindex").css("background-color", "green");

          } if (response.value >= 3 && response.value < 6) {
            // Display yellow for favorable-morderate Uvi

            $("#uvindex").css("background-color", "yellow");

          } else if (response.value >= 6 && response.value < 8) {
            // Display yellow for morderate-high Uvi
            console.log(response.value)
            $("#uvindex").css("background-color", "orange");

          } else if (response.value > 8) {
            // Display yellow for High Uvi

            $("#uvindex").css("background-color", "red");

          }
          console.log(response.value)
        });
      },
      error: function (error) {
        // if user types mistake
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