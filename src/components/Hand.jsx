import React, { Fragment } from 'react';
import Card from './Card';
import './Hand.css';
const Hand = ({ hand }) => {
    return (
        <Fragment>
            <div className='hand'>
                <div id='header'>
                    <h1><label style={hand.isMulligan ? { color: 'red' } : { color: 'green' }}>{hand.isMulligan ? "Mulligan" : "No mulligan"}</label></h1>
                </div>
                <div className='cards'>
                    {
                        hand.hand.map((card) => {
                            return <Card
                                className="card"
                                loading="lazy"
                                key={Math.random().toString(36).substring(2, 15)}
                                cardInfo={card}
                            />
                        })
                    }
                </div>
            </div>
        </Fragment>
    );
}
export default Hand;