import{a as X}from"./chunk-A4VM7N6J.js";import{a as J}from"./chunk-COUE46VJ.js";import"./chunk-74SDAD7V.js";import{b as V,d as z,g as q,n as j,o as Q,p as U,t as Z}from"./chunk-OS5B4LCM.js";import{a as K}from"./chunk-KVVV52BD.js";import{d as W,g as B}from"./chunk-GQTCIO6V.js";import{Ja as G,Ka as T,O as E,Oa as C,Pa as s,Qa as d,Ra as u,T as k,U as D,Ua as S,Xa as g,Za as _,a as P,b as O,ca as w,cb as R,eb as I,gb as p,hb as F,jb as H,oa as y,pb as L,vb as M,za as A}from"./chunk-K6CD6SNP.js";var at=()=>[];function ot(b,t){if(b&1){let e=S();s(0,"button",58),g("click",function(){k(e);let a=_();return D(a.printAllInvoices())}),u(1,"i",59),p(2,"Print All "),d()}if(b&2){let e=_();C("disabled",e.gstInvoices().length===0||e.gstLoading())}}function lt(b,t){if(b&1){let e=S();s(0,"button",60),g("click",function(){k(e);let a=_();return D(a.printGstReport())}),u(1,"i",59),p(2,"Print "),d()}if(b&2){let e=_();C("disabled",e.gstInvoices().length===0)}}function st(b,t){b&1&&(s(0,"div",56),u(1,"div",61),s(2,"p",62),p(3,"Loading..."),d()())}function dt(b,t){b&1&&(s(0,"div",64),u(1,"i",66),p(2,' Click on a row to print that invoice | Or use "Print All" to print all invoices '),d())}function mt(b,t){b&1&&(s(0,"div",65),u(1,"i",66),p(2," Click on + to expand bill details | Click on - to collapse "),d())}function ct(b,t){if(b&1){let e=S();s(0,"ag-grid-angular",63),g("rowClicked",function(a){k(e);let n=_();return D(n.onGstRowClicked(a))}),d(),G(1,dt,3,0,"div",64),G(2,mt,3,0,"div",65)}if(b&2){let e=_();C("rowData",e.gstInvoices())("columnDefs",e.currentGstConfig().columns)("defaultColDef",e.defaultColDef)("pagination",!0)("paginationPageSize",20)("pinnedBottomRowData",e.gstReportType()!=="invoice"?e.gstPinnedBottomRow():L(12,at))("alwaysShowVerticalScroll",!0)("rowHeight",24)("getRowId",e.getRowId)("rowSelection",e.gstReportType()==="invoice"?"single":void 0),y(),T(e.gstReportType()==="invoice"&&e.gstInvoices().length>0?1:-1),y(),T(e.gstReportType()==="productbdetail"&&e.gstInvoices().length>0?2:-1)}}function pt(b,t){b&1&&u(0,"span",82)}function ut(b,t){b&1&&u(0,"i",83)}function gt(b,t){if(b&1){let e=S();s(0,"div",57)(1,"div",67)(2,"div",68)(3,"div",69)(4,"h5",70),u(5,"i",71),p(6,"Day End Confirmation"),d(),s(7,"button",72),g("click",function(){k(e);let a=_();return D(a.closeDayEndModal())}),d()(),s(8,"div",73)(9,"p",74),p(10,"Are you sure you want to perform Day End?"),d(),s(11,"p",75),p(12,"This will permanently delete all GCSheet sales records from"),d(),s(13,"p",76),p(14),d(),s(15,"p",77),u(16,"i",78),p(17,"This action cannot be undone!"),d()(),s(18,"div",79)(19,"button",80),g("click",function(){k(e);let a=_();return D(a.closeDayEndModal())}),p(20,"Cancel"),d(),s(21,"button",81),g("click",function(){k(e);let a=_();return D(a.executeDayEnd())}),G(22,pt,1,0,"span",82)(23,ut,1,0,"i",83),p(24," Confirm Day End "),d()()()()()}if(b&2){let e=_();y(14),H("",e.gstStartDate()," to ",e.gstEndDate()),y(7),C("disabled",e.gstLoading()),y(),T(e.gstLoading()?22:23)}}var Y=class b{service=E(X);router=E(B);toastService=E(K);isCollapsed=!0;showMasterMenu=!1;showGcsheetMenu=!1;gstLoading=w(!1);gstStartDate=w("");gstEndDate=w("");gstReportType=w("invoice");gstInvoices=w([]);gstHeadersAll=w([]);gstDetailsAll=w([]);pktmasterList=w([]);showDayEndModal=w(!1);expandedBillnos=w(new Set);defaultColDef={sortable:!0,filter:!0,resizable:!0,flex:1,minWidth:80};invoiceReportConfig={title:"Order List",columns:[{field:"billno",headerName:"Bill No",width:100},{field:"billdate",headerName:"Date",width:120},{field:"customername",headerName:"Customer",width:220,valueFormatter:t=>t.value||"-"},{field:"billamt",headerName:"Bill Amt",width:120,type:"numericColumn",valueFormatter:t=>this.formatGridNumber(t.value)},{field:"gstamt",headerName:"GST Amt",width:110,type:"numericColumn",valueFormatter:t=>this.formatGridNumber(t.value)},{field:"nettamount",headerName:"Net Amt",width:120,type:"numericColumn",valueFormatter:t=>this.formatGridNumber(t.value)}]};saleRegisterConfig={title:"Sale Register",columns:[{field:"billno",headerName:"Bill No",width:90},{field:"billdate",headerName:"Date",width:110},{field:"customername",headerName:"Customer",width:200},{field:"totalpcs",headerName:"Pcs",width:80,type:"numericColumn",valueFormatter:t=>this.formatGridNumber(t.value)},{field:"totalwgt",headerName:"Weight",width:100,type:"numericColumn",valueFormatter:t=>this.formatGridNumber(t.value)},{field:"nettamount",headerName:"Net Amount",width:120,type:"numericColumn",valueFormatter:t=>this.formatGridNumber(t.value)}]};productSummaryConfig={title:"Product Summary",columns:[{field:"productname",headerName:"Product",width:300},{field:"totalpcs",headerName:"Total Pcs",width:100,type:"numericColumn",valueFormatter:t=>this.formatGridNumber(t.value)},{field:"totalwgt",headerName:"Total Weight",width:120,type:"numericColumn",valueFormatter:t=>this.formatGridNumber(t.value)},{field:"totalamt",headerName:"Total Amount",width:130,type:"numericColumn",valueFormatter:t=>this.formatGridNumber(t.value)}]};productBillDetailConfig={title:"Product Order-Detail",columns:[{field:"expandToggle",headerName:"",width:40,flex:1,maxWidth:50,cellRenderer:t=>t.data?._group?t.data?.expanded?"\u2212":"+":""},{field:"productname",headerName:"Product",flex:3,minWidth:120,cellStyle:t=>t.data?._group?t.data?.expanded?{"font-weight":"bold","background-color":"#90caf9",cursor:"pointer"}:{"font-weight":"bold","background-color":"#e3f2fd",cursor:"pointer"}:null,onCellClicked:t=>{t.data?._group&&this.toggleExpand(t.data._product)}},{field:"billno",headerName:"Bill No",flex:1.5,minWidth:60},{field:"billdate",headerName:"Date",flex:1.5,minWidth:80,valueFormatter:t=>this.formatGridDate(t.value)},{field:"customername",headerName:"Customer",flex:2.5,minWidth:100},{field:"qty",headerName:"Pcs",flex:1,minWidth:50,type:"numericColumn",valueFormatter:t=>this.formatGridNumber(t.value)},{field:"weight",headerName:"Weight",flex:1.5,minWidth:70,type:"numericColumn",valueFormatter:t=>this.formatGridNumber(t.value)},{field:"amount",headerName:"Amount",flex:1.5,minWidth:80,type:"numericColumn",valueFormatter:t=>this.formatGridNumber(t.value)}]};currentGstConfig=M(()=>{switch(this.gstReportType()){case"invoice":return this.invoiceReportConfig;case"saleregister":return this.saleRegisterConfig;case"productsales":return this.productSummaryConfig;case"productbdetail":return this.productBillDetailConfig;default:return this.invoiceReportConfig}});pktmasterMap=M(()=>{let t=new Map;return this.pktmasterList().forEach(e=>{e?.id&&t.set(e.id,e)}),t});headerMap=M(()=>{let t=new Map;return this.gstHeadersAll().forEach(e=>{e?.id&&t.set(e.id,e)}),t});gstPinnedBottomRow=M(()=>{let t=this.gstReportType(),e=this.gstInvoices();if(e.length===0)return[];if(t==="productsales"){let l=0,m=0,o=0;for(let r of e)l+=Number(r.totalpcs)||0,m+=Number(r.totalwgt)||0,o+=Number(r.totalamt)||0;return[{productname:"Total",totalpcs:l,totalwgt:m,totalamt:o}]}if(t==="productbdetail"){let l=0,m=0,o=0;for(let r of e)l+=Number(r.qty)||0,m+=Number(r.weight)||0,o+=Number(r.amount)||0;return[{billno:"Total",billdate:"",customername:"",productname:"",qty:l,weight:m,amount:o}]}let i=0,a=0,n=0;for(let l of e)i+=Number(l.totalpcs)||0,a+=Number(l.totalwgt)||0,n+=Number(l.nettamount)||0;let c={billno:"Total",billdate:"",customername:""};return c.totalpcs=i,c.totalwgt=a,c.nettamount=n,[c]});ngOnInit(){this.initDates(),this.loadGstData()}initDates(){let t=new Date().toISOString().split("T")[0];this.gstStartDate.set(t),this.gstEndDate.set(t)}onGstReportTypeChange(t){this.gstReportType.set(t),t!=="productbdetail"&&this.expandedBillnos.set(new Set),this.processGstData()}invoiceDetailsCache=new Map;async loadGstData(){this.gstLoading.set(!0);try{let[t,e,i]=await Promise.all([this.service.getOrderHeaderAll(),this.service.getOrderDetailAll(),this.service.getPktmasterAll()]),a=this.gstStartDate(),n=this.gstEndDate(),c=a?new Date(a).getTime():0,l=n?new Date(n).getTime():Number.MAX_SAFE_INTEGER,m=[],o=new Set;for(let f=0;f<t.length;f++){let h=t[f];if(!h?.id)continue;let x=this.normalizeDate(h.billdate),N=x?new Date(x).getTime():0;N>=c&&N<=l&&(m.push(h),o.add(h.id))}let r=e.filter(f=>o.has(String(f.billno)));this.gstHeadersAll.set(m),this.gstDetailsAll.set(r),this.pktmasterList.set(i),this.invoiceDetailsCache.clear(),this.processGstData()}catch(t){this.toastService.error(t.message||"Failed to load GST data")}finally{this.gstLoading.set(!1)}}processGstData(){let t=this.gstReportType(),e=this.gstHeadersAll(),i=this.gstDetailsAll();if(t==="productsales"){let n=new Map;for(let l of i){let m=l.particulars||l.pktname||"Unknown",o=n.get(m);o?(o.totalpcs+=Number(l.qty)||0,o.totalwgt+=Number(l.weight)||0,o.totalamt+=Number(l.amount)||0):n.set(m,{productname:m,totalpcs:Number(l.qty)||0,totalwgt:Number(l.weight)||0,totalamt:Number(l.amount)||0})}let c=Array.from(n.values()).sort((l,m)=>(l.productname||"").localeCompare(m.productname||""));this.gstInvoices.set(c);return}if(t==="productbdetail"){let n=new Map;for(let r of e)r?.id&&n.set(r.id,r);let c=this.expandedBillnos(),l=new Map;for(let r of i){let f=String(r.billno),h=n.get(f);if(h){let x=r.particulars||r.pktname||"Unknown",N={billno:h.billno,billdate:h.billdate,customername:h.customername,productname:x,qty:Number(r.qty)||0,weight:Number(r.weight)||0,amount:Number(r.amount)||0,_parent:f};l.has(x)||l.set(x,{items:[],totalQty:0,totalWeight:0,totalAmount:0});let $=l.get(x);$.items.push(N),$.totalQty+=N.qty,$.totalWeight+=N.weight,$.totalAmount+=N.amount}}let m=[],o=Array.from(l.keys()).sort((r,f)=>r.localeCompare(f));for(let r of o){let f=l.get(r);if(c.has(r)){m.push({productname:"\u25BC "+r,qty:f.totalQty,weight:f.totalWeight,amount:f.totalAmount,_group:!0,expanded:!0,_product:r});for(let h of f.items)m.push({billno:h.billno,billdate:h.billdate,customername:h.customername,productname:h.productname,qty:h.qty,weight:h.weight,amount:h.amount,expanded:!1})}else m.push({productname:"\u25B6 "+r,qty:f.totalQty,weight:f.totalWeight,amount:f.totalAmount,_group:!0,expanded:!1,_product:r})}this.gstInvoices.set(m);return}let a=[...e].sort((n,c)=>(Number(n.billno)||0)-(Number(c.billno)||0));this.gstInvoices.set(a)}async onGstRowClicked(t){this.gstReportType()==="invoice"&&t.data&&await this.printInvoiceFromList(t.data)}exportGstReport(){let t=this.gstInvoices(),e=this.gstReportType();if(t.length===0)return;let i,a;if(e==="productsales"){i=["Product","Total Pcs","Total Weight","Total Amount"],a=t.map(o=>`"${o.productname||""}","${o.totalpcs||0}","${o.totalwgt||0}","${o.totalamt||0}"`);let m=this.gstPinnedBottomRow()[0]||{};a.push(`"Total","${m.totalpcs||0}","${m.totalwgt||0}","${m.totalamt||0}"`)}else if(e==="productbdetail"){i=["Bill No","Date","Customer","Product","Pcs","Weight","Amount"],a=t.map(o=>`"${o.billno||""}","${this.formatPrintDate(o.billdate)}","${o.customername||""}","${o.productname||""}","${o.qty||0}","${o.weight||0}","${o.amount||0}"`);let m=this.gstPinnedBottomRow()[0]||{};a.push(`"Total","","","","${m.qty||0}","${m.weight||0}","${m.amount||0}"`)}else{i=this.currentGstConfig().columns.map(r=>r.headerName||r.field||""),a=t.map(r=>e==="invoice"?`"${r.billno||""}","${this.formatPrintDate(r.billdate)}","${r.customername||""}","${r.billamt||0}","${r.gstamt||0}","${r.nettamount||0}"`:`"${r.billno||""}","${this.formatPrintDate(r.billdate)}","${r.customername||""}","${r.totalpcs||0}","${r.totalwgt||0}","${r.nettamount||0}"`);let o=this.gstPinnedBottomRow()[0]||{};a.push(`"Total","","","${e==="invoice"?o.billamt||0:o.totalpcs||0}","${e==="invoice"?o.gstamt||0:o.totalwgt||0}","${o.nettamount||0}"`)}let n=`\uFEFF${i.join(",")}
${a.join(`
`)}`,c=new Blob([n],{type:"text/csv;charset=utf-8;"}),l=document.createElement("a");l.href=URL.createObjectURL(c),l.download=`${this.currentGstConfig().title}_${new Date().toISOString().split("T")[0]}.csv`,l.click()}importGstData(t){let e=t.target;if(!e.files?.length)return;let i=e.files[0],a=new FileReader;a.onload=n=>{try{let l=(n.target?.result).split(`
`);if(l.length<2){this.toastService.error("CSV file is empty or invalid");return}let m=[];for(let o=1;o<l.length;o++){let r=l[o].trim();if(!r)continue;let f=r.match(/("([^"]*)"|[^,]+)/g);if(!f||f.length<7)continue;let h=f.map(x=>x.replace(/^"|"$/g,"").trim());m.push({billno:h[0],billdate:this.parseImportDate(h[1]),customername:h[2],productname:h[3],qty:Number(h[4])||0,weight:Number(h[5])||0,amount:Number(h[6])||0,_group:!1,expanded:!1})}this.processImportedData(m),this.toastService.success(`Imported ${m.length} records successfully`)}catch(c){this.toastService.error("Failed to import CSV: "+(c.message||"Invalid format"))}},a.readAsText(i),e.value=""}parseImportDate(t){if(!t)return"";if(/^\d{4}-\d{2}-\d{2}$/.test(t))return t;if(/^\d{2}\/\d{2}\/\d{4}$/.test(t)){let e=t.split("/");return`${e[2]}-${e[1]}-${e[0]}`}return t}processImportedData(t){let e=new Map;for(let i of t){let a=String(i.billno);if(!a||a==="Total")continue;e.has(a)||e.set(a,{billno:i.billno,billdate:i.billdate,customername:i.customername,_group:!0,expanded:!1});let n=e.get(a);n.qty=(n.qty||0)+i.qty,n.weight=(n.weight||0)+i.weight,n.amount=(n.amount||0)+i.amount}this.gstInvoices.set(Array.from(e.values()))}printGstReport(){let t=this.gstInvoices(),e=this.gstReportType();if(t.length===0)return;let i=this.currentGstConfig(),a=[];for(let o=0;o<t.length;o++){let r=t[o];e==="productsales"?a.push(`<tr>
          <td style="border:1px solid #000;padding:4px;">${this.escapeHtml(r.productname||"")}</td>
          <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(r.totalpcs)}</td>
          <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(r.totalwgt)}</td>
          <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(r.totalamt)}</td>
        </tr>`):e==="productbdetail"?a.push(`<tr>
          <td style="border:1px solid #000;padding:4px;">${this.escapeHtml(String(r.billno||""))}</td>
          <td style="border:1px solid #000;padding:4px;">${this.escapeHtml(this.formatPrintDate(r.billdate))}</td>
          <td style="border:1px solid #000;padding:4px;">${this.escapeHtml(r.customername||"")}</td>
          <td style="border:1px solid #000;padding:4px;">${this.escapeHtml(r.productname||"")}</td>
          <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(r.qty)}</td>
          <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(r.weight)}</td>
          <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(r.amount)}</td>
        </tr>`):a.push(`<tr>
          <td style="border:1px solid #000;padding:4px;">${this.escapeHtml(String(r.billno||""))}</td>
          <td style="border:1px solid #000;padding:4px;">${this.escapeHtml(this.formatPrintDate(r.billdate))}</td>
          <td style="border:1px solid #000;padding:4px;">${this.escapeHtml(r.customername||"")}</td>
          <td style="border:1px solid #000;padding:4px;text-align:right;">${e==="invoice"?this.formatGridNumber(r.billamt):this.formatGridNumber(r.totalpcs)}</td>
          <td style="border:1px solid #000;padding:4px;text-align:right;">${e==="invoice"?this.formatGridNumber(r.gstamt):this.formatGridNumber(r.totalwgt)}</td>
          <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(r.nettamount)}</td>
        </tr>`)}let n=this.gstPinnedBottomRow()[0]||{},c="";e==="productsales"?c=`<tr style="background:#e7f1ff;font-weight:bold;">
        <td style="border:1px solid #000;padding:4px;">Total</td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(n.totalpcs)}</td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(n.totalwgt)}</td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(n.totalamt)}</td>
      </tr>`:e==="productbdetail"?c=`<tr style="background:#e7f1ff;font-weight:bold;">
        <td style="border:1px solid #000;padding:4px;">Total</td>
        <td style="border:1px solid #000;padding:4px;"></td>
        <td style="border:1px solid #000;padding:4px;"></td>
        <td style="border:1px solid #000;padding:4px;"></td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(n.qty)}</td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(n.weight)}</td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(n.amount)}</td>
      </tr>`:c=`<tr style="background:#e7f1ff;font-weight:bold;">
        <td style="border:1px solid #000;padding:4px;">Total</td>
        <td style="border:1px solid #000;padding:4px;"></td>
        <td style="border:1px solid #000;padding:4px;"></td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${e==="invoice"?this.formatGridNumber(n.billamt||0):this.formatGridNumber(n.totalpcs)}</td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${e==="invoice"?this.formatGridNumber(n.gstamt||0):this.formatGridNumber(n.totalwgt)}</td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(n.nettamount)}</td>
      </tr>`;let l="";e==="productsales"?l='<th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Product</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Total Pcs</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Total Wgt</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Total Amt</th>':e==="productbdetail"?l='<th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Bill No</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Date</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Customer</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Product</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Pcs</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Weight</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Amount</th>':l=`<th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Bill No</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Date</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Customer</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">${e==="invoice"?"Bill Amt":"Pcs"}</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">${e==="invoice"?"GST Amt":"Weight"}</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Net Amt</th>`;let m=`
      <html>
        <head>
          <title>${this.escapeHtml(i.title)}</title>
          <style>
            @page { size: A4 portrait; margin: 8mm; }
            body { margin: 0; font-family: 'Times New Roman', serif; font-size: 10px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding: 8px 0; margin-bottom: 10px; }
            .header h2 { margin: 0 0 4px 0; font-size: 16px; }
            .header p { margin: 0; font-size: 10px; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; }
            th, td { border: 1px solid #000; padding: 3px 4px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>GCSheet - ${this.escapeHtml(i.title)}</h2>
            <p>From: ${this.escapeHtml(this.gstStartDate()||"All")} | To: ${this.escapeHtml(this.gstEndDate()||"All")}</p>
            <p>Generated: ${this.escapeHtml(new Date().toLocaleString())}</p>
          </div>
          <table>
            <thead><tr>${l}</tr></thead>
            <tbody>${a.join("")}${c}</tbody>
          </table>
        </body>
      </html>
    `;this.openPrintWindow(m,i.title)}async printAllInvoices(){let t=this.gstInvoices();if(t.length!==0){this.gstLoading.set(!0);try{let e=[],i=t.map(n=>this.getInvoiceDetailsWithPktname(n.id)),a=await Promise.all(i);for(let n=0;n<t.length;n++)e.push(this.buildInvoiceHtml(t[n],a[n],!0));this.openPrintWindow(`<html><head><title>GCSheet Invoices</title></head><body style="margin:0;">${e.join("")}</body></html>`,"GCSheet Invoices")}catch(e){this.toastService.error(e.message||"Failed to print invoices")}finally{this.gstLoading.set(!1)}}}async printInvoiceFromList(t){if(t?.id){this.gstLoading.set(!0);try{let e=await this.getInvoiceDetailsWithPktname(t.id);this.openPrintWindow(`<html><head><title>Invoice ${this.escapeHtml(String(t.billno||""))}</title></head><body style="margin:0;">${this.buildInvoiceHtml(t,e,!1)}</body></html>`,`Invoice ${t.billno}`)}catch(e){this.toastService.error(e.message||"Failed to print invoice")}finally{this.gstLoading.set(!1)}}}confirmDayEnd(){this.showDayEndModal.set(!0)}closeDayEndModal(){this.showDayEndModal.set(!1)}async executeDayEnd(){let t=this.gstStartDate(),e=this.gstEndDate();if(!t||!e){this.toastService.error("Please select start and end dates");return}this.gstLoading.set(!0);try{let i=this.gstHeadersAll();for(let a of i)await this.service.deleteOrderDetailsByBillno(a.id),await this.service.deleteOrderHeader(a.id);this.toastService.success(`Day End completed. ${i.length} invoice(s) deleted.`),this.closeDayEndModal(),await this.loadGstData()}catch(i){this.toastService.error(i.message||"Failed to complete Day End")}finally{this.gstLoading.set(!1)}}async getInvoiceDetailsWithPktname(t){let e=this.invoiceDetailsCache.get(t);if(e)return e;let a=this.gstDetailsAll().filter(l=>String(l.billno)===String(t)),n=this.pktmasterMap(),c=a.map(l=>{let m=n.get(l.pktno);return O(P({},l),{pktname:m?.pktname||l.pktname||"",particulars:l.particulars||m?.pktname||""})});return this.invoiceDetailsCache.set(t,c),c}buildInvoiceHtml(t,e,i){let a=Number(t.totalwgt)||0,n=Number(t.billamt)||0,c=Number(t.nettamount)||0,l=Number(t.other1_amt)||0,m=Number(t.other2_amt)||0,o=Number(t.loadamt)||0,r=Number(t.gstper)||0,f=Number(t.gstamt)||0,h=n+o+l+m,x=String(t.customername||"").split(/\r?\n|,/).map(v=>v.trim()).filter(v=>v),N=e.map((v,it)=>{let nt=Number(v.weight)||0,rt=Number(v.amount)||0;return`
        <tr>
          <td class="c">${it+1}</td>
          <td>${this.escapeHtml(v.particulars||v.pktname||"")}</td>
          <td class="r">${this.formatQty(v.qty)}</td>
          <td class="r">${this.formatIndianNumber(nt,2)}</td>
          <td class="r">${this.formatIndianNumber(v.rate,2)}</td>
          <td class="r">${this.formatIndianNumber(rt,2)}</td>
        </tr>
      `}).join(""),tt=Math.max(0,16-e.length),et=Array.from({length:tt}).map(()=>`
      <tr class="blank-row">
        <td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td>
      </tr>
    `).join("");return`
      <div style="page-break-after:${i?"always":"auto"};">
        <style>
          @page { size: A4; margin: 8mm; }
          body { font-family: 'Times New Roman', serif; font-size: 13px; color: #000; margin: 0; }
          .sheet { width: 100%; border: 1px solid #000; }
          .title-grid { width: 100%; border-collapse: collapse; table-layout: fixed; }
          .title-grid td { border: 1px solid #000; padding: 3px 6px; }
          .title { text-align: center; font-size: 30px; }
          .page { text-align: right; width: 220px; }
          .head-grid { width: 100%; border-collapse: collapse; table-layout: fixed; }
          .head-grid td { border: 1px solid #000; vertical-align: top; }
          .left-box { height: 142px; padding: 6px; }
          .left-lines { line-height: 1.3; margin-top: 4px; }
          .left-lines .name { margin-left: 42px; }
          .left-lines .line { margin-left: 42px; }
          .right-box table { width: 100%; border-collapse: collapse; table-layout: fixed; }
          .right-box td { border: 1px solid #000; padding: 2px 6px; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #000; padding: 2px 4px; }
          th { font-weight: 400; text-align: center; }
          .c { text-align: center; }
          .r { text-align: right; }
          .items {
            table-layout: fixed;
            border-collapse: separate;
            border-spacing: 0;
            border-left: 1px solid #000;
            border-top: 1px solid #000;
          }
          .items th, .items td {
            border: 0 !important;
            border-right: 1px solid #000 !important;
            border-bottom: 1px solid #000 !important;
          }
          .items th:nth-child(1), .items td:nth-child(1) { width: 5%; }
          .items th:nth-child(2), .items td:nth-child(2) { width: 52%; }
          .items th:nth-child(3), .items td:nth-child(3) { width: 10%; }
          .items th:nth-child(4), .items td:nth-child(4) { width: 12%; }
          .items th:nth-child(5), .items td:nth-child(5) { width: 10%; }
          .items th:nth-child(6), .items td:nth-child(6) { width: 11%; }
          .blank-row td { height: 22px; }
          .totals-row { width: 100%; border-collapse: collapse; table-layout: fixed; }
          .totals-row td { border: 1px solid #000; padding: 6px 8px; font-size: 13px; }
          .totals-row .label { text-align: left; }
          .totals-row .value { text-align: right; font-weight: 600; }
          .bottom-wrap { width: 100%; border-collapse: collapse; table-layout: fixed; }
          .bottom-wrap > tbody > tr > td { border: 1px solid #000; vertical-align: top; }
          .left-bottom { height: 180px; padding: 6px; }
          .left-bottom .narration { margin-bottom: 8px; }
          .left-bottom .rupees { margin-top: 72px; font-size: 13px; }
          .right-bottom table { width: 100%; border-collapse: collapse; table-layout: fixed; }
          .right-bottom td { border: 1px solid #000; padding: 6px; font-size: 13px; }
          .right-bottom .slabel { text-align: left; }
          .right-bottom .sval { text-align: right; font-weight: 600; }
          .thanks { text-align: center; border-top: 1px solid #000; border-bottom: 1px solid #000; font-size: 13px; }
          .sign-row { width: 100%; border-collapse: collapse; table-layout: fixed; }
          .sign-row td { padding: 8px 12px; font-size: 13px; }
          .sign-row td:last-child { text-align: right; }
        </style>
        <div class="sheet">
          <table class="title-grid">
            <tr>
              <td class="title">Estimate -new</td>
              <td class="page">Page 1 of 1</td>
            </tr>
          </table>

          <table class="head-grid">
            <tr>
              <td style="width:62%">
                <div class="left-box">
                  <div><strong>M/s :</strong></div>
                  <div class="left-lines">
                    <div class="name"><strong>${this.escapeHtml(x[0]||t.customername||"")}</strong></div>
                    ${x.slice(1).map(v=>`<div class="line">${this.escapeHtml(v)}</div>`).join("")||'<div class="line">&nbsp;</div><div class="line">&nbsp;</div>'}
                  </div>
                </div>
              </td>
              <td style="width:38%" class="right-box">
                <table>
                  <tr><td colspan="2" class="r"><strong>Date : ${this.escapeHtml(this.formatPrintDate(t.billdate))}</strong></td></tr>
                  <tr><td style="width:45%">Truck No.</td><td><strong>${this.escapeHtml(t.truckno||"")}</strong></td></tr>
                  <tr><td>Transport :</td><td>${this.escapeHtml(t.transportation||"")}</td></tr>
                  <tr><td>Weight Slipno:</td><td>${this.escapeHtml(t.wgtslipno||"")}</td></tr>
                  <tr><td>Load Slipno:</td><td>${this.escapeHtml(t.loadslipno||"")}</td></tr>
                </table>
              </td>
            </tr>
          </table>
          <table class="items">
            <thead>
              <tr>
                <th>no</th>
                <th>Particulars</th>
                <th>Pieces</th>
                <th>Weight</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${N}
              ${et}
            </tbody>
          </table>
          <table class="totals-row">
            <tr>
              <td class="label">Total  Pcs</td>
              <td class="value">${this.formatQty(t.totalpcs)}</td>
              <td class="label">Total  Kgs</td>
              <td class="value">${this.formatIndianNumber(a,2)}</td>
              <td class="value">${this.formatIndianNumber(n,2)}</td>
            </tr>
          </table>
          <table class="bottom-wrap">
            <tr>
              <td style="width:62%" class="left-bottom">
                <div class="narration"><strong>Narration : ${this.escapeHtml(t.narration||"")}</strong></div>
                <div class="rupees"><strong>Rs:</strong> ${this.escapeHtml(this.amountInWords(c).toLowerCase())} only</div>
              </td>
              <td style="width:38%" class="right-bottom">
                <table>
                  <tr><td class="slabel">Load Amt :</td><td class="sval">${this.formatIndianNumber(o,2)}</td></tr>
                  <tr><td class="slabel">${this.escapeHtml(t.other1_desp||"Other 1")} :</td><td class="sval">${this.formatIndianNumber(l,2)}</td></tr>
                  <tr><td class="slabel">${this.escapeHtml(t.other2_desp||"Other 2")} :</td><td class="sval">${this.formatIndianNumber(m,2)}</td></tr>
                  <tr><td class="slabel">&nbsp;</td><td class="sval">&nbsp;</td></tr>
                  <tr><td class="slabel">Total Amount :</td><td class="sval">${this.formatIndianNumber(h,2)}</td></tr>
                  <tr><td class="slabel">GST @ ${this.formatIndianNumber(r,2)} % :</td><td class="sval">${this.formatIndianNumber(f,2)}</td></tr>
                  <tr><td class="slabel"><strong>Nett Amount :</strong></td><td class="sval"><strong>${this.formatIndianNumber(c,2)}</strong></td></tr>
                </table>
              </td>
            </tr>
          </table>
          <div class="thanks">Thank you Visit Again</div>
          <table class="sign-row">
            <tr>
              <td>Checked By</td>
              <td>Authorised Sign</td>
            </tr>
          </table>
        </div>
      </div>
    `}openPrintWindow(t,e){let i=window.open("","_blank","width=1100,height=700");if(!i){this.toastService.error("Please allow popups to print");return}i.document.open(),i.document.write(t),i.document.close(),i.focus(),setTimeout(()=>{i.document.title=e,i.print(),setTimeout(()=>i.close(),200)},250)}getFormattedColumnValue(t,e){let i=t[e.field||""];return e.valueFormatter&&typeof e.valueFormatter=="function"?i=e.valueFormatter({value:i,data:t,node:null,column:null,colDef:e}):e.type==="numericColumn"&&(i=this.formatGridNumber(i)),String(i??"")}normalizeDate(t){if(!t)return"";let e=String(t);return e.includes("T")?e.split("T")[0]:e.includes(" ")?e.split(" ")[0]:e}formatGridNumber(t){return(Number(t)||0).toFixed(2)}formatGridDate(t){if(!t)return"";let e=String(t),i=e.includes("T")?e.split("T")[0]:e.split(" ")[0];if(!i)return"";let a=i.split("-");return a.length===3?`${a[2]}/${a[1]}/${a[0]}`:i}formatPrintDate(t){let e=this.normalizeDate(t);if(!e)return"";let i=e.split("-");return i.length===3?`${i[2]}/${i[1]}/${i[0]}`:e}formatIndianNumber(t,e=2){return(Number(t)||0).toLocaleString("en-IN",{minimumFractionDigits:e,maximumFractionDigits:e})}formatQty(t){let e=Number(t)||0;return Number.isInteger(e)?String(e):e.toFixed(2)}roundTo2(t){return Math.round((t+Number.EPSILON)*100)/100}splitPacketText(t){let e=String(t||"").trim().replace(/\s+/g," ");if(!e)return{grade:"",particulars:""};let[i,...a]=e.split(" ");return/[=]/.test(i)||/^[A-Za-z]+\d/.test(i)?{grade:i,particulars:a.join(" ")}:{grade:"",particulars:e}}amountInWords(t){if(!t)return"Zero";let e=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],i=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"],a=o=>o<20?e[o]:o<100?i[Math.floor(o/10)]+(o%10?` ${e[o%10]}`:""):o<1e3?e[Math.floor(o/100)]+" Hundred"+(o%100?` ${a(o%100)}`:""):o<1e5?a(Math.floor(o/1e3))+" Thousand"+(o%1e3?` ${a(o%1e3)}`:""):o<1e7?a(Math.floor(o/1e5))+" Lakh"+(o%1e5?` ${a(o%1e5)}`:""):a(Math.floor(o/1e7))+" Crore"+(o%1e7?` ${a(o%1e7)}`:""),n=Math.floor(t),c=Math.round((t-n)*100),l=a(n),m=c>0?a(c):"";return m?`${l} Rupees and ${m} Paise`:`${l} Rupees`}escapeHtml(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}goToDashboard(){this.router.navigate(["/dashboard"])}logout(){this.router.navigate(["/login"])}navigateToUsers(){this.router.navigate(["/users"])}navigateToGroupmaster(){this.router.navigate(["/groupmaster"])}navigateToGcsheetCompany(){this.router.navigate(["/gcsheet-company"])}navigateToGcsheetFit(){this.router.navigate(["/gcsheet-fit"])}navigateToGcsheetMm(){this.router.navigate(["/gcsheet-mm"])}navigateToGcsheetGrade(){this.router.navigate(["/gcsheet-grade"])}navigateToGcsheetItem(){this.router.navigate(["/gcsheet-item"])}navigateToGcsheetNali(){this.router.navigate(["/gcsheet-nali"])}navigateToGcsheetPktmaster(){this.router.navigate(["/gcsheet-pktmaster"])}navigateToGcsheetSaleinv(){this.router.navigate(["/gcsheet-saleinv"])}navigateToGcsheetOrderreport(){this.router.navigate(["/gcsheet1-orderreport"])}navigateToGcsheetDayend(){this.router.navigate(["/gcsheet1-dayend"])}toggleMasterMenu(){this.showMasterMenu=!this.showMasterMenu}toggleGcsheetMenu(){this.showGcsheetMenu=!this.showGcsheetMenu}toggleExpand(t){let e=new Set(this.expandedBillnos());e.has(t)?e.delete(t):e.add(t),this.expandedBillnos.set(e),this.processGstData()}getRowId(t){return t.data.billno+"_"+t.data.productname}static \u0275fac=function(e){return new(e||b)};static \u0275cmp=A({type:b,selectors:[["app-gcsheet1-orderreport"]],decls:108,vars:13,consts:[["fileInput",""],[1,"navbar","navbar-expand-lg","navbar-dark","bg-primary"],[1,"container-fluid"],[1,"navbar-brand",2,"cursor","pointer",3,"click"],[1,"bi","bi-shield-check","me-2"],["type","button",1,"navbar-toggler",3,"click"],[1,"navbar-toggler-icon"],[1,"collapse","navbar-collapse"],[1,"navbar-nav","me-auto"],[1,"nav-item"],[1,"nav-link",3,"click"],[1,"bi","bi-speedometer2","me-1"],[1,"nav-item","dropdown"],[1,"nav-link","dropdown-toggle",2,"cursor","pointer",3,"click"],[1,"bi","bi-grid-3x3-gap","me-1"],[1,"dropdown-menu"],[1,"dropdown-item",3,"click"],[1,"bi","bi-building","me-2"],[1,"bi","bi-rulers","me-2"],[1,"bi","bi-box","me-2"],[1,"bi","bi-bar-chart","me-2"],[1,"bi","bi-box-seam","me-2"],[1,"bi","bi-geo-alt","me-2"],[1,"dropdown-divider"],[1,"bi","bi-collection","me-2"],[1,"bi","bi-receipt","me-2"],[1,"dropdown-item","active",2,"color","#0d6efd","font-weight","500"],[1,"bi","bi-file-earmark-bar-graph","me-2"],[1,"bi","bi-calendar-check","me-2"],[1,"navbar-nav"],[1,"btn","btn-outline-light","btn-sm",3,"click"],[1,"bi","bi-box-arrow-right","me-1"],[1,"container-fluid","mt-3"],[1,"card"],[1,"card-header","bg-white","d-flex","justify-content-between","align-items-center","flex-wrap","gap-2"],[1,"mb-0"],[1,"bi","bi-percent","me-2"],[1,"d-flex","gap-2","align-items-center","flex-wrap"],[1,"d-flex","align-items-center","gap-1"],[1,"form-label","mb-0","small","text-muted"],["type","date",1,"form-control","form-control-sm",2,"width","130px",3,"ngModelChange","ngModel"],[1,"form-select","form-select-sm",2,"width","160px",3,"ngModelChange","ngModel"],["value","invoice"],["value","saleregister"],["value","productsales"],["value","productbdetail"],[1,"btn","btn-primary","btn-sm",3,"click"],[1,"bi","bi-check-circle","me-1"],[1,"btn","btn-outline-success","btn-sm",3,"click","disabled"],[1,"bi","bi-file-earmark-excel","me-1"],["type","file","accept",".csv",2,"display","none",3,"change"],[1,"btn","btn-outline-secondary","btn-sm",3,"click","disabled"],[1,"bi","bi-file-earmark-import","me-1"],[1,"btn","btn-warning","btn-sm",3,"disabled"],[1,"btn","btn-outline-primary","btn-sm",3,"disabled"],[1,"card-body","p-0"],[1,"text-center","py-4"],["tabindex","-1",1,"modal","show","d-block",2,"background-color","rgba(0,0,0,0.5)"],[1,"btn","btn-warning","btn-sm",3,"click","disabled"],[1,"bi","bi-printer","me-1"],[1,"btn","btn-outline-primary","btn-sm",3,"click","disabled"],["role","status",1,"spinner-border","text-primary"],[1,"mt-2"],[1,"ag-theme-quartz",2,"height","550px","width","100%",3,"rowClicked","rowData","columnDefs","defaultColDef","pagination","paginationPageSize","pinnedBottomRowData","alwaysShowVerticalScroll","rowHeight","getRowId","rowSelection"],[1,"alert","alert-warning","mb-0","mt-2"],[1,"alert","alert-info","mb-0","mt-2"],[1,"bi","bi-info-circle","me-1"],[1,"modal-dialog","modal-dialog-centered"],[1,"modal-content"],[1,"modal-header","bg-danger","text-white"],[1,"modal-title"],[1,"bi","bi-exclamation-triangle","me-2"],["type","button",1,"btn-close","btn-close-white",3,"click"],[1,"modal-body","text-center"],[1,"fs-5"],[1,"text-muted"],[1,"fw-bold"],[1,"text-danger"],[1,"bi","bi-exclamation-octagon","me-1"],[1,"modal-footer","justify-content-center"],["type","button",1,"btn","btn-secondary",3,"click"],["type","button",1,"btn","btn-danger",3,"click","disabled"],[1,"spinner-border","spinner-border-sm","me-1"],[1,"bi","bi-calendar-check","me-1"]],template:function(e,i){if(e&1){let a=S();s(0,"nav",1)(1,"div",2)(2,"a",3),g("click",function(){return i.goToDashboard()}),u(3,"i",4),p(4,"GCSheet "),d(),s(5,"button",5),g("click",function(){return i.isCollapsed=!i.isCollapsed}),u(6,"span",6),d(),s(7,"div",7)(8,"ul",8)(9,"li",9)(10,"a",10),g("click",function(){return i.goToDashboard()}),u(11,"i",11),p(12," Dashboard "),d()(),s(13,"li",12)(14,"a",13),g("click",function(){return i.toggleGcsheetMenu()}),u(15,"i",14),p(16," Gcsheet "),d(),s(17,"ul",15)(18,"li")(19,"a",16),g("click",function(){return i.navigateToGcsheetCompany()}),u(20,"i",17),p(21,"Company"),d()(),s(22,"li")(23,"a",16),g("click",function(){return i.navigateToGcsheetFit()}),u(24,"i",18),p(25,"Fit"),d()(),s(26,"li")(27,"a",16),g("click",function(){return i.navigateToGcsheetMm()}),u(28,"i",19),p(29,"MM"),d()(),s(30,"li")(31,"a",16),g("click",function(){return i.navigateToGcsheetGrade()}),u(32,"i",20),p(33,"Grade"),d()(),s(34,"li")(35,"a",16),g("click",function(){return i.navigateToGcsheetItem()}),u(36,"i",21),p(37,"Item"),d()(),s(38,"li")(39,"a",16),g("click",function(){return i.navigateToGcsheetNali()}),u(40,"i",22),p(41,"Nali"),d()(),s(42,"li"),u(43,"hr",23),d(),s(44,"li")(45,"a",16),g("click",function(){return i.navigateToGcsheetPktmaster()}),u(46,"i",24),p(47,"Packet Master"),d()(),s(48,"li")(49,"a",16),g("click",function(){return i.navigateToGcsheetSaleinv()}),u(50,"i",25),p(51,"Sale Invoice"),d()(),s(52,"li")(53,"a",26),u(54,"i",27),p(55,"Order Report"),d()(),s(56,"li")(57,"a",16),g("click",function(){return i.navigateToGcsheetDayend()}),u(58,"i",28),p(59,"Day End"),d()()()()(),s(60,"ul",29)(61,"li",9)(62,"button",30),g("click",function(){return i.logout()}),u(63,"i",31),p(64,"Logout "),d()()()()()(),s(65,"div",32)(66,"div",33)(67,"div",34)(68,"h5",35),u(69,"i",36),p(70),d(),s(71,"div",37)(72,"div",38)(73,"label",39),p(74,"Start:"),d(),s(75,"input",40),g("ngModelChange",function(c){return i.gstStartDate.set(c)}),d()(),s(76,"div",38)(77,"label",39),p(78,"End:"),d(),s(79,"input",40),g("ngModelChange",function(c){return i.gstEndDate.set(c)}),d()(),s(80,"label",39),p(81,"Report Type:"),d(),s(82,"select",41),g("ngModelChange",function(c){return i.onGstReportTypeChange(c)}),s(83,"option",42),p(84,"Print Invoice"),d(),s(85,"option",43),p(86,"Sale Register"),d(),s(87,"option",44),p(88,"Product Summary"),d(),s(89,"option",45),p(90,"Product Order-Detail"),d()(),s(91,"button",46),g("click",function(){return i.loadGstData()}),u(92,"i",47),p(93,"Load "),d(),s(94,"button",48),g("click",function(){return i.exportGstReport()}),u(95,"i",49),p(96,"Export "),d(),s(97,"input",50,0),g("change",function(c){return i.importGstData(c)}),d(),s(99,"button",51),g("click",function(){k(a);let c=R(98);return D(c.click())}),u(100,"i",52),p(101,"Import "),d(),G(102,ot,3,1,"button",53)(103,lt,3,1,"button",54),d()(),s(104,"div",55),G(105,st,4,0,"div",56)(106,ct,3,13),d()()(),G(107,gt,25,4,"div",57)}e&2&&(y(7),I("show",!i.isCollapsed),y(10),I("show",i.showGcsheetMenu),y(53),F(i.currentGstConfig().title),y(5),C("ngModel",i.gstStartDate()),y(4),C("ngModel",i.gstEndDate()),y(3),C("ngModel",i.gstReportType()),y(12),C("disabled",i.gstInvoices().length===0),y(5),C("disabled",i.gstReportType()!=="productbdetail"),y(3),T(i.gstReportType()==="invoice"?102:103),y(3),T(i.gstLoading()?105:106),y(2),T(i.showDayEndModal()?107:-1))},dependencies:[W,Z,Q,U,V,j,z,q,J],styles:[".navbar[_ngcontent-%COMP%]   .dropdown-menu[_ngcontent-%COMP%]{position:absolute}.dropdown-item.active[_ngcontent-%COMP%]{background-color:#f8f9fa;font-weight:500}.product-group-row[_ngcontent-%COMP%]{background-color:#e3f2fd!important}.product-group-row-expanded[_ngcontent-%COMP%]{background-color:#bbdefb!important}"]})};export{Y as Gcsheet1OrderreportComponent};
