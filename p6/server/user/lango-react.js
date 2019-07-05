var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { requestTranslation, updateTextAreas, createRequest, getUserName, flipCard, getInput, getTranslation, clearCards, clearEntry } from './lango.js';

// MAKE AJAX REQUEST TO CHECK IF USER HAS ANYCARDS
var cards = void 0; // global array to hold onto users cards
var url = '../cards';
var xhr = createRequest('GET', url);
xhr.onload = function () {
  var response = xhr.responseText;
  cards = JSON.parse(response);
  if (cards.length) {
    console.log("Found cards, going to review page");
    ReactDOM.render(React.createElement(LangoApp, { value: 1 }), document.getElementById('root'));
  } else {
    console.log("Didnt find cards, going to create cards page");
    ReactDOM.render(React.createElement(LangoApp, { value: 0 }), document.getElementById('root'));
  }
  // GET USER NAME AFTER WE LOAD THE PAGE
  getUserName();
};
xhr.onerror = function () {
  console.log("Error in checking for cards.");
};
xhr.send();
// END OF REQUEST

var LangoApp = function (_React$Component) {
  _inherits(LangoApp, _React$Component);

  function LangoApp(props) {
    _classCallCheck(this, LangoApp);

    var _this = _possibleConstructorReturn(this, (LangoApp.__proto__ || Object.getPrototypeOf(LangoApp)).call(this, props));

    _this.state = {
      page: props.value
    };

    _this.handleClick = function () {
      if (_this.state.page) {
        _this.setState({ page: 0 });
      } else {
        if (cards.length === 0) {
          alert('You do not have any cards to review! Make some first.');
        } else {
          _this.setState({ page: 1 });
        }
      }
      getUserName();
    };
    return _this;
  }

  _createClass(LangoApp, [{
    key: 'renderPage',
    value: function renderPage(i) {
      if (i) {
        return React.createElement(ReviewCardsPage, {
          buttonHandler: this.handleClick
        });
      } else {
        return React.createElement(CreateCardsPage, {
          buttonHandler: this.handleClick
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return this.renderPage(this.state.page);
    }
  }]);

  return LangoApp;
}(React.Component);

function CreateCardsPage(props) {
  return React.createElement(
    'div',
    { id: 'create-cards-page' },
    React.createElement(Header, {
      topButton: 'Start Review',
      buttonHandler: props.buttonHandler
    }),
    React.createElement(Main, null),
    React.createElement(Footer, null)
  );
}

function ReviewCardsPage(props) {
  return React.createElement(
    'div',
    { id: 'review-cards-page' },
    React.createElement(Header, {
      topButton: 'Add',
      buttonHandler: props.buttonHandler
    }),
    React.createElement(RMain, null),
    React.createElement(Footer, null)
  );
}

function Header(props) {
  return React.createElement(
    'header',
    null,
    React.createElement(TopLeftButton, {
      value: props.topButton,
      buttonHandler: props.buttonHandler
    }),
    React.createElement(Logo, null)
  );
}

function Main() {
  return React.createElement(
    'main',
    null,
    React.createElement(Cards, null),
    React.createElement(BottomRightButton, {
      value: 'Save',
      handleClick: saveFlashCard
    })
  );
}

function Footer() {
  return React.createElement(
    'footer',
    null,
    React.createElement(UserName, null)
  );
}

function TopLeftButton(props) {
  return React.createElement(
    'div',
    { id: 'top-left-button-container' },
    React.createElement(
      'button',
      { id: 'top-left-button', onClick: function onClick() {
          return props.buttonHandler();
        } },
      props.value
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

function BottomRightButton(props) {
  return React.createElement(
    'div',
    { id: 'bottom-right-button-container' },
    React.createElement(
      'button',
      { id: 'bottom-right-button',
        onClick: function onClick() {
          return props.handleClick(cards);
        } },
      props.value
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
    React.createElement('p', { id: 'user-name' })
  );
}

var RMain = function (_React$Component2) {
  _inherits(RMain, _React$Component2);

  function RMain(props) {
    _classCallCheck(this, RMain);

    var _this2 = _possibleConstructorReturn(this, (RMain.__proto__ || Object.getPrototypeOf(RMain)).call(this, props));

    _this2.state = {
      flipped: false,
      currentCardInfo: { card: cards[0], index: 0 }
    };

    _this2.handleClick = function () {
      _this2.isCorrect();
      if (_this2.state.flipped) {
        clearEntry();
      }
      flipCard(_this2.state.flipped);
      _this2.setState({ flipped: !_this2.state.flipped });
    };

    _this2.handleKey = function (event) {
      var keyCode = event.keyCode || event.which;
      if (keyCode === 13) {
        _this2.isCorrect();
        if (_this2.state.flipped) {
          clearEntry();
        }
        flipCard(_this2.state.flipped);
        _this2.setState({ flipped: !_this2.state.flipped });
      }
    };

    _this2.isCorrect = function () {
      var userInput = document.getElementById('entry-card').value.trim();
      var trans = document.getElementById('back-card-text');
      var correctBox = document.getElementById('correct-box');
      if (userInput.toLowerCase() === _this2.state.currentCardInfo.card.english.toLowerCase()) {
        trans.innerHTML = "Correct!";
        incrementCorrect(_this2.state.currentCardInfo.index);
        if (!correctBox.classList.contains('display')) {
          correctBox.classList.add('display');
        }
      } else {
        trans.innerHTML = _this2.state.currentCardInfo.card.english;
        if (correctBox.classList.contains('display')) {
          correctBox.classList.remove('display');
        }
      }
    };

    _this2.getNextCard = function () {
      var correct = 0;
      var seen = 0;
      var score = 0;
      var i = 0;
      var current = _this2.state.currentCardInfo.card.translation;
      while (1) {
        i = Math.floor(Math.random() * cards.length);
        correct = cards[i].correct;
        seen = cards[i].shown;
        score = Math.max(1, 5 - correct) + Math.max(1, 5 - seen) + 5 * ((seen - correct) / seen);
        var u = Math.floor(Math.random() * 15);
        if (u <= score && current != cards[i].translation) {
          return {
            card: cards[i],
            index: i
          };
        }
      }
    };

    _this2.showNextCard = function () {
      var cardInfo = _this2.getNextCard();
      clearEntry();
      incrementSeen(cardInfo.index);
      if (_this2.state.flipped) {
        flipCard(true);
        _this2.setState({ flipped: false, currentCardInfo: cardInfo });
      } else {
        _this2.setState({ flipped: false, currentCardInfo: cardInfo });
      }
    };
    return _this2;
  }

  _createClass(RMain, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'main',
        null,
        React.createElement(RCards, {
          handleClick: this.handleClick,
          handleKey: this.handleKey,
          currentCard: this.state.currentCardInfo.card
        }),
        React.createElement(BottomRightButton, {
          value: 'Next',
          handleClick: this.showNextCard
        })
      );
    }
  }]);

  return RMain;
}(React.Component);

function RCards(props) {
  return React.createElement(
    'div',
    { id: 'rcards-container' },
    React.createElement(FlipCard, {
      handleClick: props.handleClick,
      currentCard: props.currentCard
    }),
    React.createElement(EntryCard, {
      handleKey: props.handleKey
    })
  );
}

function FlipCard(props) {
  return React.createElement(
    'div',
    { className: 'flip-card' },
    React.createElement(
      'div',
      { className: 'flip-card-inner' },
      React.createElement(FrontCard, {
        handleClick: props.handleClick,
        value: props.currentCard.translation
      }),
      React.createElement(BackCard, {
        handleClick: props.handleClick,
        value: props.currentCard.english
      })
    )
  );
}

function FrontCard(props) {
  return React.createElement(
    'div',
    { className: 'flip-card-front' },
    React.createElement(
      'div',
      { className: 'top-of-card-container' },
      React.createElement(
        'div',
        { className: 'flip-image-container' },
        React.createElement('input', { type: 'image', id: 'front-flip-image', className: 'more-content', src: '../assets/noun_Refresh_2310283.svg', alt: 'Flip',
          onClick: function onClick() {
            return props.handleClick();
          } })
      )
    ),
    React.createElement(
      'div',
      { className: 'card-text-container' },
      React.createElement(
        'p',
        { id: 'front-card-text', className: 'card-text' },
        props.value
      )
    )
  );
}

function BackCard(props) {
  return React.createElement(
    'div',
    { className: 'flip-card-back' },
    React.createElement(
      'div',
      { className: 'top-of-card-container' },
      React.createElement(
        'div',
        { className: 'flip-image-container' },
        React.createElement('input', { type: 'image', className: 'flip-card',
          src: '../assets/noun_Refresh_2310283.svg', alt: 'Flip',
          onClick: function onClick() {
            return props.handleClick();
          }
        })
      )
    ),
    React.createElement(
      'div',
      { id: 'correct-box', className: 'card-text-container' },
      React.createElement('p', { id: 'back-card-text', className: 'card-text' })
    )
  );
}

function EntryCard(props) {
  return React.createElement(
    'div',
    { id: 'entry-card-container' },
    React.createElement('textarea', { type: 'text', id: 'entry-card',
      placeholder: 'Your Answer Goes Here', minLength: '1',
      maxLength: '150', required: true, className: 'text-card',
      onKeyPress: function onKeyPress(event) {
        return props.handleKey(event);
      }
    })
  );
}

// Asks server to save cards into database
function saveFlashCard(tmp) {
  var trans = getTranslation();
  var eng = getInput();

  if (eng == "") {
    alert("Please enter some text to be translated.");
    clearCards();
    return;
  }

  var url = '../store?english=' + eng + '&russian=' + trans;

  var card = { english: eng, translation: trans, shown: 1, correct: 0 };
  cards = cards.concat(card);

  var xhr = createRequest('GET', url);

  xhr.onload = function () {
    alert("Saved card!");
    clearCards();
  };

  xhr.onerror = function () {
    alert("Failed saving your card!");
  };

  xhr.send();
}

function incrementSeen(i) {
  cards[i].shown += 1;
  var url = "../updateTable?shown=" + cards[i].shown;
  var xhr = createRequest('GET', url);

  xhr.onload = function () {
    var response = xhr.responseText;
    console.log(response);
  };
  xhr.onerror = function () {
    console.log("Error in 'incrementSeen'");
  };
  xhr.send();
}

function incrementCorrect(i) {
  cards[i].correct += 1;
  console.log("Incremented correct to: ", cards[i].correct);
  var url = "../updateTable?correct=" + cards[i].correct;
  var xhr = createRequest('GET', url);
  xhr.onload = function () {
    var response = xhr.responseText;
    console.log(response);
  };
  xhr.onerror = function () {
    console.log("Error in 'incrementSeen'");
  };
  xhr.send();
}