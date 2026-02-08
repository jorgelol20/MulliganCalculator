import React, { Fragment } from "react";
import LogoTCGDexAPI from './../../assets/img/logo-TCGDex.svg'
import './Footer.css';
const Footer = () => {
    return (
        <Fragment>
            <footer>
                <p>Creado por <a href="https://github.com/jorgelol20">Jorge Colomer Albertos</a> con el uso de <a href="https://tcgdex.dev/es"><img src={LogoTCGDexAPI} alt="Logo TCGDex"/></a></p>
            </footer>
        </Fragment>
    )
}
export default Footer;