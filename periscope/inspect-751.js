const fs=require('fs');
const p='C:/Users/Dan Bandstra/Downloads/SCMPERISCOPEResults751.csv';
function parseCsv(text){const rows=[];let row=[],v='',q=false;for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'&&q&&n==='"'){v+='"';i++;}else if(c==='"'){q=!q;}else if(c===','&&!q){row.push(v);v='';}else if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&n==='\n')i++;row.push(v);if(row.some(x=>String(x).trim()))rows.push(row);row=[];v='';}else v+=c;}row.push(v);if(row.some(x=>String(x).trim()))rows.push(row);return rows;}
function norm(v){return String(v||'').replace(/\s+/g,' ').trim();}
function key(h){return norm(h).toLowerCase().replace(/[^a-z0-9]/g,'');}
function parseDate(s){s=norm(s); let m=s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); if(m)return new Date(+m[3],+m[1]-1,+m[2]); return null;}
function fam(ind){const k=norm(ind).toLowerCase().replace(/&/g,'and'); const map=new Map([['software','Software'],['consulting','Business Services'],['advertising, media and publishing','Business Services'],['transportation','Business Services'],['business services','Business Services'],['financial services','Consumer Services'],['nonprofits and organizations','Consumer Services'],['consumer services','Consumer Services'],['consumer goods','Products'],['industrial and equipment','Products'],['food and beverage','Products'],['health','Health & Hospitality'],['life sciences','Health & Hospitality'],['hospitality','Health & Hospitality'],['public sector','Health & Hospitality'],['construction and energy','Construction & Energy']]); return map.get(k)||'(unmapped)';}
const rows=parseCsv(fs.readFileSync(p,'utf8'));
const hi=rows.findIndex(r=>r.includes('Internal ID')&&r.includes('Request Type'));
const headers=rows[hi]; const data=rows.slice(hi+1);
const idx=Object.fromEntries(headers.map((h,i)=>[h,i]));
console.log('rows', data.length, 'cols', headers.length, 'header row', hi+1);
['Date Needed','Sales Vertical','Vertical','Vertical (Employee)','Company Industry','Request Type','Sales Team'].forEach(h=>console.log(h, idx[h]!==undefined?idx[h]+1:'missing'));
const dates=data.map(r=>parseDate(r[idx['Date Needed']])).filter(Boolean).sort((a,b)=>a-b);
console.log('Date min', dates[0]?.toLocaleDateString('en-US'), 'max', dates.at(-1)?.toLocaleDateString('en-US'));
const monthCounts=new Map(); for(const d of dates){const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; monthCounts.set(k,(monthCounts.get(k)||0)+1)}; console.log('months', [...monthCounts.entries()].map(x=>x.join(':')).join(', '));
function countBy(rows, col){const m=new Map(); for(const r of rows){const v=norm(r[idx[col]])||'(blank)'; m.set(v,(m.get(v)||0)+1)} return [...m.entries()].sort((a,b)=>b[1]-a[1]);}
console.log('Sales Vertical top:', countBy(data,'Sales Vertical').slice(0,12));
console.log('Company Industry top:', countBy(data,'Company Industry').slice(0,12));
const products=data.filter(r=>fam(r[idx['Company Industry']])==='Products');
console.log('Products rows by Sales Team', countBy(products,'Sales Team'));
console.log('Products rows by Sales Vertical', countBy(products,'Sales Vertical').slice(0,10));
console.log('Products rows by Company Industry', countBy(products,'Company Industry').slice(0,10));
const charlie=data.filter(r=>norm(r[idx['Solution Consultant']])==="O'Neil, Charlie"); console.log('Charlie rows', charlie.length, 'date min/max', charlie.map(r=>parseDate(r[idx['Date Needed']])).filter(Boolean).sort((a,b)=>a-b)[0]?.toLocaleDateString('en-US'), charlie.map(r=>parseDate(r[idx['Date Needed']])).filter(Boolean).sort((a,b)=>a-b).at(-1)?.toLocaleDateString('en-US'));
