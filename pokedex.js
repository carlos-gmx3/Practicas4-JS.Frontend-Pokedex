const normalTC = {r: 168, g: 167, b: 122}
const fireTC = {r: 238, g: 129, b: 48}
const waterTC = {r: 99, g: 144, b: 240}
const electricTC = {r: 247, g: 208, b: 44}
const grassTC = {r: 122, g: 199, b: 76}
const iceTC = {r: 150, g: 217, b: 214}
const fightingTC = {r: 194, g: 46, b: 40}
const poisonTC = {r: 163, g: 62, b: 161}
const groundTC = {r: 226, g: 191, b: 101}
const flyingTC = {r: 169, g: 143, b: 243}
const psychicTC = {r: 249, g: 85, b: 135}
const bugTC = {r: 166, g: 185, b: 26}
const rockTC = {r: 182, g: 161, b: 54}
const ghostTC = {r: 115, g: 87, b: 151}
const dragonTC = {r: 111, g: 53, b: 252}
const darkTC = {r: 112, g: 87, b: 70}
const steelTC = {r: 183, g: 183, b: 206}
const fairyTC = {r: 214, g: 133, b: 173}
const labels = [
  "HP",
  "Attack",
  "Defense",
  "Speed",
  "Special-Defense",
  "Special-Attack"
];
let data = {
  labels: labels,
  datasets: [{
    label: 'Estádisticas base',
    backgroundColor: `rgba(255, 203, 5, .6)`,
    borderColor: `rgb(56, 96, 171)`,
    data: [0, 0, 0, 0, 0, 0],
  }]
};
let config = {
  type: 'radar',
  data: data,
  options:  {
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 250
      }
    }
  }
};
let pokeStats = new Chart(
  document.getElementById('pokeStats'),
  config
);
let fetchID = 0;
let fetchName = "";
let fetchFullName = "";
let fetchForms = {};
let fetchEv = {};
let statusColor = document.getElementById('status');
let pokeSearch = document.getElementById('pokeSearch');
let pokeSwap = document.getElementById('pokeSwap');
let swipePrev = document.getElementById('swipePrev');
let preEv = document.getElementById('preEv');
let swipeNext = document.getElementById('swipeNext');
let nextEv = document.getElementById('nextEv');
let formSwap = document.getElementById('formSwap');
let evSwap = document.getElementById('evSwap');
let pokePhoto = document.getElementById('pokePhoto');
let pokeBG = document.querySelector('.graphics')
let type1 = document.getElementById('type1');
let type2 = document.getElementById('type2');

pokeSwap.addEventListener('click', (e) => {
  e.preventDefault();
  fetchPokemon(pokeSearch.value.toLowerCase());
  pokeSearch.value = "";
});
pokeSearch.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' || e.keyCode === 13){
    fetchPokemon(pokeSearch.value.toLowerCase());
    pokeSearch.value = "";
  }
});
swipePrev.addEventListener('click', (e) => {
  e.preventDefault();
  if(fetchID > 1) {
    let prevID = fetchID - 1;
    fetchPokemon(prevID);
  }
});
swipeNext.addEventListener('click', (e) => {
  e.preventDefault();
  if(fetchID < 898) {
    let nextID = fetchID + 1;
    fetchPokemon(nextID);
  }
});
preEv.addEventListener('click', (e) => {
  e.preventDefault();
  let evLine = checkEvLevel("evLine");
  console.log(evLine);
  console.log(fetchName);
  console.log(equivTab(fetchName));
  let evIdx = evLine.findIndex((item) => item === fetchName);
  if(evIdx > 0) {
    evIdx--;
  }
  console.log(evIdx);
  fetchPokemon(evLine[evIdx]);
});
nextEv.addEventListener('click', (e) => {
  e.preventDefault();
  let evLine = checkEvLevel("evLine");
  let evIdx = evLine.findIndex((item) => item === fetchName);
  if(evIdx < (evLine.length - 1)) {
    evIdx++;
  }
  fetchPokemon(equivTab(evLine[evIdx]));
});

formSwap.addEventListener('click', (e) => {
  e.preventDefault();
  let formIdx = 0;
  fetchForms.map((item, idx) => {
    if(item.pokemon.name === fetchFullName) {
      formIdx = idx;
    }
  });
  if(formIdx < (fetchForms.length - 1)) {
    formIdx++;
  }
  else {
    formIdx = 0;
  }
  console.log(fetchForms);
  fetchVariant(fetchForms[formIdx].pokemon.name);
});

evSwap.addEventListener('click', (e) => {
  e.preventDefault();
  let eVariants = checkEvLevel("eVariants");
  let evIdx = eVariants.findIndex((item) => item === fetchName);
  if(evIdx < (eVariants.length - 1)) {
    evIdx++;
  }
  else {
    evIdx = 0;
  }
  fetchPokemon(equivTab(eVariants[evIdx]));
});
function equivTab(check) {
  if(fetchFullName.endsWith("alola")) {
    return check + "alola";
  }
  if(fetchFullName.endsWith("galar")) {
    return check + "galar";
  }
  switch(check) {
    case "wormadam-plant":
      return "wormadam";
      break;
    case "wormadam-sandy":
      return "wormadam";
      break;
    case "wormadam-trash":
      return "wormadam";
      break;
    case "wormadam-trash":
      return "wormadam";
      break;
    case "wormadam":
      return "wormadam-plant";
      break;
    case "toxtricity-amped":
      return "toxtricity";
      break;
    case "toxtricity-low-key":
      return "toxtricity";
      break;
    case "toxtricity":
      return "toxtricity-amped";
      break;
    default:
      return check;
      break;
  }
}
function setData (pokeObj) {
  let typeBG = `./media/Types/${pokeObj.types[0].type.name}.jpg`
  let pokeImg = pokeObj.sprites.front_default;
  document.getElementById('pokeName').innerHTML = pokeObj.name;
  pokePhoto.setAttribute("src", pokeImg);
  pokeBG.style.backgroundImage = `url(${typeBG})`;
  document.getElementById('height').innerHTML = `${pokeObj.height/10} m`;
  document.getElementById('weight').innerHTML = `${pokeObj.weight/10} kg`;
  fetch(pokeObj.types[0].type.url).then((res) => {
    if(res.status != '200') {
      console.log(res);
    } else {
      return res.json();
    }
  }).then((typeObj) => {
    type1.innerHTML = typeObj.names[5].name;
  }).catch((error) => {
    console.log(error);
    type1.innerHTML = pokeObj.types[0].type.name;
  })
  type1.style.backgroundColor = `var(--${pokeObj.types[0].type.name})`;
  type1.style.visibility = "visible";

  if(pokeObj.types.length > 1) {
    fetch(pokeObj.types[1].type.url).then((res) => {
      if(res.status != '200') {
        console.log(res);
      } else {
        return res.json();
      }
    }).then((typeObj) => {

      type2.innerHTML = typeObj.names[5].name;
    }).catch((error) => {
      console.log(error);
      type2.innerHTML = pokeObj.types[1].type.name;
    })
    type2.style.backgroundColor = `var(--${pokeObj.types[1].type.name})`;
    type2.style.visibility = "visible";
  }
  else {
    type2.style.visibility = "hidden";
  }
}

function setErrorData () {
  const defaultImg = "./media/WhosThatPoke.png";
  document.getElementById('pokeNumber').innerHTML = 000;
  document.getElementById('pokeName').innerHTML = "Quien es ese Pokemon?";
  pokePhoto.setAttribute("src", defaultImg);
  pokeBG.style.backgroundImage = `url("./media/RotomHeaderEmptyblink.png")`
  type1.style.visibility = "hidden";
  type2.style.visibility = "hidden";
}
function setBio (pokeBio) {
  let entries = [];
  let filterEntries = [];
  let entryIndex = 0;
  document.getElementById('pokeNumber').innerHTML = pokeBio.id;
  document.getElementById("pokeAka").innerHTML = pokeBio.genera[5].genus;
  for(let i = 0; i < pokeBio.flavor_text_entries.length; i++) {
    if(pokeBio.flavor_text_entries[i].language.name == "es") {
      entries[entryIndex] = pokeBio.flavor_text_entries[i].flavor_text;
      entryIndex ++;
    }
  }
  entries = entries.sort();
  filterEntries = entries.filter(function(item, idx, ary) {
    if(idx == 0) {
      return item;
    }
    else {
      if(item.slice(0, 6) != ary[idx - 1].slice(0, 6)){
        return item;
      }
    }
  });
  document.getElementById("pokeEntry").innerHTML = `
    <ul>
      <li>${filterEntries[0]}</li>
      <li>${filterEntries[1]}</li>
      <li>${filterEntries[2]}</li>
    </ul>`;
}

function checkEvLevel(answer) {
  let evIdx = -1;
  let evLevel = [-1, -1];
  let baseLevel = [];
  let midLevel = [];
  let maxLevel = [];
  let maxLevel2 = [];
  let baseLevelSpUrl = [];
  let midLevelSpUrl = [];
  let maxLevelSpUrl = [];
  let maxLevel2SpUrl = [];
  let sameLevelSpUrl = [];
  let findLineSpUrl = [];
  let findLine = [];
  baseLevel.push(fetchEv.chain.species.name);
  findLine.push(fetchEv.chain.species.name);
  baseLevelSpUrl.push(fetchEv.chain.species.url);
  findLineSpUrl.push(fetchEv.chain.species.url);

  if(fetchEv.chain.species.name === fetchName) {
    evLevel[0] = 0;
    evLevel[1] = 0;
    if(fetchEv.chain.evolves_to.length > 0) {
      findLine.push(fetchEv.chain.evolves_to[0].species.name);
      findLineSpUrl.push(fetchEv.chain.evolves_to[0].species.url);
    }
  }

  midLevel = fetchEv.chain.evolves_to.map((mid, idx) => {
    if(mid.species.name === fetchName) {
      evLevel[0] = 1;
      evLevel[1] = idx;
      findLine.push(mid.species.name);
      findLineSpUrl.push(mid.species.url);
      if(mid.evolves_to.length > 0) {
        findLine.push(mid.evolves_to[0].species.name);
        findLineSpUrl.push(mid.evolves_to[0].species.url);
      }
    }
    midLevelSpUrl.push(mid.species.url);
    return mid.species.name;
  });
  if(fetchEv.chain.evolves_to.length > 0) {
    maxLevel = fetchEv.chain.evolves_to[0].evolves_to.map((max, idx) => {
      if(max.species.name === fetchName) {
        evLevel[0] = 2;
        evLevel[1] = idx;
        findLine.push(fetchEv.chain.evolves_to[0].species.name);
        findLine.push(max.species.name);
        findLineSpUrl.push(fetchEv.chain.evolves_to[0].species.url);
        findLineSpUrl.push(max.species.url);
      }
      maxLevelSpUrl.push(max.species.url);
      return max.species.name;
    });
  }
  if(fetchEv.chain.evolves_to.length > 1) {
    maxLevel2 = fetchEv.chain.evolves_to[1].evolves_to.map((max2, idx) => {
      if(max2.species.name === fetchName) {
        evLevel[0] = 3;
        evLevel[1] = idx;
        findLine.push(fetchEv.chain.evolves_to[1].species.name);
        findLine.push(max2.species.name);
        findLineSpUrl.push(fetchEv.chain.evolves_to[1].species.url);
        findLineSpUrl.push(max2.species.url);
      }
      maxLevel2SpUrl.push(max2.species.url);
      return max2.species.name;
    });
  }
  switch(evLevel[0]) {
    case 0:
      sameLevel = baseLevel;
      sameLevelSpUrl = baseLevelSpUrl;
      break;
    case 1:
      sameLevel = midLevel;
      sameLevelSpUrl = midLevelSpUrl;
      break;
    case 2:
      sameLevel = maxLevel;
      sameLevelSpUrl = maxLevelSpUrl;
      break;
    case 3:
      sameLevel = maxLevel2;
      sameLevelSpUrl = maxLevel2SpUrl;
      break;
    default:
      sameLevel = baseLevel;
      sameLevelSpUrl = baseLevelSpUrl;
      break;
  }

  // sameLevel = sameLevelSpUrl.map((u) => {
  //   return getVarieties(u);
  // });

  // findLine = findLineSpUrl.map((u) => {
  //   return getVarieties(u);
  // });

  switch(answer) {
    case "evLine":
      return findLine;
      break;
    case "eVariants":
      return sameLevel;
      break;
    case "hasMore":
      return (sameLevel.length > 1);
      break;
    default:
      return (sameLevel.length > 1);
      break;
  }
}
function blinkStatus (fetchStatus) {
  let statusImg = "";
  switch(fetchStatus) {
    case 'e':
      statusImg = "./media/RotomHeaderError.png"
      break;
    case 'o':
      statusImg = "./media/RotomHeaderOk.png"
      break;
    case 'n':
      statusImg = "./media/RotomHeaderNormal.png"
      break;
    case 's':
      statusImg = "./media/RotomHeaderSearching.png"
      break;
    default:
      statusImg = "./media/RotomHeaderNormal.png"
      break;
  }
  statusColor.style.backgroundImage = `url(${statusImg})`
}

function fetchPokemon (poke) {
  blinkStatus('s');
  statusColor.style.visibility = "visible";
  const url = `https://pokeapi.co/api/v2/pokemon/${poke}`;
  fetch(url).then((res) => {
    if(res.status != '200') {
      console.log(res);
    } else {
      return res.json();
    }
  }).then((data) => {
    blinkStatus('o');
    setData(data);
    setStats(data);
    console.log(data.name);
    fetchFullName = data.name;
    fetchSpecies(data.species.url);
  }).catch((error) => {
    blinkStatus('e');
    console.log(error);
    setErrorData();
  })
  setTimeout(() => {
    statusColor.style.visibility = "hidden";
  }, 1300);
  blinkStatus('s');
}

function fetchSpecies (url) {
  fetch(url).then((res) => {
    if(res.status != '200') {
      console.log(res);
    } else {
      return res.json();
    }
  }).then((data) => {
    fetchID = data.id;
    fetchName = data.name;
    // console.log("Name " + fetchName);
    // console.log("Full " + fetchFullName);
    if(data.varieties.length > 1) {
      formSwap.style.visibility = "visible";
    }
    else {
      formSwap.style.visibility = "hidden";
    }
    
    fetchForms = data.varieties;
    setBio(data);
    fetchEvChain(data.evolution_chain.url);
  }).catch((error) => {
    console.log(error);
  })
}

function fetchVariant (varID) {
  blinkStatus('s');
  statusColor.style.visibility = "visible";
  const url = `https://pokeapi.co/api/v2/pokemon/${varID}`;
  fetch(url).then((res) => {
    if(res.status != '200') {
      console.log(res);
    } else {
      return res.json();
    }
  }).then((data) => {
    blinkStatus('o');
    setData(data);
    setStats(data);
    fetchBaseSpecies(data.species.url);
    //fetchName = data.name;
    fetchFullName = data.name;
  }).catch((error) => {
    blinkStatus('e');
    console.log(error);
    setErrorData();
  })
  setTimeout(() => {
    statusColor.style.visibility = "hidden";
  }, 1300);
  blinkStatus('s');
}

function fetchBaseSpecies (url) {
  fetch(url).then((res) => {
    if(res.status != '200') {
      console.log(res);
    } else {
      return res.json();
    }
  }).then((data) => {
    fetchID = data.id;
    if(data.varieties.length > 1) {
      formSwap.style.visibility = "visible";
    }
    else {
      formSwap.style.visibility = "hidden";
    }
    
    fetchForms = data.varieties;
    setBio(data);
    fetchEvChain(data.evolution_chain.url);
  }).catch((error) => {
    console.log(error);
  })
}

async function getVarieties(url) {
  let varietyName = "";
  await fetch(url).then((res) => {
    if(res.status != '200') {
      console.log(res);
    } else {
      return res.json();
    }
  }).then((data) => {
    varietyName = data.varieties[0].pokemon.name;
  }).catch((error) => {
    console.log(error);
    varietyName = "Nope";
  })
  return varietyName;
}

function fetchEvChain (chainURL) {
  fetch(chainURL).then((res) => {
    if(res.status != '200') {
      console.log(res);
    } else {
      return res.json();
    }
  }).then((data) => {
    fetchEv = data;
    if(checkEvLevel("hasMore")) {
      evSwap.style.visibility = "visible";
    }
    else {
      evSwap.style.visibility = "hidden";
    }
  }).catch((error) => {
    console.log(error);

  })
}

function setStats (pokeObj) {
  data.datasets[0].data = [
    pokeObj.stats[0].base_stat,
    pokeObj.stats[1].base_stat,
    pokeObj.stats[2].base_stat,
    pokeObj.stats[5].base_stat,
    pokeObj.stats[4].base_stat,
    pokeObj.stats[3].base_stat
  ];

  if(pokeObj.types.length > 1) {
    switch(pokeObj.types[0].type.name) {
      case "normal":
        data.datasets[0].borderColor = `rgb(${normalTC.r}, ${normalTC.g}, ${normalTC.b})`;
        break;
      case "fire":
        data.datasets[0].borderColor = `rgb(${fireTC.r}, ${fireTC.g}, ${fireTC.b})`;
        break;
      case "water":
        data.datasets[0].borderColor = `rgb(${waterTC.r}, ${waterTC.g}, ${waterTC.b})`;
        break;
      case "electric":
        data.datasets[0].borderColor = `rgb(${electricTC.r}, ${electricTC.g}, ${electricTC.b})`;
        break;
      case "grass":
        data.datasets[0].borderColor = `rgb(${grassTC.r}, ${grassTC.g}, ${grassTC.b})`;
        break;
      case "ice":
        data.datasets[0].borderColor = `rgb(${iceTC.r}, ${iceTC.g}, ${iceTC.b})`;
        break;
      case "fighting":
        data.datasets[0].borderColor = `rgb(${fightingTC.r}, ${fightingTC.g}, ${fightingTC.b})`;
        break;
      case "poison":
        data.datasets[0].borderColor = `rgb(${poisonTC.r}, ${poisonTC.g}, ${poisonTC.b})`;
        break;
      case "ground":
        data.datasets[0].borderColor = `rgb(${groundTC.r}, ${groundTC.g}, ${groundTC.b})`;
        break;
      case "flying":
        data.datasets[0].borderColor = `rgb(${flyingTC.r}, ${flyingTC.g}, ${flyingTC.b})`;
        break;
      case "psychic":
        data.datasets[0].borderColor = `rgb(${psychicTC.r}, ${psychicTC.g}, ${psychicTC.b})`;
        break;
      case "bug":
        data.datasets[0].borderColor = `rgb(${bugTC.r}, ${bugTC.g}, ${bugTC.b})`;
        break;
      case "rock":
        data.datasets[0].borderColor = `rgb(${rockTC.r}, ${rockTC.g}, ${rockTC.b})`;
        break;
      case "ghost":
        data.datasets[0].borderColor = `rgb(${ghostTC.r}, ${ghostTC.g}, ${ghostTC.b})`;
        break;
      case "dragon":
        data.datasets[0].borderColor = `rgb(${dragonTC.r}, ${dragonTC.g}, ${dragonTC.b})`;
        break;
      case "dark":
        data.datasets[0].borderColor = `rgb(${darkTC.r}, ${darkTC.g}, ${darkTC.b})`;
        break;
      case "steel":
        data.datasets[0].borderColor = `rgb(${steelTC.r}, ${steelTC.g}, ${steelTC.b})`;
        break;
      case "fairy":
        data.datasets[0].borderColor = `rgb(${fairyTC.r}, ${fairyTC.g}, ${fairyTC.b})`;
        break;
    }
    switch(pokeObj.types[1].type.name) {
      case "normal":
        data.datasets[0].backgroundColor = `rgba(${normalTC.r}, ${normalTC.g}, ${normalTC.b}, .5)`;
        break;
      case "fire":
        data.datasets[0].backgroundColor = `rgba(${fireTC.r}, ${fireTC.g}, ${fireTC.b}, .5)`;
        break;
      case "water":
        data.datasets[0].backgroundColor = `rgba(${waterTC.r}, ${waterTC.g}, ${waterTC.b}, .5)`;
        break;
      case "electric":
        data.datasets[0].backgroundColor = `rgba(${electricTC.r}, ${electricTC.g}, ${electricTC.b}, .5)`;
        break;
      case "grass":
        data.datasets[0].backgroundColor = `rgba(${grassTC.r}, ${grassTC.g}, ${grassTC.b}, .5)`;
        break;
      case "ice":
        data.datasets[0].backgroundColor = `rgba(${iceTC.r}, ${iceTC.g}, ${iceTC.b}, .5)`;
        break;
      case "fighting":
        data.datasets[0].backgroundColor = `rgba(${fightingTC.r}, ${fightingTC.g}, ${fightingTC.b}, .5)`;
        break;
      case "poison":
        data.datasets[0].backgroundColor = `rgba(${poisonTC.r}, ${poisonTC.g}, ${poisonTC.b}, .5)`;
        break;
      case "ground":
        data.datasets[0].backgroundColor = `rgba(${groundTC.r}, ${groundTC.g}, ${groundTC.b}, .5)`;
        break;
      case "flying":
        data.datasets[0].backgroundColor = `rgba(${flyingTC.r}, ${flyingTC.g}, ${flyingTC.b}, .5)`;
        break;
      case "psychic":
        data.datasets[0].backgroundColor = `rgba(${psychicTC.r}, ${psychicTC.g}, ${psychicTC.b}, .5)`;
        break;
      case "bug":
        data.datasets[0].backgroundColor = `rgba(${bugTC.r}, ${bugTC.g}, ${bugTC.b}, .5)`;
        break;
      case "rock":
        data.datasets[0].backgroundColor = `rgba(${rockTC.r}, ${rockTC.g}, ${rockTC.b}, .5)`;
        break;
      case "ghost":
        data.datasets[0].backgroundColor = `rgba(${ghostTC.r}, ${ghostTC.g}, ${ghostTC.b}, .5)`;
        break;
      case "dragon":
        data.datasets[0].backgroundColor = `rgba(${dragonTC.r}, ${dragonTC.g}, ${dragonTC.b}, .5)`;
        break;
      case "dark":
        data.datasets[0].backgroundColor = `rgba(${darkTC.r}, ${darkTC.g}, ${darkTC.b}, .5)`;
        break;
      case "steel":
        data.datasets[0].backgroundColor = `rgba(${steelTC.r}, ${steelTC.g}, ${steelTC.b}, .5)`;
        break;
      case "fairy":
        data.datasets[0].backgroundColor = `rgba(${fairyTC.r}, ${fairyTC.g}, ${fairyTC.b}, .5)`;
        break;
    }
  }
  else {
    switch(pokeObj.types[0].type.name) {
      case "normal":
        data.datasets[0].borderColor = `rgb(${normalTC.r}, ${normalTC.g}, ${normalTC.b})`;
        data.datasets[0].backgroundColor = `rgba(${normalTC.r}, ${normalTC.g}, ${normalTC.b}, .5)`;
        break;
      case "fire":
        data.datasets[0].borderColor = `rgb(${fireTC.r}, ${fireTC.g}, ${fireTC.b})`;
        data.datasets[0].backgroundColor = `rgba(${fireTC.r}, ${fireTC.g}, ${fireTC.b}, .5)`;
        break;
      case "water":
        data.datasets[0].borderColor = `rgb(${waterTC.r}, ${waterTC.g}, ${waterTC.b})`;
        data.datasets[0].backgroundColor = `rgba(${waterTC.r}, ${waterTC.g}, ${waterTC.b}, .5)`;
        break;
      case "electric":
        data.datasets[0].borderColor = `rgb(${electricTC.r}, ${electricTC.g}, ${electricTC.b})`;
        data.datasets[0].backgroundColor = `rgba(${electricTC.r}, ${electricTC.g}, ${electricTC.b}, .5)`;
        break;
      case "grass":
        data.datasets[0].borderColor = `rgb(${grassTC.r}, ${grassTC.g}, ${grassTC.b})`;
        data.datasets[0].backgroundColor = `rgba(${grassTC.r}, ${grassTC.g}, ${grassTC.b}, .5)`;
        break;
      case "ice":
        data.datasets[0].borderColor = `rgb(${iceTC.r}, ${iceTC.g}, ${iceTC.b})`;
        data.datasets[0].backgroundColor = `rgba(${iceTC.r}, ${iceTC.g}, ${iceTC.b}, .5)`;
        break;
      case "fighting":
        data.datasets[0].borderColor = `rgb(${fightingTC.r}, ${fightingTC.g}, ${fightingTC.b})`;
        data.datasets[0].backgroundColor = `rgba(${fightingTC.r}, ${fightingTC.g}, ${fightingTC.b}, .5)`;
        break;
      case "poison":
        data.datasets[0].borderColor = `rgb(${poisonTC.r}, ${poisonTC.g}, ${poisonTC.b})`;
        data.datasets[0].backgroundColor = `rgba(${poisonTC.r}, ${poisonTC.g}, ${poisonTC.b}, .5)`;
        break;
      case "ground":
        data.datasets[0].borderColor = `rgb(${groundTC.r}, ${groundTC.g}, ${groundTC.b})`;
        data.datasets[0].backgroundColor = `rgba(${groundTC.r}, ${groundTC.g}, ${groundTC.b}, .5)`;
        break;
      case "flying":
        data.datasets[0].borderColor = `rgb(${flyingTC.r}, ${flyingTC.g}, ${flyingTC.b})`;
        data.datasets[0].backgroundColor = `rgba(${flyingTC.r}, ${flyingTC.g}, ${flyingTC.b}, .5)`;
        break;
      case "psychic":
        data.datasets[0].borderColor = `rgb(${psychicTC.r}, ${psychicTC.g}, ${psychicTC.b})`;
        data.datasets[0].backgroundColor = `rgba(${psychicTC.r}, ${psychicTC.g}, ${psychicTC.b}, .5)`;
        break;
      case "bug":
        data.datasets[0].borderColor = `rgb(${bugTC.r}, ${bugTC.g}, ${bugTC.b})`;
        data.datasets[0].backgroundColor = `rgba(${bugTC.r}, ${bugTC.g}, ${bugTC.b}, .5)`;
        break;
      case "rock":
        data.datasets[0].borderColor = `rgb(${rockTC.r}, ${rockTC.g}, ${rockTC.b})`;
        data.datasets[0].backgroundColor = `rgba(${rockTC.r}, ${rockTC.g}, ${rockTC.b}, .5)`;
        break;
      case "ghost":
        data.datasets[0].borderColor = `rgb(${ghostTC.r}, ${ghostTC.g}, ${ghostTC.b})`;
        data.datasets[0].backgroundColor = `rgba(${ghostTC.r}, ${ghostTC.g}, ${ghostTC.b}, .5)`;
        break;
      case "dragon":
        data.datasets[0].borderColor = `rgb(${dragonTC.r}, ${dragonTC.g}, ${dragonTC.b})`;
        data.datasets[0].backgroundColor = `rgba(${dragonTC.r}, ${dragonTC.g}, ${dragonTC.b}, .5)`;
        break;
      case "dark":
        data.datasets[0].borderColor = `rgb(${darkTC.r}, ${darkTC.g}, ${darkTC.b})`;
        data.datasets[0].backgroundColor = `rgba(${darkTC.r}, ${darkTC.g}, ${darkTC.b}, .5)`;
        break;
      case "steel":
        data.datasets[0].borderColor = `rgb(${steelTC.r}, ${steelTC.g}, ${steelTC.b})`;
        data.datasets[0].backgroundColor = `rgba(${steelTC.r}, ${steelTC.g}, ${steelTC.b}, .5)`;
        break;
      case "fairy":
        data.datasets[0].borderColor = `rgb(${fairyTC.r}, ${fairyTC.g}, ${fairyTC.b})`;
        data.datasets[0].backgroundColor = `rgba(${fairyTC.r}, ${fairyTC.g}, ${fairyTC.b}, .5)`;
        break;
    }
  }
  pokeStats.update();
}