let http = new XMLHttpRequest;
let athletes = null

//get data from json file
http.open('get', 'athletes.json', true);

http.send();

http.onload = function () {
    // checking if http is ready 
    if (this.readyState == 4 && this.status == 200) {
        athletes = JSON.parse(this.responseText);

        let output1 = "";

        let output = "";
        // reading the value of json
        for (let item of athletes) {
            output += `
            <tr >
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.email}</td>
            <td><button class="button" id="${item.id}" 
            onClick="Report(this.id)">View</button>
            </tr>
            
            `
            output1 += `
            <div class="athletes_profile">
            <img src="${item.image}" class="image" width="150" height="100">
             <p>${item.name}</p>
             </div>`
        }
        document.querySelector(".main").innerHTML = output1;
        document.querySelector(".table_data").innerHTML = output;

    }

}
function Report(id) {
    window.location = 'report.html?id=' + id
}


