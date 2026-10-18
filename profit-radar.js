async function loadProfitRadar() {

  const result = document.getElementById("profitRadarResults");

  if (!result) return;

  result.textContent = "価格データを読み込み中...";

  try {

    const response = await fetch(

      "https://cardgap.jp/data/prices.json",

      { cache: "no-store" }

    );

    if (!response.ok) {

      throw new Error("HTTP " + response.status + "：価格データを取得できません");

    }

    const data = await response.json();

    if (!Array.isArray(data.rows)) {

      throw new Error("価格データの形式が想定と異なります");

    }

    const cards = data.rows

      .map(card => {

        const sell = Number(

          card.price_jpy ?? card.cardgap_median_jpy

        );

        const fleaPrices = [

          card.price_mercari_jpy,

          card.price_yahoo_jpy

        ]

          .filter(v => v != null && Number(v) > 0)

          .map(Number);

        if (

          !card.name_ja ||

          !Number.isFinite(sell) ||

          sell <= 0 ||

          fleaPrices.length === 0

        ) {

          return null;

        }

        const buy = Math.min(...fleaPrices);

        const fee = sell * 0.10;

        const shipping = 200;

        const profit = sell - fee - shipping - buy;

        return { ...card, sell, buy, profit };

      })

      .filter(card => card && card.profit >= 2000)

      .sort((a, b) => b.profit - a.profit)

      .slice(0, 100);

    result.replaceChildren();

    const heading = document.createElement("h3");

    heading.textContent = "利益2,000円以上の候補";

    result.appendChild(heading);

    const note = document.createElement("p");

    note.textContent =

      "公開価格を使った概算です。販売手数料10％・送料等200円で計算。実際の購入価格と販売価格は必ず確認してください。";

    result.appendChild(note);

    const credit = document.createElement("p");

    credit.textContent = "価格データ：CardGap（CC BY 4.0）";

    result.appendChild(credit);

    if (cards.length === 0) {

      const empty = document.createElement("p");

      empty.textContent =

        "利益2,000円以上の候補は見つかりませんでした。価格データや条件を確認してください。";

      result.appendChild(empty);

      return;

    }

    cards.forEach(card => {

      const item = document.createElement("section");

      item.style.cssText =

        "border:1px solid #ddd;border-radius:10px;padding:12px;margin:12px 0;";

      const title = document.createElement("h4");

      title.textContent = card.name_ja;

      item.appendChild(title);

      const prices = document.createElement("p");

      prices.textContent =

        "国内基準価格：" + card.sell.toLocaleString("ja-JP") + "円\n" +

        "フリマ参考価格：" + card.buy.toLocaleString("ja-JP") + "円";

      prices.style.whiteSpace = "pre-line";

      item.appendChild(prices);

      const buyLabel = document.createElement("label");

      buyLabel.textContent = "実際の仕入れ価格（円）";

      item.appendChild(buyLabel);

      const buyInput = document.createElement("input");

      buyInput.type = "number";

      buyInput.min = "0";

      buyInput.value = String(card.buy);

      buyInput.style.cssText =

        "display:block;width:100%;box-sizing:border-box;padding:8px;margin:6px 0;";

      item.appendChild(buyInput);

      const sellLabel = document.createElement("label");

      sellLabel.textContent = "実際の販売予定価格（円）";

      item.appendChild(sellLabel);

      const sellInput = document.createElement("input");

      sellInput.type = "number";

      sellInput.min = "0";

      sellInput.value = String(card.sell);

      sellInput.style.cssText =

        "display:block;width:100%;box-sizing:border-box;padding:8px;margin:6px 0;";

      item.appendChild(sellInput);

      const profitText = document.createElement("p");

      item.appendChild(profitText);

      const update = () => {

        const buy = Number(buyInput.value);

        const sell = Number(sellInput.value);

        if (

          buyInput.value === "" ||

          sellInput.value === "" ||

          buy < 0 ||

          sell <= 0

        ) {

          profitText.textContent = "価格を入力してください。";

          return;

        }

        const profit = Math.floor(sell - sell * 0.10 - 200 - buy);

        profitText.textContent =

          "概算利益：" + profit.toLocaleString("ja-JP") + "円" +

          (profit >= 2000

            ? "（利益2,000円以上）"

            : "（利益2,000円未満）");

      };

      buyInput.addEventListener("input", update);

      sellInput.addEventListener("input", update);

      update();

      const mercari = document.createElement("a");

      mercari.href =

        "https://jp.mercari.com/search?keyword=" +

        encodeURIComponent(card.name_ja);

      mercari.target = "_blank";

      mercari.rel = "noopener noreferrer";

      mercari.textContent = "メルカリで確認";

      item.appendChild(mercari);

      item.appendChild(document.createTextNode(" ｜ "));

      const yahoo = document.createElement("a");

      yahoo.href =

        "https://auctions.yahoo.co.jp/search/search?p=" +

        encodeURIComponent(card.name_ja);

      yahoo.target = "_blank";

      yahoo.rel = "noopener noreferrer";

      yahoo.textContent = "Yahoo!オークションで確認";

      item.appendChild(yahoo);

      if (card.slug) {

        item.appendChild(document.createElement("br"));

        const source = document.createElement("a");

        source.href = "https://cardgap.jp/cards/" +

          encodeURIComponent(card.slug);

        source.target = "_blank";

        source.rel = "noopener noreferrer";

        source.textContent = "CardGapのカード情報";

        item.appendChild(source);

      }

      result.appendChild(item);

    });

  } catch (error) {

    console.error(error);

    result.textContent =
    } catch (error) {

    console.error("価格データの読み込みエラー:", error);

    result.textContent =

      "読み込みエラー：" +

      (error?.message || String(error));

  }

}
  
function calculateRadarProfit() {

  const sellPrice = Number(prompt("販売価格（円）を入力してください"));

  if (!Number.isFinite(sellPrice) || sellPrice <= 0) {

    alert("販売価格を正しく入力してください");

    return;

  }

  const buyPrice = Number(prompt("仕入れ価格（円）を入力してください"));

  if (!Number.isFinite(buyPrice) || buyPrice < 0) {

    alert("仕入れ価格を正しく入力してください");

    return;

  }

  const feeRate = Number(prompt("販売手数料（％）を入力してください", "10"));

  if (!Number.isFinite(feeRate) || feeRate < 0 || feeRate > 100) {

    alert("手数料を正しく入力してください");

    return;

  }

  const shipping = Number(prompt("送料など（円）を入力してください", "200"));

  if (!Number.isFinite(shipping) || shipping < 0) {

    alert("送料を正しく入力してください");

    return;

  }

  const profit = sellPrice - buyPrice

    - sellPrice * feeRate / 100 - shipping;

  alert(

    "手数料・送料を差し引いた利益：" +

    Math.floor(profit) + "円\n" +

    (profit >= 2000

      ? "利益2,000円以上です！"

      : "利益2,000円未満です。")

  );

}


async function showHighPriceCards() {

  const result = document.getElementById("profitRadarResults");

  if (!result) return;

  result.textContent = "価格データを読み込み中...";

  try {

    const response = await fetch(

      "https://tokyocardreport.com/data/prices.json",

      { cache: "no-store" }

    );

    if (!response.ok) {

      throw new Error("価格データを取得できませんでした");

    }

    const data = await response.json();

    const cards = (data.sets || []).flatMap(set =>

      (set.cards || []).map(card => {

        const history = (card.sell || []).filter(

          price => typeof price === "number" && price > 0

        );

        return {

          name: card.name || "カード名不明",

          no: card.no || "",

          rarity: card.rarity || "",

          sell: history.length

            ? history[history.length - 1]

            : null

        };

      })

    );

    const candidates = cards

      .filter(card => card.sell !== null)

      .sort((a, b) => b.sell - a.sell)

      .slice(0, 20);

    result.replaceChildren();

    const heading = document.createElement("h3");

    heading.textContent = "販売価格 上位20枚";

    result.appendChild(heading);

    const note = document.createElement("p");

    note.textContent =

      "販売価格の高いカード一覧です。仕入れ価格が未確認のため、利益2,000円以上を保証するものではありません。";

    result.appendChild(note);

    const list = document.createElement("ol");

    candidates.forEach(card => {

      const item = document.createElement("li");

      item.textContent =

        card.name + "（" + card.no + "）：" +

        card.sell.toLocaleString("ja-JP") + "円";

      list.appendChild(item);

    });

    result.appendChild(list);

  } catch (error) {

    result.textContent =

      "価格データを読み込めませんでした。時間をおいて再試行してください。";

    console.error(error);

  }

}
