/**Bugs to fix 
 * Round the numbers when they have too many trailing decimal numbers
 * Make the keydown event work even when there's no clicking inside the window
 */
setInterval(checkFontSize, 5);
const buttons = document.querySelectorAll('button');
const resultsBig = document.querySelector('.results-big');
const resultsSmall = document.querySelector('.results-small');
let operationsContainer2;
let multiPressedKeys = [];
/**Tracks if the equals button has been pressed. If it has and the user presses a number
 *  Then the display changes to the key the user has pressed**/
let equalsHasBeenPressed = false;
//Tracks if the squareroot, square, percent and 1/x buttons have been pressed.//
let sqrtHasBeenPressed = false;
let operatorsDisabled = false; //Disables the operators when the display only has a dot operator in it to prevent bad expressions
buttons.forEach(button => {
    button.addEventListener('click', mathOperationsClick);
})

function mathOperationsKey(e) {
    let compExp = (resultsSmall.textContent.split('').includes('/') || resultsSmall.textContent.split('').includes('+') ||
        resultsSmall.textContent.split('').includes('-') || resultsSmall.textContent.split('').includes('*'));
    multiPressedKeys.push(e.keyCode); //Just a hack. Could cause potential problems
    const highlight = document.querySelector(`button[data-key="${e.key}"]`);
    highlight.classList.add('button-active');
    setTimeout(function() { highlight.classList.remove('button-active'); }, 100)
    resultsBig.style.color = 'white';
    if (resultsBig.textContent == "Bad Expression" || resultsBig.textContent == "Infinity" ||
        resultsBig.textContent == "You'll need the infinity stones for that :)") {
        if (!((e.keyCode >= 96 && e.keyCode <= 105) || (e.keyCode >= 48 && e.keyCode <= 57))) {
            resultsBig.textContent = '0';
            resultsSmall.textContent = "";
            return
        }
        resultsBig.textContent = e.key;
        resultsSmall.textContent = "";
    }
    if (resultsBig.textContent == '.') {
        operatorsDisabled = true;
    } else {
        operatorsDisabled = false;
    }
    if (multiPressedKeys[multiPressedKeys.length - 2] == 16 && e.keyCode == 53) {
        percent(compExp);
        return
    }
    if ((e.keyCode >= 96 && e.keyCode <= 105) || (e.keyCode >= 48 && e.keyCode <= 57)) {
        if (resultsBig.textContent.length > 20) {
            return
        }
        if (equalsHasBeenPressed) {
            resultsBig.textContent = e.key;
            equalsHasBeenPressed = false;
            return
        }
        if (resultsBig.textContent == '0') resultsBig.textContent = e.key;
        else resultsBig.textContent = resultsBig.textContent + e.key;
    }
    if ((e.keyCode >= 106 && e.keyCode <= 109) || e.keyCode == 111 || e.keyCode == 173 || e.keyCode == 191) {
        if (operatorsDisabled) return
        operator = e.key;
        concatOperators(operator, operationsContainer2)
        operationsContainer2 = resultsSmall.textContent.split(' ');
    }
    if (e.keyCode == 8) {
        e.preventDefault();
        let checkErrors = (resultsBig.textContent == "Bad Expression" || resultsBig.textContent == "Infinity" ||
            resultsBig.textContent == "You'll need the infinity stones for that :)" || resultsBig.textContent == "NaN");
        backspace(checkErrors);
    }
    if (e.keyCode == 46) {
        resultsBig.textContent = "0";
    }
    if (e.keyCode == 27) {
        resultsBig.textContent = "0";
        resultsSmall.textContent = "";
    }
    if (e.keyCode == 110 || e.keyCode == 190) {
        dotOperator();
    }
    if (e.keyCode == 61) {
        equalsButton();
    }
}

function mathOperationsClick(e) {
    let compExp = (resultsSmall.textContent.split('').includes('/') || resultsSmall.textContent.split('').includes('+') ||
        resultsSmall.textContent.split('').includes('-') || resultsSmall.textContent.split('').includes('*'));
    resultsBig.style.color = 'white';
    if (resultsBig.textContent == "Bad Expression" || resultsBig.textContent == "Infinity" ||
        resultsBig.textContent == "You'll need the infinity stones for that :)") {
        if (!e.target.classList.contains('numbers')) {
            resultsBig.textContent = '0';
            resultsSmall.textContent = "";
            return
        }
    }
    if (resultsBig.textContent == '.') {
        operatorsDisabled = true;
    } else {
        operatorsDisabled = false;
    }
    if (e.target.classList.contains('numbers')) {
        if (resultsBig.textContent.length > 20) return
        if (sqrtHasBeenPressed) {
            sqrtHasBeenPressed = false;
            /**if the squareroot, square, percent and 1/x buttons have been pressed and the expression is a compound expression
             * then the small display doesn't clear but if it's not a compound expression the small display clears 
             */
            if (compExp) {
                resultsBig.textContent = e.target.textContent;
                return
            } else {
                resultsSmall.textContent = "";
                resultsBig.textContent = e.target.textContent;
            }
            return
        }
        if (equalsHasBeenPressed) {
            resultsBig.textContent = e.target.textContent;
            equalsHasBeenPressed = false;
            return
        }
        if (resultsBig.textContent == '0') resultsBig.textContent = e.target.textContent;
        else resultsBig.textContent = resultsBig.textContent + e.target.textContent;
    }
    if (e.target.classList.contains('operators')) {
        if (operatorsDisabled) return
        if (e.target.classList.contains('multiply')) operator = '*';
        else if (e.target.classList.contains('plus')) operator = '+';
        else if (e.target.classList.contains('minus')) operator = '-';
        else if (e.target.classList.contains('buttondivide')) operator = '/';
        concatOperators(operator, operationsContainer2)
        operationsContainer2 = resultsSmall.textContent.split(' ');
    }
    if (e.target.classList.contains('clearone')) {
        let checkErrors = (resultsBig.textContent == "Bad Expression" || resultsBig.textContent == "Infinity" ||
            resultsBig.textContent == "You'll need the infinity stones for that :)" || resultsBig.textContent == "NaN");
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
        sqrtHasBeenPressed = true;
        if (Number(resultsBig.textContent) < 0) {
            resultsBig.style.fontSize = '1.5rem';
            resultsBig.style.color = 'red';
            resultsBig.textContent = "Bad Expression";
            resultsSmall.textContent = "";
            sqrtHasBeenPressed = false;
            return
        }
        let result = Math.sqrt(Number(resultsBig.textContent));
        if (result.toString().length > 6) {
            resultsBig.style.fontSize = '1.5rem'
        }
        if (compExp) {
            resultsBig.textContent = result;
            return
        }
        resultsSmall.textContent = "";
        resultsBig.textContent = result;
    }
    if (e.target.classList.contains('square')) {
        sqrtHasBeenPressed = true;
        let result = Math.pow((Number(resultsBig.textContent)), 2);
        if (result.toString().length > 9) {
            resultsBig.style.fontSize = '1.5rem'
        }
        if (compExp) {
            resultsBig.textContent = result;
            return
        }
        resultsSmall.textContent = "";
        resultsBig.textContent = result;
    }
    if (e.target.classList.contains('one-over')) {
        sqrtHasBeenPressed = true;
        if (Number(resultsBig.textContent) == '0') {
            resultsBig.style.fontSize = '1.5rem'
            resultsBig.textContent = "You'll need the infinity stones for that :)";
            resultsSmall.textContent = "";
            return

        }
        let result = 1 / (Number(resultsBig.textContent));
        if (result.toString().length > 9) {
            resultsBig.style.fontSize = '1.5rem'
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
    if (resultsBig.textContent == "Bad Expression" || resultsBig.textContent == "Infinity" ||
        resultsBig.textContent == "You'll need the infinity stones for that :)" || resultsBig.textContent == "NaN") {
        resultsBig.textContent = '0';
        return
    }
    if (resultsBig.textContent.length == 1) {
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
    sqrtHasBeenPressed = true;
    if (resultsBig.textContent == '0') {
        resultsBig.textContent = "0";
        return
    }
    let result = Number(resultsBig.textContent) / 100;
    if (result.toString().length > 9) {
        resultsBig.style.fontSize = '1.5rem';
    } else resultsBig.style.fontSize = '3rem';
    if (compExp) {
        resultsBig.textContent = result;
        return
    }
    resultsSmall.textContent = "";
    resultsBig.textContent = result;
}

function equalsButton() {
    if (operatorsDisabled) return
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
                        resultsBig.style.fontSize = '1.5rem'
                        resultsBig.textContent = "You'll need the infinity stones for that :)";
                        resultsSmall.textContent = "";
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
        resultsBig.style.fontSize = '1.5rem'
    }
    resultsBig.textContent = operationsContainer2.join('');
    resultsSmall.textContent = "";
}

function checkFontSize() { //Checks at intervals to adjust the font-size if the length of the display is too long
    if (resultsBig.textContent.length > 9) {
        resultsBig.style.fontSize = '1.5rem';
    } else resultsBig.style.fontSize = '3rem';
}

window.addEventListener('keydown', mathOperationsKey);