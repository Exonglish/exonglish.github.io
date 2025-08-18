const toggle=document.querySelector(".nav-toggle");
const links=document.getElementById("nav-links");
if(toggle&&links){
  toggle.addEventListener("click",()=>{
    const open=toggle.classList.toggle("is-open");
    links.classList.toggle("show",open);
    toggle.setAttribute("aria-expanded",open?"true":"false");
  });
}
