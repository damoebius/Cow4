import org.tamina.log.QuickLogger;
import createjs.easeljs.Point;


class MapGen {

    private static inline var NB_DIRECTION_MAX  :Int    = 4;
    private static inline var END_POS           :Point  = new Point( MAX_WIDTH, MAX_HEIGHT );
    private static inline var MAX_WIDTH         :Int    = 10;
    private static inline var MAX_HEIGHT        :Int    = 10;

    private static inline var MAP               :Array<Array<Int>>; //TODO init map with all wall

    // Possibles directions
    private static inline var UP    :Int = 0;
    private static inline var RIGHT :Int = 1;
    private static inline var DOWN  :Int = 2;
    private static inline var LEFT  :Int = 3;


    function generate(actualPosition:Point, oldPositions:Array<Point>):Array<Array<Int>>{
        // init possible direction
        var possibleBoxes = getAllPossibleBoxes( actualPosition, oldPositions);

        var nbPossibeBoxes = NB_DIRECTION_MAX;
        for (i in 0...NB_DIRECTION_MAX){
            if (possibleBoxes[i] == false){
                nbPossibeBoxes--;
            }
        }

        if (nbPossibeBoxes == 0) {
            if (actualPosition != END_POS){
                generate( oldPositions.pop(), oldPositions);
            }else{
                return MAP;
            }
        }else{
            var randWall = Std.random(NB_DIRECTION_MAX);
            while (!possibleBoxes[randWall]){
                randWall = Std.random(NB_DIRECTION_MAX);
            }
            switch(randWall){
                case UP:
                    MAP[actualPosition.x][actualPosition.y - 1] = 0;
                    oldPositions.push(actualPosition);
                    actualPosition = new Point(actualPosition.x, actualPosition.y - 1);
                    break;
                case RIGHT:
                    MAP[actualPosition.x + 1][actualPosition.y] = 0;
                    oldPositions.push(actualPosition);
                    actualPosition = new Point(actualPosition.x + 1, actualPosition.y);
                    break;
                case DOWN:
                    MAP[actualPosition.x][actualPosition.y + 1] = 0;
                    oldPositions.push(actualPosition);
                    actualPosition = new Point(actualPosition.x, actualPosition.y + 1);
                    break;
                case LEFT:
                    MAP[actualPosition.x - 1][actualPosition.y] = 0;
                    oldPositions.push(actualPosition);
                    actualPosition = new Point(actualPosition.x - 1, actualPosition.y);
                    break;
            }
            generate( actualPosition, oldPositions );
        }
    }

    function getAllPossibleBoxes( actualPos:Point, oldPos:Array<Point> ):Array<Bool>{
        var possibleBoxes:Array<Bool> = [for (i in 0...NB_DIRECTION_MAX){ return false; }];
       /**  TODO **/
        return possibleBoxes;
    }

   function isSurroundedByWalls(wallPosition:Point, excludedWallPosition:Point, possibleWalls:Array<Bool>):Bool{
       return (
           (!possibleWalls[RIGHT]  || MAP[wallPosition.x + 1][wallPosition.y] == 1 || wallPosition.x + 1 == excludedWallPosition.x) &&
           (!possibleWalls[LEFT]   || MAP[wallPosition.x - 1][wallPosition.y] == 1 || wallPosition.x - 1 == excludedWallPosition.x) &&
           (!possibleWalls[DOWN]   || MAP[wallPosition.x][wallPosition.y + 1] == 1 || wallPosition.y + 1 == excludedWallPosition.y) &&
           (!possibleWalls[UP]     || MAP[wallPosition.x][wallPosition.y - 1] == 1 || wallPosition.y - 1 == excludedWallPosition.y)
       );
   }

}

