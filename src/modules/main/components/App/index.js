import React from 'react';
import './App.scss';
import QUESTIONS from 'modules/main/data/questions.json';
import MOODS from 'modules/main/data/moods.json';
import {useState} from 'react';

/* TODO: 
- don't show "next" unless user has completed the current question
- change shape of state from object to array of objects. no reason for it to be object.
- add more questions (there should be at least 10)
*/

const ProgressIndicator = ({progress}) => {
  return (
    <>
      <h2>Progress: </h2>{progress} 
    </>
  )
};

const Results = ({result}) => {
  return (
    <>
      <h2>Result:</h2> {result} 
    </>
  )
};


const QuestionList = ({activeQuestionIndex, decrementActiveIndex, incrementActiveIndex, saveSelection}) => {
 
  return (
    <form className="question_list"> 
    {
      QUESTIONS.filter(question => question.heirarchy !== "primary").map( (question) => {
        return <QuestionItem
            key={`question_item_${question._id}`} 
            id={question._id}
            title={question.title} 
            options={question.options} 
            saveSelection={saveSelection}
            isActive={activeQuestionIndex === question._id}
            decrementActiveIndex={decrementActiveIndex}
            incrementActiveIndex={incrementActiveIndex}
            />       
      })
    }
    </form>
  );
}

const QuestionItem = ({id, title, options, saveSelection, isActive, decrementActiveIndex, incrementActiveIndex}) => {
  
  const handleOptionSelect = (e) => {
    saveSelection(
      id,
      e.target.title,
      e.target.value,
    );
  }

  const handleButtonClick = (e) => {
    const direction = e.target.dataset.direction;
    if (direction === "back") {
      decrementActiveIndex()
    } else {
      incrementActiveIndex();
    } 
    e.preventDefault();
  }


  return (
    <div className="question_item" data-isactive={isActive}>
      <h2>{title}</h2>
      {
        options.map( (opt, i) => {
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
        id !== QUESTIONS.length - 2
        ?  <button data-direction="next" onClick={handleButtonClick}>Next</button>
        : ""
      }
       
       
      </div>
    </div>
  )
};


const App = () => {
  const [selections, setSelections] = useState({});
  const [currentActiveIndex, setCurrentActiveIndex] = useState(0);
    /* OLD Shape of the selections state:
  {
    question_id: {
      selected_title: title,
      selected_weight: weight,
      
    }
  }
  NEW shape of selection state:
  [
    {
      question_id
      selected_weight
    }
  ]
  */

  /*
    incrementActiveIndex: increment current active question
  */
  const incrementActiveIndex = () => {
    if (Object.keys(selections).length === QUESTIONS.length - 1) { //if user has selected all options, set currentActiveIndex to the last question
      setCurrentActiveIndex(QUESTIONS.length - 1);
    } else { //assume active question is the NEXT question
      setCurrentActiveIndex(prevState => prevState + 1);
    }
  }

  /*
    decrementActiveIndex: decrement current active question
  */
  const decrementActiveIndex = () => {
    //assume active question is the PREV question
    setCurrentActiveIndex(prevState => prevState - 1);
  }

  /*
    updateSelection: update the state with the user's selection
  */
  const updateSelection = (question_id, selected_title, selected_weight) => {
    //increment active index
    incrementActiveIndex();

    //update selections state
    setSelections(prevState => {
        return ({
          ...prevState,
          [question_id]: {
            selected_title,
            selected_weight: Number(selected_weight)
          }
      });
    });
  }

  /* 
    calcProgress: return the completion of the quiz as a percemt
  */
  const calcProgress = () => {
    const completedQuestions = Object.keys(selections).length;
    const totalQuestions = QUESTIONS.length - 1; //accounting for first element being the over-arching question
    return Math.floor(completedQuestions / totalQuestions * 100);
  }

  /*
    calcScore: calculate the user's final score 
  */
  const calcScore = () => {
    let accumulator = 0;
    for (let key in selections) {
      accumulator = accumulator + selections[key].selected_weight;
    }
    return accumulator;
  }

  /* 
    interpretScore: return the user's mood based on their score
  */
  const interpretScore = () => {
    const score = calcScore();
    console.log("score: " + score);
    
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



  return (
    <>
      <ProgressIndicator progress={calcProgress()} />
      <QuestionList 
        activeQuestionIndex={currentActiveIndex}
        decrementActiveIndex={decrementActiveIndex} 
        incrementActiveIndex={incrementActiveIndex} 
        saveSelection={updateSelection} 
        />
      <Results result={interpretScore()}/>
    </>
  );
}

export default App;
