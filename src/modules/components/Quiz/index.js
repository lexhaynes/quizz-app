import React, {useState, useEffect, useRef} from 'react';

import { shuffle } from 'modules/utils';
import QUESTIONS_ALL from 'modules/data/questions.json';
import MOODS from 'modules/data/moods.json';
import './Quiz.scss';
import NavBar from 'modules/components/NavBar';
import Footer from 'modules/components/Footer';
import Button from 'modules/components/Button';
import ProgressIndicator from 'modules/components/ProgressIndicator';


//remove the over-arching question from the questions data array
const QUESTIONS = QUESTIONS_ALL.slice(1);

/* TODOS: 
- scroll to current active question
- add images to QuestionItem selections
- style QuestionItems uniquely
- style results button
- style results uniquely
- make the header + footer make sense w real links
- consider changing the scoring to be based on frequency of certain type (eg A, B, C, D) vs cumulative score, since the 
score seems to always result to neutral...
- style the results
- the repetition in the selections state of the ID field vs selections index bothers me... what if the questionID becomes alpha numeric??
*/


const QuizTitle = () => {
  return (
    <div className="quiz-title">
      <h1 className="text-center">{ QUESTIONS_ALL[0].title }</h1>
    </div>
    
  )
}

const QuestionList = ({activeQuestionIndex, updateState, currentSelections, currentRef, scrollToActive}) => {
  return (
      <div className="question-list">
      {
        QUESTIONS.map(question => {
          const questionData = {
            id: question._id,
            title: question.title,
            options: question.options
          };
          return (
                  <QuestionItem
                    key={`question-item-row_${question._id}`}
                    questionData={questionData}
                    updateSelection={updateState.selection}
                    updateActiveIndex={updateState.activeIndex}
                    isActive={activeQuestionIndex === question._id}
                    currentSelections={currentSelections}
                    currentRef={currentRef}
                    scrollToActive={scrollToActive}
                    /> 
          )     
        })
      }
      </div>
  );
}

const QuestionItem = ({questionData, updateSelection, updateActiveIndex, isActive, currentSelections, currentRef, scrollToActive}) => {
  const {id, title, options} = questionData;
  const shuffledOptions = shuffle(options);

  const handleOptionSelect = (e) => {
    scrollToActive();
    updateSelection(
      id,
      e.target.value,
    );
  }

  const handleButtonClick = (e) => {
    const { direction } = e.target.dataset;
    if (direction === "back") {
      updateActiveIndex.decrement();
    } else {
      updateActiveIndex.increment();
    } 
    //need to scroll back here, but state update is async!!!
    e.preventDefault();
  }

  return (
    <div className="question-item" data-isactive={isActive} ref={isActive ? currentRef : null}>
        <div className="question-item-title">{title}</div>

      {
        shuffledOptions.map( (opt, i) => {
          return (
            <span key={`question-item-option_${i}`} >
              <label htmlFor={`question-item-option_${i}`}>{opt.title}</label>
              <input
                type="radio" 
                className="question-item-option" 
                id={`question-item-option_${i}`} 
                label={opt.title}
                onClick={handleOptionSelect}
                name={title}
                value={opt.weight}   
                />
              </span>
          )
        })
      }
    
    <QuestionItemNav 
      id={id}
      handleButtonClick={handleButtonClick}
      currentSelections={currentSelections}
      isActive={isActive} />

    </div> 

  )
}

/*
  only show QuestionItemNav if the current question is active
*/

const QuestionItemNav = ({id, handleButtonClick, currentSelections, isActive}) => {

if (isActive && currentSelections.length) {
    return (
      <div className="question-item-nav">
          {
            id !== 0
              ?  <button data-direction="back" onClick={handleButtonClick}>Go back</button> 
              : ""
          }
          {
            id !== QUESTIONS.length - 1 && currentSelections[id]
            ?  <button data-direction="next" onClick={handleButtonClick}>Next</button>
            : ""
          }
        </div>
    )
  } 
  return null;

}


const CompleteQuiz = ({handleButtonClick, showBackBtn}) => {
  return (
    <div className="complete-quiz">
      <h2>Get Results</h2>
        {
          showBackBtn
          ? <Button data-action="back" onClick={handleButtonClick}>Go Back</Button>
          : "" 
        }
        <Button data-action="results" onClick={handleButtonClick}>Get Results</Button>
    </div>
  )
}

const QuizResults = ({result}) => {
  return (
    <div className="quiz-results">
      <h2>Result</h2>
      <div>{result}</div>
    </div>
  )
};


const Quiz = () => {
  const [selections, setSelections] = useState([]);
  const [currentActiveIndex, setCurrentActiveIndex] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [showCompleteBackBtn, setShowCompleteBackBtn] = useState(true);
  const [showResults, setShowResults] = useState(false);

  const currentActiveQuestionRef = useRef(null);
  const executeScroll = () => {
    console.log("scroll to active: ", currentActiveQuestionRef.current);
    currentActiveQuestionRef.current.scrollIntoView();    
  }
  // run this function from an event handler or an effect to execute scroll 

/*
  shape of selection state:
  [
    {
      question_id,
      question_title,
      selected_weight
    }
  ]
  */

  /*  this is a callback run after state is updated, since setState runs async checking the state might yield inaccurate result! 
      check if all the questions have been answered
  */
  useEffect(() => {
    //check if all the questions have been answered
    if (selections.length === QUESTIONS.length) {
      setShowComplete(true);
    }

    console.log("state update");
    //executeScroll();

  }, [selections, currentActiveIndex]);

  /* state update functions 
    activeIndex (function): update the activeIndex state with the user's selection
    selection (object with 2 functions): update the selections state with the user's selection
  */
  const updateState = {

    /* update the selection state */
    selection: (question_id, selected_weight) => {
      const newSelection = {
        question_id,
        selected_weight: Number(selected_weight)
      };
  
      setSelections(prevState => {      
          //we must put newState at index question_id!
          let copiedState = [...prevState];
          copiedState[question_id] = newSelection;
          return copiedState
      });
  
      //increment active index
      updateState.activeIndex.increment();
    },

    /* update the activeIndex state */
    activeIndex: {
      increment: () => {
        //if user has selected all options, set currentActiveIndex to the last question
        if (selections.length === QUESTIONS.length) { 
          setCurrentActiveIndex(QUESTIONS.length - 1);
        } else { //assume active question is the NEXT question
          setCurrentActiveIndex(prevState => prevState + 1);
        }
      },
      decrement: () => {
        //assume active question is the PREV question
        setCurrentActiveIndex(prevState => prevState - 1);
      }
    },
  };

  /* 
    calcProgress: return the completion of the quiz as a percemt
  */
  const calcProgress = () => {
    /* logic based on num completed questions, even if user goes back to prev question */
    /* return Math.floor(selections.length / QUESTIONS.LENGTH * 100); */

    /* logic based on current active index, whether or not user has completed successive questions */
    return currentActiveIndex / QUESTIONS.length * 100;
  }

  /*
    calcScore: calculate the user's final score 
  */
  const calcScore = () => {
    let accumulator = 0;
    if (selections.length > 0) {
      console.log("selections: ", selections);
      selections.map(item => accumulator += item.selected_weight);
    }
    return accumulator;
  }

  /* 
    interpretScore: return the user's mood based on their score
  */
  const interpretScore = () => {
    const score = calcScore();

    console.log("score is: " + score);
    
    for (let i = 0; i < MOODS.length; i++) {
      let currentThreshold = MOODS[i].max_threshold;
      let nextThreshold = i === MOODS.length - 1 
        ? 0 //set next threshold to 0
        : MOODS[i+1].max_threshold; //get the threshold at the next index
      let mood = MOODS[i].mood;

      if (score <= currentThreshold && score > nextThreshold) {
        return mood;
      }
    }
  }

  const handleQuizComplete = (e) => {
    const { action } = e.target.dataset;
    if (action === "back") {
     //hide back button
      setShowCompleteBackBtn(false);
     //make the last item active again
     setCurrentActiveIndex(prevState => prevState - 1);
    } else { //show results
      setShowResults(true);
    }
    e.preventDefault();
  }


  return (
        <div className="quiz">

        <header className="header sticky top-0 shadow-sm">
          <NavBar />
          <ProgressIndicator progress={calcProgress()} />
        </header>
 

        <div className="container">
          <QuizTitle />
          <QuestionList 
            activeQuestionIndex={currentActiveIndex}
            updateState={updateState} 
            currentSelections={selections}
            currentRef={currentActiveQuestionRef}
            scrollToActive={executeScroll}
            />
            {
              showComplete
              ? <CompleteQuiz 
                  showBackBtn={showCompleteBackBtn} 
                  handleButtonClick={handleQuizComplete} 
                  />
              : ""
            }
            {
              showResults
              ? <QuizResults result={interpretScore()}/>
              : ""
            }
        </div>
        <Footer />
      </div>
  );
}

export default Quiz;
