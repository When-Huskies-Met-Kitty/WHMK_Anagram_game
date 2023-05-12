function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function todayString() {
    const today = new Date();
    return formatDate(today)
}

export function getStats() {
    const currGame = localStorage.getItem('whmk_game');
    const currGameJson = JSON.parse(currGame);
    let stats = {
        'currStreak' : 0,
        'maxStreak' : 0,
        'lastDatePlayed' : todayString(),
        'wins' : 0,
        'losses' : 0,
        'winRate' : 0,
    };
    if (currGameJson) {
        stats = currGameJson;
    }

    return stats

}

export function updateStreak() {
    const currGame = getStats()
    const todayDate = todayString();
    const diff = new Date(todayDate) - new Date(currGame.lastDatePlayed);
    const dayDiff = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (dayDiff > 1) {
        currGame.currStreak = 0;
    }

    localStorage.setItem('whmk_game', JSON.stringify(currGame));
}

export function displayStats() {
    const currGame = getStats();
    const statValues = "Current Streak: " + currGame.currStreak + "\n Max Streak: " + currGame.maxStreak + "\n Win Rate: " + currGame.winRate + "%";
    return statValues;
}

export function updateStats(won) {
    const stats = getStats();
     
    if (won) {
        stats.wins = stats.wins + 1;
    } else {
        stats.losses = stats.losses + 1;
    }

    stats.winRate = Math.round((stats.wins / (stats.wins + stats.losses)) * 100);

    const todayDate = todayString();

    // check consecutive days
    const diff = new Date(todayDate) - new Date(stats.lastDatePlayed);
    const dayDiff = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (dayDiff > 1) {
        stats.currStreak = 1;
    } else {
        stats.currStreak = stats.currStreak + 1;
        if (stats.currStreak > stats.maxStreak) {
            stats.maxStreak = stats.currStreak
        }
    }

    stats.lastDatePlayed = todayDate;

    localStorage.setItem('whmk_game', JSON.stringify(stats));

}