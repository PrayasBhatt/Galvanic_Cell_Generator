document.getElementById('cellForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let anode = document.getElementById('anode').value;
    let cathode = document.getElementById('cathode').value;

    if (anode && cathode) {
        if (anode === cathode) {
            drawNoCurrentFlow();
        } else {
            drawGalvanicCell(anode, cathode);
            document.getElementById('result').textContent = `Electron Flow: ${anode} (Anode) -> ${cathode} (Cathode)`;
            document.getElementById('currentFlowStatus').textContent = `Galvanometer Reading: Current flows from ${cathode} -> ${anode}`;
            document.getElementById('blastEffect').style.display = 'none';
        }
    } else {
        document.getElementById('result').textContent = "Please select both anode and cathode.";
        document.getElementById('currentFlowStatus').textContent = "";
        document.getElementById('blastEffect').style.display = 'none';
    }
});

function drawNoCurrentFlow() {
    const canvas = document.getElementById('galvanicCellCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('No Current Flow!', canvas.width / 2 - 100, canvas.height / 2 - 10);

    document.getElementById('blastEffect').style.display = 'block';
    document.getElementById('currentFlowStatus').textContent = "Current Flow: None";
}

function drawGalvanicCell(anode, cathode) {
    const canvas = document.getElementById('galvanicCellCanvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const electrodeColors = {
        "Zn": "#A8A8A8",
        "Cu": "#B87333",
        "Ag": "#C0C0C0",
        "Fe": "#A52A2A",
        "Pb": "#708090",
        "Ni": "#BC8F8F",
        "Au": "#FFD700",
        "Mg": "#F0E68C",
        "Pt": "#E5E4E2"
    };

    const solutionColors = {
        "Zn": "#D3D3D3",
        "Cu": "#4682B4",
        "Ag": "#E5E4E2",
        "Fe": "#CD5C5C",
        "Pb": "#708090",
        "Ni": "#98FB98",
        "Au": "#FFEC8B",
        "Mg": "#E0FFFF",
        "Pt": "#F5F5F5"
    };

    const solutionNames = {
        "Zn": "Acidic Zinc Sulfate (ZnSO₄)",
        "Cu": "Acidic Copper Sulfate (CuSO₄)",
        "Ag": "Acidic Silver Nitrate (AgNO₃)",
        "Fe": "Acidic Iron Sulfate (FeSO₄)",
        "Pb": "Acidic Lead Nitrate (Pb(NO₃)₂)",
        "Ni": "Acidic Nickel Sulfate (NiSO₄)",
        "Au": "Acidic Gold Chloride (AuCl₃)",
        "Mg": "Acidic Magnesium Sulfate (MgSO₄)",
        "Pt": "Acidic platinum(II) sulfate (PtSO₄)"
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
    ctx.fillText('Galvanometer', 220, 40);

    animateElectronFlowAlongWire();
}

function animateElectronFlowAlongWire() {
    const canvas = document.getElementById('galvanicCellCanvas');
    const ctx = canvas.getContext('2d');
    
    let x = 130;
    let electronSpeed = 5;

    function step() {
        ctx.clearRect(130, 30, 250, 20);  
        ctx.fillStyle = '#FF0000'; 
        ctx.beginPath();
        ctx.arc(x, 50, 5, 0, Math.PI * 2); 
        ctx.fill();

        x += electronSpeed;

        if (x >= 380) {
            x = 130;  
        }

        requestAnimationFrame(step);  
    }

    step();
}
