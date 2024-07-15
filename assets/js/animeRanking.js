document.addEventListener('DOMContentLoaded', function() {
    const animeListContainer = document.getElementById('anime-list');
    
    const query = `
      query ($page: Int) {
        Page(page: $page, perPage: 50) {
          media(type: ANIME, sort: SCORE_DESC) {
            id
            title {
              romaji
            }
            coverImage {
              medium
            }
            averageScore
          }
        }
      }
    `;
  
    function fetchAnimes(page) {
      return axios.post('https://graphql.anilist.co', {
        query,
        variables: { page }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })
      .then(response => response.data.data.Page.media)
      .catch(error => {
        console.error('Error fetching data:', error);
        return [];
      });
    }
    
  
    Promise.all([fetchAnimes(1), fetchAnimes(2)])
      .then(results => {
        const animeList = results.flat();
  
        animeList.forEach(anime => {
          const animeItem = document.createElement('div');
          animeItem.className = 'anime';
          
          const animeImage = document.createElement('img');
          animeImage.src = anime.coverImage.medium;
          animeItem.appendChild(animeImage);
          
          const animeTitle = document.createElement('h3');
          animeTitle.textContent = anime.title.romaji;
          animeItem.appendChild(animeTitle);
          
          const animeScore = document.createElement('p');
          animeScore.textContent = `Score: ${anime.averageScore}`;
          animeItem.appendChild(animeScore);
          
          animeListContainer.appendChild(animeItem);
        });
      });
  });
  