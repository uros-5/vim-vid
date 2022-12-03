import { reactive } from "vue";
import { defineStore } from "pinia";
import { timeAgo } from "@/plugins/timeAgo";
import { play } from "@/plugins/sounds";

export const useFootballStore = defineStore("football", {
    state: (): MainGamesStore => {
        return emptyMainState();
    },
    actions: {
        onLoad() {
            if (this.editor() == 1) {
                return;
            }
            if (this.editors[this.editor()].currentClock.running == true) {
                this.editors[this.editor()].currentClock.running = false;
                this.startClock();
            }
        },

        // LOCAL STORAGE
        checkLocalStorage(s: string) {
            const item = localStorage.getItem(s);
            if (item == null) {
                this.saveLocalStorage();
            } else {
                let loadedItem: GamesStore = JSON.parse(item);
                loadedItem = reactive(loadedItem);
                this.editors[this.editor()].currentAction = loadedItem.currentAction;
                this.editors[this.editor()].currentClock = reactive(
                    Object.assign({}, loadedItem.currentClock)
                );
                this.editors[this.editor()].currentHalfTime = loadedItem.currentHalfTime;
                this.editors[this.editor()].games = loadedItem.games;
                this.editors[this.editor()].modal = loadedItem.modal;
                this.editors[this.editor()].selectedPlayer = loadedItem.selectedPlayer;
                this.editors[this.editor()].zen = loadedItem.zen;
                this.onLoad();
            }
        },

        saveLocalStorage() {
            const item = this.editor() == 0 ? "games" : "gamesReplay";
            const newItem = JSON.stringify(this.editors[this.editor()]);
            localStorage.setItem(item, newItem);
        },

        // MODALS
        isModalActive(id: number): boolean {
            return this.editors[this.editor()].modal[id];
        },

        enableModal(id: number) {
            const modal = this.isModalActive(id);
            this.editors[this.editor()].modal[id] = !modal;
            this.saveLocalStorage();
        },

        anyModal(): boolean {
            return [this.isModalActive(0), this.isModalActive(1)].includes(true);
        },

        // CURRENT CLOCK
        isClockActive() {
            return this.editors[this.editor()].currentClock.running;
        },

        currentClock(): number {
            const customMs = this.customMs();
            const preSec = customMs == 0 ? this.halftimeMs() : customMs;
            if (this.editor() == 1) {
                return this.replayClockMs();
            }
            const elapsed =
                Date.now() - +new Date(this.editors[this.editor()].currentClock.dateStart);
            return preSec + elapsed;
        },

        replayClockMs(): number {
            const editor = this.editors[this.editor()];
            return editor.replayClock.ms;
        },

        customMs(): number {
            const min = this.editors[this.editor()].currentClock.customStart.min;
            const sec = this.editors[this.editor()].currentClock.customStart.sec;
            return min * 60 * 1000 + sec * 1000;
        },

        halftimeMs(): number {
            return this.startMinutes() * 60 * 1000;
        },

        // CHANGE CLOCK
        changeClock(min: number, sec: number, toEnable?: boolean) {
            this.setClock(min, sec);
            if (toEnable)
                this.enableModal(0);
        },

        startClock() {
            if (this.editors[this.editor()].currentClock.running == true) {
                return;
            }
            this.editors[this.editor()].currentClock.dateStart = new Date();
            this.editors[this.editor()].currentClock.running = true;
            this.editors[this.editor()].currentAction.halftime =
                this.editors[this.editor()].currentHalfTime;
            this.saveLocalStorage();
        },

        pauseClock() {
            this.editors[this.editor()].currentClock.running = false;
            this.saveLocalStorage();
        },

        setClock(min: number, sec: number) {
            this.editors[this.editor()].currentClock.customStart.min = min;
            this.editors[this.editor()].currentClock.customStart.sec = sec;
            this.saveLocalStorage();
        },

        // PLAYER NAME
        changePlayerName(name: string) {
            this.updateName(name);
            this.enableModal(1);
        },

        updateName(name: string) {
            const player = this.editors[this.editor()].selectedPlayer;
            this.editors[this.editor()].games[player].match_info.title = name;
            this.saveLocalStorage();
        },

        // DOWNLOAD PLAYER
        downloadPlayer(): string {
            let dataStr = "data:text/json;charset=utf-8,";
            const player = this.editors[this.editor()].selectedPlayer;
            const other = encodeURIComponent(
                JSON.stringify(this.editors[this.editor()].games[player])
            );
            dataStr += other;
            return dataStr;
        },

        // TOGGLE CLOCK
        toggleClock() {
            if (this.editors[this.editor()].currentClock.running == true) {
                this.pauseClock();
            } else if (this.editors[this.editor()].currentClock.running == false) {
                this.startClock();
            }
        },

        // CHANGE HALFTIME
        changeHalftime(index: number) {
            this.editors[this.editor()].currentHalfTime = index as Halftime;
            this.saveLocalStorage();
        },

        // START STOP BUTTON
        toggleAction(id: number) {
            if (this.editors[this.editor()].currentClock.running == false) {
                return;
            }
            this.editors[this.editor()].selectedPlayer = id as Player;
            let active = this.isActive();
            this.editors[this.editor()].currentAction.active = !active;
            active = this.isActive();
            if (active) {
                this.startAction();
                play("start");
            } else {
                this.stopAction();
                play("stop");
            }
        },

        startAction() {
            this.editors[this.editor()].currentAction.active = true;
            const m = this.editor() == 0 ? 1300 : 0;
            const current = this.currentClock() - m;
            const time = timeAgo(current, true);
            this.editors[this.editor()].currentClock.actionMs =
                time.minutes * 60000 + time.seconds * 1000;
            this.editors[this.editor()].currentAction.min = time.minutes;
            this.editors[this.editor()].currentAction.sec = time.seconds;
            this.editors[this.editor()].currentAction.halftime = this.currentHalfTime();
            this.saveLocalStorage();
            if (this.editor() == 1) {
                return;
            }
        },

        stopAction() {
            this.editors[this.editor()].currentAction.active = false;
            const to_add = this.actionToAdd();
            this.editors[this.editor()].currentAction.to_add = to_add;
            this.saveAction();
            play("stop");
        },

        saveAction() {
            const player = this.editors[this.editor()].selectedPlayer;
            this.editors[this.editor()].currentAction.id = this.createId();
            this.editors[this.editor()].games[player]!.highlights.push(
                Object.assign({}, this.editors[this.editor()].currentAction)
            );
            this.emptyAction();
            this.saveLocalStorage();
        },

        actionStart() {
            const action = this.editors[this.editor()].currentAction;
            return action.min * 60000 + action.sec * 1000;
        },

        actionEnd() {
            const current = this.currentClock();
            const time = timeAgo(current, true);
            return time.minutes * 60000 + time.seconds * 1000;
        },

        actionToAdd(): number {
            const start = this.actionStart();
            const end = this.actionEnd();
            const to_add = timeAgo(end - start, true);
            return to_add.minutes * 60 + to_add.seconds;
        },

        // PLAYER TABS
        selectPlayer(id: number) {
            this.editors[this.editor()].selectedPlayer = id as Player;
        },

        selectedPlayer() {
            return this.editors[this.editor()].selectedPlayer;
        },

        // ADD ACTION TO OTHER PLAYERS
        addActionToOthers(index: number) {
            const lastAction = this.lastAction();
            if (lastAction == undefined) {
                return;
            }
            const highlights = this.editors[this.editor()].games[index].highlights;
            const exist = highlights.find((item) => item.id == lastAction?.id);
            if (exist == undefined) {
                this.editors[this.editor()].games[index].highlights.push(
                    Object.assign({}, lastAction)
                );
                this.saveLocalStorage();
                play("other");
            }
        },

        // ZEN MODE
        zenMode() {
            const zen = this.isZen();
            this.editors[this.editor()].zen = !zen;
            this.saveLocalStorage();
        },

        isZen(): boolean {
            return this.editors[this.editor()].zen;
        },

        // START WITH
        startWith() {
            const last = Object.assign({}, this.lastAction());
            const player = this.editors[this.editor()].selectedPlayer;
            this.deleteLastAction();
            this.editors[this.editor()].games[player].highlights = [
                last,
                ...this.editors[this.editor()].games[player].highlights,
            ];
            this.saveLocalStorage();
        },

        // START HALFTIME
        startHalftime() {
            let minute = 0;
            if (this.editors[this.editor()].currentClock.running == false) {
                switch (this.editors[this.editor()].currentHalfTime) {
                    case 1:
                        minute = 0;
                        break;
                    case 2:
                        minute = 45;
                        break;
                    case 3:
                        minute = 90;
                        break;
                    case 4:
                        minute = 115;
                        break;
                    case 5:
                        minute = 130;
                        break;
                }
                let clock = timeAgo(minute * 60000, false);
                this.changeClock(clock.minutes, clock.seconds);
                this.saveLocalStorage();
            }
        },

        // DELETE PLAYER
        deletePlayer(id: number) {
            if (id > 2) {
                return;
            }
            this.editors[this.editor()].games[id] = emptyGame();
            this.saveLocalStorage();
        },

        // REPLAY ACTION
        newReplayAction() {
            const active = this.editors[this.editor()].currentAction.active;
            if (active == false) {
                play("start");
                this.editors[this.editor()].currentAction.halftime =
                    this.editors[this.editor()].currentHalfTime;
                this.editors[this.editor()].currentAction.active = true;
                this.startedAction = this.video!.currentTime!;
                this.editors[this.editor()].replayClock.ms = this.calculateStartSeconds() * 1000;
                this.startAction();
                return false;
            } else {
                play("stop");
                const time = timeAgo((this.video?.currentTime! - this.startedAction) * 1000, true);
                this.editors[this.editor()].currentAction.to_add = time.minutes * 60 + time.seconds;
                this.editors[this.editor()].currentAction.active = false;
                this.saveAction();
                this.editors[this.editor()].currentAction.active = false;
                return true;
            }
        },

        calculateStartSeconds(): number {
            const editor = this.editors[this.editor()];
            let halftime: number | { min: number; sec: number } =
                editor.games[this.selectedPlayer()].match_info.start_halftime[
                editor.currentHalfTime - 1
                ];
            halftime = halftime.min * 60 + halftime.sec;
            const action = timeAgo((this.startedAction - halftime) * 1000, true);
            const calculated = this.startMinutes() * 60 + action.minutes * 60 + action.seconds;
            return calculated;
        },

        // PLAYER ACTIONS
        emptyAction() {
            this.editors[this.editor()].currentAction = {
                id: 0,
                halftime: 0,
                min: 0,
                sec: 0,
                to_add: 0,
                active: false,
            };
        },

        lastAction(): OneAction | undefined {
            const player = this.editors[this.editor()].selectedPlayer;
            const highlights = this.editors[this.editor()].games[player].highlights;
            const len = highlights.length;
            if (len == 0) {
                return undefined;
            }
            return highlights[len - 1];
        },

        isActive(): boolean {
            return this.editors[this.editor()].currentAction.active;
        },

        deleteLastAction() {
            const player = this.editors[this.editor()].selectedPlayer;
            const lastAction = this.lastAction();
            if (lastAction != undefined) {
                this.editors[this.editor()].games[player].highlights = this.editors[
                    this.editor()
                ].games[player].highlights.filter((item) => item.id != lastAction?.id);
                this.saveLocalStorage();
                play("delete");
            }
        },

        currentHalfTime(): number {
            return this.editors[this.editor()].currentHalfTime;
        },

        isSelectedHalftime(index: number): boolean {
            return this.currentHalfTime() == index;
        },

        currentMin(): number {
            return this.editors[this.editor()].currentAction.min;
        },

        currentSec(): number {
            return this.editors[this.editor()].currentAction.sec;
        },

        currentToAdd(): number {
            return this.editors[this.editor()].currentAction.to_add;
        },

        randomId(): number {
            return Math.floor(Math.random() * 9000);
        },

        idExist(id: number): boolean {
            const player = this.editors[this.editor()].selectedPlayer;
            const exist = this.editors[this.editor()].games[player].highlights.find(
                (item) => item.id == id
            );
            return exist == undefined ? false : true;
        },

        createId(): number {
            while (true) {
                const id = this.randomId();
                if (this.idExist(id) == false) {
                    return id;
                }
            }
        },

        fileName(): string {
            const name =
                this.editors[this.editor()].games[this.editors[this.editor()].selectedPlayer]
                    .match_info.title;
            return name == ""
                ? `Player${this.editors[this.editor()].selectedPlayer}.json`
                : `${name}.json`;
        },

        editor(): number {
            return this.current_editor;
        },

        parseCommand(event: KeyboardEvent) {
            const key = event.key;
            const command = this.command;
            if (command != "") {
                if (command[0] == "T") {
                    if (key == "Enter") {
                        this.command = `${command}`;
                        this.updateName(command.split("T")[1]);
                        this.command = "";
                        this.saveLocalStorage();
                    } else {
                        this.command = `${command}${key}`;
                    }
                } else if (paramCommands.includes(command[0])) {
                    if (command[0] == "H") {
                        if (isNaN(Number(key))) {
                            this.command = "";
                        } else if ([1, 2, 3, 4, 5].includes(Number(key))) {
                            this.command = `${command}${key}`;
                            this.editors[this.editor()].currentHalfTime = Number(key) as Halftime;
                            this.editors[this.editor()].games[
                                this.selectedPlayer()
                            ].match_info.current_halftime = Number(key);
                            this.saveLocalStorage();
                            this.command = "";
                        }
                    } else {
                        if (isNaN(Number(key))) {
                            this.command = "";
                        } else if ([1, 2, 3].includes(Number(key))) {
                            this.command = `${command}${key}`;
                            this.executeCommand();
                            this.saveLocalStorage();
                        }
                    }
                }
            } else {
                this.command = key;
                this.executeCommand();
            }
        },

        executeCommand() {
            const command = this.command;
            const commands: string[] = ["T", "r"].concat(paramCommands).concat(normalCommands);
            if (this.video == null) {
                return;
            } else if (commands.includes(command[0]) == false) {
                this.command = "";
                return;
            } else {
                switch (command[0]) {
                    case "k": {
                        this.video?.paused ? this.video.play() : this.video?.pause();
                        break;
                    }
                    case ">":
                        this.video.playbackRate += 0.3;
                        break;
                    case "<":
                        this.video.playbackRate -= 0.3;
                        break;
                    case "i": {
                        if (command.length > 1) {
                            const id = Number(command[1]);
                            if (isNaN(id)) {
                                this.command = "";
                            } else {
                                this.addActionToOthers(id - 1);
                                this.command = "";
                                this.saveLocalStorage();
                            }
                            break;
                        } else {
                            return;
                        }
                    }
                    case "l":
                        this.video.currentTime += 3;
                        break;
                    case "h":
                        this.video.currentTime -= 3;
                        break;
                    case "p": {
                        if (command.length > 1) {
                            const id = Number(command[1]);
                            if (isNaN(id)) {
                                this.command = "";
                            } else {
                                this.selectPlayer(id - 1);
                                this.command = "";
                                this.saveLocalStorage();
                            }
                            break;
                        } else {
                            return;
                        }
                    }
                    case "f": {
                        this.startWith();
                        break;
                    }
                    case "z":
                        return;
                    case "d": {
                        if (command.length > 1) {
                            const id = Number(command[1]);
                            if (isNaN(id)) {
                                this.command = "";
                            } else {
                                this.deletePlayer(id - 1);
                                this.command = "";
                                this.saveLocalStorage();
                            }
                            break;
                        } else {
                            return;
                        }
                    }
                    case "x":
                        this.deleteLastAction();
                        break;
                    case "r":
                        this.newReplayAction();
                        break;
                    case "H":
                        return;
                    case "T": {
                        if (command.length > 1) {
                        } else {
                            return;
                        }
                    }
                }
                this.command = "";
            }
        },

        startMinutes(): number {
            if (this.editors[this.editor()].currentHalfTime == 1) {
                return 0;
            } else if (this.editors[this.editor()].currentHalfTime == 2) {
                return 45;
            }
            if (this.editors[this.editor()].currentHalfTime == 3) {
                return 90;
            } else if (this.editors[this.editor()].currentHalfTime == 4) {
                return 105;
            } else if (this.editors[this.editor()].currentHalfTime == 5) {
                return 120;
            }
            return 0;
        },
    },
    getters: {
        abc(store): number {
            return store.current_editor;
        },

        currentAction(store): OneAction {
            return store.editors[store.current_editor].currentAction;
        },
    },
});

export interface MatchInfo {
    title: string;
    src: string;
    current_halftime: number;
    tv: string;
    sound: string;
    start_halftime: [
        StartHalftime,
        StartHalftime,
        StartHalftime,
        StartHalftime,
        StartHalftime,
        StartHalftime
    ];
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
    currentHalfTime: Halftime;
    selectedPlayer: Player;
    replayClock: ReplayClock;
    currentClock: currentClock;
    currentAction: OneAction;
    halftimeDate: Date;
    zen: boolean;
    modal: [boolean, boolean];
}

export interface MainGamesStore {
    editors: [GamesStore, GamesStore];
    current_editor: number;
    command: string;
    video?: HTMLVideoElement;
    startedAction: number;
}

export interface ReplayClock {
    ms: number;
}

export interface currentClock {
    customStart: { min: number; sec: number };
    dateStart: Date;
    actionMs: number;
    running: boolean;
}

export type Halftime = 1 | 2 | 3 | 4 | 5;
export type Player = 0 | 1 | 2;

const paramCommands = ["i", "p", "d", "H"];
const normalCommands = ["k", ">", "<", "l", "h", "z", "s", "x", "f"];

function emptycurrentClock(): currentClock {
    return {
        running: false,
        customStart: { min: 0, sec: 0 },
        dateStart: new Date(),
        actionMs: 0,
    };
}

function emptyGame(): Game {
    const game: Game = {
        match_info: {
            title: "",
            src: "",
            current_halftime: 1,
            sound: "",
            start_halftime: [
                { min: 0, sec: 0 },
                { min: 0, sec: 0 },
                { min: 0, sec: 0 },
                { min: 0, sec: 0 },
                { min: 0, sec: 0 },
                { min: 0, sec: 0 },
            ],
            tv: "",
        },
        testing: {
            halftime: false,
            highlights: false,
            min: 0,
            sec: 0,
            src: false,
        },
        highlights: [],
    };
    return game;
}

function emptyState(): GamesStore {
    return {
        games: [emptyGame(), emptyGame(), emptyGame()],
        currentHalfTime: 1,
        selectedPlayer: 0,
        replayClock: { ms: 0 },
        currentAction: { id: 0, halftime: 0, min: 0, sec: 0, to_add: 0, active: false },
        zen: false,
        modal: [false, false],
        halftimeDate: new Date(),
        currentClock: emptycurrentClock(),
    };
}

function emptyMainState(): MainGamesStore {
    const editors: [GamesStore, GamesStore] = [emptyState(), emptyState()];
    return { editors, current_editor: 0, command: "", startedAction: 0 };
}
