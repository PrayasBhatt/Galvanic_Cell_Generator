document.getElementById('cellForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let anode = document.getElementById('anode').value;
    let cathode = document.getElementById('cathode').value;

    if (anode && cathode) {
        resetCanvas();

        if (anode === cathode) {
            drawNoCurrentFlow();
        } else {
            drawGalvanicCell(anode, cathode);
            animateElectronFlow();
            animateCurrentFlow();
            updateFlowIndicators(anode, cathode);
        }
    } else {
        document.getElementById('result').textContent = "Please select both anode and cathode.";
        document.getElementById('currentFlowStatus').textContent = "";
    }
});

document.getElementById('switchButton').addEventListener('click', function() {
    let anodeSelect = document.getElementById('anode');
    let cathodeSelect = document.getElementById('cathode');
    let temp = anodeSelect.value;
    anodeSelect.value = cathodeSelect.value;
    cathodeSelect.value = temp;

    document.getElementById('cellForm').dispatchEvent(new Event('submit'));
});

function resetCanvas() {
    const canvas = document.getElementById('galvanicCellCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('blastEffect').style.display = 'none'; 
}

function drawGalvanicCell(anode, cathode) {
    const canvas = document.getElementById('galvanicCellCanvas');
    const ctx = canvas.getContext('2d');

    const electrodeColors = {
        "Zn": "#A8A8A8", "Cu": "#B87333", "Ag": "#C0C0C0", "Fe": "#A52A2A", 
        "Pb": "#708090", "Ni": "#BC8F8F", "Au": "#FFD700", "Mg": "#F0E68C", 
        "Pt": "#E5E4E2"
    };
    const solutionColors = {
        "Zn": "#D3D3D3", "Cu": "#4682B4", "Ag": "#E5E4E2", "Fe": "#CD5C5C", 
        "Pb": "#708090", "Ni": "#98FB98", "Au": "#FFEC8B", "Mg": "#E0FFFF", 
        "Pt": "#F5F5F5"
    };
    const solutionNames = {
        "Zn": "Zinc Sulfate (ZnSO₄)", "Cu": "Copper Sulfate (CuSO₄)", 
        "Ag": "Silver Nitrate (AgNO₃)", "Fe": "Iron Sulfate (FeSO₄)", 
        "Pb": "Lead Nitrate (Pb(NO₃)₂)", "Ni": "Nickel Sulfate (NiSO₄)", 
        "Au": "Gold Chloride (AuCl₃)", "Mg": "Magnesium Sulfate (MgSO₄)", 
        "Pt": "Sulfuric Acid (H₂SO₄)"
    };

    ctx.fillStyle = solutionColors[anode];
    ctx.fillRect(50, 150, 120, 200);
    ctx.strokeRect(50, 150, 120, 200);
    ctx.fillStyle = electrodeColors[anode];
    ctx.fillRect(80, 100, 60, 150);
    ctx.fillStyle = '#000';
    ctx.fillText(`${anode} Electrode`, 55, 90);
    ctx.fillText(`${solutionNames[anode]}`, 55, 370);

    ctx.fillStyle = solutionColors[cathode];
    ctx.fillRect(330, 150, 120, 200);
    ctx.strokeRect(330, 150, 120, 200);
    ctx.fillStyle = electrodeColors[cathode];
    ctx.fillRect(360, 100, 60, 150);
    ctx.fillStyle = '#000';
    ctx.fillText(`${cathode} Electrode`, 335, 90);
    ctx.fillText(`${solutionNames[cathode]}`, 335, 370);

    ctx.fillStyle = '#ADD8E6';
    ctx.fillRect(170, 120, 160, 30);
    ctx.fillStyle = '#000';
    ctx.fillText('Salt Bridge', 230, 110);

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(130, 90);
    ctx.lineTo(130, 50);
    ctx.lineTo(380, 50);
    ctx.lineTo(380, 90);
    ctx.stroke();

    ctx.fillStyle = '#000';
    ctx.fillText('Galvanometer', 220, 40);
}

function animateElectronFlow() {
    const canvas = document.getElementById('galvanicCellCanvas');
    const rect = canvas.getBoundingClientRect();
    const electronBall = document.createElement('div');
    electronBall.classList.add('electronFlow');
    document.body.appendChild(electronBall);

    electronBall.style.top = `${rect.top + 150}px`; 
    electronBall.style.left = `${rect.left + 80}px`; 
    electronBall.style.animation = 'electronMove 2s linear infinite';
}

function animateCurrentFlow() {
    const canvas = document.getElementById('galvanicCellCanvas');
    const rect = canvas.getBoundingClientRect();
    const currentBall = document.createElement('div');
    currentBall.classList.add('currentFlow');
    document.body.appendChild(currentBall);

    currentBall.style.top = `${rect.top + 150}px`; 
    currentBall.style.left = `${rect.left + 360}px`; 
    currentBall.style.animation = 'currentMove 2s linear infinite';
}

function updateFlowIndicators(anode, cathode) {
    const electronColor = "#FFA500"; 
    const currentColor = "#00BFFF";  

    document.getElementById('result').innerHTML = `<span style="color:${electronColor}">Electron Flow: ${anode}</span>`;
    document.getElementById('currentFlowStatus').innerHTML = `<span style="color:${currentColor}">Current Flow: ${cathode}</span>`;
}

function drawNoCurrentFlow() {
    const canvas = document.getElementById('galvanicCellCanvas');
    const rect = canvas.getBoundingClientRect();

    resetCanvas();

    const blastEffect = document.getElementById('blastEffect');
    blastEffect.style.display = 'block';
    blastEffect.style.top = `${rect.top - 20}px`;
    blastEffect.style.left = `${rect.left - 750}px`;
    blastEffect.style.width = `${canvas.width}px`;
    blastEffect.style.height = `${canvas.height}px`;
    
    blastEffect.innerHTML = `
        <img src="2a9n.gif" alt="Blast Effect"> 
        <p>Boom! Same Anode and Cathode, No Current!</p>
    `;
}
