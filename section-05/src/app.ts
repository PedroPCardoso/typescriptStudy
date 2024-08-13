interface Person{
    name: string;
    age: number;

    greet(phrase: string): void;
}

interface PersonNormal{
    name: string;
    age?: number;

    greet(phrase: string): void;
}

let user: Person;

user = {
    name: 'Max',
    age: 30,
    greet(phrase: string){
        console.log(phrase + ' ' + this.name);
    }
}