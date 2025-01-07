import React, { useState, useEffect, useRef } from "react";
import "./App.css"; // 必要に応じてCSSを別途用意

// =============================
// イタリア語フレーズ一覧（和訳つき）
// cost: 1~5 (難易度/コスト)
// text: イタリア語
// translation: 和訳
// =============================
const ITALIAN_PHRASES = [
  { text: "Ciao", translation: "こんにちは", cost: 1 },
  { text: "Prego", translation: "どういたしまして", cost: 1 },
  { text: "Grazie", translation: "ありがとう", cost: 2 },
  { text: "Bravo", translation: "素晴らしい", cost: 2 },
  { text: "Ti amo", translation: "愛してる", cost: 2 },
  { text: "Andiamo", translation: "行きましょう", cost: 3 },
  { text: "Come stai?", translation: "元気ですか？", cost: 3 },
  { text: "Benissimo!", translation: "とても元気！", cost: 3 },
  { text: "Buongiorno a te", translation: "あなたに良い朝を", cost: 4 },
  { text: "Buonasera a tutti", translation: "皆さん、こんばんは", cost: 4 },
  { text: "Che ore sono adesso?", translation: "今何時ですか？", cost: 4 },
  { text: "Buon appetito a voi", translation: "皆さん、召し上がれ", cost: 4 },
  { text: "Vorrei una pizza margherita", translation: "マルゲリータピザをいただきたい", cost: 5 },
  { text: "La vita è bella, non è vero?", translation: "人生は素晴らしいよね？", cost: 5 },
  { text: "Potresti aiutarmi per favore?", translation: "手伝っていただけますか？", cost: 5 }
];

// =============================
// 難易度設定
// - phraseTimeLimit: 各フレーズにかけられる秒数
// - timeBonusOnSuccess: 正解時にゲーム全体の残り時間へ加算
// - costRange: 出題するcost(1~5)の範囲
// - spawnIncrementSpeed: 後半で上がっていく難易度の度合い
// =============================
const DIFFICULTY_SETTINGS = {
  facile: {
    label: "Facile",
    phraseTimeLimit: 4,
    timeBonusOnSuccess: 2,
    costRange: [1, 3],
    spawnIncrementSpeed: 1
  },
  medio: {
    label: "Medio",
    phraseTimeLimit: 5,
    timeBonusOnSuccess: 3,
    costRange: [2, 4],
    spawnIncrementSpeed: 2
  },
  difficile: {
    label: "Difficile",
    phraseTimeLimit: 6,
    timeBonusOnSuccess: 4,
    costRange: [3, 5],
    spawnIncrementSpeed: 3
  }
};

function App() {
  const [gamePhase, setGamePhase] = useState("title"); 
  // "title" | "playing" | "result"

  const [difficulty, setDifficulty] = useState("facile");
  const [overallTimeLeft, setOverallTimeLeft] = useState(60); 
  // ゲーム全体の残り時間(秒)
  
  const [score, setScore] = useState(0);
  const [successCount, setSuccessCount] = useState(0);

  // ===================
  // 入力関連
  // ===================
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [currentTranslation, setCurrentTranslation] = useState("");
  const [currentCost, setCurrentCost] = useState(1);

  const [phraseTimeLeft, setPhraseTimeLeft] = useState(0);
  const [typedText, setTypedText] = useState("");

  // ミスに関する情報
  const [missCount, setMissCount] = useState(0);       // ゲーム全体のミス数
  const [missCountInARow, setMissCountInARow] = useState(0); // 連続ミス数 (難易度調整用)

  // 難易度を動的に上げ下げするための変数
  const [dynamicDifficulty, setDynamicDifficulty] = useState(0);

  // 打った文字数（平均速度算出用）
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);

  // タイマー管理用
  const intervalRef = useRef(null);        // ゲーム全体タイマー
  const phraseIntervalRef = useRef(null);  // フレーズごとのタイマー

  // ===================
  // ピザタイマーのための画像
  // ここではフリー素材のピザ画像を使う例です
  // 適宜変更してください
  // ===================
  const pizzaImgUrl =
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhwncyv4NB-NGccbtjQSsMDNy9PXMX2-GqbYBVZMF8J2auXveNXTfN__JkXWxOtCKCf6lP3box5WsYkMCs5BOOAnCEMuSMy7LqwKc8um9dlkCUtBOXcY5iNIJsXouETFMmKo0ow16VwY4ob/s509/food_pizza_whole.png";

  // ===================
  // ゲーム開始
  // ===================
  const startGame = (selectedDifficulty) => {
    setGamePhase("playing");
    setDifficulty(selectedDifficulty);
    setOverallTimeLeft(60);
    setScore(0);
    setSuccessCount(0);
    setMissCount(0);
    setMissCountInARow(0);
    setDynamicDifficulty(0);
    setTotalCharsTyped(0);

    // 最初のフレーズを出す
    getNextPhrase(selectedDifficulty, 0);

    // 全体タイマー開始
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setOverallTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ===================
  // ゲーム終了
  // ===================
  const endGame = () => {
    setGamePhase("result");
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phraseIntervalRef.current) clearInterval(phraseIntervalRef.current);
  };

  // ===================
  // 次のフレーズを取得
  // ===================
  const getNextPhrase = (difficultyKey, dynamicDiff) => {
    const { costRange } = DIFFICULTY_SETTINGS[difficultyKey];
    const minCost = Math.max(costRange[0], costRange[0] + dynamicDiff);
    const maxCost = Math.min(costRange[1], costRange[1] + dynamicDiff);

    // costが minCost ~ maxCost のものを選ぶ
    const candidates = ITALIAN_PHRASES.filter(
      (p) => p.cost >= minCost && p.cost <= maxCost
    );

    // 候補がなければFallback
    const fallback = ITALIAN_PHRASES.filter(
      (p) => p.cost >= costRange[0] && p.cost <= costRange[1]
    );
    const phraseList = candidates.length ? candidates : fallback;

    // ランダムで取得
    const next = phraseList[Math.floor(Math.random() * phraseList.length)];
    setCurrentPhrase(next.text);
    setCurrentTranslation(next.translation);
    setCurrentCost(next.cost);
    setTypedText("");

    // フレーズ残り時間セット
    setPhraseTimeLeft(DIFFICULTY_SETTINGS[difficultyKey].phraseTimeLimit);

    // フレーズタイマー更新
    if (phraseIntervalRef.current) clearInterval(phraseIntervalRef.current);
    phraseIntervalRef.current = setInterval(() => {
      setPhraseTimeLeft((prev) => {
        if (prev <= 1) {
          // タイムオーバー = ミス
          handleMiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ===================
  // 入力ハンドリング
  // - “先に進めない”ミス入力システム
  //   → 間違った文字が入力された時点で打鍵を無効化し、ユーザは修正が必要
  // ===================
  const handleInputChange = (e) => {
    const val = e.target.value;

    // もしユーザがBackspaceしている場合は、そのまま更新許可
    if (val.length < typedText.length) {
      setTypedText(val);
      return;
    }

    // ユーザが"新しく文字を追加"している場合
    if (val.length > typedText.length) {
      const nextChar = val[val.length - 1]; // 今回追加された文字
      const correctChar = currentPhrase[typedText.length]; // 正解であるべき文字

      if (nextChar !== correctChar) {
        // ミス入力
        setMissCount((prev) => prev + 1);
        setMissCountInARow((prev) => prev + 1);

        // “先に進めない” → typedText をそのままにして更新しない
        // ただし、ユーザがBackspaceで修正は可能
        return; 
      } else {
        // 正しい文字を打ったので accepted
        setTypedText(val);
        setMissCountInARow(0);
        setTotalCharsTyped((prev) => prev + 1); // 1文字正しく打ったのでカウント
      }
    }
  };

  // ===================
  // 一文字ずつ正しく入力されていき、フレーズが完成した場合
  // ===================
  useEffect(() => {
    // 完全一致チェック
    if (typedText === currentPhrase && currentPhrase !== "") {
      handleSuccess();
    }
  }, [typedText, currentPhrase]);

  // ===================
  // 正解時の処理
  // ===================
  const handleSuccess = () => {
    setSuccessCount((prev) => prev + 1);

    // スコア加算 (cost × 10)等
    setScore((prev) => prev + currentCost * 10);

    // 正解時にゲーム全体時間を +timeBonus
    const bonus = DIFFICULTY_SETTINGS[difficulty].timeBonusOnSuccess;
    setOverallTimeLeft((prev) => prev + bonus);

    // 次フレーズへ
    goToNextPhraseWithDifficultyAdjust(true);
  };

  // ===================
  // ミス(タイムオーバー)時の処理
  // ===================
  const handleMiss = () => {
    setMissCount((prev) => prev + 1);
    setMissCountInARow((prev) => prev + 1);

    goToNextPhraseWithDifficultyAdjust(false);
  };

  // ===================
  // 難易度調整：成功で上昇、連続ミス2回で下げる、など
  // ===================
  const goToNextPhraseWithDifficultyAdjust = (isSuccess) => {
    if (phraseIntervalRef.current) clearInterval(phraseIntervalRef.current);
    setTypedText("");

    let newDynamic = dynamicDifficulty;

    if (isSuccess) {
      // 5回成功するごとに難易度上げる例
      if ((successCount + 1) % 5 === 0) {
        newDynamic += DIFFICULTY_SETTINGS[difficulty].spawnIncrementSpeed;
      }
    } else {
      // 2回連続ミスで難易度を下げる
      if (missCountInARow + 1 >= 2 && dynamicDifficulty > 0) {
        newDynamic -= 1;
      }
    }
    setDynamicDifficulty(newDynamic);

    getNextPhrase(difficulty, newDynamic);
  };

  // ===================
  // ピザの視覚的タイマー (1フレーズ毎)
  //  - "食べられていくピザ"を表現
  // ===================
  const PizzaTimer = () => {
    if (phraseTimeLeft <= 0) return null;

    const maxTime = DIFFICULTY_SETTINGS[difficulty].phraseTimeLimit;
    const fraction = phraseTimeLeft / maxTime; // 0~1

    // "食べられた"部分の角度 ( 0度=完食 〜 360度=時間満タン )
    // fractionが1なら360°、0なら0°というイメージ
    const angle = 360 * fraction;

    // conic-gradient で中心から扇形に塗りつぶし
    // angle: 0° → 360°の逆なので、(360 - angle)にするか、もしくは回転方向を調整
    // ここでは "外周から徐々に食べていく" 形をイメージし conic-gradient を工夫
    const pizzaMaskStyle = {
      backgroundImage: `
        conic-gradient(
          rgba(0, 0, 0, 0.5) ${angle}deg,
          transparent ${angle}deg 360deg
        )
      `,
      width: "200px",
      height: "200px",
      borderRadius: "50%",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundColor: "transparent",
      backgroundBlendMode: "multiply",
      position: "relative",
      overflow: "hidden"
    };

    // ピザ画像を下に敷く
    const pizzaImgStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "200px",
      height: "200px",
      borderRadius: "50%",
      backgroundImage: `url(${pizzaImgUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    };

    return (
      <div style={{ position: "relative", display: "inline-block" }}>
        <div style={pizzaMaskStyle}>
          <div style={pizzaImgStyle} />
        </div>
      </div>
    );
  };

  // ===================
  // ゲーム画面描画
  // ===================
  const renderGameScreen = () => {
    // フレーズの表示（入力進捗を色分け）
    const splitted = currentPhrase.split("");
    const typedArr = typedText.split("");

    const phraseDisplay = splitted.map((char, idx) => {
      let style = { color: "#fff" };
      if (idx < typedArr.length) {
        // 正しく打ち終えた文字
        style.color = "lightgreen";
      } else if (idx === typedArr.length) {
        // 次に打つ文字を強調（下線）
        style.textDecoration = "underline";
      }
      return (
        <span key={idx} style={style}>
          {char}
        </span>
      );
    });

    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        {/* タイトル */}
        <h2 style={{ color: "#ffe", marginBottom: "1rem" }}>
          Inserisci la frase prima che il pizza finisca!
        </h2>

        {/* イタリア語フレーズ表示 */}
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          {phraseDisplay}
        </div>
        {/* 和訳表示 */}
        <div style={{ fontSize: "1rem", color: "#ccc", marginBottom: "1rem" }}>
          （{currentTranslation}）
        </div>

        {/* ピザの視覚的タイマー */}
        <div style={{ marginBottom: "1rem" }}>
          <PizzaTimer />
        </div>

        {/* 入力ボックス */}
        <div>
          <input
            type="text"
            value={typedText}
            onChange={handleInputChange}
            style={{
              fontSize: "1.2rem",
              padding: "0.5rem",
              borderRadius: "8px",
              border: "2px solid #888",
              width: "60%",
              maxWidth: "400px",
              outline: "none"
            }}
            autoFocus
          />
        </div>
      </div>
    );
  };

  // ===================
  // 平均タイプ速度(文字/秒)を計算
  // ===================
  // - 全体時間は 60秒スタートだが、実際のプレイ経過時間は (60 - overallTimeLeft)
  // - totalCharsTyped: 正しく打った文字数
  const getTypingSpeed = () => {
    const elapsed = 60 - overallTimeLeft;
    if (elapsed <= 0) return 0;
    return (totalCharsTyped / elapsed).toFixed(2);
  };

  // ===================
  // useEffect
  // ===================
  useEffect(() => {
    if (gamePhase !== "playing") {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (phraseIntervalRef.current) clearInterval(phraseIntervalRef.current);
    }
  }, [gamePhase]);

  // ===================
  // JSX描画
  // ===================
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#2d2d2d",
        backgroundImage: `url("https://cdn.pixabay.com/photo/2016/12/10/09/24/italy-1899665_1280.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#fff"
      }}
    >
      {gamePhase === "title" && (
        <div style={{ textAlign: "center", paddingTop: "100px" }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            Italian Typing Feast
          </h1>
          <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
            〜 イタリア語 × タイピング 〜
          </p>
          <div>
            <button
              onClick={() => startGame("facile")}
              style={buttonStyle}
            >
              Facile
            </button>
            <button
              onClick={() => startGame("medio")}
              style={buttonStyle}
            >
              Medio
            </button>
            <button
              onClick={() => startGame("difficile")}
              style={buttonStyle}
            >
              Difficile
            </button>
          </div>
        </div>
      )}

      {gamePhase === "playing" && (
        <>
          {/* 上部固定バー */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "60px",
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              fontSize: "1.1rem",
              zIndex: 10
            }}
          >
            <div>Tempo Totale: {overallTimeLeft}s</div>
            <div>Punteggio: {score} €</div>
            <div>Corrette: {successCount}</div>
            <div>Miss: {missCount}</div>
            <div>Modo: {DIFFICULTY_SETTINGS[difficulty].label}</div>
          </div>

          <div style={{ paddingTop: "70px" }}>{renderGameScreen()}</div>
        </>
      )}

      {gamePhase === "result" && (
        <div style={{ textAlign: "center", paddingTop: "100px" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Risultato Finale</h2>
          <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
            Punteggio: {score} €  
          </p>
          <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
            Frasi corrette: {successCount}
          </p>
          <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
            Miss totali: {missCount}
          </p>
          <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
            Velocità media: {getTypingSpeed()} caratteri/sec
          </p>
          <button
            onClick={() => setGamePhase("title")}
            style={buttonStyle}
          >
            Ritorna al Titolo
          </button>
        </div>
      )}
    </div>
  );
}

// ボタンスタイル
const buttonStyle = {
  backgroundColor: "#e74c3c",
  color: "#fff",
  border: "none",
  padding: "1rem 2rem",
  margin: "0.5rem",
  fontSize: "1.1rem",
  cursor: "pointer",
  borderRadius: "8px",
  transition: "0.3s",
};
export default App;
