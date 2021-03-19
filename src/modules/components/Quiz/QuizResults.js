import PropTypes from 'prop-types';
import PageTitle from 'modules/components/PageTitle'
import Button from 'modules/components/Button'


const QuizResults = ({results, refreshQuiz}) => {


return (
    <div className="quiz-results">
        <div className="container">
          <PageTitle title="Results" />
          <div> { results } </div>
          <div className="my-12">
            <Button variant="primary" classList="mx-auto block" onClick={refreshQuiz}>Re-Take Quiz</Button>
          </div>
        </div>  
      </div>
    )
}

QuizResults.propTypes = {
    results: PropTypes.string.isRequired,
    refreshQuiz: PropTypes.func.isRequired
}

export default QuizResults;
