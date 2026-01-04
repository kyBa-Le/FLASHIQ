import CryptoJS from "crypto-js";

const SALT = import.meta.env.VITE_QUIZ_SALT;

export const QuizCrypto = {
  hash(text: string) {
    return CryptoJS.SHA256(text + SALT).toString();
  },

  isCorrect(choice: string, serverHash: string) {
    return QuizCrypto.hash(choice) === serverHash;
  },
};
