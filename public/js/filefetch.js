fetch("/api/course")
    .then(response => response.json())
    .then(data => {
        console.log("Recieved JSON: ", data);

        document.getElementById("course").textContent = data.course;
        document.getElementById("instructor").textContent = data.instructor;
        document.getElementById("topics").innerHTML = data.topics.map(topics => `<li>${topics}</li>`).join("");
    })
    .catch(error => {
        console.error("Error fetching data: ", error);
}); 