import React, { Fragment, useContext, useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './ShowDeck.css';
import usePokeAPI from '../Hooks/usePokeAPI.js';
import { cardsContext } from '../context/CardProvider.jsx';
import Card from './Card.jsx';
import Loading from './Loading.jsx';
import Advice from './structure/Advice.jsx';
import { errorContext } from '../context/ErrorProvider.jsx';

const ShowDeck = ({ deck }) => {
    const { deckAPI, loading } = usePokeAPI(deck);
    const { contextDeck, setContextDeck, setContextNumberOfHands } = useContext(cardsContext);
    const [cardQuantity, setCardQuantity] = useState(0);
    const [numberOfHands, setNumberOfHands] = useState(10);
    const { setNewError, badCards, resetBadCards } = useContext(errorContext);
    const numberOfHandsRef = useRef(null);

    const redirectRoute = (e) => {
        if (cardQuantity !== 60) {
            const message = cardQuantity > 60
                ? "Hay más de 60 cartas, ¿estás seguro?"
                : "Hay menos de 60 cartas, ¿estás seguro?";

            if (!window.confirm(message)) {
                e.preventDefault();
                return;
            }
        }
    }
    const errorMessage = () => {
        let badCardsString = "";
        if (badCards !== undefined) {
            badCardsString = `[${badCards}]`;
        }
        setNewError(`Ha habido un error al cargar algunas de las cartas en las siguientes líneas: \n ${badCardsString}`);
        resetBadCards();
    }
    /**
     * Cuando detecta cambios en "deckAPI" (export de 'usePokeAPI.js'), realiza las siguientes acciones:
     * 1- Obtiene si han habido errores en alguna carta y muestra en qué líneas hay una carta "mala". Esto se le pasa al componente de mensaje de error y como "errorMessage";
     * 2- Settea el númeor de manos que por defecto es 10.
     * 3- Elimina todas las cartas inválidas (undefined) y las manda al contexto en un solo objeto.
     * Nota: Primero se comprueba si se setteado el 'deckAPI' o sigue siendo Undefined para realizar las acciones.
     */
    useEffect(() => {
        if (deckAPI !== undefined && deckAPI.length > 0) {
            if (deckAPI.includes(undefined)) {
                errorMessage();
            }
            setContextNumberOfHands(numberOfHands);
            setContextDeck(deckAPI.filter((card) => {
                return card !== undefined;
            }));
            const cards = deckAPI.reduce((acc, card) => card !== undefined ? acc + Number(card.quantity) : acc + 0, 0);
            setCardQuantity(cards);
        }
    }, [deckAPI])

    /**
     * Cuando el usuario cambia en el select el número de pruebas, el useEffect detecta el cambio y lo settea en el contexto.
     */
    useEffect(() => {
        if (numberOfHandsRef.current !== null) {
            setContextNumberOfHands(numberOfHandsRef.current.value);
        }
    }, [numberOfHandsRef])

    /* COMPROBACIONES Y CARGAS */
    //Comprobaciones básicas para saber si deben cargar los componentes
    //Si el deck del contexto no es undefined, no está vacío y tampoco están cargando las cartas: true 
    const load = contextDeck != undefined && contextDeck.length > 0 && !loading;

    //Cargar avisos si el número de manos es mayor a 100
    const advises = (numberOfHands) => {
        if (numberOfHands < 100) {
            return null;
        } else {
            return (
                <div className='advices'>
                    <Advice text={" Solo se mostrarán las 100 primeras manos"} type={"aviso"} />
                    {
                        numberOfHands > 10000 && <Advice text={" Puede que tarde en cargar o que tu navegador bloquee la página."} type={"importante"} />
                    }
                </div>
            );
        }
    }

    //Return
    return (
        <Fragment>
            <section>
                <h1 id='title'>Listado Cartas (Total: <label style={cardQuantity != 60 ? { color: 'red' } : { color: 'green' }}> {cardQuantity} </label>)</h1>
                {
                    /**
                     * 
                     */
                    load ?
                        cardQuantity > 7 ?
                            <NavLink key={window.crypto ? crypto.randomUUID?.() : Math.random().toString(36).substring(2, 15)} id='calc' to="/results" onClick={redirectRoute} >Calcular Mulligans (Pruebas: {numberOfHands})</NavLink>
                            : <div id='calc'>Deben haber mínimo 7 cartas</div>
                        : <></>
                }
                {
                    advises(numberOfHands)
                }
                {
                    /**
                     * 
                     */
                    load && cardQuantity > 7 && <div>
                        <h1 htmlFor="numberOfHands">Número de pruebas:  <select ref={numberOfHandsRef} className='numberOfHands' name="numberOfHands" id="numberOfHands" onChange={() => {
                            setContextNumberOfHands(numberOfHandsRef.current.value);
                            setNumberOfHands(numberOfHandsRef.current.value);
                        }}>
                            <option value="10">10</option>
                            <option value="100">100</option>
                            <option value="1000">1000</option>
                            <option value="10000">10000</option>
                            <option value="100000">100000</option>
                            <option value="1000000">1000000</option>
                            <option value="10000000">10000000</option>
                        </select>
                        </h1>
                    </div>
                }
                {
                    /**
                     * 
                     */
                    <div className='cards'>
                        {
                            loading && <Loading />
                        }
                        {
                            load ? contextDeck.map((card) => {
                                if (card !== undefined) {
                                    return <Card
                                        className="card"
                                        key={window.crypto ? crypto.randomUUID?.() : Math.random().toString(36).substring(2, 15)}
                                        cardInfo={card} />
                                }

                            })
                                : "Seleccione el deck"
                        }

                    </div>
                }
            </section>
        </Fragment>
    )
}
export default ShowDeck;