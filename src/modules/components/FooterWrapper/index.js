import React from 'react'
import './FooterWrapper.scss';

export default function FooterWrapper({children}) {
    return (
        <div className="footer-wrapper mt-5">
            {children}
        </div>
    )
}
