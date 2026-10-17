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

    const cards = (data.sets || []).flatMap(set =>

      (set.cards || []).map(card => ({

        ...card,

        setName: set.label,

        setSlug: set.slug,

        currentSell: [...(card.sell || [])]

          .reverse()

          .find(price => price != null)

      }))

    );

    result.replaceChildren();

    const heading = document.createElement("h3");

    heading.textContent = "利益2,000円以上の候補";

    result.appendChild(heading);

    const note = document.createElement("p");

    note.textContent =

      "価格データを読み込みました。仕入れ価格が分からないため、利益候補の確定には仕入れ価格の確認が必要です。";

    result.appendChild(note);

    const list = document.createElement("p");

    list.textContent =

      "読み込んだカード数：" + cards.length + "枚";

    result.appendChild(list);

  } catch (error) {

    result.textContent = "価格データを読み込めませんでした。時間をおいて再試行してください。";

    console.error(error);

  }

}
