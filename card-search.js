

async function searchPokemonCards(name) {

  const result = document.getElementById("cardSearchResults");

  if (!result) return;

  name = (name || "").trim();

  if (!name) {

    result.textContent = "カード名を入力してください";

    return;

  }

  result.textContent = "カードを検索中...";

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

      const item = document.createElement("div");

      item.style.margin = "12px 0";

      item.style.padding = "10px";

      item.style.border = "1px solid #ddd";

      item.style.borderRadius = "8px";

      const title = document.createElement("p");

      title.textContent =

        card.name + "（カード番号：" + card.localId + "）";

      title.style.fontWeight = "bold";

      item.appendChild(title);

      const query = card.name + " " + card.localId;

      const links = [

        {

          label: "国内相場を調べる",

          url: "https://www.google.com/search?q=" +

            encodeURIComponent(query + " ポケモンカード 相場")

        },

        {

          label: "メルカリで探す",

          url: "https://jp.mercari.com/search?keyword=" +

            encodeURIComponent(query)

        },

        {

          label: "Yahoo!フリマで探す",

          url: "https://paypayfleamarket.yahoo.co.jp/search/" +

            encodeURIComponent(query)

        }

      ];

      links.forEach(data => {

        const link = document.createElement("a");

        link.href = data.url;

        link.target = "_blank";

        link.rel = "noopener noreferrer";

        link.textContent = data.label;

        link.style.display = "inline-block";

        link.style.margin = "4px 8px 4px 0";

        link.style.color = "#1459c7";

        item.appendChild(link);

      });

      result.appendChild(item);

    });

  } catch (error) {

    result.textContent =

      "検索に失敗しました。時間をおいて再試行してください。";

  }

}


