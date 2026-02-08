import React, { useCallback, useContext, useEffect, useState } from 'react';
import TCGdex from '@tcgdex/sdk';
import expansionDictionary from './../assets/db/expansionSet.json';
import { errorContext } from '../context/ErrorProvider.jsx';

const usePokeAPI = (deck) => {

    //Utils
    const tcgdex = new TCGdex('es');
    const expansions = expansionDictionary;

    //States
    const [deckAPI, setDeckAPI] = useState(undefined);
    const [loading, setLoading] = useState(false);

    //Context
    const { addNewBadCard } = useContext(errorContext);

    //Functions
    /**
     * 
     * @param {String} card 
     * @returns 
     */
    const getCard = async (card) => {
        console.log(card)
        const responseCard = await tcgdex.card.get(`${card}`);
        if (!responseCard) {
            return undefined;
        } else {
            return responseCard;
        }
    }

    /**
     * Formatear la carta a seleccionar
     * @param {Object} card 
     * @returns Array
     */
    const formatCard = (card) => {
        try {
            let expansion = undefined;
            if (card.expansion) {
                expansion = expansions[card.expansion];
            }
            if (expansion !== undefined) {
                let cardNumber = card.number;
                if (expansion.includes("me") || expansion.includes("sv")) {
                    if (cardNumber < 10) {
                        cardNumber = "00" + cardNumber;
                    } else if (cardNumber < 100) {
                        cardNumber = "0" + cardNumber;
                    }
                }
                return [(expansion + "-" + cardNumber), card.quantity];
            } else if (card.name.includes("Energía") || card.name.includes("Energy")) {
                switch (card.name) {
                    case "Energía Lucha":
                    case "Fight Energy":
                    case "Basic {F} Energy":
                        return ["Fight Energy", card.quantity];

                    case "Energía Oscura":
                    case "Darkness Energy":
                    case "Dark Energy":
                    case "Basic {D} Energy":
                        return ["Darkness Energy", card.quantity];

                    case "Energía Fuego":
                    case "Fire Energy":
                    case "Basic {R} Energy":
                        return ["Fire Energy", card.quantity];

                    case "Energía Planta":
                    case "Grass Energy":
                    case "Basic {G} Energy":
                        return ["Grass Energy", card.quantity];

                    case "Energía Rayo":
                    case "Lightning Energy":
                    case "Basic {L} Energy":
                        return ["Lightning Energy", card.quantity];

                    case "Energía Psíquica":
                    case "Psychic Energy":
                    case "Basic {P} Energy":
                        return ["Psychic Energy", card.quantity];

                    case "Energía Agua":
                    case "Water Energy":
                    case "Basic {W} Energy":
                        return ["Water Energy", card.quantity];

                    case "Energía Metálica":
                    case "Metal Energy":
                    case "Basic {M} Energy":
                        return ["Metal Energy", card.quantity];

                    case "Energía Hada":
                    case "Fairy Energy":
                    case "Basic {Y} Energy":
                        return ["Fairy Energy", card.quantity];

                    default:
                        return ["Energy", card.quantity];
                }
            }
            return undefined;
        } catch (error) { }
    }

    /**
     * Iterar el array de cartas que nos ha dado el usuario
     * @param {Array} cardsList 
     */
    const iterateCards = async (cardsList) => {
        if (cardsList !== null) {
            const cardListAPI = cardsList.map(async (card, index) => {
                const formatedCard = formatCard(card);
                if (formatedCard !== undefined) {
                    if (formatedCard[0].includes("Energy")) {
                        return {
                            name: formatedCard[0],
                            quantity: formatedCard[1],
                            type: "Energy"
                        }
                    }
                    let cardAPI = await getCard(formatedCard[0]);
                    console.log(cardAPI)
                    if (cardAPI !== undefined) {
                        return [cardAPI, formatedCard[1]];
                    }
                    addNewBadCard(" " + (index + 2));
                    return null;
                }
                addNewBadCard(" " + (index + 2));
                return null;
            });
            const finalDeckAPI = await Promise.all(cardListAPI);
            formatApiDeck(finalDeckAPI);
        } else {
            setNewError("Error al procesar las cartas, comprueba que se haya copiado correctamente");
        }

    }

    /**
     * Formatear el DECK obtenido de la API
     * @returns 
     */
    const formatApiDeck = (deckToFormat) => {
        let formatedDeckAPI = [];
        if (deckToFormat.length !== 0) {
            formatedDeckAPI = deckToFormat.map((card) => {
                if (card != null && card != undefined) {
                    if (card.name) {
                        return card;
                    }
                    if(card[0].id === "sv04-175"){
                        card[0].category = "Pokémon";
                        card[0].stage = "Básico";
                    }
                    switch (card[0].category) {
                        case "Pokémon":
                            if (card[0].abilities) {
                                if(card[0].id === "me01-028"){
                                    card[0].stage = "Básico";
                                }
                                return {
                                    name: card[0].name,
                                    expansion: card[0].set.name,
                                    cardNumber: card[0].localId,
                                    cardId: card[0].id,
                                    cardType: card[0].category,
                                    pokemonType: card[0].stage,
                                    rarity: card[0].rarity,
                                    abilitieText: card[0].abilities.effect,
                                    image: card[0].image + '/low.webp',
                                    quantity: card[1]
                                }
                            } else {
                                return {
                                    name: card[0].name,
                                    expansion: card[0].set.name,
                                    cardNumber: card[0].localId,
                                    cardId: card[0].id,
                                    cardType: card[0].category,
                                    pokemonType: card[0].stage,
                                    rarity: card[0].rarity,
                                    image: card[0].image + '/low.webp',
                                    quantity: card[1]
                                }
                            }
                        default:
                            return {
                                name: card[0].name,
                                expansion: card[0].set.name,
                                cardNumber: card[0].localId,
                                cardId: card[0].id,
                                cardType: card[0].category,
                                rarity: card[0].rarity,
                                image: card[0].image + '/low.webp',
                                quantity: card[1]
                            }
                    }
                }
                return undefined;
            })
        }
        setLoading(false);
        setDeckAPI(formatedDeckAPI);
    }

    //
    const getDeckAPI = (cards) => {
        if (cards != undefined) {
            iterateCards(cards);
        }
    };
    useEffect(() => {
        getDeckAPI(deck)
    }, [deck])

    return { deckAPI, loading };
}
export default usePokeAPI;