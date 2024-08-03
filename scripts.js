const socket = new WebSocket('ws://localhost:3000');
socket.onmessage = handleServerMessage;


function sendMessageToServer(message) {
    socket.send(message);
}

function takepicture() {
    var width = document.getElementById('vid').offsetWidth;
    var height = document.getElementById('vid').offsetHeight;
    console.log(width);
    console.log(height);
    canvas = document.getElementById('canvas')
    const context = canvas.getContext("2d");
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(vid, 0, 0, width, height);

        const data = canvas.toDataURL("image/png");
        photo.setAttribute("src", data);
        console.log(data);
    }
}
function playerMove(x, y) {
    if (playerBoard[y][x] === 0) {
        playerBoard[y][x] = 3; // Mark as miss
        drawBoards();
    } else if (playerBoard[y][x] === 1) {
        playerBoard[y][x] = 2; // Mark as hit
        drawBoards();
        if (checkGameOver(playerShips, playerBoard)) {
            alert("You lose!");
            canvas.removeEventListener('click', handleCanvasClick);
            const gameOver = { type: 'victory' };
            sendMessageToServer(JSON.stringify(gameOver)); // send gameover message to server indicating that this player has lost
        }
    }
    const isHit = playerBoard[y][x]
    const response = { type: 'response', message: isHit, x: x, y: y }; // Send response back to server with whether the shot was a hit or miss and the coordinates corresponding
    console.log(`${isHit}, Coords: ${x}, ${y}`)
    sendMessageToServer(JSON.stringify(response));
    isPlayerTurn = false; // Change turns
}

function handleServerMessage(event) {
    const message = JSON.parse(event.data);

    switch (message.type) {
        case 'start': // Starts the game 
            console.log(message.message);
            break;

        case 'victory':// If the player receives a victory message
            canvas.removeEventListener('click', handleCanvasClick);
            console.log(`Player wins! ${message}`);
            const defeat = { type: 'defeat' } // Send indiciation that other side has lost to other player
            sendMessageToServer(JSON.stringify(defeat));
            alert("You win!");
            break;

        case 'defeat':// If the player receives a defeat message
            canvas.removeEventListener('click', handleCanvasClick);
            console.log(`You lose! ${message}`);
            alert("You Lose!");
            break;

    }
}

//Slideshow Gallery 
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}
