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
    type2.innerHTML = pokeObj.types[1].type.name;
    type2.style.display = "block";
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
      console.log(res);
      return res.json();
    }
  }).then((data) => {
    blinkStatus('o');
    console.log(data);
    setData(data);
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