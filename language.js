﻿/*
This file is part of Metro Dark Chess
Copyright (C)2012-2013 Chien-Yu Chen <abc9070410@gmail.com>

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

﻿"use strict";

// 繁 簡 英 日 韓
// [gLanguageIndex]

var ZH = 0;
var CN = 1;
var EN = 2;
var JA = 3;
var KO = 4;

var gLanguageIndex = 0; // 目前預設語言

var GAME_NAME = new Array( "地鐵暗棋", "地铁暗棋", "Metro Darkchess", "地下鉄チェス", "지하철체스" );

var STR_LEVEL_ONE = new Array( "", "", "", "", "" );
var STR_LEVEL_TWO = new Array( "", "", "", "", "" );
var STR_LEVEL_THREE = new Array( "", "", "", "", "" );
var STR_LEVEL_FOUR = new Array( "", "", "", "", "" );
var STR_LEVEL_FIVE = new Array( "", "", "", "", "" );
var STR_LEVEL_SIX = new Array( "", "", "", "", "" );
var STR_LEVEL_SEVEN = new Array( "", "", "", "", "" );
var STR_LEVEL_EIGHT = new Array( "", "", "", "", "" );

var STR_LEVEL_LOGO_ONE = new Array( "等級1", "", "Level 1", "", "" );
var STR_LEVEL_LOGO_TWO = new Array( "等級2", "", "Levle 2", "", "" );
var STR_LEVEL_LOGO_THREE = new Array( "等級3", "", "Levle 3", "", "" );
var STR_LEVEL_LOGO_FOUR = new Array( "等級4", "", "Levle 4", "", "" );
var STR_LEVEL_LOGO_SIX = new Array( "等級5", "", "Levle 5", "", "" );
var STR_LEVEL_LOGO_SEVEN = new Array( "等級6", "", "Levle 6", "", "" );
var STR_LEVEL_LOGO_EIGHT = new Array( "等級7", "", "Levle 7", "", "" );
var STR_LEVEL_LOGO_FIVE = new Array( "等級8", "", "Levle 8", "", "" );

var STR_NORMAL = new Array( "一般", "一般", "Normal", "一般", "일반" );
var STR_SHADOW = new Array( "陰影", "阴影", "Shadow", "影", "그림자" );
var STR_HALO = new Array( "光暈", "光晕", "Halo", "暈", "후광" );
var STR_GOBACK_LOGO = new Array( "⇦", "⇦", "⇦", "⇦", "⇦" );
var STR_NO_LOGO = new Array( "✘", "✘", "✘", "✘", "✘" ); // ◻
var STR_YES_LOGO = new Array( "✔", "✔", "✔", "✔", "✔" ); // ☑　 
var STR_ACHIEVEMENT_LOGO = new Array( "▩", "▩", "▩", "▩", "▩" );
var STR_WORD = new Array( "字", "字", "Word", "ワード", "워드" );
var STR_PIC = new Array( "圖", "图", "Pic", "マップ", "지도" );
var STR_AGAIN_LOGO = new Array( "▶", "▶", "▶", "▶", "▶" );
var STR_SYSTEM = new Array( "系統", "系统", "System", "システム", "체계" );
var STR_CUSTOM = new Array( "自訂", "自订", "Custom", "カスタム", "관습" );
var STR_FIXED = new Array( "固定", "固定", "Fixed", "固定した", "고정" );
var STR_SWITCH = new Array( "切換", "切换", "Switch", "スイッチ", "스위치" );
var STR_ALPHA = new Array( "α", "α", "α", "α", "α" );
var STR_BETA = new Array( "β", "β", "β", "β", "β" );

var STR_LOW_LEVEL = new Array( "初階對戰", "初阶对战", "Normal Game", "初等の戦い", "낮은 게임" );
var STR_MID_LEVEL = new Array( "進階對戰", "进阶对战", "Advance Game", "適度の戦い", "보통 게임" );
var STR_HIGH_LEVEL = new Array( "高階對戰", "高阶对战", "Top Game", "上位の戦い", "고급 게임" );
var STR_DEMO = new Array( "雙機演示", "双机演示", "Demo", "デュアルデモ", "듀얼 데모" );
var STR_DOUBLE_GAME = new Array( "雙人對戰", "双人对战", "Double Game", "ダブルバトル", "더블 배틀" );
var STR_RULE = new Array( "規則說明", "规则说明", "Rule", "規則の説明", "규칙 설명" );
var STR_OPTION = new Array( "選項設定", "选项设定", "Option", "設定され", "세트" );
var STR_ABOUT = new Array( "關於程式", "关于程式", "About", "作品について", "약" );
var STR_QUIT = new Array( "離開遊戲", "离开游戏", "Quit", "終わり", "끝" );
var STR_LOG = new Array( "對戰記錄", "对战历史", "Game Log", "ゲーム記録", "게임 기록" );

var STR_RESTART = new Array( "再下一盤", "再下一盘", "Restart", "もう再生する", "다시 재생" );
var STR_BLACK = new Array( "黑", "黑", "Black", "黒", "검은" );
var STR_RED = new Array( "紅", "红", "Red", "赤", "붉은" );
var STR_WIN = new Array( "勝", "胜", "Win", "勝", "승리" );
var STR_LOSE = new Array( "負", "负", "Lose", "負", "음수" );
var STR_PLAYER_FIRST = new Array( "玩家先手", "玩家先手", "Player First", "選手の優先", "선수 첫번째" );
var STR_AI_FIRST = new Array( "電腦先手", "电脑先手", "AI First", "AIの優先", "컴퓨터 첫번째" );
var STR_TIE = new Array( "合", "合", "tie", "平手", "매다" );

var STR_COLOR_OPTION = new Array( "顏色設定", "颜色设定", "Color", "色の設定", "색상 설정" );
var STR_OTHER_OPTION = new Array( "其他設定", "其他设定", "Other", "他の設定", "기타 설정" );

var STR_ANIMATION_EFFECT = new Array( "動畫效果", "动画效果", "Animation Effect", "アニメーション", "생기" );
var STR_THEME_COLOR = new Array( "佈景顏色", "布景颜色", "Theme Color", "カラーを設定し", "세트 색상" );
var STR_CHESS_STYLE = new Array( "棋子風格", "棋子风格", "Chess Style", "ポーンスタイル", "담보 스타일" );
var STR_BLOCK_STYLE = new Array( "色塊風格", "色块风格", "Block Style", "色のブロック形式", "블록 스타일" );
var STR_GAME_AUDIO = new Array( "遊戲音效", "游戏音效", "Game Audio", "ゲーム音", "게임 소리" );
var STR_DOUBLE_ANGLE = new Array( "雙人視角", "双人视角", "Duet Angle", "二重の視点", "더블 관점" );
var STR_ACHIEVEMENT_SYSTEM = new Array( "成就系統", "成就系统", "Achievement", "功績システム", "성취 시스템" );
var STR_LOG_CLEAN = new Array( "清除記錄", "清除历史", "Clear History", "履歴のクリア", "지우기" );

var STR_BACKGROUND_COLOR = new Array( "背面佈景顏色", "背面布景颜色", "Background", "バックの色", "백 색" );
var STR_FOREGROUND_COLOR = new Array( "前景字體顏色", "前景字体颜色", "Foreground", "前景の色", "전경색" );
var STR_CHESS_OBVERSE_COLOR = new Array( "棋子背面顏色", "棋子背面颜色", "Obverse Color", "駒の背中", "뒷면에 체스" );
var STR_CHESS_POSITIVE_COLOR = new Array( "棋子正面顏色", "棋子正面颜色", "Positive Color", "正の駒", "긍정적 담보" );
var STR_BLACK_COLOR = new Array( "黑方字體顏色", "黑方字体颜色", "Black Color", "黒フォント色", "블랙 글꼴 색상" );
var STR_RED_COLOR = new Array( "紅方字體顏色", "红方字体颜色", "Red Color", "赤のフォント色", "레드 글꼴 색상" );
var STR_FRAME_COLOR = new Array( "選定邊框顏色", "选定边框颜色", "Frame Color", "選択枠線の色", "테두리 색상" );

var STR_GENERAL_RULE = new Array( "一般規則", "一般规则", "General Rule", "一般的な規則", "일반 규칙" );
var STR_MOVE_RULE = new Array( "行棋規則", "行棋规则", "Move Rule", "ラインな規則", "선 체스 규칙" );
var STR_ATTACK_RULE = new Array( "吃棋規則", "吃棋规则", "Attack Rule", "を食べるな規則", "규칙을 먹고" );
var STR_RANK_RULE = new Array( "階級規則", "阶级规则", "Rank Rule", "クラス規則", "클래스 규칙" );
var STR_GOBACK = new Array( "返回主頁", "返回主页", "Go back", "ホームへ戻る", "반환" );

var STR_ABOUT_PROJECT = new Array( "關於程式", "关于程式", "About Project", "プログラム概要", "프로그램에 대한" );
var STR_ABOUT_DISTRIBUTION = new Array( "關於發佈", "关于发布", "About Distribution", "発行概要", "출판에 대하여" );
var STR_ABOUT_SUPPORT = new Array( "關於贊助", "关于赞助", "About Support", "スポンサーシップ", "후원에 대하여" );
var STR_ABOUT_AUTHOR = new Array( "關於作者", "关于作者", "About Author", "著者紹介", "저자 소개" );

var STR_LOG_LOW = new Array( "低階對戰紀錄", "低阶对战纪录", "Normal Game Record", "プログラム概要", "프로그램에 대한" );
var STR_LOG_MED = new Array( "進階對戰紀錄", "进阶对战纪录", "Advance Game Record", "発行概要", "출판에 대하여" );

var STR_ABOUT_PROJECT_DETAIL = new Array(
    "基於Cordova + HTML5開發的暗棋小遊戲。",
    "基于Cordova + HTML5开发的暗棋小游戏。",
    "A little Chinese Dark Chess game base on Cordova & HTML5.",
    "チーゲームコルドバ+ HTML5ベースの開発。",
    "치 게임 Cordova + HTML5 기반의 개발." );
var STR_ABOUT_DISTRIBUTION_DETAIL = new Array(
    "以GPL授權協議公開原始碼，託管於Google Code(https://code.google.com/p/metro-dark-chess)，野人獻曝，供如我這般的初學者參考與借鑑。",
    "以GPL授权协议公开原始码，托管于Google Code(https://code.google.com/p/metro-dark-chess)，野人献曝，供如我这般的初学者参考与借鉴。",
    "Open source GPL licensing agreement, hosted on Google Code(https://code.google.com/p/metro-dark-chess). Savage Sincere reference purposes only, such as I do so beginners and Reference.",
    "Google CodeでホストされているオープンソースのGPLライセンス契約(https://code.google.com/p/metro-dark-chess)。 サベージ誠実な参照を目的としてのみ、私は初心者および解説を行うなど。",
    "Google 코드에서 호스팅되는 오픈 소스 GPL 라이센스 계약(https://code.google.com/p/metro-dark-chess).세비지 성실한 참조 목적으로 만, 정말 초보자와 참조를 같은." );
var STR_ABOUT_SUPPORT_DETAIL = new Array(
    "關於贊助",
    "关于赞助",
    "About Support",
    "スポンサーシップ",
    "후원에 대하여" );
var STR_ABOUT_AUTHOR_DETAIL = new Array(
    "作者：surveyorK　信箱: abc9070410@gmail.com",
    "作者：surveyorK　信箱: abc9070410@gmail.com",
    "Author:surveyorK　e-mail:abc9070410@gmail.com",
    "著者:surveyorK 　e-mail:abc9070410@gmail.com",
    "저자:surveyorK 　e-mail:abc9070410@gmail.com" );


var STR_GENERAL_RULE_DETAIL = new Array(
    "覆蓋共三十二枚棋子，雙方輪流執棋攻防，可掀棋、移動己方棋子或吃掉對方棋子。當演為僵局或任一方已無可行動之棋子時，遊戲結束。",
    "覆盖共三十二枚棋子，双方轮流执棋攻防，可掀棋、移动己方棋子或吃掉对方棋子。当演为僵局或任一方已无可行动之棋子时，游戏结束。",
    "Coverage thirty-two pawn sides take turns executed chess offense and defense, can flip chess, moving one's own pawn or eat each other pawn.",
    "カバレッジ三十から二ポーン側は、実行チェス攻守を交代でチェスを反転させることができ、自分のポーンを移動したり、お互いのポーンを食べる。とすると、デッドロックまたはいずれかのアクションなし。終了します。",
    "범위 서른두 폰의 측면은 실행 체스 공격과 방어를 켭 가져 체스 뒤집기를 할 수 있습니다 자신의 폰을 이동하거나 서로 폰을 먹는다. 게임은 교착 상태에 음성 또는 다음 동작 없음." );
var STR_MOVE_RULE_DETAIL = new Array(
    "己方回合時，若東西南北四個方位的鄰格沒有棋子，可移動至該處，並結束此回合。",
    "己方回合时，若东西南北四个方位的邻格没有棋子，可移动至该处，并结束此回合。",
    "Own Round, North and South, East and West of the four cardinal the adjacent lattice pawn, can be moved to the department, and the end of this round.",
    "独自のラウンド、北と南、東と西の東西南北の隣接格子ポーンは、部署に移動し、このラウンドの最後にすることができます。",
    "자신의 라운드는 남쪽과 북쪽, 동쪽과 네 개의 기본 방위 인접 격자 폰의 서부는, 부서,이 원형의 끝으로 이동할 수 있습니다." );
var STR_ATTACK_RULE_DETAIL = new Array(
    "若某一對方棋子與包（炮）平行且中間僅隔一個棋子，可跳吃；其餘則只能吃東西南北四個方位的鄰格對方棋子。",
    "若某一对方棋子与包（炮）平行且中间仅隔一个棋子，可跳吃；其余则只能吃东西南北四个方位的邻格对方棋子。",
    "A each other pawn package (gun) parallel and are only separated by a pawn in the middle, you can jump to eat; then the rest of the four directions of North and South, East and West.",
    "互いに並列ポーン包（炮）とのみ、真ん中のポーンによって分離されて、食べにジャンプすることができ、その後、北と南、東と西の4方向の残りの部分は、唯一お互いポーン隣接するグリッドを食べることができます。",
    "서로 병렬 폰 包（炮）과는, 중간에 볼모로 분리되어 식사를 이동할 수 있습니다, ​​그리고 북쪽과 남쪽, 동과 서의 네 방향의 나머지 부분은 인접 격자에게 서로 폰을 먹을 수 있습니다." );
var STR_RANK_RULE_DETAIL = new Array(
    "階級關係：將（帥） > 士（仕）＞象（相）＞車（陣）＞馬（傌）＞包（炮）＞卒（兵），僅能吃同階或低階的對方棋子，包（炮）則無此限制。",
    "阶级关系：将（帅） > 士（仕）＞象（相）＞车（阵）＞马（傌）＞包（炮）＞卒（兵），仅能吃同阶或低阶的对方棋子，包（炮）则无此限制。",
    "Class relations: 將(帥) > 士(仕)>象(相)>車(陣)>馬(傌)>包(炮)>卒(兵). We can only eat the same order or low-end of the other side pawn. 包(炮) has no such restriction.",
    "クラスの関係は、將（帥） > 士（仕）＞象（相）＞車（陣）＞馬（傌）＞包（炮）＞卒（兵）、反対側のポーンと同じ順序やローエンドを食べることができるだけ，包（炮）そのような制限はありませ。",
    "클래스의 관계 :將（帥） > 士（仕）＞象（相）＞車（陣）＞馬（傌）＞包（炮）＞卒（兵），또 다른 측면 폰의 동일한 명령 또는 로우 엔드를 먹을 수 ，包（炮）그런 제한 없습니다." );

