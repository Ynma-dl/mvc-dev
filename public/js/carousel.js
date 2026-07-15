document.addEventListener("DOMContentLoaded", () => {


    document.querySelectorAll(".carousel-btn")
    .forEach(button => {


        button.onclick = () => {


            const id = button.dataset.target;

            const carousel = document.getElementById(id);


            const amount = carousel.clientWidth;


            if(button.classList.contains("next")) {

                carousel.scrollLeft += amount;

            } 
            else {

                carousel.scrollLeft -= amount;

            }

        }


    });


});