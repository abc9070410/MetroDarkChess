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

// 停止動畫
function stopAnimation()
{
    for ( var i = 0; i < 500; i ++ )
    {
        clearTimeout( timers[i] );
    }
}

// 繪製遊戲結束畫面II
function drawGameOverII( index )
{
    var pos = getPos( index );
    var posX = pos[0];
    var posY = pos[1];

    var phyX = posXToPhyX( posX );
    var phyY = posYToPhyY( posY );

    var x = phyX + chessWidth / 2;
    var y = phyY + chessWidth / 2;
    var fontSize = chessWidth * 0.9;
    var fontColor = backChessColor;

    var speed = 5; // 預設速度
    var timSlot = chessWidth * speed / 200;
    var oneTime = chessWidth * speed; // 一次跑馬燈的時間
    var turnTime = oneTime * 4; // 刷下去又上來的總共時間

    var startTime = 0; // 開始的時間
    var endTime = 0; // 收尾的時間
    var logoIndex = 0;
    var j = 0;
    var t = 0;

    var page = GAME_OVER_PAGE;

    if ( gLanguageIndex == EN || gLanguageIndex == KO )
    {
        fontSize *= 0.5;
    }

    for ( t = 0; t < 2; t ++ )
    {
        if ( index == 0 )
        {
            if ( gGameWinner == BLACK )
            {
                logoIndex = 0;
            }
            else
            {
                logoIndex = 1;
            }
		}
		else
        {
            logoIndex = 2;
		}
	}
	
	var text = GAME_OVER_NAMES[logoIndex][gLanguageIndex];
	//alert( text );
	//drawCenterText( text, fontSize, fontColor, x, y, needShadow );
	drawCenterText( text, fontSize, fontColor, x, y, true );
	
	var offset = 10;
	var speed = 200;
	
	for ( var i = 0; i < 100; i ++ )
	{
		var a = ( getRandom( 1 ) > 0 ) ? getRandom( offset ) : -getRandom( offset );
		var b = ( getRandom( 1 ) > 0 ) ? getRandom( offset ) : -getRandom( offset );
		var c = ( getRandom( 1 ) > 0 ) ? getRandom( offset ) : -getRandom( offset );
		var d = ( getRandom( 1 ) > 0 ) ? getRandom( offset ) : -getRandom( offset );
		timers[j++] = setTimeout( moveMarginAnimation( a, b, c, d, page ), speed * i );
	}
}

// 繪製遊戲結束畫面
function drawGameOver( index )
{
    var pos = getPos( index );
    var posX = pos[0];
    var posY = pos[1];

    var phyX = posXToPhyX( posX );
    var phyY = posYToPhyY( posY );

    var x = phyX + chessWidth / 2;
    var y = phyY + chessWidth / 2;
    var fontSize = chessWidth * 0.9;
    var fontColor = backChessColor;

    var speed = 5; // 預設速度
    var timSlot = chessWidth * speed / 200;
    var oneTime = chessWidth * speed; // 一次跑馬燈的時間
    var turnTime = oneTime * 4; // 刷下去又上來的總共時間

    var startTime = 0; // 開始的時間
    var endTime = 0; // 收尾的時間
    var logoIndex = 0;
    var j = 0;
    var t = 0;

    var page = GAME_OVER_PAGE;

    if ( gLanguageIndex == EN || gLanguageIndex == KO )
    {
        fontSize *= 0.5;
    }

    for ( t = 0; t < 2; t ++ )
    {
        if ( index == 0 )
        {
            if ( gGameWinner == BLACK )
            {
                logoIndex = 0;
            }
            else
            {
                logoIndex = 1;
            }

            startTime = 0 + turnTime * t;
            endTime = oneTime * 3 + turnTime * t;
        }
        else
        {
            logoIndex = 2;
            startTime = oneTime + turnTime * t;
            endTime = oneTime * 2 + turnTime * t;
        }

        for ( var i = 0; i <= chessWidth; i += timSlot )
        {
            // 先畫出LOGO
            timers[j++] = setTimeout( drawCenterTextAnimation( GAME_OVER_NAMES[logoIndex][gLanguageIndex], fontSize, fontColor, x, y, true, page ), startTime + speed * i );

            // 再塗掉下面
            timers[j++] = setTimeout( clearRectAnimation( phyX, phyY + i, chessWidth, chessWidth - i, page ), startTime + speed * i );

            if ( j == TIMER_MAX_COUNT )
            {
                j = 0; // 重新放
            }
        }

        for ( var i = 0; i <= chessWidth; i += timSlot )
        {
            // 先畫出LOGO
            timers[j++] = setTimeout( drawCenterTextAnimation( GAME_OVER_NAMES[logoIndex][gLanguageIndex], fontSize, fontColor, x, y, true, page ), endTime + speed * i );

            // 再塗掉下面
            timers[j++] = setTimeout( clearRectAnimation( phyX, phyY + chessWidth - i, chessWidth, i, page ), endTime + speed * i );

            if ( j == TIMER_MAX_COUNT )
            {
                j = 0; // 重新放
            }
        }
    }

	setTimeout( drawCenterTextAnimation( GAME_OVER_NAMES[logoIndex][gLanguageIndex], fontSize, fontColor, x, y, true, page ), oneTime * 4 * t + speed );
}


// 繪製選擇進階等級的畫面
function drawGameLevel( index )
{
    setBlockStyle();

    var pos = getPos( index );
    var posX = pos[0];
    var posY = pos[1];


    ctx.fillStyle = backChessColor;

    ctx.beginPath();

    var phyX = posXToPhyX( posX );
    var phyY = posYToPhyY( posY );

    ctx.rect( phyX, phyY, chessWidth, chessHeight );

    ctx.closePath();

    ctx.fill();

    addRoundLine( backChessColor );

    var fontSize = ( chessFontBaseSize - chessSizeOffset * 3 ) / 7;
    var y = phyY + chessFontBaseSize - chessSizeOffset * 2;
    var x = phyX + chessWidth / 2;

    drawCenterText( GAME_LEVEL_NAMES[index][gLanguageIndex], fontSize, frontColor, x, y, false );

    var logo = "█"; // 開始頁面的各功能logo // ☐☑
    var logoColor; // logo顏色

    logo = GAME_LEVEL_LOGOS[index][gLanguageIndex];
    fontSize = chessWidth / 4;

    x = phyX + chessWidth / 2;
    y = phyY + chessWidth / 2;

    drawCenterText( logo, fontSize * 2.5, logoColor, x, y, true );
}


// 繪製主要選項頁面
function drawDialog( page, index )
{
    setBlockStyle();

    var pos = getPos( index );
    var posX = pos[0];
    var posY = pos[1];

    ctx.fillStyle = backChessColor;

    ctx.beginPath();

    var phyX = posXToPhyX( posX );
    var phyY = posYToPhyY( posY );

    ctx.rect( phyX, phyY, chessWidth, chessHeight );

    ctx.closePath();

    ctx.fill();

    addRoundLine( backChessColor );

    var fontSize = chessWidth / 6;
    var y = phyY + chessFontBaseSize - chessSizeOffset * 5;
    var x = phyX + chessWidth / 2;

    var text = "";
    var logo = ""; // 開始頁面的各功能logo //
    var logoColor; // logo顏色
    
    if ( page == GAME_OVER_DIALOG_PAGE )
    {
        text = GAME_OVER_DIALOGS[index][gLanguageIndex];

        if ( index == DIALOG_AGAIN )
        {
            logo = LOGOS[AGAIN_GAME_LOGO][gLanguageIndex]; // *記得要增加在LOGOS
        }
        else if ( index == DIALOG_GO_BACK )
        {
            logo = LOGOS[GO_BACK_LOGO][gLanguageIndex];
        }
    }
    else if ( page == GAME_START_DIALOG_PAGE )
    {
        text = GAME_START_DIALOGS[index][gLanguageIndex];

        if ( index == DIALOG_HUMAN_FIRST )
        {
            logo = LOGOS[FIRST_LOGO][gLanguageIndex];
        }
        else if ( index == DIALOG_AI_FIRST )
        {
            logo = LOGOS[SECOND_LOGO][gLanguageIndex];
        }
    }

    drawCenterText( text, fontSize, frontColor, x, y, false );

    var x = phyX + chessWidth / 2;
    var y = phyY + chessWidth / 2;

    drawCenterText( logo, fontSize * 2, frontColor, x, y, true );
}


// 動畫方式
function moveMarginAnimation( a, b, c, d, page )
{
    return function()
    {
        if ( getNowPage() == page )
        {
            document.body.style.margin = a + "% " + b + "% " + c + "% " + d + "%";
        }
    }
}


// 動畫方式繪製LOGO
function drawCenterTextAnimation( text, fontSize, fontColor, phyX, phyY, needShadow, page )
{
    return function()
    {
        if ( getNowPage() == page )
        {
            drawCenterText( text, fontSize, fontColor, phyX, phyY, needShadow );
        }
    }
}

// 動畫方式清空
function clearRectAnimation( x, y, w, h, page )
{
    return function()
    {
        if ( getNowPage() == page )
        {
            clearRect( x, y, w, h );
        }
    }
}

// 將(x,y)開始清出一個長h寬w的長方形
function clearRect( x, y, w, h )
{

    ctx.fillStyle = backColor;
    ctx.beginPath();
    ctx.rect( x, y, w, h );
    ctx.closePath();
    ctx.fill();
}




function resetContext()
{
    if ( getBlockStyle() != HALO_BLOCK_STYLE )
    {
        ctx.shadowBlur = 0;
        ctx.shadowColor = "black";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.textAlign = 'top';
    }

}

// 畫面全部清空
function clear( w, h )
{

    ctx.fillStyle = backColor;
    ctx.beginPath();
    ctx.rect( 0, 0, w, h );
    ctx.closePath();
    ctx.fill();
}

function clearAll()
{
    clear( c.width, c.height );
}

// 以動畫方式繪製所有方塊
function clearAllAnimation( page )
{
    var speed = 10; // 預設速度

    if ( isGamePage( page ) )
    {
        speed = 10;
    }

    for ( i = 0; i <= c.height; i += c.height / 10 )
    {
        setTimeout( clearAnimation( c.width, i ), speed * ( i ) );
    }
}

function clearAnimation( w, h )
{
    return function()
    {
        clear( w, h );
    }
}

// 物理位置x轉棋盤位置x
function posXToPhyX( posX )
{
    var phyX = ( width / widthCount ) * posX + width / 100;

    if ( getOrientation() == PORTRAIT )
    {
        phyX += chessEatenSize;
    }

    return phyX;
}

// 物理位置y轉棋盤位置y
function posYToPhyY( posY )
{
    var phyY = ( height / heightCount ) * posY + height / 100;

    if ( getOrientation() == LANDSCAPE )
    {
        phyY += chessEatenSize;
    }

    return phyY;
}


// 繪製單個覆蓋的棋子
function drawOneEmptyChess( index )
{
    setBlockStyle();

    var pos = getPos( index );
    var posX = pos[0];
    var posY = pos[1];

    ctx.fillStyle = backColor;

    ctx.beginPath();

    var phyX = posXToPhyX( posX );
    var phyY = posYToPhyY( posY );

    ctx.rect( phyX - highlightOffset / 2, phyY - highlightOffset / 2, chessWidth + highlightOffset, chessHeight + highlightOffset );

    ctx.closePath();

    ctx.fill();

    if ( DEBUG_MODE )
    {
        var x = phyX + chessWidth / 2;
        var y = phyY + chessWidth / 2;
        var fontSize = ( chessFontBaseSize - chessSizeOffset * 3 );
        drawCenterText( index, fontSize / 4, chessRedColor, x, y + fontSize / 2, false );
    }

    addRoundLine( backColor );
}

// 繪製置中的text
function drawCenterText( chess, fontSize, fontColor, phyX, phyY, needShadow )
{
    ctx.save();

    if ( needShadow || getBlockStyle() == SHADOW_BLOCK_STYLE )
    {
        ctx.shadowColor = "";
        ctx.shadowBlur = width / 15;
    }
    else if ( getBlockStyle() == HALO_BLOCK_STYLE )
    {
        ctx.shadowColor = frontColor;
        ctx.shadowBlur = width / 10;
    }


    ctx.fillStyle = fontColor;
    ctx.font = "" + fontSize + 'px 微軟正黑體';
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    ctx.translate( phyX, phyY );

    if ( enableAngleSwitch == ANGLE_SWITCH_LOGO && getNowPage() == TWO_PLAYER_PAGE )
    {
        ctx.rotate( rotateAngle ); // 雙人遊戲時自動切換視角
    }

    ctx.translate( -phyX, -phyY );
    ctx.fillText( chess, phyX, phyY );


    ctx.restore();
}


// 繪製開始頁面的功能
function drawFunction( index )
{
    setBlockStyle();

    var pos = getPos( index );
    var posX = pos[0];
    var posY = pos[1];

    ctx.fillStyle = backChessColor;


    ctx.beginPath();

    var phyX = posXToPhyX( posX );
    var phyY = posYToPhyY( posY );

    ctx.rect( phyX, phyY, chessWidth, chessHeight );

    ctx.closePath();

    ctx.fill();

    addRoundLine( backChessColor );

    var fontSize = ( chessFontBaseSize - chessSizeOffset * 3 ) / 6;
    phyY += chessFontBaseSize - chessSizeOffset * 3;
    phyX += chessWidth / 2;

    drawCenterText( FUNCTION_NAMES[index][gLanguageIndex], fontSize, frontColor, phyX, phyY, false );

    var logo = ""; // 開始頁面的各功能logo

    if ( index == LOW_GAME_PAGE )
    {
        logo = "L";
    }
    else if ( index == MED_GAME_PAGE )
    {
        logo = "M";
    }
    else if ( index == TWO_AI_PAGE )
    {
        logo = "D";
    }
    else if ( index == TWO_PLAYER_PAGE )
    {
        logo = "T";
    }
    else if ( index == RULE_PAGE )
    {
        logo = "R";
    }
    else if ( index == OPTION_PAGE )
    {
        logo = "O";
    }
    else if ( index == ABOUT_PAGE )
    {
        logo = "A";
    }
    else if ( index == LOG_PAGE )
    {
        logo = "H";
    }
    else if ( index == OPTION_COLOR_PAGE )
    {
        logo = "C";
    }
    else if ( index == OPTION_OTHER_PAGE )
    {
        logo = "O";
    }
    else
    {
        logo = "X";
    }

    //drawShadowFont( logo, fontSize * 2.5, frontColor, phyX + chessWidth * 1 / 4, phyY - chessHeight * 1 / 3 );

    phyX = posXToPhyX( posX ) + chessWidth / 2;
    phyY = posYToPhyY( posY ) + chessWidth / 2;

    drawCenterText( logo, fontSize * 2.5, frontColor, phyX, phyY, true );
}



// 繪製關於頁面的功能
function drawAbout( index )
{

    setBlockStyle();

    var pos = getPos( index );
    var posX = pos[0];
    var posY = pos[1];

    ctx.fillStyle = backChessColor;


    ctx.beginPath();

    var phyX = posXToPhyX( posX );
    var phyY = posYToPhyY( posY );

    ctx.rect( phyX, phyY, chessWidth + chessSizeOffset * 3, chessHeight + chessSizeOffset * 3 );

    //printError( c.width + " " + c.height + " " + chessWidth + " " + chessHeight + "<br>" );

    ctx.closePath();

    ctx.fill();

    ctx.fillStyle    = frontColor;
    var fontSize = ( chessFontBaseSize - chessSizeOffset * 3 ) / 10;
    ctx.font         = "" + fontSize + 'px 微軟正黑體';
    phyY += chessSizeOffset * 6;
    phyX += chessFontBaseSize / 15;

    addRoundLine( backChessColor );

    ctx.fillText( ABOUT_NAMES[index][gLanguageIndex], phyX, phyY );

    ctx.font = "" + ( fontSize - chessSizeOffset ) + 'px 微軟正黑體';
    var text = "";

    if ( index < ABOUT_GO_BACK )
    {
        text = aboutDetail[index][gLanguageIndex];
        drawText( text, 13, fontSize - chessSizeOffset, frontColor, phyX, phyY + chessHeight / 4 );
    }
    else
    {
        // go back
        drawCenterText( LOGOS[GO_BACK_LOGO][gLanguageIndex], chessHeight / 2, frontColor, posXToPhyX( posX ) + chessHeight / 2, posYToPhyY( posY ) + chessHeight / 2 );

    }

    drawText( text, 13, fontSize - chessSizeOffset, phyX, phyY + chessHeight / 4 );
}

// 繪製紀錄頁面的功能
function drawLog( index )
{

    setBlockStyle();

    var pos = getPos( index );
    var posX = pos[0];
    var posY = pos[1];

    ctx.fillStyle = backChessColor;


    ctx.beginPath();

    var phyX = posXToPhyX( posX );
    var phyY = posYToPhyY( posY );

    ctx.rect( phyX, phyY, chessWidth + chessSizeOffset * 3, chessHeight + chessSizeOffset * 3 );

    //printError( c.width + " " + c.height + " " + chessWidth + " " + chessHeight + "<br>" );

    ctx.closePath();

    ctx.fill();

    ctx.fillStyle    = frontColor;
    var fontSize = ( chessFontBaseSize - chessSizeOffset * 3 ) / 10;
    ctx.font         = "" + fontSize + 'px 微軟正黑體';
    phyY += chessSizeOffset * 6;
    phyX += chessFontBaseSize / 15;

    addRoundLine( backChessColor );

    ctx.fillText( LOG_NAMES[index][gLanguageIndex], phyX, phyY );

    ctx.font = "" + ( fontSize - chessSizeOffset ) + 'px 微軟正黑體';
    var text = "";

    if ( index == LOG_LOW )
    {
        drawCenterText( gLowGameWinCount + " " + STR_WIN[gLanguageIndex], chessHeight / 8, frontColor, posXToPhyX( posX ) + chessHeight / 2, posYToPhyY( posY ) + chessHeight / 3 );
        drawCenterText( gLowGameLossCount + " " + STR_LOSE[gLanguageIndex], chessHeight / 8, frontColor, posXToPhyX( posX ) + chessHeight / 2, posYToPhyY( posY ) + chessHeight / 2 );
        drawCenterText( ( gLowGameCount - gLowGameWinCount - gLowGameLossCount ) + " " + STR_TIE[gLanguageIndex], chessHeight / 8, frontColor, posXToPhyX( posX ) + chessHeight / 2, posYToPhyY( posY ) + chessHeight / 1.5 );

    }
    else if ( index == LOG_MED )
    {
        drawCenterText( gMedGameWinCount + " " + STR_WIN[gLanguageIndex], chessHeight / 8, frontColor, posXToPhyX( posX ) + chessHeight / 2, posYToPhyY( posY ) + chessHeight / 3 );
        drawCenterText( gMedGameLossCount + " " + STR_LOSE[gLanguageIndex], chessHeight / 8, frontColor, posXToPhyX( posX ) + chessHeight / 2, posYToPhyY( posY ) + chessHeight / 2 );
        drawCenterText( ( gMedGameCount - gMedGameWinCount - gMedGameLossCount ) + " " + STR_TIE[gLanguageIndex], chessHeight / 8, frontColor, posXToPhyX( posX ) + chessHeight / 2, posYToPhyY( posY ) + chessHeight / 1.5 );

    }
    else
    {
        // go back
        drawCenterText( LOGOS[GO_BACK_LOGO][gLanguageIndex], chessHeight / 2, frontColor, posXToPhyX( posX ) + chessHeight / 2, posYToPhyY( posY ) + chessHeight / 2 );

        //return;
    }

    //drawText( text, 13, fontSize - chessSizeOffset, phyX, phyY + chessHeight / 4 );

    //drawShadowFont( "", fontSize * 2.5, frontColor, phyX + chessWidth * 1 / 4, phyY + chessHeight * 1 / 3 );
}

// 繪製規則頁面的功能
function drawRule( index )
{
    setBlockStyle();

    var pos = getPos( index );
    var posX = pos[0];
    var posY = pos[1];

    ctx.fillStyle = backChessColor;


    ctx.beginPath();

    var phyX = posXToPhyX( posX );
    var phyY = posYToPhyY( posY );

    ctx.rect( phyX, phyY, chessWidth + chessSizeOffset * 3, chessHeight + chessSizeOffset * 3 );

    ctx.closePath();

    ctx.fill();

    ctx.fillStyle    = frontColor;
    var fontSize = ( chessFontBaseSize - chessSizeOffset * 3 ) / 10;
    ctx.font         = "" + fontSize + 'px 微軟正黑體';
    phyY += chessSizeOffset * 6;
    phyX += chessFontBaseSize / 15;

    addRoundLine( backChessColor );

    ctx.fillText( RULE_NAMES[index][gLanguageIndex], phyX, phyY );

    ctx.font = "" + ( fontSize - chessSizeOffset ) + 'px 微軟正黑體';
    var text = "";

    if ( index == GO_BACK_RULE )
    {
        drawCenterText( LOGOS[GO_BACK_LOGO][gLanguageIndex], chessHeight / 2, frontColor, posXToPhyX( posX ) + chessHeight / 2, posYToPhyY( posY ) + chessHeight / 2 );

    }
    else
    {
        text = ruleDetail[index][gLanguageIndex];
        drawText( text, 13, fontSize - chessSizeOffset, frontColor, phyX, phyY + chessHeight / 4 );
    }
}

// 從x,y開始印出text，但每列只能放length個字，之後要往下印
function drawText( text, length, fontSize, fontColor, x, y )
{
    var rowCount = Math.ceil( text.length / length ); // 檢查需放幾列
    var rowTexts = new Array( rowCount ); // 存放切割後的每一列text

    ctx.fillStyle = fontColor;
    ctx.font = "" + fontSize + 'px 微軟正黑體';

    var j = 0;
    var lineCount = 0;

    // 切割text
    //for ( var i = 0; i < rowCount; i ++ )
    while ( j < text.length )
    {
        var lineLength = 0;
        var start = j;
        var newLine = false;

        while ( lineLength < length && j < text.length )
        {
            if ( text.substr( j, 1 ) == "　" )
            {
                //start +=3;
                j++;
                newLine = true;
                break;
            }

            if ( isWordOrNumber( text.substr( j, 1 ) ) )
            {
                //printDebug( text.substr( j, 1 ) + "_"  );
                lineLength += 0.4;
            }
            else
            {
                lineLength ++;
            }

            j ++;

        }

        if ( !newLine )
        {
            rowTexts[lineCount++] = text.substr( start, j - start );
        }
        else
        {
            rowTexts[lineCount++] = text.substr( start, j - start );
            rowTexts[lineCount++] = "";
        }
    }

    x -= chessSizeOffset;
    
    // 印出text
    for ( var i = 0; i < lineCount; i ++ )
    {
        ctx.fillText( rowTexts[i], x, y );
        y += fontSize + chessSizeOffset;
    }

}

// 繪製顏色頁面的顏色方塊
function drawColor( index )
{
    setBlockStyle();

    var pos = getPos( index );
    var posX = pos[0];
    var posY = pos[1];

    if ( index < 2 )   // 前兩個黑色
    {
        ctx.fillStyle = "#000000";
    }
    else if ( index > ( colors.length - 3 ) )   // 最後兩個白色
    {
        ctx.fillStyle = "#FFFFFF";
    }
    else
    {
        ctx.fillStyle = getRandomColor();
    }

    colors[index] = ctx.fillStyle; // 紀錄此格的顏色

    ctx.beginPath();

    var phyX = posXToPhyX( posX );
    var phyY = posYToPhyY( posY );

    ctx.rect( phyX, phyY, chessWidth, chessHeight );

    ctx.closePath();

    ctx.fill();
}

// 設置色塊樣式
function setBlockStyle()
{
    resetContext();
    setShadow( frontColor );
}


// 取得目前色塊樣式
function getBlockStyle()
{
    if ( isGamePage( getNowPage() ) )
    {
        return nowChessBlockStyle;
    }
    else
    {
        return nowOtherBlockStyle;
    }
}

// 設置陰影顏色和相關設定
function setShadow( shadowColor )
{
    drawShadowFont( "", 0, shadowColor, 0, 0 );
}

// 繪製主要選項頁面
function drawOption( index )
{
    setBlockStyle();

    var pos = getPos( index );
    var posX = pos[0];
    var posY = pos[1];


    ctx.fillStyle = backChessColor;


    ctx.beginPath();

    var phyX = posXToPhyX( posX );
    var phyY = posYToPhyY( posY );

    ctx.rect( phyX, phyY, chessWidth, chessHeight );

    ctx.closePath();

    ctx.fill();

    addRoundLine( backChessColor );

    var fontSize = chessWidth / 6; // ( chessFontBaseSize - chessSizeOffset * 3 ) / 7;
    var y = phyY + chessFontBaseSize - chessSizeOffset * 5;
    var x = phyX + chessWidth / 2;

    drawCenterText( OPTION_NAMES[index][gLanguageIndex], fontSize, frontColor, x, y, false );

    var logo = "✎"; // 開始頁面的各功能logo // ☐☑
    var logoColor = frontColor; // logo顏色

    if ( index == OPTION_COLOR )
    {
        logo = "❖";
    }
    else if ( index == OPTION_OTHER )
    {
        logo = "⊕";//"✱";
    }

    x = phyX + chessWidth / 2;
    y = phyY + chessWidth / 2;

    drawCenterText( logo, fontSize * 2, logoColor, x, y, true );
}


// 繪製主要選項頁面
function drawOptionOther( index )
{

    setBlockStyle();

    var pos = getPos( index );
    var posX = pos[0];
    var posY = pos[1];


    ctx.fillStyle = backChessColor;


    ctx.beginPath();

    var phyX = posXToPhyX( posX );
    var phyY = posYToPhyY( posY );

    ctx.rect( phyX, phyY, chessWidth, chessHeight );

    ctx.closePath();

    ctx.fill();

    addRoundLine( backChessColor );

    var fontSize = ( chessFontBaseSize - chessSizeOffset * 3 ) / 7;
    var y = phyY + chessFontBaseSize - chessSizeOffset * 2;
    var x = phyX + chessWidth / 2;

    drawCenterText( OPTION_OTHER_NAMES[index][gLanguageIndex], fontSize, frontColor, x, y, false );


    if ( //index == OPTION_CHESS_DISPLAY ||
        index == OPTION_ANGLE ||
        index == OPTION_THEME ||
        index == OPTION_CHESS_STYLE ||
        index == OPTION_BLOCK_STYLE )
    {
        fontSize = fontSize * 0.8;
    }
    else if ( index == OPTION_GO_BACK )
    {
        fontSize = fontSize * 1.5;
    }

    var x = phyX + chessWidth / 2;
    var y = phyY + chessWidth / 2;

    if ( index == OPTION_ACHIEVEMENT )
    {
        var allCount = parseInt( gLowGameCount ) + parseInt( gMedGameCount );
        drawCenterText( allCount, fontSize * 2.5, frontColor, x, y, true );
    }
    else
    {
        drawCenterText( LOGOS[OPTION_OTHER_LOGOS[index]][gLanguageIndex], fontSize * 2.5, frontColor, x, y, true );
    }

}

// 繪製選項頁面的功能
function drawOptionColor( index )
{
    setBlockStyle();

    var pos = getPos( index );
    var posX = pos[0];
    var posY = pos[1];


    ctx.fillStyle = backChessColor;


    ctx.beginPath();

    var phyX = posXToPhyX( posX );
    var phyY = posYToPhyY( posY );

    ctx.rect( phyX, phyY, chessWidth, chessHeight );

    ctx.closePath();

    ctx.fill();

    addRoundLine( backChessColor );

    var fontSize = ( chessFontBaseSize - chessSizeOffset * 3 ) / 7;
    var y = phyY + chessFontBaseSize - chessSizeOffset * 2;
    var x = phyX + chessWidth / 2;

    drawCenterText( OPTION_COLOR_NAMES[index][gLanguageIndex], fontSize, frontColor, x, y, false );

    var logo = "█"; // 開始頁面的各功能logo // ☐☑
    var logoColor; // logo顏色

    if ( index == BACK_COLOR )
    {
        ctx.fillStyle = logoColor = backColor;
    }
    else if ( index == FRONT_COLOR )
    {
        ctx.fillStyle = logoColor = frontColor;
    }
    else if ( index == CHESS_BACK_COLOR )
    {
        ctx.fillStyle = logoColor = backChessColor;
    }
    else if ( index == CHESS_FRONT_COLOR )
    {
        ctx.fillStyle = logoColor = frontChessColor;
    }
    else if ( index == FRAME_COLOR )
    {
        ctx.fillStyle = logoColor = highlightColor;
    }
    else if ( index == RED_COLOR )
    {
        ctx.fillStyle = logoColor = chessRedColor;
    }
    else if ( index == BLACK_COLOR )
    {
        ctx.fillStyle = logoColor = chessBlackColor;
    }
    else
    {
        // go back
        logo = LOGOS[GO_BACK_LOGO][gLanguageIndex];
        fontSize = chessWidth / 4;
    }

    x = phyX + chessWidth / 2;
    y = phyY + chessWidth / 2;

    drawCenterText( logo, fontSize * 2.5, logoColor, x, y, true );
}

// 畫出陰影字
function drawShadowFont( fontString, fontSize, shadowColor, phyX, phyY )
{
    // 需要畫出字體
    if ( fontSize != 0 )
    {
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = width / 10;
        ctx.font         = "" + fontSize + 'px 微軟正黑體';
        ctx.fillText( fontString, phyX, phyY );
    }
    else   // 只是要設定陰影
    {
        if ( getBlockStyle() == HALO_BLOCK_STYLE )
        {
            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = width / 10;
        }
        else if ( getBlockStyle() == SHADOW_BLOCK_STYLE )
        {
            ctx.shadowColor = "";
            ctx.shadowBlur = width / 15;
        }
        else
        {

        }


    }
}

function addRoundLine( color )
{
    // Stroke the inner outline
    ctx.lineWidth = chessSizeOffset;
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.stroke();
}


// 繪製單個掀開的棋子
function drawOneFrontChess( chess, index )
{
    setBlockStyle();

    var pos = getPos( index );
    var posX = pos[0];
    var posY = pos[1];

    ctx.fillStyle = frontChessColor;

    ctx.beginPath();

    var phyX = posXToPhyX( posX );
    var phyY = posYToPhyY( posY );

    ctx.rect( phyX, phyY, chessWidth, chessHeight );

    ctx.closePath();

    ctx.fill();

    var fontColor;
    var fontSize;

    if ( getCamp( chess ) == BLACK )
    {
        fontColor = chessBlackColor;
    }
    else
    {
        fontColor = chessRedColor;
    }

    fontSize = ( chessFontBaseSize - chessSizeOffset * 3 );

    var x = phyX + chessWidth / 2;
    var y = phyY + chessWidth / 2;

    //fontColor = "white";

    drawCenterText( chess, fontSize, fontColor, x, y, false );

    if ( DEBUG_MODE )
    {
        drawCenterText( index, fontSize / 4, fontColor, x, y + fontSize / 2, false );
    }

    if ( getHighlightIndex() == index && // 此位置有選定
         gChessStates[index] == OPEN && // 選取的是已翻開棋子
         getCamp( gChesses[index] ) == getNowPlayer() )   // 與目前回合玩家相同陣營
    {
        addRoundLine( highlightColor );
    }
    else if ( gAIHighlightIndex == index )
    {
        addRoundLine( gAIroundColor );
    }
    else
    {
        addRoundLine( frontChessColor );
    }
}

// 繪製旋轉字
function drawRotateText( chess, phyX, phyY )
{
    ctx.save();

    var translateParameter = 3;
    var translateX = phyX + chessWidth / translateParameter ;
    var translateY = phyY - chessHeight / translateParameter;

    ctx.translate( translateX, translateY );
    ctx.rotate( Math.PI * translateParameter / 2 );
    ctx.translate( -translateX, -translateY );
    ctx.fillText( chess, phyX, phyY );

    ctx.restore();
}


// 繪製單個覆蓋的棋子
function drawOneBackChess( index )
{
    setBlockStyle();

    var pos = getPos( index );
    var posX = pos[0];
    var posY = pos[1];

    ctx.fillStyle = backChessColor;

    ctx.beginPath();

    var phyX = posXToPhyX( posX );
    var phyY = posYToPhyY( posY );

    ctx.rect( phyX, phyY, chessWidth, chessHeight );

    ctx.closePath();

    ctx.fill();

    if ( DEBUG_MODE )
    {
        var x = phyX + chessWidth / 2;
        var y = phyY + chessWidth / 2;
        var fontSize = ( chessFontBaseSize - chessSizeOffset * 3 );
        drawCenterText( index, fontSize / 4, chessBlackColor, x, y + fontSize / 2, false );
    }

    addRoundLine( backChessColor );
}


function drawProcessAnimation( camp, tick )
{
    return function()
    {

        drawProcess( camp, tick );
    };

}

// draw process block
function drawProcess( camp, tick )
{
    resetContext();

    var eatenSize;

    if ( width < height )
    {
        eatenSize = chessEatenSize * 1.1;
    }
    else
    {
        eatenSize = chessEatenSize * 0.8;
    }

    var fontSize;
    var fontColor;
    var phyX;
    var phyY;
    var blockWidth = eatenSize / 2;



    if ( camp == BLACK )
    {
        fontColor = chessBlackColor;

        if ( getOrientation() == LANDSCAPE )
        {
            phyX = width - blockWidth * tick;
            phyY = height * 0.07;
        }
        else
        {
            phyX = 0;
            phyY = height - blockWidth * tick;
        }
    }
    else
    {
        fontColor = chessRedColor;


        if ( getOrientation() == LANDSCAPE )
        {
            phyX = width - blockWidth * tick;
            phyY = c.height - blockWidth - height * 0.05;
        }
        else
        {
            phyX = c.width - blockWidth;
            phyY = height - blockWidth * tick;
        }
    }

    //alert( "" + phyX + "," + phyY + " : " + chessEatenSize );

    // 先畫出棋子方塊

    ctx.beginPath();

    ctx.fillStyle = frontChessColor;

    ctx.rect( phyX, phyY, blockWidth, blockWidth );

    ctx.closePath();

    ctx.fill();

}

// 繪製單個被吃的棋子
function drawSingleEatenChess( chess, camp, order )
{
    resetContext();

    var eatenSize = chessEatenSize;

    if ( width < height )
    {
        if ( gDeviceName == WINDOWS_PHONE )
        {
            eatenSize *= 1.1;
        }
        
    }
    else
    {
        if ( gDeviceName == WINDOWS_PHONE )
        {
            eatenSize *= 0.8;
        }
        else if ( gDeviceName == IOS )
        {
            eatenSize *= 1.5;
        }
    }

    var fontSize;
    var fontColor;
    var phyX;
    var phyY;
    var blockWidth = eatenSize / 2;



    if ( camp == BLACK )
    {
        fontColor = chessBlackColor;

        if ( getOrientation() == LANDSCAPE )
        {
            phyX = blockWidth * order * 5 / 4;
            
            if ( gDeviceName == WINDOWS_PHONE )
            {
                phyY = height * 0.07;
            }
            else
            {
                phyY = 0;
            }
        }
        else
        {
            phyX = 0;
            phyY = blockWidth * order * 5 / 4;
        }
    }
    else
    {
        fontColor = chessRedColor;


        if ( getOrientation() == LANDSCAPE )
        {
            
            phyX = blockWidth * order * 5 / 4;
            
            if ( gDeviceName == WINDOWS_PHONE )
            {
                phyY = c.height - blockWidth - height * 0.05;
            }
            else
            {
                phyY = c.height - blockWidth;
            }
        }
        else
        {
            phyX = c.width - blockWidth;
            phyY = blockWidth * order * 5 / 4;
        }
    }

    //alert( "" + phyX + "," + phyY + " : " + chessEatenSize );

    // 先畫出棋子方塊

    ctx.beginPath();

    ctx.fillStyle = frontChessColor;

    ctx.rect( phyX, phyY, blockWidth, blockWidth );

    ctx.closePath();

    ctx.fill();

    addRoundLine( frontChessColor );


    // 再畫出字樣
    var x = phyX + blockWidth / 2;
    var y = phyY + blockWidth / 2;
    fontSize = blockWidth - chessSizeOffset * 0;

    drawCenterText( chess, fontSize, fontColor, x, y, false );

}

// 繪製所有被吃的棋子
function drawAllEatenChess()
{
    var blackCount = 0;
    var redCount = 0;

    gEatenBlockQueue.sort();
    gEatenRedQueue.sort();

    var blackSize = getQueueSize( gEatenBlockQueue, INIT_EATEN_VALUE );
    var redSize = getQueueSize( gEatenRedQueue, INIT_EATEN_VALUE );

    // 黑方被吃棋子
    for ( var i = 0; i < blackSize; i ++ )
    {
        drawSingleEatenChess( getChess( gEatenBlockQueue[i], BLACK ), BLACK, i );

    }

    // 紅方被吃棋子
    for ( var i = 0; i < redSize; i ++ )
    {
        drawSingleEatenChess( getChess( gEatenRedQueue[i], RED ), RED, i );
    }
}


// 直接繪製所有方塊
function redrawAll()
{
    drawAll( widthCount * heightCount );
}

// 以動畫方式繪製所有方塊
function redrawAllAnimation( page )
{
    clearAll(); // 清空

    var speed = 80; // 預設速度

    if ( isGamePage( page ) )
    {
        speed = 40;
    }
    else if ( getNowPage() == COLOR_PAGE )
    {
        speed = 20;
    }

    var seed = 1;
    var totalCount = widthCount * heightCount;
    var referCount = widthCount > heightCount ? widthCount : heightCount;
    var drawed = new Array( totalCount ); // 已經畫過的就標記起來

    // 初始化
    for ( i = 0; i < totalCount; i ++ )
    {
        drawed[i] = false;
    }

    // 若方塊太少，就用正常方式繪製即可
    if ( totalCount < INDEX_LENGTH )
    {
        for ( i = 0; i < totalCount; i ++ )
        {

            setTimeout( redrawAnimation( i ), speed * ( seed++ ) );
            drawed[i] = true;
        }

    }
    else
    {

        for ( var i = 0; i < totalCount; i += referCount )
        {
            setTimeout( redrawAnimation( i ), speed * ( seed++ ) );
            drawed[i] = true;

            for ( var j = i - referCount; j >= 0; j -= referCount )
            {
                if ( !drawed[j + 1] )
                {
                    setTimeout( redrawAnimation( ++j ), speed * ( seed++ ) );
                    drawed[j] = true;
                }
            }
        }

        for ( var i = totalCount - referCount + 1; i < totalCount; i ++ )
        {
            setTimeout( redrawAnimation( i ), speed * ( seed++ ) );


            for ( var j = i - referCount; j >= 0; j -= referCount )
            {
                if ( !drawed[j + 1] )
                {
                    setTimeout( redrawAnimation( ++j ), speed * ( seed++ ) );
                    drawed[j] = true;
                }

            }
        }

    }

    if ( isGamePage( getNowPage() ) )
    {
        //drawEatenChess(); // 畫出被吃的棋子
        drawAllEatenChess(); // 畫出被吃的棋子
    }
}

function redrawAnimation( count )
{
    return function()
    {
        try
        {
            if ( count < widthCount * heightCount )
            {
                drawSingle( count );
            }
        }
        catch ( err )
        {
            printError( "發生錯誤: " + err.stack + "<br>" );
        }
    }
}

// 繪製在index位置的單一棋子
function drawSingle( index )
{
    if ( index < 0 )
    {
        return;
    }


    //printDebug( " (" + i + "," + j + ") " );
    if ( isGamePage( getNowPage() ) )
    {

        if ( gChessStates[index] == CLOSE )
        {
            // 繪製覆蓋的棋子
            drawOneBackChess( index );
        }
        else if ( gChessStates[index] == OPEN )
        {
            // 繪製掀開的棋子
            drawOneFrontChess( gChesses[index], index );
        }
        else // 被吃的棋子
        {
            drawOneEmptyChess( index );
        }
    }
    else if ( getNowPage() == START_PAGE )
    {
        drawFunction( index );
    }
    else if ( getNowPage() == OPTION_COLOR_PAGE )
    {
        drawOptionColor( index );
    }
    else if ( getNowPage() == GAME_LEVEL_PAGE )
    {
    
        drawGameLevel( index );
    }
    else if ( getNowPage() == OPTION_OTHER_PAGE )
    {
        drawOptionOther( index );
    }
    else if ( getNowPage() == OPTION_PAGE )
    {
        drawOption( index );
    }
    else if ( getNowPage() == GAME_OVER_PAGE )
    {
		if ( gDeviceName == ANDROID )
		{
			drawGameOverII( index );
		}
		else 
		{
			drawGameOver( index );
		}
        
    }
    else if ( getNowPage() == GAME_OVER_DIALOG_PAGE || getNowPage() == GAME_START_DIALOG_PAGE )
    {
        drawDialog( getNowPage(), index );
    }
    else if ( getNowPage() == COLOR_PAGE )
    {
        drawColor( index );
    }
    else if ( getNowPage() == RULE_PAGE )
    {
        drawRule( index );
    }
    else if ( getNowPage() == ABOUT_PAGE )
    {
        drawAbout( index );
    }
    else if ( getNowPage() == LOG_PAGE )
    {
        drawLog( index );
    }
}

// 重新繪製整個棋盤
function drawAll( count )
{
    clearAll(); // 清空

    resetContext(); // 設置ctx共通參數

    //drawEatenChess();
    drawAllEatenChess(); // 畫出被吃的棋子

    for ( var index = 0; index < count; index ++ )
    {

        drawSingle( index );

    }
}


// 由位置(x,y)轉為index
function getIndex( posX, posY )
{
    if ( posX < 0 || posY < 0 )
    {
        return NOT_FOUND;
    }

    var index = 0;

    if ( getOrientation() == LANDSCAPE )
    {
        index = posX + posY * widthCount;
    }
    else
    {
        index = posX * heightCount + posY;
    }

    if ( index < widthCount * heightCount )
    {
        return index;
    }
    else
    {
        return NOT_FOUND;
    }
}

// 由index轉為(x,y)
function getPos( index )
{
    var pos = new Array( 2 );


    if ( getOrientation() == LANDSCAPE )
    {
        pos[1] = Math.floor( index / widthCount );
        pos[0] = index % widthCount;
    }
    else

    {
        pos[0] = Math.floor( index / heightCount );
        pos[1] = index % heightCount;
    }

    return pos;
}






// ----------------------





