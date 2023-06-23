export const randomTenString = (): string => {
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let randomString = '';

  // Generate the first three uppercase letters
  for (let i = 0; i < 3; i++) {
    randomString += uppercaseLetters.charAt(
      Math.floor(Math.random() * uppercaseLetters.length)
    );
  }

  // Generate the remaining seven numbers
  for (let i = 0; i < 7; i++) {
    randomString += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return randomString;
}

export const randomCodeGenerator = (result_length: number): string => {
  let characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  // Customize the length here.
  for (let i = result_length; i > 0; --i) result += characters[Math.round(Math.random() * (characters.length - 1))]
  return result;
}