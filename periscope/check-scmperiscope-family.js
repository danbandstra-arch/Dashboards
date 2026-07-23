const fs = require('fs');
const path = 'C:/Users/Dan Bandstra/Downloads/SCMPERISCOPEResults6.csv';
function parseCsv(text){const rows=[];let row=[],v='',q=false;for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'&&q&&n==='"'){v+='"';i++;}else if(c==='"'){q=!q;}else if(c===','&&!q){row.push(v);v='';}else if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&n==='\n')i++;row.push(v);if(row.some(x=>String(x).trim()))rows.push(row);row=[];v='';}else v+=c;}row.push(v);if(row.some(x=>String(x).trim()))rows.push(row);return rows;}
function norm(v){return String(v||'').replace(/\s+/g,' ').trim();}
function family(ind){const key=norm(ind).toLowerCase().replace(/&/g,'and'); const map=new Map([['software','Software'],['consulting','Business Services'],['advertising, media and publishing','Business Services'],['advertising media and publishing','Business Services'],['transportation','Business Services'],['business services','Business Services'],['financial services','Consumer Services'],['nonprofits and organizations','Consumer Services'],['consumer services','Consumer Services'],['consumer goods','Products'],['industrial and equipment','Products'],['food and beverage','Products'],['health','Health & Hospitality'],['life sciences','Health & Hospitality'],['hospitality','Health & Hospitality'],['public sector','Health & Hospitality'],['construction and energy','Construction & Energy']]); return map.get(key)||'(vertical unmapped)';}
const rows=parseCsv(fs.readFileSync(path,'utf8'));
const hi=rows.findIndex(r=>r.includes('Internal ID')&&r.includes('Request Type')&&r.includes('Solution Consultant'));
const headers=rows[hi]; const industryIdx=headers.indexOf('Company Industry');
const counts=new Map();
for(const r of rows.slice(hi+1)){ const f=family(r[industryIdx]); counts.set(f,(counts.get(f)||0)+1); }
console.log('header row', hi+1, 'data rows', rows.length-hi-1, 'Company Industry col', industryIdx+1);
[...counts.entries()].sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>console.log(`${k}: ${v}`));
