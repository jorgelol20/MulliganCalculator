import React, { Fragment, useRef, useState, useEffect, useContext } from 'react';
import './Form.css';
import { cardsContext } from '../context/CardProvider.jsx';
import { errorContext } from '../context/ErrorProvider.jsx';
import Advice from './structure/Advice.jsx';
import { useTranslation } from 'react-i18next';


const Form = ({ setNewDeck }) => {
    const { t, i18n } = useTranslation();
    const listRef = useRef(null);
    const { setNewError, resetBadCards } = useContext(errorContext);
    /**
     * 
     */
    const formatCardList = () => {
        const formatedCardList = listRef.current.value.split('\n')
            .filter((lane) => {
                const trimedLane = lane.trim();
                return !(trimedLane.includes("Pokémon: ") || trimedLane.includes("Pokemon: ") || trimedLane.includes("Trainer: ") || trimedLane.includes("Entrenador: ") || trimedLane.includes("Energy: ") || trimedLane.includes("Energía: ") || trimedLane === "" || trimedLane.includes("Cartas totales: ") || trimedLane.includes("Total Cards: "))
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
            console.log(formatedCardList)
        if (formatedCardList.includes(null) || formatedCardList.includes(undefined) || formatedCardList.length == 0) {
            setNewError(t('errorFormat'));
        }
        setNewDeck(formatedCardList);
    }
    /**
     * 
     */
    return (
        <Fragment>
            <form className='deckForm' id='deckForm'>
                <div>
                    {
                        i18n.language == "es" &&<Advice text={"Algunas expansiones como HIF no están disponibles aún. Las actuales funcionan sin ningún problema. Disculpar las molestias"} type={"importante"} />
                    }
                    <textarea
                        autoFocus
                        spellCheck="false"
                        wrap='soft'
                        form='deckForm'
                        ref={listRef}
                        name="deckList"
                        id="deckList"
                        placeholder={t('textArea')}
                    />
                </div>
                <br />
                <div>
                    <input
                        type="submit"
                        value={t('checkButton')}
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