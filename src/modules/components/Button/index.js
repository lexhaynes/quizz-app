import React from 'react';
import './Button.scss';
import { PropTypes } from 'prop-types';

const Button = ({classList, variant, children, ...props}) => {
    return (
        <button className={`button ${variant ? variant : ""} ${classList ? classList : "" }`} {...props}>
            {children}
        </button>
    )
}

export default Button;

Button.propTypes = {
    classList: PropTypes.string, 
    variant: PropTypes.string,
}