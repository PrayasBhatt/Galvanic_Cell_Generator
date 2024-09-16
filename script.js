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

const elementOrder = [
    "Li", "K", "Ca", "Na", "Mg", "Al", "OH", "Zn", "Fe", "Ni", "Sn", "Pb",
    "H2", "Cu", "I", "Fe", "Ag", "Hg", "Br", "H2O", "Cr", "Cl", "Au", "Mn", "F"
];

document.getElementById('anode').addEventListener('change', function() {
    updateCathodeOptions();
});

function updateCathodeOptions() {
    const anode = document.getElementById('anode').value;
    const cathodeSelect = document.getElementById('cathode');
    const anodeIndex = elementOrder.indexOf(anode);

    // Enable all options initially
    Array.from(cathodeSelect.options).forEach(option => {
        option.disabled = false;
    });

    // Disable options based on the selected anode
    Array.from(cathodeSelect.options).forEach(option => {
        const optionValue = option.value;
        if (elementOrder.indexOf(optionValue) < anodeIndex) {
            option.disabled = true;
        }
    });

    // Reset cathode selection if the selected cathode is disabled
    if (cathodeSelect.value && cathodeSelect.options[cathodeSelect.selectedIndex].disabled) {
        cathodeSelect.value = '';
    }
}

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
        "Li": "#FF0000", "K": "#8A2BE2", "Ca": "#7FFF00", "Na": "#FFD700", "Mg": "#00FF00",
        "Al": "#B0C4DE", "OH": "#00FFFF", "Zn": "#A8A8A8", "Fe": "#A52A2A", "Ni": "#BC8F8F",
        "Sn": "#D3D3D3", "Pb": "#708090", "H2": "#F0E68C", "Cu": "#B87333", "I": "#FF00FF",
        "Ag": "#C0C0C0", "Hg": "#F5DEB3", "Br": "#FFA07A", "H2O": "#00BFFF", "Cr": "#8B4513",
        "Cl": "#00FF00", "Au": "#FFD700", "Mn": "#FF69B4", "F": "#FF6347"
    };
    const solutionColors = {
        "Li": "#FFB6C1", "K": "#E6E6FA", "Ca": "#FFFFE0", "Na": "#FFDAB9", "Mg": "#E0FFFF",
        "Al": "#F5F5DC", "OH": "#F0F8FF", "Zn": "#D3D3D3", "Fe": "#FF6347", "Ni": "#E6E6FA",
        "Sn": "#DCDCDC", "Pb": "#F0E68C", "H2": "#E0FFFF", "Cu": "#ADD8E6", "I": "#D8BFD8",
        "Ag": "#C0C0C0", "Hg": "#FFE4C4", "Br": "#FFE4E1", "H2O": "#87CEEB", "Cr": "#D2B48C",
        "Cl": "#F5F5DC", "Au": "#F0E68C", "Mn": "#FF1493", "F": "#FFB6C1"
    };
    const solutionNames = {
        "Li": "Lithium Sulfate (LiSO₄)", "K": "Potassium Sulfate (KSO₄)", "Ca": "Calcium Sulfate (CaSO₄)",
        "Na": "Sodium Sulfate (NaSO₄)", "Mg": "Magnesium Sulfate (MgSO₄)", "Al": "Aluminum Sulfate (AlSO₄)",
        "OH": "Hydroxide (OH)", "Zn": "Zinc Sulfate (ZnSO₄)", "Fe": "Iron Sulfate (FeSO₄)",
        "Ni": "Nickel Sulfate (NiSO₄)", "Sn": "Tin Sulfate (SnSO₄)", "Pb": "Lead Sulfate (PbSO₄)",
        "H2": "Hydrogen Sulfate (H₂SO₄)", "Cu": "Copper Sulfate (CuSO₄)", "I": "Iodine Sulfate (ISO₄)",
        "Ag": "Silver Sulfate (AgSO₄)", "Hg": "Mercury Sulfate (HgSO₄)", "Br": "Bromine Sulfate (BrSO₄)",
        "H2O": "Water (H₂O)", "Cr": "Chromium Sulfate (CrSO₄)", "Cl": "Chlorine Sulfate (ClSO₄)",
        "Au": "Gold Sulfate (AuSO₄)", "Mn": "Manganese Sulfate (MnSO₄)", "F": "Fluorine Sulfate (FSO₄)"
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

let electronBalls = [];
let currentBalls = [];
let maxParticles = 3; // Maximum number of electron and current particles

function animateElectronFlow() {
    const canvas = document.getElementById('galvanicCellCanvas');
    const rect = canvas.getBoundingClientRect();

    // Clear any existing particles before creating new ones
    electronBalls.forEach(ball => ball.remove());
    electronBalls = [];

    for (let i = 0; i < maxParticles; i++) {
        const electronBall = document.createElement('div');
        electronBall.classList.add('electronFlow');
        document.body.appendChild(electronBall);
        electronBalls.push(electronBall);

        electronBall.style.position = 'absolute';
        electronBall.style.top = `${rect.top + 130}px`; // Above the black line
        electronBall.style.left = `${rect.left + 110}px`;

        // Each electron starts with a delay so they don't overlap
        electronBall.animate([
            { transform: `translate(0px, 0px)` },              // Start at anode
            { transform: `translate(0px, -120px)` },           // Move higher above the black line
            { transform: `translate(250px, -120px)` },         // Move right
            { transform: `translate(250px, 0px)` }             // Move down to cathode
        ], {
            duration: 3000,
            iterations: Infinity,
            delay: i * 500 // Staggered start for each particle
        });
    }
}

function animateCurrentFlow() {
    const canvas = document.getElementById('galvanicCellCanvas');
    const rect = canvas.getBoundingClientRect();

    // Clear any existing particles before creating new ones
    currentBalls.forEach(ball => ball.remove());
    currentBalls = [];
    
    for (let i = 0; i < maxParticles; i++) {
        const currentBall = document.createElement('div');
        currentBall.classList.add('currentFlow');
        document.body.appendChild(currentBall);
        currentBalls.push(currentBall);

        currentBall.style.position = 'absolute';
        currentBall.style.top = `${rect.top + 170}px`; // Below the black line
        currentBall.style.left = `${rect.left + 360}px`;

        // Each current particle starts with a delay so they don't overlap
        currentBall.animate([
            { transform: `translate(0px, 0px)` },               // Start at cathode
            { transform: `translate(0px, 120px)` },             // Move lower below the black line
            { transform: `translate(-250px, 120px)` },          // Move left
            { transform: `translate(-250px, 0px)` }             // Move up to anode
        ], {
            duration: 3000,
            iterations: Infinity,
            delay: i * 500 // Staggered start for each particle
        });
    }
}

function resetCanvas() {
    const canvas = document.getElementById('galvanicCellCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('blastEffect').style.display = 'none';

    // Clear electron and current particles when resetting the canvas
    electronBalls.forEach(ball => ball.remove());
    currentBalls.forEach(ball => ball.remove());
    electronBalls = [];
    currentBalls = [];
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
