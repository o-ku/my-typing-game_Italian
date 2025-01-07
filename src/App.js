import React, { useState, useEffect, useRef } from "react";
import "./App.css"; // 必要に応じてCSSを別途用意

// =============================
// イタリア語フレーズ一覧（和訳つき）
// cost: 1~5 (難易度/コスト)
// text: イタリア語
// translation: 和訳
// =============================
const ITALIAN_PHRASES = [
  // // 難易度 1 (単語)
  // { text: "Sì", translation: "はい", cost: 1 },
  // { text: "No", translation: "いいえ", cost: 1 },
  // { text: "Ciao", translation: "こんにちは/さようなら", cost: 1 },
  // { text: "Grazie", translation: "ありがとう", cost: 1 },
  // { text: "Prego", translation: "どういたしまして", cost: 1 },
  // { text: "Scusa", translation: "すみません", cost: 1 },
  // { text: "Per favore", translation: "お願いします", cost: 1 },
  // { text: "Bene", translation: "良い", cost: 1 },
  // { text: "Male", translation: "悪い", cost: 1 },
  // { text: "Casa", translation: "家", cost: 1 },
  // { text: "Libro", translation: "本", cost: 1 },
  // { text: "Acqua", translation: "水", cost: 1 },
  // { text: "Vino", translation: "ワイン", cost: 1 },
  // { text: "Pane", translation: "パン", cost: 1 },
  // { text: "Caffè", translation: "コーヒー", cost: 1 },
  // { text: "Tè", translation: "紅茶", cost: 1 },
  // { text: "Latte", translation: "牛乳", cost: 1 },
  // { text: "Uno", translation: "1", cost: 1 },
  // { text: "Due", translation: "2", cost: 1 },
  // { text: "Tre", translation: "3", cost: 1 },
  // { text: "Quattro", translation: "4", cost: 1 },
  // { text: "Cinque", translation: "5", cost: 1 },
  // { text: "Sei", translation: "6", cost: 1 },
  // { text: "Sette", translation: "7", cost: 1 },
  // { text: "Otto", translation: "8", cost: 1 },
  // { text: "Nove", translation: "9", cost: 1 },
  // { text: "Dieci", translation: "10", cost: 1 },
  // { text: "Oggi", translation: "今日", cost: 1 },
  // { text: "Domani", translation: "明日", cost: 1 },
  // { text: "Ieri", translation: "昨日", cost: 1 },
  // { text: "Mattina", translation: "朝", cost: 1},
  // { text: "Pomeriggio", translation: "午後", cost: 1},
  // { text: "Sera", translation: "夕方", cost: 1},
  // { text: "Notte", translation: "夜", cost: 1},
  // { text: "Andare", translation: "行く", cost: 1 },
  // { text: "Fare", translation: "する", cost: 1 },
  // { text: "Mangiare", translation: "食べる", cost: 1 },
  // { text: "Bere", translation: "飲む", cost: 1 },
  // { text: "Dormire", translation: "寝る", cost: 1 },
  // { text: "Parla", translation: "話す", cost: 1 },
  // { text: "Leggere", translation: "読む", cost: 1 },
  // { text: "Scrivere", translation: "書く", cost: 1 },
  // { text: "Capire", translation: "理解する", cost: 1 },
  // { text: "Sapere", translation: "知る", cost: 1 },
  // { text: "Conoscere", translation: "知っている（人や場所）", cost: 1 },
  // { text: "Potere", translation: "できる", cost: 1 },
  // { text: "Volere", translation: "したい", cost: 1 },
  // { text: "Dovere", translation: "しなければならない", cost: 1 },
  // { text: "Bellissimo", translation: "とても美しい", cost: 1 },
  // { text: "Bruttissimo", translation: "とても醜い", cost: 1},
  // { text: "Grande", translation: "大きい", cost: 1},
  // { text: "Piccolo", translation: "小さい", cost: 1},
  // { text: "Caldo", translation: "熱い", cost: 1},
  // { text: "Freddo", translation: "寒い", cost: 1},

  // // 難易度 2 (簡単なフレーズ)
  // { text: "Come stai?", translation: "お元気ですか？", cost: 2 },
  // { text: "Sto bene", translation: "元気です", cost: 2 },
  // { text: "Sto male", translation: "調子が悪いです", cost: 2 },
  // { text: "Piacere", translation: "はじめまして", cost: 2 },
  // { text: "Come ti chiami?", translation: "あなたの名前は？", cost: 2 },
  // { text: "Mi chiamo ...", translation: "私の名前は...", cost: 2 },
  // { text: "Quanti anni hai?", translation: "何歳ですか？", cost: 2 },
  // { text: "Ho ... anni", translation: "...歳です", cost: 2 },
  // { text: "Di dove sei?", translation: "出身はどこですか？", cost: 2 },
  // { text: "Sono di ...", translation: "...出身です", cost: 2 },
  // { text: "Che ore sono?", translation: "何時ですか？", cost: 2 },
  // { text: "Sono le ...", translation: "...時です", cost: 2 },
  // { text: "Parli italiano?", translation: "イタリア語を話しますか？", cost: 2 },
  // { text: "Sì, un po'", translation: "はい、少し", cost: 2 },
  // { text: "Non capisco", translation: "わかりません", cost: 2 },
  // { text: "Mi piace ...", translation: "...が好きです", cost: 2 },
  // { text: "Non mi piace ...", translation: "...が好きではありません", cost: 2 },
  // { text: "Voglio mangiare", translation: "食べたい", cost: 2 },
  // { text: "Voglio bere", translation: "飲みたい", cost: 2 },
  // { text: "Posso usare ...?", translation: "...を使ってもいいですか？", cost: 2 },
  // { text: "Mi scusi", translation: "すみません（丁寧に）", cost: 2 },
  // { text: "Dov'è ...?", translation: "...はどこですか？", cost: 2 },
  // { text: "Quanto costa?", translation: "いくらですか？", cost: 2 },
  // { text: "A destra", translation: "右へ", cost: 2 },
  // { text: "A sinistra", translation: "左へ", cost: 2 },
  // { text: "Dritto", translation: "まっすぐ", cost: 2 },
  // { text: "Grazie mille", translation: "本当にありがとう", cost: 2 },
  // { text: "Buona giornata", translation: "良い一日を", cost: 2 },
  // { text: "Buona notte", translation: "おやすみなさい", cost: 2 },
  // { text: "Arrivederci", translation: "さようなら（丁寧に）", cost: 2 },

  // // 難易度 3 (基本的な文法を含むフレーズ)
  // { text: "Vorrei una pizza", translation: "ピザを1枚ください", cost: 3 },
  // { text: "Cosa mi consiglia?", translation: "おすすめは何ですか？", cost: 3 },
  // { text: "Mi può aiutare?", translation: "手伝っていただけますか？", cost: 3 },
  // { text: "Sto studiando italiano", translation: "イタリア語を勉強しています", cost: 3 },
  // { text: "Dove posso comprare ...?", translation: "...はどこで買えますか？", cost: 3 },
  // { text: "Mi sono perso", translation: "迷子になりました", cost: 3 },
  // { text: "C'è un bagno qui vicino?", translation: "この近くにトイレはありますか？", cost: 3 },
  // { text: "Parla lentamente, per favore", translation: "ゆっくり話してください", cost: 3 },
  // { text: "Può ripetere, per favore?", translation: "もう一度言っていただけますか？", cost: 3 },
  // { text: "Mi piace molto l'Italia", translation: "イタリアがとても好きです", cost: 3 },
  // { text: "Che lavoro fai?", translation: "お仕事は何ですか？", cost: 3 },
  // { text: "Sono un impiegato", translation: "会社員です", cost: 3 },
  // { text: "Sono uno studente", translation: "学生です", cost: 3 },
  // { text: "Vado in Italia l'anno prossimo", translation: "来年イタリアに行きます", cost: 3 },
  // { text: "Sono stato in Italia", translation: "イタリアに行ったことがあります", cost: 3 },
  // { text: "Ho mangiato la pizza", translation: "ピザを食べました", cost: 3 },
  // { text: "Ho bevuto il vino", translation: "ワインを飲みました", cost: 3 },
  // { text: "Non ho mai visto ...", translation: "...を見たことがありません", cost: 3 },
  // { text: "Andiamo a mangiare fuori?", translation: "外食しましょうか？", cost: 3 },
  // { text: "Che cosa vuoi fare?", translation: "何をしたいですか？", cost: 3 },
  // { text: "Voglio andare al mare", translation: "海に行きたいです", cost: 3 },
  // { text: "Devo studiare per l'esame", translation: "試験勉強をしなければなりません", cost: 3 },
  // { text: "Puoi parlare italiano bene", translation: "あなたはイタリア語を上手に話せます", cost: 3 },
  // { text: "Mi piace leggere i libri", translation: "本を読むのが好きです", cost: 3 },

  // // 難易度 4 (やや複雑な文法・フレーズ)
  // { text: "Che cosa hai fatto ieri?", translation: "昨日は何をしましたか？", cost: 4 },
  // { text: "Sono andato al cinema con amici", translation: "友達と映画に行きました", cost: 4 },
  // { text: "Che tempo fa oggi?", translation: "今日の天気はどうですか？", cost: 4 },
  // { text: "Fa bel tempo", translation: "良い天気です", cost: 4 },
  // { text: "Fa brutto tempo", translation: "悪い天気です", cost: 4 },
  // { text: "Potresti passarmi il sale?", translation: "塩を取っていただけますか？", cost: 4 },
  // { text: "Mi piacerebbe visitare Roma", translation: "ローマを訪れたいです", cost: 4 },
  // { text: "Non so cosa fare domani", translation: "明日何をすればいいかわかりません", cost: 4 },
  // { text: "Penso che sia una buona idea", translation: "それは良い考えだと思います", cost: 4 },
  // { text: "Credo di aver perso il portafoglio", translation: "財布をなくしたかもしれません", cost: 4 },
  // { text: "Spero di rivederti presto", translation: "また近いうちにお会いしたいです", cost: 4 },
  // { text: "È meglio prenotare in anticipo", translation: "事前に予約したほうがいいです", cost: 4 },
  // { text: "Mi dispiace di aver fatto tardi", translation: "遅れて申し訳ありません", cost: 4 },
  // { text: "Non è necessario che tu venga", translation: "あなたは来る必要はありません", cost: 4 },
  // { text: "È importante che tu studi", translation: "あなたが勉強することは重要です", cost: 4 },
  // { text: "Quando sono arrivato, lui era già uscito", translation: "私が着いた時、彼は既に出かけていました", cost: 4 },
  // { text: "Appena avrò tempo, ti chiamerò", translation: "時間ができたらすぐに電話します", cost: 4 },
  // { text: "Anche se piove, andrò comunque", translation: "たとえ雨でも、とにかく行きます", cost: 4 },
  // { text: "Se fossi in te, non lo farei", translation: "もし私があなたなら、そんなことはしません", cost: 4 },
  // { text: "Avrei voluto essere lì con te", translation: "あなたと一緒にそこにいたかったです", cost: 4 },

  // // 難易度 5 (複雑な文法・長文)
  // { text: "Se avessi studiato di più, avrei passato l'esame", translation: "もっと勉強していたら、試験に合格していたのに", cost: 5 },
  // { text: "È necessario che tu sappia la verità prima di prendere una decisione", translation: "決断を下す前に、真実を知っておく必要があります", cost: 5 },
  // { text: "Nonostante fosse molto stanco, ha continuato a lavorare fino a tardi", translation: "彼はとても疲れていたにもかかわらず、遅くまで仕事を続けました", cost: 5 },
  // { text: "Qualunque cosa tu faccia, fallo con tutto il cuore", translation: "何をするにしても、心を込めてやりなさい", cost: 5 },
  // { text: "Suppongo che tu abbia ragione, ma vorrei comunque verificare di persona", translation: "あなたが正しいとは思いますが、それでも自分で確認したいです", cost: 5 },
  // { text: "Il fatto che tu sia qui oggi dimostra quanto tu sia determinato a raggiungere il tuo obiettivo", translation: "あなたが今日ここにいるという事実が、目標達成への決意の強さを物語っています", cost: 5 },
  // { text: "Mi chiedo se sia possibile completare il progetto entro la scadenza fissata", translation: "定められた期限までにプロジェクトを完了できるかどうか疑問です", cost: 5 },
  // { text: "Per quanto mi piaccia l'idea, temo che non sia realizzabile in questo momento", translation: "そのアイデアは気に入っていますが、現時点では実現不可能だと思います", cost: 5 },
  // { text: "È essenziale che tutti i membri del team siano sulla stessa lunghezza d'onda per garantire il successo del progetto", translation: "プロジェクトの成功を確実にするためには、チームメンバー全員が同じ方向を向いていることが不可欠です", cost: 5 },
  // { text: "Sebbene abbia cercato in tutti i modi di convincerlo, non sono riuscito a fargli cambiare idea", translation: "彼を説得するためにあらゆる手を尽くしましたが、考えを変えさせることはできませんでした", cost: 5 },

  // 難易度 1 (単語)
  { text: "Sì", translation: "はい", cost: 1 },
  { text: "No", translation: "いいえ", cost: 1 },
  { text: "Ciao", translation: "こんにちは/さようなら", cost: 1 },
  { text: "Grazie", translation: "ありがとう", cost: 1 },
  { text: "Prego", translation: "どういたしまして", cost: 1 },
  { text: "Scusa", translation: "すみません（カジュアル）", cost: 1 },
  { text: "Per favore", translation: "お願いします", cost: 1 },
  { text: "Bene", translation: "良い", cost: 1 },
  { text: "Male", translation: "悪い", cost: 1 },
  { text: "Bello", translation: "美しい、良い", cost: 1},
  { text: "Brutto", translation: "醜い、悪い", cost: 1},
  { text: "Casa", translation: "家", cost: 1 },
  { text: "Libro", translation: "本", cost: 1 },
  { text: "Acqua", translation: "水", cost: 1 },
  { text: "Vino", translation: "ワイン", cost: 1 },
  { text: "Pane", translation: "パン", cost: 1 },
  { text: "Caffè", translation: "コーヒー", cost: 1 },
  { text: "Tè", translation: "紅茶", cost: 1 },
  { text: "Latte", translation: "牛乳", cost: 1 },
  { text: "Uno", translation: "1", cost: 1 },
  { text: "Due", translation: "2", cost: 1 },
  { text: "Tre", translation: "3", cost: 1 },
  { text: "Quattro", translation: "4", cost: 1 },
  { text: "Cinque", translation: "5", cost: 1 },
  { text: "Sei", translation: "6", cost: 1 },
  { text: "Sette", translation: "7", cost: 1 },
  { text: "Otto", translation: "8", cost: 1 },
  { text: "Nove", translation: "9", cost: 1 },
  { text: "Dieci", translation: "10", cost: 1 },
  { text: "Oggi", translation: "今日", cost: 1 },
  { text: "Domani", translation: "明日", cost: 1 },
  { text: "Ieri", translation: "昨日", cost: 1 },
  { text: "Mattina", translation: "朝", cost: 1 },
  { text: "Pomeriggio", translation: "午後", cost: 1 },
  { text: "Sera", translation: "夕方", cost: 1 },
  { text: "Notte", translation: "夜", cost: 1 },
  { text: "Andare", translation: "行く", cost: 1 },
  { text: "Fare", translation: "する", cost: 1 },
  { text: "Mangiare", translation: "食べる", cost: 1 },
  { text: "Bere", translation: "飲む", cost: 1 },
  { text: "Dormire", translation: "寝る", cost: 1 },
  { text: "Parlare", translation: "話す", cost: 1 },
  { text: "Leggere", translation: "読む", cost: 1 },
  { text: "Scrivere", translation: "書く", cost: 1 },
  { text: "Capire", translation: "理解する", cost: 1 },
  { text: "Sapere", translation: "知る（情報）", cost: 1 },
  { text: "Conoscere", translation: "知っている（人や場所）", cost: 1 },
  { text: "Potere", translation: "できる", cost: 1 },
  { text: "Volere", translation: "したい", cost: 1 },
  { text: "Dovere", translation: "しなければならない", cost: 1 },
  { text: "Bellissimo", translation: "とても美しい", cost: 1 },
  { text: "Bruttissimo", translation: "とても醜い", cost: 1 },
  { text: "Grande", translation: "大きい", cost: 1 },
  { text: "Piccolo", translation: "小さい", cost: 1 },
  { text: "Caldo", translation: "熱い", cost: 1 },
  { text: "Freddo", translation: "寒い", cost: 1 },
  { text: "Facile", translation: "簡単", cost: 1},
  { text: "Difficile", translation: "難しい", cost: 1},
  { text: "Importante", translation: "重要", cost: 1},
  { text: "Interessante", translation: "面白い", cost: 1},
  { text: "Gatto", translation: "猫", cost: 1},
  { text: "Cane", translation: "犬", cost: 1},
  { text: "Sole", translation: "太陽", cost: 1},
  { text: "Luna", translation: "月", cost: 1},
  { text: "Stella", translation: "星", cost: 1},
  { text: "Mamma", translation: "母", cost: 1},
  { text: "Papà", translation: "父", cost: 1},
  { text: "Fratello", translation: "兄/弟", cost: 1},
  { text: "Sorella", translation: "姉/妹", cost: 1},
  { text: "Uomo", translation: "男", cost: 1},
  { text: "Donna", translation: "女", cost: 1},

  // 難易度 2 (簡単なフレーズ)
  { text: "Come stai?", translation: "お元気ですか？", cost: 2 },
  { text: "Sto bene, grazie", translation: "元気です、ありがとう", cost: 2 },
  { text: "Non sto molto bene", translation: "あまり元気ではありません", cost: 2 },
  { text: "Piacere di conoscerti", translation: "はじめまして", cost: 2 },
  { text: "Come ti chiami?", translation: "あなたの名前は？", cost: 2 },
  { text: "Mi chiamo Mario", translation: "私の名前はマリオです", cost: 2 },
  { text: "Quanti anni hai?", translation: "何歳ですか？", cost: 2 },
  { text: "Ho 20 anni", translation: "20歳です", cost: 2 },
  { text: "Di dove sei?", translation: "出身はどこですか？", cost: 2 },
  { text: "Sono di Tokyo", translation: "東京出身です", cost: 2 },
  { text: "Che ore sono?", translation: "何時ですか？", cost: 2 },
  { text: "È l'una", translation: "1時です", cost: 2 },
  { text: "Sono le due", translation: "2時です", cost: 2 },
  { text: "Parli italiano?", translation: "イタリア語を話しますか？", cost: 2 },
  { text: "Sì, parlo un po' di italiano", translation: "はい、イタリア語を少し話します", cost: 2 },
  { text: "No, non parlo italiano", translation: "いいえ、イタリア語を話しません", cost: 2 },
  { text: "Non capisco", translation: "わかりません", cost: 2 },
  { text: "Mi piace la pizza", translation: "ピザが好きです", cost: 2 },
  { text: "Non mi piace il caffè", translation: "コーヒーが好きではありません", cost: 2 },
  { text: "Voglio mangiare la pasta", translation: "パスタが食べたい", cost: 2 },
  { text: "Vorrei bere un bicchiere di vino", translation: "ワインを一杯飲みたいです", cost: 2 },
  { text: "Posso usare il bagno?", translation: "トイレを使ってもいいですか？", cost: 2 },
  { text: "Mi scusi, dov'è la stazione?", translation: "すみません、駅はどこですか？", cost: 2 },
  { text: "Quanto costa questo?", translation: "これはいくらですか？", cost: 2 },
  { text: "A destra, per favore", translation: "右へお願いします", cost: 2 },
  { text: "A sinistra, per favore", translation: "左へお願いします", cost: 2 },
  { text: "Sempre dritto", translation: "まっすぐです", cost: 2 },
  { text: "Grazie mille", translation: "本当にありがとう", cost: 2 },
  { text: "Buona giornata", translation: "良い一日を", cost: 2 },
  { text: "Buona notte", translation: "おやすみなさい", cost: 2 },
  { text: "Arrivederci", translation: "さようなら（丁寧に）", cost: 2 },
  { text: "Mi dispiace", translation: "ごめんなさい", cost: 2},
  { text: "Che bello!", translation: "なんて素晴らしい！", cost: 2},
  { text: "Che peccato!", translation: "残念！", cost: 2},
  { text: "Buon appetito!", translation: "召し上がれ！", cost: 2},
  { text: "Salute!", translation: "乾杯！", cost: 2},

  // 難易度 3 (基本的な文法を含むフレーズ)
  { text: "Vorrei una pizza margherita", translation: "マルゲリータピザを1枚ください", cost: 3 },
  { text: "Cosa mi consiglia di mangiare?", translation: "おすすめの食べ物は何ですか？", cost: 3 },
  { text: "Mi può aiutare, per favore?", translation: "すみませんが、手伝っていただけますか？", cost: 3 },
  { text: "Sto studiando l'italiano", translation: "イタリア語を勉強しています", cost: 3 },
  { text: "Dove posso comprare un biglietto?", translation: "切符はどこで買えますか？", cost: 3 },
  { text: "Mi sono perso, mi può aiutare?", translation: "道に迷いました、助けていただけますか？", cost: 3 },
  { text: "C'è un bagno qui vicino?", translation: "この近くにトイレはありますか？", cost: 3 },
  { text: "Può parlare più lentamente?", translation: "もっとゆっくり話していただけますか？", cost: 3 },
  { text: "Può ripetere, per favore?", translation: "もう一度言っていただけますか？", cost: 3 },
  { text: "Mi piace molto l'Italia", translation: "イタリアがとても好きです", cost: 3 },
  { text: "Che lavoro fai?", translation: "お仕事は何ですか？", cost: 3 },
  { text: "Sono un impiegato", translation: "会社員です", cost: 3 },
  { text: "Sono uno studente", translation: "学生です", cost: 3 },
  { text: "L'anno prossimo vado in Italia", translation: "来年イタリアに行きます", cost: 3 },
  { text: "Sono già stato in Italia", translation: "イタリアに行ったことがあります", cost: 3 },
  { text: "Ho mangiato la pizza a Napoli", translation: "ナポリでピザを食べました", cost: 3 },
  { text: "Ho bevuto un ottimo vino rosso", translation: "とても美味しい赤ワインを飲みました", cost: 3 },
  { text: "Non ho mai visto un posto così bello", translation: "こんなに美しい場所を見たことがありません", cost: 3 },
  { text: "Andiamo a mangiare fuori stasera?", translation: "今晩、外食しましょうか？", cost: 3 },
  { text: "Che cosa vuoi fare domani?", translation: "明日は何をしたいですか？", cost: 3 },
  { text: "Voglio andare al mare", translation: "海に行きたいです", cost: 3 },
  { text: "Devo studiare per l'esame di italiano", translation: "イタリア語の試験勉強をしなければなりません", cost: 3 },
  { text: "Sai parlare bene l'italiano", translation: "イタリア語を上手に話せますね", cost: 3 },
  { text: "Mi piace leggere i libri italiani", translation: "イタリアの本を読むのが好きです", cost: 3 },
  { text: "Questo libro è molto interessante", translation: "この本はとても面白いです", cost: 3},
  { text: "Fa molto caldo oggi", translation: "今日はとても暑いです", cost: 3},
  { text: "Ieri ha fatto freddo", translation: "昨日は寒かったです", cost: 3},
  { text: "Domani pioverà", translation: "明日は雨が降るでしょう", cost: 3},
  { text: "Il treno parte alle nove", translation: "電車は9時に出発します", cost: 3},
  { text: "L'aereo arriva alle dieci", translation: "飛行機は10時に到着します", cost: 3},
  { text: "La lezione inizia alle otto e mezzo", translation: "授業は8時半に始まります", cost: 3},

  // 難易度 4 (やや複雑な文法・フレーズ)
  { text: "Che cosa hai fatto ieri sera?", translation: "昨日の夜は何をしましたか？", cost: 4 },
  { text: "Ieri sera sono uscito con amici", translation: "昨日の夜は友達と出かけました", cost: 4 },
  { text: "Che tempo fa oggi a Roma?", translation: "今日のローマの天気はどうですか？", cost: 4 },
  { text: "Oggi a Roma fa bel tempo", translation: "今日のローマは良い天気です", cost: 4 },
  { text: "Mi dispiace, oggi fa brutto tempo", translation: "残念ですが、今日は悪天候です", cost: 4 },
  { text: "Potresti passarmi il sale, per favore?", translation: "すみませんが、塩を取っていただけますか？", cost: 4 },
  { text: "Mi piacerebbe molto visitare Roma", translation: "ぜひローマを訪れたいです", cost: 4 },
  { text: "Non so proprio cosa fare domani", translation: "明日は何をしたらいいのか、本当にわかりません", cost: 4 },
  { text: "Penso che sia una buona idea", translation: "それは良い考えだと思います", cost: 4 },
  { text: "Temo di aver perso il portafoglio", translation: "財布をなくしてしまったかもしれません", cost: 4 },
  { text: "Spero di rivederti molto presto", translation: "またすぐに会えるといいですね", cost: 4 },
  { text: "Secondo me, è meglio prenotare in anticipo", translation: "私の考えでは、事前に予約したほうがいいです", cost: 4 },
  { text: "Mi dispiace molto di aver fatto tardi", translation: "遅くなって本当に申し訳ありません", cost: 4 },
  { text: "Non è necessario che tu venga domani", translation: "明日、あなたは来る必要はありません", cost: 4 },
  { text: "È importante che tu studi l'italiano", translation: "あなたがイタリア語を勉強することは重要です", cost: 4 },
  { text: "Quando sono arrivato, lui era già uscito", translation: "私が到着した時、彼はすでに外出していました", cost: 4 },
  { text: "Appena avrò un po' di tempo, ti chiamerò", translation: "少し時間ができたら、すぐに電話します", cost: 4 },
  { text: "Anche se piove, andrò comunque a fare una passeggiata", translation: "たとえ雨が降っても、とにかく散歩に行きます", cost: 4 },
  { text: "Se fossi in te, non lo farei mai", translation: "もし私があなたの立場なら、そんなことは絶対にしません", cost: 4 },
  { text: "Avrei tanto voluto essere lì con te", translation: "私もあなたと一緒にそこにいられたら、どんなによかったことでしょう", cost: 4 },
  { text: "Ho deciso di andare in Italia quest'estate", translation: "この夏イタリアに行くことに決めました", cost: 4},
  { text: "Preferirei mangiare la pizza piuttosto che la pasta", translation: "パスタよりむしろピザが食べたいです", cost: 4},
  { text: "È possibile che domani nevichi", translation: "明日は雪が降るかもしれません", cost: 4},
  { text: "Dubito che lui dica la verità", translation: "彼が真実を言っているのか疑わしいです", cost: 4},
  { text: "Bisogna che io finisca questo lavoro entro domani", translation: "明日までにこの仕事を終わらせなければなりません", cost: 4},

  // 難易度 5 (複雑な文法・長文)
  { text: "Se avessi studiato di più, avrei passato l'esame d'italiano", translation: "もっと勉強していたら、イタリア語の試験に合格できていたのに", cost: 5 },
  { text: "È fondamentale che tu sappia la verità prima di prendere una decisione così importante", translation: "そんなに重要な決断を下す前に、真実を知っておくことが肝心です", cost: 5 },
  { text: "Malgrado fosse molto stanco, ha continuato a lavorare fino a tardi", translation: "彼は大変疲れていたにもかかわらず、夜遅くまで仕事を続けました", cost: 5 },
  { text: "Qualunque cosa tu decida di fare, ti auguro buona fortuna", translation: "あなたが何をするにしても、幸運を祈っています", cost: 5 },
  { text: "Immagino che tu abbia ragione, ma vorrei comunque controllare di persona", translation: "あなたが正しいのだと思いますが、それでもやはり自分で確認してみたいです", cost: 5 },
  { text: "Il fatto che tu sia qui oggi dimostra quanto tu sia determinato", translation: "あなたが今日ここにいるという事実が、あなたの決意のほどを示しています", cost: 5 },
  { text: "Mi domando se sia possibile completare il progetto entro la data di scadenza", translation: "締め切り日までにプロジェクトを完成させることは可能なのだろうか", cost: 5 },
  { text: "Per quanto mi piaccia l'idea, dubito che sia realizzabile", translation: "そのアイデアは気に入っていますが、実現可能か疑問です", cost: 5 },
  { text: "È essenziale che tutti i membri del team siano d'accordo per assicurare il successo", translation: "成功を確実なものにするには、チームメンバー全員が合意していることが不可欠です", cost: 5 },
  { text: "Quantunque abbia cercato in tutti i modi, non sono riuscito a convincerlo", translation: "あらゆる方法で試してみましたが、彼を説得することはできませんでした", cost: 5 },
  { text: "Bisogna mangiare per vivere, non vivere per mangiare", translation: "生きるために食べなければならないのであって、食べるために生きてはならない", cost: 5 },
  { text: "Chi dorme non piglia pesci", translation: "眠っている人は魚を捕まえられない（早起きは三文の徳）", cost: 5 },
  { text: "Quando il gatto non c'è, i topi ballano", translation: "猫がいないと、ネズミは踊る（鬼の居ぬ間に洗濯）", cost: 5 },
  { text: "Meglio tardi che mai", translation: "遅くてもしないよりはまし", cost: 5 },
  { text: "L'abito non fa il monaco", translation: "着ている服は修道士を作らない（人は見かけによらぬもの）", cost: 5 }

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
    phraseTimeLimit: 8,
    timeBonusOnSuccess: 2,
    costRange: [1, 3],
    spawnIncrementSpeed: 1
  },
  medio: {
    label: "Medio",
    phraseTimeLimit: 11,
    timeBonusOnSuccess: 3,
    costRange: [2, 4],
    spawnIncrementSpeed: 2
  },
  difficile: {
    label: "Difficile",
    phraseTimeLimit: 15,
    timeBonusOnSuccess: 4,
    costRange: [3, 5],
    spawnIncrementSpeed: 3
  }
};

function App() {
  const [gamePhase, setGamePhase] = useState("title");
  const [difficulty, setDifficulty] = useState("facile");
  const [overallTimeLeft, setOverallTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [currentTranslation, setCurrentTranslation] = useState("");
  const [currentCost, setCurrentCost] = useState(1);
  const [typedText, setTypedText] = useState("");
  const [missCount, setMissCount] = useState(0);
  const [missCountInARow, setMissCountInARow] = useState(0);
  const [dynamicDifficulty, setDynamicDifficulty] = useState(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);
  const intervalRef = useRef(null);
  const phraseTimeoutRef = useRef(null);

  // ピザタイマーのための画像
  const pizzaImgUrl =
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhwncyv4NB-NGccbtjQSsMDNy9PXMX2-GqbYBVZMF8J2auXveNXTfN__JkXWxOtCKCf6lP3box5WsYkMCs5BOOAnCEMuSMy7LqwKc8um9dlkCUtBOXcY5iNIJsXouETFMmKo0ow16VwY4ob/s509/food_pizza_whole.png";

  // ゲーム開始
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

  // ゲーム終了
  const endGame = () => {
    setGamePhase("result");
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phraseTimeoutRef.current) clearTimeout(phraseTimeoutRef.current);
  };

  // 次のフレーズを取得
  const getNextPhrase = (difficultyKey, dynamicDiff) => {
    const { costRange } = DIFFICULTY_SETTINGS[difficultyKey];
    const minCost = Math.max(costRange[0], costRange[0] + dynamicDiff);
    const maxCost = Math.min(costRange[1], costRange[1] + dynamicDiff);

    const candidates = ITALIAN_PHRASES.filter(
      (p) => p.cost >= minCost && p.cost <= maxCost
    );

    const fallback = ITALIAN_PHRASES.filter(
      (p) => p.cost >= costRange[0] && p.cost <= costRange[1]
    );
    const phraseList = candidates.length ? candidates : fallback;

    const next = phraseList[Math.floor(Math.random() * phraseList.length)];
    setCurrentPhrase(next.text);
    setCurrentTranslation(next.translation);
    setCurrentCost(next.cost);
    setTypedText("");

    // ピザタイマーをリセット
    setPizzaAngle(360);

    // フレーズごとのタイマーをセット（フレーズ表示時）
    if (phraseTimeoutRef.current) clearTimeout(phraseTimeoutRef.current);
    phraseTimeoutRef.current = setTimeout(() => {
      handleMiss();
    }, DIFFICULTY_SETTINGS[difficultyKey].phraseTimeLimit * 1000);
  };

  // 正規表現で特殊文字をエスケープする関数
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& はマッチした文字列全体を意味します
  }

  // 入力ハンドリング (handleInputChange 関数内)
  const handleInputChange = (e) => {
    const val = e.target.value;

    if (val.length < typedText.length) {
      setTypedText(val);
      return;
    }

    if (val.length > typedText.length) {
      const nextChar = val[val.length - 1];

      // 正解の文字を取得（è の場合は e も正解とする）
      let correctChar = currentPhrase[typedText.length];
      let escapedCorrectChar;

      // è, é, ì, ò, ù, à の場合はエスケープせず、文字クラスとして扱う
      if (correctChar === 'è') {
        escapedCorrectChar = '[eè]';
      } else if (correctChar === 'È') {
        escapedCorrectChar = '[eEÈ]';
      } else if (correctChar === 'é') {
        escapedCorrectChar = '[eé]';
      } else if (correctChar === 'É') {
        escapedCorrectChar = '[eEÉ]';
      } else if (correctChar === 'ì') {
        escapedCorrectChar = '[iì]';
      } else if (correctChar === 'Ì') {
        escapedCorrectChar = '[iIÌ]';
      } else if (correctChar === 'ò') {
        escapedCorrectChar = '[oò]';
      } else if (correctChar === 'Ò') {
        escapedCorrectChar = '[oOÒ]';
      } else if (correctChar === 'ù') {
        escapedCorrectChar = '[uù]';
      } else if (correctChar === 'Ù') {
        escapedCorrectChar = '[uUÙ]';
      } else if (correctChar === 'à') {
        escapedCorrectChar = '[aà]';
      } else if (correctChar === 'À') {
        escapedCorrectChar = '[aAÀ]';
      } else {
        // 上記以外の文字はエスケープする
        escapedCorrectChar = escapeRegExp(correctChar);
      }

      if (nextChar.match(escapedCorrectChar)) {
        setTypedText(val);
        setMissCountInARow(0);
        setTotalCharsTyped((prev) => prev + 1);
      } else {
        setMissCount((prev) => prev + 1);
        setMissCountInARow((prev) => prev + 1);
        return;
      }
    }
  };
  


  // フレーズが完成した場合
  useEffect(() => {
    if (typedText === currentPhrase && currentPhrase !== "") {
      handleSuccess();
    }
  }, [typedText, currentPhrase]);

  // 正解時の処理
  const handleSuccess = () => {
    setSuccessCount((prev) => prev + 1);
    setScore((prev) => prev + currentCost * 10);

    const bonus = DIFFICULTY_SETTINGS[difficulty].timeBonusOnSuccess;
    setOverallTimeLeft((prev) => prev + bonus);

    // フレーズごとのタイマーをクリア
    if (phraseTimeoutRef.current) clearTimeout(phraseTimeoutRef.current);

    goToNextPhraseWithDifficultyAdjust(true);
  };

  // ミス(タイムオーバー)時の処理
  const handleMiss = () => {
    setMissCount((prev) => prev + 1);
    setMissCountInARow((prev) => prev + 1);

    // フレーズごとのタイマーをクリア
    if (phraseTimeoutRef.current) clearTimeout(phraseTimeoutRef.current);

    goToNextPhraseWithDifficultyAdjust(false);
  };

  // 難易度調整
  const goToNextPhraseWithDifficultyAdjust = (isSuccess) => {
    let newDynamic = dynamicDifficulty;

    if (isSuccess) {
      if ((successCount + 1) % 5 === 0) {
        newDynamic += DIFFICULTY_SETTINGS[difficulty].spawnIncrementSpeed;
      }
    } else {
      if (missCountInARow + 1 >= 2 && dynamicDifficulty > 0) {
        newDynamic -= 1;
      }
    }
    setDynamicDifficulty(newDynamic);

    getNextPhrase(difficulty, newDynamic);
  };

  // ピザタイマー
  const [pizzaAngle, setPizzaAngle] = useState(360);
  const pizzaAnimationRef = useRef(null);

  useEffect(() => {
      const animatePizza = () => {
          const startTime = Date.now();
          const duration = DIFFICULTY_SETTINGS[difficulty].phraseTimeLimit * 1000;

          const update = () => {
              const elapsed = Date.now() - startTime;
              const newAngle = Math.max(0, 360 - (360 * elapsed) / duration);
              setPizzaAngle(newAngle);
  
              if (elapsed < duration) {
                  pizzaAnimationRef.current = requestAnimationFrame(update);
              } else {
                  // タイムアップ時に角度を0にする
                  setPizzaAngle(0);
              }
          };
          pizzaAnimationRef.current = requestAnimationFrame(update);
      };

      // 新しいフレーズが表示されたらアニメーションを開始
      if (gamePhase === "playing" && currentPhrase) {
          animatePizza();
      }
  
      return () => {
          if (pizzaAnimationRef.current) {
              cancelAnimationFrame(pizzaAnimationRef.current);
          }
      };
  }, [gamePhase, currentPhrase, difficulty]);

  // ピザのマスク用のスタイル
  const pizzaMaskStyle = {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    overflow: "hidden",
    position: "relative",
  };

  // ピザ画像用のスタイル
  const pizzaImgStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "200px",
    height: "200px",
    backgroundImage: `url(${pizzaImgUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 1,
  };

  // グラデーション用のスタイル
  const gradientStyle = {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundImage: `
      conic-gradient(
        from 0deg at 50% 50%,
        transparent ${pizzaAngle}deg,
        rgba(0, 0, 0, 0.8) ${pizzaAngle}deg 360deg
      )
    `,
    zIndex: 2,
  };

  // ゲーム画面描画
  const renderGameScreen = () => {
    // フレーズの表示（入力進捗を色分け）
    const splitted = currentPhrase.split("");
    const typedArr = typedText.split("");

    const phraseDisplay = splitted.map((char, idx) => {
      let style = { color: "#fff" };
      if (idx < typedArr.length) {
        style.color = "lightgreen";
      } else if (idx === typedArr.length) {
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
        <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "center" }}>
          <div style={pizzaMaskStyle}>
            <div style={pizzaImgStyle} />
            <div style={gradientStyle} />
          </div>
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

  // 平均タイプ速度(文字/秒)を計算
  const getTypingSpeed = () => {
    const elapsed = 60 - overallTimeLeft;
    if (elapsed <= 0) return 0;
    return (totalCharsTyped / elapsed).toFixed(2);
  };

  // useEffect
  useEffect(() => {
    if (gamePhase !== "playing") {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (phraseTimeoutRef.current) clearTimeout(phraseTimeoutRef.current);
    }
  }, [gamePhase]);

  // JSX描画
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