// EUROPEAN CITIES
const cities = [
    new City('Barcelona', 41.23, 2.1),
    new City('Dublin', 53.20, -6.15),
    new City('Kijów', 50.27, 30.31),
    new City('Kopenhaga', 55.40, 12.34),
    new City('Madryt', 40.24, -3.41),
    new City('Lizbona', 38.43, -9.08),
    new City('Londyn', 51.30, .1),
    new City('Oslo', 59.54, 10.45),
    new City('Paryż', 48.51, 2.21),
    new City('Rzym', 41.53, 12.28),
    new City('Warszawa', 52.14, 21)
]

let stars = [
    starA = {
        cityIndex: 0,
        marker: null
    },
    starB = {
        cityIndex: 1,
        marker: null
    },
    starC = {
        cityIndex: 2,
        marker: null
    }
];

// HTML BUTTONS
document.querySelector('.next').addEventListener('click', goToPlayerCreator)
document.querySelector('.start-game').addEventListener('click', startGame)
document.querySelector('.icon').addEventListener('click', getRandomIcon)
document.querySelector('.chat-submit').addEventListener("click", sendMessage);
const chatWindow = document.querySelector('.chat-window');
let otherPlayers = {};

// create a player
const player = {
    initDate: Date.now(),
    name: null,
    iconNum: null,
    iconUrl: null,
    marker: null,
    coords: {
        lat: 50,
        lng: 0
    },
    score: 0,
    speed: .1,
    dir: {
        x: 1,
        y: 0
    }
}

function getRandomIcon() {
    const randomNum = Math.floor(Math.random() * 6);

    if (randomNum !== player.iconNum) {
        player.iconNum = randomNum;
        player.iconUrl = `./img/${player.iconNum}.svg`;
        // show icon in player selector
        document.querySelector('.icon').src = player.iconUrl;
    } else {
        //number was repeated
        getRandomIcon();
    }
}

function getRandomCity() {
    const randomNum = Math.floor(Math.random() * cities.length);
    let isRepeated = false;

    stars.forEach(star => {
        if (star.cityIndex === randomNum) {
            isRepeated = true;
        }
    })

    if (isRepeated) return getRandomCity();

    return randomNum;
}

function displayScore() {
    document.querySelector('.score').textContent = player.score;
}

function checkScoring() { //check if player touches any star

    //get current position
    const lat = player.marker.getPosition().lat();
    const lng = player.marker.getPosition().lng();

    stars.forEach(star => {
        const i = star.cityIndex;
        if (((Math.abs(lat - cities[i].coords.lat)) < 1) &&
            (Math.abs(lng - cities[i].coords.lng)) < 1) {

            // replace collected star with a new one
            star.cityIndex = getRandomCity();
            star.marker.setPosition(new google.maps.LatLng(cities[star.cityIndex].coords));

            //get a point
            player.score++;
            displayScore();

            //send a message to the chat
            const visitedCity = cities[i].name;
            const newCityName = cities[star.cityIndex].name;
            const message = {
                star: visitedCity,
                player: player.name,
                newStar: newCityName
            };
            ws.send(JSON.stringify(message));

            //send updated star locations
            let cityIndexes = [];
            stars.forEach(star => {
                cityIndexes.push(star.cityIndex)
            })
            ws.send(JSON.stringify({
                updateStars: true,
                cityIndexes: cityIndexes
            }));
        }
    })
}

function goToPlayerCreator() {
    // hide game rules
    document.querySelector('.rules').style.display = 'none';
    // show player creator
    document.querySelector('.player-creator').style.display = 'block';
    // get a random icon
    getRandomIcon();
}

function startGame() {
    //read name from input
    const name = document.querySelector('.name-input').value;

    // set player's name
    player.name = (name) ? name : "gracz";

    // hide intro
    document.querySelector('.intro').style.display = 'none';

    // show google map and hud
    document.querySelector('.google-map').style.display = 'block';
    document.querySelector('.hud').style.display = 'block';

    //create the player's marker
    player.marker = createMarker(player.iconUrl, player.coords);

    //create 3 stars
    stars.forEach(star => {
        star.cityIndex = getRandomCity();
        star.marker = createMarker('./img/star.svg', cities[star.cityIndex].coords);
    })

    //display number of points
    displayScore();

    // start listening for control inputs
    window.addEventListener('keydown', changeDirection);

    //move the marker in a loop
    movementAnimation();
}



// GOOGLE MAPS
function initMap() {
    // create a google map
    map = new google.maps.Map(document.querySelector('.google-map'), {
        center: player.coords,
        zoom: 6,
        disableDefaultUI: true,
        keyboardShortcuts: false
    });

    getLocationAccess();
    webSocketStart();
}

function createMarker(iconUrl, coords) {
    const icon = {
        url: iconUrl,
        scaledSize: new google.maps.Size(70, 70),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(35, 35)
    };

    return new google.maps.Marker({
        position: coords,
        map: map,
        icon: icon
    });
}



// MOVEMENT AND CONTROLS
function changeDirection(e) {
    if (e.keyCode === 65) {
        //left
        player.dir = {
            x: -1,
            y: 0
        };
    } else if (e.keyCode === 68) {
        //right
        player.dir = {
            x: 1,
            y: 0
        };
    } else if (e.keyCode === 87) {
        //up
        player.dir = {
            x: 0,
            y: 1
        };
    } else if (e.keyCode === 83) {
        //down  
        player.dir = {
            x: 0,
            y: -1
        };
    }
}

function moveMarker() {
    //get current position
    let lat = player.marker.getPosition().lat();
    let lng = player.marker.getPosition().lng();

    //change position
    lng += player.speed * player.dir.x;
    lat += player.speed * 0.8 * player.dir.y; //smaller number because moving along x axis is faster

    player.marker.setPosition(new google.maps.LatLng(lat, lng));
    map.setCenter(player.marker.position);

    checkScoring();

    //send position to other players
    const message = {
        pos: {
            lng,
            lat
        },
        initDate: player.initDate,
        icon: player.iconUrl
    }
    ws.send(JSON.stringify(message));
}

function movementAnimation() {
    setInterval(moveMarker, 30);
}





// GEOLOCATION
function getLocationAccess() {
    navigator.geolocation.getCurrentPosition(geolocationAccessOK, geolocationAccessError)
}

function geolocationAccessOK(e) {
    player.coords = {
        lat: e.coords.latitude,
        lng: e.coords.longitude
    }
}

function geolocationAccessError() {
    console.log("We couldn't access your geolocation.");
}



// WEBSOCKET
let ws;

function webSocketStart() {
    ws = new WebSocket("ws://localhost:9000");
    ws.addEventListener('open', onWSOpen);
    ws.addEventListener('message', onWSMessage);
}

function sendMessage() {
    const text = document.querySelector('.chat-input').value;

    if (text) {
        const message = { msg: text, player: player.name }
        ws.send(JSON.stringify(message)); //send to server

        document.querySelector('.chat-input').value = ""; //reset text in the text input
    }
}

function onWSOpen() {
    console.log('Połączono z serwerem.')
}

function onWSMessage(e) {

    const data = JSON.parse(e.data);

    if (data.pos && data.initDate !== player.initDate) { //it's a new position of another player
        const otherPlayer = data.initDate;

        if (otherPlayers[otherPlayer]) {

            otherPlayers[otherPlayer].setPosition(data.pos);

        } else { // a new player came to the game

            otherPlayers[otherPlayer] = createMarker(data.icon, data.pos);

            //synch star coords
            const initDate = player.initDate;
            let cityIndexes = [];
            stars.forEach(star => {
                cityIndexes.push(star.cityIndex);
            })
            ws.send(JSON.stringify({
                synch: true,
                initDate: initDate,
                cityIndexes: cityIndexes
            }));

        }
    } else if (data.msg) { //it's a chat message
        chatWindow.innerHTML += `<p>${data.player} napisał:</p><p>${data.msg}</p></br>`

    } else if (data.star) { //it's info about getting a point
        chatWindow.innerHTML += `<p>${data.player} zdobył punkt w ${data.star}.</p></br>
        <p>W ${data.newStar} pojawiła się nowa gwiazdka.</p></br>`

    } else if (data.synch) { // it's a synch stars request

        if (data.initDate < player.initDate) { // this player started playing late 
            updateStarsCoords(data);
        }
    } else if (data.updateStars) { //it's a list of star coords
        updateStarsCoords(data);
    }
}

function updateStarsCoords(data) {
    stars.forEach((star, i) => {
        star.cityIndex = data.cityIndexes[i];
        star.marker.setPosition(new google.maps.LatLng(cities[star.cityIndex].coords));
    })
}