import React, {useState, useEffect, useRef} from 'react';

import { shuffle } from 'modules/utils';
import QUESTIONS_ALL from 'modules/data/questions.json';
import MOODS from 'modules/data/moods.json';


import Button from 'modules/components/Button';
import { ArrowCircleRight, ArrowCircleLeft } from 'heroicons-react';

import AppShell from 'modules/components/App/AppShell';
import QuizShell from 'modules/components/Quiz/QuizShell';
import QuizResults from 'modules/components/Quiz/QuizResults';
import PageTitle from 'modules/components/PageTitle'

import './Quiz.scss';


//remove the over-arching question from the questions data array
const QUESTIONS = QUESTIONS_ALL.slice(1);

/* TODOS: 
- QuestionItem options
    -make whole option selectable
    - add a little animation on select
- style the home page
- add images to QuestionItem selections
- style results
- the repetition in the selections state of the ID field vs selections index bothers me... what if the questionID becomes alpha numeric??
*/



const QuestionList = ({activeQuestionIndex, updateState, currentSelections, currentRef}) => {
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
                    /> 
          )     
        })
      }
      </div>
  );
}

const QuestionItem = ({questionData, updateSelection, updateActiveIndex, isActive, currentSelections, currentRef}) => {
  const {id, title, options} = questionData;
  const shuffledOptions = shuffle(options);

  const handleOptionSelect = (e) => {
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
  
  const isVisible = () => {
    return currentSelections[id] !== undefined;
  }

  return (
    <div className="question-item" data-isactive={isActive} data-isvisible={isVisible()} ref={isActive ? currentRef : null}>
        <div className="question-item-title">{title}</div>
        <div className="question-item-options">
          {
            shuffledOptions.map( (opt, i) => {
              return (
                <div className="question-item-option" key={`question-item-option_${i}`} >
                  <div className="question-item-image" ></div>
                  <input
                    type="radio" 
                    id={`question-item-option_${i}`} 
                    label={opt.title}
                    onClick={handleOptionSelect}
                    name={title}
                    value={opt.weight}   
                    />
                   <label htmlFor={`question-item-option_${i}`}>{opt.title}</label>

                  </div>
              )
            })
          }
        </div>
    
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
      <>
      <div className="hr" />
      <div className="button-group">
          {
            id !== 0
              ?  <Button variant="white" data-direction="back" onClick={handleButtonClick}>
                <span className="flex pointer-events-none">
                  <ArrowCircleLeft className="fill-current text-indigo-500" /> 
                  <span className="ml-2">Back</span>
                </span>
              
                </Button> 
              : ""
          }
          {
            id !== QUESTIONS.length - 1 && currentSelections[id]
            ?  <Button variant="white"  data-direction="next" onClick={handleButtonClick}>
                <span className="flex pointer-events-none">
                  <span className="mr-2">Next</span>
                  <ArrowCircleRight className="fill-current text-indigo-500" /> 
                </span>
                </Button>
            : ""
          }
        </div>
        </>
    )
  } 
  return null;

}


const EndQuiz = ({handleButtonClick, showBackBtn}) => {
  return (
    <div className="end-quiz my-12">
      <div className="container">
      <div className="button-group">
      {
          showBackBtn
          ? <Button variant="primary" data-action="back" onClick={handleButtonClick}>Go Back</Button>
          : "" 
        }
        <Button variant="primary" data-action="results" onClick={handleButtonClick}>Get Results</Button>
      </div>

      </div>

    </div>
  )
}


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
const Quiz = () => {
  const [selections, setSelections] = useState([]);
  const [currentActiveIndex, setCurrentActiveIndex] = useState(0);
  const [showEndQuiz, setShowEndQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showEndQuizBackBtn, setShowEndQuizBackBtn] = useState(true);

  const currentActiveQuestionRef = useRef(null);

  const scrollToActive = () => {
    const yOffset = document.querySelector('header.header').offsetHeight * -1; //offset to accomodate for header 
    const element = currentActiveQuestionRef.current;
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({top: y, behavior: 'smooth'});

  }


  /*  this is a callback run after state is updated, since setState runs async checking the state might yield inaccurate result! 
      check if all the questions have been answered
  */
  useEffect(() => {
    //check if all the questions have been answered
    if (selections.length === QUESTIONS.length) {
      setShowEndQuiz(true);
    }
  }, [selections]);

  /* callback for after currentActiveIndex changes */
  useEffect(() => {
    if (currentActiveIndex < QUESTIONS.length) {
      scrollToActive(); 
      //also hide the previous question here perhaps?
    }
  }, [currentActiveIndex])

  /* callback for after the results are displaying */
  useEffect(() => {
    if (showResults) window.scrollTo({top: 0});
  }, [showResults])

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

    /* refresh the state to default vals*/
    refresh: () => {
      setSelections([]);
      setCurrentActiveIndex(0);
      setShowEndQuiz(false);
      setShowResults(false);
      setShowEndQuizBackBtn(true);
    }
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
      selections.map(item => accumulator += item.selected_weight);
    }
    return accumulator;
  }

  /* 
    interpretScore: return the user's mood based on their score
  */
  const interpretScore = () => {
    const score = calcScore();
    
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
      setShowEndQuizBackBtn(false);
     //make the last item active again
     setCurrentActiveIndex(prevState => prevState - 1);
    } else { //display results
      setShowResults(true);
    }
    e.preventDefault();
  }

  if (showResults) {
    return (
      <AppShell>
          <QuizResults results={interpretScore()} refreshQuiz={updateState.refresh} />
      </AppShell>   
    )
  } 
  return (
      
      <QuizShell classList="quiz" calcProgress={calcProgress}>
        <PageTitle title={QUESTIONS_ALL[0].title} />
        <QuestionList 
          activeQuestionIndex={currentActiveIndex}
          updateState={updateState} 
          currentSelections={selections}
          currentRef={currentActiveQuestionRef}
          scrollToActive={scrollToActive}
          />
          {
            showEndQuiz 
            ? <EndQuiz 
              showBackBtn={showEndQuizBackBtn} 
              handleButtonClick={handleQuizComplete} 
              />
          : null
          }
      </QuizShell>
  );
}

export default Quiz;
