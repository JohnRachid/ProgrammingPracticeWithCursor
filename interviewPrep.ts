class Person {
    name: string;
    age: number;
    income: number;
    ownedItems: Array<merchandise> = [];
    constructor(name: string, age: number, incomeLevel: number) {
        this.name = name;
        this.age = age;
        this.income = incomeLevel
        this.ownedItems = [];
    }
    sayHello() {
        console.log(`Hello, my name is ${this.name} and I am ${this.age} years old and I make ${this.income} dollars.`);
    }

    purchaseItem(item: merchandise) {
        if (this.canAffordItem(item)) {
            this.ownedItems.push(item);
            this.income -= item.price;
        }
        else {
            throw new Error(`cannot purchase item ${item.merchandiseName} as it is too expensive. I only have ${this.income} dollars.`);
        }
        if(this.income < 0){
            throw new Error(`Soemthing went wrong! I have negative income ${this.income}.`);
        }
    }

    canAffordItem(item: merchandise) {
        return this.income >= item.price;
    }

    greedyPurchaseItems(items: merchandise[]):void {
        //identify item with highest value to price ratio
        let highestvalueToPriceRatio = 0;
        let highestvalueToPriceRatioItem = null;
        for (const item of items) { //first pass to find most optimal item
            if (item.value / item.price > highestvalueToPriceRatio && this.canAffordItem(item)) {
                highestvalueToPriceRatio = item.value / item.price;
                highestvalueToPriceRatioItem = item;
            }
        }
        while (highestvalueToPriceRatioItem && this.canAffordItem(highestvalueToPriceRatioItem)) { //purchase all these items!!!

            this.purchaseItem(highestvalueToPriceRatioItem);
        }
        //do a pass to see if we need to purchase more items that arent the most optimal
        for (const item of items) {
            if (this.canAffordItem(item)) {
                this.greedyPurchaseItems(items)
            }
        }
        return;
    }
}

class people extends Person {

    arrayOfPeople: Array<Person> = [];
    constructor(amountOfPeople: number, incomeLevel: number) {
        super('', 0, 0); // Must call super() before accessing 'this'
        
        for (let i = 0; i < amountOfPeople; i++) {
            let name = (Math.random() + 1).toString(36).substring(7);
            let age = Math.random() * 10000
            let randomIncomeTiered =  Math.random() * 100000 * incomeLevel
            let personToAdd = new Person(name, age , randomIncomeTiered);
            personToAdd.sayHello();
            this.arrayOfPeople.push(personToAdd);
        }

        
    }

    calculateIncomeOfAllPeople() {
        let totalIncome = 0;
        for (let i = 0; i < this.arrayOfPeople.length; i++) {
            const person = this.arrayOfPeople[i] as Person;
            totalIncome += person.income;
        }
        return totalIncome;
    }

    calculateValueOfOwnedMerchandiseOfAllPeople() {
        let totalValue = 0;
        for (let i = 0; i < this.arrayOfPeople.length; i++) {
            const person = this.arrayOfPeople[i] as Person;
            totalValue += person.ownedItems.reduce((acc, item) => acc + item.value, 0);
        }
        return totalValue;
    }

    greedyPurchaseItemsForAllPeople(items: merchandise[]):void {
        for (const person of this.arrayOfPeople) {
            person.greedyPurchaseItems(items);
        }
    }
}

class merchandise {
    value: number
    price: number;
    merchandiseName: string;
    subsidized: boolean;
    constructor(value: number, price: number, merchandiseName: string, subsidized: boolean) {
        this.value = value;
        this.price = price;
        this.merchandiseName = merchandiseName;
        this.subsidized = subsidized;
    }
}

const possibleItems = [
    new merchandise(300, 500, "Playstation 5", true),
    new merchandise(300, 150, "Xbox Series X", false),
    new merchandise(300, 300, "Nintendo Switch", false),
    new merchandise(800, 1000, "PC", false),
    new merchandise(555, 444, "Laptop", false),
    new merchandise(600, 200, "Tablet", false),
    new merchandise(700, 500, "Phone", true),
    new merchandise(5, 4, "stretch armstrong", false),
    new merchandise(280, 193, "Smartwatch", false),
    new merchandise(300, 300, "Headphones", false),
]


const lowIncomePeoples = new people(10, 411);
const middleIncomePeoples = new people(10, 1000);
const highIncomePeoples = new people(10, 10000);

console.log("Before greedy purchase: " + lowIncomePeoples.arrayOfPeople[0].income);

lowIncomePeoples.arrayOfPeople[0].greedyPurchaseItems(possibleItems);
console.log("After greedy purchase: " + lowIncomePeoples.arrayOfPeople[0].income);

console.log("income for lowIncomePeoples people before greedy purchase: " + lowIncomePeoples.calculateIncomeOfAllPeople());
lowIncomePeoples.greedyPurchaseItemsForAllPeople(possibleItems);
console.log("income for all people after greedy purchase: " + lowIncomePeoples.calculateIncomeOfAllPeople());
console.log("value of owned merchandise for lowIncomePeoples: " + lowIncomePeoples.calculateValueOfOwnedMerchandiseOfAllPeople());


console.log("income for middleIncomePeoples people before greedy purchase: " + middleIncomePeoples.calculateIncomeOfAllPeople());
middleIncomePeoples.greedyPurchaseItemsForAllPeople(possibleItems);
console.log("income for middleIncomePeoples people after greedy purchase: " + middleIncomePeoples.calculateIncomeOfAllPeople());
console.log("value of owned merchandise for middleIncomePeoples: " + middleIncomePeoples.calculateValueOfOwnedMerchandiseOfAllPeople());


console.log("income for all people: " + middleIncomePeoples.calculateIncomeOfAllPeople());
console.log("income for all people: " + highIncomePeoples.calculateIncomeOfAllPeople());



//goal of this prep is to create a program that will create groups of people based on income levels. Then have each person purchase items from a list of items. 
// the goal is to maximize the total value of the items purchased for each group. 
//some items may be subsidized, only the lowest income group can purchase subsidized items.
//this is a knapsack problem with added constaints. optimal appraoch is probably dynamic programming. Lets solve via greedy approach and dynamic. 

//run with node - node interviewPrep.ts
//run with npx ts-node interviewPrep.ts