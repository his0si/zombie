import { useNavigate, useParams } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import questions from '../data/questions';

let answers = [];

export default function Question() {
  const { id } = useParams();
  const navigate = useNavigate();
  const question = questions[parseInt(id) - 1];

  const handleAnswer = (type) => {
    answers.push(type);

    if (parseInt(id) === questions.length) {
      const count = {
        independent: 0,
        social: 0,
      };
      answers.forEach((t) => {
        count[t]++;
      });

      const result =
        count.independent > count.social ? 'independent' : 'social';

      answers = [];
      navigate(`/result?type=${result}`);
    } else {
      navigate(`/question/${parseInt(id) + 1}`);
    }
  };
  return (
    <div className='page'>
      <ProgressBar current={parseInt(id)} total={questions.length} />
      <h2>{question.question}</h2>
      {question.options.map((opt, i) => (
        <button key={i} onClick={() => handleAnswer(opt.type)}>
          {opt.text}
        </button>
      ))}
    </div>
  );
}
