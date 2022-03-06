/*
Quick, small and speedy UUID4 generator
From: https://gist.github.com/jed/982883
TypeScript implementation: https://gist.github.com/jed/982883?permalink_comment_id=3123179#gistcomment-3123179
*/

export const uuid4 = (a: string = ""): string =>
  a
    ?
      ((Number(a) ^ (Math.random() * 16)) >> (Number(a) / 4)).toString(16)
    : `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, uuid4);
