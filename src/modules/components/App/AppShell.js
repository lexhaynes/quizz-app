import PropTypes from 'prop-types';
import NavBar from 'modules/components/NavBar';
import Footer from 'modules/components/Footer';

const AppShell = ({ progressBar, classList, children }) => {
    return (
        <div className={classList ? classList : ""}>
        <header className="header sticky top-0 shadow-sm z-10">
          <NavBar />
          {progressBar}
        </header>
    
        <main className="container w-5/6 lg:max-w-screen-lg min-h-screen">
          {children}
        </main>
        <Footer />
      </div>
    )

  }

AppShell.propTypes = {
    progressBar: PropTypes.element,
    classList: PropTypes.string,
}

export default AppShell;