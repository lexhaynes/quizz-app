import React from 'react';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
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
                    if (i < DROPDOWN_THRESHOLD) {
                        return <Nav.Link href={href} key={`nav-link_${i}`}>{name}</Nav.Link>
                    } else {
                        dropdown.push(nav);
                    }
                })
            }
            {
                dropdown.length > 0
                ? <NavDropdown title="More Quizzes" id="collasible-nav-dropdown"> 
                    {
                        dropdown.map( (nav, i) => {
                            const { href, name } = nav;
                            return <NavDropdown.Item href={href} key={`nav-dropdown-link_${i}`}>{name}</NavDropdown.Item>
                        })
                    }
                </NavDropdown>
                : ""
            }
        </>
    );
};

/* TODO: map Navigation */

export default function NavBar() {
    return (
        <Navbar collapseOnSelect expand="md" bg="dark" variant="dark" sticky="top">
        <Navbar.Brand href={brandingHref}>{branding}</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            {/* left side  nav*/}
            <Nav>
                <LinkDisplay data={NAVIGATION.left} />
            </Nav>

        
            <Nav className="ml-auto">
                <Button>
                    Get Updates!
                </Button>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
    )
}