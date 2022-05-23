const APIKEY = "2d1d44ed1b919fdf6b34f6b3ed57c501";

let maiuscule = function (contenu) {
    let mots = contenu.split(" ");
    let newStr = "";

    for (let i = 0; i < mots.length; i++) {
        mots[i] = mots[i][0].toUpperCase() + mots[i].slice(1);
        newStr += " " + mots[i];
    }
    return newStr;
}

let apiCall = async function (avecIp = true) {
    try {
        let ville;

        if(avecIp) {
            let ip = await fetch('https://api.ipify.org?format=json')
                .then(reponse => reponse.json())
                .then(json => json.ip)
            ville = await fetch("http://ip-api.com/json/" + ip)
                .then(reponse => reponse.json())
                .then(json => json.city)
        }
        else {
            ville = document.querySelector("#villeInput").value;
        }

        let url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${APIKEY}&units=metric&lang=fr`;
        let meteo = await fetch(url)
            .then(reponse => reponse.json())
            .then(data => data)

        display(meteo);

        fetch(`https://pixabay.com/api/?key=27567288-0fe3e1bee5acc3843b5d106fe&q=${ville}&image_type=photo`)
            .then(reponse => reponse.json())
            .then(imageUrl => {
                let randomPhoto = Math.floor(Math.random() * 20)
                let img = imageUrl.hits[randomPhoto].largeImageURL;
                document.body.style.background = `url(${img})`;
                document.body.style.backgroundSize = "100% 100%";
            })
    } 
    catch {
        alert("Error. Notre système ne trouve pas cette ville. Vérifiez si la ville est bien ecrit.");
        apiCall(true);
    }
}

let display = function (data) {
    document.querySelector("#villeName").innerHTML = data.name;
    document.querySelector("#actuelTempText").innerHTML = Math.round(data.main.temp) + "°";
    document.querySelector("#minTempText").innerHTML = Math.round(data.main.temp_min) + "°";
    document.querySelector("#maxTempText").innerHTML = Math.round(data.main.temp_max) + "°";
    document.querySelector("#etatText").innerHTML = maiuscule(data.weather[0].description);
    document.querySelector("#sensationText").innerHTML = Math.round(data.main.feels_like) + "°";
    document.querySelector("#humiditeText").innerHTML = data.main.humidity + "%";
    document.querySelector("#ventText").innerHTML = data.wind.speed + " km/h";
    document.querySelector("#pressureText").innerHTML = data.main.pressure + " hPa";
    document.querySelector("#visibiliteText").innerHTML = data.visibility + " m";

    let lon = data.coord.lon;
    let lat = data.coord.lat;
    const apiKeyTime  = "G3WXDZ09INKR";

    fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=${apiKeyTime}&format=json&by=position&lat=${lat}&lng=${lon}`)
        .then (reponse => reponse.json())
        .then (time => {
            document.querySelector("#dayDisplay").innerHTML = time.formatted.slice(0, 11);
            document.querySelector("#timeDisplay").innerHTML = time.formatted.slice(11, -3)

        });

    let iconcode = data.weather[0].icon;
    let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    document.querySelector("#imageIcon").src = iconurl;
};

document.querySelector("#buttonSearch").addEventListener("click", function (event) {
    event.preventDefault();
    apiCall(false);
});

document.addEventListener("keypress", function(event) {
    if(event.key == "Enter") {
        document.querySelector("#buttonSearch").click();
    };
});

apiCall();