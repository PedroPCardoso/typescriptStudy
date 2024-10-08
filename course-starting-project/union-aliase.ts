type Combinable = number | string;

function combine(input1: Combinable, input2: Combinable, resultConversion: 'as-number' | 'as-string') {
    let result;
    if (typeof input1 === 'number' && typeof input2 === 'number' || resultConversion == 'as-number') {
        result = +input1 + +input2;
    } else {
        result = input1.toString() + input2.toString();
    }
    return result;
}

const combineAges = combine(30, 26, 'as-number');
console.log(combineAges);

const combineNames = combine('Max', 'Anna','as-string');
console.log(combineNames);