import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFootballStore = defineStore('football', {
    state: (): GamesStore => {
        return emptyState();
    },
    actions: {
        onLoad() {

        },

        startAction() {

        },
        
        stopAction() {

        },

        saveAction() {

        },

        deleteLastAction() {

        },

        addFirstAction() {

        },

        deleteAll() {

        },

        changeTabName() {

        },

        deleteOnePlayer() {

        },

        zenMode() {

        },

        downloadPlayer() {

        },

        addActionToOthers() {

        },

        changeHalftime() {

        },

        currentMin() {

        },

        currentSec() {
            
        }

    },
    getters: {

    }
})


export interface MatchInfo {
    title: string;
    src: string;
    current_halftime: number;
    tv: string;
    sound: string;
    start_halftime: [StartHalftime, StartHalftime, StartHalftime, StartHalftime, StartHalftime, StartHalftime];
}


export interface StartHalftime {
    min: number;
    sec: number;
}


export interface Testing {
    src: boolean;
    halftime: boolean;
    highlights: boolean;
    min: number;
    sec: number;
}


export interface OneAction {
    id: number;
    min: number;
    sec: number;
    to_add: number;
    halftime: number;
}


export interface Game {
    match_info: MatchInfo;
    testing: Testing;
    highlights: OneAction[];
}

export interface GamesStore {
    games: [Game, Game, Game];
    currentHalfTime: 1 | 2 | 3 | 4 | 5;
    selectedPlayer: 0 | 1 | 2;
    currentClock: CurrentClock;
    currentAction: OneAction;
    zen: boolean;
}

export interface CurrentClock {
    min: number;
    sec: number;
    pause: boolean;
}

function emptyState(): GamesStore {
    let game: Game = {
        match_info: {
            title: "",
            src: "",
            current_halftime: 1,
            sound: "",
            start_halftime: [{ min: 0, sec: 0 }, { min: 0, sec: 0 }, { min: 0, sec: 0 }, { min: 0, sec: 0 }, { min: 0, sec: 0 }, { min: 0, sec: 0 }],
            tv: ""
        }, testing: {
            halftime: false,
            highlights: false,
            min: 0,
            sec: 0,
            src: false
        }, highlights: []
    };

    return {
        games: [Object.assign({}, game), Object.assign({}, game), Object.assign({}, game)],
        currentHalfTime: 1,
        selectedPlayer: 0,
        currentClock: { min: 0, sec: 0, pause: false },
        currentAction: { id: 0, halftime: 0, min: 0, sec: 0, to_add: 0 },
        zen: false
    }

}

