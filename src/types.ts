export type Language = 'en' | 'ru';

export type Answer = {
  [key in Language]: string;
}

export type AnswerGroups = Answer[];

