const APIKEY = "2d1d44ed1b919fdf6b34f6b3ed57c501";
const apiKeyTime  = "G3WXDZ09INKR";
const apiKeyPhoto = "27567288-0fe3e1bee5acc3843b5d106fe";
let cityName = document.querySelector("#villeName");
let tempActuel =  document.querySelector("#actuelTempText");
let tempMin = document.querySelector("#minTempText");
let tempMax = document.querySelector("#maxTempText");
let etat = document.querySelector("#etatText");
let ressenti = document.querySelector("#sensationText");
let humidite = document.querySelector("#humiditeText");
let vent = document.querySelector("#ventText");
let pression = document.querySelector("#pressureText");
let visibilite = document.querySelector("#visibiliteText");

let apiCall = async function (avecIp = true) {
    try {
        let ville;

        //Trouver l'ip de l'utilisateur local
        if(avecIp) {
            let ip = await fetch('https://api.ipify.org?format=json')
                .then(reponse => reponse.json())
                .then(json => json.ip)
            
            //Trouver ville avec ip
            ville = await fetch(`http://ip-api.com/json/${ip}`)
                .then(reponse => reponse.json())
                .then(json => json.city)
        }
        else {
            //Si l'utilisateur veut choisir une ville
            ville = document.querySelector("#villeInput").value;
        }

        //Fetch meteo data
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${APIKEY}&units=metric&lang=fr`;
        let meteo = await fetch(url)
            .then(reponse => reponse.json())
            .then(data => data)
        
        //Appel function pour afficher les données météo
        display(meteo);

        //Appel function pour afficher la photo de la ville
        background(ville);
    } 
    catch {
        alert("Erreur. Notre système ne trouve pas cette ville. Vérifiez si la ville est bien écrit.");

        //Appel fonction par défaut si la ville n'est pas trouvée
        apiCall(true);
    }
}

//Afficher les données de meteo
let display = function (data) {
    cityName.innerHTML = data.name;
    tempActuel.innerHTML = Math.round(data.main.temp) + "°";
    tempMin.innerHTML = Math.round(data.main.temp_min) + "°";
    tempMax.innerHTML = Math.round(data.main.temp_max) + "°";
    etat.innerHTML = maiuscule(data.weather[0].description);
    ressenti.innerHTML = Math.round(data.main.feels_like) + "°";
    humidite.innerHTML = data.main.humidity + "%";
    vent.innerHTML = data.wind.speed + " km/h";
    pression.innerHTML = data.main.pressure + " hPa";
    visibilite.innerHTML = data.visibility + " m";

    let lon = data.coord.lon;
    let lat = data.coord.lat;
    let iconCode = data.weather[0].icon;
    
    timeZoneApi(lon, lat);
    changeIcon(iconCode);
};

//Changement du background avec photo de la ville recherchée
let background = function (ville) {

     fetch(`https://pixabay.com/api/?key=${apiKeyPhoto}&q=${ville}&image_type=photo`)
    .then(reponse => reponse.json())
    .then(imageUrl => {
        let randomPhoto = Math.floor(Math.random() * 20)
        let img = imageUrl.hits[randomPhoto].largeImageURL;
        document.body.style.background = `url(${img})`;
        document.body.style.backgroundSize = "100% 100%";
    })
    .catch(error => {
        alert("Erreur. Notre systèm ne trouve pas d'image de cette ville mais vous pouvez consulter la meteo sans problème.")
        document.body.style.backgroundImage = "url('images/backgroundPhoto.jpg')";
        document.body.style.backgroundSize = "100% 100%";
    })
}

//Récupérer l'API pour le fuseau horaire
let timeZoneApi = function (long, lati) {
    fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=${apiKeyTime}&format=json&by=position&lat=${lati}&lng=${long}`)
        .then (reponse => reponse.json())
        .then (time => {
            document.querySelector("#dayDisplay").innerHTML = dataFormat(time.formatted.slice(0, 10));
            document.querySelector("#timeDisplay").innerHTML = time.formatted.slice(11, -3);
        })
}

//Changement icon de l'état actuel
let changeIcon = function (icon) {
    let iconUrl = `http://openweathermap.org/img/w/${icon}.png`;
    document.querySelector("#imageIcon").src = iconUrl;
}

//Fonction pour mettre en maiuscule la première lettre de chaque mot
let maiuscule = function (contenu) {
    let mots = contenu.split(" ");
    let newStr = "";

    for (let i = 0; i < mots.length; i++) {
        mots[i] = mots[i][0].toUpperCase() + mots[i].slice(1);
        newStr += mots[i] + " ";
    }
    return newStr;
};

//Changement du format de la date
let dataFormat = function (date) {
    let newDate = "";
    let dateSplit = date.split("-");
    let année = dateSplit[0];
    let mois = dateSplit[1];
    let jour = dateSplit[2];

    newDate = jour + "-" + mois + "-" + année;

    return newDate;
}

//Fonction pour chercher la ville choisi
document.querySelector("#buttonSearch").addEventListener("click", function (event) {
    apiCall(false);
});

document.addEventListener("keypress", function(event) {
    if(event.key == "Enter") {
        document.querySelector("#buttonSearch").click();
    }
});

//Appel fonction principal
apiCall();