let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = null;
let currentPage = 1;
let rowsPerPage = 5;




/* select Element */
let s_name = document.getElementById("s_name");
let s_mark = document.getElementById("s_mark");
let s_dept = document.getElementById("s_dept");
let btn = document.getElementById("btn");
let card_body = document.getElementById("card_body");
let paginationDiv = document.getElementById("pagination");

/* UI Display */
btn.addEventListener("click", function (e) {
   e.preventDefault();

   let sd_name = s_name.value.trim();
   let sd_mark = s_mark.value.trim();
   let sd_dept = s_dept.value.trim();

   if (sd_name === "" || sd_mark === "" || sd_dept === "") {
      alert("Please Fill All fields");
      return;
   }
// Mark validation
   if (isNaN(sd_mark) || sd_mark < 0 || sd_mark > 100) {
       alert("Marks must be a number between 0 and 100");
       return;
   }
 /*  add */
    if (editIndex === null) {
        students.push({ sd_name, sd_mark, sd_dept });
        alert("Successfully Added");
    } 
/*  update */
    else {
        students[editIndex] = { sd_name, sd_mark, sd_dept };
        alert("Successfully Updated");

        editIndex = null;
        btn.textContent = "Add Student";
    }
   localStorage.setItem("students", JSON.stringify(students));
   console.log(sd_name);
   console.log(sd_mark);
   console.log(sd_dept);

  


   s_name.value = "";
   s_mark.value = "";
   s_dept.value = "";


   renderui();

})

function renderui() {
   card_body.innerHTML = "";

   

   let start = (currentPage - 1) * rowsPerPage;
 let end = start + rowsPerPage;
   let paginatedStudents = students.slice(start, end);
   paginatedStudents.forEach((val,index) => {
      let realIndex = start + index; 
        let card_tr = document.createElement("tr");


   let result = val.sd_mark > 45 ? "Pass" : "Fail";

      card_tr.innerHTML = `
       <td class="table_no">${start + index + 1}</td> 
            <td class="table_name">${val.sd_name}</td>
            <td>${val.sd_mark}</td>
          
            <td class="table_dept" >${val.sd_dept}</td>
             <td>${result}</td> 
            
            <td> <button type="button" class="edit-btn">Edit</button> <button type="button" class="delete_btn">Delete</button> </td>
        `;

      card_body.appendChild(card_tr);
      /* delete */
let delete_btn = card_tr.querySelector(".delete_btn"); 
delete_btn.addEventListener("click", ()=>{
   students=students.filter((_,i)=>i!==realIndex)
   localStorage.setItem("students", JSON.stringify(students));
            // check if current page empty after delete
         if ((currentPage-1)*rowsPerPage >= students.length && currentPage > 1) {
             currentPage--;
         } 
   renderui();
})


  /* Edit */
       let edit_btn = card_tr.querySelector(".edit-btn");
        edit_btn.addEventListener("click", () => {
            s_name.value = val.sd_name;
            s_mark.value = val.sd_mark;
            s_dept.value = val.sd_dept;

            editIndex = realIndex;
            btn.textContent = "Update Student";
        });


   });

     renderPagination();
}
// Pagination buttons
function renderPagination() {
    paginationDiv.innerHTML = "";
    let pageCount = Math.ceil(students.length / rowsPerPage);

    // less pagecount
    if (currentPage > pageCount) currentPage = pageCount;
      // single page no pagination
    if (pageCount <= 1) return;

    // Prev button
    let prevBtn = document.createElement("button");
    prevBtn.textContent = "Prev";
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        currentPage--;
        renderui();
    };
    paginationDiv.appendChild(prevBtn);

    // Page numbers
    for (let i = 1; i <= pageCount; i++) {
        let pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        if (i === currentPage) pageBtn.classList.add("active");
        pageBtn.onclick = () => {
            currentPage = i;
            renderui();
        };
        paginationDiv.appendChild(pageBtn);
    }

    // Next button
    let nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === pageCount;
    nextBtn.onclick = () => {
        currentPage++;
        renderui();
    };
    paginationDiv.appendChild(nextBtn);
}


renderui();
