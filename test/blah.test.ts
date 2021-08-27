const sum = (num1: number, num2: number): number => {
  return num1 + num2;
};

describe('blah', () => {
  it('works', () => {
    expect(sum(1, 1)).toEqual(2);
  });
});
