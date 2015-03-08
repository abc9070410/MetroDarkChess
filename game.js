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

"use strict";

document.addEventListener("DOMContentLoaded", startGame, false);


// get the file path of phonegap .
function getPhoneGapPath() 
{
    var path = window.location.pathname;
    path = path.substr( path, path.length - 10 );
    return 'file://' + path;

};


// 點擊棋盤上的(posX, posY)位置
function click( posX, posY )
{
    var index = getIndex( posX, posY );

    if ( isGamePage( getNowPage() ) )
    {
        clickGamePage( index ); // 在遊戲頁面時點擊的操作
        
        storeState( getNowPage() );
    }
    else if ( getNowPage() == START_PAGE )
    {
        // 紀錄進入遊戲的次數
        if ( index == LOW_GAME_PAGE )
        {
            gLowGameCount++;
            
            setItem( "gLowGameCount", gLowGameCount );
        }
        
        if ( index == TWO_PLAYER_PAGE )
        {
            initGame(); // 初始化此局遊戲
            showPage( index );
        }
        else if ( index == TWO_AI_PAGE )
        {
            initGame(); // 初始化此局遊戲
            showPage( index );
            startDemo(); // 開始AI對戰展示
        }
        else if ( index == LOW_GAME_PAGE )
        {
            nowGamePage = LOW_GAME_PAGE; // 紀錄點擊的遊戲模式
            showPage( GAME_START_DIALOG_PAGE );
        }
        else
        {
            gJumpProportion = 0; // for rule page & about page .
            showPage( index );
        }
        
    }
    else if ( getNowPage() == GAME_LEVEL_PAGE )
    {
        gMedGameCount++;
        setItem( "gMedGameCount", gMedGameCount );
        
        setGameLevel( index );
            
        nowGamePage = MED_GAME_PAGE; // 紀錄點擊的遊戲模式
        showPage( GAME_START_DIALOG_PAGE );
    }
    else if ( getNowPage() == OPTION_PAGE )
    {
        if ( index == OPTION_COLOR )
        {
            showPage( OPTION_COLOR_PAGE ); // 進入選擇顏色頁面
        }
        else if ( index == OPTION_OTHER )
        {
            showPage( OPTION_OTHER_PAGE ); // 進入其他設定頁面
        }
    }
    else if ( getNowPage() == GAME_OVER_DIALOG_PAGE )
    {
        if ( index == DIALOG_AGAIN )
        {
            initGame(); // 初始化此局遊戲
            showPage( nowGamePage );
            
            if ( gameOrder == DIALOG_AI_FIRST )
            {
                var ai = ( nowGamePage == LOW_GAME_PAGE ) ? LOW_AI : MED_AI;
                
                aiTurn( ai, BLACK ); // BLACK是隨便傳的，反正都是翻棋，不影響。
            }
        }
        else if ( index == DIALOG_GO_BACK )
        {
            showPage( START_PAGE );
        }
    }
    else if ( getNowPage() == GAME_START_DIALOG_PAGE )
    {
        initGame();
        
        showPage( nowGamePage );
        
        if ( index == DIALOG_HUMAN_FIRST )
        {
            gameOrder = DIALOG_HUMAN_FIRST;
            printDebug( "Human first" );
        }
        else if ( index == DIALOG_AI_FIRST )
        {
            gameOrder = DIALOG_AI_FIRST;
            
            var ai = ( nowGamePage == LOW_GAME_PAGE ) ? LOW_AI : MED_AI;
            
            aiTurn( ai, BLACK );    // BLACK是隨便傳的，反正都是翻棋，不影響。
            
            printDebug( "AI first" );
        }
    }
    else if ( getNowPage() == GAME_OVER_PAGE )
    {    
        stopAnimation(); // 停止動畫
        
        document.body.style.margin = gBackupMargin; // 將之前的位移位置復原回來
        
        showPage( GAME_OVER_DIALOG_PAGE ); //
    }
    
    else if ( getNowPage() == OPTION_COLOR_PAGE )
    {
        if ( index == GO_BACK )
        {
            showPage( START_PAGE ); // 回到設定頁面
        }
        else
        {
            setNowColorOption( index ); // 紀錄是從哪個顏色選項進入的
            showPage( COLOR_PAGE ); // 進入選擇顏色頁面
        }
        
    }
    else if ( getNowPage() == OPTION_OTHER_PAGE )
    {
        if ( index == GO_BACK )
        {
            showPage( START_PAGE ); // 回到設定頁面
        }
        else
        {
            changeOptionOther( index ); // 改變其他設定
            resetThemeColor(); // 重設目前佈景的顏色
            redrawAll();
        }
        
    }
    else if ( getNowPage() == COLOR_PAGE )
    {
        
        setColor( getNowColorOption(), colors[index] ); // 設置選定的顏色
        showPage( OPTION_COLOR_PAGE ); // 回到設定頁面
        
    }
    else if ( getNowPage() == RULE_PAGE || 
              getNowPage() == ABOUT_PAGE ||
              getNowPage() == LOG_PAGE )
    {
        jumpMove( getNowPage(), index );
    }
}

// 兩主模式：1.觸摸滑動 和 2.點擊平移(不支援touch event的瀏覽器使用)
function jumpMove( page, index )
{
    var backIndex = 0; // 回上一頁的index
    var indexLength = 0; // 共有幾個頁面
    var offset = gJumpProportion / 20; // 共平移了幾次
    
    if ( page == ABOUT_PAGE )
    {    
        backIndex = ABOUT_GO_BACK;
        indexLength = ABOUT_NAMES.length;
    }
    else if ( page == RULE_PAGE )
    {    
        backIndex = GO_BACK_RULE;
        indexLength = RULE_NAMES.length;
    }
    else if ( page == LOG_PAGE )
    {    
        backIndex = LOG_GO_BACK;
        indexLength = LOG_NAMES.length;
    }
    
    // 支援touch event的環境皆支援滑動操作
    if ( !TOUCH_EVENT_ENABLE && ( gDeviceName == CHROME || gDeviceName == SIM_DEVICE ) )
    {
        var relativeIndex = index + offset;
    
        if ( offset < -1 )   // 已經滾到最後面
        {
            document.body.style.margin = "0% 0% 0% 0%";
            showPage( START_PAGE );
        }
        else
        {
            //alert( offset );
            gJumpProportion -= 20;
        
            if ( getOrientation() == PORTRAIT ) // 直立
            {
                document.body.style.margin = gJumpProportion + "% 0% 0% 0%"; // 往上移
            }
            else
            {
                document.body.style.margin = "0% 0% 0% " + gJumpProportion + "%"; // 往左移
            }
        }
        
    }
    else
    {
        if ( index == backIndex )   // 已經滾到最後面
        {
            //alert( "XX" );
            showPage( START_PAGE );
        }
    }

}

// 滑鼠左鍵按下的事件
function mousedown( pageX, pageY )
{
    if ( gbWaitingAI )
    {
        printDebug( "waiting AI ..." );
        return;
    }

    if ( c.offsetLeft < pageX && 
         c.offsetLeft + width + chessEatenSize > pageX &&
         c.offsetTop < pageY && 
         c.offsetTop + height + chessEatenSize > pageY )
    {
        var posX = 0;
        var posY = 0;
        
        // 取得x位置
        var phyX = pageX - c.offsetLeft;
        
        while ( posX < widthCount && posXToPhyX( posX ) < phyX )
        {
            posX ++;
        }
        
        posX --;
        
        // 取得y位置
        var phyY = pageY;
        
        while ( posY < heightCount && posYToPhyY( posY ) < phyY )
        {
            posY ++;
        }
        
        posY --;
        
        //printDebug( "游標: " + pageX + " , " + pageY + "&nbsp;&nbsp;&nbsp; 位置: " + posX + " , " + posY + "&nbsp;&nbsp;&nbsp; 棋子: " + chesses[getIndex( posX, posY )] );
        
        click( posX, posY );
        
        
        if ( ( gDeviceName == CHROME || gDeviceName == SIM_DEVICE ) && isGamePage( getNowPage() ) )
        {
            if ( getOrientation() == LANDSCAPE ) // 水平
            {
                if ( width - pageX < chessEatenSize && pageY < chessEatenSize )
                {
                    showPage( START_PAGE );
                }
            }
            else // 直立
            {
                if ( height - pageY < chessEatenSize && pageX < chessEatenSize )
                {
                    showPage( START_PAGE );
                }
            }
        }
    }
    
    
}


// 滑鼠左鍵按下的事件
document.onmousedown = function( event )
{
    try
    {
    	if ( !TOUCH_EVENT_ENABLE )
        {
            var x = event.pageX + document.documentElement.scrollLeft;
            var y = event.pageY + document.documentElement.scrollTop;
            mousedown( x, y );
        }
    }
    catch ( err )
    {
        printError( "發生錯誤: " + err.stack );
    }
}


// 滑鼠左鍵按下的事件 for ios
document.ontouchstart = function( event )
{
    try
    {
        //if ( ON_DEVICE && gDeviceName == IOS || gDeviceName == CHROME )
        {
        	TOUCH_EVENT_ENABLE = true;
            var touch = event.touches[0];
            var x = touch.clientX + document.body.scrollLeft;
            var y = touch.clientY + document.body.scrollTop;
            gTouchStartX = x;
            mousedown( x, y );
        }
    }
    catch ( err )
    {
        printError( "發生錯誤: " + err.stack );
    }
}

// 播放下棋音效
function playClickSound()
{
    if ( enableAudio == YES_LOGO )
    {
        if ( ON_DEVICE && gDeviceName == WINDOWS_PHONE )
		{
			playBeep(); // 若有開啟音效, 則播放逼聲
		}
		else if ( ON_DEVICE && gDeviceName == ANDROID )
	    {
            playAudio( getPhoneGapPath() + "click.wav" );
        }
        else
	    {
            playClickAudio();
        }
    }
}


// 執行AI回合
function aiTurn( ai, camp )
{
    printDebug( getCampName( camp ) );
    clearDebug(); // clear debug message .

    var chessData = getNowChessData(); // 當前棋盤與棋子資料

    // 唯有非雙人對戰模式才會啟動AI
    if ( getNowPage() != TWO_PLAYER_PAGE )
    {
        if ( gFirstTurn || !gameIsOver() )
        {
            var moves;

            //startProcess();

            if ( ai == LOW_AI )
            {
                moves = moveByAI( chessData.chesses, chessData.chessStates, camp );
            }
            else
            {
                moves = moveByAdvanceAI( chessData.chesses, chessData.chessStates, camp );
            }

            //stopProcess();

            var sourceIndex = moves[0];
            var destIndex = moves[1];
            
            if ( getNowPage() == TWO_AI_PAGE )
            {
                playClickSound();
            }
            
            if ( sourceIndex < 0 )
            {
                //printDebug( "無法行走! " );
            }
            else if ( openChess( chessData, destIndex ) ||
                      eat( chessData, destIndex, sourceIndex, camp ) ||
                      move( chessData, destIndex, sourceIndex, camp ) )
            {
                var pos = getPos( sourceIndex );
                var aiX = pos[0];
                var aiY = pos[1];

                //printDebug( "AI走得位置：" + aiX + " , " + aiY );
            }

            var gOldHighlightIndex = gAIHighlightIndex;

            gAIHighlightIndex = destIndex; // set the highlight of AI's move .

            // 遊戲剛開始，決定黑方紅方
            if ( gFirstTurn )
            {
                setNowCamp( chessData.chesses[destIndex] );
                printDebug( "先手是" + getCampName( getNowPlayer() ) );

                gPlayerCamp = getAnotherCamp( getNowPlayer() ); // 玩家陣營

                gFirstTurn = false;
            }

            if ( gOldHighlightIndex != NOT_FOUND )
            {
                drawSingle( gOldHighlightIndex );
            }

            // 重新繪製移動方塊
            drawSingle( sourceIndex );
            drawSingle( destIndex );

            switchPlayer();

            checkGameOver();

        }
        else
        {
            setGameLog( getNowPage() );

            var winner = getCampName( gGameWinner );
            printGame( winner + "獲勝!  遊戲結束!! " );
            
            gBackupMargin = document.body.style.margin; // 將之前的位移位置紀錄起來

            showPage( GAME_OVER_PAGE );
        }
    }
    else if ( getNowPage() == TWO_PLAYER_PAGE )
    {
        if ( enableAngleSwitch == ANGLE_SWITCH_LOGO ) // 雙人遊戲時自動切換視角
        {
            switchAngle(); // 轉180度
            redrawAll();

        }

    }
   

    //redrawAll();

}

function checkGameOver()
{
	if ( gameIsOver() )
    {
        setGameLog( getNowPage() );

        var winner = getCampName( gGameWinner );
        printGame( winner + "獲勝!  遊戲結束!! " );
                
        gBackupMargin = document.body.style.margin; // 將之前的位移位置紀錄起來

        showPage( GAME_OVER_PAGE );
    }
}

// 
function restoreState()
{
    if ( RESET )
    {
        window.localStorage.clear();
    }

    var page = getItem( "gTempStoredPage" );

    if ( page != null )
    {
    
        setNowPage( page );
        
        if ( isGamePage( getNowPage() ) )
        {
        
            initGame();
            /*
            var chessesStr = getItem( "gTempChesses" );
            
            var chessStatesStr = getItem( "gTempChessStates" );
            var eatenBlackQueue = getItem( "gTempEatenBlackQueue" );
            var eatenRedQueue = getItem( "gTempEatenRedQueue" );

            var tempChessStates = chessStatesStr.split( "," );
            var tempEatenBlackQueue = eatenBlackQueue.split( "," );
            var tempEatenRedQueue = eatenRedQueue.split( "," );
            */
            
            
            /*
            gChesses = chessesStr.split( "," );
            
            //
            
            
            
            for ( var i = 0; i < INDEX_LENGTH; i ++ )
            {
                gChessStates[i] = parseInt( tempChessStates[i] );
                
                
                if ( i < INDEX / 2 )
                {
                    gEatenBlockQueue[i] = parseInt( tempEatenBlackQueue[i] );
                    gEatenRedQueue[i] = parseInt( tempEatenRedQueue[i] );
                }
                
            }
            */
            
        }
        
    }
    else
    {
        setNowPage( START_PAGE );
    }
}

// 存入
function storeState( page )
{
    setItem( "gTempStoredPage", page );

    if ( isGamePage( page ) )
    {
    
        var chessesStr = "";
        var chessStatesStr = "";
        var eatenBlackQueueStr = "";
        var eatenRedQueueStr = "";
        
        for ( var i = 0; i < INDEX_LENGTH; i ++ )
        {
            chessesStr += gChesses[i];
            chessStatesStr += gChessStates[i];
            
            if ( i < INDEX_LENGTH - 1 )
            {
                chessesStr += ",";
                chessStatesStr += ",";
            }
            
            
            if ( i < INDEX_LENGTH / 2 )
            {
                eatenBlackQueueStr += gEatenBlockQueue[i];
                eatenRedQueueStr += gEatenRedQueue[i];
                
                if ( i < ( ( INDEX_LENGTH / 2 ) - 1 ) )
                {
                    eatenBlackQueueStr += ",";
                    eatenRedQueueStr += ",";
                }
            }
            
            
        }
        
        
        /*
        setItem( "gTempChesses", chessesStr );
        
        setItem( "gTempChessStates", chessStatesStr );
        
        setItem( "gTempEatenBlackQueue", eatenBlackQueueStr );
        setItem( "gTempEatenRedQueue", eatenRedQueueStr );
        */
        
        
    }


}



// 在遊戲頁面時點擊的操作
function clickGamePage( index )
{
    var chessData = new ChessData( gChesses, gChessStates, gEatenBlockQueue, gEatenRedQueue, gEatenPriorityQueue ); // 當前棋盤與棋子資料

    if ( getNowPage() == TWO_AI_PAGE )
    {
        switchDemoState(); // 改變演示狀態: 執行 or 暫停
        return;
    }

    var ai = ( getNowPage() == LOW_GAME_PAGE ) ? LOW_AI : MED_AI;

    // 遊戲剛開始，決定黑方紅方
    if ( gFirstTurn )
    {
        // 玩家優先
        if ( gameOrder == DIALOG_HUMAN_FIRST )
        {

            setNowCamp( chessData.chesses[index] );

            gPlayerCamp = getNowPlayer(); // 玩家陣營

            gFirstTurn = false;
        }
        else // AI優先
        {

        }
    }

    var indexSelected = index;
    var camp = getNowPlayer();

    // 有選定棋子的時候，可以做吃棋或移棋的動作
    if ( existHighlight() )
    {
        if ( move( chessData, index, getHighlightIndex(), camp ) ||
             eat( chessData, index, getHighlightIndex(), camp ) )
        {
			playClickSound();
			
            switchPlayer();
            setgOldHighlightIndex( getHighlightIndex() );
            setHighlightIndex( index );

            //drawSingle( getHighlightIndex() );
            
            //aiTurn( ai, getNowPlayer() );
            aiTurnWait( ai, getNowPlayer(), index );
        }
    }



    // 點擊的是一個翻開的棋子，加上選定邊框
    if ( chessData.chessStates[index] == OPEN )
    {
        setHighlightIndex( index );

        drawSingle( getgOldHighlightIndex() );
        setgOldHighlightIndex( index );
    }
    // 點擊的是一個可以翻開的棋子，於是翻開
    else if ( openChess( chessData, index ) )
    {
    	playClickSound();
        //drawSingle( index );
        switchPlayer();
        //aiTurn( ai, getNowPlayer() );
        aiTurnWait( ai, getNowPlayer(), index );
    }
    // 點擊的是沒有棋子的地方，若在除錯模式要印出目前棋子配製狀況
    else if ( !ON_DEVICE )
    {
        printDemoChessData();
    }

    drawSingle( index );
    //drawAllEatenChess();
    
    checkGameOver();
}


function switchDemoState()
{
    if ( gDemoState == DEMO_ACTIVE_STATE )
    {
        stopDemo(); // 暫停
        gDemoState = DEMO_PAUSE_STATE;

        printDemoChessData(); // debug 用
    }
    else
    {
        startDemo(); // 開始
        gDemoState = DEMO_ACTIVE_STATE;
    }

}

// 停止AI對戰演示
function stopDemo()
{
    for ( var i = 0; i < DEMO_STEP_MAX_COUNT; i ++ )
    {
        clearTimeout( gAItimers[i] );
    }
}

// call drawSingle() by setTimeout() .
function drawSingleAnimation( index )
{
    return function()
    {
        drawSingle( index );
    }
}

// call aiTurn() by setTimeout() .
function aiAnimationWithColor( ai, camp, color )
{
    return function()
    {
        gAIroundColor = color;
        aiTurn( ai, camp );
        drawAllEatenChess();
    }
}

function aiAnimation( ai, camp, index )
{
    return function()
    {
        aiTurn( ai, camp );
        //initHighlightIndex();
        drawSingle( index ); // 把等待字樣清掉
        drawAllEatenChess();
        gbWaitingAI = false;
    }
}

function aiTurnWait( ai, camp, index )
{
    gbWaitingAI = true;

    drawWaiting( index, 1 ); // 畫上等待字樣
    
    var iWaitTime = ai == LOW_AI ? 0 : 200;
    
    setTimeout( aiAnimation( ai, camp, index ), iWaitTime );
}

// 開始AI對戰展示
function startDemo()
{
    var speed = 1000;
    var times = DEMO_STEP_MAX_COUNT;
    var ai = LOW_AI;
    var color = getLighterColor( frontChessColor );

    if ( gFirstTurn )
    {
        aiTurn( ai, getNowPlayer() );
    }

    for ( var i = 0; i < times; i ++ )
    {
        //setNowPlayer( getNextPlayer() );
        gAItimers[i] = setTimeout( aiAnimationWithColor( ai, getNowPlayer(), color ), speed * ( i ) );
        setNowPlayer( getNextPlayer() );

        //ai = ( ai == LOW_AI ) ? MED_AI : LOW_AI;
        color = ( color == getLighterColor( frontChessColor ) ) ? getDarkerColor( frontChessColor ) : getLighterColor( frontChessColor );
    }
}

// stop drawing process .
function stopProcess()
{
    for ( var i = 0; i < PROCESS_MAX_COUNT; i ++ )
    {
        clearTimeout( gProcessTimer[i] );
    }
}

// draw process in animation .
function startProcess()
{
    var camp = getNowPlayer();
    var speed = 10;

    for ( var i = 1; i < PROCESS_MAX_COUNT; i ++ )
    {
        gProcessTimer[i] = setTimeout( drawProcessAnimation( camp, speed * i ) );
    }
}


// 取得滑動後真正點擊的位置
function getIndexAfterScroll( index )
{
    var pos = getPos( index );
    var posX = pos[0];
    var posY = pos[1];

    var phyX = posXToPhyX( posX );
    var phyY = posYToPhyY( posY );

    //retrurn getIndex( phyX + document.documentElement.scrollLeft, phyY + document.documentElement.scrollTop );
}


// 取得滑動的距離
function getScrollLength()
{
    if ( document.documentElement.scrollLeft > document.documentElement.scrollTop )
    {
        return document.documentElement.scrollLeft;
    }
    else
    {
        return document.documentElement.scrollTop;
    }
}


// 初始化動作，啓動程式時呼叫
function init()
{
    log( "init" );

	if ( ON_DEVICE )
	{
		document.addEventListener( "deviceready", onDeviceReady, false );
		document.addEventListener( "resume", onResume, false );
	}
}

// 改寫預設按上一頁的行為
function onBackKeyDown()
{
	if ( isStartPageNow() )
    {
        // Windows Phone沒有提供結束API，因此不宜用此方式實現
		if ( gDeviceName != WINDOWS_PHONE )
		{
			navigator.app.exitApp(); 
		}
    }
    else
    {
        showPage( START_PAGE );
    }
	
}

var gLocaleName; // 取得的區域名稱

function onDeviceReady()
{
    log( "onDeviceReady" );

    //initAllItem();
    
    if ( gDeviceName == WINDOWS_PHONE )
    {
        window.addEventListener( "orientationchange", orientationChange, false );
    }
    else if ( gDeviceName != ANDROID )
    {
		document.addEventListener( "orientationchange", orientationChange, false );
	}
    
    if ( gDeviceName != WINDOWS_PHONE )
	{
		document.addEventListener("backbutton", onBackKeyDown, false);
	}
    
    if ( gDeviceName == ANDROID || 
         gDeviceName == BLACK_BERRY )
	{
		navigator.globalization.getLocaleName(
            function (locale) {gLocaleName = locale.value;},
            function () {alert('Error getting locale\n');}
        );
        
	    setDefaultLanguage( gLocaleName ); // 以區域名稱來設置語言
	}
    
    showPage( START_PAGE );
}

// 初始化此局遊戲
function initGame()
{
    gFirstTurn = true; // 新的一局要重新決定黑紅方

    initialChess(); // 棋子初始化
    shuffle( gChesses );  // 隨機擺放棋子位置
    cleanArray( gEatenBlockQueue, INIT_EATEN_VALUE ); // 將被吃黑棋清空
    cleanArray( gEatenRedQueue, INIT_EATEN_VALUE ); // 將被吃紅棋清空
    cleanArray( gEatenPriorityQueue, INIT_EATEN_VALUE ); // 被吃棋子的優先權

    if ( DEBUG_MODE || !ON_DEVICE )
    {
        setTestChessData();
    }
}

// 開始頁面
function showPage( page )
{
    try
    {
         // android在改變方向的時後會摧毀目前頁面，因此需要保存當前資訊
        if ( ON_DEVICE && gDeviceName == ANDROID )
        {
            // 剛進入遊戲
            if ( gInitGameState )
            {
                
                restoreState();
            
                page = getNowPage();
                
                gInitGameState = false;
            }
            else
            {
                storeState( page );
            }
        }
        
        // android在改變方向的時後會摧毀目前頁面，因此需要保存當前資訊
        if ( ON_DEVICE && gDeviceName == ANDROID )
        {
            
        }
    
        setBackgroundColor();

        setNowPage( page );

        var w;
        var h;

        if ( true )//ON_DEVICE )
        {
            var deviceHeight = document.body.offsetHeight;
            var deviceWidth = document.body.offsetWidth;

            if ( deviceHeight > deviceWidth ) // 直立
            {

                if ( gDeviceName == WINDOWS_PHONE )
                {
					deviceHeight *= 1.05; // 棋盤高度增大5%
					document.body.style.margin = "5% 0% 0% 0%"; // 棋盤往下移
                }
                else if ( gDeviceName == IOS )
                {
                    document.body.style.margin = "0% 0% 0% -10%"; // 棋盤左移
                    
                    if ( gInitHeight != null && gInitWidth != null )
                    {
                        deviceHeight = gInitHeight;
                        deviceWidth = gInitWidth;
                    }
                }
                else if ( gDeviceName == CHROME || gDeviceName == SIM_DEVICE )
                {
                    var tempHeight = ( deviceWidth / 2.7 ) * 4;
                    deviceHeight = tempHeight < deviceHeight ? tempHeight : deviceHeight;
                }

                w = deviceHeight / 2;
                
                if ( page == RULE_PAGE )
                {
                    
                    h = w * RULE_HEIGHT / RULE_WIDTH;
                    
                }
                else if ( page == ABOUT_PAGE )
                {
                    h = w * ABOUT_HEIGHT / ABOUT_WIDTH;
                }
                else if ( page == LOG_PAGE )
                {
                    h = w * LOG_HEIGHT / LOG_WIDTH;
                }
                else if ( page == OPTION_PAGE )
                {
                    h = w * OPTION_HEIGHT / OPTION_WIDTH;
                }
                else if ( page == GAME_OVER_DIALOG_PAGE || page == GAME_START_DIALOG_PAGE )
                {
                    h = w * DIALOG_HEIGHT / DIALOG_WIDTH;
                }
                else if ( page == GAME_OVER_PAGE )
                {
                    h = w * GAME_OVER_HEIGHT / GAME_OVER_WIDTH;
                }
                else
                {
                    h = deviceHeight;
                }

                setSize( w, h, page );
            }
            else // 橫放 , deviceHeight < deviceWidth
            {
                if ( gDeviceName == WINDOWS_PHONE )
                {
                    //deviceHeight *= 1.1; // 棋盤高度縮小5%
                    deviceWidth *= 0.95; // 棋盤寬度縮小5%
                    document.body.style.margin = "-7% 0% 0% 0%"; // 棋盤往上移
                }
                else if ( gDeviceName == IOS )
                {
                    document.body.style.margin = "5% 0% 0% 0%"; // 棋盤往下移
                }
                else if ( gDeviceName == CHROME || gDeviceName == SIM_DEVICE )
                {
                    var tempWidth = ( deviceHeight / 2.7 ) * 4;
                    deviceWidth = tempWidth < deviceWidth ? tempWidth : deviceWidth;
                }

                w = deviceWidth / 2;

                if ( page == RULE_PAGE )
                {
                    h = w * RULE_HEIGHT / RULE_WIDTH;
                }
                else if ( page == ABOUT_PAGE )
                {
                    h = w * ABOUT_HEIGHT / ABOUT_WIDTH;
                }
                else if ( page == LOG_PAGE )
                {
                    h = w * LOG_HEIGHT / LOG_WIDTH;
                }
                else if ( page == OPTION_PAGE )
                {
                    h = w * OPTION_HEIGHT / OPTION_WIDTH;
                }
                else if ( page == GAME_OVER_DIALOG_PAGE || page == GAME_START_DIALOG_PAGE )
                {
                    h = w * DIALOG_HEIGHT / DIALOG_WIDTH;
                }
                else if ( page == GAME_OVER_PAGE )
                {
                    h = w * GAME_OVER_HEIGHT / GAME_OVER_WIDTH;
                }
                else
                {
                    h = deviceWidth;
                }

                setSize( h, w, page );
            }

        }
        else
        {
            setSize( 800, 400, page );
        }

        //swapSize( page );

        if ( page == START_PAGE )
        {
            stopDemo();    // 預防之前是從AI演示跳回的情況
        }


        if ( isGamePage( page ) ||
             getNowPage() == COLOR_PAGE )
        {
            if ( enableAnimation == YES_LOGO )
            {
                redrawAllAnimation( page ); // 動畫方式擺上所有蓋好的棋子
            }
            else
            {
                redrawAll(); // 靜態擺上所有蓋好的棋子
            }
        }
        else
        {
            cleanArray( gEatenBlockQueue, INIT_EATEN_VALUE ); // 將被吃黑棋清空
            cleanArray( gEatenRedQueue, INIT_EATEN_VALUE ); // 將被吃紅棋清空
            cleanArray( gEatenPriorityQueue, INIT_EATEN_VALUE ); // 被吃棋子的優先權

            if ( enableAnimation == YES_LOGO )
            {
                redrawAllAnimation( page ); // 動畫方式擺上所有蓋好的棋子
            }
            else
            {
                redrawAll(); // 直接繪製整個畫面
            }
        }
    }
    catch ( err )
    {
        printError( "發生錯誤: " + err.stack );
    }

}




// 從此處進入遊戲
function startGame()
{
	
    try
    {
        init(); // 動作初始化
        initAllItem();
        
        setDocumentTitle( GAME_NAME[gLanguageIndex] );

		if ( !ON_DEVICE || 
             gDeviceName == SIM_DEVICE ||
             gDeviceName == CHROME ||
             gDeviceName == FIREFOX )
		{
			//setSystemColor( "green", "black" );
			//setDefaultLanguage( "TW" );
			showPage( START_PAGE );

            printDebug( getCampName( getCamp( "包" ) ) );
		}
        
        
    }
    catch ( err )
    {
        printError( "發生錯誤: " + err.stack );

		showPage( START_PAGE ); // 有錯的時候還是盡量看能不能顯示主頁
    }
}




