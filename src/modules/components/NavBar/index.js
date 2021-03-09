import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Button from 'modules/components/Button';
import NAVIGATION from 'modules/data/navigation.json';
import './NavBar.scss';

const logo = NAVIGATION.logo.name;
const logoHref = NAVIGATION.logo.href;







/* TODO: map Navigation */

export default function NavBar() {
    return (
       
        <Navbar expand="sm">
            
           <div className="container">
                <Navbar.Brand href={logoHref} className="logo">{logo}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    <NavDropdown title="More Quizzes">
                        {
                            NAVIGATION.links.map((nav, i) => <NavDropdown.Item href={nav.href} key={`nav-link_${i}`}>{nav.name}</NavDropdown.Item>)
                        }
        
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/about">About</NavDropdown.Item>
                    </NavDropdown>
                    </Nav>
                    <Button classList="ml-2" variant="primary">Get Updates!</Button>
                </Navbar.Collapse>
           </div>
        </Navbar>

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