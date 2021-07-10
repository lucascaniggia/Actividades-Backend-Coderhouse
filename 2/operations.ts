const operation = (num1:number, num2:number, opName:string) => {
    return new Promise((resolve, reject) => {
        import('./classes').then((module) => {
            if (opName == 'sum') resolve(module.sum(num1, num2));
            else resolve(module.rest(num1, num2));
        });
    });
}

const operations = () => {
    operation(3, 5, 'sum').then((result) => {
        console.log(result);
    });
    operation(3, 5, 'rest').then((result) => {
        console.log(result);
    });
};

operations();