(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{122:function(e,n,r){e.exports={Order:"Order__Order__4yi4Z"}},130:function(e,n,r){"use strict";r.r(n);var t=r(5),a=r(10),i=r(7),o=r(6),c=r(8),s=r(0),u=r.n(s),d=r(122),p=r.n(d),l=function(e){var n=[];for(var r in e.ingredients)n.push({name:r,amount:e.ingredients[r]});var t=n.map(function(e){return u.a.createElement("span",{style:{textTransform:"capitalize",display:"inline-block",margin:"0 8px",border:"1px solid #ccc",padding:"5px"},key:e.name},e.name," (",e.amount,")")});return u.a.createElement("div",{className:p.a.Order},u.a.createElement("p",null,"Ingredients: ",t),u.a.createElement("p",null,"Price: ",u.a.createElement("strong",null,"USD ",Number.parseFloat(e.price).toFixed(2))))},m=r(16),f=r(42),h=r(15),b=r(14),O=r(41),g=function(e){function n(){return Object(t.a)(this,n),Object(i.a)(this,Object(o.a)(n).apply(this,arguments))}return Object(c.a)(n,e),Object(a.a)(n,[{key:"componentDidMount",value:function(){this.props.onFetchOrders(this.props.userId,this.props.token)}},{key:"render",value:function(){var e=u.a.createElement(O.a,null);return this.props.loading||(e=this.props.orders.map(function(e){return u.a.createElement(l,{key:e.id,ingredients:e.ingredients,price:e.price})})),u.a.createElement("div",null,e)}}]),n}(s.Component);n.default=Object(b.b)(function(e){return{orders:e.order.orders,loading:e.order.loading,token:e.auth.token,userId:e.auth.userId}},function(e){return{onFetchOrders:function(n,r){return e(h.d(n,r))}}})(Object(f.a)(g,m.a))}}]);
//# sourceMappingURL=2.bf891333.chunk.js.map