import React from 'react';
import ReactDOM from 'react-dom';
import {CSSTransition} from 'react-transition-group';

import './Model.css';
import Backdrop from './Backdrop';

const ModelOverlay = props => {

    const content =(
        <div className={`model ${props.className}`} style={props.style}>
            <header className={`model_header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>
            <from onSubmit={props.onSubmit ? props.onSubmit : (event) => event.preventDefault()}>
                <div classname={`model_content ${props.contentClass}`}>
                    {props.childern}
                </div>
                <footer className={`model_footer ${props.footerClass}`}>
                    {props.footer}
                </footer>
            </from>
        </div>
    )

    return ReactDOM.createPortal(content,document.getElementById('model-hook'));
}

const Model = (props) => {
    return(
        <React.Fragment>
            {props.show && <Backdrop onClick={props.onCancle} />}
            <CSSTransition in={props.show} mountOnEnter unmountOnExit timeout={200} classNames="model">
                <ModelOverlay {...props} />
            </CSSTransition>
        </React.Fragment>
    )

} 

export default Model;