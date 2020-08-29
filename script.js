const baseURL = `https://pokeapi.co/api/v2/pokemon?limit=4`;
const cards = document.querySelector('.cards');
const msg = new SpeechSynthesisUtterance();
msg.text = 'Welcome to Pokedex';

function speak(){
  speechSynthesis.speak(msg);
}

function wait(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getPokeData(){
  const res = await fetch(baseURL);
  const data = await res.json();
  data.results.forEach(pokemon => {
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
  <img src="https://pokeres.bastionbot.org/images/pokemon/${id}.png" alt="${name}"/>
  ${name}
  <br>
  ${tempArr}
  </div>`;
  cards.insertAdjacentHTML('afterbegin',cardData);
  const cardEl =  document.querySelector('.card');
  setBgColor(cardEl,tempArr);
  cardEl.addEventListener('click', function () {
    promptBox(pokemonData);
  })
}

//on page load
getPokeData();

async function destroyPopup(popup) {
  popup.classList.remove('open');
  await wait(1000);
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
            <img src="https://pokeres.bastionbot.org/images/pokemon/${id}.png" alt="Pokemon"/>
          </div>
          <div class="info">
            <p class="name">${name}</p>
            <div class="progress-bar">
              <div>HP: &nbsp;</div>
              <div class="progress">
              <div class="progress-done" data-done="70">
              </div>
        </div>
            </div>
            <div class="progress-bar">
              <div>HP: &nbsp;</div>
              <div class="progress">
              <div class="progress-done" data-done="70">
              </div>
        </div>
            </div>
            <div class="progress-bar">
              <div>HP: &nbsp;</div>
              <div class="progress">
              <div class="progress-done" data-done="70">
              </div>
        </div>
            </div>
            <div class="progress-bar">
              <div>HP: &nbsp;</div>
              <div class="progress">
              <div class="progress-done" data-done="70">
              </div>
        </div>
            </div>
            </div>
    </div>
    `);

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
}

const playButton = document.querySelector('button');
playButton.addEventListener('click',speak);

//

function pr(){
  const progress = document.querySelector('.progress-done');

  progress.style.width = progress.getAttribute('data-done') + '%';
  progress.style.opacity = 1;

  progress.setAttribute('data-done', 50);
  progress.style.width = progress.getAttribute('data-done') + '%';
}
