import { Answer, Language, AnswerGroups } from "./types.ts";
import './styles/main.scss'
import { MAGIC_8_BALL_ANSWERS } from "./answers.ts";
import { getRandomArrayItem } from "./utils.ts";

const LANG: Language = 'ru';

const spinButton: HTMLButtonElement | null = document.querySelector('.eight-ball__spin-btn');
const resetButton = document.querySelector('.eight-ball__reset-btn');
const predictionElement = document.querySelector('.eight-ball__prediction');
const predictionTextElement = document.querySelector('.eight-ball__prediction-text');


const getRandomAnswer = async (arr: AnswerGroups): Promise<string> => {
  return new Promise(resolve => {
    const answer: Answer = getRandomArrayItem(arr);
    console.log(answer);
    const answerText: string = answer[LANG] || answer.en;
    console.log(answerText);
    setTimeout(() => {
      resolve(answerText);
    }, 2000);
  });
}

const handleSpin = async () => {
  spinButton?.classList.add('eight-ball__spin-btn--hidden');
  await new Promise(resolve => setTimeout(resolve, 300));

  predictionElement?.classList.add('eight-ball__prediction--active');
  if (predictionTextElement) {
    predictionTextElement.textContent = "...";
  }

  const answer: string = await getRandomAnswer(MAGIC_8_BALL_ANSWERS);

  if (predictionTextElement) {
    predictionTextElement.classList.add('eight-ball__prediction-text--hidden');
    await new Promise(resolve => setTimeout(resolve, 300));
    predictionTextElement.textContent = answer;
    predictionTextElement.classList.remove('eight-ball__prediction-text--hidden');

  }

};

const handleReset = async () => {
  predictionElement?.classList.remove('eight-ball__prediction--active');
  await new Promise(resolve => setTimeout(resolve, 300));
  spinButton?.classList.remove('eight-ball__spin-btn--hidden');
}

spinButton?.addEventListener('click', handleSpin)
resetButton?.addEventListener('click', handleReset)