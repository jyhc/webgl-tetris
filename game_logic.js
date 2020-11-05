//create keyboard input listener
function keyEventListener() {
	document.addEventListener('keydown', (event) => {
        keyAction(event);
	});
}

//action to be performed based on keypress
function keyAction(event){
    //left arrow key
    if(event.code == 'ArrowLeft'){
        positions[5]-=0.01;
    } else if (event.code == 'ArrowRight'){
        positions[5]+=0.01;
    } else if (event.code == 'ArrowUp'){

    } else if (event.code == 'ArrowUp'){

    }
}