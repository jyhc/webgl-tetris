const lineHeight = 20.0;
const lineWidth = 10.0;
const unitHeight = round(2.0/lineHeight,3);
const unitWidth = round(2.0/lineWidth, 3);

const current_tile = 0;
const renderQueue = new Array();

//to help eliminate float precision errors
function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

//available pieces
var gamePieces = ['o', 'i', 's', 'z', 'l', 'j', 't'];