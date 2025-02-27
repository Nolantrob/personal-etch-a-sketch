const gridContainer = document.querySelector('.grid-container');
const gridSizeInputField = document.querySelector('input');
const clearGridButton = document.querySelector('.clear-grid-button');
const coloringModeButtons = document.querySelectorAll('.coloring-mode-button');
const currentModeContainer = document.querySelector('.current-mode-container');
const confirmButton = document.querySelector('.confirm-button');

let coloringMode = 'blackout';
updateCurrentModeText();

let turnIsX = true;

generateGrid(50);

function updateCurrentModeText() {
    currentModeContainer.innerText = `Selected Mode: ${capitalize(coloringMode)}`;
}

function capitalize(string) {
    return `${string[0].toUpperCase()}${string.slice(1)}`
} 

confirmButton.addEventListener('click', () => {
        generateGrid(gridSizeInputField.value);
        gridSizeInputField.value = '';
    }
)

coloringModeButtons.forEach(button => {
    button.addEventListener('click', () => {
        coloringMode = button.id;
        updateCurrentModeText();

        switch (coloringMode){
            case 'tictactoe':
                generateGrid(3);
                document.querySelectorAll('.square-div').forEach(square => {
                    square.style.cursor = 'pointer';
                })
                break;
            default:
                document.querySelectorAll('.square-div').forEach(square => {
                    square.style.cursor = 'default';
                })                
        }
    })
})

clearGridButton.addEventListener('click', () => {
    document.querySelectorAll('.square-div').forEach(square => {
        // For blackout mode
        square.style.backgroundColor = 'white';

        // Tic-Tac-Toe Mode
        square.classList.remove('locked');
        square.innerText = '';
        turnIsX = true;

        // For Gradual Darkening Mode
        square.style.opacity = 1;
    })
})

gridSizeInputField.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        generateGrid(gridSizeInputField.value);
        gridSizeInputField.value = '';
    }
})

function deleteCurrentGrid() {
    document.querySelectorAll('.square-div').forEach(square => {
        square.remove();
    })
}

// Generates random color for 'Multicolor Mode'
function generateRandomColor() {
    return `rgb(${Math.floor(Math.random() * 255) + 1},${Math.floor(Math.random() * 255) + 1},${Math.floor(Math.random() * 255) + 1})`;
}

function generateGrid(squareCount) {

    if (squareCount > 100 || squareCount <= 0) {
        alert('Must be a minimum of 1 and a maximum of 100');
        return;
    }

    if (coloringMode === 'tictactoe' && squareCount != 3){
        alert('Tic-Tac-Toe is active')
        return;
    }

    deleteCurrentGrid();

    function colorThisSquare(square, coloringMode) {
        switch (coloringMode) {
            case 'blackout':
                square.style.backgroundColor = `black`;
                break;
            case 'gradual':
                let shadingIntensity = 0.1;
                square.style.opacity -= shadingIntensity;
                break;
            case 'multicolor':
                square.style.backgroundColor = generateRandomColor();
                break;
            case 'tictactoe':
                square.innerText = placeXorO();
                square.classList.add('locked');
                break;
            default:
                break;
        }
    }

    function eraseThisSquare(square) {
        square.style.backgroundColor = `white`;
        square.style.opacity = '1';
        square.innerText = '';
        square.classList.remove('locked');
    }

    // These functions handle Tic-Tac-Toe Mode
    function previewXorO() {
        if (turnIsX) {
            return '❌'
        } else {
            return '⭕'
        }
    }

    function placeXorO() {
        if (turnIsX) {
            turnIsX = false;
            return '❌'
        } else {
            turnIsX = true;
            return '⭕'
        }
    }

    const squareSize = Math.min(gridContainer.clientHeight, gridContainer.clientWidth) / squareCount;

    // Creation of each square and adding event handlers
    for (columns = 0; columns < squareCount; columns++) {
        for (rows = 0; rows < squareCount; rows++) {
            const squareDiv = document.createElement('div');
            squareDiv.classList.add('square-div');
            squareDiv.style.opacity = '1';


            squareDiv.addEventListener('contextmenu', (event) => {
                event.preventDefault();

            })

            squareDiv.addEventListener('dragstart', (event) => {
                event.preventDefault();
            })

            squareDiv.addEventListener('mousedown', (event) => {

                if (event.buttons === 1) {
                    colorThisSquare(squareDiv, coloringMode)
                } else if (event.buttons === 2) {
                    eraseThisSquare(squareDiv, coloringMode)
                }
            })

            squareDiv.addEventListener('mouseover', (event) => {
                if (coloringMode === 'tictactoe') {
                    if (squareDiv.innerText.length <= 0) {
                        squareDiv.innerText = previewXorO();
                    }

                }

                if (event.buttons === 1) {
                    if (coloringMode != 'tictactoe'){
                        colorThisSquare(squareDiv, coloringMode);
                    }

                } else if (event.buttons === 2) {
                    eraseThisSquare(squareDiv, coloringMode)
                }
            })

            // Handles preview of X or O for 'Tic-Tac-Toe' mode
            squareDiv.addEventListener('mouseout', () => {
                if (squareDiv.innerText.length > 0 && !squareDiv.classList.contains('locked')) {
                    squareDiv.innerText = '';
                }
            })

            squareDiv.style.height = `${squareSize}px`
            squareDiv.style.width = `${squareSize}px`

            squareDiv.style.fontSize = `${squareSize / 1.5}px`

            gridContainer.appendChild(squareDiv);
        }

    }
}
