// makes a list of numbers 1, 2, 3, ... up to count
export function makeNumbers(count) {
  const numbers = [];
  for (let i = 1; i <= count; i++) {
    numbers.push(i);
  }
  return numbers;
}

// returns a new array with the same items in a random order
export function shuffleArray(array) {
  const copy = [];
  for (let i = 0; i < array.length; i++) {
    copy.push(array[i]);
  }

  for (let i = copy.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[randomIndex];
    copy[randomIndex] = temp;
  }

  return copy;
}

// shuffles a list of numbers (used by Number Match)
export function shuffleNumbers(numbers) {
  return shuffleArray(numbers);
}

// picks a random whole number between 1 and max (both included)
export function pickRandomNumber(max) {
  return Math.floor(Math.random() * max) + 1;
}