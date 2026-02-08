import React, { Fragment, useRef, useState, useEffect, useContext } from 'react';
import './Form.css';
import { cardsContext } from '../context/CardProvider.jsx';
import { errorContext } from '../context/ErrorProvider.jsx';
import Advice from './structure/Advice.jsx';


const Form = ({ setNewDeck }) => {
    const listRef = useRef(null);
    const { setNewError, resetBadCards } = useContext(errorContext);
    const [invalidCards, setInvalidCarts] = useState(false);

    const invalidExpansions = ["HIF",];

    const checkInvalidCards = () => {
        let invalidCard = false; 
        console.log(listRef.current.value)
        for(const expansion of invalidExpansions){
            invalidCard = listRef.current.value.includes(expansion);
        }
        setInvalidCarts(invalidCard);
    }
    /**
     * 
     */
    const formatCardList = () => {
        const formatedCardList = listRef.current.value.split('\n')
            .filter((lane) => {
                const trimedLane = lane.trim();
                return !(trimedLane.includes("Pokémon: ") || trimedLane.includes("Pokemon: ") || trimedLane.includes("Trainer: ") || trimedLane.includes("Entrenador: ") || trimedLane.includes("Energy: ") || trimedLane.includes("Energía: ") || trimedLane === "" || trimedLane.includes("Cartas totales: ") || trimedLane.includes("Total cards: "))
            })
            .map((card) => {
                card = card.trim();
                const match = card.match(/^(\d+)\s+(.+?)\s+([A-Z\d]{2,})\s+(\d+)$/i);
                let returnCard = undefined;
                if (match !== null) {
                    if (match[2].includes('Energy') || match[2].includes('Energía')) {
                        const basicEnergies = new Set([
                            "Energía Lucha", "Fight Energy", "Energía Incolora", "Colorless Energy",
                            "Energía Oscura", "Darkness Energy", "Dark Energy", "Energía Fuego",
                            "Fire Energy", "Energía Planta", "Grass Energy", "Energía Rayo",
                            "Lightning Energy", "Energía Psíquica", "Psychic Energy", "Energía Agua",
                            "Water Energy", "Energía Metálica", "Metal Energy", "Energía Hada", "Fairy Energy"
                        ]);
                        const isBasicEnergy = basicEnergies.has(match[2]) || /^Basic \{[A-Z]\} Energy$/.test(match[2]) || /^Basic \{[A-Z]\} Energy Energy$/.test(match[2]);
                        if (isBasicEnergy) {
                            returnCard = {
                                quantity: match[1],
                                name: match[2]
                            }
                        } else {
                            returnCard = {
                                quantity: match[1],
                                name: match[2],
                                expansion: match[3],
                                number: match[4]
                            }
                        }
                    } else {
                        returnCard = {
                            quantity: match[1],
                            name: match[2],
                            expansion: match[3],
                            number: match[4]
                        }
                    }
                }
                return returnCard;
            });
        if (formatedCardList.includes(null) || formatedCardList.includes(undefined) || formatedCardList.length == 0) {
            setNewError("Error al procesar las cartas, comprueba que se haya copiado correctamente");
        }
        setNewDeck(formatedCardList);
    }

    useEffect(()=>{
        checkInvalidCards();
    },[listRef.current.value])

    /**
     * 
     */
    return (
        <Fragment>
            <form className='deckForm' id='deckForm'>
                <div>
                    {
                        invalidCards && <Advice text={`Las siguientes expansiones no están disponibles: ${invalidExpansions}`} type={"importante"}/>
                    }
                    <textarea
                        autoFocus
                        spellCheck="false"
                        wrap='soft'
                        form='deckForm'
                        ref={listRef}
                        name="deckList"
                        id="deckList"
                        placeholder='Se aceptan mazos importados desde TCG Live y el creador de mazos de Limitless'
                    />
                </div>
                <br />
                <div>
                    <input
                        type="submit"
                        value="Comprobar deck"
                        onClick={(event) => {
                            event.preventDefault();
                            try {
                                formatCardList();
                            } catch (error) {
                                setNewDeck(error.message);
                            }
                        }} />
                </div>
            </form>
        </Fragment>
    )
}
export default Form;