export const getRandomArrayItem = <T>(arr: T[]): T => {
    if (!arr.length) {
      throw new Error('Cannot get random item from empty array');
    }
    return arr[Math.floor(Math.random() * arr.length)];
  };