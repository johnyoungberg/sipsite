document.addEventListener('DOMContentLoaded', function() {
    var coll = document.getElementsByClassName("collapsible-header");
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }

    var draggables = document.querySelectorAll('.draggable');
    var dropZones = document.querySelectorAll('.drop-zone');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            const draggable = document.querySelector('.dragging');
            zone.appendChild(draggable);
        });
    });
});

function checkAnswers() {
    // Implement the logic to check answers for the drag and drop interface
    alert("Checking answers...");
}
