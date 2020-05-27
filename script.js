/**Bugs to fix 
 * Round the numbers when they have too many trailing decimal numbers
 * Make the keydown event work even when there's no clicking inside the window
 */
setInterval(checkFontSize, 5);
const buttons = document.querySelectorAll('button');
const resultsBig = document.querySelector('.results-big');
const resultsSmall = document.querySelector('.results-small');
let smallFont = '1.5rem';
let bigFont = '3rem';
let errorMessageDivisionByZero = "You'll need the infinity stones for that :)";
let errorMessageNegativeSquareRoot = "Bad Expression";
let operationsContainer2;
let multiPressedKeys = [];
/**Tracks if the equals button has been pressed. If it has and the user presses a number
 *  Then the display changes to the key the user has pressed**/
let equalsHasBeenPressed = false;
buttons.forEach(button => {
    button.addEventListener('click', mathOperationsClick);
})

function mathOperationsKey(e) {
    let compExp = (resultsSmall.textContent.split('').includes('/') || resultsSmall.textContent.split('').includes('+') ||
        resultsSmall.textContent.split('').includes('-') || resultsSmall.textContent.split('').includes('*'));
    let checkErrors = (resultsBig.textContent == errorMessageNegativeSquareRoot || resultsBig.textContent == "Infinity" ||
        resultsBig.textContent == errorMessageDivisionByZero || resultsBig.textContent == "NaN");
    multiPressedKeys.push(e.keyCode); //Just a hack. Could cause potential problems
    if (!(e.keyCode == 8 || e.keyCode == 46 || e.keyCode == 27)) {
        const highlight = document.querySelector(`button[data-key="${e.key}"]`);
        highlight.classList.add('button-active');
        setTimeout(function() { highlight.classList.remove('button-active'); }, 100)
    }
    resultsBig.style.color = 'white';
    if (checkErrors) {
        if (!((e.keyCode >= 96 && e.keyCode <= 105) || (e.keyCode >= 48 && e.keyCode <= 57))) {
            resultsBig.textContent = '0';
            resultsSmall.textContent = "";
            return
        } else {
            resultsBig.textContent = e.key;
            return
        }
    }
    if (multiPressedKeys[multiPressedKeys.length - 2] == 16 && e.keyCode == 53) {
        percent(compExp);
        return
    }
    if ((e.keyCode >= 96 && e.keyCode <= 105) || (e.keyCode >= 48 && e.keyCode <= 57)) {
        numbersButtons(e.key)
    }
    if ((e.keyCode >= 106 && e.keyCode <= 109) || e.keyCode == 111 || e.keyCode == 173 || e.keyCode == 191) {
        operator = e.key;
        concatOperators(operator, operationsContainer2)
        operationsContainer2 = resultsSmall.textContent.split(' ');
    }
    if (e.keyCode == 8) {
        e.preventDefault();
        backspace(checkErrors);
    }
    nonMathButtons(e.keyCode)
}

function nonMathButtons(keyCode) {
    if (keyCode == 46) {
        resultsBig.textContent = "0";
    }
    if (keyCode == 27) {
        resultsBig.textContent = "0";
        resultsSmall.textContent = "";
    }
    if (keyCode == 110 || keyCode == 190) {
        dotOperator();
    }
    if (keyCode == 61) {
        equalsButton();
    }
}

function numbersButtons(key) {
    if (resultsBig.textContent.length > 20) return
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
    let compExp = (resultsSmall.textContent.split('').includes('/') || resultsSmall.textContent.split('').includes('+') ||
        resultsSmall.textContent.split('').includes('-') || resultsSmall.textContent.split('').includes('*'));
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
        if (e.target.classList.contains('multiply')) operator = '*';
        else if (e.target.classList.contains('plus')) operator = '+';
        else if (e.target.classList.contains('minus')) operator = '-';
        else if (e.target.classList.contains('buttondivide')) operator = '/';
        concatOperators(operator, operationsContainer2)
        operationsContainer2 = resultsSmall.textContent.split(' ');
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

function concatOperators(operator, operationsContainer2) {
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
    if (operator == '*' || operator == '+' || operator == '-' || operator == '/') {
        resultsSmall.textContent = resultsSmall.textContent + " " + resultsBig.textContent + " " + operator;
        resultsBig.textContent = "0";
    }
    operationsContainer2 = resultsSmall.textContent.split(' ');
}

function backspace(checkErrors) {
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
    if (equalsHasBeenPressed) { //If equals has been pressed and the user presses the dot operator then 0. shows on the display
        resultsBig.textContent = "0" + ".";
        equalsHasBeenPressed = false;
        return
    }
    resultsBig.textContent = resultsBig.textContent + ".";
}

function percent(compExp) {
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
    operationsContainer2.splice(0, 1);
    operationsContainer2.push(resultsBig.textContent);
    resultsSmall.textContent = resultsSmall.textContent + " " + resultsBig.textContent;
    for (let i = 0; i < operationsContainer2.length; i++) { //This outer for loop makes sure no operator was skipped during the execution of the operations
        //Follows PEMDAS
        if (operationsContainer2.includes('/')) {
            for (let i = 0; i < operationsContainer2.length; i++) {
                if (operationsContainer2[i] == '/') {
                    const index = i;
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
        if (operationsContainer2.includes('*')) {
            for (let i = 0; i < operationsContainer2.length; i++) {
                if (operationsContainer2[i] === '*') {
                    const index = i;
                    let num1 = Number(operationsContainer2[index - 1]);
                    let num2 = Number(operationsContainer2[index + 1]);
                    let result1 = num1 * num2;
                    operationsContainer2.splice(i - 1, 3, result1);
                }
            }
        }
        if (operationsContainer2.includes('+')) {
            for (let i = 0; i < operationsContainer2.length; i++) {
                if (operationsContainer2[i] === '+') {
                    const index = i;
                    let num1 = Number(operationsContainer2[index - 1]);
                    let num2 = Number(operationsContainer2[index + 1]);
                    let result1 = num1 + num2;
                    operationsContainer2.splice(i - 1, 3, result1);
                }
            }
        }
        if (operationsContainer2.includes('-')) {
            for (let i = 0; i < operationsContainer2.length; i++) {
                if (operationsContainer2[i] === '-') {
                    const index = i;
                    let num1 = Number(operationsContainer2[index - 1]);
                    let num2 = Number(operationsContainer2[index + 1]);
                    let result1 = num1 - num2;
                    operationsContainer2.splice(i - 1, 3, result1);
                }
            }
        }
    }
    if (operationsContainer2.join('').length > 9) { //If the display length is greater than 6 then reduce the font-size of the display
        resultsBig.style.fontSize = smallFont
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