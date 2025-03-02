// NewsAPI

document.addEventListener("DOMContentLoaded", function () {
    const newsSection = document.querySelector(".news-section");
    const apiUrl = "https://eventregistry.org/api/v1/article/getArticles?query=%7B%22%24query%22%3A%7B%22categoryUri%22%3A%22dmoz%2FScience%2FEarth_Sciences%2FNatural_Disasters_and_Hazards%22%7D%2C%22%24filter%22%3A%7B%22forceMaxDataTimeWindow%22%3A%2231%22%7D%7D&resultType=articles&articlesSortBy=rel&includeArticleImage=true&includeConceptLabel=false&includeSourceTitle=false&apiKey=9e804046-0eab-4708-a9f2-4fa986faf807";

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const articlesData = data.articles.results.slice(0, 4).map(article => ({
                title: article.title,
                body: article.body,
                image: article.image || 'loading',
                originalUrl: article.url
            }));

            newsSection.innerHTML = "";

            articlesData.forEach(article => {
                const articleHTML = `
                    <div class="news-article">
                        <div class="news-image-container"><img src="${article.image}" style="width: 100%; overflow: hidden;"></div>
                        <h3>${article.title}</h3>
                        <p>${article.body.slice(0, 150)}...</p>
                        <a href="${article.originalUrl}" target="_blank" class="news-section-url">Read More</a>
                    </div>
                `;
                newsSection.innerHTML += articleHTML;
            });
        })
        .catch(error => console.error('Error fetching news articles:', error));
});


// Weather API

const apiKey = '3fa0a279dba62b4b71af1f6abe7adf32';
const city = 'Beirut';

function convertKtoC(k) {
    return Math.round(k - 273.15);
}

function formatTime(timestamp, timezone) {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getDailyForecast(list, timezone) {
    const dailyData = {};
    list.forEach(entry => {
        const date = new Date((entry.dt + timezone) * 1000);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'long' });
        
        if (!dailyData[dateStr]) {
            dailyData[dateStr] = {
                min: entry.main.temp_min,
                max: entry.main.temp_max,
                conditions: [],
                humidity: []
            };
        }
        
        dailyData[dateStr].min = Math.min(dailyData[dateStr].min, entry.main.temp_min);
        dailyData[dateStr].max = Math.max(dailyData[dateStr].max, entry.main.temp_max);
        dailyData[dateStr].conditions.push(entry.weather[0].main);
        dailyData[dateStr].humidity.push(entry.main.humidity);
    });
    return dailyData;
}

function updateWeatherUI(data) {
    // Update Hourly Forecast
    const hourlyContainer = document.getElementById('hourly-forecast');
    hourlyContainer.innerHTML = data.list.slice(0, 3).map(entry => `
        <div class="forecast">
            <h3>${formatTime(entry.dt, data.city.timezone)}</h3>
            <p>${convertKtoC(entry.main.temp)}°C</p>
            <img src="https://openweathermap.org/img/wn/${entry.weather[0].icon}.png" alt="${entry.weather[0].description}">
        </div>
    `).join('');

    // Update Weekly Forecast
    const dailyForecast = getDailyForecast(data.list, data.city.timezone);
    const weeklyContainer = document.getElementById('weekly-forecast');
    weeklyContainer.innerHTML = Object.entries(dailyForecast).slice(0, 5).map(([day, info]) => `
        <div class="forecast">
            <h3>${day}</h3>
            <div class="details-container">
                <div class="temp-section">
                    <p class="morning-temp">↑${convertKtoC(info.max)}°C</p>
                    <p class="night-temp">↓${convertKtoC(info.min)}°C</p>
                </div>
                <p class="humidity">Humidity: ${Math.round(info.humidity.reduce((a,b) => a+b)/info.humidity.length)}%</p>
                <div class="weather-description">
                    <p class="description">${[...new Set(info.conditions)].join(', ')}</p>
                    <img class="weather-icon" src="https://openweathermap.org/img/wn/${data.list.find(e => new Date(e.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }) === day).weather[0].icon}.png">
                </div>
            </div>
        </div>
    `).join('');
}

fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
    .then(response => response.json())
    .then(updateWeatherUI)
    .catch(error => console.error('Error loading weather data:', error));
