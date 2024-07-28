let passlength = document.querySelector('.passlength');
let rangeSetter = document.getElementById('rangeSetter');
let passwordDisplay = document.querySelector('[data-passwordDisplay]');
let checkUpperCase = document.getElementById('includeUpperCase');
let checkLowerCase = document.getElementById('includeLowerCase');
let checkIncludeNumber = document.getElementById('includeNumbers');
let checkSymbols = document.getElementById('includeSymbols');
let strengthIndicator = document.querySelector('.indicator');
let allCheckBoxes = document.querySelectorAll('input[type=checkbox]');
let copiedElement = document.querySelector('.copied-text');
let copyBtn = document.querySelector('[data-copy]');
let generatePass = document.querySelector('.generate-password');

let password = "";
let passwordLength = 10;
let symbols = "!@#$%^&*()_{}[]?";
let checkboxCount = 0;
handleSlider();

function handleSlider() {
    rangeSetter.value = passwordLength;
    passlength.innerText = passwordLength;
}

function setIndicator(color) {
    strengthIndicator.style.backgroundColor = color;
    //strengthIndicator.style.boxShadow = `0 0 12px 1px ${color}`
}

function getRndInterger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInterger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInterger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInterger(65, 90))
}

function generateSymbol() {
    const randomSymbolNum = getRndInterger(0, symbols.length);
    return symbols.charAt(randomSymbolNum);
}

// suffle password - fisher yates method
function sufflePassword(passArry) {
    for (let i = passArry.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [passArry[i], passArry[j]] = [passArry[j], passArry[i]];
    }
    return passArry;
}


// color indicator
function calStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;
    if (checkUpperCase.checked) { hasUpper = true };
    if (checkLowerCase.checked) { hasLower = true };
    if (checkIncludeNumber.checked) { hasNumber = true };
    if (checkSymbols.checked) { hasSymbol = true };

    if(hasUpper && hasLower && (hasSymbol || hasNumber) && passwordLength >=6) {
        setIndicator("#0f0")
    } else if((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength >=4) {
        setIndicator("#ff0")
    } else {
        setIndicator("#f00")
    }
}

// copy content method
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copiedElement.innerText = "copied";
        copiedElement.style.backgroundColor = "rgb(34, 179, 34)"
        
        
        setTimeout(() => {
            copiedElement.innerText = '';
            copiedElement.style.backgroundColor = 'transparent';
        }, 2000);


    } catch (error) {
        copiedElement.innerText = "Failed";
        setTimeout(() => {
            copiedElement.innerText = '';
        }, 2000);
    }
}

// Range setter
rangeSetter.addEventListener('input', function (e) {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', function () {
    if (passwordDisplay.value) {
        copyContent();
    }
})

function handleCheckBoxChange() {
    checkboxCount = 0;
    allCheckBoxes.forEach((checkbox) => {
        if (checkbox.checked) {
            checkboxCount++;
        }
    })

    // handle special case
    if (passwordLength < checkboxCount) {
        passwordLength = checkboxCount;
        handleSlider();
    }

    // console.log(passwordLength)
}

allCheckBoxes.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

generatePass.addEventListener('click', function () {
    if (checkboxCount <= 0) {
        return;
    }

    password = "";
    const funcArry = [];

    if (checkUpperCase.checked) {
        funcArry.push(generateUpperCase)
    }
    if (checkLowerCase.checked) {
        funcArry.push(generateLowerCase);
    }
    if (checkIncludeNumber.checked) {
        funcArry.push(generateRandomNumber)
    }
    if (checkSymbols.checked) {
        funcArry.push(generateSymbol)
    }

    // compulsary Addition
    for (let i = 0; i < funcArry.length; i++) {
        password += funcArry[i]();
    }

    // Remaining Addition
    for (i = 0; i < passwordLength - funcArry.length; i++) {
        let randIndex = getRndInterger(0, funcArry.length);
        password += funcArry[randIndex]();
    }

    password = sufflePassword(Array.from(password));

    passwordDisplay.value = password.join('');

    // calling the strength indicator
    calStrength();
})
