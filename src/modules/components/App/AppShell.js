import PropTypes from 'prop-types';
import NavBar from 'modules/components/NavBar';
import Footer from 'modules/components/Footer';


const AppShell = ({ progressBar, children }) => {
    return (
        <>
        <header className="header sticky top-0 shadow-sm z-10">
          <NavBar />
          {progressBar}
        </header>
    
        <div className="container w-5/6 lg:max-w-screen-lg">
          {children}
        </div>
        <Footer />
      </>
    )

  }

AppShell.propTypes = {
    progressBar: PropTypes.element
}

export default AppShell;