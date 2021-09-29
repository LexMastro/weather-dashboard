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
    return year + '/' + months + '/' + days;

}


let searchHistory = [];
let cityName = $("#cityname").val();

// Begin search by name input by user
$(document).ready(function () {
    $('#searchbtn').click(function (event) {
        event.preventDefault();
        $(".display").empty();
        createRow();
        cityName = $("#cityname").val();
        let longtitude;
        let latitude;


        if (cityName != "") {

            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric" + "&appid=45bb91d664f0e678d9a99e88e2efe20e",
                type: "GET",
                dataType: "jsonp",
                success: function (response) {
                    let iconcode = response.weather[0].icon;
                    let iconlink = "https://openweathermap.org/img/w/" + iconcode + ".png";
                    $(".citynamedisplay").text(response.name + " " + convertUnix(response.dt));
                    $('#wicon').attr('src', iconlink).remove("hide");
                    $(".temp").text(response.main.temp + " °C");
                    $(".humidity").text(response.main.humidity + " %");
                    $(".wind").text(response.wind.speed + " KM/H");
                    $(".uvindex").text(response.wind.speed + " UV Index");
                    longtitude = response.coord.lon;
                    latitude = response.coord.lat;

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
                            let date = $("<h3>").text(new Date(fiveDayWeather[i].dt).toLocaleDateString());
                            console.log(fiveDayWeather);
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

                    // display icon of appropriate weather

                    // display uv index using longtitude and latitude
                    let secondqueryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=45bb91d664f0e678d9a99e88e2efe20e&lat=" + latitude + "&lon=" + longtitude;
                    $.ajax({
                        url: secondqueryURL,
                        method: "GET",
                    }).then(function (response) {
                        $(".uvindex").text(response.value);
                        $(".uvindex").css("background-color", "crimson");
                        // $(".citynamedisplay").text(cityNameDisplay + " " + "(" + response.date_iso + ")");

                        $("#wicon").css("display", "block");
                    });
                }
            });
            // If user does not put a city name in input area
        } else {
            $("#error").html("Field cannot be empty");
        }

    });
});

// Create a list of locations that have been searched
let createRow = function () {
    let cityName = $("#cityname").val();
    let button = $("<button>").text(cityName);
    button.addClass("locationname list-group-item list-group-item-action");
    button.attr("type", "button");
    $(".location-list").prepend(button);
};



    // click on a city in the search history & take user back to city information
let searchHistoryCity = function() {

}



    //clear search history

