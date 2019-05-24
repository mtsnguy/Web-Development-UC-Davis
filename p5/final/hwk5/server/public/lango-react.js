import { requestTranslation, updateTextAreas } from './lango.js';
import { saveFlashCard } from './lango.js';
'use strict';

function CreateCardsPage() {
  return React.createElement(
    'div',
    { id: 'create-cards-page' },
    React.createElement(Header, null),
    React.createElement(Main, null),
    React.createElement(Footer, null)
  );
}

function Header() {
  return React.createElement(
    'header',
    null,
    React.createElement(TopLeftButton, null),
    React.createElement(Logo, null)
  );
}

function Main() {
  return React.createElement(
    'main',
    null,
    React.createElement(Cards, null),
    React.createElement(BottomRightButton, null)
  );
}

function Footer() {
  return React.createElement(
    'footer',
    null,
    React.createElement(UserName, null)
  );
}

function TopLeftButton() {
  return React.createElement(
    'div',
    { id: 'top-left-button-container' },
    React.createElement(
      'button',
      { id: 'top-left-button' },
      'Start Review'
    )
  );
}

function Logo() {
  return React.createElement(
    'div',
    { id: 'title-container' },
    React.createElement(
      'h1',
      { id: 'title' },
      'Lango!'
    )
  );
}

function Cards() {
  return React.createElement(
    'div',
    { id: 'cards-container' },
    React.createElement(EnglishCard, null),
    React.createElement(TranslationCard, null)
  );
}

function BottomRightButton() {
  return React.createElement(
    'div',
    { id: 'bottom-right-button-container' },
    React.createElement(
      'button',
      { id: 'bottom-right-button',
        onClick: function onClick() {
          return saveFlashCard();
        } },
      'Save'
    )
  );
}

function EnglishCard() {
  return React.createElement(
    'div',
    { id: 'english-card-container',
      className: 'text-card-container' },
    React.createElement('textarea', { type: 'text', id: 'english-card',
      placeholder: 'English', minLength: '1',
      maxLength: '150', required: true, className: 'text-card',
      onKeyDown: function onKeyDown() {
        return requestTranslation(event);
      },
      onKeyUp: function onKeyUp() {
        return updateTextAreas(event);
      } })
  );
}

function TranslationCard() {
  return React.createElement(
    'div',
    { id: 'translation-card-container',
      className: 'text-card-container' },
    React.createElement('textarea', { type: 'text',
      id: 'translation-card', className: 'text-card',
      placeholder: 'Translation', readOnly: true })
  );
}

function UserName() {
  return React.createElement(
    'div',
    { id: 'user-name-container' },
    React.createElement(
      'p',
      { id: 'user-name' },
      'UserName'
    )
  );
}

ReactDOM.render(React.createElement(CreateCardsPage, null), document.getElementById('root'));