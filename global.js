const lineHeight = 20.0;
const lineWidth = 10.0;
const unitHeight = round(2.0/lineHeight,3);
const unitWidth = round(2.0/lineWidth, 3);

const current_tile = 0;
const renderQueue = new Array();

var programInfo;
var gl;

//to help eliminate float precision errors
function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

//available pieces
const gamePieces = ['o', 'i', 's', 'z', 'l', 'j', 't'];

//piece location tracking; 1 extra row to represent bottom of screen
gridState = new Array();
{
    gridState.push(new Array(true, true, true, true, true, true, true, true, true, true, true, true));
    for(var i = 0; i < 20; i++){
        gridState.push(new Array(true, false, false, false, false, false, false, false, false, false, false, true));
    }
    gridState.push(new Array(true, true, true, true, true, true, true, true, true, true, true, true));
}

function resetGridState(){
    gridState = new Array();
    gridState.push(new Array(true, true, true, true, true, true, true, true, true, true, true, true));
    for(var i = 0; i < 20; i++){
        gridState.push(new Array(true, false, false, false, false, false, false, false, false, false, false, true));
    }
    gridState.push(new Array(true, true, true, true, true, true, true, true, true, true, true, true));
}
