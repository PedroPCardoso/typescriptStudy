console.log('Your code goes here...');

function add(a: number, b: number,printResult: boolean,phrase: string) {
    const result = a + b;
    if(printResult){
        console.log(phrase + result);
    }
    else{
        return result;
    }
}

const number1 =  5;
const number2 =  5;
const printResult = true;
const phrase = 'Result is: ';
add(number1, number2, printResult, phrase);
