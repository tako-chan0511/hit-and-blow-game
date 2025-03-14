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

// 最初の2つの候補のHit & Blowを計算し、選択肢を表示
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

    // ユーザーに選択肢を表示
    document.getElementById("choiceMessage").innerText = `どちらを選びますか？\n` +
        `候補1 (${userInput1}): Hit: ${result1.hit}, Blow: ${result1.blow}\n` +
        `候補2 (${userInput2}): Hit: ${result2.hit}, Blow: ${result2.blow}`;

    // ボタンのラベルを設定
    document.getElementById("select1").innerText = `候補1 (${userInput1}) を選ぶ`;
    document.getElementById("select2").innerText = `候補2 (${userInput2}) を選ぶ`;

    // 選択用のデータをボタンにセット
    document.getElementById("select1").setAttribute("data-value", userInput1);
    document.getElementById("select1").setAttribute("data-hit", result1.hit);
    document.getElementById("select1").setAttribute("data-blow", result1.blow);

    document.getElementById("select2").setAttribute("data-value", userInput2);
    document.getElementById("select2").setAttribute("data-hit", result2.hit);
    document.getElementById("select2").setAttribute("data-blow", result2.blow);

    // UIの切り替え（選択肢の表示）
    document.getElementById("firstAttemptInputs").style.display = "none";
    document.getElementById("selectionButtons").style.display = "block";
}

// ユーザーが1つ目または2つ目の候補を選択
function selectFirstChoice(choice) {
    let selectedButton = choice === 1 ? document.getElementById("select1") : document.getElementById("select2");
    let selectedInput = selectedButton.getAttribute("data-value");
    let hit = parseInt(selectedButton.getAttribute("data-hit"));
    let blow = parseInt(selectedButton.getAttribute("data-blow"));

    // 試行履歴に追加
    attempts.push({ guess: selectedInput, hit, blow });

    // 履歴を表示
    let historyList = document.getElementById("history");
    let listItem = document.createElement("li");
    listItem.textContent = `${selectedInput} → Hit: ${hit}, Blow: ${blow}`;
    historyList.appendChild(listItem);

    document.getElementById("message").innerText = hit === 4 ? "正解！おめでとう！🎉" : `Hit: ${hit}, Blow: ${blow}`;

    // 正解なら入力を無効化
    if (hit === 4) {
        disableInputs();
        return;
    }

    // 2回目以降のUI変更
    isFirstAttempt = false;
    document.getElementById("selectionButtons").style.display = "none";
    document.getElementById("normalAttemptInput").style.display = "block";
    document.getElementById("instruction").innerText = "次の予測を入力してください";
}

// 2回目以降の通常のHit & Blow判定
function checkNormalAttempt() {
    let userInput = document.getElementById("userInputSingle").value;

    // 入力が4桁の異なる数字かチェック
    if (!isValidInput(userInput)) {
        document.getElementById("message").innerText = "4桁の異なる数字を入力してください。";
        return;
    }

    let result = checkHitBlow(userInput);

    // 試行履歴に追加
    attempts.push({ guess: userInput, hit: result.hit, blow: result.blow });

    // 履歴を表示
    let historyList = document.getElementById("history");
    let listItem = document.createElement("li");
    listItem.textContent = `${userInput} → Hit: ${result.hit}, Blow: ${result.blow}`;
    historyList.appendChild(listItem);

    document.getElementById("message").innerText = result.hit === 4 ? "正解！おめでとう！🎉" : `Hit: ${result.hit}, Blow: ${result.blow}`;

    // 正解なら入力を無効化
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
