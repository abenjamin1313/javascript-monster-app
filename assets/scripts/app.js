const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 12;
const STRONG_ATTACK_VALUE = 20;
const HEAL_VALUE = 15;

const MODE_ATTCK = 'ATTACK'; // MODE_ATATCK = 0
const MODE_STRONG_ATTACK = 'STRONG_ATTACK' // STRONG_ATTACK = 1
const LOG_EVENT_PLAY_ATT = 'PLAYER_ATTACK';
const LOG_EVENT_PLAY_STRONG_ATT = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATT = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

const enteredValue = prompt('Maxium Life for you and the monster.', '100');

let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];
if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
    chosenMaxLife = 100;
}
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, value, monsterHealth, playerHealth) {
    let logEntry = {
        event: ev,
        value: value,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    }
    switch (ev) {
        case LOG_EVENT_PLAY_ATT:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_PLAY_STRONG_ATT:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_MONSTER_ATT:
            logEntry.target = 'PLAYER';
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = 'PLAYER';
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry = {
                event: ev,
                value: value,
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            }
            break;
        default:
            logEntry = {};
    }
    // if (event === LOG_EVENT_PLAY_ATT) {
    //     logEntry.target = 'MONSTER';
    // } else if (event === LOG_EVENT_PLAY_STRONG_ATT) {
    //     logEntry.target = 'MONSTER';
    // } else if (event === LOG_EVENT_MONSTER_ATT) {
    //     logEntry.target = 'PLAYER';
    // } else if (event === LOG_EVENT_PLAYER_HEAL) {
    //     logEntry.target = 'PLAYER';
    // } 
    battleLog.push(logEntry);
}

function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound() {
    const intialPlayHealth = currentPlayerHealth;
    const playDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playDamage;
    writeToLog(
        LOG_EVENT_MONSTER_ATT,
        playDamage,
        currentMonsterHealth,
        currentPlayerHealth
    );
    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = intialPlayHealth;
        setPlayerHealth(intialPlayHealth);
        alert('You would of died but the bonus life saved you!!');
    }
    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('You beat the monster!!!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'PLAYER WON',
            currentMonsterHealth,
            currentPlayerHealth
        );
    } else if (currentPlayerHealth <= 0 && currentPlayerHealth > 0) {
        alert('Monster won!!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'MONSTER WON',
            currentMonsterHealth,
            currentPlayerHealth
        )
    } else if (currentPlayerHealth <= 0 && currentPlayerHealth <= 0) {
        alert('You and the monster both died!!!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'GAME IS A DRAW',
            currentMonsterHealth,
            currentPlayerHealth
        )
    }
    if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
        reset();
    }
}

function attackMonster(mode) {
    const maxDamange = mode === MODE_ATTCK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent = mode === MODE_ATTCK ? LOG_EVENT_PLAY_ATT : LOG_EVENT_PLAY_STRONG_ATT;
    const damage = dealMonsterDamage(maxDamange);
    currentMonsterHealth -= damage;
    writeToLog(
        logEvent,
        damage,
        currentMonsterHealth,
        currentPlayerHealth
    )
    endRound();
}

function attackHandler() {
    attackMonster(MODE_ATTCK);
}

function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK);
}

function healPlayHandler() {
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        alert("you cannot heal more than your max intial health.");
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentMonsterHealth,
        currentPlayerHealth
    )
    endRound();
}

function printLogHandler() {
    for (let i = 0; i < 3; i++) {
        console.log('----------');
    }
    console.log(battleLog);
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayHandler);
logBtn.addEventListener('click', printLogHandler);