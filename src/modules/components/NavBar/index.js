import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'heroicons-react';
import Button from 'modules/components/Button';
import Dropdown from 'modules/components/Dropdown';
import NAVIGATION from 'modules/data/navigation.json';
import './NavBar.scss';

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
        //mobile-first
        <nav className="navbar">
             <div className="nav-left">
                <Link className="logo" to={logoHref}>{logo}</Link>
            </div>

            <div className="nav-right">  
                <Button>
                    <Menu />
                </Button>
            </div>

            <div className="expanded block">
                {
                    NAVIGATION.links.map((nav, i) => {
                        return (
                            <span className="block px-4 py-2 text-sm text-gray-700 
                hover:bg-gray-100 hover:text-gray-900;" key={`nav-link_${i}`}>
                                <Link to={nav.href}>{nav.name}</Link>
                            </span>
                        )
                    })
                }

                <div className="hr" />
                <Button variant="primary">Get Updates!</Button>
            </div>


        </nav>

       /*  <nav className="nav-bar">
            <div className="container">

                <div className="nav-left">
                    <Link className="logo" to={logoHref}>{logo}</Link>
                </div>
                
                <div className="nav-right">  
                    <LinkDisplay data={NAVIGATION.links} />
                    <Button classList="ml-2" variant="primary">Get Updates!</Button>
                </div>
                
            </div>
        </nav> */
    )
}