use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct MatchInfo {
    pub title: String,
    pub src: String,
    pub current_halftime: u8,
    pub tv: String,
    pub sound: String,
    pub start_halftime: [StartHalftime; 6],
}

#[derive(Serialize, Deserialize, Clone)]
pub struct StartHalftime {
    pub min: u32,
    pub sec: u32,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Testing {
    src: bool,
    halftime: bool,
    highlights: bool,
    min: u32,
    sec: u32,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct OneAction {
    pub id: u32,
    pub min: u32,
    pub sec: u32,
    pub to_add: u32,
    pub halftime: u8,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Game {
    pub match_info: MatchInfo,
    pub testing: Testing,
    pub highlights: Vec<OneAction>,
}
