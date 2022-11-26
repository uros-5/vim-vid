import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { timeAgo } from '@/plugins/timeAgo';
import { play } from '@/plugins/sounds';

export const useFootballStore = defineStore('football', {
    state: (): MainGamesStore => {
        return emptyMainState();
    },
    actions: {
        onLoad() {
            if (this.$state.editors[this.editor()].currentClock.running == true) {
                this.$state.editors[this.editor()].currentClock.running = false;
                this.startClock();
            }
        },

        selectPlayer(id: number) {
            this.$state.editors[this.editor()].selectedPlayer = (id) as 0 | 1 | 2;
        },

        selectedPlayer() {
            return this.$state.editors[this.editor()].selectedPlayer;
        },

        isActive(): boolean {
            return this.$state.editors[this.editor()].currentAction.active;
        },

        startAction() {
            this.$state.editors[this.editor()].currentAction.active = true;
            let time = timeAgo(this.$state.editors[this.editor()].currentClock.ms - 500, true);
            this.$state.editors[this.editor()].currentAction.min = time.minutes;
            this.$state.editors[this.editor()].currentAction.sec = time.seconds;
            this.saveLocalStorage();
            let a = 0;
            let self = this;
            let ins = setInterval(() => {
                a += 200;
                if (self.$state.editors[this.editor()].currentAction.active == false) {
                    self.$state.editors[this.editor()].currentAction.to_add = (a / 1000) + 1;
                    self.$state.editors[this.editor()].currentAction.active = false;
                    self.saveAction()
                    clearInterval(ins);
                    play("stop");

                }
            }, 200);
        },

        stopAction() {
            this.$state.editors[this.editor()].currentAction.active = false;
            //let time = this.timeAgo();
        },

        toggleAction(id: number) {
            if (this.$state.editors[this.editor()].currentClock.running == false) { return; }
            this.$state.editors[this.editor()].selectedPlayer = id as 0 | 1 | 2;
            let active = this.isActive();
            this.$state.editors[this.editor()].currentAction.active = !active;
            active = this.isActive();
            if (active) {
                this.startAction();
                play("start")
            }
            else {
                this.stopAction();
            }
        },

        saveAction() {
            let player = this.$state.editors[this.editor()].selectedPlayer;
            this.$state.editors[this.editor()].currentAction.id = this.createId();
            console.log(this.$state.editors[this.editor()].currentAction);
            this.$state.editors[this.editor()].games[player].highlights.push(Object.assign({}, this.$state.editors[this.editor()].currentAction));
            this.emptyAction();
            this.saveLocalStorage();
        },

        emptyAction() {
            this.$state.editors[this.editor()].currentAction = { id: 0, halftime: 0, min: 0, sec: 0, to_add: 0, active: false };
        },

        lastAction(): OneAction | undefined {
            let player = this.$state.editors[this.editor()].selectedPlayer;
            let highlights = this.$state.editors[this.editor()].games[player].highlights;
            let len = highlights.length;
            if (len == 0) { return undefined; }
            return highlights[len - 1];
        },

        deleteLastAction() {
            let player = this.$state.editors[this.editor()].selectedPlayer;
            let lastAction = this.lastAction();
            if (lastAction != undefined) {
                this.$state.editors[this.editor()].games[player].highlights = this.$state.editors[this.editor()].games[player].highlights.filter(item => item.id != lastAction?.id);
                this.saveLocalStorage();
                play("delete");
            }
        },

        addActionToOthers(index: number) {
            let lastAction = this.lastAction();
            if (lastAction == undefined) { return; }
            let highlights = this.$state.editors[this.editor()].games[index].highlights;
            let exist = highlights.find(item => item.id == lastAction?.id);
            if (exist == undefined) {
                this.$state.editors[this.editor()].games[index].highlights.push(Object.assign({}, lastAction));
                this.saveLocalStorage();
                play("other");
            }
        },

        startWith() {
            let last = Object.assign({}, this.lastAction());
            let player = this.$state.editors[this.editor()].selectedPlayer;
            this.deleteLastAction();
            this.$state.editors[this.editor()].games[player].highlights = [last, ...this.$state.editors[this.editor()].games[player].highlights];
            this.saveLocalStorage();
        },


        zenMode() {
            let zen = this.isZen();
            this.$state.editors[this.editor()].zen = !zen;
            this.saveLocalStorage();
        },

        isZen(): boolean {
            return this.$state.editors[this.editor()].zen
        },

        downloadPlayer(): string {
            let dataStr = "data:text/json;charset=utf-8,";
            let player = this.$state.editors[this.editor()].selectedPlayer;
            let other = encodeURIComponent(JSON.stringify(this.$state.editors[this.editor()].games[player]))
            dataStr += other;
            return dataStr;

        },

        deletePlayer(id: number) {
            if (this.$state.editors[this.editor()].currentClock.running == false) {
                console.log(id);
                this.$state.editors[this.editor()].games[id] = emptyGame();
                this.saveLocalStorage();
            }
        },

        changeHalftime(index: number) {
            this.$state.editors[this.editor()].currentHalfTime = index as 1 | 2 | 3 | 4 | 5;
            this.saveLocalStorage();
        },

        currentHalfTime(): number {
            return this.$state.editors[this.editor()].currentHalfTime;
        },

        isSelectedHalftime(index: number): boolean {
            return this.currentHalfTime() == index;
        },

        currentMin(): number {
            return this.$state.editors[this.editor()].currentAction.min;

        },

        currentSec(): number {
            return this.$state.editors[this.editor()].currentAction.sec;
        },

        currentToAdd(): number {
            return this.$state.editors[this.editor()].currentAction.to_add;
        },

        timeAgo(): { minutes: number, seconds: number } {
            //let ms = this.$state.editors[this.editor()].currentClock.min * 60_000 + this.$state.editors[this.editor()].currentClock.sec * 1000;
            return timeAgo(this.$state.editors[this.editor()].currentClock.ms);
        },

        checkLocalStorage() {
            let item = localStorage.getItem("games")
            if (item == null) {
                this.saveLocalStorage();
            }
            else {
                let loadedItem: GamesStore = JSON.parse(item);
                loadedItem = reactive(loadedItem);
                this.$state.editors[this.editor()].currentAction = loadedItem.currentAction;
                this.$state.editors[this.editor()].currentClock = Object.assign({}, loadedItem.currentClock);
                this.$state.editors[this.editor()].currentHalfTime = loadedItem.currentHalfTime;
                this.$state.editors[this.editor()].games = loadedItem.games;
                this.$state.editors[this.editor()].modal = loadedItem.modal;
                this.$state.editors[this.editor()].selectedPlayer = loadedItem.selectedPlayer;
                this.$state.editors[this.editor()].zen = loadedItem.zen;
                this.onLoad();
            }
        },

        saveLocalStorage() {
            let newItem = JSON.stringify(this.$state.editors[this.editor()]);
            localStorage.setItem("games", newItem);
        },

        randomId(): number {
            return Math.floor(Math.random() * 9000);
        },

        idExist(id: number): boolean {
            let player = this.$state.editors[this.editor()].selectedPlayer;
            let exist = this.$state.editors[this.editor()].games[player].highlights.find(item => item.id == id);
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
            let player = this.$state.editors[this.editor()].selectedPlayer;
            this.$state.editors[this.editor()].games[player].match_info.title = name;
        },

        isModalActive(id: number): boolean {
            return this.$state.editors[this.editor()].modal[id];
        },

        enableModal(id: number) {
            let modal = this.isModalActive(id);
            this.$state.editors[this.editor()].modal[id] = !modal;
        },

        startClock() {
            if (this.$state.editors[this.editor()].currentClock.running == true) { return; }
            this.$state.editors[this.editor()].currentClock.running = true;
            let self = this;
            this.$state.editors[this.editor()].currentClock.ms += 1000;
            this.saveLocalStorage();
            let clockInterval = setInterval(() => {
                this.$state.editors[this.editor()].currentClock.ms += 1000;
                this.$state.editors[this.editor()].currentClock.id = clockInterval;
                this.$state.editors[this.editor()].currentAction.halftime = self.$state.editors[this.editor()].currentHalfTime;
            }, 1000);
        },

        toggleClock() {
            if (this.$state.editors[this.editor()].currentClock.running == true) {
                this.pauseClock();
            }
            else if (this.$state.editors[this.editor()].currentClock.running == false) {
                this.startClock();
            }
        },

        startHalftime() {
            let minute = 0;
            if (this.$state.editors[this.editor()].currentClock.running == false) {
                switch (this.$state.editors[this.editor()].currentHalfTime) {
                    case 1:
                        minute = 0;
                        break;
                    case 2: minute = 45; break;
                    case 3: minute = 90; break;
                    case 4: minute = 115; break;
                    case 5: minute = 130; break;
                }
                this.$state.editors[this.editor()].currentClock.ms = minute * 60000;
                this.saveLocalStorage();
            }
        },

        pauseClock() {
            this.$state.editors[this.editor()].currentClock.running = false;
            clearInterval(this.$state.editors[this.editor()].currentClock.id);
            this.saveLocalStorage();
        },

        setClock(min: number, sec: number) {
            this.$state.editors[this.editor()].currentClock.ms = min * 60_000 + sec * 1000;
            this.saveLocalStorage();
        },

        fileName(): string {
            let name = this.$state.editors[this.editor()].games[this.$state.editors[this.editor()].selectedPlayer].match_info.title;
            return name == "" ? `Player${this.$state.editors[this.editor()].selectedPlayer}.json` : `${name}.json`;
        },

        editor(): number {
            return this.$state.current_editor;
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

export interface MainGamesStore {
    editors: [GamesStore, GamesStore];
    current_editor: number;
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

function emptyMainState(): MainGamesStore {
    const editors: [GamesStore, GamesStore] = [emptyState(), emptyState()];
    return { editors, current_editor: 0 }
}

