let pokePhoto = document.getElementById('pokePhoto');
let pokeSearch = document.getElementById('pokeName');
let pokeSwap = document.getElementById('pokeSwap');

function setData (imgURL) {
  pokePhoto.setAttribute("src", imgURL);
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
    let pokeImg = data.sprites.front_default;
    setData(pokeImg);
  }).catch((error) => {
    const defaultImg = "./media/sad-pikachu.gif";
    console.log(error);
    setData(defaultImg);
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