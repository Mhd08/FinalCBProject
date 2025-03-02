document.addEventListener('DOMContentLoaded', function() {
  // Fetch general news
  fetch('https://eventregistry.org/api/v1/article/getArticles?query=%7B%22%24query%22%3A%7B%22%24or%22%3A%5B%7B%22categoryUri%22%3A%22dmoz%2FArts%22%7D%2C%7B%22categoryUri%22%3A%22dmoz%2FBusiness%22%7D%2C%7B%22categoryUri%22%3A%22dmoz%2FComputers%22%7D%2C%7B%22categoryUri%22%3A%22dmoz%2FGames%22%7D%2C%7B%22categoryUri%22%3A%22dmoz%2FHealth%22%7D%2C%7B%22categoryUri%22%3A%22dmoz%2FHome%22%7D%2C%7B%22categoryUri%22%3A%22dmoz%2FRecreation%22%7D%2C%7B%22categoryUri%22%3A%22dmoz%2FScience%22%7D%2C%7B%22categoryUri%22%3A%22dmoz%2FShopping%22%7D%2C%7B%22categoryUri%22%3A%22dmoz%2FSports%22%7D%5D%7D%2C%22%24filter%22%3A%7B%22forceMaxDataTimeWindow%22%3A%2231%22%2C%22startSourceRankPercentile%22%3A0%2C%22endSourceRankPercentile%22%3A10%7D%7D&resultType=articles&articlesSortBy=rel&includeArticleOriginalArticle=true&apiKey=9e804046-0eab-4708-a9f2-4fa986faf807')
      .then(response => response.json())
      .then(data => {
          const articlesData = data.articles.results.slice(0, 21).map(article => ({
              title: article.title,
              body: article.body,
              image: article.image || 'Loading_icon.gif',
              originalUrl: article.originalArticle
          }));

          const gridContainer = document.querySelector('.grid-container');
          const staticContainer = document.getElementById('static-container');
          gridContainer.innerHTML = '';
          staticContainer.innerHTML = '';

          articlesData.forEach((article, index) => {
              const articleHTML = `
                  <div class="news-section">
                      <div class="news-image-container"><img src="${article.image}" style="width: 100%; overflow: hidden;"></div>
                      <h2>${article.title}</h2>
                      <p>${article.body.substring(0, 150)}...</p>
                      <a href="${article.originalUrl}" target="_blank"  class="news-section-url">Read More</a>
                  </div>
              `;

              if (index < 15) {
                  gridContainer.innerHTML += articleHTML;
              } else {
                  staticContainer.innerHTML += articleHTML;
              }
          });
      })
      .catch(error => console.error('Error fetching general news:', error));

  // Fetch disaster-related news
  fetch('https://eventregistry.org/api/v1/article/getArticles?query=%7B%22%24query%22%3A%7B%22categoryUri%22%3A%22dmoz%2FScience%2FEarth_Sciences%2FNatural_Disasters_and_Hazards%22%7D%2C%22%24filter%22%3A%7B%22forceMaxDataTimeWindow%22%3A%2231%22%7D%7D&resultType=articles&articlesSortBy=rel&includeArticleImage=true&includeConceptLabel=false&includeSourceTitle=false&apiKey=9e804046-0eab-4708-a9f2-4fa986faf807')
      .then(response => response.json())
      .then(data => {
          const disasterData = data.articles.results.slice(0, 2).map(article => ({
              title: article.title,
              body: article.body,
              image: article.image || 'Loading_icon.gif',
              originalUrl: article.url
          }));

          const disasterContainer = document.querySelector('.disaster-container');
          disasterContainer.innerHTML = '';

          disasterData.forEach(article => {
              const disasterHTML = `
                  <div class="disaster-section">
                      <div class="news-image-container"><img src="${article.image}" style="width: 100%; overflow: hidden;"></div>
                      <h2>${article.title}</h2>
                      <p>${article.body.substring(0, 150)}...</p>
                      <a href="${article.originalUrl}" target="_blank" class="news-section-url">Read More</a>
                  </div>
              `;
              disasterContainer.innerHTML += disasterHTML;
          });
      })
      .catch(error => console.error('Error fetching disaster news:', error));
});
