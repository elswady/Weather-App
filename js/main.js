const searchInput = document.getElementById('searchInput')
const btn = document.getElementById('btn')

navigator.geolocation.getCurrentPosition(
    function(position){
        let latitude = position.coords.latitude
        let longitude = position.coords.longitude
        getLocation(latitude, longitude)
    },
    function(){
        window.alert('Error getting location')
    }
)

async function getLocation(lat, long){
    const locationUrl = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=703a33cf0de04a7d9a462b4053262b58`)
    const locationResult = await locationUrl.json()
    getWeatherData(locationResult.results[0].components._normalized_city)
}

searchInput.addEventListener('input',function(e){
    getWeatherData(e.target.value)
})
btn.addEventListener('click',function(e){
    e.preventDefault()
    getWeatherData(searchInput.value)
})

async function getWeatherData(location) {
    const weatherUrl = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=ecfff99d34a348af80a150552250707&q=${location}&days=3&aqi=no&alerts=yes`);
    const weatherResult = await weatherUrl.json()
    displayWeather(weatherResult)
}
const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function displayWeather(data){

    const d = data.current.last_updated;
    const fixedDate = d.replace(" ","T")
    const date = new Date(fixedDate);
    const dayName = days[date.getDay()]
    const dayNum = date.getDate()
    const monthName = months[date.getMonth()]

    const d2 = data.forecast.forecastday[1].date;
    const secondDate = new Date(d2);
    const secondDayName = days[secondDate.getDay()]

    const d3 = data.forecast.forecastday[2].date;
    const thirdDate = new Date(d3);
    const thirdDayName = days[thirdDate.getDay()]

    let weatherData =`
        <div class="current-day col-lg-4 col-12">
            <div class="date-part d-flex justify-content-between">
                <div class=""><p>${dayName}</p></div>
                <div class=""><p>${dayNum+monthName}</p></div>
            </div>
            <div class="weather-part p-4">
                <p class="city-name">${data.location.name}</p>
                <h2>${data.current.temp_c}°C</h2>
                <span class="time-icon"
                  ><img src="https:${data.current.condition.icon}" alt=""
                /></span>
                <p class="weather">${data.current.condition.text}</p>
                <div class="winds-data d-flex gap-4">
                    <div>
                        <span
                            ><img src="images/imgi_3_icon-umberella.webp" alt="" />
                            20%</span
                        >
                    </div>
                    <div>
                        <span
                            ><img src="images/imgi_4_icon-wind.webp" alt="" />
                            18km/h</span
                        >
                    </div>
                    <div>
                        <span
                            ><img src="images/imgi_5_icon-compass.png" alt="" />
                            East</span
                        >
                    </div>
                </div>
            </div>
        </div>
        <div class="next-day col-lg-4 col-12 text-center">
            <div class="next-day-head"><p>${secondDayName}</p></div>
            <div class="next-day-body">
                <div class="mt-5">
                    <span><img src="https:${data.forecast.forecastday[1].day.condition.icon}" alt="" /></span>
                    <h3>${data.forecast.forecastday[1].day.maxtemp_c}°C</h3>
                    <h6>${data.forecast.forecastday[1].day.mintemp_c}°</h6>
                    <p>${data.forecast.forecastday[1].day.condition.text}</p>
                </div>
            </div>
        </div>
        <div class="after-next-day col-lg-4 col-12 text-center">
            <div class="after-dat-head">
                <p>${thirdDayName}</p>
            </div>
            <div class="next-day-body">
                <div class="mt-5">
                    <span><img src="https:${data.forecast.forecastday[2].day.condition.icon}" alt="" /></span>
                    <h3>${data.forecast.forecastday[2].day.maxtemp_c}°C</h3>
                    <h6>${data.forecast.forecastday[2].day.mintemp_c}°</h6>
                    <p>${data.forecast.forecastday[2].day.condition.text}</p>
                </div>
            </div>
        </div>
        `
    document.getElementById('weatherContent').innerHTML= weatherData
}