import React from 'react';
import {useState, useEffect} from 'react';
import { shuffle } from 'modules/utils';
import QUESTIONS_ALL from 'modules/data/questions.json';
import MOODS from 'modules/data/moods.json';
import './App.scss';
import { ProgressBar, Container} from 'react-bootstrap';
import NavBar from 'modules/components/NavBar';

//remove the over-arching question from the questions data array
const QUESTIONS = QUESTIONS_ALL.slice(1);

/* TODOS: 
- start styling!
- the repetition in the selections state of the ID field vs selections index bothers me... what if the questionID becomes alpha numeric??
*/

const ProgressIndicator = ({progress}) => {
  return <ProgressBar animated now={progress} />    
};


const QuestionList = ({activeQuestionIndex, updateState, currentSelections}) => {
  return (
    <Container fluid="md" className="question_list"> 
    {
      QUESTIONS.map(question => {
        const questionData = {
          id: question._id,
          title: question.title,
          options: question.options
        };
        return (
              <QuestionItem
                key={`question_item_${question._id}`} 
                questionData={questionData}
                updateSelection={updateState.selection}
                updateActiveIndex={updateState.activeIndex}
                isActive={activeQuestionIndex === question._id}
                currentSelections={currentSelections}
                />  
         
        )     
      })
    }
    </Container>
  );
}

const QuestionItem = ({questionData, updateSelection, updateActiveIndex, isActive, currentSelections}) => {
  const {id, title, options} = questionData;
  const shuffledOptions = shuffle(options);

  const handleOptionSelect = (e) => {
    updateSelection(
      id,
      e.target.title,
      e.target.value,
    );
  }

  const handleButtonClick = (e) => {
    const { direction } = e.target.dataset;
    if (direction === "back") {
      updateActiveIndex.decrement()
    } else {
      updateActiveIndex.increment();
    } 
    e.preventDefault();
  }

  return (
    <div className="question_item" data-isactive={isActive}>
      <h2>{title}</h2>
      {
        shuffledOptions.map( (opt, i) => {
          return (
            <React.Fragment key={`question_item_option_${i}`} >
              <input 
                className="question_item_option" 
                id={`question_item_option_${i}`} 
                onClick={handleOptionSelect}
                type="radio"
                name={title}
                value={opt.weight}
                title={opt.title}
                />
                <label htmlFor={`question_item_option_${i}`}>{opt.title}</label>
            </React.Fragment>
          )
        })
      }
      <div className="button-wrapper">
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
    </div>
  )
};

const CompleteQuiz = ({handleButtonClick, showBackBtn}) => {
  return (
    <div className="button-wrapper">
      {
        showBackBtn
        ? <button data-action="back" onClick={handleButtonClick}>Go Back</button>
        : "" 
      }
      <button data-action="results" onClick={handleButtonClick}>Get Results</button>
    </div>
  )
}

const Results = ({result}) => {
  return (
    <>
     <h2>Result: {result} </h2>
    </>
  )
};




const App = () => {
  const [selections, setSelections] = useState([]);
  const [currentActiveIndex, setCurrentActiveIndex] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [showCompleteBackBtn, setShowCompleteBackBtn] = useState(true);
  const [showResults, setShowResults] = useState(false);
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
  }, [selections]);

  /* state update functions 
    activeIndex (function): update the activeIndex state with the user's selection
    selection (object with 2 functions): update the selections state with the user's selection
  */
  const updateState = {

    /* update the selection state */
    selection: (question_id, selected_title, selected_weight) => {
      const newSelection = {
        question_id,
        selected_title,
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
    const completedQuestions = selections.length;
    const totalQuestions = QUESTIONS.length;
    return Math.floor(completedQuestions / totalQuestions * 100);
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
    <>
        <NavBar />
        <ProgressIndicator progress={calcProgress()} />
        <QuestionList 
          activeQuestionIndex={currentActiveIndex}
          updateState={updateState} 
          currentSelections={selections}
          />
          {
            showComplete
            ? <CompleteQuiz showBackBtn={showCompleteBackBtn} handleButtonClick={handleQuizComplete} />
            : ""
          }
          {
            showResults
            ? <Results result={interpretScore()}/>
            : ""
          }  
      </>
    

  );
}

export default App;
