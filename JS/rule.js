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
﻿
"use strict";

// 檢查遊戲是否結束
function gameIsOver()
{
    // 檢查雙方棋子的數量
    var blackCount = 0;
    var redCount = 0;

    // 檢查雙方棋子是否能移動
    var blackCanMove = false;
    var redCanMove = false;

    for ( var i = 0; i < widthCount * heightCount; i ++ )
    {
        if ( gChessStates[i] != EATEN )
        {
            if ( getCamp( gChesses[i] ) == BLACK )
            {
                blackCount ++;

                if ( !blackCanMove )
                {
                    blackCanMove = canAction( i, BLACK );
                }
            }
            else if ( getCamp( gChesses[i] ) == RED )
            {
                redCount ++;

                if ( !redCanMove )
                {
                    redCanMove = canAction( i, RED );
                }
            }
        }
    }

    if ( blackCount == 0 || !blackCanMove )
    {
        gGameWinner = RED;
        return true;
    }
    else if ( redCount == 0 || !redCanMove )
    {
        gGameWinner = BLACK;
        return true;
    }
    else
    {
        return false;
    }
}


// 此棋子仍可以移動或可以吃
function canAction( index, camp )
{
    var chessData = getNowChessData();

    for ( var i = 0; i < INDEX_LENGTH; i ++ )
    {
        if ( canMove( chessData, i, index, camp ) ||
             canEat( chessData, i, index, camp ) ||
             canOpen( chessData, i ) )
        {
            return true;
        }
    }

    return false;
}



// 辨別是紅方棋子還是黑方棋子
function getCamp( chess )
{
    var index = 0;

    while ( index < INDEX_LENGTH && gChessPatterns[index] != chess )
    {
        index ++;
    }

    if ( index < 16 )
    {
        return BLACK;
    }
    else
    {
        return RED;
    }
}


// 回傳目前回合的玩家
function getNowPlayer()
{
    return gNowPlayer;
}

// 設定目前玩家
function setNowPlayer( player )
{
    gNowPlayer = player;
}

// 回傳下一回合的玩家
function getNextPlayer()
{
    if ( gNowPlayer == BLACK )
    {
        return RED;
    }
    else
    {
        return BLACK;
    }
}

// 更換玩家回合
function switchPlayer()
{
    if ( gNowPlayer == BLACK )
    {
        gNowPlayer = RED;
    }
    else
    {
        gNowPlayer = BLACK;
    }


    //printError( " 目前陣營: " + getCampName( gNowPlayer ) + " <br>" );
}

// 將aX, aY的棋子與bX,bY的棋子交換位置
function switchChess( chessData, aIndex, bIndex )
{

    // 交換棋子
    var tempChess = chessData.chesses[aIndex];

    chessData.chesses[aIndex] = chessData.chesses[bIndex];
    chessData.chesses[bIndex] = tempChess;

    // 交換狀態
    var tempState = chessData.chessStates[aIndex];

    chessData.chessStates[aIndex] = chessData.chessStates[bIndex];
    chessData.chessStates[bIndex] = tempState;
}

// 目前是否為黑方玩家的回合
function nowPlayerIsBlack()
{
    if ( getPlayer() == BLACK )
    {
        return true;
    }
    else
    {
        return false;
    }
}

// camp陣營棋子是否可以從 (sourceIndex) 移動到 (destIndex)
function canMove( chessData, destIndex, sourceIndex, camp )
{

    if ( destIndex == sourceIndex ||
         destIndex < 0 ||
         destIndex >= INDEX_LENGTH ||
         sourceIndex < 0 ||
         sourceIndex >= INDEX_LENGTH ||
         chessData.chessStates[sourceIndex] != OPEN ||
         chessData.chessStates[destIndex] != EATEN    )
    {
        return false;
    }

    if ( camp == getCamp( chessData.chesses[sourceIndex] ) &&
         !existChess( chessData, destIndex ) &&
         isNeighbor( destIndex, sourceIndex ) )
    {
        return true;
    }
    else
    {
        return false;
    }
}

// 移動棋子 (sourceIndex) -> (destIndex)
function move( chessData, destIndex, sourceIndex, camp )
{

    if ( canMove( chessData, destIndex, sourceIndex, camp ) )
    {
        printGame( chessData.chesses[sourceIndex] + " 可以移動到 " + destIndex );

        switchChess( chessData, destIndex, sourceIndex );

        return SUCCESS;
    }
    else
    {
        //printGame( "" + existChess( chessData, destIndex ) + " " + isNeighbor( destIndex, sourceIndex ) );

        return FAIL;
    }

}

// 是否可打開destIndex位置的棋子
function canOpen( chessData, destIndex )
{
    if ( destIndex < 0 ||
         destIndex >= INDEX_LENGTH ||
         chessData.chessStates[destIndex] != CLOSE )
    {
        return false;
    }
    else
    {
        return true;
    }
}

// 位於(sourceX, sourceY)的棋子要打開
function openChess( chessData, destIndex )
{
    if ( canOpen( chessData, destIndex ) )
    {
        chessData.chessStates[destIndex] = OPEN;

        return true;
    }
    else
    {
        return false;
    }
}

// 位於(sourceIndex)的camp陣營棋子是否可以吃掉位於(destIndex)的棋子
function canEat( chessData, destIndex, sourceIndex, camp )
{
    if ( destIndex == sourceIndex ||
         destIndex < 0 ||
         destIndex >= INDEX_LENGTH ||
         sourceIndex < 0 ||
         sourceIndex >= INDEX_LENGTH ||
         chessData.chessStates[sourceIndex] != OPEN ||
         chessData.chessStates[destIndex] != OPEN )
    {
        return false;
    }

    // 先檢查source是否為己方棋子，且dest為敵方棋子，且dest已翻開
    if ( camp == getCamp( chessData.chesses[sourceIndex] ) &&
         camp != getCamp( chessData.chesses[destIndex] ) )
    {

        // 普通吃法
        if ( getRank( chessData.chesses[sourceIndex] ) != RANK_CANNON )
        {
            if ( isNeighbor( destIndex, sourceIndex ) &&
                 ( getRank( chessData.chesses[sourceIndex] ) - getRank( chessData.chesses[destIndex] ) ) < 6  &&
                 ( getRank( chessData.chesses[sourceIndex] ) >= getRank( chessData.chesses[destIndex] ) ||
                   ( getRank( chessData.chesses[destIndex] ) - getRank( chessData.chesses[sourceIndex] ) ) == 6 )  )
            {
                //printError( "己方: " + getCampName( getCamp( chessData.chesses[sourceIndex] ) ) + " " + chessData.chesses[sourceIndex] + "<br>" + "敵方: " + getCampName( getCamp( chessData.chesses[destIndex] ) ) + " " + chessData.chesses[destIndex] + "<br>" );
                return true;
            }
        }
        // 跳躍吃法
        else if ( existOneInterval( chessData, destIndex, sourceIndex ) )
        {
            return true;
        }
    }

    return false;
}

// 位於(sourceIndex)的棋子 要吃掉位於(destIndex)的棋子
function eat( chessData, destIndex, sourceIndex, camp )
{
    if ( canEat( chessData, destIndex, sourceIndex, camp ) )
    {
        printGame( chessData.chesses[sourceIndex] + " 可以吃掉 " + chessData.chesses[destIndex] );

        addEatenChess( chessData, destIndex ); // 把被吃的棋子加到queue

        chessData.chessStates[destIndex] = EATEN;

        switchChess( chessData, destIndex, sourceIndex );

        return SUCCESS; // 可以吃

    }
    else
    {
        printGame( chessData.chesses[sourceIndex] + " " + getRank( chessData.chesses[sourceIndex] ) + " 不能吃掉 " + chessData.chesses[destIndex] + " " + getRank( chessData.chesses[destIndex] ) );
    }

    return FAIL; // 無法吃
}

// 取得佇列目前存放量
function getQueueSize( queue, initValue )
{

    var index = queue.length - 1;

    while ( queue[index] == initValue )
    {
        index--;
    }


    return index + 1;
}


// 檢查chess的陣營後，加入到那一方被吃的queue裡面
function addEatenChess( chessData, index )
{
    if ( getCamp( chessData.chesses[index] ) == BLACK )
    {
        var size = getQueueSize( chessData.eatenBlockQueue, INIT_EATEN_VALUE );

        chessData.eatenBlockQueue[size] = getRank( chessData.chesses[index] );
    }
    else
    {
        var size = getQueueSize( chessData.eatenRedQueue, INIT_EATEN_VALUE );

        chessData.eatenRedQueue[size] = getRank( chessData.chesses[index] );
    }

}

// aX,aY和bX,bY是否平行，且中間只隔著一個棋子
function existOneInterval( chessData, aIndex, bIndex )
{
    var begin = 0;
    var end = 0;
    var intervalCount = 0;

    var aPos = getPos( aIndex );
    var bPos = getPos( bIndex );

    var aX = aPos[0];
    var aY = aPos[1];

    var bX = bPos[0];
    var bY = bPos[1];

    if ( aX == bX )
    {
        if ( aY > bY )
        {
            begin = bY;
            end = aY;
        }
        else
        {
            begin = aY
                    end = bY;
        }

        for ( i = begin + 1; i < end; i ++ )
        {
            if ( existChess( chessData, getIndex( aX, i ) ) )
            {
                intervalCount ++;
            }
        }
    }
    else if ( aY == bY )
    {
        if ( aX > bX )
        {
            begin = bX;
            end = aX;
        }
        else
        {
            begin = aX
                    end = bX;
        }

        for ( var i = begin + 1; i < end; i ++ )
        {
            if ( existChess( chessData, getIndex( i, aY ) ) )
            {
                intervalCount ++;
            }
        }

    }

    if ( intervalCount == 1 )
    {
        return true;
    }
    else
    {
        return false;
    }
}

// 檢查棋盤的index位置是否存在棋子
function existChess( chessData, index )
{
    if ( chessData.chessStates[index] != EATEN )
    {
        return true;
    }
    else
    {
        return false;
    }
}

// 檢查a是否位於b的鄰近八方
function isAround( aIndex, bIndex )
{
    var aPos = getPos( aIndex );
    var bPos = getPos( bIndex );

    var aX = aPos[0];
    var aY = aPos[1];

    var bX = bPos[0];
    var bY = bPos[1];

    return ( getGap( aX, bX ) < 2 && getGap( aY, bY ) < 2 );
}

// 檢查a, b是否為鄰居
function isNeighbor( aIndex, bIndex )
{
    var aPos = getPos( aIndex );
    var bPos = getPos( bIndex );

    var aX = aPos[0];
    var aY = aPos[1];

    var bX = bPos[0];
    var bY = bPos[1];

    if ( aX == bX && ( aY == bY + 1 || aY == bY - 1 ) )
    {
        return true;
    }
    else if ( aY == bY && ( aX == bX + 1 || aX == bX - 1 ) )
    {
        return true;
    }
    else
    {
        return false;
    }
}


// 取得棋子被吃的權值
function getPrice( chess )
{
    var index = 0;

    while ( index < INDEX_LENGTH && gChessPatterns[index] != chess )
    {
        index ++;
    }

    return gChessPrices[index];
}

// 取得棋子的階級
function getRank( chess )
{
    var index = 0;

    while ( index < INDEX_LENGTH && gChessPatterns[index] != chess )
    {
        index ++;
    }

    return gChessKeys[index];
}

function getRankByPrice( price )
{
    if ( price == PRICE_GENERAL )
    {
        return RANK_GENERAL;
    }
    else if ( price == PRICE_SCHOLAR )
    {
        return RANK_SCHOLAR;
    }
    else if ( price == PRICE_CANNON )
    {
        return RANK_CANNON;
    }
    else if ( price == PRICE_MINISTER )
    {
        return RANK_MINISTER;
    }
    else if ( price == PRICE_CAR )
    {
        return RANK_CAR;
    }
    else if ( price == PRICE_SOLDIER )
    {
        return RANK_SOLDIER;
    }
    else if ( price == PRICE_HORSE )
    {
        return RANK_HORSE;
    }

}

// 由價值資訊和陣營取得棋子
function getChessByPrice( price, camp )
{
    return getChess( getRankByPrice( price ), camp );
}

// 以階級和陣營取得棋子
function getChess( rank, camp )
{
    if ( camp == BLACK )
    {
        return gChessPatterns[( 6 - rank ) * 2];
    }
    else
    {
        return gChessPatterns[( 6 - rank ) * 2 + 16];
    }

}

// 取得選定的位置index
function getHighlightIndex()
{
    return gHighlightIndex;
}

// 紀錄highlight位置
function setHighlightIndex( index )
{
    gHighlightIndex = index;
}

// 初始化highlight位置
function initHighlightIndex()
{
    gHighlightIndex = -1;
}

// 目前是否有選定的棋子
function existHighlight()
{
    if ( gHighlightIndex >= 0 && gHighlightIndex < INDEX_LENGTH )
    {
        return true;
    }
    else
    {
        return false;
    }
}

// 取得玩家名稱
function getCampName( camp )
{
    if ( camp == BLACK )
    {
        return "黑方";
    }
    else
    {
        return "紅方";
    }

}



// 取得棋子陣營
function getCampByID( id )
{
    if ( Math.floor( id / 10 ) == BLACK )
    {
        return BLACK;
    }
    else
    {
        return RED;
    }
}

// 取得棋子名稱
function getChessNameByID( id )
{
    if ( chessLOGO == WORD_LOGO )
    {
        return gChessPatterns[( 6 - Math.floor( id / 10 ) ) * 2];
    }
    else
    {
        return chessesPicPattern[( 6 - Math.floor( id / 10 ) ) * 2];
    }
}


// 設定目前陣營
function setNowCamp( chess )
{
    if ( getCamp( chess ) == BLACK )
    {
        setNowPlayer( BLACK );
    }
    else
    {
        setNowPlayer( RED );
    }
}
