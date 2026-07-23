const fs = require('fs');
const path = 'C:/Users/Dan Bandstra/Downloads/SCMPERISCOPEResults6.csv';
function parseCsv(text){const rows=[];let row=[],v='',q=false;for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'&&q&&n==='"'){v+='"';i++;}else if(c==='"'){q=!q;}else if(c===','&&!q){row.push(v);v='';}else if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&n==='\n')i++;row.push(v);if(row.some(x=>String(x).trim()))rows.push(row);row=[];v='';}else v+=c;}row.push(v);if(row.some(x=>String(x).trim()))rows.push(row);return rows;}
const rows=parseCsv(fs.readFileSync(path,'utf8'));
const headerIndex=rows.findIndex(r=>r.includes('Internal ID') && r.includes('Request Type'));
const headers=rows[headerIndex];
console.log('headerIndex', headerIndex+1, 'cols', headers.length, 'rows', rows.length-headerIndex-1);
headers.forEach((h,i)=>console.log(`${i+1}: ${h}`));
const idx=Object.fromEntries(headers.map((h,i)=>[h,i]));
const counts={};
for(const r of rows.slice(headerIndex+1)){ const key=r[idx['Company Industry']]||'(blank)'; counts[key]=(counts[key]||0)+1; }
console.log('Top Company Industry');
Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,30).forEach(([k,v])=>console.log(v,k));
