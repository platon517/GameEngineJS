const speed = 1;

export const getPosition = (oldPos) => {
  const startTime = Date().getTime();
  return () => {
    const nowTime = Date().getTime();
    return oldPos + (nowTime - startTime) * speed;
  };
};