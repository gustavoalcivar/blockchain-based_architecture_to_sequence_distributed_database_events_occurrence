(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{23:function(e,t,n){},47:function(e,t,n){},63:function(e,t,n){"use strict";n.r(t);var c=n(2),i=n.n(c),a=n(25),o=n.n(a),l=(n(47),n(21)),h=(n(23),n(72)),r=n(81),s=n(79),b=n(26),j=n.n(b),d=n(1);function g(e){var t=e.block_num,n=e.index,i=e.block_hash,a=e.previous_block_hash,o=e.signer_public_key,b=e.nonce,g=e.payload,u=e.table,f=e.transaction,m=e.data,p=e.host,O=(e.blockchain_host,e.application_time),x=e.blockchain_time,W=e.unixDatetime,_=Object(c.useState)(!1),k=Object(l.a)(_,2),y=k[0],B=k[1];return Object(d.jsxs)(h.a,{children:[Object(d.jsx)(r.a,{align:"center",children:Object(d.jsx)("button",{onClick:function(){return B(!0)},children:"View transaction"})}),Object(d.jsx)(r.a,{align:"center",component:"th",scope:"row",children:t}),Object(d.jsx)(r.a,{align:"center",children:n}),Object(d.jsx)(r.a,{align:"center",children:u}),Object(d.jsx)(r.a,{align:"center",children:m}),Object(d.jsx)(r.a,{align:"center",children:p}),Object(d.jsx)(r.a,{align:"center",children:O}),Object(d.jsx)(r.a,{align:"center",children:x}),Object(d.jsxs)(j.a,{isOpen:y,onRequestClose:function(){return B(!1)},style:{overlay:{backgroundColor:"grey"},content:{color:"darkblue"}},children:[Object(d.jsx)("div",{children:Object(d.jsx)("button",{onClick:function(){return B(!1)},children:"Close"})}),Object(d.jsx)("h3",{children:"Transaction details"}),Object(d.jsx)(s.a,{fontWeight:"fontWeightBold",m:1,children:"Block num"}),Object(d.jsx)(s.a,{fontWeight:"fontWeightRegular",m:1,children:t}),Object(d.jsx)(s.a,{fontWeight:"fontWeightBold",m:1,children:"Block hash"}),Object(d.jsx)(s.a,{fontWeight:"fontWeightRegular",m:1,children:i}),Object(d.jsx)(s.a,{fontWeight:"fontWeightBold",m:1,children:"Previous block hash"}),Object(d.jsx)(s.a,{fontWeight:"fontWeightRegular",m:1,children:a}),Object(d.jsx)(s.a,{fontWeight:"fontWeightBold",m:1,children:"Signer public key"}),Object(d.jsx)(s.a,{fontWeight:"fontWeightRegular",m:1,children:o}),Object(d.jsx)(s.a,{fontWeight:"fontWeightBold",m:1,children:"Nonce"}),Object(d.jsx)(s.a,{fontWeight:"fontWeightRegular",m:1,children:b}),Object(d.jsx)(s.a,{fontWeight:"fontWeightBold",m:1,children:"Server"}),Object(d.jsx)(s.a,{fontWeight:"fontWeightRegular",m:1,children:p}),Object(d.jsx)(s.a,{fontWeight:"fontWeightBold",m:1,children:"Table"}),Object(d.jsx)(s.a,{fontWeight:"fontWeightRegular",m:1,children:u}),Object(d.jsx)(s.a,{fontWeight:"fontWeightBold",m:1,children:"Transaction"}),Object(d.jsx)(s.a,{fontWeight:"fontWeightRegular",m:1,children:f}),Object(d.jsx)(s.a,{fontWeight:"fontWeightBold",m:1,children:"Application time"}),Object(d.jsx)(s.a,{fontWeight:"fontWeightRegular",m:1,children:O}),Object(d.jsx)(s.a,{fontWeight:"fontWeightBold",m:1,children:"Blockchain time"}),Object(d.jsx)(s.a,{fontWeight:"fontWeightRegular",m:1,children:x}),Object(d.jsx)(s.a,{fontWeight:"fontWeightBold",m:1,children:"Unix time"}),Object(d.jsx)(s.a,{fontWeight:"fontWeightRegular",m:1,children:W}),Object(d.jsx)(s.a,{fontWeight:"fontWeightBold",m:1,children:"Payload"}),Object(d.jsx)(s.a,{fontWeight:"fontWeightRegular",m:1,children:g})]})]})}j.a.setAppElement("#root");var u=n(28),f=n.n(u),m=n(36);function p(){return(p=Object(m.a)(f.a.mark((function e(){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",fetch("".concat(window.location.href.split(":")[0],":").concat(window.location.href.split(":")[1],":4000/blocks").replace("/:",":")).then((function(e){return e.json()})).then((function(e){var t=[];return e.blocks.forEach((function(e){if("0"!==e.block_num)e.batches.forEach((function(n){n.transactions.forEach((function(n){var c=Object.assign({},n.payload);delete c.application_time,delete c.application_user,delete c.database,delete c.table,delete c.transaction,delete c.user,delete c.host,delete c.datetime,delete c.unixDatetime,delete c.blockchain_host;var i=JSON.stringify(c),a={id:n.id,block_num:e.block_num,block_hash:e.block_hash,previous_block_hash:e.previous_block_hash,signer_public_key:n.signer_public_key,nonce:n.nonce,payload:JSON.stringify(n.payload),table:n.payload.table,transaction:n.payload.transaction,data:i,host:n.payload.host,blockchain_host:n.payload.blockchain_host,application_time:n.payload.application_time,blockchain_time:n.payload.datetime,unixDatetime:n.payload.unixDatetime};t.push(a)}))}));else{var n={id:e.batches[0].transactions[0].id,block_num:e.block_num,block_hash:e.block_hash,previous_block_hash:e.previous_block_hash,signer_public_key:e.batches[0].transactions[0].signer_public_key,payload:"GENESIS BLOCK"};t.push(n)}})),t.sort((function(e,t){var n=new Date(e.blockchain_time),c=new Date(t.blockchain_time);return n<c?1:n>c?-1:0}))})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var O=n(73),x=n(74),W=n(75),_=n(76),k=n(77);function y(){var e=Object(c.useState)([]),t=Object(l.a)(e,2),n=t[0],i=t[1];return Object(c.useEffect)((function(){return function(){return p.apply(this,arguments)}().then((function(e){return i(e)}))}),[]),Object(d.jsx)(O.a,{component:x.a,children:Object(d.jsxs)(W.a,{size:"small","aria-label":"a dense table",children:[Object(d.jsx)(_.a,{className:"Head",children:Object(d.jsxs)(h.a,{children:[Object(d.jsx)(r.a,{align:"center"}),Object(d.jsx)(r.a,{align:"center",children:Object(d.jsx)(s.a,{fontWeight:"fontWeightBold",m:1,children:"Block"})}),Object(d.jsx)(r.a,{align:"center",children:Object(d.jsx)(s.a,{fontWeight:"fontWeightBold",m:1,children:"Transaction"})}),Object(d.jsx)(r.a,{align:"center",children:Object(d.jsx)(s.a,{fontWeight:"fontWeightBold",m:1,children:"Table"})}),Object(d.jsx)(r.a,{align:"center",children:Object(d.jsx)(s.a,{fontWeight:"fontWeightBold",m:1,children:"Data"})}),Object(d.jsx)(r.a,{align:"center",children:Object(d.jsx)(s.a,{fontWeight:"fontWeightBold",m:1,children:"Server"})}),Object(d.jsx)(r.a,{align:"center",children:Object(d.jsx)(s.a,{fontWeight:"fontWeightBold",m:1,children:"Application time"})}),Object(d.jsx)(r.a,{align:"center",children:Object(d.jsx)(s.a,{fontWeight:"fontWeightBold",m:1,children:"Blockchain time"})})]})}),Object(d.jsx)(k.a,{children:n.map((function(e,t){return Object(d.jsx)(g,{block_num:e.block_num,index:n.length-t-1,block_hash:e.block_hash,previous_block_hash:e.previous_block_hash,signer_public_key:e.signer_public_key,nonce:e.nonce,payload:e.payload,table:e.table,transaction:e.transaction,data:e.data,host:e.host,blockchain_host:e.blockchain_host,application_time:e.application_time,blockchain_time:e.blockchain_time,unixDatetime:e.unixDatetime},e.id)}))})]})})}function B(){return Object(d.jsx)("div",{className:"App",children:Object(d.jsx)("section",{className:"App-content",children:Object(d.jsx)(y,{})})})}var v=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,83)).then((function(t){var n=t.getCLS,c=t.getFID,i=t.getFCP,a=t.getLCP,o=t.getTTFB;n(e),c(e),i(e),a(e),o(e)}))};o.a.render(Object(d.jsx)(i.a.StrictMode,{children:Object(d.jsx)(B,{})}),document.getElementById("root")),v()}},[[63,1,2]]]);
//# sourceMappingURL=main.ba8d256a.chunk.js.map