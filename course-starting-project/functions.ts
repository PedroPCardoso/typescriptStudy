function add (a: number, b: number): number {
    return a + b;
}

function printResult(num: number): void {
    console.log('Result: ' + num);
}

printResult(add(5, 12));

let combineValues: (a: number, b: number) => number;

combineValues = add;

console.log(combineValues(8, 8));

function addHandle(a: number, b: number, cb: (num: number) => void) {
    const result = a + b;
    cb(result);
}

addHandle(10, 20, (result) => {
    console.log(result);
})