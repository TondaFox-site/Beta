const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
let notes = JSON.parse(localStorage.getItem('fox.notes') || '[]');
const settings = JSON.parse(localStorage.getItem('fox.settings') || '{}');

function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200)}
function showPage(page){
  $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  $$('.page').forEach(p=>p.classList.toggle('active-page',p.id===`page-${page}`));
  $('#breadcrumbs').textContent={home:'Domů',notes:'Poznámky',settings:'Nastavení',about:'O aplikaci'}[page];
}
function renderNotes(){
  $('#notesGrid').innerHTML='';
  $('#emptyState').style.display=notes.length?'none':'block';
  notes.forEach((n,i)=>{
    const article=document.createElement('article'); article.className='note';
    article.innerHTML=`<h3></h3><p></p><small>${new Date(n.created).toLocaleString('cs-CZ')}</small>`;
    article.querySelector('h3').textContent=n.title; article.querySelector('p').textContent=n.text||'';
    const del=document.createElement('button'); del.className='secondary'; del.textContent='Smazat'; del.style.marginTop='14px';
    del.onclick=()=>{notes.splice(i,1);localStorage.setItem('fox.notes',JSON.stringify(notes));renderNotes();toast('Poznámka smazána');}; article.appendChild(del); $('#notesGrid').appendChild(article);
  });
}
function applyTheme(value){
  let v=value; if(v==='system') v=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';
  document.documentElement.classList.toggle('light',v==='light');
}
function loadSettings(){
  $('#themeSelect').value=settings.theme||'dark'; $('#displayName').value=settings.name||'Fox Windows App'; $('#sounds').checked=settings.sounds!==false; applyTheme($('#themeSelect').value);
}
function openNote(){ $('#noteTitle').value=''; $('#noteText').value=''; $('#noteDialog').showModal(); $('#noteTitle').focus(); }

$('#nav').addEventListener('click',e=>{const b=e.target.closest('.nav-item');if(b)showPage(b.dataset.page)});
$('#newNoteBtn').onclick=openNote; $('#addNote').onclick=openNote;
$('#noteForm').addEventListener('submit',e=>{e.preventDefault();notes.unshift({title:$('#noteTitle').value.trim(),text:$('#noteText').value.trim(),created:Date.now()});localStorage.setItem('fox.notes',JSON.stringify(notes));renderNotes();$('#noteDialog').close();showPage('notes');toast('Poznámka uložena');});
$('#themeBtn').onclick=()=>{const next=document.documentElement.classList.contains('light')?'dark':'light';settings.theme=next;localStorage.setItem('fox.settings',JSON.stringify(settings));applyTheme(next);$('#themeSelect').value=next;};
$('#themeSelect').onchange=e=>applyTheme(e.target.value);
$('#saveSettings').onclick=()=>{settings.theme=$('#themeSelect').value;settings.name=$('#displayName').value||'Fox Windows App';settings.sounds=$('#sounds').checked;localStorage.setItem('fox.settings',JSON.stringify(settings));applyTheme(settings.theme);toast('Nastavení uloženo');};

window.foxAPI.getAppInfo().then(info=>{
  $('#runtimeInfo').textContent=`Electron ${info.electron} • Chromium ${info.chromium} • ${info.platform}/${info.arch}`;
  $('#aboutInfo').innerHTML=`<b>Verze:</b> ${info.version}<br><b>Platforma:</b> ${info.platform} ${info.arch}<br><b>Runtime:</b> Electron ${info.electron}`;
});
window.foxAPI.onNewPanel(openNote); window.foxAPI.onAbout(()=>showPage('about'));
renderNotes(); loadSettings();
