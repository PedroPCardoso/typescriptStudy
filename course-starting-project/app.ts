// const person: {
//     name: string;
//     age: number;
//     nickname: string;
// }
const person: {
    name: string;
    age: number;
    nickname: string;
    hobbies: string[]
    role: [number, string]
} = {
    name: 'Max',
    age: 30,
    nickname: 'Maximilian',
    hobbies: ['Sports', 'Cooking'],
    role: [2, 'author']
};  

// person.role.push('admin'); // vai dar  certo, o push é uma excessão
// person.role[1] = 10;

for(const hobby of person.hobbies) {
    console.log(hobby.toUpperCase());
}
// console.log(person.name);