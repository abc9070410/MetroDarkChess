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


function log( text )
{
    if ( console != null )
        console.log( text );
}

function setDocumentTitle( sTitle )
{
    document.title = sTitle;
}

// 棋盤當前資料
function ChessData( chesses, chessStates, gEatenBlockQueue, gEatenRedQueue, gEatenPriorityQueue )
{
    this.chesses = chesses; // 每個位置的棋子名稱
    this.chessStates = chessStates; // 每個位置的棋子狀態

    this.eatenBlockQueue = gEatenBlockQueue; // 黑方被吃棋子
    this.eatenRedQueue = gEatenRedQueue; // 紅方被吃棋子
    this.eatenPriorityQueue = gEatenPriorityQueue; // 被吃棋子的優先權
}

// 複製棋盤資料
function copyChessData( chessData )
{
    return new ChessData( copyArray( chessData.chesses ),
                          copyArray( chessData.chessStates ),
                          copyArray( chessData.eatenBlockQueue ),
                          copyArray( chessData.eatenRedQueue ),
                          copyArray( chessData.eatenPriorityQueue ) );

}

// 取得當前棋盤資料
function getNowChessData()
{
    return new ChessData( gChesses, gChessStates, gEatenBlockQueue, gEatenRedQueue, gEatenPriorityQueue );
}

// 取得複製後的資料
function getChessData( chesses, chessStates, gEatenBlockQueue, gEatenRedQueue, gEatenPriorityQueue )
{
    return new ChessData( copyArray( chesses ),
                          copyArray( chessStates ),
                          copyArray( gEatenBlockQueue ),
                          copyArray( gEatenRedQueue ),
                          copyArray( gEatenPriorityQueue ) );
}

// 複製陣列資料
function copyArray( array )
{
    var newArray = new Array( array.length );

    for ( var i = 0; i < array.length; i ++ )
    {
        newArray[i] = array[i];
    }

    return newArray;
}



// 將array o隨機排列
function shuffle( o )  //v1.0
{
    for ( var j, x, i = o.length; i; j = parseInt( Math.random() * i ), x = o[--i], o[i] = o[j], o[j] = x )
    {
        ;
    }

    return o;
};



// get a random number ( 0 ~ range ) .
function getRandom( range )
{
    return parseInt( Math.random() * range );
}

// 取得上一次的高亮位置
function getgOldHighlightIndex()
{
    return gOldHighlightIndex;
}

// 紀錄上一次的高亮位置
function setgOldHighlightIndex( index )
{
    gOldHighlightIndex = index;
}

// 取得上一次的點擊位置
function getgOldClickIndex()
{
    return gOldClickIndex;
}

// 紀錄上一次的點擊位置
function setgOldClickIndex( index )
{
    gOldClickIndex = index;
}

// 取得隨機顏色
function getRandomColor()
{
    var r = parseInt( Math.random() * 255 );
    var g = parseInt( Math.random() * 255 );
    var b = parseInt( Math.random() * 255 );

    return "#" + r.toString( 16 ) + g.toString( 16 ) + b.toString( 16 );
}

// 將被吃queue清空
function cleanArray( queue, initValue )
{
    for ( var i = 0; i < queue.length; i ++ )
    {
        queue[i] = initValue;
    }

}






// 棋子初始化
function initialChess()
{
    for ( var i = 0; i < INDEX_LENGTH; i ++ )
    {
        gChessStates[i] = CLOSE;
    }
}

// 印出遊戲訊息
function printGame( message )
{
    var playerString = "";

    if ( getNowPlayer() == BLACK )
    {
        playerString = "黑方";
    }
    else
    {
        playerString = "紅方";
    }

    if ( !ON_DEVICE || DEBUG_MODE )
    {
        //gameMessage.innerHTML = message + "&nbsp;&nbsp;&nbsp;玩家: " + playerString;
        
        //log( "玩家: " + playerString );
    }
}

// clear debug message .
function clearDebug()
{
    //debugMessage.innerHTML = "";
}

// 印出除錯訊息
function printDebug( message )
{
    if ( DEBUG_MODE )
    {
        //debugMessage.innerHTML += message;
        log( message );
    }
}

function swap ( a, b )
{
    var temp = a;
    a = b;
    b = temp;
}

// 長寬調換
function swapSize( page )
{
    // 目前配置與裝置長寬不協調，才需要長寬調換
    if ( !ON_DEVICE || // no need to swap height/width if it is not on device .
         ( document.body.offsetHeight > document.body.offsetWidth && height < width ) ||
         ( document.body.offsetHeight < document.body.offsetWidth && height > width ) )
    {
        setSize( height, width, page );
    }
    else
    {
        setSize( width, height, page );
    }
}


// 設置目前的顏色選項
function setNowColorOption( option )
{
    nowColorOption = option;
}

// 取得目前的顏色選項
function getNowColorOption()
{
    return nowColorOption;
}

// 將傳入顏色選項colorOption設為傳入顏色color
function setColor( colorOption, color )
{
    if ( colorOption == BACK_COLOR )
    {
        backColor = color;
        setItem( "backColor", color );
    }
    else if ( colorOption == FRONT_COLOR )
    {
        frontColor = color;
        setItem( "frontColor", color );
    }
    else if ( colorOption == CHESS_BACK_COLOR )
    {
        backChessColor = color;
        setItem( "backChessColor", color );
    }
    else if ( colorOption == CHESS_FRONT_COLOR )
    {
        frontChessColor = color;
        setItem( "frontChessColor", color );
    }
    else if ( colorOption == FRAME_COLOR )
    {
        highlightColor = color;
        setItem( "highlightColor", color );
    }
    else if ( colorOption == RED_COLOR )
    {
        chessRedColor = color;
        setItem( "chessRedColor", color );
    }
    else if ( colorOption == BLACK_COLOR )
    {
        chessBlackColor = color;
        setItem( "chessBlackColor", color );
    }
    
    defaultTheme = CUSTOM_THEME_LOGO;
    setItem( "defaultTheme", defaultTheme );
}

// 設置目前page
function setNowPage( page )
{
    nowPage = page;
}

// 取得目前page
function getNowPage()
{
    return nowPage;
}


// 目前是否在開始頁面
function isStartPageNow()
{
    if ( getNowPage() == START_PAGE )
    {
        return true;
    }
    else
    {
        return false;
    }
}

// 檢測目前page是否屬於game page
function isGamePage( page )
{
    if ( page <= TWO_PLAYER_PAGE )
    {
        return true;
    }
    else
    {
        return false;
    }
}

// 改變其他選項的設定
function changeOptionOther( index )
{
    var logo = OPTION_OTHER_LOGOS[index];

    if ( index == OPTION_ANIMATION )
    {
        logo = logo == NO_LOGO ? YES_LOGO : NO_LOGO;

        enableAnimation = logo;
        setItem( "enableAnimation", enableAnimation );
    }
    else if ( index == OPTION_THEME )
    {
        logo = logo == SYSTEM_THEME_LOGO ? CUSTOM_THEME_LOGO : SYSTEM_THEME_LOGO;
        defaultTheme = logo;
        setItem( "defaultTheme", defaultTheme );
    }
    else if ( index == OPTION_CHESS_STYLE )
    {
        if ( logo == NORMAL_LOGO )
        {
            logo = SHADOW_LOGO;
        }
        else if ( logo == SHADOW_LOGO )
        {
            logo = HALO_LOGO;
        }
        else
        {
            logo = NORMAL_LOGO;
        }

        nowChessBlockStyle = logo;

        setItem( "nowChessBlockStyle", logo );

    }
    else if ( index == OPTION_BLOCK_STYLE )
    {
        if ( logo == NORMAL_LOGO )
        {
            logo = SHADOW_LOGO;
        }
        else if ( logo == SHADOW_LOGO )
        {
            logo = HALO_LOGO;
        }
        else
        {
            logo = NORMAL_LOGO;
        }

        nowOtherBlockStyle = logo;
        setItem( "nowOtherBlockStyle", logo );
    }
    /*
    else if ( index == OPTION_CHESS_DISPLAY )

    {
        logo = logo == WORD_LOGO ? PIC_LOGO : WORD_LOGO;

        chessDisplay = logo;
        setItem( "chessDisplay", chessDisplay );
    }
    */
    else if ( index == OPTION_ANGLE )
    {
        logo = logo == ANGLE_FIXED_LOGO ? ANGLE_SWITCH_LOGO : ANGLE_FIXED_LOGO;

        enableAngleSwitch = logo;
        setItem( "enableAngleSwitch", enableAngleSwitch );
    }
    else if ( index == OPTION_GAME_AUDIO )
    {
        logo = logo == NO_LOGO ? YES_LOGO : NO_LOGO;

        enableAudio = logo;
        setItem( "enableAudio", enableAudio );
    }
    else if ( index == OPTION_ACHIEVEMENT )
    {
        cleanGameLog();

        //enableAchievement = true;
    }
    else if ( index == GO_BACK )
    {

    }

    OPTION_OTHER_LOGOS[index] = logo;

}

// 清除遊戲記錄
function cleanGameLog()
{
    gLowGameCount = gMedGameCount = 0;
    gLowGameLossCount = gLowGameWinCount = 0;
    gMedGameLossCount = gMedGameWinCount = 0;

    setItem( "gLowGameCount", gLowGameCount );
    setItem( "gLowGameWinCount", gLowGameWinCount );
    setItem( "gLowGameLossCount", gLowGameLossCount );
    setItem( "gMedGameCount", gMedGameCount );
    setItem( "gMedGameWinCount", gMedGameWinCount );
    setItem( "gMedGameLossCount", gMedGameLossCount );
}

// 切換視角(0度 <-> 180度)
function switchAngle()
{
    rotateAngle = ( rotateAngle == 0 ) ? Math.PI : 0;
}

// 設置跟尺寸相關的基本參數
function setSize( w, h, page )
{
    width = w;
    height = h;
    
    // set the init value of width & height .
    if ( gInitWidth == null && gInitHeight == null )
    {
        gInitWidth = width;
        gInitHeight = height;
    }

    //printDebug( " ->" + page + " w: " + width + "  h: " + height + "] " );

    var distanceOffset = 0; // 棋子間的間隔

    var shorter = c.width = document.body.offsetWidth; // 較短的邊
    var longer = c.height = document.body.offsetHeight;

    if ( shorter > longer )
    {
        var temp = shorter;
        shorter = longer;
        longer = temp;
    }

    if ( width < height )
    {

        if ( ON_DEVICE )
        {
            chessEatenSize = ( shorter - width ) / 2;

            // 防止機身矮胖而導致棋子過大的情形
            // (理論上要除以16，但10卻是剛好放滿，很奇怪)
            var maxChessEatenSize = longer / 10;
            
            if ( chessEatenSize > maxChessEatenSize )
            {
                chessEatenSize = maxChessEatenSize;
            }

        }
        else
        {
            chessEatenSize = 40;
        }

        if ( isGamePage( page ) )
        {
            widthCount = 4;
            heightCount = 8;
        }
        else if ( getNowPage() == COLOR_PAGE )
        {
            widthCount = COLOR_WIDTH;
            heightCount = COLOR_HEIGHT;

            height = width * heightCount / widthCount;
        }
        else if ( getNowPage() == RULE_PAGE )
        {
            widthCount = RULE_WIDTH;
            heightCount = RULE_HEIGHT;

            //height = width * widthCount / heightCount;
        }
        else if ( getNowPage() == ABOUT_PAGE )
        {
            widthCount = ABOUT_WIDTH;
            heightCount = ABOUT_HEIGHT;
        }
        else if ( getNowPage() == LOG_PAGE )
        {
            widthCount = LOG_WIDTH;
            heightCount = LOG_HEIGHT;
        }
        else if ( getNowPage() == OPTION_PAGE )
        {
            widthCount = OPTION_WIDTH;
            heightCount = OPTION_HEIGHT;
        }
        else if ( getNowPage() == GAME_OVER_DIALOG_PAGE || getNowPage() == GAME_START_DIALOG_PAGE )
        {
            widthCount = DIALOG_WIDTH;
            heightCount = DIALOG_HEIGHT;
        }
        else if ( getNowPage() == GAME_OVER_PAGE )
        {
            widthCount = GAME_OVER_WIDTH;
            heightCount = GAME_OVER_HEIGHT;
        }
        else
        {
            widthCount = 2;
            heightCount = 4;
        }

        c.width = width + chessEatenSize * 2;
        c.height = height;

        highlightOffset = width / 100; // 選定的邊框寬度
        chessSizeOffset = width / 50; // 棋子字體大小
    }
    else
    {
        if ( ON_DEVICE )
        {
            chessEatenSize = ( shorter - height ) / 2;
            
            // 防止機身矮胖而導致棋子過大的情形
            // (理論上要除以16，但10卻是剛好放滿，很奇怪)
            var maxChessEatenSize = longer / 10;
            
            if ( chessEatenSize > maxChessEatenSize )
            {
                chessEatenSize = maxChessEatenSize;
            }
            
            if ( chessEatenSize * 2 + height > c.height )
            {
            	//width = height * 8 / 5;
            	//height = width / 2;
            }
        }
        else
        {
            chessEatenSize = 40;
        }

        if ( isGamePage( page ) )
        {
            widthCount = 8;
            heightCount = 4;
        }
        else if ( getNowPage() == COLOR_PAGE )
        {
            widthCount = COLOR_HEIGHT;
            heightCount = COLOR_WIDTH;
        }
        else if ( getNowPage() == RULE_PAGE )
        {
            widthCount = RULE_HEIGHT;
            heightCount = RULE_WIDTH;

            width = height * widthCount / heightCount;
        }
        else if ( getNowPage() == ABOUT_PAGE )
        {
            widthCount = ABOUT_HEIGHT;
            heightCount = ABOUT_WIDTH;

            width = height * widthCount / heightCount;
        }
        else if ( getNowPage() == LOG_PAGE )
        {
            widthCount = LOG_HEIGHT;
            heightCount = LOG_WIDTH;

            width = height * widthCount / heightCount;
        }
        else if ( getNowPage() == OPTION_PAGE )
        {
            widthCount = OPTION_HEIGHT;
            heightCount = OPTION_WIDTH;

            width = height * widthCount / heightCount;
        }
        else if ( getNowPage() == GAME_OVER_DIALOG_PAGE ||
                  getNowPage() == GAME_START_DIALOG_PAGE )
        {
            widthCount = DIALOG_HEIGHT;
            heightCount = DIALOG_WIDTH;

            width = height * widthCount / heightCount;
        }
        else if ( getNowPage() == GAME_OVER_PAGE )
        {
            widthCount = GAME_OVER_HEIGHT;
            heightCount = GAME_OVER_WIDTH;

            width = height * widthCount / heightCount;
        }
        else
        {
            widthCount = 4;
            heightCount = 2;
        }

        c.width = width;
        c.height = height + chessEatenSize * 2;

        highlightOffset = height / 100; // 選定的邊框寬度
        chessSizeOffset = height / 50; // 棋子字體大小
    }

    chessWidth = width / widthCount; // 棋子高度
    chessWidth -= chessWidth / 7
	chessHeight = chessWidth;
    //chessHeight = height / heightCount; // 棋子寬度

/*
    // 棋盤和選色畫面的間隔比例較大, 其餘較小
    if ( widthCount * heightCount < INDEX_LENGTH )
    {
        chessWidth -= chessWidth / 7;
        chessHeight -= chessWidth / 7;
    }
    else
    {
        chessWidth -= chessWidth / 7;
        chessHeight -= chessWidth / 7;
    }
*/

    if ( chessWidth < chessHeight )
    {
        chessFontBaseSize = chessWidth;
    }
    else
    {
        chessFontBaseSize = chessHeight;
    }


}

// 取得目前的方向
function getOrientation()
{
    if ( width < height )
    {
        return PORTRAIT; // 直立
    }
    else
    {
        return LANDSCAPE; // 橫放
    }
}

function orientationChange( e )
{

    if ( window.orientation % 90 == 0 )
    {
        if ( gDeviceName == IOS &&
             gInitWidth != null && gInitHeight != null )
        {
            width = gInitWidth;
            height = gInitHeight;
        }
        
        swapSize( getNowPage() ); // 長寬調換
        

        //redrawAll(); // 重繪
        showPage( getNowPage() );
    }


}



// 進行go back動作
function goBack()
{
    if ( isStartPageNow() )
    {
        navigator.app.exitApp(); // 以InvokeScript執行此句會造成例外
    }
    else
    {
        showPage( START_PAGE );
    }

}


// 播放click.wav
function playClickAudio()
{
	document.getElementById( "clickAudio" ).play(); // 播放clickAudio物件

}

// 播放逼逼聲
function playBeep()
{
    navigator.notification.beep( 1 );
}

// Play audio
// ex. playAudio( "app/www/hammer.wav" );
//
function playAudio( url )
{
    
	// Play the audio file at url
	var my_media = new Media( url,
                          // success callback
                          function()
	{
    	console.log( "playAudio():Audio Success" );
	},
	// error callback
	function( err )
	{
    	console.log( "playAudio():Audio Error: " + err );
	} );

	// Play audio
	my_media.play();

	//my_media.stop();
	//my_media.release();
}

// 從背景執行中回復
function onResume()
{
    // Handle the resume event
    showPage( getNowPage() );
}

// 十六進位轉十進位
function h2d( h )
{
    return parseInt( h, 16 );

}

// 十進位轉16進位
function d2h( d )
{
    return d.toString( 16 );
}


// 取得更亮的顏色
function getLighterColor( color )
{
    
    var r = color.substring( 1, 3 );
    var g = color.substring( 3, 5 );
    var b = color.substring( 5, 7 );

    var offset = 48;

    if ( h2d( r ) + offset > 0 && h2d( r ) + offset < 255 )
    {
        r = d2h( h2d( r ) + offset );
    }

    if ( h2d( g ) + offset > 0 && h2d( g ) + offset < 255 )
    {
        g = d2h( h2d( g ) + offset );
    }

    if ( h2d( b ) + offset > 0 && h2d( b ) + offset < 255 )
    {
        b = d2h( h2d( b ) + offset );
    }

    return "#" + r + g + b;
    
    //return "green";
}

// 取得更亮的顏色
function getDarkerColor( color )
{
    var r = color.substring( 1, 3 );
    var g = color.substring( 3, 5 );
    var b = color.substring( 5, 7 );
    
    var offset = -48;

    if ( h2d( r ) + offset > 0 && h2d( r ) + offset < 255 )
    {
        r = d2h( h2d( r ) + offset );
    }

    if ( h2d( g ) + offset > 0 && h2d( g ) + offset < 255 )
    {
        g = d2h( h2d( g ) + offset );
    }

    if ( h2d( b ) + offset > 0 && h2d( b ) + offset < 255 )
    {
        b = d2h( h2d( b ) + offset );
    }

    return "#" + r + g + b;
}


// 將所有參數設定初始值
function initAllItem()
{
    if ( RESET )
    {
        window.localStorage.clear();
    }
    
    var c = document.getElementById( 'c' );  //canvas itself
    ctx = c.getContext( '2d' );  // 繪圖
    
    gInitGameState = true; // 是不是剛開始遊戲
    
    backChessColor = '#204500'; // 棋子背景顏色
	frontChessColor = getLighterColor( '#204500' ); // 棋子前景顏色
	chessBlackColor = '#330030'; // 黑方棋子顏色
	chessRedColor = '#900000'; // 紅方棋子顏色
	backColor = "black"; // 背景顏色
	frontColor = "white"; // 前景顏色
	highlightColor = '#E5CC19'; // 選定後的顏色
	eatenChessColor = "white"; // 被吃的棋子顏色

	if ( gDeviceName != WINDOWS_PHONE )
	{
		systemBackChessColor = backChessColor; // system foreground color now .
		systemBackColor = backColor; // system background color now .
	}

	nowChessBlockStyle = 0; // 目前棋子色塊樣式
	nowOtherBlockStyle = 0; // 目前其他色塊樣式

	enableAnimation = YES_LOGO; // 啟用動畫
	enableAudio = NO_LOGO; // 預設不啟用音效
	enableAchievement = YES_LOGO; // 啟用成就系統
	chessDisplay = WORD_LOGO; // 棋子顯示的圖樣
	defaultTheme = SYSTEM_THEME_LOGO; // 預設用系統顏色
	enableAngleSwitch = ANGLE_FIXED_LOGO; // 預設固定視角

    // 初次使用，還沒設定過
    if ( getItemCount() < 2 )
    {
        setItem( "systemBackChessColor", systemBackChessColor );
        setItem( "systemBackColor", systemBackColor );
        setItem( "backChessColor", backChessColor );
        setItem( "frontChessColor", frontChessColor );
        setItem( "chessBlackColor", chessBlackColor );
        setItem( "chessRedColor", chessRedColor );
        setItem( "backColor", backColor );
        setItem( "frontColor", frontColor );
        setItem( "highlightColor", highlightColor );
        setItem( "nowChessBlockStyle", nowChessBlockStyle );
        setItem( "nowOtherBlockStyle", nowOtherBlockStyle );
        setItem( "enableAnimation", enableAnimation );
        setItem( "enableAudio", enableAudio );
        setItem( "enableAchievement", enableAchievement );
        setItem( "chessDisplay", chessDisplay );
        setItem( "defaultTheme", defaultTheme );
        setItem( "enableAngleSwitch", enableAngleSwitch );

        // 對戰紀錄初始值
        setItem( "gLowGameCount", 0 );
        setItem( "gLowGameWinCount", 0 );
        setItem( "gLowGameLossCount", 0 );
        setItem( "gMedGameCount", 0 );
        setItem( "gMedGameWinCount", 0 );
        setItem( "gMedGameLossCount", 0 );

    }

    // 取得對戰紀錄
    gLowGameCount = getItem( "gLowGameCount" );
    gLowGameWinCount = getItem( "gLowGameWinCount" );
    gLowGameLossCount = getItem( "gLowGameLossCount" );
    gMedGameCount = getItem( "gMedGameCount" );
    gMedGameWinCount = getItem( "gMedGameWinCount" );
    gMedGameLossCount = getItem( "gMedGameLossCount" );

    frontChessColor = getItem( "frontChessColor" ); // 棋子前景顏色
    chessBlackColor = getItem( "chessBlackColor" ); // 黑方棋子顏色
    chessRedColor = getItem( "chessRedColor" ); // 紅方棋子顏色

    gAIroundColor = getLighterColor( frontChessColor ); // AI邊框顏色


    frontColor = getItem( "frontColor" ); // 前景顏色
    highlightColor = getItem( "highlightColor" ); // 選定後的顏色
    eatenChessColor = getItem( "eatenChessColor" ); // 被吃的棋子顏色
    enableAnimation = getItem( "enableAnimation" );
    enableAudio = getItem( "enableAudio" );
    enableAchievement =	getItem( "enableAchievement" );
    chessDisplay = getItem( "chessDisplay" );



    nowChessBlockStyle = getItem( "nowChessBlockStyle" ); // 目前棋子色塊樣式
    nowOtherBlockStyle = getItem( "nowOtherBlockStyle" ); // 目前其他色塊樣式
    defaultTheme = getItem( "defaultTheme" ); // 目前佈景設定
    enableAngleSwitch = getItem( "enableAngleSwitch" );

    resetThemeColor(); // 設置目前佈景設定的顏色

    OPTION_OTHER_LOGOS[OPTION_THEME] = defaultTheme;
    OPTION_OTHER_LOGOS[OPTION_CHESS_STYLE] = nowChessBlockStyle;
    OPTION_OTHER_LOGOS[OPTION_BLOCK_STYLE] = nowOtherBlockStyle;

    OPTION_OTHER_LOGOS[OPTION_GAME_AUDIO] = enableAudio;
    OPTION_OTHER_LOGOS[OPTION_ANGLE] = enableAngleSwitch;
    OPTION_OTHER_LOGOS[OPTION_ACHIEVEMENT] = enableAchievement;
    OPTION_OTHER_LOGOS[OPTION_ANIMATION] = enableAnimation;

    gIndexLastSelected = -1; // 最後選定的位置 (必須是己方翻開的棋子)
    //highlightIndex = -1; // 選定的位置

    gGameWinner = -1; // 遊戲獲勝玩家


    nowColorOption = -1; // 目前是進入到哪個顏色選項
}


// 儲存參數
function setItem( itemName, itemValue )
{
    window.localStorage.setItem( itemName, itemValue );
    //var testA = window.localStorage.getItem( itemValue );

}

// 取得參數
function getItem( itemName )
{
    return window.localStorage.getItem( itemName );
}

// 取得目前參數設定數
function getItemCount()
{
    return window.localStorage.length;
}

// 設置CSS背景顏色
function setBackgroundColor()
{
    document.body.style.backgroundColor = backColor;
}

// 設置CSS背景尺寸
function setBackgroundSize()
{
    if ( document.body.offsetHeight > document.body.offsetWidth )
    {
        document.body.style.height = "110%";
    }
    else
    {
        document.body.style.height = "90%";
        document.body.style.width = "90%";
    }

}


// 設置預設語言
function setDefaultLanguage( language )
{
    if ( ON_DEVICE ) // 實機
    {
        if ( language.toUpperCase().match( "TW" ) ||
            language.toUpperCase().match( "HK" ) ) 
        {
            gLanguageIndex = ZH; // 繁體中文
        }
        else if ( language.toUpperCase().match( "CN" ) )
        {
            gLanguageIndex = CN; // 簡體中文
        }
        else if ( language.toUpperCase().match( "EN" ) )
        {
            gLanguageIndex = EN; // 英文
        }
        else if ( language.toUpperCase().match( "JA" ) ||
                  language.toUpperCase().match( "JP" ) )
        {
            gLanguageIndex = JA; // 日文
        }
        else if ( language.toUpperCase().match( "KO" ) )
        {
            gLanguageIndex = KO; // 韓文
        }
        else
        {
            gLanguageIndex = EN; // 實機的預設語言
        }
    }
    else // 非實機
    {
        gLanguageIndex = TW; // 非實機的預設語言
    }
}

// 設置系統顏色
function setSystemColor( accentBrushColor, backgroundBrushColor )
{
    if ( ON_DEVICE ) // 實機執行
    {
        systemBackChessColor = accentBrushColor;
        systemBackColor = backgroundBrushColor;
    }
    else // 非實機測試
    {
        systemBackChessColor = backChessColor;
        systemBackColor = backColor;
    }
    
}

// 設置目前佈景設定的顏色
function resetThemeColor()
{
    if ( defaultTheme == CUSTOM_THEME_LOGO || !ON_DEVICE )
    {
        backChessColor = getItem( "backChessColor" ); // 棋子背景顏色
        backColor = getItem( "backColor" ); // 背景顏色
    }
    else
    {
        setItem( "systemBackChessColor", systemBackChessColor );
        setItem( "systemBackColor", systemBackColor );

        backChessColor = getItem( "systemBackChessColor" ); // 棋子背景顏色
        backColor = getItem( "systemBackColor" ); // 背景顏色
        frontChessColor = getLighterColor( backChessColor );
    }

}


// 取得兩者差額
function getGap( a, b )
{
    return ( a > b ) ? ( a - b ) : ( b - a );
}

// 取得兩個位置的回合步數
function getIndexDistance( indexA, indexB )
{
    if ( ( indexA < 0 && indexA >= INDEX_LENGTH ) ||
         ( indexA < 0 && indexA >= INDEX_LENGTH ) )
    {
        return NOT_FOUND;
    }

    var posA = getPos( indexA );
    var posB = getPos( indexB );

    return getGap( posA[0], posB[0] ) + getGap( posA[1], posB[1] );
}

// 取得indexA走到indexB的第一步方向
function getIndexDirection( indexA, indexB )
{
    var neighborIndexs = getNeighborIndexs( indexA );
    var bestDistance = INDEX_LENGTH;
    var bestDirection = NOT_FOUND;

    for ( var i = 0; i < 4; i ++ )
    {
        if ( neighborIndexs[i] == NOT_FOUND )
        {
            continue;
        }

        var tempDistance = getIndexDistance( indexB, neighborIndexs[i] );

        if ( ( bestDistance > tempDistance ) ||
             ( bestDistance == tempDistance && !sameXorY( indexB, neighborIndexs[i] ) ) )
        {
            bestDistance = tempDistance;
            bestDirection = i;
        }
    }


    return bestDirection;
}


function sameXorY( indexA, indexB )
{
    if ( ( indexA < 0 && indexA >= INDEX_LENGTH ) ||
         ( indexA < 0 && indexA >= INDEX_LENGTH ) )
    {
        return false;
    }

    var posA = getPos( indexA );
    var posB = getPos( indexB );

    return ( posA[0] == posB[0] || posA[1] == posB[1] );
}


// AI移動資料
function MoveData( priority, price, destIndex, sourceIndex, targetIndex )
{
    this.priority = priority; // 此次移動權值（越小越優先）
    this.price = price; // 吃或被吃的棋子權值（越大越優先）
    this.destIndex = destIndex; // 移動目標位置
    this.sourceIndex = sourceIndex; // 起始位置
    this.targetIndex = targetIndex; // 目標位置
}

function copyMoveData( moveData )
{
    var priority = moveData.priority; // 此次移動權值（越小越優先）
    var price = moveData.price; // 吃或被吃的棋子權值（越大越優先）
    var destIndex = moveData.destIndex; // 移動目標位置
    var sourceIndex = moveData.sourceIndex; // 起始位置
    var targetIndex = moveData.targetIndex; // 目標位置

    return new MoveData( priority, price, destIndex, sourceIndex, targetIndex );
}

function newMoveData( sourceIndex )
{
    var destIndex = NOT_FOUND;
    var targetIndex = NOT_FOUND;
    var priority = INIT_PRIORITY;
    var price = INIT_PRICE;
    return new MoveData( priority, price, destIndex, sourceIndex, targetIndex );
}

function getEmptyMoveData( sourceIndex )
{
    return new MoveData( INIT_PRIORITY, INIT_PRICE, NOT_FOUND, sourceIndex, NOT_FOUND );
}


// 到達位置資料
function ReachData( direction, distance, destIndex, sourceIndex )
{
    this.direction = direction; // 第一步的方向
    this.distance = distance; // 要走幾步才會到目標位置
    this.destIndex = destIndex; // 移動目標位置
    this.sourceIndex = sourceIndex; // 起始位置
}


//
// common functions for AI .
//


// 檢查尚未翻開的棋子是否有chess .
function existCloseChess( chessData, chess )
{
    for ( var i = 0; i < INDEX_LENGTH; i ++ )
    {
        if ( chessData.chessStates[i] == CLOSE )
        {
            if ( chessData.chesses[i] == chess )
            {
                return true;
            }
        }
    }

    return false;
}

// 檢查尚未翻開的camp陣營棋子是否比rank更大的 .
function existCloseBiggerRank( chessData, rank, camp )
{
    for ( var i = 0; i < INDEX_LENGTH; i ++ )
    {
        if ( chessData.chessStates[i] == CLOSE )
        {
            if ( getRank( chessData.chesses[i] ) > rank &&
                 getCamp( chessData.chesses[i] ) == camp )
            {
                return true;
            }
        }
    }

    return false;
}

// 有沒有可能此處翻開的是camp陣營的砲，且可以直接吃我方棋子
function cannonCanEat( chessData, index, camp )
{
    return ( existCloseChess( chessData, index, getChess( RANK_CANNON, camp ) ) &&
             existSimEatChance( chessData, index, getChess( RANK_CANNON, camp ) ) != NOT_FOUND );
}


// 有沒有可能此處翻開的是camp陣營的砲，且可以直接被吃
function cannonCanEaten( chessData, index, camp )
{
    return ( existCloseChess( chessData, index, getChess( RANK_CANNON, camp ) ) &&
             existSimEatenChance( chessData, index, getChess( RANK_CANNON, camp ) ) );
}

// 有沒有可能此處翻開的是camp陣營等於大於馬的棋子，且可以直接吃我方
function evenHorseCanEat( chessData, index, camp )
{
    return ( existCloseBiggerRank( chessData, index, RANK_HORSE, camp ) &&
             existSimEatChance( chessData, index, getChess( RANK_HORSE, camp ) ) != NOT_FOUND );
}


// 檢查 A能否直接吃鄰近的B
function AeatB( aChess, bChess )
{
    var rankA = getRank( aChess );
    var rankB = getRank( bChess );

    if ( rankA == RANK_GENERAL && rankB == RANK_SOLDIER )
    {
        return false;
    }
    else if ( rankA == RANK_CANNON )
    {
        return false;
    }
    else if ( rankA < rankB )
    {
        return false;
    }
    else
    {
        return true;
    }
}

/*
function recordPrice( priceQueue, price )
{
    for ( var i = 0; i < priceQueue.length; i ++ )
    {
        if ( priceQueue[i] == INIT_PRICE )
        {
            priceQueue[i] = price;
            return true;
        }
    }

    return false;
}
*/

//
// prices functions for AI
//
function recordPrice( priceQueue, price, n )
{
    if ( n < priceQueue.length )
    {
        priceQueue[n] = price;

        return true;
    }

    return false;
}

function printPrices( priceQueue )
{
    for ( var i = 0; i < priceQueue.length; i ++ )
    {
        if ( priceQueue[i] != INIT_PRICE )
        {
            printDebug( "" + priceQueue[i] + "," );
        }
    }
}

// 取得初始化的步
function getInitMoves()
{
    var moves = new Array( 2 );

    for ( var i = 0; i < moves.length; i ++ )
    {
        moves[i] = NOT_FOUND;
    }

    return moves;
}

// 取得初始化權值
function getInitPrices()
{
    var prices = new Array( PRICES_LENGTH );

    for ( var i = 0; i < prices.length; i ++ )
    {
        prices[i] = INIT_PRICE;
    }

    return prices;
}

// 取得最大權值
function getBiggestPrices()
{
    var prices = new Array( PRICES_LENGTH );

    for ( var i = 0; i < prices.length; i ++ )
    {
        prices[i] = PRICE_GENERAL;
    }

    return prices;
}

// 複製步伐
function copyMoves( moves )
{
    var tempMoves = new Array( 2 );

    for ( var i = 0; i < tempMoves.length; i ++ )
    {
        tempMoves[i] = moves[i];
    }

    return tempMoves;
}

// 複製prices
function copyPrices( prices )
{
    var tempPrices = new Array( PRICES_LENGTH );

    for ( var i = 0; i < tempPrices.length; i ++ )
    {
        tempPrices[i] = prices[i];
    }

    return tempPrices;
}

// 檢查兩種prices是否相同
function samePrices( pircesA, pricesB )
{
    if ( pricesA.length != pricesB.length )
    {
        return false;
    }
    else
    {
        for ( var i = 0; i < pricesA.length; i ++ )
        {
            if ( pricesA[i] != pricesB[i] )
            {
                return false;
            }
        }

        return true;  
    }
}

// 比較prices的優劣
function comparePrices( pricesA, pricesB )
{
    var sortPricesA = copyPrices( pricesA );
    var sortPricesB = copyPrices( pricesB );
    sortPricesA.sort();
    sortPricesB.sort();

    // first, we compare the sum of price
    for ( var i = sortPricesA.length - 1; i >= 0; i -- )
    {
        //printDebug( "." + pricesA[i] + ":" + pricesB[i] + "--");
        if ( sortPricesA[i] > sortPricesB[i] )
        {
            return A_IS_BETTER;
        }
        else if ( sortPricesA[i] < sortPricesB[i] )
        {
            return B_IS_BETTER;
        }
    }

    var validPricesA = getInitPrices();
    var validPricesB = getInitPrices();

    var j = 0;

    for ( var i = 0; i < pricesA; i ++ )
    {
        if ( pricesA[i] != INIT_PRICE )
        {
            validPricesA[j] = pricesA[i];
            j++;
        }
    }

    j = 0;

    for ( var i = 0; i < pricesB; i ++ )
    {
        if ( pricesB[i] != INIT_PRICE )
        {
            validPricesB[j] = pricesB[i];
            j++;
        }
    }


    // second, we compare the order of price
    for ( var i = 0; i < validPricesA.length ; i ++ )
    {
        if ( validPricesA[i] > validPricesB[i] )
        {
            return A_IS_BETTER;
        }
        else if ( validPricesA[i] < validPricesB[i] )
        {
            return B_IS_BETTER;
        }

    }


    // third, we compare the real order of the price
    for ( var j = pricesA.length-1; j >= 0 && sortPricesA[j] != INIT_PRICE; j -- )
    {
        var tempPrice = sortPricesA[j];

        for ( var i = 0; i < pricesA.length; i ++ )
        {
            if ( pricesA[i] == tempPrice &&
                 pricesB[i] != tempPrice )
            {
                return A_IS_BETTER;
            }
            else if ( pricesB[i] == tempPrice &&
                 pricesA[i] != tempPrice )
            {
                return B_IS_BETTER;
            }
        }
    }

    return A_B_ARE_SAME;
}




//
// functions about trace for AI .
//

// 檢查此 index 是否可以行走
function allowIndex( index )
{
    return ( getNoTraceIndex() != index );
}

// 取得禁止走的位置
function getNoTraceIndex()
{
    return gNoTraceIndex;
}

// 把之前禁止走的位置紀錄清掉
function clearNoTraceIndex()
{
    gNoTraceIndex = NOT_FOUND;
}

// 設置禁止走的位置
function setNoTraceIndex( index )
{
    gNoTraceIndex = index;
}


// 取得目前追殺行為持續的回合數
function getTraceTimes()
{
    return gNowTraceTimes;
}

// 被追殺者相同
function sameTraced( traced )
{
    return ( traced == gNowTraced );
}

// 檢查是否跟之前的追殺相同
function sameTrace( tracer, traced )
{
    printDebug( "" + tracer + gNowTracer + traced + gNowTraced );
    return ( tracer == gNowTracer && traced == gNowTraced );
}

// 設置目前追殺行為的參數
function setTrace( tracer, traced )
{
    if ( traced == gNowTraced && tracer == gNowTracer )
    {
        gNowTraceTimes ++;
    }
    else
    {
        gNowTracer = tracer;
        gNowTraced = traced;

        gNowTraceTimes = 1;
    }
}

// 檢查chessData是否已經沒有蓋住的棋子了
function noCloseChessNow( chessData )
{
    for ( var i = 0; i < INDEX_LENGTH; i ++ )
    {
        if ( chessData.chessStates[i] == CLOSE )
        {
            return false;
        }
    }

    return true;
}


// print the chessData on demo . ( for debug ) .
function printDemoChessData()
{
    var str = "";

    str += "<br><hr><br>";

    str += "gChesses = new Array( \"";

    for ( var i = 0; i < INDEX_LENGTH; i ++ )
    {
        str += gChesses[i];

        str += ( i != INDEX_LENGTH - 1 ) ? "\", \"" : "\" );";

    }

    str += "<br>";

    str += "gChessStates = new Array( ";

    for ( var i = 0; i < INDEX_LENGTH; i ++ )
    {
        str += gChessStates[i];

        str += ( i != INDEX_LENGTH - 1 ) ? ", " : " );";

    }

    str += "<br><hr><br>";

    printGame( str );
}

// 遊戲結束後設置遊戲紀錄
function setGameLog( page )
{
    if ( page == LOW_GAME_PAGE )
    {
        if ( gPlayerCamp == gGameWinner )
        {
            gLowGameWinCount ++;
        }
        else
        {
            gLowGameLossCount++;
        }

    }
    else if ( page == MED_GAME_PAGE )
    {
        if ( gPlayerCamp == gGameWinner )
        {
            gMedGameWinCount ++;
        }
        else
        {
            gMedGameLossCount++;
        }

    }

}


// 檢查str是否為英文字母或數字
function isWordOrNumber( str )
{
    if ( str.match( /\d/g ) || str.match( /\w/g ) )
    {
        return true;
    }
    else
    {
        return false;
    }
}

function getChessByPrice( iPrice, iPlayer )
{
    var iBegin = iPlayer == BLACK ? 0 : ( aiPrices.length + 1 ) / 2;

    for ( var i = iBegin; i < gChessPrices.length; i ++ )
    {
        if ( gChessPrices[i] == iPrice )
        {
            return gChessPatterns[i];
        }
    }
    
    return NOT_FOUND;
}

function getChessesByPrices( aiPrices, iPlayer )
{
    var sText = "";

    for ( var i = 0; i < aiPrices.length; i ++ )
    {
        if ( aiPrices[i] != NOT_FOUND )
        {
            sText += "," + i + ":" + getChessByPrice( aiPrices[i], iPlayer );
        }
    }
    
    return sText == "" ? null : sText;
}
