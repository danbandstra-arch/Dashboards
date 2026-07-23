const fs = require('fs');
const path = 'C:/Users/Dan Bandstra/Downloads/SCMPERISCOPEResults6.csv';
function parseCsv(text){const rows=[];let row=[],v='',q=false;for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'&&q&&n==='"'){v+='"';i++;}else if(c==='"'){q=!q;}else if(c===','&&!q){row.push(v);v='';}else if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&n==='\n')i++;row.push(v);if(row.some(x=>String(x).trim()))rows.push(row);row=[];v='';}else v+=c;}row.push(v);if(row.some(x=>String(x).trim()))rows.push(row);return rows;}
const rows=parseCsv(fs.readFileSync(path,'utf8'));
const hi=rows.findIndex(r=>r.includes('Internal ID')&&r.includes('Request Type'));
const headers=rows[hi];
const idx=headers.indexOf('Request Type');
const counts=new Map();
for(const r of rows.slice(hi+1)){const key=(r[idx]||'(blank)').trim()||'(blank)'; counts.set(key,(counts.get(key)||0)+1);}
console.log('Request Type distinct count:', counts.size);
[...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).forEach(([k,v])=>console.log(`${v}\t${k}`));
