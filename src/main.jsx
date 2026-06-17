import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Award, BookOpen, CheckCircle2, Flame, Heart, RotateCcw, Sparkles, Star } from 'lucide-react';
import './styles.css';

const lessons = [
  {
    id: 'math',
    title: 'Math Forest',
    skill: 'Arithmetic',
    color: 'green',
    questions: [
      { prompt: 'A fox has 7 berries and finds 5 more. How many berries does it have?', choices: ['10', '12', '13'], answer: '12', fact: 'Adding means combining groups into one total.' },
      { prompt: 'Which number makes this true: 6 × __ = 24?', choices: ['3', '4', '5'], answer: '4', fact: 'Multiplication is repeated addition.' },
      { prompt: 'Mia split 18 acorns equally among 3 squirrels. Each squirrel gets...', choices: ['5', '6', '9'], answer: '6', fact: 'Division shares a total into equal groups.' }
    ]
  },
  {
    id: 'science',
    title: 'Science Reef',
    skill: 'Nature',
    color: 'blue',
    questions: [
      { prompt: 'Plants use sunlight to make food. This process is called...', choices: ['Evaporation', 'Photosynthesis', 'Magnetism'], answer: 'Photosynthesis', fact: 'Photosynthesis turns light, water, and carbon dioxide into plant energy.' },
      { prompt: 'Which state of matter keeps its own shape?', choices: ['Solid', 'Liquid', 'Gas'], answer: 'Solid', fact: 'Solids have particles packed tightly together.' },
      { prompt: 'The force that pulls objects toward Earth is...', choices: ['Friction', 'Gravity', 'Sound'], answer: 'Gravity', fact: 'Gravity gives objects weight.' }
    ]
  },
  {
    id: 'words',
    title: 'Word Castle',
    skill: 'Vocabulary',
    color: 'purple',
    questions: [
      { prompt: 'Choose the synonym for “brave.”', choices: ['Courageous', 'Sleepy', 'Tiny'], answer: 'Courageous', fact: 'Synonyms are words with similar meanings.' },
      { prompt: 'Which word is spelled correctly?', choices: ['Frend', 'Friend', 'Fryend'], answer: 'Friend', fact: 'The phrase “fri-end” can help you remember the spelling.' },
      { prompt: 'What does the prefix “re-” usually mean?', choices: ['Again', 'Before', 'Not'], answer: 'Again', fact: 'Replay, reread, and rebuild all mean to do something again.' }
    ]
  }
];

function App() {
  const [lessonIndex, setLessonIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [completed, setCompleted] = useState([]);

  const lesson = lessons[lessonIndex];
  const question = lesson.questions[questionIndex];
  const isCorrect = selected === question.answer;
  const progress = ((questionIndex + completed.length * 3) / (lessons.length * 3)) * 100;

  const rank = useMemo(() => {
    if (score >= 80) return 'Legend Learner';
    if (score >= 50) return 'Quest Captain';
    if (score >= 25) return 'Bright Explorer';
    return 'Rookie Ranger';
  }, [score]);

  const answerQuestion = (choice) => {
    if (selected) return;
    setSelected(choice);
    if (choice === question.answer) {
      setScore((value) => value + 10 + streak * 2);
      setStreak((value) => value + 1);
    } else {
      setStreak(0);
      setHearts((value) => Math.max(0, value - 1));
    }
  };

  const nextQuestion = () => {
    if (questionIndex < lesson.questions.length - 1) {
      setQuestionIndex((value) => value + 1);
    } else {
      setCompleted((value) => [...new Set([...value, lesson.id])]);
      setLessonIndex((value) => (value + 1) % lessons.length);
      setQuestionIndex(0);
    }
    setSelected(null);
  };

  const resetGame = () => {
    setLessonIndex(0);
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setStreak(0);
    setHearts(3);
    setCompleted([]);
  };

  const gameWon = completed.length === lessons.length;
  const gameOver = hearts === 0;

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow"><Sparkles size={16} /> QuestWise MVP</p>
          <h1>Learn by clearing bite-sized adventure quests.</h1>
          <p className="hero-copy">Pick answers, earn streak bonuses, protect your hearts, and master math, science, and vocabulary in one playful loop.</p>
        </div>
        <div className="mascot" aria-label="QuestWise owl mascot">🦉</div>
      </section>

      <section className="stats-grid" aria-label="Player stats">
        <Stat icon={<Star />} label="Score" value={score} />
        <Stat icon={<Flame />} label="Streak" value={streak} />
        <Stat icon={<Heart />} label="Hearts" value={'❤️'.repeat(hearts) || 'None'} />
        <Stat icon={<Award />} label="Rank" value={rank} />
      </section>

      <div className="progress-wrap"><span style={{ width: `${Math.min(progress, 100)}%` }} /></div>

      {gameWon || gameOver ? (
        <section className="result-card">
          <h2>{gameWon ? 'You completed every realm!' : 'Out of hearts — try the quest again!'}</h2>
          <p>{gameWon ? `Final score: ${score}. Your rank is ${rank}.` : 'Mistakes are part of learning. Restart to rebuild your streak.'}</p>
          <button className="primary-button" onClick={resetGame}><RotateCcw size={18} /> Play again</button>
        </section>
      ) : (
        <section className={`quiz-card ${lesson.color}`}>
          <div className="lesson-header">
            <div>
              <p className="eyebrow"><BookOpen size={16} /> {lesson.skill}</p>
              <h2>{lesson.title}</h2>
            </div>
            <span>Quest {questionIndex + 1}/{lesson.questions.length}</span>
          </div>
          <h3>{question.prompt}</h3>
          <div className="choices">
            {question.choices.map((choice) => (
              <button key={choice} className={selected === choice ? (isCorrect ? 'correct' : 'wrong') : ''} onClick={() => answerQuestion(choice)}>{choice}</button>
            ))}
          </div>
          {selected && (
            <div className={`feedback ${isCorrect ? 'correct' : 'wrong'}`}>
              <CheckCircle2 size={20} />
              <div><strong>{isCorrect ? 'Correct!' : `Not quite. Answer: ${question.answer}`}</strong><p>{question.fact}</p></div>
              <button onClick={nextQuestion}>Continue</button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

function Stat({ icon, label, value }) {
  return <article className="stat-card">{icon}<div><span>{label}</span><strong>{value}</strong></div></article>;
}

createRoot(document.getElementById('root')).render(<App />);
