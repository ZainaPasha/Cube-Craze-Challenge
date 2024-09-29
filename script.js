const prompts = {
    'Cube 1': [
        '/images/P11.png', 
        '/images/P12.png', 
        '/images/P13.png', 
        '/images/P14.png', 
        '/images/P15.png', 
        '/images/P16.png'
    ],
    'Cube 2': [
        '/images/P21.png', 
        '/images/P22.png', 
        '/images/P23.png', 
        '/images/P24.png', 
        '/images/P25.png', 
        '/images/P26.png'
    ],
    'Cube 3': [
        '/images/P31.png', 
        '/images/P32.png', 
        '/images/P33.png', 
        '/images/P34.png', 
        '/images/P35.png', 
        '/images/P36.png'
    ]
};

let selectedCube = '';

function selectCube(cube) {
    selectedCube = cube;
    document.getElementById('selectedCube').innerText = `Selected Cube: ${cube}`;
    document.getElementById('rollBtn').disabled = false; // Enable roll button

    // Set images for cube faces based on the selected cube
    updateCubeImages(cube);
}

function rollCube() {
    if (selectedCube === '') {
        alert("Please select a cube first!");
        return;
    }

    // Randomize cube rotation
    const randomX = Math.floor(Math.random() * 4) * 90;
    const randomY = Math.floor(Math.random() * 4) * 90;
    document.getElementById('cube').style.transform = `rotateX(${randomX}deg) rotateY(${randomY}deg)`;

    setTimeout(() => {
        const resultsImages = document.getElementById('resultsImages');
        resultsImages.innerHTML = ''; // Clear previous results

        let usedIndices = []; // Track used indices to avoid repeats
        const rolledImages = []; // To store rolled images for PDF

        for (let i = 0; i < 3; i++) {
            let rollResultIndex;
            do {
                rollResultIndex = Math.floor(Math.random() * 6); // Get random index
            } while (usedIndices.includes(rollResultIndex)); // Ensure it's not used

            usedIndices.push(rollResultIndex); // Store the index
            const rollResult = prompts[selectedCube][rollResultIndex];

            const img = document.createElement('img');
            img.src = rollResult; // Set the rolled image's URL
            img.alt = `Roll Result ${i + 1}`;
            img.classList.add('enlarged-image'); // Add a class for enlarged styling
            resultsImages.appendChild(img);
            rolledImages.push(rollResult); // Store the image src for PDF generation
        }

        // Hide cube and buttons after the roll
        document.querySelector('.cube-container').style.display = 'none';
        document.querySelector('.cubes').style.display = 'none';
        document.getElementById('rollBtn').style.display = 'none';
        document.getElementById('selectedCube').style.display = 'none';

        // Show only the images section
        resultsImages.style.display = 'flex';

        // Show the "Download as PDF" button
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.style.display = 'block';

        // Attach the PDF download function to the button
        downloadBtn.onclick = function() {
            generatePDF(rolledImages);
        };

    }, 2000); // Wait for animation to finish before showing results
}

function generatePDF(imageSources) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add images to the PDF
    imageSources.forEach((imgSrc, index) => {
        const img = new Image();
        img.src = imgSrc;

        img.onload = function() {
            // Adding each image to the PDF (resizing for better fit)
            const imgWidth = 80;
            const imgHeight = 80;
            const positionY = 30 + (index * 100); // Adjust position for each image
            doc.addImage(img, 'PNG', 65, positionY, imgWidth, imgHeight);

            // Save the PDF after all images are added
            if (index === imageSources.length - 1) {
                doc.save('RolledImages.pdf');
            }
        };
    });
}


function updateCubeImages(cube) {
    const cubeFaces = document.querySelectorAll('.cube-face');
    const images = prompts[cube];
    
    cubeFaces.forEach((face, index) => {
        face.innerHTML = `<img src="${images[index]}" alt="Image ${index + 1}">`;
    });
}
