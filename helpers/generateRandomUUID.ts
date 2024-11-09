const generateRandomUUID = (): string => {
  return window.crypto.randomUUID();
};

export default generateRandomUUID;
