class Departament {
    private readonly id: number;
    private name: string;
    protected employees: string[] = [];
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
    set setName(name: string) {
        this.name = name;
    }
    set setEmployees(employees: string[]) {
        this.employees = employees;
    }

    
    get getId() {
        return this.id;
    }

    get getName() {
        return this.name;
    }

    describe() {
        console.log(`Department (${this.id}): ${this.name}`);
    }
    addEmployee(employee: string) {
        this.employees.push(employee);
    }

    printEmployeeInformation() {
        console.log(this.employees.length);
        console.log(this.employees);
    }
}

class ITDepartament extends Departament {
    constructor(id: number, name: string, private admins: string[]) {
        super(id, name);
    }
    addAdmin(admin:string){
        this.admins.push(admin);
    }

    printAdmin() {
        console.log(this.admins);
    }
}

const accounting = new Departament(1, 'Accounting');
const accountingTI = new ITDepartament(1, 'Accounting',['Max', 'Test']);

accounting.addEmployee('Max');
accounting.addEmployee('Test');


console.log(accounting);
console.log(accounting.getName);

accountingTI.printAdmin();
