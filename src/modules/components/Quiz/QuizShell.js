import React from 'react'
import ProgressIndicator from 'modules/components/ProgressIndicator';
import AppShell from '../App/AppShell';


const QuizShell = ({calcProgress, children}) => {
    return (
        <AppShell progressBar={ <ProgressIndicator progress={calcProgress()} />}>
          {children}
        </AppShell>
    )
}

export default QuizShell;