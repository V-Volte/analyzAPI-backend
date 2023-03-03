import sets from "../datasetsjson/sets.json";
// Load JSON data from sets.json
let temp = sets.data;

export const getQuestionSet = (a: number) => {
    if (a >= temp.length + 1 || a <= 0) return null;
    return temp[a - 1];
};
