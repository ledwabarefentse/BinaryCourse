// Get the video element
const video = document.getElementById('backgroundVideo');

// Start the video at 1 second
video.addEventListener('loadedmetadata', () => {
  video.currentTime = 1;
});

// Loop the video from 1 second to end
video.addEventListener('ended', () => {
  video.currentTime = 1;
  video.play();
});

// Add animations for the title and subtitle
window.onload = () => {
  setTimeout(() => {
    document.getElementById("animatedTitleContainer").classList.add("move-up");
  }, 4000); // Adjust timing as necessary

  setTimeout(() => {
    document.getElementById("slideGrid").classList.add("visible");
  }, 5000);

  setTimeout(() => {
    document.getElementById("slideGrid").classList.add("visible");
    setTimeout(loadOverview, 1000); // Display overview popup
  }, 6000); // Adjust timing if necessary
};


// Sample data for the slides, now with file paths
const slides = [
  { title: "Introduction to Binary Numbers", file: "lessons/introduction.html" },
  { title: "Binary vs. Decimal Numbers", file: "lessons/binaryvsdecimal.html" },
  { title: "Converting Binary to Decimal", file: "lessons/conversion_binary_decimal.html" },
  { title: "Converting Decimal to Binary", file: "lessons/conversion_decimal_binary.html" },
  { title: "Binary Addition", file: "lessons/binary_addition.html" },
  { title: "Assessments", file: "lessons/Assessments.html" },
  { title: "Interactive Exercises", file: "lessons/interactive-exercises.html" },
  { title: "For More Information", file: "lessons/moreinfo.html" }
];

// Function to fetch and display the overview content
function loadOverview() {
  fetch('lessons/overview.html')
    .then(response => response.text())
    .then(content => {
      document.getElementById("modalContent").innerHTML = content;
      document.getElementById("modalTitle").textContent = "Lesson Overview";
      document.getElementById("slideCounter").textContent = ""; // No counter for overview
      
      // Hide navigation buttons for the overview popup
      document.getElementById("prevSlide").style.display = "none";
      document.getElementById("nextSlide").style.display = "none";
      
      // Display the modal
      document.getElementById("modal").style.display = "flex";
    })
    .catch(error => console.error("Error loading overview:", error));
}


function showSlide(slideIndex) {
  // Other existing code here...

  // Show navigation buttons for normal slides
  document.getElementById("prevSlide").style.display = slideIndex === 0 ? 'none' : 'inline';
  document.getElementById("nextSlide").style.display = slideIndex === slidesContent.length - 1 ? 'none' : 'inline';
}


// Function to load tiles into the grid
function loadTiles() {
  const grid = document.getElementById("slideGrid");
  slides.forEach((slide, index) => {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.innerHTML = `<h3>${slide.title}</h3>`;
    tile.onclick = () => {
      if (slide.link) {
        window.open(slide.link, "_blank"); // Open external link in a new tab
      } else if (slide.file) {
        fetchContent(slide.file, slide.title); // Fetch content from text file
      }
    };
    grid.appendChild(tile);
  });
}

// Function to close the modal
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// Close the modal when clicking outside the modal content
window.addEventListener("click", (event) => {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    closeModal();
  }
});

// Function to fetch content from a file and display it as HTML in the modal
function fetchContent(file, title) {
  fetch(file)
    .then(response => response.text())
    .then(content => {
      const slidesContent = content.split('---').map(text => text.trim()); // Split file content by delimiter and trim whitespace
      let currentSlide = 0;

      // Function to show slide content in the modal as HTML
      function showSlide(slideIndex) {
        document.getElementById("modalTitle").textContent = title;
        document.getElementById("modalContent").innerHTML = slidesContent[slideIndex]; // Use innerHTML to render HTML
        document.getElementById("slideCounter").textContent = `Slide ${slideIndex + 1} of ${slidesContent.length}`;
        
        // Update button visibility
        document.getElementById("prevSlide").style.display = slideIndex === 0 ? 'none' : 'inline';
        document.getElementById("nextSlide").style.display = slideIndex === slidesContent.length - 1 ? 'none' : 'inline';
      }

      // Set up initial content
      showSlide(currentSlide);
      document.getElementById("modal").style.display = "flex"; // Show modal when tile is clicked

      // Event listeners for next and previous buttons
      document.getElementById("nextSlide").onclick = () => {
        if (currentSlide < slidesContent.length - 1) {
          currentSlide++;
          showSlide(currentSlide);
        }
      };

      document.getElementById("prevSlide").onclick = () => {
        if (currentSlide > 0) {
          currentSlide--;
          showSlide(currentSlide);
        }
      };
    })
    .catch(error => console.error("Error loading content:", error));
}

function debounce(func, delay) {
  let debounceTimer;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
}

// Apply debounce to popup opening functions
document.querySelectorAll('.tile').forEach(tile => {
  tile.onclick = debounce(() => {
    // Your code to open the popup
  }, 100);  // Adjust delay as needed
});


// Load tiles on page load
loadTiles();
