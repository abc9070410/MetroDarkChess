/*
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

﻿//
// 系統相關
//
var ON_DEVICE = 0; // 是否在平台上測試
var DEBUG_MODE = 0; // 是否為除錯模式
var RESET = 0; // 重新使用預設設定

//
// 設備相關
//
var SIM_DEVICE = 0; // simulate device .
var WINDOWS_PHONE = 1;
var ANDROID = 2;
var IOS = 3;
var BLACK_BERRY = 4;
var CHROME = 5;
var FIREFOX = 6;
//var MOBILE_BROWSER = 7;

var gDeviceName = SIM_DEVICE; // 設備名稱

var TOUCH_EVENT_ENABLE = false; // 觸摸事件是否有啓用（在IOS和Android上）

//
// 尺寸相關
//
var width;    //width of the canvas
var height;   //height of the canvas
var widthCount; // 寬度的棋子數目
var heightCount; // 長度的棋子數目
var highlightOffset; // 選定的邊框寬度
var chessSizeOffset; // 棋子字體大小
var chessWidth; // 棋子高度
var chessHeight; // 棋子寬度
var chessFontBaseSize; // 棋子字型基本大小
var chessEatenSize; // 被吃的棋子的大小

var gInitWidth; // 啓動時取得的width
var gInitHeight; // 啓動時取得的height


var nowPage = 0;

//
// 顏色相關
//
var backChessColor; // 棋子背景顏色
var frontChessColor; // 棋子前景顏色
var chessBlackColor; // 黑方棋子顏色
var chessRedColor; // 紅方棋子顏色
var backColor; // 背景顏色
var frontColor; // 前景顏色
var highlightColor; // 選定後的顏色
var eatenChessColor; // 被吃的棋子顏色
var systemBackColor; // 系統背景顏色
var systemBackChessColor; // 系統色塊顏色
var systemFrontChessColor; // 系統色塊正面顏色

//
// 色塊樣式
//
var nowChessBlockStyle; // 目前棋子色塊樣式
var nowOtherBlockStyle; // 目前其他色塊樣式
var NORMAL_BLOCK_STYLE = 0; // 正常色塊
var SHADOW_BLOCK_STYLE = 1; // 陰影色塊
var HALO_BLOCK_STYLE = 2; // 光暈色塊

//
// 其他設定
//
var enableAnimation; // 啟用動畫
var defaultTheme; // 欲設佈景顏色(系統或自訂)
var enableAudio; // 啟用音效
var enableAchievement; // 啟用成就系統
var chessDisplay; // 棋子顯示的圖樣
var enableAngleSwitch; // 啟用雙人遊戲自動切換視角
var rotateAngle = 0; // 目前角度


// 陣營
var BLACK = 0; // 黑方
var RED = 1; // 紅方


// 執行狀態
var FAIL = 0; // 失敗
var SUCCESS = 1; // 成功

// 作為參考，順序不會變
var gChessPatterns = new Array( "將", "士", "士", "象", "象", "車", "車", "馬", "馬", "包", "包", "卒", "卒", "卒", "卒", "卒",
                                "帥", "仕", "仕", "相", "相", "陣", "陣", "傌", "傌", "炮", "炮", "兵", "兵", "兵", "兵", "兵" );
// 棋子的鍵值，以此來決定孰大孰小（用於吃棋），順序不會改變
var gChessKeys = new Array( 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 0, 0, 0,
                            6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 0, 0, 0 );

var RANK_GENERAL = 6; // 將帥
var RANK_SCHOLAR = 5; // 士仕
var RANK_MINISTER = 4; // 象相
var RANK_CAR = 3; // 車陣
var RANK_HORSE = 2; // 馬傌
var RANK_CANNON = 1; // 包炮
var RANK_SOLDIER = 0; // 卒兵


// 棋子的權值，以此來決定孰大孰小（用於AI判斷），順序會改變（隨目前所剩棋子而改變）
var gChessPrices = new Array( 6, 5, 5, 3, 3, 2, 2, 0, 0, 4, 4, 1, 1, 1, 1, 1,
                              6, 5, 5, 3, 3, 2, 2, 0, 0, 4, 4, 1, 1, 1, 1, 1 );

var PRICE_GENERAL = 6; // 將帥
var PRICE_SCHOLAR = 5; // 士仕
var PRICE_CANNON = 4; // 包炮
var PRICE_MINISTER = 3; // 象相
var PRICE_CAR = 2; // 車陣
var PRICE_SOLDIER = 1; // 卒兵
var PRICE_HORSE = 0; // 馬傌


var INDEX_LENGTH = gChessPatterns.length;


// 棋子在棋盤的實際位置，順序會變
var gChesses = new Array( "將", "士", "士", "象", "象", "車", "車", "馬", "馬", "包", "包", "卒", "卒", "卒", "卒", "卒",
                          "帥", "仕", "仕", "相", "相", "陣", "陣", "傌", "傌", "炮", "炮", "兵", "兵", "兵", "兵", "兵" );


var BLACK_GENERAL = 16;
var BLACK_SCHOLAR = 15;
var BLACK_MINISTER = 14;
var BLACK_CAR = 13;
var BLACK_HORSE = 12;
var BLACK_CANNON = 11;
var BLACK_SOLDIER = 10;

var RED_GENERAL = 26;
var RED_SCHOLAR = 25;
var RED_MINISTER = 24;
var RED_CAR = 23;
var RED_HORSE = 22;
var RED_CANNON = 21;
var RED_SOLDIER = 20;

var gOldClickIndex = 0; // 上一次棋盤被點擊的位置
var gOldHighlightIndex = 0; // 上一次的高亮位置



var gChessStates = new Array( INDEX_LENGTH );  // 棋子狀態
var OPEN = 0; // 顯示棋子正面
var CLOSE = 1; // 顯示棋子背面
var EATEN = -1; // 被吃 顯示空位



var c = document.getElementById( 'c' );  //canvas itself

var gameMessage = document.getElementById( 'gameMessage' );  // 遊戲訊息輸出
var debugMessage = document.getElementById( 'debugMessage' );  // 除錯訊息輸出
var errorMessage = document.getElementById( 'errorMessage' );  // 錯誤訊息輸出

var ctx = c.getContext( '2d' );  // 繪圖

var gNowPlayer = BLACK; // 目前玩家 (0:黑方 1:紅方)

var gIndexLastSelected = -1; // 最後選定的位置 (必須是己方翻開的棋子)

var gHighlightIndex = -1; // 最後選定的位置

var gGameWinner = -1; // 遊戲獲勝玩家

var gEatenBlockQueue = new Array( INDEX_LENGTH / 2 ); // 黑方被吃棋子
var gEatenRedQueue = new Array( INDEX_LENGTH / 2 ); // 紅方被吃棋子
var gEatenPriorityQueue = new Array( INDEX_LENGTH ); // 被吃棋子的優先權
var INIT_EATEN_VALUE = 999; // 被吃佇列的初始值


//
// 符號相關
//
var LOGOS = new Array( STR_NORMAL, STR_SHADOW, STR_HALO, STR_GOBACK_LOGO, STR_NO_LOGO, STR_YES_LOGO, STR_ACHIEVEMENT_LOGO, STR_WORD, STR_PIC, STR_AGAIN_LOGO, STR_SYSTEM, STR_CUSTOM, STR_FIXED, STR_SWITCH, STR_ALPHA, STR_BETA );

var NORMAL_LOGO = 0;
var SHADOW_LOGO = 1;
var HALO_LOGO = 2;
var GO_BACK_LOGO = 3;
var NO_LOGO = 4;
var YES_LOGO = 5;
var ACHIEVEMENT_LOGO = 6;
var WORD_LOGO = 7;
var PIC_LOGO = 8;
var AGAIN_GAME_LOGO = 9;
var SYSTEM_THEME_LOGO = 10;
var CUSTOM_THEME_LOGO = 11;
var ANGLE_FIXED_LOGO = 12; // 雙人遊戲時固定視角
var ANGLE_SWITCH_LOGO = 13; // 雙人遊戲時自動切換視角
var FIRST_LOGO = 14;
var SECOND_LOGO = 15;


//
// 方向相關
//
var LANDSCAPE = 1; // 橫放
var PORTRAIT = 2; // 直立


//
// 頁面相關
//
var LOW_GAME_PAGE = 0;
var MED_GAME_PAGE = 1;
//var HIGH_GAME_PAGE = 2;
var TWO_AI_PAGE = 2;
var TWO_PLAYER_PAGE = 3;
var LOG_PAGE = 4;
var RULE_PAGE = 5;
var OPTION_PAGE = 6;
var ABOUT_PAGE = 7;
//var QUIT_PAGE = 7;

var START_PAGE = 110;
var OPTION_COLOR_PAGE = 111;
var OPTION_OTHER_PAGE = 112;
var COLOR_PAGE = 113;
var GAME_OVER_PAGE = 114;
var GAME_OVER_DIALOG_PAGE = 115;
var GAME_START_DIALOG_PAGE = 116;
var GAME_LEVEL_PAGE = 117;


var nowGamePage = 0; // 目前遊戲頁面 (用於跳轉之紀錄)
var gameOrder = DIALOG_HUMAN_FIRST; // 遊戲順序

//
// 開始頁面相關
//
var FUNCTION_NAMES = new Array( STR_LOW_LEVEL, STR_MID_LEVEL, STR_DEMO, STR_DOUBLE_GAME, STR_LOG, STR_RULE, STR_OPTION, STR_ABOUT );

//
// 遊戲結束對話頁面相關
//
var GAME_OVER_DIALOGS = new Array( STR_RESTART, STR_GOBACK, STR_BLACK, STR_RED, STR_WIN, STR_PLAYER_FIRST, STR_AI_FIRST );

var DIALOG_WIDTH = 1;
var DIALOG_HEIGHT = 2;

var DIALOG_AGAIN = 0;
var DIALOG_GO_BACK = 1;
var DIALOG_BLACK = 2;
var DIALOG_RED = 3;
var DIALOG_WIN = 4;
//var DIALOG_HUMAN_FIRST = 5;
//var DIALOG_AI_FIRST = 6;


//
// 遊戲開始對話頁面相關
//
var GAME_START_DIALOGS = new Array( STR_PLAYER_FIRST, STR_AI_FIRST  );
var DIALOG_HUMAN_FIRST = 0;
var DIALOG_AI_FIRST = 1;


//
// 遊戲結束畫面相關
//
var GAME_OVER_NAMES = new Array( STR_BLACK, STR_RED, STR_WIN, STR_LOSE );

var GAME_OVER_WIDTH = 1;
var GAME_OVER_HEIGHT = 2;

var GAME_OVER_BLACK = 0;
var GAME_OVER_RED = 1;
var GAME_OVER_WIN = 2;
var GAME_OVER_LOSE = 3;


//
// 主要選項頁面相關
//
var OPTION_NAMES = new Array( STR_COLOR_OPTION, STR_OTHER_OPTION  );

var OPTION_WIDTH = 1;
var OPTION_HEIGHT = OPTION_NAMES.length;

var OPTION_COLOR = 0;
var OPTION_OTHER = 1;

//
// 其他選項頁面相關
//
var OPTION_OTHER_NAMES = new Array( STR_ANIMATION_EFFECT, STR_THEME_COLOR, STR_CHESS_STYLE, STR_BLOCK_STYLE, STR_GAME_AUDIO, STR_DOUBLE_ANGLE, STR_LOG_CLEAN, STR_GOBACK  );

var OPTION_OTHER_LOGOS = new Array( YES_LOGO, SYSTEM_THEME_LOGO, NORMAL_LOGO, NORMAL_LOGO, NO_LOGO, ANGLE_FIXED_LOGO, NO_LOGO, GO_BACK_LOGO );
var OPTION_ANIMATION = 0;
var OPTION_THEME = 1;
var OPTION_CHESS_STYLE = 2;
var OPTION_BLOCK_STYLE = 3;
var OPTION_GAME_AUDIO = 4;
//var OPTION_CHESS_DISPLAY = 5;
var OPTION_ANGLE = 5;
var OPTION_ACHIEVEMENT = 6;
var OPTION_GO_BACK = 7;



//
// 顏色選項頁面相關
//
var OPTION_COLOR_NAMES = new Array( STR_BACKGROUND_COLOR, STR_FOREGROUND_COLOR, STR_CHESS_OBVERSE_COLOR, STR_CHESS_POSITIVE_COLOR, STR_BLACK_COLOR, STR_RED_COLOR, STR_FRAME_COLOR, STR_GOBACK );

var nowColorOption = -1; // 目前是進入到哪個顏色選項

var BACK_COLOR = 0;
var FRONT_COLOR = 1;
var CHESS_BACK_COLOR = 2;
var CHESS_FRONT_COLOR = 3;
var BLACK_COLOR = 4;
var RED_COLOR = 5;
var FRAME_COLOR = 6;
var GO_BACK = 7;


//
// 顏色頁面相關
//
var COLOR_WIDTH = 6;
var COLOR_HEIGHT = 12;
var colors = new Array( COLOR_WIDTH *COLOR_HEIGHT );

//
// 規則頁面相關
//
var RULE_NAMES = new Array( STR_GENERAL_RULE, STR_MOVE_RULE, STR_ATTACK_RULE, STR_RANK_RULE, STR_GOBACK );
var ruleDetail = new Array( STR_GENERAL_RULE_DETAIL, STR_MOVE_RULE_DETAIL, STR_ATTACK_RULE_DETAIL, STR_RANK_RULE_DETAIL );

var RULE_WIDTH = 1;
var RULE_HEIGHT = RULE_NAMES.length;
var NORMAL_RULE = 0;
var WALK_RULE = 1;
var EAT_RULE = 2;
var RANK_RULE = 3;
var GO_BACK_RULE = 4;

//
// 關於頁面相關
//
var ABOUT_NAMES = new Array( STR_ABOUT_PROJECT, STR_ABOUT_DISTRIBUTION, STR_ABOUT_AUTHOR, STR_GOBACK );
var aboutDetail = new Array( STR_ABOUT_PROJECT_DETAIL, STR_ABOUT_DISTRIBUTION_DETAIL,  STR_ABOUT_AUTHOR_DETAIL );
var ABOUT_WIDTH = 1;
var ABOUT_HEIGHT = ABOUT_NAMES.length;
var ABOUT_APP = 0;
var ABOUT_ISSUE = 1;
//var ABOUT_SUPPORT = 2;
var ABOUT_AUTHOR = 2;
var ABOUT_GO_BACK = 3;


//
// 紀錄頁面相關
//
var LOG_NAMES = new Array( STR_LOG_LOW, STR_LOG_MED, STR_GOBACK );
var LOG_WIDTH = 1;
var LOG_HEIGHT = LOG_NAMES.length;
var LOG_LOW = 0;
var LOG_MED = 1;
var LOG_GO_BACK = 2;


// 動畫相關
var TIMER_MAX_COUNT = 1000;
var timers = new Array( TIMER_MAX_COUNT );

// 遊戲回合相關
var gFirstTurn = true; // 第一次下



//
// AI行動優先權定義值
//
var AI_PRIORITY_OFFSET = 100;
var EAT_FIRST = 0;
var ESCAPE_FIRST = EAT_FIRST + AI_PRIORITY_OFFSET;
var SAFE_EAT = ESCAPE_FIRST + AI_PRIORITY_OFFSET;
var NORMAL_EAT = ESCAPE_FIRST + AI_PRIORITY_OFFSET + 1;
var PROTECT_EAT = ESCAPE_FIRST + AI_PRIORITY_OFFSET + 1;
var NORMAL_ESCAPE = ESCAPE_FIRST + AI_PRIORITY_OFFSET + 2;
var WALK_TO_EAT = SAFE_EAT + AI_PRIORITY_OFFSET;
var OPEN_TO_EAT = WALK_TO_EAT + AI_PRIORITY_OFFSET + 1;
var INVASIVE_OPEN = WALK_TO_EAT + AI_PRIORITY_OFFSET + 2;
var INVASIVE_MOVE = WALK_TO_EAT + AI_PRIORITY_OFFSET + 3;
var DEFENSIVE_OPEN = WALK_TO_EAT + AI_PRIORITY_OFFSET + 4;
var DEFENSIVE_MOVE = WALK_TO_EAT + AI_PRIORITY_OFFSET + 5;
var SAFE_OPEN = DEFENSIVE_OPEN + AI_PRIORITY_OFFSET;
var WALK = SAFE_OPEN + AI_PRIORITY_OFFSET;
var DANGEROUS_OPEN = WALK + AI_PRIORITY_OFFSET;
var DANGEROUS_EAT = DANGEROUS_OPEN + AI_PRIORITY_OFFSET;
var DANGEROUS_WALK = DANGEROUS_EAT + AI_PRIORITY_OFFSET;

var FOUND = INDEX_LENGTH; // 有找到 .
var NOT_FOUND = -1; // 沒找到
var ERROR = -1; // 發生非預期的錯誤
var INIT_VALUE = -1;
var INIT_PRIORITY = 999; // 移動權值的初始值
var INIT_PRICE = -1; // 棋子權值的初始值
var NOT_ASSIGNED = -1; // 未指定值，通常是方向

//
// normal eat principle 原則
//
var SAFE_FIRST_PRINCIPLE = 0; // 若吃了有危險就不吃
var PRICE_FIRST_PRINCIPLE = 1; // 若吃的棋比本身價值高，即使危險也吃
var EAT_FIRST_PRINCIPLE = 2; // 即使危險也吃


//
// AI相關
//

var gReachArea = new Array( INDEX_LENGTH ); // 紀錄棋盤上可到與不可到的位置
var INIT_DIRECTION = -1;

var gInSimState = false; // 是否在模擬狀態中

var MAX_TRACE_TIMES = 2; // 最多可以追殺同一棋子的回合次數

var gNowTracer = ""; // 目前的追殺者
var gNowTraced = ""; // 目前的被追殺者
var gNowTraceTimes = 0; // 同一追殺者與被追殺者持續的回合數

var gNowTempTracer = ""; // 暫時考慮的追殺者
var gNowTempTraced = ""; // 暫時被考慮追殺的對象

var DEMO_STEP_MAX_COUNT = 1000; // DEMO最多演示幾回合
var gAItimers = new Array( DEMO_STEP_MAX_COUNT * 2 );
var gNoTraceIndex = NOT_FOUND; // 每個方法都不允許走到此位置

var DEMO_PAUSE_STATE = 0; // demo暫停中
var DEMO_ACTIVE_STATE = 1; // demo進行中
var gDemoState = DEMO_ACTIVE_STATE; // now demo state .

var gAIDrawDelay = 1000; // delay to draw AI's move .
var gAIHighlightIndex = NOT_FOUND; // highlight the ai' move

var gAIroundColor;

var PROCESS_MAX_COUNT = 100;
var gProcessTimer = new Array( PROCESS_MAX_COUNT );

//
// 成就相關
//
// 低階對戰的成績
var gLowGameCount = 0;
var gLowGameWinCount = 0;
var gLowGameLossCount = 0;

// 進階對戰的成績
var gMedGameCount = 0;
var gMedGameWinCount = 0;
var gMedGameLossCount = 0;

var gPlayerCamp; // 此局玩家陣營


//
// 模擬相關
//

var SIM_LENGTH = 100;  // 模擬紀錄上限
var PRICES_LENGTH = 3; // 單次吃棋或被吃的權值數上限 (也是模擬回合的上限)
var A_IS_BETTER = 0; // A(第一個)較優
var B_IS_BETTER = 1; // B(第二個)較優
var A_B_ARE_SAME = 2; // 第一個跟第二個同等

var LOW_AI = 0; // 低階AI
var MED_AI = 1; // 進階AI

var gSimEatPrices = new Array( SIM_LENGTH ); // 所有模擬吃棋的權值
var gSimEatenPrices = new Array( SIM_LENGTH ); // 所有模擬被吃棋的權值
var gSimMoves = new Array( SIM_LENGTH ); // 所有模擬的第一步
var gSimCount = 0; // 當前模擬記錄數量


//
// 挑選進階模式等級
//
var LEVEL_NAMES = new Array( STR_LEVEL_ONE, STR_LEVEL_TWO, STR_LEVEL_THREE, STR_LEVEL_FOUR, STR_LEVEL_FIVE, STR_LEVEL_SIX, STR_LEVEL_SEVEN, STR_LEVEL_EIGHT );
var LEVEL_LOGOS = new Array( STR_LEVEL_LOGO_ONE, STR_LEVEL_LOGO_TWO, STR_LEVEL_LOGO_THREE, STR_LEVEL_LOGO_FOUR, STR_LEVEL_LOGO_FIVE, STR_LEVEL_LOGO_SIX, STR_LEVEL_LOGO_SEVEN, STR_LEVEL_LOGO_EIGHT );
var LEVEL_WIDTH = 2;
var LEVEL_HEIGHT = LEVEL_NAMES.length;
var LEVEL_ONE = 0;
var LEVEL_TWO = 1;
var LEVEL_THREE = 2;
var LEVEL_FOUR = 3;
var LEVEL_FIVE = 4;
var LEVEL_SIX = 5;
var LEVEL_SEVEN = 6;
var LEVEL_EIGHT = 7;



//
// android 恢復改變方向前的棋局
// 
var TEMP_CHESSES = "gTempChesses"; // 暫存的棋子配製
var TEMP_CHESS_STATES = "gTempChessStates"; // 暫存的棋子狀態
var TEMP_GAME_ORDER = "gTempGameOrder"; // 暫存的遊戲順序
var TEMP_EATEN_BLACK_QUEUE = "gTempEatenBlackQueue";
var TEMP_EATEN_RED_QUEUE = "gTempEatenRedQueue";
var TEMP_PAGE = "gTempStoredPage"; // 暫存的頁面名稱
var gInitGameState; // 是不是剛開始遊戲


var gJumpProportion = 0; // 用於Chrome往後捲動頁面
var gBackupMargin; // 之前位移位置


var gTouchStartX = -1;
var gTouchStartY = -1;


