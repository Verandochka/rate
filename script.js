const images = [
    { src: 'images/457790411_2271532996556451_751752120512234591_n.jpg', name: 'катя' },
    { src: 'images/464947905_564926972601779_3397008408338803466_n.jpg', name: 'фельдшер' },
    { src: 'images/496995460_17883447471275890_2630607990368112856_n.jpg', name: 'панасюк' },
    { src: 'images/503781659_18063939209323492_8339964561853128854_n.jpg', name: 'варвара' },
    { src: 'images/513837119_18139048549407633_7957391401192201161_n.jpg', name: 'єва' },
    { src: 'images/525391944_18365923087194665_7214364343294733694_n.jpg', name: 'халімовська' },
    { src: 'images/538258261_1140802077899965_7676981716543955962_n.jpg', name: 'діночка' },
    { src: 'images/ivanka.jpg', name: 'іванка' },
    { src: 'images/kasyrsha.jpg', name: 'касирша з бочки' },
    { src: 'images/Знімок екрана 2025-08-27 233717.png', name: 'таня' },
    { src: 'images/Знімок екрана 2025-08-27 235015.png', name: 'негр' },
    { src: 'images/Знімок екрана 2025-08-27 235643.png', name: 'романчук' },
    { src: 'images/Знімок екрана 2025-08-27 235844.png', name: 'анюта' },
    { src: 'images/Знімок екрана 2025-08-27 235937.png', name: 'синицина' },
    { src: 'images/539867094_1073041267922079_7320336633367435834_n.jpg', name: 'степанова', fit: 'contain' },
    { src: 'images/541190754_4063242473929727_1429546118434843234_n.jpg', name: 'альтушка' }
];

let winners = [];
let losers = [];
let losersRanking = [];
let winnersRanking = [];
let currentRound = [];
let nextRound = [];
let roundIndex = 0;
let isAnimating = false;
let phase = 'main'; // 'main', 'losers', 'winners', 'done'
let roundNumber = 1;
let roundHistory = []; // Для збереження місць

document.getElementById('registration-form').addEventListener('submit', function(e) {
    e.preventDefault();
    document.querySelector('.registration-container').style.display = 'none';
    startTournament();
});

function startTournament() {
    winners = [];
    losers = [];
    losersRanking = [];
    winnersRanking = [];
    currentRound = [...images];
    nextRound = [];
    roundIndex = 0;
    phase = 'main';
    roundNumber = 1;
    roundHistory = [];
    showBattle();
}

function getRoundLabel(phase, roundLen) {
    if (phase === 'main') {
        if (roundLen >= 16) return '1/8 фіналу';
        if (roundLen === 8) return '1/4 фіналу';
        if (roundLen === 4) return '1/2 фіналу';
        if (roundLen === 2) return 'Фінал';
    }
    if (phase === 'losers') {
        if (roundLen >= 16) return '1/8 утiшного фіналу';
        if (roundLen === 8) return '1/4 утiшного фіналу';
        if (roundLen === 4) return '1/2 утiшного фіналу';
        if (roundLen === 2) return 'Фінал утiшного';
    }
    if (phase === 'winners') {
        if (roundLen === 2) return 'Суперфінал';
        if (roundLen === 1) return 'Переможець';
    }
    return '';
}

function showBattle() {
    // Якщо закінчили показувати всі пари цього раунду
    if (roundIndex >= currentRound.length) {
        // Якщо непарна кількість — останній автоматично проходить далі
        if (currentRound.length % 2 === 1 && currentRound.length > 0) {
            const last = currentRound[currentRound.length - 1];
            if (phase === 'main') {
                winners.push(last);
            } else if (phase === 'losers') {
                nextRound.push(last);
            } else if (phase === 'winners') {
                nextRound.push(last);
            }
        }
        // Зберігаємо хто вилетів у цьому раунді
        if (phase === 'main' && losers.length) {
            roundHistory.push({ phase: 'main', round: roundNumber, out: [...losers] });
        }
        if (phase === 'losers' && losersRanking.length) {
            roundHistory.push({ phase: 'losers', round: roundNumber, out: [...losersRanking] });
        }
        if (phase === 'winners' && winnersRanking.length) {
            roundHistory.push({ phase: 'winners', round: roundNumber, out: [...winnersRanking] });
        }

        currentRound = [...nextRound];
        nextRound = [];
        roundIndex = 0;
        roundNumber++;

        // Перехід між фазами
        if (currentRound.length === 0) {
            if (phase === 'main') {
                currentRound = [...losers];
                losers = [];
                phase = 'losers';
                if (currentRound.length === 0) {
                    currentRound = [...winners];
                    winners = [];
                    phase = 'winners';
                    if (currentRound.length === 0) {
                        phase = 'done';
                        showFinalRanking();
                        return;
                    }
                }
            } else if (phase === 'losers') {
                currentRound = [...winners];
                winners = [];
                phase = 'winners';
                if (currentRound.length === 0) {
                    phase = 'done';
                    showFinalRanking();
                    return;
                }
            } else if (phase === 'winners') {
                phase = 'done';
                showFinalRanking();
                return;
            }
        }
        if (currentRound.length === 1) {
            if (phase === 'main') {
                winners.push(currentRound[0]);
                roundHistory.push({ phase: 'main', round: roundNumber, out: [] });
                currentRound = [...losers];
                losers = [];
                phase = 'losers';
                if (currentRound.length === 0) {
                    currentRound = [...winners];
                    winners = [];
                    phase = 'winners';
                    if (currentRound.length === 0) {
                        phase = 'done';
                        showFinalRanking();
                        return;
                    }
                }
                showBattle();
                return;
            } else if (phase === 'losers') {
                losersRanking.unshift(currentRound[0]);
                roundHistory.push({ phase: 'losers', round: roundNumber, out: [currentRound[0]] });
                currentRound = [...winners];
                winners = [];
                phase = 'winners';
                if (currentRound.length === 0) {
                    phase = 'done';
                    showFinalRanking();
                    return;
                }
                showBattle();
                return;
            } else if (phase === 'winners') {
                winnersRanking.unshift(currentRound[0]);
                roundHistory.push({ phase: 'winners', round: roundNumber, out: [currentRound[0]] });
                phase = 'done';
                showFinalRanking();
                return;
            }
        }
        showBattle();
        return;
    }

    let battle = document.getElementById('battle-container');
    if (!battle) {
        battle = document.createElement('div');
        battle.id = 'battle-container';
        battle.style.display = 'flex';
        battle.style.width = '100%';
        battle.style.height = '100%';
        battle.style.margin = '0';
        battle.style.padding = '0';
        battle.style.position = 'absolute';
        battle.style.inset = '0';
        battle.style.overflow = 'hidden';
        document.body.appendChild(battle);
    }
    battle.innerHTML = '';

    // Додаємо напис раунду
    const roundLabel = document.createElement('div');
    roundLabel.textContent = getRoundLabel(phase, currentRound.length);
    roundLabel.style.position = 'fixed';
    roundLabel.style.top = '30px';
    roundLabel.style.left = '50%';
    roundLabel.style.transform = 'translateX(-50%)';
    roundLabel.style.fontSize = '54px';
    roundLabel.style.fontWeight = 'bold';
    roundLabel.style.color = '#fff';
    roundLabel.style.background = 'rgba(33, 33, 33, 0.85)';
    roundLabel.style.padding = '18px 48px';
    roundLabel.style.borderRadius = '18px';
    roundLabel.style.boxShadow = '0 4px 32px #0006';
    roundLabel.style.zIndex = '1000';
    roundLabel.style.letterSpacing = '2px';
    roundLabel.style.textAlign = 'center';
    roundLabel.style.userSelect = 'none';
    battle.appendChild(roundLabel);

    const left = document.createElement('div');
    left.style.flex = '1';
    left.style.background = '#2176ff';
    left.style.display = 'flex';
    left.style.flexDirection = 'column';
    left.style.justifyContent = 'center';
    left.style.alignItems = 'center';
    left.style.transition = 'background 0.3s';

    const right = document.createElement('div');
    right.style.flex = '1';
    right.style.background = '#ff3b3f';
    right.style.display = 'flex';
    right.style.flexDirection = 'column';
    right.style.justifyContent = 'center';
    right.style.alignItems = 'center';
    right.style.transition = 'background 0.3s';

    // Ліве фото
    const leftImg = document.createElement('img');
    leftImg.src = currentRound[roundIndex].src;
    leftImg.alt = currentRound[roundIndex].name;
    leftImg.style.width = '480px';
    leftImg.style.height = '480px';
    leftImg.style.cursor = 'pointer';
    leftImg.style.borderRadius = '16px';
    leftImg.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
    leftImg.style.transition = 'all 0.7s cubic-bezier(.4,2,.6,1)';
    leftImg.style.objectFit = currentRound[roundIndex].fit || (leftImg.src.endsWith('.png') ? 'contain' : 'cover');

    const leftLabel = document.createElement('div');
    leftLabel.textContent = currentRound[roundIndex].name || '';
    leftLabel.style.marginTop = '18px';
    leftLabel.style.color = '#fff';
    leftLabel.style.fontSize = '22px';
    leftLabel.style.fontWeight = 'bold';
    leftLabel.style.textAlign = 'center';
    leftLabel.style.textShadow = '0 2px 8px #0008';

    // Праве фото
    const rightImg = document.createElement('img');
    rightImg.src = currentRound[roundIndex + 1].src;
    rightImg.alt = currentRound[roundIndex + 1].name;
    rightImg.style.width = '480px';
    rightImg.style.height = '480px';
    rightImg.style.cursor = 'pointer';
    rightImg.style.borderRadius = '16px';
    rightImg.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
    rightImg.style.transition = 'all 0.7s cubic-bezier(.4,2,.6,1)';
    rightImg.style.objectFit = currentRound[roundIndex + 1].fit || (rightImg.src.endsWith('.png') ? 'contain' : 'cover');

    const rightLabel = document.createElement('div');
    rightLabel.textContent = currentRound[roundIndex + 1].name || '';
    rightLabel.style.marginTop = '18px';
    rightLabel.style.color = '#fff';
    rightLabel.style.fontSize = '22px';
    rightLabel.style.fontWeight = 'bold';
    rightLabel.style.textAlign = 'center';
    rightLabel.style.textShadow = '0 2px 8px #0008';

    leftImg.onclick = () => {
        if (isAnimating) return;
        isAnimating = true;
        animateWinner(leftImg, left, battle, () => {
            if (phase === 'main') {
                winners.push(currentRound[roundIndex]);
                losers.push(currentRound[roundIndex + 1]);
            } else if (phase === 'losers') {
                losersRanking.unshift(currentRound[roundIndex + 1]);
                nextRound.push(currentRound[roundIndex]);
            } else if (phase === 'winners') {
                winnersRanking.unshift(currentRound[roundIndex + 1]);
                nextRound.push(currentRound[roundIndex]);
            }
            roundIndex += 2;
            isAnimating = false;
            showBattle();
        });
    };

    rightImg.onclick = () => {
        if (isAnimating) return;
        isAnimating = true;
        animateWinner(rightImg, right, battle, () => {
            if (phase === 'main') {
                winners.push(currentRound[roundIndex + 1]);
                losers.push(currentRound[roundIndex]);
            } else if (phase === 'losers') {
                losersRanking.unshift(currentRound[roundIndex]);
                nextRound.push(currentRound[roundIndex + 1]);
            } else if (phase === 'winners') {
                winnersRanking.unshift(currentRound[roundIndex]);
                nextRound.push(currentRound[roundIndex + 1]);
            }
            roundIndex += 2;
            isAnimating = false;
            showBattle();
        });
    };

    left.appendChild(leftImg);
    left.appendChild(leftLabel);
    right.appendChild(rightImg);
    right.appendChild(rightLabel);
    battle.appendChild(left);
    battle.appendChild(right);
}

function animateWinner(img, sideDiv, battle, callback) {
    for (let child of battle.children) {
        if (child !== sideDiv) {
            child.style.opacity = '0';
            child.style.transition = 'opacity 0.4s';
        }
    }
    sideDiv.style.background = '#fff';
    img.style.transform = 'scale(1.5)';
    img.style.boxShadow = '0 16px 64px rgba(0,0,0,0.3)';
    img.style.zIndex = '10';
    sideDiv.style.justifyContent = 'center';
    sideDiv.style.alignItems = 'center';
    sideDiv.style.transition = 'background 0.5s';

    setTimeout(callback, 1000);
}

function showFinalRanking() {
    // Додаємо переможця, якщо його ще немає
    if (winners.length === 1) {
        winnersRanking.unshift(winners[0]);
    }
    // Додаємо тих, хто залишився у losers
    losersRanking = losers.concat(losersRanking);

    // Формуємо повний рейтинг: переможець, інші переможці, переможені
    let fullRanking = [...winnersRanking, ...losersRanking];

    // Додаємо всіх, хто вилетів у кожному раунді (з roundHistory)
    roundHistory.forEach(rh => {
        rh.out.forEach(item => {
            if (!fullRanking.find(i => i.src === item.src)) {
                fullRanking.push(item);
            }
        });
    });

    // Якщо не вистачає місць — додаємо тих, хто не потрапив у жоден масив (наприклад, якщо хтось не програв жодного разу)
    const allInRanking = new Set(fullRanking.map(i => i.src));
    images.forEach(img => {
        if (!allInRanking.has(img.src)) {
            fullRanking.push(img);
        }
    });

    // Обрізаємо до унікальних (на випадок дублювання)
    const seen = new Set();
    fullRanking = fullRanking.filter(i => {
        if (seen.has(i.src)) return false;
        seen.add(i.src);
        return true;
    });

    const battle = document.getElementById('battle-container');
    battle.innerHTML = '';
    battle.style.background = '#fff';
    battle.style.display = 'flex';
    battle.style.flexDirection = 'column';
    battle.style.alignItems = 'center';
    battle.style.justifyContent = 'flex-start';
    battle.style.paddingTop = '40px';
    battle.style.height = '100vh';
    battle.style.overflowY = 'auto';

    const title = document.createElement('div');
    title.textContent = 'Таблиця місць';
    title.style.fontSize = '48px';
    title.style.fontWeight = 'bold';
    title.style.color = '#2176ff';
    title.style.marginBottom = '40px';
    title.style.letterSpacing = '2px';
    battle.appendChild(title);

    const table = document.createElement('div');
    table.style.display = 'flex';
    table.style.flexDirection = 'column';
    table.style.alignItems = 'center';
    table.style.width = '100%';

    fullRanking.forEach((item, idx) => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.justifyContent = 'flex-start';
        row.style.marginBottom = '24px';
        row.style.width = '520px';
        row.style.maxWidth = '90vw';
        row.style.background = idx === 0 ? '#eaffea' : '#f6f6f6';
        row.style.borderRadius = '16px';
        row.style.boxShadow = idx === 0 ? '0 4px 24px #28a74533' : '0 2px 8px #0001';
        row.style.padding = '18px 32px';

        const place = document.createElement('span');
        place.textContent = `${idx + 1}.`;
        place.style.fontSize = '36px';
        place.style.width = '60px';
        place.style.display = 'inline-block';
        place.style.fontWeight = 'bold';
        place.style.color = idx === 0 ? '#28a745' : '#333';

        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.name;
        img.style.width = '110px';
        img.style.height = '110px';
        img.style.objectFit = item.fit || (img.src.endsWith('.png') ? 'contain' : 'cover');
        img.style.borderRadius = '14px';
        img.style.margin = '0 32px 0 0';
        img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';

        const name = document.createElement('span');
        name.textContent = item.name;
        name.style.fontSize = '32px';
        name.style.fontWeight = idx === 0 ? 'bold' : 'normal';
        name.style.color = idx === 0 ? '#28a745' : '#333';

        row.appendChild(place);
        row.appendChild(img);
        row.appendChild(name);
        table.appendChild(row);
    });

    battle.appendChild(table);
}