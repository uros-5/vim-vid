import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { timeAgo } from '@/plugins/timeAgo';

export const useFootballStore = defineStore('football', {
    state: (): GamesStore => {
        return emptyState();
    },
    actions: {
        onLoad() {
            if (this.$state.currentClock.running) {
                this.startClock();
            }
        },

        selectPlayer(id: number) {
            this.$state.selectedPlayer = (id) as 0 | 1 | 2;
        },

        selectedPlayer() {
            return this.$state.selectedPlayer;
        },

        isActive(): boolean {
            return this.$state.currentAction.active;
        },

        startAction() {
            this.$state.currentAction.active = true;
            let time = timeAgo(this.$state.currentClock.ms - 1000);
            this.$state.currentAction.min = time.minutes;
            this.$state.currentAction.sec = time.seconds;
            let a = 0;
            let self = this;
            let ins = setInterval(() => {
                a += 200;
                if (self.$state.currentAction.active == false) {
                    self.$state.currentAction.to_add = (a / 1000) + 1;
                    self.$state.currentAction.active = false;
                    self.saveAction()
                    clearInterval(ins);
                }
            }, 200);
        },

        stopAction() {
            this.$state.currentAction.active = false;
            let time = this.timeAgo();
        },

        toggleAction() {
            if (this.$state.currentClock.running == false) { return; }
            let active = this.isActive();
            this.$state.currentAction.active = !active;
            active = this.isActive();
            if (active) {
                this.startAction();
            }
            else {
                this.stopAction();
            }
        },

        saveAction() {
            let player = this.$state.selectedPlayer;
            this.$state.currentAction.id = this.createId();
            this.games[player].highlights.push(Object.assign({}, this.$state.currentAction));
            this.emptyAction();
        },

        emptyAction() {
            this.$state.currentAction = { id: 0, halftime: 0, min: 0, sec: 0, to_add: 0, active: false };
        },

        lastAction(): OneAction | undefined {
            let player = this.$state.selectedPlayer;
            let highlights = this.$state.games[player].highlights;
            let len = highlights.length;
            if (len == 0) { return undefined; }
            return highlights[len - 1];
        },

        deleteLastAction() {
            let player = this.$state.selectedPlayer;
            let lastAction = this.lastAction();
            if (lastAction != undefined) {
                this.$state.games[player].highlights = this.$state.games[player].highlights.filter(item => item.id != lastAction?.id);
            }
        },

        addActionToOthers(index: number) {
            let lastAction = this.lastAction();
            if (lastAction == undefined) { return; }
            let highlights = this.$state.games[index].highlights;
            let exist = highlights.find(item => item.id == lastAction?.id);
            if (exist == undefined) {

                this.$state.games[index].highlights.push(Object.assign({}, lastAction));
            }
        },

        startWith() {
            let last = Object.assign({}, this.lastAction());
            let player = this.$state.selectedPlayer;
            this.deleteLastAction();
            this.$state.games[player].highlights = [last, ...this.$state.games[player].highlights];
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
            let zen = this.isZen();
            this.$state.zen = !zen;
            this.saveLocalStorage();
        },

        isZen(): boolean {
            return this.$state.zen
        },

        downloadPlayer(): string {
            let dataStr = "data:text/json;charset=utf-8,";
            let player = this.$state.selectedPlayer;
            let other = encodeURIComponent(JSON.stringify(this.$state.games[player]))
            dataStr += other;
            return dataStr;

        },

        changeHalftime(index: number) {
            this.$state.currentHalfTime = index as 1 | 2 | 3 | 4 | 5;
        },

        currentHalfTime(): number {
            return this.$state.currentHalfTime;
        },

        isSelectedHalftime(index: number): boolean {
            return this.currentHalfTime() == index;
        },

        currentMin(): number {
            return this.$state.currentAction.min;

        },

        currentSec(): number {
            return this.$state.currentAction.sec;
        },

        currentToAdd(): number {
            return this.$state.currentAction.to_add;
        },

        timeAgo(): { minutes: number, seconds: number } {
            //let ms = this.$state.currentClock.min * 60_000 + this.$state.currentClock.sec * 1000;
            return timeAgo(this.$state.currentClock.ms);
        },

        checkLocalStorage() {
            let item = localStorage.getItem("games")
            if (item == null) {
                this.saveLocalStorage();
            }
            else {
                let loadedItem: GamesStore = JSON.parse(item);
                console.log(this, loadedItem);
                this.$state.currentAction = loadedItem.currentAction;
                this.$state.currentClock = Object.assign({}, loadedItem.currentClock);
                this.$state.currentHalfTime = loadedItem.currentHalfTime;
                this.$state.games = loadedItem.games;
                this.$state.modal = loadedItem.modal;
                this.$state.selectedPlayer = loadedItem.selectedPlayer;
                this.$state.zen = loadedItem.zen;
                this.onLoad();
            }

        },

        saveLocalStorage() {
            let newItem = JSON.stringify(this.$state);
            localStorage.setItem("games", newItem);
        },

        randomId(): number {
            return Math.floor(Math.random() * 9000);
        },

        idExist(id: number): boolean {
            let player = this.$state.selectedPlayer;
            let exist = this.$state.games[player].highlights.find(item => item.id == id);
            return exist == undefined ? false : true;
        },

        createId(): number {
            while (true) {
                let id = this.randomId();
                if (this.idExist(id) == false) {
                    return id;
                }
            }
        },

        anyModal(): boolean {
            return [this.isModalActive(0), this.isModalActive(1)].includes(true)
        },

        updateName(name: string) {
            let player = this.$state.selectedPlayer;
            this.$state.games[player].match_info.title = name;
        },

        isModalActive(id: number): boolean {
            return this.$state.modal[id];
        },

        enableModal(id: number) {
            let modal = this.isModalActive(id);
            this.$state.modal[id] = !modal;
        },

        startClock() {
            this.$state.currentClock.running = true;
            let self = this;
            let clockInterval = setInterval(() => {
                this.$state.currentClock.ms += 1000;
                this.$state.currentClock.id = clockInterval;
                this.$state.currentAction.halftime = self.$state.currentHalfTime;
            }, 1000);
        },

        startHalftime() {
            let minute = 0;
            if (this.$state.currentClock.running == false) {
                switch (this.$state.currentHalfTime) {
                    case 1:
                        minute = 0;
                        break;
                    case 2: minute = 45; break;
                    case 3: minute = 90; break;
                    case 4: minute = 115; break;
                    case 5: minute = 130; break;
                }
                this.$state.currentClock.ms = minute * 60000;
            }
        },

        pauseClock() {
            this.$state.currentClock.running = false;
            clearInterval(this.$state.currentClock.id);
        },

        setClock(min: number, sec: number) {
            this.$state.currentClock.ms = min * 60_000 + sec * 1000;
        },

        fileName(): string {
            let name = this.$state.games[this.$state.selectedPlayer].match_info.title;
            return name == "" ? "Player.json" : `${name}.json`;
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
    active: boolean;
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
    modal: [boolean, boolean];
}

export interface CurrentClock {
    running: boolean;
    id: number;
    ms: number;
}

function emptyGame(): Game {
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
    return game;
}

function emptyState(): GamesStore {


    return {
        games: [emptyGame(), emptyGame(), emptyGame()],
        currentHalfTime: 1,
        selectedPlayer: 0,
        currentClock: { ms: 0, running: false, id: 0 },
        currentAction: { id: 0, halftime: 0, min: 0, sec: 0, to_add: 0, active: false },
        zen: false,
        modal: [false, false]
    }

}

