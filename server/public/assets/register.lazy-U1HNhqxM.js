import{c as p,u as x,a as h,j as e,I as n,B as g,L as j,t as l}from"./index-Df7ykco7.js";import{u as w,a as y,C as N,b as f,c as C,d as v,e as S,L as i,f as b,t as L,s as R,r as F}from"./label-BrzX_09p.js";const U=p("/_auth/register")({component:E}),k="A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account";function E(){const o=x(),c=h(),{isPending:t}=w(),{register:a,formState:d,handleSubmit:m}=y({resolver:L(F),defaultValues:{name:"",email:"",password:""}}),{errors:s}=d,u=async r=>{await R.email({name:r.name,email:r.email,password:r.password},{onSuccess:()=>{l.success("Account created successfully"),o.invalidateQueries({queryKey:["user"],type:"all"}),c.invalidate()},onError:()=>{l.error("Something went wrong")}})};return e.jsxs(N,{className:"mx-auto mt-40 max-w-sm",children:[e.jsxs(f,{children:[e.jsx(C,{className:"text-xl",children:"Sign Up"}),e.jsx(v,{children:"Enter your information to create an account"})]}),e.jsxs(S,{children:[e.jsx("form",{onSubmit:m(u),children:e.jsxs("div",{className:"grid gap-8",children:[e.jsxs("div",{className:"grid gap-2",children:[e.jsx(i,{htmlFor:"name",children:"Name"}),e.jsx(n,{...a("name"),placeholder:"Max Robinson"}),s.name&&e.jsx("p",{className:"text-red-500",children:s.name.message})]}),e.jsxs("div",{className:"grid gap-2",children:[e.jsx(i,{htmlFor:"email",children:"Email"}),e.jsx(n,{...a("email"),placeholder:"m@example.com"}),s.email&&e.jsx("p",{className:"text-red-500",children:s.email.message})]}),e.jsxs("div",{className:"grid gap-2",children:[e.jsx(i,{htmlFor:"password",children:"Password"}),e.jsx(n,{...a("password"),type:"password"}),s.password&&e.jsx("p",{className:"text-red-500",children:s.password.message})]}),e.jsx(g,{type:"submit",disabled:t,className:"w-full",children:t?e.jsx(j,{className:"size-5 animate-spin"}):"Create an account"})]})}),e.jsxs("div",{className:"mt-4 text-center text-sm",children:["Already have an account?"," ",e.jsx(b,{to:"/login",className:"underline",children:"Sign in"})]})]})]})}export{U as Route,k as description};
