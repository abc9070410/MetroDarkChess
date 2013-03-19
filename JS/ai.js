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

// priority policy
/*

1. eatFirst :
soldier eat general, cannon eat Minister or higher ( including cannon )
2. escapeFirst :
Minister or higher will be eaten
3. safeEat :
no dangerous
3. openToEat :
for cannon or duke
4. safeOpen :
open chess no close to our army
5. walk :
6. dangerousOpen :
open chess close to our horse or less ( including general )
7. dangerousEat :
    will be eaten after eating recently
8. dangerousMove :
    will be eaten after moving recently

// new
defensiveOpen :
  open for protection
ex.

defensiveMove :


1. [OK] walk to eat 呼叫 normal eat
2. normal eat 和 noraml escape 的 chess priorirty問題
3. defensive open & Move
3. invasive open & move
4. WalkToEat 要和 open to eat 權值分等級
5. WalkToEat 須回傳希望吃到的棋子權值
6. 不能一直追著要吃
7. 分類: coercive open
        1.  有被炮跳吃危險的棋子旁邊翻開（希望翻出己方大於炮的棋子作為威嚇）
        2. 有被吃危險的棋子(相以上)旁邊間隔翻開（希望翻出己方炮作為威嚇）
8. normalEat增加欲吃棋子是否下一步就能吃我方，若是則比較該我方棋子之權值
9. 實現雙機模式 ( 按一下暫停 再按一下恢復 )
10. noDangerous
11. 當被吃和可吃的機會同時存在，需比較本身和可吃棋子的權值，高者優先。
12. coercive open & move .
13. escape之後有可能導致己方price更大的棋子被吃, 需避免。
14. walk之後被吃，但再下一回合我方也可反吃，此時需比較雙方被吃的price加總
15. 侵略性行走：目前可走到的位置存在可吃的棋子，則往該處的方向前進。
16. 發現有被敵方A吃的可能，可嘗試吃A來化解危機。

17. 增加用吃對方來逃脫的可能性
18. open to eat 要注意是否會讓己方棋子危險 ( 翻開是 兵 車 炮 會不會吃到自己）

19. some chesses can not move, or else neighbor chesses will be eaten .

20.

*/

"use strict";






// 設置測試數據
function setTestChessData()
{
    // data from the printDemoChessData() .

    printError( "OVER" );
}





// 進階AI找出此次走法
function moveByAdvanceAI( chesses, chessStates, camp )
{

    //printError( "<hr>" );
    var chessData = copyChessData( getNowChessData() );

    var eatPrices = getInitPrices();
    var eatenPrices = getInitPrices();
    var firstMoves = new Array( NOT_FOUND, NOT_FOUND );

    var n = 3;

    initSim(); // 清除前次的模擬紀錄

    simAllWay( chessData, camp, eatPrices, eatenPrices, firstMoves, n, n );

    var bestMoves = getBestSimMoves(); // find the best move from last sim .

    printDebug( getCampName( camp ) );
    printDebug( "MedAI:" + bestMoves[0] + "->" + bestMoves[1] );
    //printError( "<hr>" );

    if ( bestMoves[0] != NOT_FOUND && bestMoves[1] != NOT_FOUND )
    {
        return bestMoves;
    }
    else
    {
        return moveByAI( chesses, chessStates, camp );
    }

}





// find the best way to walk or eat, then do it .
function walkOrEatByBestWay( chessData, camp, eatenPrices )
{
    var allOpenMoveData = setAllOpenMoveData( chessData, camp );
    var bestIndex = getBestMoveDataIndex( allOpenMoveData );

    if ( bestIndex != NOT_FOUND )
    {
        var sourceIndex = allOpenMoveData[bestIndex].sourceIndex;
        var destIndex = allOpenMoveData[bestIndex].destIndex;

        printDebug( " [e:" + sourceIndex + "->" + destIndex + "] " );

        if ( move( chessData, destIndex, sourceIndex, camp ) )
        {

            return true;
        }
        else if ( eat( chessData, destIndex, sourceIndex, camp ) )
        {
            var eatenChess = chessData.chesses[sourceIndex];
            recordPrice( eatenPrices, getPrice( eatenChess ) );

            printDebug( " 被吃" + eatenChess );

            return true;

        }
    }

    return false;
}

// 找出此次最佳的走法的第一步
function getBestSimMoves()
{
    var bestPirces = getInitPrices();
    var bestMoves = getInitMoves();
    var eatBetter = false; // 吃的比被吃的優

    printDebug( "首選:" );

    for ( var i = 0; i < gSimCount; i ++ )
    {
        printDebug( i + "<br>" + gSimEatPrices[i] );
        printDebug( "<br>" + gSimEatenPrices[i] );
        printDebug( "<br>" );

        // 若被吃得比吃得好 , 就不考慮了
        if ( comparePrices( gSimEatPrices[i], gSimEatenPrices[i] ) != B_IS_BETTER )
        {
            if ( comparePrices( bestPirces, gSimEatPrices[i] ) == B_IS_BETTER )
            {
                bestPirces = copyPrices( gSimEatPrices[i] );
                bestMoves = copyMoves( gSimMoves[i] );
            }

            eatBetter = true;
        }
    }

    var bestIndex = NOT_FOUND;
    var bestPirces = getBiggestPrices(); // 因為要找最小，所以隨便給個初始值

    // 吃的的沒有比被吃的優, 那就從被吃的中找最少的了
    if ( !eatBetter )
    {
        printDebug( "次選:" );

        for ( var i = 0; i < gSimCount; i ++ )
        {
            // 找被吃中最不優的
            // 若有兩組以上被吃的權值相同，就比較它們吃的權值哪個較高
            if ( ( comparePrices( bestPirces, gSimEatenPrices[i] ) == A_IS_BETTER ) ||
                 ( comparePrices( bestPirces, gSimEatenPrices[i] ) == A_B_ARE_SAME &&
                   comparePrices( gSimEatPrices[bestIndex], gSimEatPrices[i] ) == B_IS_BETTER  ) )
            {
                bestPirces = copyPrices( gSimEatenPrices[i] );
                bestMoves = copyMoves( gSimMoves[i] );
                bestIndex = i;
            }
        }
    }

    printDebug( "最佳:" + bestIndex + "<br>" + gSimEatPrices[bestIndex] );
    printDebug( "<br>" + gSimEatenPrices[bestIndex] );
    printDebug( "<br>" );


    return bestMoves;
}


// 存入模擬結果
function saveSim( eatPrices, eatenPrices, moves )
{
    if ( gSimCount < SIM_LENGTH )
    {
        gSimEatPrices[gSimCount] = copyPrices( eatPrices );
        gSimEatenPrices[gSimCount] = copyPrices( eatenPrices );
        gSimMoves[gSimCount] = copyMoves( moves );
        gSimCount++;
    }

    printDebug( " [" + gSimCount + ":" + moves + "]:" );
}

// 初始化所有模擬記錄
function initSim()
{
    gSimCount = 0;

    for ( var i = 0; i < SIM_LENGTH; i ++ )
    {
        gSimEatPrices[i] = getInitPrices();
        gSimEatenPrices[i] = getInitPrices();
        gSimMoves[i] = getInitMoves();
    }
}


// 遞迴方式模擬出n步內所有走法（翻棋除外）
function simAllWay( chessData, camp, eatPrices, eatenPrices, firstMoves, n, initN )
{
    printDebug( " [n:" + n + "] " );

    if ( n > 0 && gSimCount < SIM_LENGTH )
    {
        for ( var i = 0; i < INDEX_LENGTH; i ++ )
        {
            var neighborIndexs;
            var moveLength = INDEX_LENGTH; // 砲要檢查所有位置
            var isCannon = getRank( chessData.chesses[i] ) == RANK_CANNON ? true : false;

            if ( !isCannon )
            {
                neighborIndexs = getNeighborIndexs( i );
                moveLength = 4; // 其餘棋子只需檢察四個鄰近方位
            }

            for ( var j = 0; j < moveLength; j ++ )
            {
                var destIndex = isCannon ? j : neighborIndexs[j];
                var sourceIndex = i;

                //printDebug( "[" + sourceIndex + "," + destIndex + "]" );

                if ( destIndex == NOT_FOUND ||
                     chessData.chessStates[sourceIndex] != OPEN ||
                     chessData.chessStates[destIndex] == CLOSE ||
                     getCamp( chessData.chesses[sourceIndex] ) != camp )
                {
                    continue;
                }

                printDebug( " " + n + "[" + sourceIndex + "," + destIndex + "]" );


                //printError( camp + "-" + chessData.chesses[sourceIndex] + "->" + chessData.chesses[destIndex] );

                var canMove = false;
                var canEat = false;

                var innerChessData = copyChessData( chessData );
                var innerEatPrices = copyPrices( eatPrices );
                var innerEatenPrices = copyPrices( eatenPrices );

                if ( move( innerChessData, destIndex, sourceIndex, camp ) )
                {
                    canMove = true;
                }
                else if ( eat( innerChessData, destIndex, sourceIndex, camp ) )
                {
                    var eatChess = innerChessData.chesses[sourceIndex];

                    recordPrice( innerEatPrices, getPrice( eatChess ) );

                    printDebug( " 吃" + eatChess );

                    canEat = true;
                }


                if ( canMove || canEat )
                {
                    // 紀錄第一步就好
                    if ( n == initN )
                    {
                        firstMoves[0] = sourceIndex;
                        firstMoves[1] = destIndex;
                    }

                    printDebug( " [" + n + ":m:" + sourceIndex + "->" + destIndex + "] " );


                    //printError( "[IN:" + n + "]" );
                    if ( walkOrEatByBestWay( innerChessData, getAnotherCamp( camp ), innerEatenPrices ) )
                    {
                        simAllWay( innerChessData, camp, innerEatPrices, innerEatenPrices, firstMoves, n - 1, initN );
                    }
                    else
                    {
                        saveSim( innerEatPrices, innerEatenPrices, firstMoves );
                    }

                }
            }

        }
    }
    else
    {
        saveSim( eatPrices, eatenPrices, firstMoves );

        printError( "][OVER]" );

    }

}








// 假設當前 index 這位子的棋子是 chess , 那麼是否有可以吃的對象
// 若有便回傳可吃棋子的權值，若沒有則回傳NOT_FOUND
function existSimEatChance( chessData, index, chess )
{
    var simChessData = copyChessData( chessData );
    var camp = getCamp( chess );


    // 指定 index 位置是 OPEN狀態的 chess .
    simChessData.chesses[index] = chess;
    simChessData.chessStates[index] = OPEN;

    for ( var i = 0; i < INDEX_LENGTH; i ++ )
    {
        if ( canEat( simChessData, i, index, camp ) )
        {
            return getPrice( simChessData.chesses[i] );
        }
    }

    return NOT_FOUND;
}


// 假設當前 index 這位子的棋子是 chess , 那麼是否有立即被吃的可能
function existSimEatenChance( chessData, index, chess )
{
    var simChessData = copyChessData( chessData );
    var camp = getCamp( chess );
    var enemyCamp = getAnotherCamp( camp ); // 敵方陣營

    // 指定 index 位置是 OPEN狀態的 chess .
    simChessData.chesses[index] = chess;
    simChessData.chessStates[index] = OPEN;

    for ( var i = 0; i < INDEX_LENGTH; i ++ )
    {
        if ( canEat( simChessData, index, i, enemyCamp ) )
        {
            return true;
        }
    }

    return false;
}


function simEat( camp )
{
    for ( var i = 0; i < INDEX_LENGTH; i ++ )
    {
        var moveData = newMoveData( i );

        if ( chessData.chessStates[i] == OPEN &&
             getCamp( chessData.chesses[i] ) == camp && // 己方翻開棋子
             findNormalEat( chessData, moveData, EAT_FIRST_PRINCIPLE ) )
        {

        }
    }
}



// 侵略性移動棋子
function findInvasiveWalk( chessData, moveData )
{
    var index = moveData.sourceIndex;
    var priority = INVASIVE_MOVE;
    var found = false;

    if ( higherPriority( moveData.priority, priority ) )
    {
        return false; // 若之前已有更高的移動權值，直接跳出。
    }

    var chess = chessData.chesses[index];
    var camp = getCamp( chess );
    var enemyCamp = getAnotherCamp( camp ); // 敵方陣營

    var existReachIndex = false; // 是否存在可到達的位置
    var neighborIndexs = getNeighborIndexs( index );
    var bestDistance = INDEX_LENGTH;
    var bestIndex = NOT_FOUND;
    var bestDirection = INIT_DIRECTION;
    var bestPrice = INIT_PRICE;

    initReachArea();
    setReachArea( chessData, chess, index )
    //printReachArea();

    for ( var i = 0; i < INDEX_LENGTH; i ++ )
    {
        if ( !isAround( i, index ) && // 鄰近要用其它來判斷
             canReach( i ) &&
             chessData.chessStates[i] == OPEN &&
             getCamp( chessData.chesses[i] )  == enemyCamp &&
             AeatB( chess, chessData.chesses[i] ) )
        {
            //printError( "目標是" + chessData.chesses[i] + ": " );
            var tempPrice = getPrice( chessData.chesses[i] );
            var tempDistance = getIndexDistance( index, i );
            var tempDirection = getIndexDirection( index, i );
            var tempIndex = neighborIndexs[tempDirection];

            if ( ( bestDistance > tempDistance ) ||
                 ( bestDistance == tempDistance && randomChoice() ) )
            {
                if ( allowIndex( tempIndex ) &&
                     ( canMove( chessData, tempIndex, index, camp ) ||
                       canEat( chessData, tempIndex, index, camp ) ) &&
                     !existSimEatenChance( chessData, tempIndex, chess ) ) // 移動到該處沒有立即危險
                {
                    printError( "目標是" + chessData.chesses[i] + ": " );
                    //printError( "　距離是" + tempDistance );
                    bestDistance = tempDistance;
                    bestDirection = tempDirection;
                    //printError( "　方向是" + bestDirection );

                    bestIndex = tempIndex;
                    bestPrice = tempPrice;

                    existReachIndex = true;
                }
            }
        }
    }

    if ( existReachIndex )
    {
        printError( " ~~~~~找到啦:" );

        printError( "位置:" + bestIndex );
        printError( "方向:" + bestDirection );
        moveData.destIndex = bestIndex;
        moveData.priority = priority;
        moveData.price = bestPrice;
        found = true;
    }

    return found;
}

// 此次可到達 index
function canReach( index )
{
    return ( gReachArea[index] == true );
}

function printReachArea()
{
    for ( var i = 0; i < gReachArea.length; i ++ )
    {
        printError( gReachArea[i] + "." );
    }

}

// 初始化gReachArea
function initReachArea()
{
    for ( var i = 0; i < gReachArea.length; i ++ )
    {
        gReachArea[i] = false;
    }
}

// 從sourceIndex出發，將可以走到的位置都紀錄在reachArea
function setReachArea( chessData, chess, sourceIndex )
{
    var neighborIndexs = getNeighborIndexs( sourceIndex );

    for ( var i = 0; i < 4; i ++ )
    {
        var index = neighborIndexs[i];

        if ( index == NOT_FOUND )
        {
            continue;
        }
        else if ( canReach( index ) ) // 已經標記過的就不走
        {
            continue;
        }
        else if ( chessData.chessStates[index] == CLOSE ) // 有覆蓋棋子也沒辦法走
        {
            continue;
        }
        else if ( chessData.chessStates[index] == OPEN &&
                  !AeatB( chess, chessData.chesses[index] ) ) // 若有無法吃的開起棋子也要繞道
        {
            continue;
        }

        gReachArea[index] = true;

        setReachArea( chessData, chess, index );
    }

}


// 目前蓋住的敵方棋子都沒辦法吃 rank 等級的己方棋子
function noOpenDangerous( chessData, rank, camp )
{
    var knownDangerousCount = 0; // 已經翻開或被吃的可吃我方rank的棋子數
    var allDangerousCount = 0; // 所有可吃我方rank的棋子數
    var enemyCamp = getAnotherCamp( camp ); // 敵方陣營

    if ( rank == RANK_GENERAL )
    {
        allDangerousCount = 5; // 將怕五個兵
    }
    else
    {
        allDangerousCount = ( RANK_GENERAL - rank ) * 2 + 1;
    }


    for ( var i = 0; i < gEatenBlockQueue.length; i ++ )
    {
        if ( chessData.gEatenBlockQueue[i] == OPEN &&
             getCamp( chessData.chesses[i] ) == enemyCamp &&
             getRank( chessData.chesses[i] ) > rank )
        {
            knownDangerousCount ++;
        }
    }

    var blackSize = getQueueSize( gEatenBlockQueue, INIT_EATEN_VALUE );
    var redSize = getQueueSize( gEatenRedQueue, INIT_EATEN_VALUE );


    if ( enemyCamp == BLACK )
    {
        // 黑方被吃棋子
        for ( var i = 0; i < blackSize; i ++ )
        {
            if ( getRank( getChess( gEatenBlockQueue[i], BLACK ) ) > rank )
            {
                knownDangerousCount ++;
            }
        }

    }
    else
    {
        // 紅方被吃棋子
        for ( var i = 0; i < redSize; i ++ )
        {
            if ( getRank( getChess( gEatenRedQueue[i], RED ) ) > rank )
            {
                knownDangerousCount ++;
            }
        }
    }

    return ( allDangerousCount == knownDangerousCount );
}



// 防禦性翻開棋子 ex. 將的斜角
function findDefensiveOpen( chessData, moveData, camp )
{
    var index = moveData.sourceIndex;
    var priority = DEFENSIVE_OPEN;
    var found = false;

    if ( higherPriority( moveData.priority, priority ) )
    {
        return false; // 若之前已有更高的移動權值，直接跳出。
    }

    var existGeneralDef = false;
    var price = INIT_PRICE;
    var enemyCamp = getAnotherCamp( camp ); // 敵方陣營

    for ( var i = 0; i < INDEX_LENGTH; i ++ )
    {
        var indexs = getBevelNeighborIndexs( index );

        for ( var j = 0; j < 4; j ++ )
        {
            if ( indexs[j] != NOT_FOUND &&
                 chessData.chessStates[indexs[j]] == OPEN &&
                 getRank( chessData.chesses[indexs[j]] ) == RANK_GENERAL &&
                 getCamp( chessData.chesses[indexs[j]] ) == camp &&
                 !cannonCanEaten( chessData, index, camp ) &&
                 !cannonCanEat( chessData, index, enemyCamp ) )
            {

                if ( existGeneralDef && randomChoice() )
                {
                    continue;
                }

                existGeneralDef = true;
                price = getPrice( chessData.chesses[indexs[j]] );
            }

        }
    }

    if ( existGeneralDef )
    {
        moveData.destIndex = index;
        moveData.priority = priority;
        moveData.price = price;
        found = true;
    }

    return found;
}

// 侵略性翻開棋子 ex. 炮旁邊, 相以上希望翻出炮來跳吃 .
function findInvasiveOpen( chessData, moveData, camp )
{
    var index = moveData.sourceIndex;
    var priority = INVASIVE_OPEN;
    var found = false;

    if ( higherPriority( moveData.priority, priority ) )
    {
        return false; // 若之前已有更高的移動權值，直接跳出。
    }

    var neighborIndexs = getNeighborIndexs( index );
    var enemyCamp = getAnotherCamp( camp ); // 敵方陣營

    var existCannon = false; // 鄰近位置有炮
    var existJumpEat = false; // 存在跳吃機會
    var existDangerous = false; // 鄰近位置有較大的敵方棋子

    var jumpEatPrice = INIT_PRICE;


    // 檢查鄰近位置是否有炮
    for ( var i = 0; i < 4; i ++ )
    {
        var enemyIndex = neighborIndexs[i];

        // 也檢查此處鄰近有無相以上的敵軍
        if ( enemyIndex != NOT_FOUND &&
             chessData.chessStates[enemyIndex] == OPEN &&
             getCamp( chessData.chesses[enemyIndex] ) == enemyCamp &&
             getRank( chessData.chesses[enemyIndex] ) == RANK_CANNON &&
             !existSimEatenChance( chessData, enemyIndex, getChess( RANK_MINISTER, camp ) ) )
        {
            if ( existCannon && randomChoice() )
            {
                continue;
            }

            existCannon = true;
        }
    }

    // 檢查是否有相士將在炮的射程內 .
    for ( var i = 0; i < INDEX_LENGTH; i ++ )
    {
        var enemyIndex = neighborIndexs[i];

        // 也檢查此處若翻開是砲，有無立即被吃危險
        if ( enemyIndex != NOT_FOUND &&
             chessData.chessStates[i] == OPEN &&
             getCamp( chessData.chesses[i] ) == enemyCamp &&
             getRank( chessData.chesses[i] ) >= RANK_MINISTER &&
             existOneInterval( chessData, i, index ) &&
             !cannonCanEaten( chessData, enemyIndex, camp ) )
        {
            var tempPrice = getPrice( chessData.chesses[i] );

            if ( jumpEatPrice <= tempPrice )
            {
                jumpEatPrice = tempPrice;
            }

            existJumpEat = true;
        }
    }

    // 檢查鄰近位置是否有較大的敵方棋子
    for ( var i = 0; i < 4; i ++ )
    {
        var enemyIndex = neighborIndexs[i];

        if ( enemyIndex != NOT_FOUND &&
             chessData.chessStates[enemyIndex] == OPEN &&
             getCamp( chessData.chesses[enemyIndex] ) == enemyCamp &&
             getRank( chessData.chesses[enemyIndex] ) > RANK_CAR )
        {
            existDangerous = true;
        }
    }

    if ( existCannon && !existDangerous )
    {
        moveData.destIndex = index;
        moveData.priority = priority;
        moveData.price = jumpEatPrice;
        found = true;
    }
    else if ( existCannon && !existDangerous )
    {
        moveData.destIndex = index;
        moveData.priority = priority;
        moveData.price = getPrice( getChess( RANK_CANNON, camp ) );
        found = true;
    }

    return found;
}

// 防禦性移動棋子
function findDefensiveMove( chessData, moveData )
{
    var index = moveData.sourceIndex;
    var priority = DEFENSIVE_MOVE;
    var found = false;

    if ( higherPriority( moveData.priority, priority ) )
    {
        return false; // 若之前已有更高的移動權值，直接跳出。
    }

    return found;
}

// 檢查index是否是死胡同
function noWayOut( chessData, index )
{
    var neighborIndexs = getNeighborIndexs( index );
    
    var wayCount = 0; // 出口數量
    
    for ( var i = 0; i < 4; i ++ )
    {
        var nIndex = neighborIndexs[i];
        if ( nIndex != NOT_FOUND && 
             chessData.chessStates[nIndex] == EATEN )
        {
            return false;
        }
    }
    
    return true;
}


// 棋子有被吃危險，嘗試逃脫
function findNormalEscape( chessData, moveData )
{
    var index = moveData.sourceIndex;
    var priority = NORMAL_ESCAPE;
    var found = false;

    if ( higherPriority( moveData.priority, priority ) )
    {
        return false; // 若之前已有更高的移動權值，直接跳出。
    }

    var price = getPrice( chessData.chesses[index] );
    var camp = getCamp( chessData.chesses[index] );
    var enemyCamp = getAnotherCamp( camp );

    var bestPrice = INIT_PRICE;
    var bestIndex = NOT_FOUND;

    // 有被吃危險的最佳作法
    var dangerousBestPrice = INIT_PRICE;
    var dangerousBestIndex = NOT_FOUND;
    var dangerousFound = false;
    var targetIndex = NOT_FOUND;
    
    var deadWay = true; // 檢查是否走了後會無路可逃

    for ( var i = 0; i < INDEX_LENGTH; i ++ )
    {
        // 若可能被鄰居吃的時候
        if ( canEat( chessData, index, i, enemyCamp ) )
        {
            printError( " 可能被吃: " );

            targetIndex = i;

            var tempMoveData2 = newMoveData( index );
            var tempMoveData3 = newMoveData( index );

            var beClear = false;

            var enemyPrice = getPrice( chessData.chesses[i] );


            // 若己方有棋子可以直接吃那顆具威脅的敵方棋子，那就不用逃脫了。
            if ( existSimEatenChance( chessData, i, chessData.chesses[i] ) )
            {
                printError( " DEAT " );
            }
            // 對方若吃，便會被我方吃 。
            else if ( enemyPrice >= price &&
                      existSimEatenChance( chessData, index, chessData.chesses[i] ) )
            {
                printError( " BOT " );
                // tell other function there exist a chess with price in balance of terror .
            }
            // 先找有無逃脫可能
            else if ( findWalk( chessData, tempMoveData2, NOT_ASSIGNED ) )
            {
                var tempDestIndex = tempMoveData2.destIndex;
                
                var tempDeadWay = noWayOut( chessData, tempDestIndex );
                
                // 有活路的走法就紀錄起來
                if ( !tempDeadWay )
                {
                    deadWay = false;
                }
                // 此走法沒活力，且之前有活路，那就不用考慮了
                else if ( !deadWay )
                {
                    continue;
                }

                if ( bestPrice < price )
                {
                    bestIndex = tempDestIndex;
                    bestPrice = price;

                    found = true;
                }
            }
            // 再找自殺吃棋的機會
            else if ( findNormalEat( chessData, tempMoveData3, EAT_FIRST_PRINCIPLE ) )
            {
                if ( ( bestPrice < tempMoveData3.price ) ||
                     ( bestPrice == tempMoveData3.price && randomChoice() ) )
                {
                    bestIndex = tempMoveData3.destIndex;
                    bestPrice = tempMoveData3.price;

                    found = true;
                }
            }

        }
    }

    if ( found )
    {
        moveData.priority = priority;
        moveData.price = bestPrice;
        moveData.destIndex = bestIndex;
        moveData.targetIndex = targetIndex;
    }


    return found;
}



// 嘗試吃棋子
function findNormalEat( chessData, moveData, principle )
{
    var index = moveData.sourceIndex;
    var priority = NORMAL_EAT;
    var found = false;

    if ( higherPriority( moveData.priority, priority ) )
    {
        return false; // 若之前已有更高的移動權值，直接跳出。
    }

    var rank = getRank( chessData.chesses[index] );
    var camp = getCamp( chessData.chesses[index] );
    var price = getPrice( chessData.chesses[index] );
    var enemyCamp = getAnotherCamp( camp );

    var bestPrice = INIT_PRICE;
    var bestIndex = NOT_FOUND;

    var existProtectToEat = false; // 為了保護己方棋子不被吃而吃對方

    var neighborIndexs;
    var moveLength = INDEX_LENGTH; // 砲要檢查所有位置
    var isCannon = getRank( chessData.chesses[index] ) == RANK_CANNON ? true : false;

    if ( !isCannon )
    {
        neighborIndexs = getNeighborIndexs( index );
        moveLength = 4; // 其餘棋子只需檢察四個鄰近方位
    }

    for ( var j = 0; j < moveLength; j ++ )
    {
        var destIndex = isCannon ? j : neighborIndexs[j];
        var tempChessData = copyChessData( chessData );
        var enemyPrice = getPrice( chessData.chesses[destIndex] );

        // 模擬吃之後的情形
        if ( eat( tempChessData, destIndex, index, camp ) )
        {
            // 此被吃棋B是否有機會可以直接吃我方某棋A，若有則檢查A權值是否比B大
            var tempEnemyPrice = existSimEatChance( chessData, destIndex, chessData.chesses[destIndex] );
            printDebug( " D:" + destIndex );

            if ( tempEnemyPrice != NOT_FOUND )
            {
                enemyPrice = tempEnemyPrice;
                existProtectToEat = true;

                //printDebug( ">" + bestPrice + enemyPrice );
            }

            // 檢查吃之後會不會有立即危險
            var beSafe = safeState( tempChessData, destIndex );

            if ( ( principle == SAFE_FIRST_PRINCIPLE && beSafe ) ||
                 ( principle == PRICE_FIRST_PRINCIPLE && ( beSafe || price <= enemyPrice ) ) ||
                 ( principle == EAT_FIRST_PRINCIPLE ) )
            {
                if ( ( bestPrice < enemyPrice ) ||
                     ( bestPrice == enemyPrice && tempEnemyPrice != NOT_FOUND ) ||
                     ( bestPrice == enemyPrice && randomChoice() && !existProtectToEat ) )
                {
                    printDebug( " " + index + " >> " +  destIndex + " " );

                    bestPrice = enemyPrice;
                    bestIndex = destIndex;

                    moveData.destIndex = bestIndex;
                    moveData.targetIndex = bestIndex;
                    moveData.priority = tempEnemyPrice != NOT_FOUND ? PROTECT_EAT : priority;
                    moveData.price = bestPrice;

                    found = true;
                }
            }
        }
    }

    return found;
}

function safeState( chessData, index )
{
    var camp = getCamp( chessData.chesses[index] );
    var enemyCamp = getAnotherCamp( camp );
    var beSafe = true;

    // 檢查吃之後會不會有立即危險
    for ( var k = 0; k < INDEX_LENGTH; k ++ )
    {
        if ( canEat( chessData, index, k, enemyCamp ) )
        {
            beSafe = false;
            break;
        }
    }

    return beSafe;
}

// return true or false in random .
function randomChoice()
{
    return ( parseInt( Math.random() * 2 ) == 1 );
}

// 嘗試移動去吃棋
function findWalkToEat( chessData, moveData )
{
    var index = moveData.sourceIndex;
    var priority = WALK_TO_EAT;
    var found = false;

    if ( higherPriority( moveData.priority, priority ) )
    {
        return false; // 若之前已有更高的移動權值，直接跳出。
    }

    var chess = chessData.chesses[index];
    var camp = getCamp( chess );
    var enemyCamp = getAnotherCamp( camp );

    var nowIndex = index;
    var bestPrice = INIT_PRICE;
    var bestIndex = NOT_FOUND;
    var targetIndex = NOT_FOUND;
    var beSafe = true;

    var enemyChess;

    for ( var i = 0; i < 4; i ++ )
    {
        var tempChessData = copyChessData( chessData );
        var tempMoveData = newMoveData( index );
        var tempDestIndex = NOT_FOUND;

        // 走一步
        if ( allowIndex( i ) && findWalk( tempChessData, tempMoveData, i ) )
        {
            if ( move( tempChessData, tempMoveData.destIndex, tempMoveData.sourceIndex, camp ) )
            {
                tempDestIndex = tempMoveData.destIndex;
                tempMoveData = newMoveData( tempDestIndex );
            }
            else
            {
                continue;
            }

            // 有吃的機會
            if ( findNormalEat( tempChessData, tempMoveData, PRICE_FIRST_PRINCIPLE ) )
            {
                enemyChess = tempChessData.chesses[tempMoveData.destIndex];

                var enemyPrice = getPrice( enemyChess );

                if ( findAnyNormalEscape( tempChessData, enemyPrice, camp ) )
                {
                }
                else if ( ( bestPrice < enemyPrice ) ||
                          ( bestPrice == enemyPrice && randomChoice() ) )
                {
                    targetIndex = tempMoveData.targetIndex;
                    bestPrice = enemyPrice;
                    bestIndex = tempDestIndex;


                    found = true;
                }
            }
        }
    }


    if ( found )
    {

        // 追殺行為已經持續太久了
        if ( sameTrace( chess, enemyChess ) &&
             getTraceTimes() > MAX_TRACE_TIMES && // 不能追超過
             getLiveChessCount( chessData, camp ) > 1 ) // 只剩一個棋子，當然不戰不休
        {
            printError( "追殺超過" + MAX_TRACE_TIMES + "次了" );

            setNoTraceIndex( bestIndex ); // 標記此位置，讓其它方法也走不到此處
            return false;
        }

        clearNoTraceIndex(); // 把之前禁止走的位置紀錄清掉

        gNowTempTracer = chess;
        gNowTempTraced = enemyChess;

        moveData.destIndex = bestIndex;
        moveData.price = bestPrice;
        moveData.priority = priority;
        moveData.targetIndex = targetIndex;
    }

    return found;
}


// 取得 camp 陣營目前仍存活的棋子數量
function getLiveChessCount( chessData, camp )
{
    var eatenCount = 0;

    for ( var i = 0; i < INDEX_LENGTH; i ++ )
    {
        if ( chessData.chessStates[i] == EATEN &&
             getCamp( chessData.chesses[i] ) == camp )
        {
            eatenCount ++;
        }
    }

    return ( INDEX_LENGTH / 2 ) - eatenCount;
}

// temp delete . 2013.3.2 .
// return true if exist any chess with (price + n, n>=0) sould escape .
function findAnyNormalEscape( chessData, price, camp )
{
    for ( var i = 0; i < INDEX_LENGTH; i ++ )
    {
        var tempCamp = getCamp( chessData.chesses[i] );

        if ( tempCamp == camp )
        {
            var tempMoveData = newMoveData( i );

            if ( findNormalEscape( chessData, tempMoveData ) )
            {
                if ( tempMoveData.price >= price )
                {
                    return true;
                }
            }

        }

    }

    return false;
}

// 沒有立即危險的移動
function findWalk( chessData, moveData, direction )
{

    var index = moveData.sourceIndex;
    var priority = WALK;
    var found = false;

    if ( higherPriority( moveData.priority, priority ) )
    {
        return false; // 若之前已有更高的移動權值，直接跳出。
    }


    var camp = getCamp( chessData.chesses[index] );
    var enemyCamp = getAnotherCamp( camp );
    var price = getPrice( chessData.chesses[index] );
    var beSafe = true;

    // 找出鄰近位置
    var neighborIndexs = getNeighborIndexs( index );

    for ( var i = 0; i < 4; i ++ )
    {
        var tempChessData = copyChessData( chessData );

        if ( allowIndex( i ) &&
             ( direction == NOT_ASSIGNED || direction == i ) &&
             move( tempChessData, neighborIndexs[i], index, camp ) ) // 嘗試移動到鄰近空位
        {
            beSafe = safeState( tempChessData, neighborIndexs[i] ) ;

            if ( beSafe && !findAnyNormalEscape( tempChessData, 0, camp ) )
            {
                if ( found && randomChoice() )
                {
                    continue;
                }

                moveData.destIndex = neighborIndexs[i];
                moveData.priority = priority;
                moveData.price = price;

                found = true;
            }
        }

    }

    return found;
}



// 只要有蓋著的棋子就選
function findDangerousOpen( chessData, moveData )
{
    var index = moveData.sourceIndex;
    var priority = DANGEROUS_OPEN;
    var found = false;

    if ( higherPriority( moveData.priority, priority ) )
    {
        return false; // 若之前已有更高的移動權值，直接跳出。
    }


    var camp = getCamp( chessData.chesses[index] );

    for ( var i = 0; i < INDEX_LENGTH; i ++ )
    {
        if ( allowIndex( i ) && canOpen( chessData, i ) )
        {
            if ( found && randomChoice() )
            {
                continue;
            }

            moveData.priority = priority;
            moveData.destIndex = i;

            found = true;
        }
    }

    return found;
}

// 只要有能吃的棋子就選
function findDangeroursEat( chessData, moveData )
{
    var index = moveData.sourceIndex;
    var priority = DANGEROUS_EAT;
    var found = false;

    if ( higherPriority( moveData.priority, priority ) )
    {
        return false; // 若之前已有更高的移動權值，直接跳出。
    }

    var camp = getCamp( chessData.chesses[index] );
    var enemyPrice = -1;

    var neighborIndexs;
    var moveLength = INDEX_LENGTH; // 砲要檢查所有位置
    var isCannon = getRank( chessData.chesses[index] ) == RANK_CANNON ? true : false;

    if ( !isCannon )
    {
        neighborIndexs = getNeighborIndexs( index );
        moveLength = 4; // 其餘棋子只需檢察四個鄰近方位
    }

    for ( var i = 0; i < moveLength; i ++ )
    {
        var destIndex = isCannon ? i : neighborIndexs[i];

        if ( allowIndex( destIndex ) && canEat( chessData, destIndex, index, camp ) )
        {
            var tempPrice = getPrice( chessData.chesses[destIndex] );

            if ( ( enemyPrice < tempPrice ) ||
                 ( enemyPrice == tempPrice && randomChoice() ) )
            {
                enemyPrice = tempPrice;
                moveData.price = enemyPrice;
                moveData.priority = priority;
                moveData.destIndex = destIndex;

                found = true;
            }
        }
    }

    return found;
}

// 只要有能走的棋子就選
function findDangerousWalk( chessData, moveData )
{
    var index = moveData.sourceIndex;
    var priority = DANGEROUS_WALK;
    var found = false;

    if ( higherPriority( moveData.priority, priority ) )
    {
        return false; // 若之前已有更高的移動權值，直接跳出。
    }

    var camp = getCamp( chessData.chesses[index] );
    var price = getPrice( chessData.chesses[index] );

    for ( var i = 0; i < INDEX_LENGTH; i ++ )
    {
        if ( allowIndex( i ) && canMove( chessData, i, index, camp ) )
        {
            if ( found && randomChoice() )
            {
                continue;
            }

            moveData.price = price;
            moveData.priority = priority;
            moveData.destIndex = i;

            found = true;
        }
    }

    return found;
}



// 檢查p1的權值是否比p2高
function higherPriority( p1, p2 )
{
    return ( p1 < p2 && getGap( p1, p2 ) > ( AI_PRIORITY_OFFSET / 2 ) ) ;
}

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

// 存在任何吃的機會
function existAnySimEatChance( chessData, index, camp )
{
    return ( ( existCloseChess( chessData, getChess( RANK_SOLDIER, camp ) ) &&
               existSimEatChance( chessData, index, getChess( RANK_SOLDIER, camp ) ) != NOT_FOUND ) ||
             ( existCloseChess( chessData, index, getChess( RANK_CANNON, camp ) ) &&
               existSimEatChance( chessData, index, getChess( RANK_HORSE, camp ) ) != NOT_FOUND ) );
}

// 3. openToEat :
// for cannon or duke
function findOpenToEat( chessData, moveData )
{
    var index = moveData.sourceIndex;
    var priority = OPEN_TO_EAT;
    var found = false;

    if ( higherPriority( moveData.priority, priority ) )
    {
        return false; // 若之前已有更高的移動權值，直接跳出。
    }

    var price = INIT_PRICE;
    var chess = chessData.chesses[index]; // index位置的棋子名稱
    var camp = getCamp( chess ); // index位置的棋子陣營
    var enemyCamp = getAnotherCamp( camp ); // 敵方陣營

    if ( getRank( chessData.chesses[index] ) == RANK_CANNON ) // 包炮
    {
        for ( var i = 0; i < INDEX_LENGTH; i ++ )
        {
            if ( chessData.chessStates[i] == CLOSE &&
                 allNeighborsNotInState( chessData, i, EATEN ) &&
                 existOneInterval( chessData, index, i ) &&
                 !existAnySimEatChance( chessData, index, enemyCamp ) )
            {
                if ( found && randomChoice() )
                {
                    continue;
                }

                moveData.destIndex = i;
                moveData.priority = priority;
                moveData.price = PRICE_CAR; // 假設翻開有車的價值

                found = true;
                break;
            }
        }
    }
    else if ( getRank( chessData.chesses[index] ) == RANK_MINISTER ||
              getRank( chessData.chesses[index] ) == RANK_SCHOLAR ) // 士仕 或 象相
    {
        // 找出鄰近蓋住的棋子
        var matchNeighborIndexs = getNeighborIndexsInState( chessData, index, CLOSE );

        // 回傳符合的棋子位置
        for ( var i = 0; i < 4; i ++ )
        {
            var nowIndex = matchNeighborIndexs[i];

            // 有此鄰居，且即使此鄰居是砲或兵也吃不到我方棋子
            if ( nowIndex != NOT_FOUND &&
                 !cannonCanEat( chessData, nowIndex, enemyCamp ) &&
                 !existSimEatChance( chessData, index, getChess( RANK_SOLDIER, enemyCamp ) ) && 
                 // check if it is dangerous after we eat it .
                 !existSimEatenChance( chessData, nowIndex, chess ) )
            {
                if ( found && randomChoice() )
                {
                    continue;
                }

                moveData.destIndex = matchNeighborIndexs[i];
                moveData.priority = priority;
                moveData.price = PRICE_HORSE; // 假設翻開有馬的價值

                found = true;
                break;
            }
        }
    }

    return found;
}

// 找出對面位置的 matchNeighborIndexs[i]
function getOppositeNeighbor( i )
{
    if ( i == 0 )
    {
        return 2;
    }
    else if ( i == 1 )
    {
        return 3;
    }
    else if ( i == 2 )
    {
        return 0;
    }
    else if ( i == 3 )
    {
        return 1;
    }

}



// 4. safeOpen :
// open chess no close to our army
function findSafeOpen( chessData, moveData, camp )
{
    var index = moveData.sourceIndex;
    var priority = SAFE_OPEN;
    var found = false;

    if ( higherPriority( moveData.priority, priority ) )
    {
        return false; // 若之前已有更高的移動權值，直接跳出。
    }

    var enemyCamp = getAnotherCamp( camp ); // 敵方陣營

    // 鄰近位置若在棋盤內，則必須是蓋住棋子或沒有棋子
    if ( allNeighborsNotInState( chessData, index, OPEN ) )
    {
        var tempChessData = copyChessData( chessData );

        // 假設此處被翻開是我方砲，有沒有可能被吃？
        // 假設此處被翻開是敵方砲，有沒有可能吃我方？
        if ( !cannonCanEaten( chessData, index, camp ) &&
             !cannonCanEat( chessData, index, enemyCamp ) )
        {
            moveData.destIndex = index;
            moveData.priority = priority;

            found = true;

        }
    }


    return found;
}



// 所有身為敵軍的鄰居都比rank小
function allNeighborsAreSmaller( chessData, index, rank )
{
    var neighborIndexs = getNeighborIndexs( index );
    var chess = chessData.chesses[index]; // index位置的棋子名稱
    var camp = getCamp( chess ); // index位置的棋子陣營

    for ( var i = 0; i < 4; i ++ )
    {
        if ( neighborIndexs[i] != NOT_FOUND &&
             chessData.chessStates[neighborIndexs[i]] == OPEN &&
             getRank( chessData.chesses[neighborIndexs[i]] ) == camp &&
             getRank( chessData.chesses[neighborIndexs[i]] ) >= rank )
        {
            return false;
        }
    }

    return true;
}

// 取得斜角鄰居的位置
function getBevelNeighborIndexs( index )
{
    var pos = getPos( index );
    var x = pos[0];
    var y = pos[1];

    var neighborIndexs = new Array( 4 );
    neighborIndexs[0] = getIndex( x + 1, y + 1 );
    neighborIndexs[1] = getIndex( x + 1, y - 1 );
    neighborIndexs[2] = getIndex( x - 1, y + 1 );
    neighborIndexs[3] = getIndex( x - 1, y - 1 );

    return neighborIndexs;
}

// 取得東西南北鄰近的位置
function getNeighborIndexs( index )
{
    var pos = getPos( index );
    var x = pos[0];
    var y = pos[1];

    var neighborIndexs = new Array( 4 );
    neighborIndexs[0] = getIndex( x + 1, y );
    neighborIndexs[1] = getIndex( x - 1, y );
    neighborIndexs[2] = getIndex( x, y + 1 );
    neighborIndexs[3] = getIndex( x, y - 1 );

    return neighborIndexs;
}

// 取得符合狀態的鄰居位置
function getNeighborIndexsInState( chessData, index, state )
{
    var neighborIndexs = getNeighborIndexs( index );
    var matchNeighborIndexs = new Array( 4 );

    for ( var i = 0; i < 4; i ++ )
    {
        if ( neighborIndexs[i] != NOT_FOUND && chessData.chessStates[neighborIndexs[i]] == state )
        {
            matchNeighborIndexs[i] = neighborIndexs[i];
        }
        else
        {
            matchNeighborIndexs[i] = NOT_FOUND;
        }
    }

    return matchNeighborIndexs;
}


// 所有鄰居都不是state狀態
function allNeighborsNotInState( chessData, index, state )
{
    var neighborIndexs = getNeighborIndexs( index );

    for ( var i = 0; i < 4; i ++ )
    {
        if ( neighborIndexs[i] != NOT_FOUND && chessData.chessStates[neighborIndexs[i]] == state )
        {
            return false;
        }
    }

    return true;
}


// 所有鄰居都是state狀態
function allNeighborsInState( chessData, index, state )
{
    var neighborIndexs = getNeighborIndexs( index );

    for ( var i = 0; i < 4; i ++ )
    {
        if ( neighborIndexs[i] != NOT_FOUND && chessData.chessStates[neighborIndexs[i]] != state )
        {
            return false;
        }
    }

    return true;
}







// 設置翻開的棋子的權值
function getMoveDataForOpenChess( chessData, index, camp )
{
    var moveData = newMoveData( index );
    findNormalEat( chessData, moveData, PRICE_FIRST_PRINCIPLE );
    findNormalEscape( chessData, moveData );
    findNormalEat( chessData, moveData, PRICE_FIRST_PRINCIPLE );

    findWalkToEat( chessData, moveData );
    findOpenToEat( chessData, moveData );
    findInvasiveWalk( chessData, moveData );
    findWalk( chessData, moveData, NOT_ASSIGNED );
    findDangeroursEat( chessData, moveData );
    findDangerousWalk( chessData, moveData );


    return moveData;
}

// 設置還沒翻開的棋子的權值
function getMoveDataForCloseChess( chessData, index, camp )
{
    var moveData = newMoveData( index );

    findInvasiveOpen( chessData, moveData, camp );
    findDefensiveOpen( chessData, moveData, camp );
    findSafeOpen( chessData, moveData, camp );
    findDangerousOpen( chessData, moveData );

    return moveData;
}


// 設置棋盤上cmap陣營所有翻開棋子的權值
function setAllOpenMoveData( chessData, camp )
{
    var allOpenMoveData = new Array( INDEX_LENGTH );

    try
    {
        for ( var i = 0; i < INDEX_LENGTH; i ++ )
        {
            if ( chessData.chessStates[i] == OPEN && getCamp( chessData.chesses[i] ) == camp ) // 己方翻開棋子
            {
                allOpenMoveData[i] = getMoveDataForOpenChess( chessData, i, camp );
            }
        }
    }
    catch ( err )
    {
        errorMessage.innerHTML += "發生錯誤: " + err.stack + "<br>";
    }

    return allOpenMoveData;
}


// 設置棋盤上camp陣營所有棋子的權值 (包含蓋著的棋子)
function setAllMoveData( chessData, camp )
{
    var allMoveData = new Array( INDEX_LENGTH );


    try
    {

        for ( var i = 0; i < INDEX_LENGTH; i ++ )
        {
            if ( chessData.chessStates[i] == CLOSE ) // 蓋著的棋子
            {
                allMoveData[i] = getMoveDataForCloseChess( chessData, i, camp );
            }
            else if ( chessData.chessStates[i] == OPEN && getCamp( chessData.chesses[i] ) == camp ) // 己方翻開棋子
            {
                allMoveData[i] = getMoveDataForOpenChess( chessData, i, camp );
            }
            else
            {
                allMoveData[i] = getEmptyMoveData( i );
            }
        }

    }
    catch ( err )
    {
        errorMessage.innerHTML += "發生錯誤: " + err.stack + "<br>";
    }

    return allMoveData;
}

function getPriorityName( priority )
{
    if ( priority == EAT_FIRST )
    {
        return "EAT_FIRST";
    }

    else if ( priority == ESCAPE_FIRST )
    {
        return "ESCAPE_FIRST";
    }
    else if ( priority == SAFE_EAT )
    {
        return "SAFE_EAT";
    }
    else if ( priority == NORMAL_EAT )
    {
        return "NORMAL_EAT";
    }
    else if ( priority == NORMAL_ESCAPE )
    {
        return "NORMAL_ESCAPE";
    }
    else if ( priority == WALK_TO_EAT )
    {
        return "WALK_TO_EAT";
    }
    else if ( priority == OPEN_TO_EAT )
    {
        return "OPEN_TO_EAT";
    }
    else if ( priority == SAFE_OPEN )
    {
        return "SAFE_OPEN";
    }
    else if ( priority == WALK )
    {
        return "WALK";
    }
    else if ( priority == DANGEROUS_OPEN )
    {
        return "DANGEROUS_OPEN";
    }
    else if ( priority == DANGEROUS_EAT )
    {
        return "DANGEROUS_EAT";
    }
    else if ( priority == DANGEROUS_WALK )
    {
        return "DANGEROUS_WALK";
    }

    else if ( priority == INVASIVE_OPEN )
    {
        return "INVASIVE_OPEN";
    }
    else if ( priority == INVASIVE_MOVE )
    {
        return "INVASIVE_MOVE";
    }
    else if ( priority == DEFENSIVE_OPEN )
    {
        return "DEFENSIVE_OPEN";
    }
    else if ( priority == DEFENSIVE_MOVE )
    {
        return "DEFENSIVE_MOVE";
    }
    else
    {
        return "NONE";
    }

}



// 取得與camp相反的陣營
function getAnotherCamp( camp )
{
    return camp == BLACK ? RED : BLACK;
}


function getBestMoveDataIndex( allMoveData )
{
    var bestPriority = INIT_PRIORITY;
    var bestPrice = INIT_PRICE;
    var bestIndex = NOT_FOUND;

    // 找出最高權值
    for ( var i = 0; i < allMoveData.length; i ++ )
    {
        if ( allMoveData[i] != null && allMoveData[i].priority != INIT_PRIORITY )
        {
            // 1. 相同層級的移動權值，就比較被吃或要吃的棋子權值
            // 2. the case of walk to eat compare with the case of normal escape .
            if ( ( getGap( allMoveData[i].priority, bestPriority ) < AI_PRIORITY_OFFSET * 0.8 ) ||
                 ( bestPriority == NORMAL_ESCAPE && allMoveData[i].priority == WALK_TO_EAT ) )
            {
                // 危險行走或逃脫時要選權值最小的
                if ( bestPriority == DANGEROUS_WALK )
                {
                    if ( bestPrice == NOT_FOUND )
                    {
                        bestPrice = allMoveData[i].price;
                    }
                    else if ( bestPrice > allMoveData[i].price )
                    {
                        bestPrice = allMoveData[i].price;
                    }
                }
                else if ( allMoveData[i].price > bestPrice )
                {
                    bestPrice = allMoveData[i].price;
                    bestIndex = i;
                }
                else if ( allMoveData[i].price == bestPrice )
                {
                    if ( //( bestPriority == NORMAL_EAT && allMoveData[i].priority == NORMAL_ESCAPE ) ||
                        ( bestPriority == NORMAL_EAT && allMoveData[i].priority == PROTECT_EAT ) ||
                        ( bestPriority == WALK_TO_EAT && sameXorY( allMoveData[i].targetIndex, allMoveData[i].sourceIndex ) ) ||
                        ( bestPriority != WALK_TO_EAT && allMoveData[i].price == bestPrice && randomChoice() ) )
                    {
                        bestPrice = allMoveData[i].price;
                        bestIndex = i;
                    }
                }

            }
            // 不同層級的移動權值
            else if ( higherPriority( allMoveData[i].priority,  bestPriority ) )
            {
                bestPrice = allMoveData[i].price;
                bestIndex = i;
                bestPriority = allMoveData[i].priority;
            }


        }

    }

    printError( " 最終: " + getPriorityName( bestPriority ) );

    if ( bestPriority == WALK_TO_EAT )
    {
        printError( "<br>" + gNowTempTracer + " trace " + gNowTempTraced + "<br>" );
        setTrace( gNowTempTracer, gNowTempTraced ); // 設置追殺行為
    }

    return bestIndex;
}


// AI走路，回傳要移動的路線：move[2]: 從move[0]移動到move[1]
function moveByAI( chesses, chessStates, camp )
{



    var moves = new Array( 2 );

    var record = "";
    var chessData = copyChessData( getNowChessData() );

    var chessData2 = copyChessData( chessData );

    var allMoveData = setAllMoveData( chessData, camp ); // 取得所有可行動位置的權值
    var bestIndex = getBestMoveDataIndex( allMoveData ); // 取得最佳的行動


    if ( bestIndex == NOT_FOUND )
    {
        printError( "找不到 !! " );
        alert( "找不到 !! " );

        moves[0] = NOT_FOUND;
        moves[1] = NOT_FOUND;
        return moves;
    }

    printError( getCampName( camp ) );
    printError( gChesses[allMoveData[bestIndex].sourceIndex] +  allMoveData[bestIndex].sourceIndex + " -> " +
                gChesses[allMoveData[bestIndex].destIndex] + allMoveData[bestIndex].destIndex + "   " );


    moves[0] = allMoveData[bestIndex].sourceIndex;
    moves[1] = allMoveData[bestIndex].destIndex;


    return moves;
}



