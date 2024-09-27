import React, { useState, useEffect } from "react";
import Card from "./Card";
import axios from "axios";
import './DeckOfCard.css';

const DeckOfCard = () => {
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(function loadDeck() {
    async function loadDeckData() {
      const res = await axios.get(`https://deckofcardsapi.com/api/deck/new/shuffle/`);
      setDeck(res.data);
    }
    loadDeckData();
  }, []);

  const drawCard = async () => {
    try {
      const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/`);
      const card = res.data.cards[0];
      setCards(d => [
        ...d,
        {
          id: card.code,
          name: card.suit + " " + card.value,
          image: card.image,
        },
      ]);
      setDeck(deck => ({ ...deck, remaining: res.data.remaining }));
    }
    catch (err) {
      alert(err);
    }
  }

  const deckShuffle = async () => {
    setIsShuffling(true);
    try {
      const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`);
      setCards([]);
      setDeck(deck => ({ ...deck, remaining: res.data.remaining }));
    }
    catch (err) {
      alert(err);
    }
    finally {
      setIsShuffling(false);
    }
  }

  const renderDrawBtn = () => {
    if (!deck) return null;
    if (deck.remaining === 0) return null;
    return (
      <button
        className="drawBtn"
        onClick={drawCard}
        disabled={isShuffling}
      >DRAW</button>
    );
  }

  const renderShuffleBtn = () => {
    if (!deck) return null;
    return (
      <button
        className="drawBtn"
        onClick={deckShuffle}
        disabled={isShuffling}
      >Shuffle Deck</button>
    )
  }




  return (
    <div className="Deck">
      {renderDrawBtn()}
      {renderShuffleBtn()}
      <div className="Deck-cardarea">
        {cards.map(c => (
          <Card
            key={c.id}
            name={c.name}
            image={c.image}
          />
        ))}
      </div>
    </div>
  )
}

export default DeckOfCard;