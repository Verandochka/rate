const images = [
    'img/photo1.jpg',
    'img/photo2.jpg',
    'img/photo3.jpg',
    'img/photo4.jpg'
];

let currentChampion = null;
let currentChallenger = 1;

document.getElementById('registration-form').addEventListener('submit', function(e) {
    e.preventDefault();
    document.querySelector('.registration-container').style.display = 'none';
    showBattle();
});

function showBattle() {
    if (!currentChampion) {
        currentChampion = 0;
        currentChallenger = 1;
    }
    if (currentChallenger >= images.length) {
        showWinner();
        return;
    }

    // Create battle container if not exists
    let battle = document.getElementById('battle-container');
    if (!battle) {
        battle = document.createElement('div');
        battle.id = 'battle-container';
        battle.style.display = 'flex';
        battle.style.justifyContent = 'center';
        battle.style.gap = '40px';
        battle.style.marginTop = '40px';
        document.body.appendChild(battle);
    }
    battle.innerHTML = '';

    // Champion image
    const championImg = document.createElement('img');
    championImg.src = images[currentChampion];
    championImg.alt = 'Champion';
    championImg.style.width = '220px';
    championImg.style.height = '220px';
    championImg.style.objectFit = 'cover';
    championImg.style.cursor = 'pointer';
    championImg.onclick = () => {
        currentChallenger++;
        showBattle();
    };

    // Challenger image
    const challengerImg = document.createElement('img');
    challengerImg.src = images[currentChallenger];
    challengerImg.alt = 'Challenger';
    challengerImg.style.width = '220px';
    challengerImg.style.height = '220px';
    challengerImg.style.objectFit = 'cover';
    challengerImg.style.cursor = 'pointer';
    challengerImg.onclick = () => {
        currentChampion = currentChallenger;
        currentChallenger++;
        showBattle();
    };

    battle.appendChild(championImg);
    battle.appendChild(challengerImg);
}

function showWinner() {
    const battle = document.getElementById('battle-container');
    battle.innerHTML = '';
    const winnerImg = document.createElement('img');
    winnerImg.src = images[currentChampion];
    winnerImg.alt = 'Переможець';
    winnerImg.style.width = '300px';
    winnerImg.style.height = '300px';
    winnerImg.style.objectFit = 'cover';
    winnerImg.style.border = '4px solid #28a745';
    winnerImg.style.borderRadius = '10px';

    const winnerText = document.createElement('div');
    winnerText.textContent = 'Переможець!';
    winnerText.style.textAlign = 'center';
    winnerText.style.fontSize = '28px';
    winnerText.style.marginTop = '20px';
    winnerText.style.color = '#28a745';

    battle.appendChild(winnerImg);
    battle.appendChild(winnerText);
}