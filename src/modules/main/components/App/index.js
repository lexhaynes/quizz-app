import React from 'react';
import './App.scss';
import QUESTIONS from 'modules/main/data/questions.json';
import MOODS from 'modules/main/data/moods.json';
import {useState} from 'react';

/* TODO: 
- don't show "next" unless user has completed the current question
- add more questions (there should be at least 10)
- reduce the amount of props in components!
- the repetition in the selections state of the ID field vs selections index bothers me... what if the questionID becomes alpha numeric??
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


const QuestionList = ({activeQuestionIndex, updateActiveIndex, updateSelection}) => {
 
  return (
    <form className="question_list"> 
    {
      QUESTIONS.filter(question => question.heirarchy !== "primary").map( (question) => {
        const questionData = {
          id: question._id,
          title: question.title,
          options: question.options
        };
        return <QuestionItem
            key={`question_item_${question._id}`} 
            questionData={questionData}
            updateSelection={updateSelection}
            updateActiveIndex={updateActiveIndex}
            isActive={activeQuestionIndex === question._id}
            />       
      })
    }
    </form>
  );
}

const QuestionItem = ({questionData, updateSelection, isActive, updateActiveIndex}) => {
  const {id, title, options} = questionData;
  
  const handleOptionSelect = (e) => {
    updateSelection(
      id,
      e.target.title,
      e.target.value,
    );
  }

  const handleButtonClick = (e) => {
    const direction = e.target.dataset.direction;
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
  const [selections, setSelections] = useState([]);
  const [currentActiveIndex, setCurrentActiveIndex] = useState(0);
/*
  shape of selection state:
  [
    {
      question_id
      selected_weight
    }
  ]
  */

  const updateActiveIndex = {
    increment: () => {
      //if user has selected all options, set currentActiveIndex to the last question
      if (selections.length === QUESTIONS.length - 1) { 
        setCurrentActiveIndex(QUESTIONS.length - 1);
      } else { //assume active question is the NEXT question
        setCurrentActiveIndex(prevState => prevState + 1);
      }
    },
    decrement: () => {
      //assume active question is the PREV question
      setCurrentActiveIndex(prevState => prevState - 1);
    }
  };

  /*
    updateSelection: update the state with the user's selection
  */
  const updateSelection = (question_id, selected_title, selected_weight) => {
    const newSelection = {
      question_id,
      selected_title,
      selected_weight: Number(selected_weight)
  }

      setSelections(prevState => {      
        //we must put newState at index question_id!
        let copiedState = [...prevState];
        copiedState[question_id] = newSelection;
        return copiedState
      });

    //increment active index
    updateActiveIndex.increment();
  }

  /* 
    calcProgress: return the completion of the quiz as a percemt
  */
  const calcProgress = () => {
    const completedQuestions = selections.length;
    const totalQuestions = QUESTIONS.length - 1; //accounting for first element being the over-arching question
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
        updateActiveIndex={updateActiveIndex} 
        updateSelection={updateSelection} 
        />
      <Results result={interpretScore()}/>
    </>
  );
}

export default App;
