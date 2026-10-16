

async function searchPokemonCards(name) {

  const result = document.getElementById("cardSearchResults");

  if (!result) return;

  name = (name || "").trim();

  if (!name) {

    result.textContent = "カード名を入力してください";

    return;

  }

  result.textContent = "検索中...";

  try {

    const response = await fetch(

      "https://api.tcgdex.net/v2/ja/cards?name=" +

      encodeURIComponent(name)

    );

    if (!response.ok) throw new Error("検索エラー");

    const cards = await response.json();

    result.replaceChildren();

    if (!Array.isArray(cards) || cards.length === 0) {

      result.textContent = "カードが見つかりませんでした";

      return;

    }

    cards.slice(0, 20).forEach(card => {

      const link = document.createElement("a");

      link.href = "https://www.google.com/search?q=" +

        encodeURIComponent(card.name + " " + card.localId);

      link.target = "_blank";

      link.rel = "noopener noreferrer";

      link.textContent = card.name + "（カード番号：" + card.localId + "）";

      const item = document.createElement("p");

      item.appendChild(link);

      result.appendChild(item);

    });

  } catch (error) {

    result.textContent = "検索に失敗しました。時間をおいて再試行してください。";

  }

}
