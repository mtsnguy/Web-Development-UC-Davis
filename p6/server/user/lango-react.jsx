import { requestTranslation, updateTextAreas, createRequest, getUserName, flipCard, getInput, getTranslation, clearCards, clearEntry } from './lango.js';

// MAKE AJAX REQUEST TO CHECK IF USER HAS ANYCARDS
let cards; // global array to hold onto users cards
let url = '../cards';
let xhr = createRequest('GET', url);
xhr.onload = function () {
  let response = xhr.responseText;
  cards = JSON.parse(response);
  if (cards.length) {
    console.log("Found cards, going to review page");
    ReactDOM.render(
      <LangoApp value={1}/>,
      document.getElementById('root')
    );
  } else {
    console.log("Didnt find cards, going to create cards page");
    ReactDOM.render(
      <LangoApp value={0}/>,
      document.getElementById('root')
    );
  }
  // GET USER NAME AFTER WE LOAD THE PAGE
  getUserName();
}
xhr.onerror = function () {
  console.log("Error in checking for cards.");
}
xhr.send();
// END OF REQUEST

class LangoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: props.value,
    }

    this.handleClick = () => {
      if(this.state.page) {
        this.setState({page: 0});
      } else {
        if (cards.length === 0) {
          alert('You do not have any cards to review! Make some first.');
        } else {
          this.setState({page: 1});
        }
      }
      getUserName();
    }
  }

  renderPage(i) {
    if (i) {
      return (
        <ReviewCardsPage
        buttonHandler={this.handleClick}
        />
      );
    } else {
      return (
        <CreateCardsPage
        buttonHandler={this.handleClick}
        />
      );
    }
  }

  render() {
    return (
      this.renderPage(this.state.page)
    );
  }
}

function CreateCardsPage(props) {
  return (
    <div id="create-cards-page">
      <Header
      topButton='Start Review'
      buttonHandler={props.buttonHandler}
      />
      <Main/>
      <Footer/>
    </div>
  );
}

function ReviewCardsPage(props) {
  return (
    <div id="review-cards-page">
      <Header
      topButton='Add'
      buttonHandler={props.buttonHandler}
      />
      <RMain/>
      <Footer/>
    </div>
  );
}

function Header(props) {
  return (
    <header>
      <TopLeftButton
      value={props.topButton}
      buttonHandler={props.buttonHandler}
      />
      <Logo/>
    </header>
  );
}

function Main() {
  return (
    <main>
      <Cards/>
      <BottomRightButton
      value='Save'
      handleClick={saveFlashCard}
      />
    </main>
  );
}

function Footer() {
  return (
    <footer>
      <UserName/>
    </footer>
  );
}

function TopLeftButton(props) {
  return (
    <div id="top-left-button-container">
      <button id="top-left-button" onClick={() => props.buttonHandler()}>
        {props.value}
      </button>
    </div>
  );
}

function Logo() {
  return (
    <div id="title-container">
      <h1 id="title">Lango!</h1>
    </div>
  )
}

function Cards() {
  return (
    <div id="cards-container">
      <EnglishCard/>
      <TranslationCard/>
    </div>
  );
}

function BottomRightButton(props) {
  return (
    <div id="bottom-right-button-container">
      <button id="bottom-right-button"
      onClick={() => props.handleClick(cards)}>
        {props.value}
      </button>
    </div>
  );
}

function EnglishCard() {
  return (
    <div id ="english-card-container"
    className="text-card-container">
      <textarea type="text" id="english-card"
      placeholder="English" minLength="1"
      maxLength="150" required className="text-card"
      onKeyDown = {() => requestTranslation(event)}
      onKeyUp = {() => updateTextAreas(event)}></textarea>
    </div>
  );
}

function TranslationCard() {
  return (
    <div id="translation-card-container"
    className="text-card-container">
      <textarea type="text"
      id="translation-card" className="text-card"
      placeholder="Translation" readOnly></textarea>
    </div>
  );
}

function UserName() {
  return (
    <div id="user-name-container">
      <p id="user-name"></p>
    </div>
  );
}

class RMain extends React.Component {
  constructor(props) {
    super(props);

    this.state =  {
      flipped: false,
      currentCardInfo: {card: cards[0], index: 0}
    }

    this.handleClick = () => {
      this.isCorrect();
      if(this.state.flipped) {
        clearEntry();
      }
      flipCard(this.state.flipped);
      this.setState({flipped: !this.state.flipped});
    }

    this.handleKey = (event) => {
      let keyCode = event.keyCode || event.which;
      if(keyCode === 13) {
        this.isCorrect();
        if(this.state.flipped) {
          clearEntry();
        }
        flipCard(this.state.flipped);
        this.setState({flipped: !this.state.flipped});
      }
    }

    this.isCorrect = () => {
      let userInput = document.getElementById('entry-card').value.trim();
      let trans = document.getElementById('back-card-text');
      let correctBox = document.getElementById('correct-box');
      if (userInput.toLowerCase() === this.state.currentCardInfo.card.english.toLowerCase()) {
        trans.innerHTML = "Correct!";
        incrementCorrect(this.state.currentCardInfo.index);
        if (!correctBox.classList.contains('display')) {
          correctBox.classList.add('display');
        }
      } else {
        trans.innerHTML = this.state.currentCardInfo.card.english;
        if (correctBox.classList.contains('display')) {
          correctBox.classList.remove('display');
        }
      }
    }

    this.getNextCard = () => {
      let correct = 0;
      let seen = 0;
      let score = 0;
      let i = 0;
      let current = this.state.currentCardInfo.card.translation;
      while (1) {
        i = Math.floor(Math.random()*(cards.length));
        correct = cards[i].correct;
        seen = cards[i].shown;
        score = ( (Math.max(1, 5-correct)) + Math.max(1,5-seen) + 5 * ( (seen-correct)/seen) );
        let u = Math.floor((Math.random() * 15));
        if (u <= score && current != cards[i].translation) {
          return {
            card: cards[i],
            index: i
          };
        }
      }
    }

    this.showNextCard = () => {
      let cardInfo = this.getNextCard();
      clearEntry();
      incrementSeen(cardInfo.index);
      if (this.state.flipped) {
        flipCard(true);
        this.setState({flipped: false, currentCardInfo: cardInfo});
      } else {
        this.setState({flipped: false, currentCardInfo: cardInfo});
      }
    }
  }

  render() {
    return(
      <main>
        <RCards
        handleClick={this.handleClick}
        handleKey={this.handleKey}
        currentCard={this.state.currentCardInfo.card}
        />
        <BottomRightButton
        value='Next'
        handleClick={this.showNextCard}
        />
      </main>
    );
  }
}

function RCards(props) {
  return (
    <div id="rcards-container">
      <FlipCard
      handleClick={props.handleClick}
      currentCard={props.currentCard}
      />
      <EntryCard
      handleKey={props.handleKey}
      />
    </div>
  );
}

function FlipCard(props) {
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        <FrontCard
        handleClick={props.handleClick}
        value={props.currentCard.translation}
        />
        <BackCard
        handleClick={props.handleClick}
        value={props.currentCard.english}
        />
      </div>
    </div>
  );
}

function FrontCard(props){
  return (
    <div className="flip-card-front">
      <div className="top-of-card-container">
        <div className="flip-image-container">
          <input type="image" id="front-flip-image" className="more-content" src="../assets/noun_Refresh_2310283.svg" alt = "Flip"
          onClick={() => props.handleClick()}/>
        </div>
      </div>
      <div className="card-text-container">
        <p id="front-card-text" className='card-text'>{props.value}</p>
      </div>
    </div>
  );
}

function BackCard(props){
  return (
    <div className="flip-card-back">
      <div className="top-of-card-container">
        <div className="flip-image-container">
          <input type="image" className="flip-card"
          src="../assets/noun_Refresh_2310283.svg" alt = "Flip"
          onClick={() => props.handleClick()}
          />
        </div>
      </div>
      <div id="correct-box" className="card-text-container">
        <p id="back-card-text" className='card-text'></p>
      </div>
    </div>
  );
}

function EntryCard(props){
  return (
    <div id ="entry-card-container">
      <textarea type="text" id="entry-card"
      placeholder="Your Answer Goes Here" minLength="1"
      maxLength="150" required className="text-card"
      onKeyPress={(event) => props.handleKey(event)}
      >
      </textarea>
    </div>
  );
}

// Asks server to save cards into database
function saveFlashCard(tmp) {
  let trans = getTranslation();
  let eng = getInput();

  if(eng == "") {
    alert("Please enter some text to be translated.");
    clearCards();
    return;
  }

  let url = '../store?english='+eng+'&russian='+trans;

  let card = {english: eng, translation: trans, shown: 1, correct: 0};
  cards = cards.concat(card);

  let xhr = createRequest('GET', url);

  xhr.onload = function() {
    alert("Saved card!");
    clearCards();
  }

  xhr.onerror = function() {
    alert("Failed saving your card!");
  }

  xhr.send();
}

function incrementSeen(i) {
  cards[i].shown += 1;
  let url = "../updateTable?shown="+cards[i].shown;
  let xhr = createRequest('GET', url);

  xhr.onload = function() {
    let response = xhr.responseText;
    console.log(response);
  }
  xhr.onerror = function() {
    console.log("Error in 'incrementSeen'");
  }
  xhr.send();
}

function incrementCorrect(i) {
  cards[i].correct += 1;
  console.log("Incremented correct to: ", cards[i].correct);
  let url = "../updateTable?correct="+cards[i].correct;
  let xhr = createRequest('GET', url);
  xhr.onload = function() {
    let response = xhr.responseText;
    console.log(response);
  }
  xhr.onerror = function() {
    console.log("Error in 'incrementSeen'");
  }
  xhr.send();
}