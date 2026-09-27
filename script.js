const marineRanks = [
    "Seaman Recruit", "Seaman Apprentice", "Seaman First Class", "Petty Officer",
    "Chief Petty Officer", "Ensign", "Master Chief Petty Officer", "Lieutenant Junior Grade",
    "Lieutenant", "Commander", "Captain", "Commodore", "Rear Admiral", "Vice Admiral", "Admiral", "Fleet Admiral"
];

let player = {
    name: "Karakter Baru",
    faction: "Sipil",
    rankIndex: 0,
    beli: 1000,
    reputation: 0,
    strength: 15,
    discipline: 15,
    infamy: 0,
    day: 1
};

function log(message) {
    const box = document.getElementById('log-box');
    box.innerHTML += `[Hari ${player.day}] ${message}<br>`;
    box.scrollTop = box.scrollHeight;
}

function updateUI() {
    document.getElementById('lbl-name').innerText = player.name;
    document.getElementById('lbl-faction').innerText = player.faction;
    document.getElementById('lbl-beli').innerText = player.beli.toLocaleString() + " Beli";
    document.getElementById('lbl-reputation').innerText = player.reputation;
    document.getElementById('lbl-strength').innerText = player.strength;
    document.getElementById('lbl-discipline').innerText = player.discipline;
    document.getElementById('lbl-infamy').innerText = player.infamy;
    document.getElementById('lbl-day').innerText = "Hari " + player.day;

    let rankText = "Orang Biasa (Sipil)";
    if(player.faction === "Marine") rankText = marineRanks[player.rankIndex];
    else if(player.faction === "Bajak Laut") rankText = player.rankIndex === 0 ? "Awak Kapal Magang" : "Kapten Bajak Laut";
    else if(player.faction === "World Government") rankText = player.rankIndex === 0 ? "Agen Pemula (CP)" : "Direktur Cipher Pol";
    else if(player.faction === "Revolusioner") rankText = player.rankIndex === 0 ? "Kader Binaan" : "Komandan Pasukan";
    
    document.getElementById('lbl-rank').innerText = rankText;
    renderFactionOptions();
}

function actionWork() {
    player.beli += 10;
    player.strength += 1;
    log("Bekerja di pelabuhan.");
    updateUI();
}

function actionTrain() {
    player.strength += 2;
    log("Melatih fisik.");
    updateUI();
}

function actionStudy() {
    player.discipline += 2;
    log("Mempelajari hukum dan strategi.");
    updateUI();
}

function nextDay() {
    player.day++;
    log("Hari baru dimulai.");
    updateUI();
}

function renderFactionOptions() {
    const container = document.getElementById('faction-content');
    if(player.faction !== "Sipil") {
        let promoReq = player.faction === "Marine" ? `Syarat Promosi: Kekuatan ${(player.rankIndex+1)*20}, Kedisiplinan ${(player.rankIndex+1)*15}` : "Tingkatkan pengaruh!";
        container.innerHTML = `
            <p>Bergabung dengan faksi: <strong>${player.faction}</strong></p>
            <small>${promoReq}</small><br><br>
            <button onclick="promoteFaction()">Naik Pangkat</button>
            <button onclick="leaveFaction()" class="danger">Membelot / Keluar</button>
        `;
        return;
    }

    container.innerHTML = `
        <div class="faction-card"><strong>Marine:</strong> Syarat (Kekuatan >= 30, Disiplin >= 30)<br><button onclick="joinFaction('Marine', 30, 30)">Gabung Marine</button></div>
        <div class="faction-card"><strong>Bajak Laut:</strong> Syarat (Kekuatan >= 25)<br><button onclick="joinFaction('Bajak Laut', 25, 0)">Mulai Bajak Laut</button></div>
        <div class="faction-card"><strong>World Government (CP):</strong> Syarat (Disiplin >= 40, Beli >= 5000)<br><button onclick="joinFaction('World Government', 0, 40)">Gabung Cipher Pol</button></div>
        <div class="faction-card"><strong>Revolusioner:</strong> Syarat (Kekuatan >= 20, Disiplin >= 20)<br><button onclick="joinFaction('Revolusioner', 20, 20)">Gabung Revolusioner</button></div>
    `;
}

function joinFaction(type, rS, rD) {
    if(type === 'Marine' && player.strength >= rS && player.discipline >= rD) { player.faction = "Marine"; player.rankIndex = 0; }
    else if(type === 'Bajak Laut' && player.strength >= rS) { player.faction = "Bajak Laut"; player.rankIndex = 0; player.infamy += 15; }
    else if(type === 'World Government' && player.discipline >= rD && player.beli >= 5000) { player.faction = "World Government"; player.rankIndex = 0; }
    else if(type === 'Revolusioner' && player.strength >= rS && player.discipline >= rD) { player.faction = "Revolusioner"; player.rankIndex = 0; }
    else { alert("Syarat faksi belum terpenuhi!"); return; }
    log(`Resmi bergabung dengan faksi ${player.faction}!`);
    updateUI();
}

function promoteFaction() {
    if(player.faction === "Marine") {
        let reqS = (player.rankIndex + 1) * 20, reqD = (player.rankIndex + 1) * 15;
        if(player.strength >= reqS && player.discipline >= reqD && player.rankIndex < marineRanks.length - 1) {
            player.rankIndex++;
            log(`Promosi naik pangkat menjadi: ${marineRanks[player.rankIndex]}`);
        } else { alert("Syarat naik pangkat belum cukup!"); }
    } else {
        player.rankIndex++;
        log("Posisi dalam faksi meningkat.");
    }
    updateUI();
}

function leaveFaction() {
    if(confirm("Keluar faksi akan membuat Anda menjadi buronan!")) {
        player.faction = "Sipil"; player.rankIndex = 0; player.infamy += 20;
        log("Keluar dari faksi."); updateUI();
    }
}

function saveGame() {
    localStorage.setItem('onePieceManagerSave', JSON.stringify(player));
    alert("Game berhasil disimpan di browser!");
    log("Game disimpan.");
}

function loadGame() {
    const savedData = localStorage.getItem('onePieceManagerSave');
    if(savedData) {
        player = JSON.parse(savedData);
        updateUI();
        alert("Game berhasil dimuat!");
        log("Game dimuat.");
    } else {
        alert("Tidak ada data simpanan ditemukan!");
    }
}

function resetGame() {
    if(confirm("Yakin ingin mereset permainan?")) {
        localStorage.removeItem('onePieceManagerSave');
        location.reload();
    }
}

window.onload = function() {
    const savedData = localStorage.getItem('onePieceManagerSave');
    if(savedData) {
        if(confirm("Ditemukan data simpanan sebelumnya. Ingin memuatnya?")) {
            player = JSON.parse(savedData);
        } else {
            let savedName = prompt("Masukkan nama karakter Anda di Era Baru One Piece:", "Coby Wannabe");
            if(savedName) player.name = savedName;
        }
    } else {
        let savedName = prompt("Masukkan nama karakter Anda di Era Baru One Piece:", "Coby Wannabe");
        if(savedName) player.name = savedName;
    }
    updateUI();
};
