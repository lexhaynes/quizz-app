import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'modules/components/Button';
import Dropdown from 'modules/components/Dropdown';
import NAVIGATION from 'modules/data/navigation.json';
import './NavBar.scss'

const DROPDOWN_THRESHOLD = 0; //min amount of items before dropdown is displayed
const logo = NAVIGATION.logo.name;
const logoHref = NAVIGATION.logo.href;



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
                        navLink = <Link to={href} key={`nav-link_${i}`}>{name}</Link>
                    } else {
                        dropdown.push(nav);
                    }
                    return navLink;
                })
            }
            {
                dropdown.length > 0
                ? <Dropdown data={dropdown} title="More Quizzes" />  
                : ""
            }
        </>
    );
};

/* TODO: map Navigation */

export default function NavBar() {
    return (
        <>
        <nav className="nav-bar">
            <div className="container">
                <div className="nav-left">
                    <Link className="logo" to={logoHref}>{logo}</Link>
                </div>
                
                <div className="nav-right">
                    <LinkDisplay data={NAVIGATION.left} />
                    <Button variant="primary">Get Updates!</Button>
                </div>
                
            </div>
        </nav>
        </>
    )
}