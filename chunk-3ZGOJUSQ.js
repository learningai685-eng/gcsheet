import{a as Z}from"./chunk-ZZX6YQHF.js";import{a as K}from"./chunk-COUE46VJ.js";import"./chunk-74SDAD7V.js";import{b as V,d as W,g as B,n as O,o as j,p as q,t as U}from"./chunk-OS5B4LCM.js";import{a as Q}from"./chunk-KVVV52BD.js";import{d as L,g as z}from"./chunk-GQTCIO6V.js";import{Ja as G,Ka as T,O as M,Oa as x,Pa as o,Qa as l,Ra as m,T as _,U as S,Ua as D,Xa as g,Za as y,a as I,b as P,ca as v,eb as E,gb as c,hb as A,jb as F,oa as b,pb as H,vb as N,za as R}from"./chunk-K6CD6SNP.js";var nt=()=>[];function at(u,t){if(u&1){let e=D();o(0,"button",53),g("click",function(){_(e);let n=y();return S(n.printAllInvoices())}),m(1,"i",54),c(2,"Print All "),l()}if(u&2){let e=y();x("disabled",e.gstInvoices().length===0||e.gstLoading())}}function rt(u,t){if(u&1){let e=D();o(0,"button",55),g("click",function(){_(e);let n=y();return S(n.printGstReport())}),m(1,"i",54),c(2,"Print "),l()}if(u&2){let e=y();x("disabled",e.gstInvoices().length===0)}}function ot(u,t){u&1&&(o(0,"div",51),m(1,"div",56),o(2,"p",57),c(3,"Loading..."),l()())}function lt(u,t){u&1&&(o(0,"div",59),m(1,"i",60),c(2,' Click on a row to print that invoice | Or use "Print All" to print all invoices '),l())}function st(u,t){if(u&1){let e=D();o(0,"ag-grid-angular",58),g("rowClicked",function(n){_(e);let r=y();return S(r.onGstRowClicked(n))}),l(),G(1,lt,3,0,"div",59)}if(u&2){let e=y();x("rowData",e.gstInvoices())("columnDefs",e.currentGstConfig().columns)("defaultColDef",e.defaultColDef)("pagination",!0)("paginationPageSize",20)("pinnedBottomRowData",e.gstReportType()!=="invoice"?e.gstPinnedBottomRow():H(9,nt))("alwaysShowVerticalScroll",!0)("rowSelection",e.gstReportType()==="invoice"?"single":void 0),b(),T(e.gstReportType()==="invoice"&&e.gstInvoices().length>0?1:-1)}}function dt(u,t){u&1&&m(0,"span",76)}function ct(u,t){u&1&&m(0,"i",77)}function mt(u,t){if(u&1){let e=D();o(0,"div",52)(1,"div",61)(2,"div",62)(3,"div",63)(4,"h5",64),m(5,"i",65),c(6,"Day End Confirmation"),l(),o(7,"button",66),g("click",function(){_(e);let n=y();return S(n.closeDayEndModal())}),l()(),o(8,"div",67)(9,"p",68),c(10,"Are you sure you want to perform Day End?"),l(),o(11,"p",69),c(12,"This will permanently delete all GCSheet sales records from"),l(),o(13,"p",70),c(14),l(),o(15,"p",71),m(16,"i",72),c(17,"This action cannot be undone!"),l()(),o(18,"div",73)(19,"button",74),g("click",function(){_(e);let n=y();return S(n.closeDayEndModal())}),c(20,"Cancel"),l(),o(21,"button",75),g("click",function(){_(e);let n=y();return S(n.executeDayEnd())}),G(22,dt,1,0,"span",76)(23,ct,1,0,"i",77),c(24," Confirm Day End "),l()()()()()}if(u&2){let e=y();b(14),F("",e.gstStartDate()," to ",e.gstEndDate()),b(7),x("disabled",e.gstLoading()),b(),T(e.gstLoading()?22:23)}}var X=class u{service=M(Z);router=M(z);toastService=M(Q);isCollapsed=!0;showMasterMenu=!1;showGcsheetMenu=!1;gstLoading=v(!1);gstStartDate=v("");gstEndDate=v("");gstReportType=v("invoice");gstInvoices=v([]);gstHeadersAll=v([]);gstDetailsAll=v([]);pktmasterList=v([]);showDayEndModal=v(!1);defaultColDef={sortable:!0,filter:!0,resizable:!0};invoiceReportConfig={title:"Invoice List",columns:[{field:"billno",headerName:"Bill No",width:100},{field:"billdate",headerName:"Date",width:120},{field:"customername",headerName:"Customer",width:220,valueFormatter:t=>t.value||"-"},{field:"billamt",headerName:"Bill Amt",width:120,type:"numericColumn",valueFormatter:t=>this.formatGridNumber(t.value)},{field:"gstamt",headerName:"GST Amt",width:110,type:"numericColumn",valueFormatter:t=>this.formatGridNumber(t.value)},{field:"nettamount",headerName:"Net Amt",width:120,type:"numericColumn",valueFormatter:t=>this.formatGridNumber(t.value)}]};saleRegisterConfig={title:"Sale Register",columns:[{field:"billno",headerName:"Bill No",width:90},{field:"billdate",headerName:"Date",width:110},{field:"customername",headerName:"Customer",width:200},{field:"totalpcs",headerName:"Pcs",width:80,type:"numericColumn",valueFormatter:t=>this.formatGridNumber(t.value)},{field:"totalwgt",headerName:"Weight",width:100,type:"numericColumn",valueFormatter:t=>this.formatGridNumber(t.value)},{field:"nettamount",headerName:"Net Amount",width:120,type:"numericColumn",valueFormatter:t=>this.formatGridNumber(t.value)}]};productSummaryConfig={title:"Product Summary",columns:[{field:"productname",headerName:"Product",width:300},{field:"totalpcs",headerName:"Total Pcs",width:100,type:"numericColumn",valueFormatter:t=>this.formatGridNumber(t.value)},{field:"totalwgt",headerName:"Total Weight",width:120,type:"numericColumn",valueFormatter:t=>this.formatGridNumber(t.value)},{field:"totalamt",headerName:"Total Amount",width:130,type:"numericColumn",valueFormatter:t=>this.formatGridNumber(t.value)}]};currentGstConfig=N(()=>{switch(this.gstReportType()){case"invoice":return this.invoiceReportConfig;case"saleregister":return this.saleRegisterConfig;case"productsales":return this.productSummaryConfig;default:return this.invoiceReportConfig}});pktmasterMap=N(()=>{let t=new Map;return this.pktmasterList().forEach(e=>{e?.id&&t.set(e.id,e)}),t});headerMap=N(()=>{let t=new Map;return this.gstHeadersAll().forEach(e=>{e?.id&&t.set(e.id,e)}),t});gstPinnedBottomRow=N(()=>{let t=this.gstReportType(),e=this.gstInvoices();if(e.length===0)return[];if(t==="productsales"){let s=0,p=0,a=0;for(let d of e)s+=Number(d.totalpcs)||0,p+=Number(d.totalwgt)||0,a+=Number(d.totalamt)||0;return[{productname:"Total",totalpcs:s,totalwgt:p,totalamt:a}]}let i=0,n=0,r=0;for(let s of e)i+=Number(s.totalpcs)||0,n+=Number(s.totalwgt)||0,r+=Number(s.nettamount)||0;let h={billno:"Total",billdate:"",customername:""};return h.totalpcs=i,h.totalwgt=n,h.nettamount=r,[h]});ngOnInit(){this.initDates(),this.loadGstData()}initDates(){let t=new Date().toISOString().split("T")[0];this.gstStartDate.set(t),this.gstEndDate.set(t)}onGstReportTypeChange(t){this.gstReportType.set(t),this.processGstData()}invoiceDetailsCache=new Map;async loadGstData(){this.gstLoading.set(!0);try{let[t,e,i]=await Promise.all([this.service.getSalesHeaderAll(),this.service.getSalesDetailAll(),this.service.getPktmasterAll()]),n=this.gstStartDate(),r=this.gstEndDate(),h=n?new Date(n).getTime():0,s=r?new Date(r).getTime():Number.MAX_SAFE_INTEGER,p=[],a=new Set;for(let w=0;w<t.length;w++){let C=t[w];if(!C?.id)continue;let k=this.normalizeDate(C.billdate),$=k?new Date(k).getTime():0;$>=h&&$<=s&&(p.push(C),a.add(C.id))}let d=e.filter(w=>a.has(String(w.billno)));this.gstHeadersAll.set(p),this.gstDetailsAll.set(d),this.pktmasterList.set(i),this.invoiceDetailsCache.clear(),this.processGstData()}catch(t){this.toastService.error(t.message||"Failed to load GST data")}finally{this.gstLoading.set(!1)}}processGstData(){let t=this.gstReportType(),e=this.gstHeadersAll(),i=this.gstDetailsAll();if(t==="productsales"){let r=new Map;for(let s of i){let p=s.particulars||s.pktname||"Unknown",a=r.get(p);a?(a.totalpcs+=Number(s.qty)||0,a.totalwgt+=Number(s.weight)||0,a.totalamt+=Number(s.amount)||0):r.set(p,{productname:p,totalpcs:Number(s.qty)||0,totalwgt:Number(s.weight)||0,totalamt:Number(s.amount)||0})}let h=Array.from(r.values()).sort((s,p)=>(s.productname||"").localeCompare(p.productname||""));this.gstInvoices.set(h);return}let n=[...e].sort((r,h)=>(Number(r.billno)||0)-(Number(h.billno)||0));this.gstInvoices.set(n)}async onGstRowClicked(t){this.gstReportType()==="invoice"&&t.data&&await this.printInvoiceFromList(t.data)}exportGstReport(){let t=this.gstInvoices(),e=this.gstReportType();if(t.length===0)return;let i,n;if(e==="productsales"){i=["Product","Total Pcs","Total Weight","Total Amount"],n=t.map(a=>`"${a.productname||""}","${a.totalpcs||0}","${a.totalwgt||0}","${a.totalamt||0}"`);let p=this.gstPinnedBottomRow()[0]||{};n.push(`"Total","${p.totalpcs||0}","${p.totalwgt||0}","${p.totalamt||0}"`)}else{i=this.currentGstConfig().columns.map(d=>d.headerName||d.field||""),n=t.map(d=>e==="invoice"?`"${d.billno||""}","${this.formatPrintDate(d.billdate)}","${d.customername||""}","${d.billamt||0}","${d.gstamt||0}","${d.nettamount||0}"`:`"${d.billno||""}","${this.formatPrintDate(d.billdate)}","${d.customername||""}","${d.totalpcs||0}","${d.totalwgt||0}","${d.nettamount||0}"`);let a=this.gstPinnedBottomRow()[0]||{};n.push(`"Total","","","${e==="invoice"?a.billamt||0:a.totalpcs||0}","${e==="invoice"?a.gstamt||0:a.totalwgt||0}","${a.nettamount||0}"`)}let r=`\uFEFF${i.join(",")}
${n.join(`
`)}`,h=new Blob([r],{type:"text/csv;charset=utf-8;"}),s=document.createElement("a");s.href=URL.createObjectURL(h),s.download=`${this.currentGstConfig().title}_${new Date().toISOString().split("T")[0]}.csv`,s.click()}printGstReport(){let t=this.gstInvoices(),e=this.gstReportType();if(t.length===0)return;let i=this.currentGstConfig(),n=[];for(let a=0;a<t.length;a++){let d=t[a];e==="productsales"?n.push(`<tr>
          <td style="border:1px solid #000;padding:4px;">${this.escapeHtml(d.productname||"")}</td>
          <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(d.totalpcs)}</td>
          <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(d.totalwgt)}</td>
          <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(d.totalamt)}</td>
        </tr>`):n.push(`<tr>
          <td style="border:1px solid #000;padding:4px;">${this.escapeHtml(String(d.billno||""))}</td>
          <td style="border:1px solid #000;padding:4px;">${this.escapeHtml(this.formatPrintDate(d.billdate))}</td>
          <td style="border:1px solid #000;padding:4px;">${this.escapeHtml(d.customername||"")}</td>
          <td style="border:1px solid #000;padding:4px;text-align:right;">${e==="invoice"?this.formatGridNumber(d.billamt):this.formatGridNumber(d.totalpcs)}</td>
          <td style="border:1px solid #000;padding:4px;text-align:right;">${e==="invoice"?this.formatGridNumber(d.gstamt):this.formatGridNumber(d.totalwgt)}</td>
          <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(d.nettamount)}</td>
        </tr>`)}let r=this.gstPinnedBottomRow()[0]||{},h="";e==="productsales"?h=`<tr style="background:#e7f1ff;font-weight:bold;">
        <td style="border:1px solid #000;padding:4px;">Total</td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(r.totalpcs)}</td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(r.totalwgt)}</td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(r.totalamt)}</td>
      </tr>`:h=`<tr style="background:#e7f1ff;font-weight:bold;">
        <td style="border:1px solid #000;padding:4px;">Total</td>
        <td style="border:1px solid #000;padding:4px;"></td>
        <td style="border:1px solid #000;padding:4px;"></td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${e==="invoice"?this.formatGridNumber(r.billamt||0):this.formatGridNumber(r.totalpcs)}</td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${e==="invoice"?this.formatGridNumber(r.gstamt||0):this.formatGridNumber(r.totalwgt)}</td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(r.nettamount)}</td>
      </tr>`;let s="";e==="productsales"?s='<th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Product</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Total Pcs</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Total Wgt</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Total Amt</th>':s=`<th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Bill No</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Date</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Customer</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">${e==="invoice"?"Bill Amt":"Pcs"}</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">${e==="invoice"?"GST Amt":"Weight"}</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Net Amt</th>`;let p=`
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
            <thead><tr>${s}</tr></thead>
            <tbody>${n.join("")}${h}</tbody>
          </table>
        </body>
      </html>
    `;this.openPrintWindow(p,i.title)}async printAllInvoices(){let t=this.gstInvoices();if(t.length!==0){this.gstLoading.set(!0);try{let e=[],i=t.map(r=>this.getInvoiceDetailsWithPktname(r.id)),n=await Promise.all(i);for(let r=0;r<t.length;r++)e.push(this.buildInvoiceHtml(t[r],n[r],!0));this.openPrintWindow(`<html><head><title>GCSheet Invoices</title></head><body style="margin:0;">${e.join("")}</body></html>`,"GCSheet Invoices")}catch(e){this.toastService.error(e.message||"Failed to print invoices")}finally{this.gstLoading.set(!1)}}}async printInvoiceFromList(t){if(t?.id){this.gstLoading.set(!0);try{let e=await this.getInvoiceDetailsWithPktname(t.id);this.openPrintWindow(`<html><head><title>Invoice ${this.escapeHtml(String(t.billno||""))}</title></head><body style="margin:0;">${this.buildInvoiceHtml(t,e,!1)}</body></html>`,`Invoice ${t.billno}`)}catch(e){this.toastService.error(e.message||"Failed to print invoice")}finally{this.gstLoading.set(!1)}}}confirmDayEnd(){this.showDayEndModal.set(!0)}closeDayEndModal(){this.showDayEndModal.set(!1)}async executeDayEnd(){let t=this.gstStartDate(),e=this.gstEndDate();if(!t||!e){this.toastService.error("Please select start and end dates");return}this.gstLoading.set(!0);try{let i=this.gstHeadersAll();for(let n of i)await this.service.deleteSalesDetailsByBillno(n.id),await this.service.deleteSalesHeader(n.id);this.toastService.success(`Day End completed. ${i.length} invoice(s) deleted.`),this.closeDayEndModal(),await this.loadGstData()}catch(i){this.toastService.error(i.message||"Failed to complete Day End")}finally{this.gstLoading.set(!1)}}async getInvoiceDetailsWithPktname(t){let e=this.invoiceDetailsCache.get(t);if(e)return e;let n=this.gstDetailsAll().filter(s=>String(s.billno)===String(t)),r=this.pktmasterMap(),h=n.map(s=>{let p=r.get(s.pktno);return P(I({},s),{pktname:p?.pktname||s.pktname||"",particulars:s.particulars||p?.pktname||""})});return this.invoiceDetailsCache.set(t,h),h}buildInvoiceHtml(t,e,i){let n=Number(t.totalwgt)||0,r=Number(t.billamt)||0,h=Number(t.nettamount)||0,s=Number(t.other1_amt)||0,p=Number(t.other2_amt)||0,a=Number(t.loadamt)||0,d=Number(t.gstper)||0,w=Number(t.gstamt)||0,C=r+a+s+p,k=String(t.customername||"").split(/\r?\n|,/).map(f=>f.trim()).filter(f=>f),$=e.map((f,tt)=>{let et=Number(f.weight)||0,it=Number(f.amount)||0;return`
        <tr>
          <td class="c">${tt+1}</td>
          <td>${this.escapeHtml(f.particulars||f.pktname||"")}</td>
          <td class="r">${this.formatQty(f.qty)}</td>
          <td class="r">${this.formatIndianNumber(et,2)}</td>
          <td class="r">${this.formatIndianNumber(f.rate,2)}</td>
          <td class="r">${this.formatIndianNumber(it,2)}</td>
        </tr>
      `}).join(""),J=Math.max(0,16-e.length),Y=Array.from({length:J}).map(()=>`
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
                    <div class="name"><strong>${this.escapeHtml(k[0]||t.customername||"")}</strong></div>
                    ${k.slice(1).map(f=>`<div class="line">${this.escapeHtml(f)}</div>`).join("")||'<div class="line">&nbsp;</div><div class="line">&nbsp;</div>'}
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
              ${$}
              ${Y}
            </tbody>
          </table>
          <table class="totals-row">
            <tr>
              <td class="label">Total  Pcs</td>
              <td class="value">${this.formatQty(t.totalpcs)}</td>
              <td class="label">Total  Kgs</td>
              <td class="value">${this.formatIndianNumber(n,2)}</td>
              <td class="value">${this.formatIndianNumber(r,2)}</td>
            </tr>
          </table>
          <table class="bottom-wrap">
            <tr>
              <td style="width:62%" class="left-bottom">
                <div class="narration"><strong>Narration : ${this.escapeHtml(t.narration||"")}</strong></div>
                <div class="rupees"><strong>Rs:</strong> ${this.escapeHtml(this.amountInWords(h).toLowerCase())} only</div>
              </td>
              <td style="width:38%" class="right-bottom">
                <table>
                  <tr><td class="slabel">Load Amt :</td><td class="sval">${this.formatIndianNumber(a,2)}</td></tr>
                  <tr><td class="slabel">${this.escapeHtml(t.other1_desp||"Other 1")} :</td><td class="sval">${this.formatIndianNumber(s,2)}</td></tr>
                  <tr><td class="slabel">${this.escapeHtml(t.other2_desp||"Other 2")} :</td><td class="sval">${this.formatIndianNumber(p,2)}</td></tr>
                  <tr><td class="slabel">&nbsp;</td><td class="sval">&nbsp;</td></tr>
                  <tr><td class="slabel">Total Amount :</td><td class="sval">${this.formatIndianNumber(C,2)}</td></tr>
                  <tr><td class="slabel">GST @ ${this.formatIndianNumber(d,2)} % :</td><td class="sval">${this.formatIndianNumber(w,2)}</td></tr>
                  <tr><td class="slabel"><strong>Nett Amount :</strong></td><td class="sval"><strong>${this.formatIndianNumber(h,2)}</strong></td></tr>
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
    `}openPrintWindow(t,e){let i=window.open("","_blank","width=1100,height=700");if(!i){this.toastService.error("Please allow popups to print");return}i.document.open(),i.document.write(t),i.document.close(),i.focus(),setTimeout(()=>{i.document.title=e,i.print(),setTimeout(()=>i.close(),200)},250)}getFormattedColumnValue(t,e){let i=t[e.field||""];return e.valueFormatter&&typeof e.valueFormatter=="function"?i=e.valueFormatter({value:i,data:t,node:null,column:null,colDef:e}):e.type==="numericColumn"&&(i=this.formatGridNumber(i)),String(i??"")}normalizeDate(t){if(!t)return"";let e=String(t);return e.includes("T")?e.split("T")[0]:e.includes(" ")?e.split(" ")[0]:e}formatGridNumber(t){return(Number(t)||0).toFixed(2)}formatPrintDate(t){let e=this.normalizeDate(t);if(!e)return"";let i=e.split("-");return i.length===3?`${i[2]}/${i[1]}/${i[0]}`:e}formatIndianNumber(t,e=2){return(Number(t)||0).toLocaleString("en-IN",{minimumFractionDigits:e,maximumFractionDigits:e})}formatQty(t){let e=Number(t)||0;return Number.isInteger(e)?String(e):e.toFixed(2)}roundTo2(t){return Math.round((t+Number.EPSILON)*100)/100}splitPacketText(t){let e=String(t||"").trim().replace(/\s+/g," ");if(!e)return{grade:"",particulars:""};let[i,...n]=e.split(" ");return/[=]/.test(i)||/^[A-Za-z]+\d/.test(i)?{grade:i,particulars:n.join(" ")}:{grade:"",particulars:e}}amountInWords(t){if(!t)return"Zero";let e=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],i=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"],n=a=>a<20?e[a]:a<100?i[Math.floor(a/10)]+(a%10?` ${e[a%10]}`:""):a<1e3?e[Math.floor(a/100)]+" Hundred"+(a%100?` ${n(a%100)}`:""):a<1e5?n(Math.floor(a/1e3))+" Thousand"+(a%1e3?` ${n(a%1e3)}`:""):a<1e7?n(Math.floor(a/1e5))+" Lakh"+(a%1e5?` ${n(a%1e5)}`:""):n(Math.floor(a/1e7))+" Crore"+(a%1e7?` ${n(a%1e7)}`:""),r=Math.floor(t),h=Math.round((t-r)*100),s=n(r),p=h>0?n(h):"";return p?`${s} Rupees and ${p} Paise`:`${s} Rupees`}escapeHtml(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}goToDashboard(){this.router.navigate(["/dashboard"])}logout(){this.router.navigate(["/login"])}navigateToUsers(){this.router.navigate(["/users"])}navigateToGroupmaster(){this.router.navigate(["/groupmaster"])}navigateToGcsheetCompany(){this.router.navigate(["/gcsheet-company"])}navigateToGcsheetFit(){this.router.navigate(["/gcsheet-fit"])}navigateToGcsheetMm(){this.router.navigate(["/gcsheet-mm"])}navigateToGcsheetGrade(){this.router.navigate(["/gcsheet-grade"])}navigateToGcsheetItem(){this.router.navigate(["/gcsheet-item"])}navigateToGcsheetNali(){this.router.navigate(["/gcsheet-nali"])}navigateToGcsheetPktmaster(){this.router.navigate(["/gcsheet-pktmaster"])}navigateToGcsheetSaleinv(){this.router.navigate(["/gcsheet-saleinv"])}navigateToGcsheetDayend(){this.router.navigate(["/gcsheet1-dayend"])}toggleMasterMenu(){this.showMasterMenu=!this.showMasterMenu}toggleGcsheetMenu(){this.showGcsheetMenu=!this.showGcsheetMenu}static \u0275fac=function(e){return new(e||u)};static \u0275cmp=R({type:u,selectors:[["app-gcsheet1-salereport"]],decls:101,vars:12,consts:[[1,"navbar","navbar-expand-lg","navbar-dark","bg-primary"],[1,"container-fluid"],[1,"navbar-brand",2,"cursor","pointer",3,"click"],[1,"bi","bi-shield-check","me-2"],["type","button",1,"navbar-toggler",3,"click"],[1,"navbar-toggler-icon"],[1,"collapse","navbar-collapse"],[1,"navbar-nav","me-auto"],[1,"nav-item"],[1,"nav-link",3,"click"],[1,"bi","bi-speedometer2","me-1"],[1,"nav-item","dropdown"],[1,"nav-link","dropdown-toggle",2,"cursor","pointer",3,"click"],[1,"bi","bi-grid-3x3-gap","me-1"],[1,"dropdown-menu"],[1,"dropdown-item",3,"click"],[1,"bi","bi-building","me-2"],[1,"bi","bi-rulers","me-2"],[1,"bi","bi-box","me-2"],[1,"bi","bi-bar-chart","me-2"],[1,"bi","bi-box-seam","me-2"],[1,"bi","bi-geo-alt","me-2"],[1,"dropdown-divider"],[1,"bi","bi-collection","me-2"],[1,"bi","bi-receipt","me-2"],[1,"dropdown-item","active",2,"color","#0d6efd","font-weight","500"],[1,"bi","bi-file-earmark-bar-graph","me-2"],[1,"bi","bi-calendar-check","me-2"],[1,"navbar-nav"],[1,"btn","btn-outline-light","btn-sm",3,"click"],[1,"bi","bi-box-arrow-right","me-1"],[1,"container-fluid","mt-3"],[1,"card"],[1,"card-header","bg-white","d-flex","justify-content-between","align-items-center","flex-wrap","gap-2"],[1,"mb-0"],[1,"bi","bi-percent","me-2"],[1,"d-flex","gap-2","align-items-center","flex-wrap"],[1,"d-flex","align-items-center","gap-1"],[1,"form-label","mb-0","small","text-muted"],["type","date",1,"form-control","form-control-sm",2,"width","130px",3,"ngModelChange","ngModel"],[1,"form-select","form-select-sm",2,"width","160px",3,"ngModelChange","ngModel"],["value","invoice"],["value","saleregister"],["value","productsales"],[1,"btn","btn-primary","btn-sm",3,"click"],[1,"bi","bi-check-circle","me-1"],[1,"btn","btn-outline-success","btn-sm",3,"click","disabled"],[1,"bi","bi-file-earmark-excel","me-1"],[1,"btn","btn-warning","btn-sm",3,"disabled"],[1,"btn","btn-outline-primary","btn-sm",3,"disabled"],[1,"card-body","p-0"],[1,"text-center","py-4"],["tabindex","-1",1,"modal","show","d-block",2,"background-color","rgba(0,0,0,0.5)"],[1,"btn","btn-warning","btn-sm",3,"click","disabled"],[1,"bi","bi-printer","me-1"],[1,"btn","btn-outline-primary","btn-sm",3,"click","disabled"],["role","status",1,"spinner-border","text-primary"],[1,"mt-2"],[1,"ag-theme-quartz",2,"height","450px","width","100%",3,"rowClicked","rowData","columnDefs","defaultColDef","pagination","paginationPageSize","pinnedBottomRowData","alwaysShowVerticalScroll","rowSelection"],[1,"alert","alert-warning","mb-0","mt-2"],[1,"bi","bi-info-circle","me-1"],[1,"modal-dialog","modal-dialog-centered"],[1,"modal-content"],[1,"modal-header","bg-danger","text-white"],[1,"modal-title"],[1,"bi","bi-exclamation-triangle","me-2"],["type","button",1,"btn-close","btn-close-white",3,"click"],[1,"modal-body","text-center"],[1,"fs-5"],[1,"text-muted"],[1,"fw-bold"],[1,"text-danger"],[1,"bi","bi-exclamation-octagon","me-1"],[1,"modal-footer","justify-content-center"],["type","button",1,"btn","btn-secondary",3,"click"],["type","button",1,"btn","btn-danger",3,"click","disabled"],[1,"spinner-border","spinner-border-sm","me-1"],[1,"bi","bi-calendar-check","me-1"]],template:function(e,i){e&1&&(o(0,"nav",0)(1,"div",1)(2,"a",2),g("click",function(){return i.goToDashboard()}),m(3,"i",3),c(4,"GCSheet "),l(),o(5,"button",4),g("click",function(){return i.isCollapsed=!i.isCollapsed}),m(6,"span",5),l(),o(7,"div",6)(8,"ul",7)(9,"li",8)(10,"a",9),g("click",function(){return i.goToDashboard()}),m(11,"i",10),c(12," Dashboard "),l()(),o(13,"li",11)(14,"a",12),g("click",function(){return i.toggleGcsheetMenu()}),m(15,"i",13),c(16," Gcsheet "),l(),o(17,"ul",14)(18,"li")(19,"a",15),g("click",function(){return i.navigateToGcsheetCompany()}),m(20,"i",16),c(21,"Company"),l()(),o(22,"li")(23,"a",15),g("click",function(){return i.navigateToGcsheetFit()}),m(24,"i",17),c(25,"Fit"),l()(),o(26,"li")(27,"a",15),g("click",function(){return i.navigateToGcsheetMm()}),m(28,"i",18),c(29,"MM"),l()(),o(30,"li")(31,"a",15),g("click",function(){return i.navigateToGcsheetGrade()}),m(32,"i",19),c(33,"Grade"),l()(),o(34,"li")(35,"a",15),g("click",function(){return i.navigateToGcsheetItem()}),m(36,"i",20),c(37,"Item"),l()(),o(38,"li")(39,"a",15),g("click",function(){return i.navigateToGcsheetNali()}),m(40,"i",21),c(41,"Nali"),l()(),o(42,"li"),m(43,"hr",22),l(),o(44,"li")(45,"a",15),g("click",function(){return i.navigateToGcsheetPktmaster()}),m(46,"i",23),c(47,"Packet Master"),l()(),o(48,"li")(49,"a",15),g("click",function(){return i.navigateToGcsheetSaleinv()}),m(50,"i",24),c(51,"Sale Invoice"),l()(),o(52,"li")(53,"a",25),m(54,"i",26),c(55,"Sale Report"),l()(),o(56,"li")(57,"a",15),g("click",function(){return i.navigateToGcsheetDayend()}),m(58,"i",27),c(59,"Day End"),l()()()()(),o(60,"ul",28)(61,"li",8)(62,"button",29),g("click",function(){return i.logout()}),m(63,"i",30),c(64,"Logout "),l()()()()()(),o(65,"div",31)(66,"div",32)(67,"div",33)(68,"h5",34),m(69,"i",35),c(70),l(),o(71,"div",36)(72,"div",37)(73,"label",38),c(74,"Start:"),l(),o(75,"input",39),g("ngModelChange",function(r){return i.gstStartDate.set(r)}),l()(),o(76,"div",37)(77,"label",38),c(78,"End:"),l(),o(79,"input",39),g("ngModelChange",function(r){return i.gstEndDate.set(r)}),l()(),o(80,"label",38),c(81,"Report Type:"),l(),o(82,"select",40),g("ngModelChange",function(r){return i.onGstReportTypeChange(r)}),o(83,"option",41),c(84,"Print Invoice"),l(),o(85,"option",42),c(86,"Sale Register"),l(),o(87,"option",43),c(88,"Product Summary"),l()(),o(89,"button",44),g("click",function(){return i.loadGstData()}),m(90,"i",45),c(91,"Load "),l(),o(92,"button",46),g("click",function(){return i.exportGstReport()}),m(93,"i",47),c(94,"Export "),l(),G(95,at,3,1,"button",48)(96,rt,3,1,"button",49),l()(),o(97,"div",50),G(98,ot,4,0,"div",51)(99,st,2,10),l()()(),G(100,mt,25,4,"div",52)),e&2&&(b(7),E("show",!i.isCollapsed),b(10),E("show",i.showGcsheetMenu),b(53),A(i.currentGstConfig().title),b(5),x("ngModel",i.gstStartDate()),b(4),x("ngModel",i.gstEndDate()),b(3),x("ngModel",i.gstReportType()),b(10),x("disabled",i.gstInvoices().length===0),b(3),T(i.gstReportType()==="invoice"?95:96),b(3),T(i.gstLoading()?98:99),b(2),T(i.showDayEndModal()?100:-1))},dependencies:[L,U,j,q,V,O,W,B,K],styles:[".navbar[_ngcontent-%COMP%]   .dropdown-menu[_ngcontent-%COMP%]{position:absolute}.dropdown-item.active[_ngcontent-%COMP%]{background-color:#f8f9fa;font-weight:500}"]})};export{X as Gcsheet1SalereportComponent};
