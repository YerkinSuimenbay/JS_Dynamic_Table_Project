const $table = document.querySelector(".table")

// OTHER JSON RESOURCES TO CHECK 
const url = "https://jsonplaceholder.typicode.com/users"
// const url = "https://jsonplaceholder.typicode.com/todos"
// const url = "https://jsonplaceholder.typicode.com/comments"
// const url = "https://jsonplaceholder.typicode.com/posts"

// TO TOGGLE THE ASCENDING / DESCENDING SORTION
let sortDirection = true

// FETCHING THE DATA
const fetchData = async url => {
    try {
        const response = await fetch(url)
        if (response.status == 200) {
            const data = await response.json()
            loadTable(data, sortDirection)
        } else {
            throw new Error(response.status);
        }
    } 
    catch (err) {
        console.error(err)
    }
}

// LOADING THE TABLE
const loadTable = (users, sortDirection, prevProp) => {
    // CLEARING THE TABLE BEFORE INSERTING THE SORTED TABLE
    $table.innerHTML = ""
    
    // ADDING TABLE HEADER
    addTableHeader(users)

    // ADDING TABLE ROWS
    addTableRows(users)

    // SORTING COLUMNS
    const tableHeader = document.querySelector(".table-header")
    tableHeader.addEventListener("click", e => sortColumn(e, users, sortDirection, prevProp))
}

// TABLE HEADER FUNCTION
const addTableHeader = users => {
    const $tableHead = document.createElement("tr")
    $tableHead.classList.add("table-header")
    
    let tableHeaders = ""
    const keys = Object.keys(users[0])
    keys.forEach(key => {
        tableHeaders += `<th>${key}</th>`
    })

    $tableHead.innerHTML = tableHeaders
    $table.append($tableHead)
}

// TABLE ROWS FUNCTION
const addTableRows = users => {
    for (user of users) {
        const $tableRow = document.createElement("tr")
        $tableRow.classList.add("table-row")

        let tableRow = ""
        const values = Object.values(user)
        values.forEach(value => {
            if (typeof value !== "object") {
                tableRow += `<td>${value}</td>`
            } else {
                for (i in value) {
                    tableRow += `<td>${value[i]}</td>`
                    break;
                }
            }
        })
        $tableRow.innerHTML = tableRow
        $table.appendChild($tableRow)
    }    
}

// SORT FUNCTION
const sortColumn = (e, items, sortDirection, prevProp) => {
    const prop = e.target.textContent
    if (prevProp === prop) {
        sortDirection = !sortDirection
    }

    // SORT NUMBERS
    if (typeof items[0][prop] === "number") {
        items.sort((a, b) => {
            return sortDirection ? a[prop] - b[prop] : b[prop] - a[prop];
      });
    }

    // SORT STRINGS
    if (typeof items[0][prop] === "string") {
        items.sort((a, b) => {
            let propA = a[prop].toUpperCase(); 
            var propB = b[prop].toUpperCase();
            if (propA < propB) {
                return sortDirection ? -1: 1;
            }
            if (propA > propB) {
                return sortDirection ? 1: -1;;
            }

            return 0;
        });
    }

    // SORT OBJECTS
    if (typeof items[0][prop] === "object") {
        items.sort((a, b) => {
            let propA = a[prop][Object.keys(a[prop])[0]].toUpperCase(); 
            var propB = b[prop][Object.keys(b[prop])[0]].toUpperCase();
            if (propA < propB) {
                return sortDirection ? -1: 1;
            }
            if (propA > propB) {
                return sortDirection ? 1: -1;;
            }
            
            return 0;
        });
    }
    
    // SORT BOOLEANS
    if (typeof items[0][prop] === "boolean") {

        items.sort((a, b) => { 
            if (a[prop] < b[prop]) {
                return sortDirection ? -1: 1;
            }
            if (a[prop] > b[prop]) {
                return sortDirection ? 1: -1;;
            }

            return 0;
        });
    }

    // reloading the table
    loadTable(items, sortDirection, prop)
}

// FILTER FUNCTION 
const filter = () => {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const tr = $table.querySelectorAll(".table-row");

    for (let i = 0; i < tr.length; i++) {
        let txtValue = tr[i].textContent
        if (txtValue.toUpperCase().indexOf(filter) !== -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
      }
  }


document.addEventListener("DOMContentLoaded", () => fetchData(url))