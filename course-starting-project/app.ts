// const person: {
//     name: string;
//     age: number;
//     nickname: string;
// }
enum Role {ADMIN, READ_ONLY, AUTHOR};

const person: {
    name: string;
    age: number;
    nickname: string;
    hobbies: string[],
    role: Role
} = {
    name: 'Max',
    age: 30,
    nickname: 'Maximilian',
    hobbies: ['Sports', 'Cooking'],
    role: Role.ADMIN
};  

// person.role.push('admin'); // vai dar  certo, o push é uma excessão
// person.role[1] = 10;

for(const hobby of person.hobbies) {
    console.log(hobby.toUpperCase());
}
if(person.role === Role.ADMIN) {
    console.log('is admin');
}
// console.log(person.name);