import React from 'react';
import NAVIGATION from 'modules/data/navigation.json';
import './NavBar.scss'

const DROPDOWN_THRESHOLD = 0; //min amount of items before dropdown is displayed
const branding = NAVIGATION.branding.name;
const brandingHref = NAVIGATION.branding.href;


/* print links, adding a dropdown if number of links exceeds dropdown threshold */
const LinkDisplay = ({data}) => {
    let dropdown = [];
    return (
        <>
            {
                data.map((nav, i) => {
                    const { href, name } = nav;
                    let navLink;
                    if (i < DROPDOWN_THRESHOLD) {
                        navLink = <a href={href} key={`nav-link_${i}`}>{name}</a>
                    } else {
                        dropdown.push(nav);
                    }
                    return navLink;
                })
            }
            {
                dropdown.length > 0
                ? <span title="More Quizzes"> 
                    {
                        dropdown.map( (nav, i) => {
                            const { href, name } = nav;
                            return <a href={href} key={`nav-dropdown-link_${i}`}>{name}</a>
                        })
                    }
                </span>
                : ""
            }
        </>
    );
};

/* TODO: map Navigation */

export default function NavBar() {
    return (
        <nav className="navbar">
            <a href={brandingHref}>{branding}</a>
            <LinkDisplay data={NAVIGATION.left} />
            <button>Get Updates!</button>
        </nav>
    )
}