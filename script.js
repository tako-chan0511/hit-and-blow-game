let answer = generateRandomNumber();
let attempts = [];
let isFirstAttempt = true; // 1回目かどうかのフラグ

function generateRandomNumber() {
    let digits = [];
    while (digits.length < 4) {
        let num = Math.floor(Math.random() * 10);
        if (!digits.includes(num)) {
            digits.push(num);
        }
    }
    return digits.join(""); // 文字列として返す
}

function checkAnswer() {
    if (isFirstAttempt) {
        checkFirstAttempt();
    } else {
        checkNormalAttempt();
    }
}

function checkFirstAttempt() {
    let userInput1 = document.getElementById("userInput1").value;
    let userInput2 = document.getElementById("userInput2").value;

    if (!isValidInput(userInput1) || !isValidInput(userInput2)) {
        document.getElementById("message").innerText = "4桁の異なる数字を入力してください。";
        return;
    }

    let result1 = checkHitBlow(userInput1);
    let result2 = checkHitBlow(userInput2);

    let bestChoice = result1.hit >= result2.hit ? result1 : result2;
    let selectedInput = result1.hit >= result2.hit ? userInput1 : userInput2;

    attempts.push({ guess: selectedInput, hit: bestChoice.hit, blow: bestChoice.blow });

    let historyList = document.getElementById("history");
    let listItem = document.createElement("li");
    listItem.textContent = `${selectedInput} → Hit: ${bestChoice.hit}, Blow: ${bestChoice.blow}`;
    historyList.appendChild(listItem);

    document.getElementById("message").innerText = bestChoice.hit === 4 ? "正解！おめでとう！🎉" : `Hit: ${bestChoice.hit}, Blow: ${bestChoice.blow}`;

    if (bestChoice.hit === 4) {
        disableInputs();
        return;
    }

    // 2回目以降のためにUI変更
    isFirstAttempt = false;
    document.getElementById("firstAttemptInputs").style.display = "none";
    document.getElementById("normalAttemptInput").style.display = "block";
    document.getElementById("instruction").innerText = "次の予測を入力してください";
}

function checkNormalAttempt() {
    let userInput = document.getElementById("userInputSingle").value;

    if (!isValidInput(userInput)) {
        document.getElementById("message").innerText = "4桁の異なる数字を入力してください。";
        return;
    }

    let result = checkHitBlow(userInput);

    attempts.push({ guess: userInput, hit: result.hit, blow: result.blow });

    let historyList = document.getElementById("history");
    let listItem = document.createElement("li");
    listItem.textContent = `${userInput} → Hit: ${result.hit}, Blow: ${result.blow}`;
    historyList.appendChild(listItem);

    document.getElementById("message").innerText = result.hit === 4 ? "正解！おめでとう！🎉" : `Hit: ${result.hit}, Blow: ${result.blow}`;

    if (result.hit === 4) {
        disableInputs();
    }
}

function checkHitBlow(userInput) {
    let userDigits = userInput.split("").map(Number);
    let answerDigits = answer.split("").map(Number);

    let hit = 0;
    let blow = 0;

    for (let i = 0; i < 4; i++) {
        if (userDigits[i] === answerDigits[i]) {
            hit++;
        } else if (answerDigits.includes(userDigits[i])) {
            blow++;
        }
    }

    return { hit, blow };
}

function isValidInput(input) {
    return /^\d{4}$/.test(input) && new Set(input).size === 4;
}

function disableInputs() {
    document.getElementById("userInput1").disabled = true;
    document.getElementById("userInput2").disabled = true;
    document.getElementById("userInputSingle").disabled = true;
}

function resetGame() {
    answer = generateRandomNumber();
    attempts = [];
    isFirstAttempt = true;
    
    document.getElementById("history").innerHTML = "";
    document.getElementById("message").innerText = "";
    
    document.getElementById("userInput1").disabled = false;
    document.getElementById("userInput2").disabled = false;
    document.getElementById("userInputSingle").disabled = false;
    
    document.getElementById("userInput1").value = "";
    document.getElementById("userInput2").value = "";
    document.getElementById("userInputSingle").value = "";

    document.getElementById("firstAttemptInputs").style.display = "block";
    document.getElementById("normalAttemptInput").style.display = "none";
    document.getElementById("instruction").innerText = "4桁の異なる数字を入力してください";
}
