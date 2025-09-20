
async function loadProducts(){
  try{
    const resp = await fetch('products.csv');
    const txt = await resp.text();
    const rows = txt.trim().split('\n').slice(1);
    const data = rows.map(r=>{const cols=r.split(','); return {id:cols[0], title:cols[1], desc:cols[2], price:cols[3], unit:cols[4], img:cols[5]}});
    const gallery = document.getElementById('gallery');
    data.forEach(p=>{
      const card = document.createElement('div'); card.className='card';
      card.innerHTML = `
        <img loading="lazy" src="${p.img}" alt="${p.title}">
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
        <div class="price">${p.price} ${p.unit}</div>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:8px">
          <a class="btn" href="mailto:info@almanal.example?subject=طلب%20عرض%20سعر%20${encodeURIComponent(p.title)}">اطلب عرض</a>
          <button onclick="addToQuote('${p.title}')" style="padding:8px;border-radius:8px;border:none;background:#6b4f2f;color:#fff;cursor:pointer">أضف لمقارنة</button>
        </div>
      `;
      gallery.appendChild(card);
    });
  }catch(e){
    console.error(e);
  }
}
function addToQuote(title){ alert('أضيف '+title+' لقائمة طلب الأسعار.'); }
function submitForm(e){
  e.preventDefault();
  const name=document.getElementById('name').value;
  const phone=document.getElementById('phone').value;
  const subject=document.getElementById('subject').value;
  const message=document.getElementById('message').value;
  const mail = `mailto:info@almanal.example?subject=${encodeURIComponent(subject||'طلب')}%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message+'\n\n'+phone)}`;
  window.location.href = mail;
}
function sendWhatsApp(){
  const name=document.getElementById('name').value||'زبون';
  const phone=document.getElementById('phone').value||'';
  const subject=document.getElementById('subject').value||'';
  const message=document.getElementById('message').value||'';
  const text=encodeURIComponent(`مرحباً، اسمي ${name}. ${subject} ${message} - ${phone}`);
  window.open('https://wa.me/2001067280600?text='+text, '_blank');
}
loadProducts();
