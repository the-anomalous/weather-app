const api = {
    url: 'https://api.openweathermap.org/' ,
    key: '45437dc27c521aa6120c0a8745c568e2'
};

const searchBox = document.getElementById('search_box'),
    searchButton = document.getElementById('search_btn'),
    days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function changeImages(temp){
    const roundTemp = Math.round(temp - 273.15)
    const bgImg = document.getElementsByTagName('body')[0].style

    if (roundTemp < 10){
        bgImg.backgroundImage = "url('images/cold1.jpg')"
    } 
    else if (roundTemp >= 10 && roundTemp <= 20){
        bgImg.backgroundImage = "url('images/cold.jpg')"
    }
    else{
        bgImg.backgroundImage = "url('images/sunny.jpg')"
    }
}

function displayData(data) {
    if (document.querySelector('.error')) {
        document.querySelector('.error').remove();
    }
    document.querySelector('.success').style.display = 'block';

    const loc = document.querySelector('.location span');
    loc.textContent = `${data.name}, ${data.sys.country}`

    const currentDate = document.querySelector('.date span')
    const date = new Date();
    currentDate.textContent = `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`

    const currentTemp = document.querySelector('.temp')
    currentTemp.innerHTML = `${Math.round(data.main.temp - 273.15)}<span>°c</span>`
    changeImages(data.main.temp);

    const description = document.querySelector('.weather span')
    description.textContent = data.weather[0].description

    const hi_low = document.querySelector('.hi-low span')
    hi_low.textContent = Math.round(data.main.temp_min - 273.15) + '°c / ' + Math.round(data.main.temp_max - 273.15) + '°c'
}

function networkError(err, description) {
    document.querySelector('.success').style.display = 'none';
    
    if (document.querySelector('.error')) {
        document.querySelector('.error').remove();
    }

    const server = document.createElement('div');
    server.className = 'network error';
    server.innerHTML = `${err}<span class="description">${description}</span>`;
    
    document.querySelector('#data').appendChild(server);
}

function fetchData(query) {
    fetch(`${api.url}data/2.5/weather?q=${query}&appid=${api.key}`) 
    .then(response => {
        if (response.status === 200) {
            return response.json()
        }
    })
    .then(data => displayData(data))
    .catch(err => {
        if (err.message === 'Failed to fetch') {
            networkError('Could not connect to server', 'Please check your internet connection')
        }
        else{
            networkError('City not found', '')
        }
    })
}

function searchQuery(event) {
    if (event.keyCode == 13) {
        fetchData(searchBox.value)
    }
}

searchBox.addEventListener('keypress', searchQuery)
searchButton.addEventListener('click', function(){
    fetchData(searchBox.value)
})