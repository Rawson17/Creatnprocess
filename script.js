
const glow=document.querySelector('.cursor-glow');
document.addEventListener('mousemove',e=>{
  glow.style.left=e.clientX+'px';
  glow.style.top=e.clientY+'px';
});

const observer=new IntersectionObserver(entries=>{
 entries.forEach(entry=>{
   if(entry.isIntersecting) entry.target.classList.add('visible');
 });
},{threshold:0.15});

document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

document.querySelectorAll('[data-count]').forEach(el=>{
  const target=+el.dataset.count;
  let n=0;
  const step=target/60;
  const timer=setInterval(()=>{
    n+=step;
    if(n>=target){n=target;clearInterval(timer);}
    el.textContent=Math.floor(n);
  },20);
});
