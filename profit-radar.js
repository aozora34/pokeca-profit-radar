   async function loadProfitRadar() {

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

    if (!Array.isArray(data.sets)) {

      throw new Error("価格データの形式が想定と異なります");

    }

    const cards = data.sets.flatMap(set =>

      (set.cards || []).map(card => {

        const history = (card.sell || []).filter(

          price => typeof price === "number" && price > 0

        );

        return {

          name: card.name || "カード名不明",

          no: card.no || "",

          sell: history.length ? history[history.length - 1] : null

        };

      })

    ).filter(card => card.sell !== null);

    const candidates = cards

  .filter(card => Math.floor(card.sell * 0.9 - 200 - 2000) > 0)

  .sort((a, b) => b.sell - a.sell)

  .slice(0, 100);

    result.replaceChildren();

    const heading = document.createElement("h3");

    heading.textContent = "利益2,000円チェック";

    result.appendChild(heading);

    const note = document.createElement("p");

    note.textContent =

      "参考販売価格から、手数料10％・送料200円を引いて概算します。仕入れ価格を入力してください。";

    result.appendChild(note);

    candidates.forEach(card => {

      const item = document.createElement("section");

      item.style.cssText =

        "border:1px solid #ddd;border-radius:10px;padding:12px;margin:12px 0;";

      const title = document.createElement("h4");

      title.textContent = card.name + (card.no ? "（" + card.no + "）" : "");

      item.appendChild(title);

      const price = document.createElement("p");

      price.textContent =

        "参考販売価格：" + card.sell.toLocaleString("ja-JP") + "円";

      item.appendChild(price);

      const label = document.createElement("label");

      label.textContent = "実際の仕入れ価格（円）";

      item.appendChild(label);

      const input = document.createElement("input");

      input.type = "number";

      input.min = "0";

      input.placeholder = "仕入れ価格を入力";

      input.style.cssText =

        "display:block;width:100%;box-sizing:border-box;padding:8px;margin:6px 0;";

      item.appendChild(input);

      const maxBuy = Math.floor(card.sell * 0.9 - 200 - 2000);

      const limit = document.createElement("p");

      limit.textContent =

        "利益2,000円を確保できる仕入れ上限：" +

        Math.max(0, maxBuy).toLocaleString("ja-JP") + "円";

      item.appendChild(limit);

      const profitText = document.createElement("p");

      profitText.textContent = "仕入れ価格を入力してください。";

      item.appendChild(profitText);

      input.addEventListener("input", () => {

        if (input.value === "" || Number(input.value) < 0) {

  profitText.textContent = "仕入れ価格を入力してください。";

  item.style.display = "";

  return;

}

        

        const profit = Math.floor(

          card.sell - card.sell * 0.10 - 200 - Number(input.value)

        );

        profitText.textContent =

  "概算利益：" + profit.toLocaleString("ja-JP") + "円" +

  (profit >= 2000

    ? " 🎯 利益2,000円以上！"

    : "（利益2,000円未満）");

profitText.style.color = profit >= 2000 ? "green" : "red";

profitText.style.fontWeight = profit >= 2000 ? "bold" : "normal";
         item.style.display = profit >= 2000 ? "" : "none";
  });
      const mercari = document.createElement("a");

      mercari.href =

        "https://jp.mercari.com/search?keyword=" +

        encodeURIComponent(card.name);

      mercari.target = "_blank";

      mercari.rel = "noopener noreferrer";

      mercari.textContent = "メルカリで確認";

      item.appendChild(mercari);

      item.appendChild(document.createTextNode(" ｜ "));

      const yahoo = document.createElement("a");

      yahoo.href =

        "https://auctions.yahoo.co.jp/search/search?p=" +

        encodeURIComponent(card.name);

      yahoo.target = "_blank";

      yahoo.rel = "noopener noreferrer";

      yahoo.textContent = "Yahoo!オークションで確認";

      item.appendChild(yahoo);

      result.appendChild(item);

    });

  } catch (error) {

    console.error("価格データの読み込みエラー:", error);

    result.textContent =

      "読み込みエラー：" + (error?.message || String(error));

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
