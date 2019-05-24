import { requestTranslation, updateTextAreas } from './lango.js';
import { saveFlashCard } from './lango.js';
'use strict';

function CreateCardsPage() {
  return (
    <div id="create-cards-page">
      <Header/>
      <Main/>
      <Footer/>
    </div>
  );
}

function Header() {
  return (
    <header>
      <TopLeftButton/>
      <Logo/>
    </header>
  );
}

function Main() {
  return (
    <main>
      <Cards/>
      <BottomRightButton/>
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

function TopLeftButton() {
  return (
    <div id="top-left-button-container">
      <button id="top-left-button">Start Review</button>
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

function BottomRightButton() {
  return (
    <div id="bottom-right-button-container">
      <button id="bottom-right-button"
      onClick={() => saveFlashCard()}>
        Save
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
      <p id="user-name">UserName</p>
    </div>
  );
}

ReactDOM.render(
  <CreateCardsPage/>,
  document.getElementById('root')
);