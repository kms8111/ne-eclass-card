export const addAnimationDelay = (index: number) => {
  const delay = index * 0.1;

  return {
    animationDelay: `${delay}s`,
  };
};
