import React, {useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from "heroicons-react";
import PropTypes from 'prop-types';

import Button from 'modules/components/Button';
import './Dropdown.scss';


const Dropdown = ({title, data, removeChevron, children}) => {
    //TODO: see: https://usehooks.com/useOnClickOutside/
    
    // Create a ref that we add to the element for which we want to detect outside clicks
    const ref = useRef();

    const [isOpen, setIsOpen] = useState(false);
    
    const toggleDropdown = () => setIsOpen(!isOpen);
  
     // Call hook passing in the ref and a function to call on outside click
    useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <div className="dropdown-wrapper" ref={ref}>

        <Button 
            classList="dropdown-trigger"
            variant="link" 
            onClick={toggleDropdown}>
              { title ? <span className="float-left">{title}</span> : ""}
                
                { //is there a better way than nested conditonals?
                    isOpen 
                      ? <ChevronUp className={removeChevron ? "hidden" : ""} /> 
                      : <ChevronDown className={removeChevron ? "hidden" : ""} />
                }
                
            </Button>

        <div className={`dropdown-menu ${isOpen ? '': 'hidden'}`} role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <div className="dropdown-inner" role="none">
            { data 
              ? data.map( (nav, i) => {
                    const { href, name } = nav;
                    return <Link 
                        key={`nav-dropdown-link_${i}`}
                        to={href} 
                        className="menu-item" role="menuitem"
                    >{name}</Link>
                })
              : ""}     

              { children 
              
                ? React.Children.map(children, child => <span className="menu-item">{child}</span>)
                : "" 
              
              }     
            </div>
        </div>
    </div>
    )
}

// Hook
function useOnClickOutside(ref, handler) {
    useEffect(
      () => {
        const listener = event => {
            
          // Do nothing if clicking ref's element or descendent elements
          if (!ref.current || ref.current.contains(event.target)) {
            return;
          }

    
  
          handler(event);
        };
  
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
  
        return () => {
          document.removeEventListener('mousedown', listener);
          document.removeEventListener('touchstart', listener);
        };
      },
      // Add ref and handler to effect dependencies
      // It's worth noting that because passed in handler is a new ...
      // ... function on every render that will cause this effect ...
      // ... callback/cleanup to run every render. It's not a big deal ...
      // ... but to optimize you can wrap handler in useCallback before ...
      // ... passing it into this hook.
      [ref, handler]
    );
    }

  Dropdown.propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    removeChevron: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.shape({
      href: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }))
  };

export default Dropdown;