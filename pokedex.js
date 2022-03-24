const normalType = {r: 168, g: 167, b: 122}
const fireType = {r: 238, g: 129, b: 48}
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
    label: 'Estadisticas base',
    backgroundColor: `rgba(${normalType.r}, ${normalType.g}, ${normalType.b}, .8)`,
    borderColor: `rgba(${fireType.r}, ${fireType.g}, ${fireType.b}, 1)`,
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
let pokeFetch = {};
let statusColor = document.getElementById('status');
let pokeSearch = document.getElementById('pokeSearch');
let pokeSwap = document.getElementById('pokeSwap');
let pokePhoto = document.getElementById('pokePhoto');
let pokeBG = document.querySelector('.graphics')
let type1 = document.getElementById('type1');
let type2 = document.getElementById('type2');

function setData (pokeObj) {
  let typeBG = `./media/Types/${pokeObj.types[0].type.name}.jpg`
  let pokeImg = pokeObj.sprites.front_default;
  document.getElementById('pokeNumber').innerHTML = pokeObj.id;
  document.getElementById('pokeName').innerHTML = pokeObj.species.name;
  pokePhoto.setAttribute("src", pokeImg);
  pokeBG.style.backgroundImage = `url(${typeBG})`;
  type1.innerHTML = pokeObj.types[0].type.name;
  type1.style.backgroundColor = `var(--${pokeObj.types[0].type.name})`;
  if(pokeObj.types.length > 1) {
    type2.style.display = "block";
    type2.innerHTML = pokeObj.types[1].type.name;
    type2.style.backgroundColor = `var(--${pokeObj.types[1].type.name})`;
  }
  else {
    type2.style.display = "none";
  }
  console.log(type2);
}

function setErrorData () {
  const defaultImg = "./media/WhosThatPoke.png";
  document.getElementById('pokeName').innerHTML = "Quien es ese Pokemon?";
  pokePhoto.setAttribute("src", defaultImg);
  pokeBG.style.backgroundImage = `url("./media/RotomHeaderEmptyblink.png")`
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
  pokeStats.update();
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
    console.log(data);
    pokeFetch = data;
    setData(data);
    setStats(data);
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

pokeSwap.addEventListener('click', (e) => {
  e.preventDefault();
  fetchPokemon(pokeSearch.value.toLowerCase());
  pokeSearch.value = "";
})
pokeSearch.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' || e.keyCode === 13){
    fetchPokemon(pokeSearch.value.toLowerCase());
    pokeSearch.value = "";
  }
})