import{r as i,a5 as p,a6 as $,j as u,c as v}from"./index-BGKANavW.js";const c="horizontal",x=["horizontal","vertical"],s=i.forwardRef((e,r)=>{const{decorative:a,orientation:t=c,...o}=e,n=d(t)?t:c,l=a?{role:"none"}:{"aria-orientation":n==="vertical"?n:void 0,role:"separator"};return i.createElement(p.div,$({"data-orientation":n},l,o,{ref:r}))});s.propTypes={orientation(e,r,a){const t=e[r],o=String(t);return t&&!d(t)?new Error(m(o,a)):null}};function m(e,r){return`Invalid prop \`orientation\` of value \`${e}\` supplied to \`${r}\`, expected one of:
  - horizontal
  - vertical

Defaulting to \`${c}\`.`}function d(e){return x.includes(e)}const f=s,h=i.forwardRef(({className:e,orientation:r="horizontal",decorative:a=!0,...t},o)=>u.jsx(f,{ref:o,decorative:a,orientation:r,className:v("shrink-0 bg-border",r==="horizontal"?"h-[1px] w-full":"h-full w-[1px]",e),...t}));h.displayName=f.displayName;export{h as S};
