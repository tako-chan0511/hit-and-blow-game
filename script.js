// 正解の4桁の数字を生成
let answer = generateRandomNumber();
let attempts = [];  // ユーザーの試行履歴を格納
let isFirstAttempt = true; // 最初の試行かどうかを管理

// すべての重複のない4桁の数字を事前に生成（AI候補用）
let allCandidates = generateAllCandidates();

function generateAllCandidates() {
    let results = [];
    for (let i = 0; i < 10000; i++) {
        let str = i.toString().padStart(4, '0');
        if (new Set(str).size === 4) {
            results.push(str);
        }
    }
    return results;
}

// 4桁の異なる数字をランダムに生成する関数
function generateRandomNumber() {
    let digits = [];
    while (digits.length < 4) {
        let num = Math.floor(Math.random() * 10);
        if (!digits.includes(num)) {
            digits.push(num);
        }
    }
    return digits.join(""); // 数字を文字列として返す
}

// 最初の2つの候補のHit & Blowを計算し、自動的に良い方を選択
function evaluateFirstChoices() {
    let userInput1 = document.getElementById("userInput1").value;
    let userInput2 = document.getElementById("userInput2").value;

    if (!isValidInput(userInput1) || !isValidInput(userInput2)) {
        document.getElementById("message").innerText = "4桁の異なる数字を入力してください。";
        return;
    }

    let result1 = checkHitBlow(userInput1);
    let result2 = checkHitBlow(userInput2);

    let score1 = result1.hit * 11 + result1.blow * 10;
    let score2 = result2.hit * 11 + result2.blow * 10;

    let selectedInput, selectedHit, selectedBlow;
    if (score1 >= score2) {
        selectedInput = userInput1;
        selectedHit = result1.hit;
        selectedBlow = result1.blow;
    } else {
        selectedInput = userInput2;
        selectedHit = result2.hit;
        selectedBlow = result2.blow;
    }

    attempts.push({ guess: selectedInput, hit: selectedHit, blow: selectedBlow });

    addHistory(selectedInput, selectedHit, selectedBlow);

    document.getElementById("message").innerText = selectedHit === 4 ? "正解！おめでとう！🎉" : `選択された候補: ${selectedInput} (Hit: ${selectedHit}, Blow: ${selectedBlow})`;

    if (selectedHit === 4) {
        disableInputs();
        return;
    }

    isFirstAttempt = false;
    document.getElementById("firstAttemptInputs").style.display = "none";
    document.getElementById("normalAttemptInput").style.display = "block";
    document.getElementById("instruction").innerText = "次の予測を入力してください";

    showAISuggestion();
    hideAISuggestion(); // ← 必ず非表示に戻す！
}

function checkNormalAttempt() {
    let userInput = document.getElementById("userInputSingle").value;
    if (!isValidInput(userInput)) {
        document.getElementById("message").innerText = "4桁の異なる数字を入力してください。";
        return;
    }
    let result = checkHitBlow(userInput);
    attempts.push({ guess: userInput, hit: result.hit, blow: result.blow });

    addHistory(userInput, result.hit, result.blow);

    document.getElementById("message").innerText = result.hit === 4 ? "正解！おめでとう！🎉" : `結果: Hit ${result.hit}, Blow ${result.blow}`;
    if (result.hit === 4) {
        disableInputs();
    } else {
        showAISuggestion();
        hideAISuggestion(); // ← 必ず非表示に戻す！
    }
}

function addHistory(guess, hit, blow) {
    let listItem = document.createElement("li");
    listItem.textContent = `${guess} → Hit: ${hit}, Blow: ${blow}`;
    document.getElementById("history").appendChild(listItem);
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
    document.querySelectorAll("input").forEach(input => input.disabled = true);
}

function resetGame() {
    sessionStorage.removeItem("reloaded");
    location.reload();
}

function showAISuggestion() {
    let filtered = allCandidates.filter(candidate => {
        return attempts.every(attempt => {
            let result = checkHitBlowForAI(candidate, attempt.guess);
            return result.hit === attempt.hit && result.blow === attempt.blow;
        });
    });
    let nextGuess = filtered.length ? filtered[0] : "候補なし";
    document.getElementById("aiNextGuess").innerText = nextGuess;
    // 表示のON/OFF制御はしない（ユーザーのボタン操作に任せる）
}


function checkHitBlowForAI(candidate, guess) {
    let hit = 0, blow = 0;
    for (let i = 0; i < 4; i++) {
        if (candidate[i] === guess[i]) hit++;
        else if (candidate.includes(guess[i])) blow++;
    }
    return { hit, blow };
}

// AI候補の表示・非表示を切り替える関数
function toggleAISuggestion() {
    const aiBox = document.getElementById("aiSuggestion");
    if (aiBox.style.display === "none") {
        aiBox.style.display = "block";
    } else {
        aiBox.style.display = "none";
    }
}
function hideAISuggestion() {
    const aiBox = document.getElementById("aiSuggestion");
    aiBox.style.display = "none";
}

