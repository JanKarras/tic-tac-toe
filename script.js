let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
]

let currentPlayer = 'circle';

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
    [0, 4, 8], [2, 4, 6], // diagonal
];

function init(){
    render();
}

let gameEnded = false;

function render() {
    const contentDiv = document.getElementById('content');
    // Generate table HTML
    let tableHtml = '<table>';
    for (let i = 0; i < 3; i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            let symbol = '';
            if (fields[index] === 'circle') {
                symbol = generateAnimatedCircleSVG();
            } else if (fields[index] === 'cross') {
                symbol = generateAnimatedCrossSVG();
            }
            tableHtml += `<td onclick="handleClick(this, ${index})">${symbol}</td>`;
        }
        tableHtml += '</tr>';
    }
    tableHtml += '</table>';
    // Set table HTML to contentDiv
    contentDiv.innerHTML = tableHtml;
    displayCurrentPlayer();
}


function handleClick(cell, index) {
    if (!gameEnded && fields[index] === null) {
        fields[index] = currentPlayer;
        cell.innerHTML = currentPlayer === 'circle' ? generateAnimatedCircleSVG() : generateAnimatedCrossSVG();
        cell.onclick = null;
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';

        if (isGameFinished()) {
            const winCombination = getWinningCombination();
            drawWinningLine(winCombination);
            document.getElementById('currentPlayer').classList.add('none');
            gameEnded = true;
        }
        displayCurrentPlayer();
    }
}

function isGameFinished() {
    return fields.every((field) => field !== null) || getWinningCombination() !== null;
}

function getWinningCombination() {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
        const [a, b, c] = WINNING_COMBINATIONS[i];
        if (fields[a] === fields[b] && fields[b] === fields[c] && fields[a] !== null) {
            return WINNING_COMBINATIONS[i];
        }
    }
    return null;
}

function generateAnimatedCircleSVG() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "70");
    svg.setAttribute("height", "70");

    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", "35");
    circle.setAttribute("cy", "35");
    circle.setAttribute("r", "30");
    circle.setAttribute("fill", "transparent");
    circle.setAttribute("stroke", "#00B0EF");
    circle.setAttribute("stroke-width", "5");

    const animation = document.createElementNS(svgNS, "animate");
    animation.setAttribute("attributeName", "stroke-dasharray");
    animation.setAttribute("from", "0");
    animation.setAttribute("to", "188");
    animation.setAttribute("dur", "1s");
    animation.setAttribute("repeatCount", "1");

    circle.appendChild(animation);
    svg.appendChild(circle);

    return svg.outerHTML;
}

function generateAnimatedCrossSVG() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "70");
    svg.setAttribute("height", "70");

    const group = document.createElementNS(svgNS, "g");

    // Linie von oben links nach unten rechts
    const line1 = document.createElementNS(svgNS, "line");
    line1.setAttribute("x1", "10");
    line1.setAttribute("y1", "10");
    line1.setAttribute("x2", "60");
    line1.setAttribute("y2", "60");
    line1.setAttribute("stroke", "#FFC000");
    line1.setAttribute("stroke-width", "5");

    // Linie von oben rechts nach unten links
    const line2 = document.createElementNS(svgNS, "line");
    line2.setAttribute("x1", "60");
    line2.setAttribute("y1", "10");
    line2.setAttribute("x2", "10");
    line2.setAttribute("y2", "60");
    line2.setAttribute("stroke", "#FFC000");
    line2.setAttribute("stroke-width", "5");

    group.appendChild(line1);
    group.appendChild(line2);

    const animation = document.createElementNS(svgNS, "animate");
    animation.setAttribute("attributeName", "stroke-dasharray");
    animation.setAttribute("from", "0,70");
    animation.setAttribute("to", "70,70");
    animation.setAttribute("dur", "1s");
    animation.setAttribute("repeatCount", "1");

    group.appendChild(animation);
    svg.appendChild(group);

    return svg.outerHTML;
}

function drawWinningLine(combination) {
    const lineColor = '#ffffff';
    const lineWidth = 5;
    const startCell = document.querySelectorAll(`td`)[combination[0]];
    const endCell = document.querySelectorAll(`td`)[combination[2]];
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();


    const contentRect = document.getElementById('content').getBoundingClientRect();

    const lineLength = Math.sqrt(  Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
    );
    const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);
    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.width = `${lineLength}px`;
    line.style.height = `${lineWidth}px`;
    line.style.backgroundColor = lineColor;
    line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 2 - contentRect.top}px`;
    line.style.left = `${startRect.left + startRect.width / 2 - contentRect.left}px`;
    line.style.transform = `rotate(${lineAngle}rad)`;
    line.style.transformOrigin = `top left`;
    document.getElementById('content').appendChild(line);
}

function restartGame() {
    // Setze alle Felder auf null zurück
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ];

    // Setze den aktuellen Spieler auf "circle"
    currentPlayer = 'circle';

    // Entferne alle Zeichen und Linien aus dem Spielfeld
    const cells = document.querySelectorAll('td');
    cells.forEach((cell) => {
        cell.innerHTML = '';
        cell.onclick = (event) => {
            handleClick(event.target, parseInt(event.target.dataset.index));
        };
    });

    // Entferne die Linien
    const lines = document.querySelectorAll('div.line');
    lines.forEach((line) => {
        line.remove();
    });

    // Rufe die render-Funktion erneut auf, um das Spielfeld neu zu rendern
    render();
    document.getElementById('currentPlayer').classList.remove('none');
    gameEnded = false;
}

function displayCurrentPlayer() {
    const currentPlayerSymbol = currentPlayer === 'circle' ? generateAnimatedCircleSVG() : generateAnimatedCrossSVG();
    const currentPlayerDiv = document.getElementById('currentPlayer');
    currentPlayerDiv.innerHTML = currentPlayerSymbol;
}