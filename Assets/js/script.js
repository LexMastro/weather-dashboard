
// Begin search by name input by user
$(document).ready(function () {
    $('#searchbtn').click(function (event) {
        event.preventDefault();
        $(".display").empty();
        createRow();
        let = cityName = $("#cityname").val();
        let longtitude;
        let latitude;
        let iconcode;

        if (cityName != "") {

            $.ajax({
                url: "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric" + "&APPID=45bb91d664f0e678d9a99e88e2efe20e",
                type: "GET",
                dataType: "jsonp",
                success: function(response) {
                    cityNameDisplay = response.name;
                    iconcode = response.weather[0].icon;
                    $(".temp").text(response.main.temp + " °C");
                    $(".humidity").text(response.main.humidity + " %");
                    $(".wind").text(response.wind.speed + " KPH");
                    $(".uvindex").text(response.wind.speed + " UV Index");
                    longtitude = response.coord.lon;
                    latitude = response.coord.lat;

                // display icon of appropriate weather
                let iconlink = "https://openweathermap.org/img/w/" + iconcode + ".png";
                // display uv index using longtitude and latitude
                let secondqueryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=45bb91d664f0e678d9a99e88e2efe20e&lat=" + latitude + "&lon=" + longtitude;
                $.ajax({
                    url: secondqueryURL,
                    method: "GET"
                }).then(function (response) {
                    $(".uvindex").text(response.value);
                    $(".uvindex").css("background-color", "crimson");
                    $(".cityNameDisplay").text(cityNameDisplay + " " + "(" + response.date_iso + ")");
                    $('#wicon').attr('src', iconlink);
                    $("#wicon").css("display", "block");
                });
            }});
            // If user does not put a city name in input area
        } else {
            $("#error").html("Field cannot be empty");
        }

                    let secondIcon;
                    // display weather forecast of 5 days
                    let thirdqueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&units=metric" + "&APPID=45bb91d664f0e678d9a99e88e2efe20e";
                    $.ajax({
                        url: thirdqueryURL,
                        method: "GET"
                    }).then(function (response) {
        
                        let fiveDayWeather = response.list;
                        for (let i = 0; i < fiveDayWeather.length; i = i + 8) {
                            let newDiv = $("<div>");
                            newDiv.addClass("col forecast");
                            secondIcon = fiveDayWeather[i].weather[0].icon;
                            let secondIconlink = "https://openweathermap.org/img/w/" + secondIcon + ".png";
                            let date = $("<h3>").text(fiveDayWeather[i].dt_txt);
                            let icon = $("<img>").attr('src', secondIconlink);
                            let temp = $("<p>").text("Temperature: " + fiveDayWeather[i].main.temp + " °C");
                            let humidity = $("<p>").text("Humidity: " + fiveDayWeather[i].main.humidity + " %");
        
                            newDiv.append(date, icon, temp, humidity);
                            $(".display").append(newDiv);
                        };
                    });
        
                });
            });

    // Create a list of locations that have been searched
    let createRow = function () {
        let = cityName = $("#cityname").val();
        let button = $("<button>").text(cityName);
        button.addClass("locationname list-group-item list-group-item-action");
        button.attr("type", "button");
        $(".location-list").prepend(button);
    };


    