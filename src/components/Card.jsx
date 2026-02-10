import React, { Fragment } from "react";
import './Card.css';
import Fight_Energy from './../assets/img/Fight_Energy.png';
import Fire_Energy from './../assets/img/Fire_Energy.png';
import Water_Energy from './../assets/img/Water_Energy.png';
import Grass_Energy from './../assets/img/Grass_Energy.png';
import Psychic_Energy from './../assets/img/Psychic_Energy.png';
import Dark_Energy from './../assets/img/Dark_Energy.png';
import Fairy_Energy from './../assets/img/Fairy_Energy.png';
import Light_Energy from './../assets/img/Light_Energy.png';
import Metal_Energy from './../assets/img/Metal_Energy.png';
import Placeholder from './../assets/img/placeHolder.png';
import { useTranslation } from "react-i18next";

const selectImage = (card) => {
    switch (card) {
        case "Fight Energy":
            return Fight_Energy;
        case "Darkness Energy":
            return Dark_Energy;
        case "Fire Energy":
            return Fire_Energy;
        case "Grass Energy":
            return Grass_Energy;
        case "Lightning Energy":
            return Light_Energy;
        case "Psychic Energy":
            return Psychic_Energy;
        case "Water Energy":
            return Water_Energy;
        case "Metal Energy":
            return Metal_Energy;
        case "Fairy Energy":
            return Fairy_Energy;
        default:
            return null;
    }
}
const Card = ({ cardInfo }) => {
    const {t,i18n} = useTranslation();
    if (cardInfo.cardType == t('pokemon') || cardInfo.cardType == t('trainer')) {
        return (
            <Fragment key={cardInfo.cardId}>
                <div className="card" key={cardInfo.cardId}>
                    <div className="head">
                        {/* <label className="title">{cardInfo.name}</label> */}
                        <label htmlFor="card" className="quantity">{cardInfo.quantity}</label>
                    </div>
                    <div className="body">
                        <picture id="image">
                            <img
                                src={cardInfo.image}
                                onError={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = Placeholder;
                                }}
                                alt={cardInfo.name}
                            />
                        </picture>
                    </div>
                    {/* <div className="cardInfo">
                        <h3 id="set">{cardInfo.expansion}</h3>
                        <h3>ID: {cardInfo.cardNumber}</h3>
                    </div> */}
                </div>
            </Fragment>
        )
    } else {
        return (<Fragment key={cardInfo.name}>
            <div className="card" key={cardInfo.name}>
                <div className="head">
                    {/* <label className="title">{cardInfo.name}</label> */}
                    <label htmlFor="card" className="quantity">{cardInfo.quantity}</label>
                </div> 

                <div className="body">
                    {
                        cardInfo.image ?
                            <img
                                src={cardInfo.image}
                                onError={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = Placeholder;
                                }}
                                alt={cardInfo.name}
                            />
                            : <img
                                src={selectImage(cardInfo.name)}
                                alt={cardInfo.name} />
                    }
                </div>
                {/* {
                    cardInfo.expansion && <div className="cardInfo">
                        <h3>Set: {cardInfo.expansion}</h3>
                        <h3>ID: {cardInfo.cardNumber}</h3>
                    </div>
                } */}
            </div>
        </Fragment>
        )
    }
}
export default Card;