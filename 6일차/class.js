class Animal {
    constructor(name, age = 5) {
        this.age = age;
        this.name = name;
    }

    eat() {
        console.log("냠냠");
    }
}
 
class Dog extends Animal {
    constructor(name, age) {
        super(name, age);
        
    }

    eat() {
        super.eat();
        console.log("냐무냐무");
    }

    get weight() {
        return '뷁'
    }

    set weight(newWeight) {
        console.log('몸무계 바꾸기이ㅣㅣ');
    }
}

let animal = new Animal(10, '222');
let dog = new Dog(10, 'asdf');

dog.weight = 100;

dog.eat();
animal.eat();