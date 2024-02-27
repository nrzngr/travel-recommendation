
document.addEventListener('DOMContentLoaded', async function () {
    const searchForm = document.querySelector('.search-form');
    const searchBtn = document.getElementById('search');
    const clearBtn = document.getElementById('clear');
    const result = document.getElementById('result');
    const placeInput = document.getElementById('place');
    let jsonData;
  
    try {
        const res = await fetch('travel_recommendation_api.json');
        jsonData = await res.json();
    } catch (err) {
        console.error('Error:', err);
        result.innerHTML = 'An error occurred while fetching data.';
    }
  
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const place = placeInput.value.trim().toLowerCase();
        if (place) {
            clearResult();
            await displayRecommendations(place);
        }
    });
  
    clearBtn.addEventListener('click', clearResult);
  
    function clearResult() {
        result.innerHTML = '';
    }
  
    async function displayRecommendations(key) {
        let recommendations = [];
  
        const country = jsonData.countries.find(
            (item) => item.name.toLowerCase() === key
        );
        if (country) {
            recommendations = country.cities;
        } else {
            // Check for other keywords
            switch (key) {
                case 'beach':
                case 'beaches':
                    recommendations = jsonData.beaches;
                    break;
                case 'temple':
                case 'temples':
                    recommendations = jsonData.temples;
                    break;
                default:
                    result.innerHTML = 'No recommendations found for the keyword.';
                    return;
            }
        }
  
        recommendations.forEach((recommendation) => {
            const element = document.createElement('div');
            element.classList.add('recommendation');
            const timeZone = recommendation.timeZone;
  
            const options = {
                timeZone: timeZone,
                hour12: true,
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            };
            const localTime = new Date().toLocaleTimeString('en-US', options);
            const timeElement = document.createElement('p');
            timeElement.textContent = `Local Time: ${localTime}`;
            timeElement.classList.add('localTime');
  
            const imgElement = document.createElement('img');
            imgElement.classList.add('img-place');
            imgElement.src = recommendation.imageUrl;
            imgElement.alt = recommendation.name;
  
            const nameElement = document.createElement('h3');
            nameElement.textContent = recommendation.name;
            nameElement.classList.add('nameHeader');
  
            const paraElement = document.createElement('p');
            paraElement.textContent = recommendation.description;
            paraElement.classList.add('description');
  
            const visitElement = document.createElement('button');
            visitElement.textContent = 'Visit';
            visitElement.classList.add('visit');
  
            element.appendChild(timeElement);
            element.appendChild(imgElement);
            element.appendChild(nameElement);
            element.appendChild(paraElement);
            element.appendChild(visitElement);
  
            result.appendChild(element);
        });
    }
  });