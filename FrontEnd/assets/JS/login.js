async function init(){
  const res = await fetch("http://localhost:5678/api/works");
  const data = await res.json();
}