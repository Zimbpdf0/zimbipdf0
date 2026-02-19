let unlocked = false;

const amb = new Audio();
amb.loop = true;

const sfx = new Audio();
sfx.loop = false;

async function unlockAudio() {
  try {
    amb.muted = true;
    await amb.play().catch(() => {});
    amb.pause();
    amb.currentTime = 0;
    amb.muted = false;
    unlocked = true;
    document.getElementById("btnUnlock").textContent = "Áudio OK ✅";
  } catch (e) {}
}

document.getElementById("btnUnlock").addEventListener("click", unlockAudio);

document.getElementById("stopAmb").addEventListener("click", () => {
  amb.pause();
  amb.currentTime = 0;
});

document.getElementById("stopSfx").addEventListener("click", () => {
  sfx.pause();
  sfx.currentTime = 0;
});

async function loadPlaylist() {
  const res = await fetch("playlist.json");
  return res.json();
}

function makeButton(item) {
  const btn = document.createElement("button");
  btn.className = "tile";
  btn.textContent = item.title;

  btn.addEventListener("click", async () => {
    if (!unlocked) await unlockAudio();

    const player = item.type === "ambience" ? amb : sfx;

    player.pause();
    player.src = item.url;
    player.loop = !!item.loop;
    player.volume = item.volume ?? 1;

    await player.play().catch(() => {
      alert("Toque em 'Ativar áudio' primeiro.");
    });
  });

  return btn;
}

function render(data, query = "") {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  const q = query.toLowerCase();

  data.categories.forEach(cat => {
    const section = document.createElement("section");

    const title = document.createElement("h2");
    title.textContent = cat.name;
    section.appendChild(title);

    const wrap = document.createElement("div");
    wrap.className = "wrap";

    cat.items
      .filter(item => {
        const text = (item.title + " " + (item.tags || []).join(" ")).toLowerCase();
        return text.includes(q);
      })
      .forEach(item => wrap.appendChild(makeButton(item)));

    section.appendChild(wrap);
    grid.appendChild(section);
  });
}

(async () => {
  const data = await loadPlaylist();
  render(data);

  document.getElementById("search").addEventListener("input", e => {
    render(data, e.target.value);
  });
})();
