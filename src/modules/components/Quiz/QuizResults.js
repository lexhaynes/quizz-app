import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

const QuizResults = ({results}) => {
    let history = useHistory();

    const redirectHome = () => {
        window.setTimeout( () => {
            history.push("/");            
        }, 250); 
    }

    return (
    <div className="quiz-results">
        <div className="container">
          <h2 className="quiz-title">Result</h2>
          <div>{
              results ? results : redirectHome()
            }</div>
        </div>  
      </div>
    )
}

QuizResults.propTypes = {
    results: PropTypes.string.isRequired,
}

export default QuizResults;
