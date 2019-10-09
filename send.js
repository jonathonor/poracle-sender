
var schedule = require('node-schedule');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var randomLocation = require('random-location');

var sorted = require('./merged.json');
var pokemon = require('./monsters.json');
var config = require('./config.json');

const webhookUrl = config.webhookUrl;
const areas = config.areas;

getArea = () => {
    let areaNum = getNum(0, areas.length-1);
    
    return { name: areas[areaNum].name, location: randomLocation.randomCirclePoint(areas[areaNum], config.distanceFromPoints) };
}

getNum = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

sendData = num => {
    let pokemonToSend = getRandomPokemon();
    let verifiedTime = Math.random() < 0.7 ? true : false;
    const areaData = getArea();
    const randomPoint = areaData.location;
    let data = {
        type: 'pokemon',
        message: {
            pokestop_id: 'None',
            disappear_time_verified: verifiedTime,
            weather: Math.random() < 0.5 ? 1 : 2,
            latitude: randomPoint.latitude,
            disappear_time: verifiedTime ? Math.trunc((new Date().valueOf() / 1000) + Math.floor(Math.random() * 2400)) : Math.floor((new Date().valueOf() /1000) + 15*60),
            pokemon_level: getNum(25, 30),
            last_modified_time: Math.floor(new Date().getTime() - Math.random() * 250),
            costume: 0,
            individual_stamina: getNum(11, 15),
            individual_defense: getNum(12, 15),
            longitude: randomPoint.longitude,
            encounter_id: Math.floor(Math.random() * 50000000000),
            spawnpoint_id: '6EC8FF99',
            first_seen: Math.floor(new Date().getTime() - Math.random() * 250),
            individual_attack: getNum(12, 15),
            correlationId: 'a5fb6cea-93ee-40cd-befe-587a9aef336c',
            messageId: 'd0af1da6-148a-4b32-b7b3-133d0842fd18',
            pokemon_id: pokemonToSend.pokemon_id,
            cp: pokemonToSend.cp ? pokemonToSend.cp+getNum(0, 349) : getNum(10, 1222),
            weight: pokemonToSend.weight ? pokemonToSend.weight : Math.random() + getNum(1, 15),
            height: pokemonToSend.height ? pokemonToSend.height : Math.random() + getNum(1, 7),
            move_1: pokemonToSend.move_1.length > 0 ? pokemonToSend.move_1[getNum(0, pokemonToSend.move_1.length-1)] : getNum(1, 250),
            move_2: pokemonToSend.move_2.length > 0 ? pokemonToSend.move_2[getNum(0, pokemonToSend.move_2.length-1)] : getNum(1, 250),
            gender: Math.random() < 0.7 ? 1 : 2,
            form: pokemonToSend.form.length > 0 ? pokemonToSend.form[getNum(0, pokemonToSend.form.length-1)] : 0
         } 
    };

    var xhr = new XMLHttpRequest();
    xhr.open("POST", webhookUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    if (config.sendingTo === "poracle") {
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                let response = xhr.responseText;
                console.log('After', Math.floor((num/1000)+15), 'seconds sent -', pokemon[data.message.pokemon_id].name, '-', calcIv(data.message.individual_attack, data.message.individual_defense, data.message.individual_stamina), '- to', areaData.name);
                console.log('Got response', response);
            }
        }
    } else if (config.sendingTo === "wdr") {
        console.log('After', Math.floor((num/1000)+15), 'seconds sent -', pokemon[data.message.pokemon_id].name, '-', calcIv(data.message.individual_attack, data.message.individual_defense, data.message.individual_stamina), '-', data.message.individual_attack,'/', data.message.individual_defense,'/', data.message.individual_stamina, '- to', areaData.name);
    }

    xhr.send(JSON.stringify([data]));
}

calcIv = (atk, def, sta) => {
    atk = parseInt(atk);
    def = parseInt(def);
    sta = parseInt(sta);
    return ((atk + def + sta) / 0.45).toFixed(2);
}

getRandomPokemon = () => {
    let pokemonToSend = getNum(0, 634);
    let send = sorted.find(obj => parseInt(obj.pokemon_id) === pokemonToSend) || getRandomPokemon();
    
    return send;
}


schedule.scheduleJob('*/15 * * * * *', () => {
    let num = getNum(3000, 14000);
    setTimeout(() => {
        sendData(num);
    }, num)
});
