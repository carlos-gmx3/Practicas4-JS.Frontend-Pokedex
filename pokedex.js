let pokePhoto = document.getElementById('pokePhoto');
let pokeBG = document.getElementById('pokeBackground')
let pokeSearch = document.getElementById('pokeSearch');
let pokeSwap = document.getElementById('pokeSwap');

function setData (pokeObj) {
  let typeBG = `./media/Types/${pokeObj.types[0].type.name}.jpg`
  let pokeImg = pokeObj.sprites.front_default;
  pokePhoto.setAttribute("src", pokeImg);
  pokeBG.setAttribute("src", typeBG);
  document.getElementById('pokeName').innerHTML = pokeObj.forms[0].name;
}
function setErrorData () {
  const defaultImg = "./media/WhosThatPoke.png";
  pokePhoto.setAttribute("src", defaultImg);
}

function fetchPokemon (poke) {
  const url = `https://pokeapi.co/api/v2/pokemon/${poke}`;
  fetch(url).then((res) => {
    if(res.status != '200') {
      console.log(res);
    } else {
      return res.json();
    }
  }).then((data) => {
    console.log(data);
    setData(data);
  }).catch((error) => {
    console.log(error);
    setErrorData();
  })
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