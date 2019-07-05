export const arrayFromNum = (lowEnd, highEnd) => {
  const list = [];
  for (let i = lowEnd; i < highEnd; i++) {
    list.push(i);
  }
  return list;
};