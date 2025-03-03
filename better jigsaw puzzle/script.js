
//puzzle
window.onload = function () {
    const puzzleContainer = document.getElementById('puzzle-container');
    const imageUrl = 'puzzle.png';  // Updated image source

    const rows = 5;  // 5 rows
    const cols = 5;  // 5 columns
    const puzzleWidth = 1080;  // Puzzle width
    const puzzleHeight = 640;  // Puzzle height
    const pieceWidth = puzzleWidth / cols;  // Width of each puzzle piece
    const pieceHeight = puzzleHeight / rows;  // Height of each puzzle piece

    let pieces = [];
    let positions = [];
    let swapCount = 0;  // Counter to track number of swaps

    // Function to shuffle the pieces
    function shufflePieces() {
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]]; // Swap positions
        }
    }

    // Function to generate the puzzle
    function generatePuzzle() {
        let pieceIndex = 0;

        // Create puzzle pieces and store them
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const piece = document.createElement('div');
                piece.classList.add('puzzle-piece');

                // Set the background image and position for each piece
                piece.style.backgroundImage = `url(${imageUrl})`;
                piece.style.backgroundSize = `${puzzleWidth}px ${puzzleHeight}px`; // Size should match the full image size
                piece.style.backgroundPosition = `-${col * pieceWidth}px -${row * pieceHeight}px`; // Correct background positioning

                // Set the size of each piece
                piece.style.width = `${pieceWidth}px`;
                piece.style.height = `${pieceHeight}px`;

                // Store each piece with its initial top-left positions
                positions.push({ piece, row, col });

                pieces.push(piece); // Store the piece in the pieces array
                pieceIndex++;
            }
        }

        // Shuffle the positions array
        shufflePieces();

        // Place the shuffled pieces in the container
        positions.forEach((position, index) => {
            const { piece, row, col } = position;

            // Set the new top-left positions based on shuffled order
            piece.style.top = `${Math.floor(index / cols) * pieceHeight}px`;
            piece.style.left = `${(index % cols) * pieceWidth}px`;

            // Add absolute positioning for proper dragging
            piece.style.position = 'absolute'; // Ensure absolute positioning for dragging

            // Append each piece to the container
            puzzleContainer.appendChild(piece);

            // Make the pieces draggable
            piece.setAttribute('draggable', true);
            piece.setAttribute('data-id', index);

            piece.addEventListener('dragstart', onDragStart);
            piece.addEventListener('dragover', onDragOver);
            piece.addEventListener('drop', onDrop);
            piece.addEventListener('dragenter', onDragEnter);
            piece.addEventListener('dragleave', onDragLeave);
            piece.addEventListener('dragend', onDragEnd);
        });
    }

    // Function for handling drag start
    function onDragStart(e) {
        console.log('Drag Start', e.target.dataset.id);
        e.dataTransfer.setData('text', e.target.dataset.id); // Store the index of the dragged piece
        e.target.style.opacity = '0.4'; // Make the dragged piece slightly transparent

        // Calculate the mouse offset (to avoid the jumping issue)
        const rect = e.target.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        // Store the offsets to position the piece correctly while dragging
        e.target.dataset.offsetX = offsetX;
        e.target.dataset.offsetY = offsetY;

        // Set initial styles for proper dragging behavior
        e.target.style.position = 'absolute';
        e.target.style.zIndex = '1000'; // Ensure the dragged piece appears on top
    }

    // Function to handle dragging end
    function onDragEnd(e) {
        console.log('Drag End', e.target.dataset.id);
        e.target.style.opacity = '1'; // Reset opacity after dragging ends
        e.target.style.zIndex = ''; // Reset zIndex after dragging ends
    }

    // Function for handling drag over (necessary for dropping)
    function onDragOver(e) {
        e.preventDefault(); // Prevent default behavior to allow dropping
    }

    // Function for handling drag enter (highlight drop area)
    function onDragEnter(e) {
        e.preventDefault();
        e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'; // Highlight drop target
    }

    // Function for handling drag leave (remove highlight)
    function onDragLeave(e) {
        e.target.style.backgroundColor = ''; // Remove highlight when leaving the drop target
    }

    // Function for handling drop event (when the piece is dropped)
    function onDrop(e) {
        e.preventDefault();
        console.log('Drop Event', e.target.dataset.id);

        // Get the dragged and dropped pieces
        const draggedId = e.dataTransfer.getData('text');
        const draggedPiece = pieces[draggedId];
        const droppedPiece = e.target;

        // If the dropped target is not a puzzle piece, return
        if (!droppedPiece.classList.contains('puzzle-piece')) {
            return;
        }

        // Swap the positions of the two pieces
        const draggedIndex = draggedPiece.dataset.id;
        const droppedIndex = droppedPiece.dataset.id;

        // Get the position data for the dragged and dropped pieces
        const draggedPosition = positions[draggedIndex];
        const droppedPosition = positions[droppedIndex];

        // Swap the DOM positions (top and left)
        const tempTop = draggedPiece.style.top;
        const tempLeft = draggedPiece.style.left;

        draggedPiece.style.top = droppedPiece.style.top;
        draggedPiece.style.left = droppedPiece.style.left;

        droppedPiece.style.top = tempTop;
        droppedPiece.style.left = tempLeft;

        // Swap the position data in the positions array
        positions[draggedIndex] = droppedPosition;
        positions[droppedIndex] = draggedPosition;

        // Increment the swap count
        swapCount++;
        console.log('Swap Count:', swapCount); // Debug log to check swap count

        // Check if 10 swaps have been made, and trigger the "close enough" event
        if (swapCount >= 10) {
            alert("You're really bad at this"); // Alert message
            window.location.href = 'fullscreen.html'; // Redirect to fullscreen.html after the alert is dismissed
        }

        // Remove the highlight after drop
        e.target.style.backgroundColor = '';
    }

    generatePuzzle(); // Generate the puzzle
};



//index stuff
const video = document.getElementById('video');
const playPauseButton = document.getElementById('play-pause-button');
const playPauseImage = playPauseButton.querySelector('img');
const fullscreenButton = document.getElementById('fullscreen-button');
const progressBar = document.getElementById('progress-bar');

playPauseButton.addEventListener('click', function() {
    if (video.paused) {
        video.play();
        playPauseImage.src = 'pause.png'; // Change to pause image
    } else {
        video.pause();
        playPauseImage.src = 'play.png'; // Change to play image
    }
});

// Make the fullscreen button link to puzzle.html
fullscreenButton.addEventListener('click', function() {
    window.location.href = 'puzzle.html';
});

// Update the progress bar as the video plays
video.addEventListener('timeupdate', function() {
    const value = (video.currentTime / video.duration) * 100;
    progressBar.value = value;
});

// Make the progress bar clickable to navigate to a specific time in the video
progressBar.addEventListener('click', function(event) {
    const progressBarWidth = progressBar.offsetWidth;
    const clickPosition = event.offsetX; // Get the click position relative to the progress bar
    const clickedTime = (clickPosition / progressBarWidth) * video.duration; // Calculate the corresponding time in the video
    video.currentTime = clickedTime; // Jump to the clicked time
});