var operation = function (num1, num2, opName) {
    return new Promise(function (resolve, reject) {
        Promise.resolve().then(function () { return require('./classes'); }).then(function (module) {
            if (opName == 'sum')
                resolve(module.sum(num1, num2));
            else
                resolve(module.rest(num1, num2));
        });
    });
};
var operations = function () {
    operation(3, 5, 'sum').then(function (result) {
        console.log(result);
    });
    operation(3, 5, 'rest').then(function (result) {
        console.log(result);
    });
};
operations();
