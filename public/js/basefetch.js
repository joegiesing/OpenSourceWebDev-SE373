fetch("/api/data")
    .then(response => response.json())
    .then(data => {
        console.log("Recieved JSON: ", data);

        document.getElementById("message").textContent = data.message;
        document.getElementById("time").textContent = data.timestamp;
        document.getElementById("list").innerHTML = data.items.map(item => `<li>${item}</li>`).join("");
    })
    .catch(error => {
        console.error("Error fetching data: ", error);
}); 