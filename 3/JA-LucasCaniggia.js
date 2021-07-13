function test(words) {
    console.log('Process finished. Total amount of words: ', words);
}

function showText(text, fn, time = 1000) {
    const splitText = text.split(' ');
    let counter = 0;
    return new Promise((resolve, reject) => {
        const int = setInterval(() => {
        if (counter >= splitText.length) {
            clearInterval(int);
            fn(counter);
            resolve();
        } else {
            console.log(splitText[counter]);
            counter++;
        }
    }, time);
    });
}

showText('Word function test 1: First test', test, 400)
    .then(() => showText('Word function test 2: This is an example', test, 500))
    .then(() => showText('Word function test 3: Terminating function test', test, 300));