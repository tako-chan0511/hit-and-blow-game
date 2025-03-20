// 正解の4桁の数字を生成
let answer = generateRandomNumber();
let attempts = [];  // ユーザーの試行履歴を格納
let isFirstAttempt = true; // 最初の試行かどうかを管理

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

    // 入力が4桁の異なる数字かをチェック
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

    // 試行履歴に追加
    attempts.push({ guess: selectedInput, hit: selectedHit, blow: selectedBlow });

    // 履歴を表示
    let historyList = document.getElementById("history");
    let listItem = document.createElement("li");
    listItem.textContent = `${selectedInput} → Hit: ${selectedHit}, Blow: ${selectedBlow}`;
    historyList.appendChild(listItem);

    document.getElementById("message").innerText = selectedHit === 4 ? "正解！おめでとう！🎉" : `選択された候補: ${selectedInput} (Hit: ${selectedHit}, Blow: ${selectedBlow})`;

    // 正解なら入力を無効化
    if (selectedHit === 4) {
        disableInputs();
        return;
    }

    // 2回目以降のUI変更
    isFirstAttempt = false;
    document.getElementById("firstAttemptInputs").style.display = "none";
    document.getElementById("normalAttemptInput").style.display = "block";
    document.getElementById("instruction").innerText = "次の予測を入力してください";
}

// 2回目以降の通常の入力処理
function checkNormalAttempt() {
    let userInput = document.getElementById("userInputSingle").value;
    if (!isValidInput(userInput)) {
        document.getElementById("message").innerText = "4桁の異なる数字を入力してください。";
        return;
    }
    let result = checkHitBlow(userInput);
    let listItem = document.createElement("li");
    listItem.textContent = `${userInput} → Hit: ${result.hit}, Blow: ${result.blow}`;
    document.getElementById("history").appendChild(listItem);
    
    document.getElementById("message").innerText = result.hit === 4 ? "正解！おめでとう！🎉" : `結果: Hit ${result.hit}, Blow ${result.blow}`;
    if (result.hit === 4) {
        disableInputs();
    }
}

// Hit & Blow を計算する関数
function checkHitBlow(userInput) {
    let userDigits = userInput.split("").map(Number);
    let answerDigits = answer.split("").map(Number);

    let hit = 0;
    let blow = 0;

    for (let i = 0; i < 4; i++) {
        if (userDigits[i] === answerDigits[i]) {
            hit++; // 同じ位置に同じ数字があればHit
        } else if (answerDigits.includes(userDigits[i])) {
            blow++; // 位置は違うが数字が含まれていればBlow
        }
    }

    return { hit, blow };
}

// ユーザーの入力が4桁の異なる数字であるかチェック
function isValidInput(input) {
    return /^\d{4}$/.test(input) && new Set(input).size === 4;
}

// 入力欄を無効化する
function disableInputs() {
    document.querySelectorAll("input").forEach(input => input.disabled = true);
}

// ゲームをリセットする（ページをリロード）
function resetGame() {
    sessionStorage.removeItem("reloaded"); // セッションをクリア
    location.reload(); // 画面をリロードして初期状態に戻す
}
