import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import NAVIGATION from 'modules/data/navigation.json';

const DROPDOWN_THRESHOLD = 2; //min amount of items before dropdown is displayed
const branding = NAVIGATION.branding.name;
const brandingHref = NAVIGATION.branding.href;

/*
    navLeft.length >= DROPDOWN_THRESHOLD
    ?  <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
        {
            navLeft.map( (nav, i) => {
                const { href, name } = nav;
                return <NavDropdown.Item href={href} key={`nav-dropdown-link_${i}`}>{name}</NavDropdown.Item>
            })
        }
        </NavDropdown>
    : navLeft.map( (nav, i) => <Nav.Link href={nav.href} key={`nav-link_${i}`}>{nav.name}</Nav.Link>)

*/

/* print links, adding a dropdown if number of links exceeds dropdown threshold*/
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
                ? <NavDropdown title="More" id="collasible-nav-dropdown"> 
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
        <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
        <Navbar.Brand href={brandingHref}>{branding}</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            {/* left side  nav*/}
            <Nav>
                <LinkDisplay data={NAVIGATION.left} />
            </Nav>

            {/* right side  nav*/}
            <Nav className="ml-auto">
            <LinkDisplay data={NAVIGATION.right} />
            </Nav>
        </Navbar.Collapse>
        </Navbar>
    )
}