const baseURL = `https://pokeapi.co/api/v2/pokemon?limit=100`;
const cards = document.querySelector('.cards');
const msg = new SpeechSynthesisUtterance();
msg.text = '';

function speak(){
  speechSynthesis.speak(msg);
}

function wait(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomElements(array, count) {
  const randomElements = [];
  const indices = new Set();

  while (randomElements.length < count) {
    const randomIndex = Math.floor(Math.random() * array.length);

    if (!indices.has(randomIndex)) {
      indices.add(randomIndex);
      randomElements.push(array[randomIndex]);
    }
  }

  return randomElements;
}

async function getPokeData(){
  const res = await fetch(baseURL);
  const data = await res.json();
  const pokes = getRandomElements(data.results, 8)
  pokes.forEach(pokemon => {
    fetchPokemonData(pokemon);
  })
}

function setBgColor(cardEl,tempArr) {
  tempArr.includes('bug') ? cardEl.classList.add('bug') :
  tempArr.includes('fire') ? cardEl.classList.add('fire'):
  tempArr.includes('water') ? cardEl.classList.add('water') :
  tempArr.includes('electric') ? cardEl.classList.add('electric') :
  tempArr.includes('poison') ? cardEl.classList.add('poison') :
  tempArr.includes('psychic') ? cardEl.classList.add('psychic') :
  tempArr.includes('fighting') ? cardEl.classList.add('fighting') :
  tempArr.includes('ground') ? cardEl.classList.add('ground') :
  tempArr.includes('flying') ? cardEl.classList.add('flying') :
  tempArr.includes('fairy') ? cardEl.classList.add('fairy') :
  tempArr.includes('ice') ? cardEl.classList.add('ice') :
  tempArr.includes('dragon') ? cardEl.classList.add('dragon') :
  tempArr.includes('grass') ? cardEl.classList.add('grass') :
  tempArr.includes('normal') ? cardEl.classList.add('normal') :
  console.log('some other type');
}

async function fetchPokemonData(pokemon){
  let pokeURL = pokemon.url;
  const response = await fetch(pokeURL);
  const pokemonData = await response.json();
  const {name, id, types} = pokemonData;
  const tempArr = [];
  types.forEach(element => tempArr.push(element.type.name));
  const cardData = `<div class="card">
  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png" alt="${name}"/>
  ${name}
  <br>
  ${tempArr}
  </div>`;
  cards.insertAdjacentHTML('afterbegin',cardData);
  const cardEl =  document.querySelector('.card');
  setBgColor(cardEl,tempArr);
  cardEl.addEventListener('click', async function () {
    promptBox(pokemonData);
  })
}

// fetch pokemon location
async function fetchLocation({ location_area_encounters }) {
  const resp = await fetch(location_area_encounters);
  const pokemonLocation = await resp.json();
  let locations = [];
  if (pokemonLocation.length === 0){
    locations = `not found`;
  } else {
    pokemonLocation.forEach(location => locations.push(location.location_area.name))
  }
  return locations;
}

// generate two random moves
function randomMove({ moves }){
  let allMoves = [];
  moves.forEach(move => allMoves.push(move.move.name))
  let twoMoves = [];
  for(let i = 0; i < 2; i++) {
    twoMoves.push(allMoves[Math.floor(Math.random() * allMoves.length)])
  }
  return twoMoves;
}


//on page load
getPokeData();

async function destroyPopup(popup) {
  popup.classList.remove('open');
  await wait(200);
  // stop speaking when cancel button pressed
  speechSynthesis.cancel();
  // remove the popup entirely!
  popup.remove();
  /* eslint-disable no-param-reassign */
  popup = null;
  /* eslint-enable no-param-reassign */
}

// prompt box
async function promptBox(pokemonData) {
  const {name, id, types} = pokemonData;
  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.insertAdjacentHTML(
    'afterbegin',
    `<div class="prompt">
      <div class="img-section">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png" alt="Pokemon"/>
      </div>
        <div class="info">
            <p class="name">${name}</p>
            <p>Base stats</p>
            <div class="progress-bar">
              <div>HP: &nbsp;&nbsp;</div>
              <div class="progress">
              <div class="progress-done hp" data-done="70">
              </div>
              </div>
            </div>
            <div class="progress-bar">
              <div>ATK: &nbsp;</div>
              <div class="progress">
              <div class="progress-done atk" data-done="70">
              </div>
              </div>
            </div>
            <div class="progress-bar">
              <div>DEF: &nbsp;</div>
              <div class="progress">
              <div class="progress-done def" data-done="70">
              </div>
              </div>
            </div>
            <div class="progress-bar">
            <div>SPD: &nbsp;</div>
            <div class="progress">
                  <div class="progress-done spd" data-done="70"></div>
                  </div>
              </div>
              </div>
      </div>
      `);


      const locations = await fetchLocation(pokemonData)
  const twoMoves = randomMove(pokemonData)

  //speak
  msg.text = `${name} is a ${types[0].type.name} type pokemon. Its regions are ${locations.toString()} and its speacial moves are ${twoMoves.toString()}`;
  speak();

  // Cancel Button
  const skipButton = document.createElement('button');
  skipButton.type = 'button';
  skipButton.textContent = 'Cancel';
  popup.firstElementChild.appendChild(skipButton);

  skipButton.addEventListener(
    'click',
    function () {
      destroyPopup(popup);
    },
    { once: true }
    );

    document.body.appendChild(popup);



    // put a very small timeout before we add the open class
  await wait(50);
  popup.classList.add('open');
  populateStats(pokemonData);
}

// function to populate stats

function populateStats({ stats }){
  const hp = document.querySelector('.hp');
  const atk = document.querySelector('.atk');
  const def = document.querySelector('.def');
  const spd = document.querySelector('.spd');
  const exp = document.querySelector('.exp');

  hp.setAttribute('data-done', stats[0].base_stat);
  hp.style.width = hp.getAttribute('data-done') + '%';
  hp.style.opacity = 1;
  hp.style.background = '#f42a28';

  atk.setAttribute('data-done', stats[1].base_stat);
  atk.style.width = atk.getAttribute('data-done') + '%';
  atk.style.opacity = 1;
  atk.style.background = '#f8d030';

  def.setAttribute('data-done', stats[2].base_stat);
  def.style.width = def.getAttribute('data-done') + '%';
  def.style.opacity = 1;
  def.style.background = '#37a5c6';

  spd.setAttribute('data-done', stats[5].base_stat);
  spd.style.width = spd.getAttribute('data-done') + '%';
  spd.style.opacity = 1;
  spd.style.background = '#7038f8';

}
