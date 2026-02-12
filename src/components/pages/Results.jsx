import React, { Fragment, useContext, useEffect, useState } from 'react';
import { cardsContext } from '../../context/CardProvider';
import { NavLink } from 'react-router-dom';
import lodash from 'lodash';
import Loading from '../Loading.jsx';
import HandContainer from '../HandContainer.jsx';
import GraphMulligans from '../GraphMulligans.jsx';
import GraphCards from '../GraphCards.jsx';
import './Results.css';
import { useTranslation } from 'react-i18next';


const Results = () => {
    const { contextDeck, contextNumberOfHands: numberOfHands } = useContext(cardsContext);
    const [loading, setLoading] = useState(true);
    const [hands, setHands] = useState([]);
    const [results, setResults] = useState(undefined);
    const [numberOfMulligans, setNumberOfMulligans] = useState(0);
    const [display, setDisplay] = useState(false);
    const { t, i18n } = useTranslation();


    if (contextDeck === undefined || contextDeck.length == 0) {
        return (
            <Fragment>
                <h1>{t("errorResultsTitle")}</h1>
                <NavLink id='calc' to='/'>{t('backTitle')}</NavLink>
            </Fragment>
        )
    }

    const calculate = async () => {
        let tempHands = [];
        let tempDeck = [];
        let cards = [];

        for (let card of contextDeck) {
            for (let i = 0; i < card.quantity; i++) {
                cards.push(card);
            }
        }
        for (let i = 0; i < numberOfHands; i++) {
            cards = lodash.shuffle(cards);
            let newHand = [cards[0], cards[1], cards[2], cards[3], cards[4], cards[5], cards[6]];
            let isMulligan = true;

            for (let card of newHand) {
                if (card.cardType === "Pokémon" && card.pokemonType === "Básico" || card.cardType === "Pokemon" && card.pokemonType === "Basic") {
                    isMulligan = false;
                }
            }

            tempHands.push({
                "hand": newHand,
                "isMulligan": isMulligan
            });
        }

        //Viendo al cantidad de cartas que sale
        let tempDeckMap = new Map();
        for (let hand of tempHands) {
            for (let card of hand.hand) {
                if (tempDeckMap.has(card)) {
                    card.appears = card.appears + 1;
                    tempDeckMap.set(card);
                } else {
                    card.appears = 1;
                    tempDeckMap.set(card);
                }
            }
        }
        for (let [card, value] of tempDeckMap) {
            tempDeck.push(card);
        }
        for (let card of tempDeck) {
            card.appears = (card.appears * 100 / numberOfHands).toFixed(1);
        }
        let tempNumberOfMulligans = 0;
        for (let hand of tempHands) {
            if (hand.isMulligan) {
                tempNumberOfMulligans++;
            }
        }
        setNumberOfMulligans(tempNumberOfMulligans);
        setHands(tempHands);
        setResults(tempDeck);
        setLoading(false);
    }


    useEffect(() => {
        async function tempFunction() {
            const timer = setTimeout(() => {
                calculate();
            }, 1000)
            return () => clearTimeout(timer);
        }
        tempFunction();
    }, [contextDeck])

    return (
        <Fragment>
            <NavLink key={Math.random().toString(36).substring(2, 15)} id='calc' to='/calc'>{t('backTitle')}</NavLink>
            <h1>{loading ? t('loadingResults') : t('resultsTitle')}</h1>
            <br />
            <div className='results'>
                <h1>{
                    loading && <Loading key={Math.random().toString(36).substring(2, 15)} />
                }</h1>

                <div className='finalResults'>
                    {
                        !loading && <button className='button' onClick={() => {
                            setDisplay(!display);
                        }}>
                            {display ? t('hideResults') : t('showResults')}
                        </button>
                    }
                    {
                        !loading && display &&
                        <div id='graphViwer' style={{enabled: !display}}>
                            {/* Gráfico múlligans */}
                            <div id='mulligans'>
                                <GraphMulligans data={{ labels: ["Mulligans", "No mulligans"], datasets: [{ data: [numberOfMulligans, (numberOfHands - numberOfMulligans)], backgroundColor: ["red", "green"], borderColor: "black", borderWith: 2 }] }} />
                            </div>
                            {/* Gráfico cartas */}
                            <div id='cards'>
                                <GraphCards cards={results} />
                            </div>
                        </div>
                    }
                </div>
                {
                    !loading &&
                    <div id='handsViwer'>
                        <HandContainer
                            hands={hands}
                        />
                    </div>
                }

            </div>
        </Fragment>
    )
}
export default Results;