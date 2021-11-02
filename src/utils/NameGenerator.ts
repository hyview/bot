import { adjectives, gamingTerms, nouns } from "./Words";

const generateName = () => {
  const adjective =
    adjectives[Math.floor(Math.random() * (adjectives.length - 1))];
  const gamingTerm =
    gamingTerms[Math.floor(Math.random() * (gamingTerms.length - 1))];
  return adjective + gamingTerm;
};

export { generateName };
