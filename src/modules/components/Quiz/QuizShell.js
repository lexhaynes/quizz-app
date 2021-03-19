import React from 'react';
import PropTypes from 'prop-types';
import ProgressIndicator from 'modules/components/ProgressIndicator';
import AppShell from '../App/AppShell';


const QuizShell = ({calcProgress, classList, children}) => {
    return (
        <AppShell classList={classList ? classList : ""} progressBar={ <ProgressIndicator progress={calcProgress()} />}>
          {children}
        </AppShell>
    )
}

QuizShell.propTypes = {
  calcProgress: PropTypes.func,
  progressBar: PropTypes.element,
  classList: PropTypes.string,
}

export default QuizShell;