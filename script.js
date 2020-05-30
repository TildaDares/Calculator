/**Bugs to fix 
 * Round the numbers when they have too many trailing decimal numbers
 */
setInterval(checkFontSize, 5);
const buttons = document.querySelectorAll('button');
const resultsBig = document.querySelector('.results-big');
const resultsSmall = document.querySelector('.results-small');
let codeset = {
    16: false,
    53: false,
    61: false,
    42: false
};
let smallFont = '1.5rem';
let bigFont = '3rem';
let operationsContainer2;
let errorMessageDivisionByZero = "You'll need the infinity stones for that :)";
let errorMessageNegativeSquareRoot = "Bad Expression";
let numberKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
let highlightAbleKeys = ["*", "-", "/", "+", "=", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "%", "Escape", "Backspace", "Delete", "."];
/**Tracks if the equals button has been pressed. If it has and the user presses a number
 *  Then the display changes to the key the user has pressed**/
let equalsHasBeenPressed = false;
let otherMathOperatorsClicked = false; //Tracks if the other non-basic operators have been clicked
buttons.forEach(button => {
    button.addEventListener('click', mathOperationsClick);
})

function mathOperationsKey(e) {
    let compExp = (resultsSmall.textContent.split('').includes('÷') || resultsSmall.textContent.split('').includes('+') ||
        resultsSmall.textContent.split('').includes('-') || resultsSmall.textContent.split('').includes('x'));
    let checkErrors = (resultsBig.textContent == errorMessageNegativeSquareRoot || resultsBig.textContent == "Infinity" ||
        resultsBig.textContent == errorMessageDivisionByZero || resultsBig.textContent == "NaN");
    if (e.key == 'Enter') {
        const enterKey = document.querySelector(`button[id="${e.key}"]`);
        enterKey.classList.add('button-active');
        setTimeout(function() { enterKey.classList.remove('button-active'); }, 100);
    }
    if (highlightAbleKeys.includes(e.key)) {
        const highlight = document.querySelector(`button[data-key="${e.key}"]`);
        highlight.classList.add('button-active');
        setTimeout(function() { highlight.classList.remove('button-active'); }, 100);
    }
    if (checkErrors) {
        resultsBig.style.color = 'white';
        if (!numberKeys.includes(e.key)) {
            resultsBig.textContent = '0';
            resultsSmall.textContent = "";
            return
        } else {
            resultsBig.textContent = e.key;
            otherMathOperatorsClicked = false;
            return
        }
    }
    if (e.key == '%') {
        percent(compExp);
        return
    }
    if (numberKeys.includes(e.key)) {
        numbersButtons(e.key);
    }
    if (e.key == '+' || e.key == '*' || e.key == '/' || e.key == '-') {
        switch (e.key) {
            case '/':
                operator = '÷';
                break;

            case '*':
                operator = 'x';
                break;

            default:
                operator = e.key;
                break;
        }
        concatOperators(operator);
    }
    if (e.key == 'Backspace') {
        e.preventDefault();
        backspace(checkErrors);
    }
    nonMathButtons(e.key);
}

function nonMathButtons(key) {
    if (key == 'Delete') {
        resultsBig.textContent = "0";
    }
    if (key == 'Escape') {
        resultsBig.textContent = "0";
        resultsSmall.textContent = "";
    }
    if (key == '.') {
        dotOperator();
    }
    if (key == 'Enter' || key == '=') {
        equalsButton();
    }
}

function numbersButtons(key, checkErrors) {
    if (resultsBig.textContent.length > 20) return
    if (otherMathOperatorsClicked) {
        resultsBig.textContent = key;
        otherMathOperatorsClicked = false;
        return
    }
    if (equalsHasBeenPressed) {
        resultsBig.textContent = key;
        equalsHasBeenPressed = false;
        return
    }
    if (resultsBig.textContent == '0') {
        resultsBig.textContent = key;
        return
    } else {
        resultsBig.textContent = resultsBig.textContent + key;
        return
    }
}

function mathOperationsClick(e) {
    let compExp = (resultsSmall.textContent.split('').includes('÷') || resultsSmall.textContent.split('').includes('+') ||
        resultsSmall.textContent.split('').includes('-') || resultsSmall.textContent.split('').includes('x'));
    let checkErrors = (resultsBig.textContent == errorMessageNegativeSquareRoot || resultsBig.textContent == "Infinity" ||
        resultsBig.textContent == errorMessageDivisionByZero || resultsBig.textContent == "NaN");
    resultsBig.style.color = 'white';
    if (checkErrors) {
        if (!e.target.classList.contains('numbers')) {
            resultsBig.textContent = '0';
            resultsSmall.textContent = "";
            return
        } else {
            resultsBig.textContent = e.target.textContent;
            return
        }
    }
    if (e.target.classList.contains('numbers')) {
        numbersButtons(e.target.textContent);
    }
    if (e.target.classList.contains('operators')) {
        if (e.target.classList.contains('multiply')) operator = 'x';
        else if (e.target.classList.contains('plus')) operator = '+';
        else if (e.target.classList.contains('minus')) operator = '-';
        else if (e.target.classList.contains('buttondivide')) operator = '÷';
        concatOperators(operator);
    }
    if (e.target.classList.contains('clearone')) {
        backspace(checkErrors);
    }
    if (e.target.classList.contains('clear-textbox')) {
        resultsBig.textContent = "0";
    }
    if (e.target.classList.contains('clearall')) {
        resultsBig.textContent = "0";
        resultsSmall.textContent = "";
    }
    if (e.target.classList.contains('dot')) {
        dotOperator();
    }
    if (e.target.classList.contains('equals')) {
        equalsButton();
    }
    if (e.target.classList.contains('percent')) {
        percent(compExp);
    }
    if (e.target.classList.contains('sqrt')) {
        equalsHasBeenPressed = false;
        otherMathOperatorsClicked = true;
        if (Number(resultsBig.textContent) < 0) {
            resultsBig.style.fontSize = smallFont;
            resultsBig.style.color = 'red';
            resultsBig.textContent = errorMessageNegativeSquareRoot;
            resultsSmall.textContent = "";
            return
        }
        let result = Math.sqrt(Number(resultsBig.textContent));
        if (result.toString().length > 6) {
            resultsBig.style.fontSize = smallFont
        }
        if (compExp) {
            resultsBig.textContent = result;
            return
        }
        resultsSmall.textContent = "";
        resultsBig.textContent = result;
    }
    if (e.target.classList.contains('square')) {
        otherMathOperatorsClicked = true;
        let result = Math.pow((Number(resultsBig.textContent)), 2);
        if (result.toString().length > 9) {
            resultsBig.style.fontSize = smallFont
        }
        if (compExp) {
            resultsBig.textContent = result;
            return
        }
        resultsSmall.textContent = "";
        resultsBig.textContent = result;
    }
    if (e.target.classList.contains('one-over')) {
        otherMathOperatorsClicked = true;
        equalsHasBeenPressed = false;
        if (Number(resultsBig.textContent) == '0') {
            errorMessage();
            return
        }
        let result = 1 / (Number(resultsBig.textContent));
        if (result.toString().length > 9) {
            resultsBig.style.fontSize = smallFont
        }
        if (compExp) {
            resultsBig.textContent = result;
            return
        }
        resultsSmall.textContent = "";
        resultsBig.textContent = result;
    }
}

function concatOperators(operator) {
    /**Checks if the display is empty when the operator buttons were pressed
     * If they are the if statement then changes the last operator in the small display
     * and replaces it with the new operator that was pressed
     */
    if (resultsBig.textContent == "0" && resultsSmall.textContent != "") {
        let lastOperator = resultsSmall.textContent.split('');
        lastOperator.pop();
        resultsSmall.textContent = lastOperator.join('') + "" + operator;
        return
    }
    if (operator == 'x' || operator == '+' || operator == '-' || operator == '÷') {
        resultsSmall.textContent = resultsSmall.textContent + " " + resultsBig.textContent + " " + operator;
        resultsBig.textContent = "0";
    }
}

function backspace(checkErrors) {
    if (equalsHasBeenPressed) {
        resultsBig.textContent = '0';
        equalsHasBeenPressed = false;
        return
    }
    if (resultsBig.textContent.length == 1 || checkErrors) {
        resultsBig.textContent = '0';
        return
    }
    splitedText = resultsBig.textContent.split('');
    arrayLength = splitedText.length;
    splitedText.splice(arrayLength - 1, 1);
    resultsBig.textContent = splitedText.join('');
}

function dotOperator() {
    if (resultsBig.textContent.split('').includes('.')) return false;
    if (otherMathOperatorsClicked) {
        resultsBig.textContent = '0' + '.';
        otherMathOperatorsClicked = false;
        return
    }
    if (equalsHasBeenPressed) { //If equals has been pressed and the user presses the dot operator then 0. shows on the display
        resultsBig.textContent = "0" + ".";
        equalsHasBeenPressed = false;
        return
    }
    resultsBig.textContent = resultsBig.textContent + ".";
}

function percent(compExp) {
    otherMathOperatorsClicked = true;
    if (resultsBig.textContent == '0') {
        resultsBig.textContent = "0";
        return
    }
    let result = Number(resultsBig.textContent) / 100;
    if (result.toString().length > 9) {
        resultsBig.style.fontSize = smallFont;
    } else resultsBig.style.fontSize = bigFont;
    if (compExp) {
        resultsBig.textContent = result;
        return
    }
    resultsSmall.textContent = "";
    resultsBig.textContent = result;
}

function errorMessage() {
    resultsBig.style.fontSize = smallFont;
    resultsBig.textContent = errorMessageDivisionByZero;
    resultsSmall.textContent = "";
}

function equalsButton() {
    equalsHasBeenPressed = true;
    /**operationsContainer2 stores the contents of the small array as soon as an operator is ended
     * There is a space after an operator which makes it easier to evaluate complex expressions.
     * The fourth line in this method (apart from comments) adds the content in the display to the array.
     * The operationsContainer is first traversed to evaluate the expressions according to PEMDAS
     */
    operationsContainer2 = resultsSmall.textContent.split(' ');
    operationsContainer2.splice(0, 1);
    operationsContainer2.push(resultsBig.textContent);
    resultsSmall.textContent = resultsSmall.textContent + " " + resultsBig.textContent;
    for (let i = 0; i < operationsContainer2.length; i++) { //This outer for loop makes sure no operator was skipped during the execution of the operations
        //Follows PEMDAS
        if (operationsContainer2.includes('÷') || operationsContainer2.includes('x')) {
            for (let i = 0; i < operationsContainer2.length; i++) {
                const index = i;
                if (operationsContainer2[i] == 'x') {
                    let num1 = Number(operationsContainer2[index - 1]);
                    let num2 = Number(operationsContainer2[index + 1]);
                    let result1 = num1 * num2;
                    operationsContainer2.splice(i - 1, 3, result1);
                }
                if (operationsContainer2[i] === '/') {
                    if (operationsContainer2[index + 1] === '0') { //Checks if a number is being divided by 0
                        errorMessage();
                        return
                    }
                    let num1 = Number(operationsContainer2[index - 1]);
                    let num2 = Number(operationsContainer2[index + 1]);
                    let result1 = num1 / num2;
                    operationsContainer2.splice(i - 1, 3, result1);
                }
            }
        }

        if (operationsContainer2.includes('+') || operationsContainer2.includes('-')) {
            for (let i = 0; i < operationsContainer2.length; i++) {
                const index = i;
                if (operationsContainer2[i] === '+') {
                    let num1 = Number(operationsContainer2[index - 1]);
                    let num2 = Number(operationsContainer2[index + 1]);
                    let result1 = num1 + num2;
                    operationsContainer2.splice(i - 1, 3, result1);
                }
                if (operationsContainer2[i] === '-') {
                    let num1 = Number(operationsContainer2[index - 1]);
                    let num2 = Number(operationsContainer2[index + 1]);
                    let result1 = num1 - num2;
                    operationsContainer2.splice(i - 1, 3, result1);
                }
            }
        }
    }
    if (operationsContainer2.join('').length > 9) { //If the display length is greater than 6 then reduce the font-size of the display
        resultsBig.style.fontSize = smallFont;
    }
    resultsBig.textContent = operationsContainer2.join('');
    resultsSmall.textContent = "";
}

function checkFontSize() { //Checks at intervals to adjust the font-size if the length of the display is too long
    if (resultsBig.textContent.length > 9) {
        resultsBig.style.fontSize = smallFont;
    } else resultsBig.style.fontSize = bigFont;
}

window.addEventListener('keydown', mathOperationsKey);

function multiPressed() {
    window.addEventListener('keypress', function(e) {
        if (e.keyCode in codeset) {
            codeset[e.keyCode] = true;
        }
    })
    window.addEventListener('keydown', function(e) {
        if (e.keyCode in codeset) {
            codeset[e.keyCode] = true;
        }
    })
    if (codeset[16] && codeset[53]) {
        mathOperationsKey(e.key);
    }
    if (codeset[16] && codeset[61]) {
        mathOperationsKey(e.key);
    }
    if (codeset[16] && codeset[42]) {
        mathOperationsKey(e.key);
    }
}
multiPressed();