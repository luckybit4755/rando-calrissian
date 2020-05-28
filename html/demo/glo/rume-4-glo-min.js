const Vertexo={
surfaceNormal:function(v1,v2,v3,to,tmp1,tmp2){
tmp1=Utilo.idk(tmp1,{v:new Float32Array(3)});
tmp2=Utilo.idk(tmp2,{v:new Float32Array(3)});
this.subtract(v1,v2,tmp1);
this.subtract(v3,v2,tmp2);
this.normalize(tmp1);
this.normalize(tmp2);
this.cross(tmp1,tmp2,to);
}
,add:function(v1,v2,to){
let i=Utilo.idk(v1.o,0);
let j=Utilo.idk(v2.o,0);
let k=Utilo.idk(to.o,0);
to.v[k+0]=v1.v[i+0]+v2.v[j+0];
to.v[k+1]=v1.v[i+1]+v2.v[j+1];
to.v[k+2]=v1.v[i+2]+v2.v[j+2];
}
,subtract:function(v1,v2,to){
let i=Utilo.idk(v1.o,0);
let j=Utilo.idk(v2.o,0);
let k=Utilo.idk(to.o,0);
to.v[k+0]=v1.v[i+0]-v2.v[j+0];
to.v[k+1]=v1.v[i+1]-v2.v[j+1];
to.v[k+2]=v1.v[i+2]-v2.v[j+2];
}
,tween:function(time,v1,v2,to){
let i=Utilo.idk(v1.o,0);
let j=Utilo.idk(v2.o,0);
let k=Utilo.idk(to.o,0);
to.v[k+0]=v1.v[i+0]+time*(v2.v[j+0]-v1.v[i+0]);
to.v[k+1]=v1.v[i+1]+time*(v2.v[j+1]-v1.v[i+1]);
to.v[k+2]=v1.v[i+2]+time*(v2.v[j+2]-v1.v[i+2]);
}
,normalize:function(v1,to){
let i=Utilo.idk(v1.o,0);
to=Utilo.idk(to,v1);
let k=Utilo.idk(to.o,0);
let length=this.length(v1);
if(0==length)length=1;
to.v[k+0]=v1.v[i+0]/length;
to.v[k+1]=v1.v[i+1]/length;
to.v[k+2]=v1.v[i+2]/length;
}
,length:function(v1){
return Math.sqrt(this.length2(v1));
}
,length2:function(v1){
let i=Utilo.idk(v1.o,0);
return(
v1.v[i+0]*v1.v[i+0]
+v1.v[i+1]*v1.v[i+1]
+v1.v[i+2]*v1.v[i+2]
);
}
,cross:function(v1,v2,to){
let i=Utilo.idk(v1.o,0);
let j=Utilo.idk(v2.o,0);
let k=Utilo.idk(to.o,0);
to.v[k+0]=v1.v[i+1]*v2.v[j+2]-v1.v[i+2]*v2.v[j+1];
to.v[k+1]=v1.v[i+2]*v2.v[j+0]-v1.v[i+0]*v2.v[j+2];
to.v[k+2]=v1.v[i+0]*v2.v[j+1]-v1.v[i+1]*v2.v[j+0];
}
,dot:function(v1,v2){
let i=Utilo.idk(v1.o,0);
let j=Utilo.idk(v2.o,0);
return(
v1.v[i+0]*v2.v[j+0]
+v1.v[i+1]*v2.v[j+1]
+v1.v[i+2]*v2.v[j+2]
)
}
};
const Vectoro={
set:function(x,y,z){
return[x,y,z];
}
,zed:function(){
return Vectoro.set(0,0,0);
}
,copy:function(v){
return[v[0],v[1],v[2]];
}
,scale:function(s,v){
return[v[0]*s,v[1]*s,v[2]*s];
}
,normalize:function(v){
let length=Vectoro.length(v);
if(0===length){
length=1;
}
return Vectoro.scale(1/length,v);
}
,length:function(v){
return Math.sqrt(Vectoro.length2(v));
}
,length2:function(v){
return Vectoro.dot(v,v);
}
,distance:function(v,u){
return Math.sqrt(Vectoro.distance2(v,u));
}
,distance2:function(v,u){
return Vectoro.length2(Vectoro.subtract(v,u));
}
,dot:function(v,u){
return(v[0]*u[0]+v[1]*u[1]+v[2]*u[2]);
}
,cross:function(v,u){
return[
v[1]*u[2]-v[2]*u[1]
,v[2]*u[0]-v[0]*u[2]
,v[0]*u[1]-v[1]*u[0]
];
}
,subtract:function(v,u){
return[v[0]-u[0],v[1]-u[1],v[2]-u[2]];
}
,normalVector:function(v0,v1,v2){
return Vectoro.cross(
Vectoro.normalize(Vectoro.subtract(v0,v1))
,Vectoro.normalize(Vectoro.subtract(v2,v1))
);
}
,add:function(v,u){
return[v[0]+u[0],v[1]+u[1],v[2]+u[2]];
}
,toString:function(v,precision){
return '('+v.map(a=>Utilo.floatless(a,precision)).join(',')+')';
}
};
const Matrixo={
identity:function(){
return[
1,0,0,0,
0,1,0,0,
0,0,1,0,
0,0,0,1
];
},
rotateX:function(c,s){
const z=-s;
return[
1,0,0,0,
0,c,z,0,
0,s,c,0,
0,0,0,1
];
},
rotateY:function(c,s){
const z=-s;
return[
c,0,s,0,
0,1,0,0,
z,0,c,0,
0,0,0,1
];
},
rotateZ:function(c,s){
const z=-s;
return[
c,z,0,0,
s,c,0,0,
0,0,1,0,
0,0,0,1
];
},
translate:function(x,y,z){
return[
1,0,0,x,
0,1,0,y,
0,0,1,z,
0,0,0,1
];
},
scale:function(x,y,z){
y=Utilo.idk(y,x);
z=Utilo.idk(z,x);
return[
x,0,0,0,
0,y,0,0,
0,0,z,0,
0,0,0,1
]
},
multiply:function(m1,m2){
return Matrixo.gossipMultiply(m1,m2);
return Matrixo.fastMultiply(m1,m2);
},
slowMultiply:function(m1,m2){
let result=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
let idx=0;
for(let i=0;i<4;i++){
for(let j=0;j<4;j++,idx++){
let row_m1=i;
let col_m2=j;
let symbolic='result['+idx+']=';
let sum=0;
for(let k=0;k<4;k++){
let col_m1=k;
let row_m2=k;
let idx_m1=row_m1*4+col_m1;
let idx_m2=row_m2*4+col_m2;
sum+=m1[idx_m1]*m2[idx_m2];
symbolic+='+m1['+idx_m1+']*m2['+idx_m2+']';
}
result[idx]=sum;
}
}
return result;
}
,fastMultiply:function(m1,m2){
return[
m1[0]*m2[0]+m1[1]*m2[4]+m1[2]*m2[8]+m1[3]*m2[12],
m1[0]*m2[1]+m1[1]*m2[5]+m1[2]*m2[9]+m1[3]*m2[13],
m1[0]*m2[2]+m1[1]*m2[6]+m1[2]*m2[10]+m1[3]*m2[14],
m1[0]*m2[3]+m1[1]*m2[7]+m1[2]*m2[11]+m1[3]*m2[15],
m1[4]*m2[0]+m1[5]*m2[4]+m1[6]*m2[8]+m1[7]*m2[12],
m1[4]*m2[1]+m1[5]*m2[5]+m1[6]*m2[9]+m1[7]*m2[13],
m1[4]*m2[2]+m1[5]*m2[6]+m1[6]*m2[10]+m1[7]*m2[14],
m1[4]*m2[3]+m1[5]*m2[7]+m1[6]*m2[11]+m1[7]*m2[15],
m1[8]*m2[0]+m1[9]*m2[4]+m1[10]*m2[8]+m1[11]*m2[12],
m1[8]*m2[1]+m1[9]*m2[5]+m1[10]*m2[9]+m1[11]*m2[13],
m1[8]*m2[2]+m1[9]*m2[6]+m1[10]*m2[10]+m1[11]*m2[14],
m1[8]*m2[3]+m1[9]*m2[7]+m1[10]*m2[11]+m1[11]*m2[15],
m1[12]*m2[0]+m1[13]*m2[4]+m1[14]*m2[8]+m1[15]*m2[12],
m1[12]*m2[1]+m1[13]*m2[5]+m1[14]*m2[9]+m1[15]*m2[13],
m1[12]*m2[2]+m1[13]*m2[6]+m1[14]*m2[10]+m1[15]*m2[14],
m1[12]*m2[3]+m1[13]*m2[7]+m1[14]*m2[11]+m1[15]*m2[15]
];
}
,gossipMultiply:function(a,b){
const a00=a[0*4+0];
const a01=a[0*4+1];
const a02=a[0*4+2];
const a03=a[0*4+3];
const a10=a[1*4+0];
const a11=a[1*4+1];
const a12=a[1*4+2];
const a13=a[1*4+3];
const a20=a[2*4+0];
const a21=a[2*4+1];
const a22=a[2*4+2];
const a23=a[2*4+3];
const a30=a[3*4+0];
const a31=a[3*4+1];
const a32=a[3*4+2];
const a33=a[3*4+3];
const b00=b[0*4+0];
const b01=b[0*4+1];
const b02=b[0*4+2];
const b03=b[0*4+3];
const b10=b[1*4+0];
const b11=b[1*4+1];
const b12=b[1*4+2];
const b13=b[1*4+3];
const b20=b[2*4+0];
const b21=b[2*4+1];
const b22=b[2*4+2];
const b23=b[2*4+3];
const b30=b[3*4+0];
const b31=b[3*4+1];
const b32=b[3*4+2];
const b33=b[3*4+3];
return[
b00*a00+b01*a10+b02*a20+b03*a30,
b00*a01+b01*a11+b02*a21+b03*a31,
b00*a02+b01*a12+b02*a22+b03*a32,
b00*a03+b01*a13+b02*a23+b03*a33,
b10*a00+b11*a10+b12*a20+b13*a30,
b10*a01+b11*a11+b12*a21+b13*a31,
b10*a02+b11*a12+b12*a22+b13*a32,
b10*a03+b11*a13+b12*a23+b13*a33,
b20*a00+b21*a10+b22*a20+b23*a30,
b20*a01+b21*a11+b22*a21+b23*a31,
b20*a02+b21*a12+b22*a22+b23*a32,
b20*a03+b21*a13+b22*a23+b23*a33,
b30*a00+b31*a10+b32*a20+b33*a30,
b30*a01+b31*a11+b32*a21+b33*a31,
b30*a02+b31*a12+b32*a22+b33*a32,
b30*a03+b31*a13+b32*a23+b33*a33
];
}
,multiplyMatrices:function(){
let m=arguments[0];
for(let i=1;i<arguments.length;i++){
m=Matrixo.multiply(m,arguments[i]);
}
return m;
}
,lookAt:function(){
}
};
const Quaterniono={
set:function(x,y,z,w,storage){
w=Utilo.idk(w,0);
storage=Utilo.idk(storage,new Array(4));
storage[0]=x;
storage[1]=y;
storage[2]=z;
storage[3]=w;
return storage;
}
,copy:function(from,to){
return set(from[0],from[1],from[2],from[3],to);
}
,zed:function(storage){
return Quaterniono.set(0,0,0,0,storage);
}
,rotate:function(angle,q,storage){
const s=Math.sin(angle/2);
return Quaterniono.set(
q[0]*s
,q[1]*s
,q[2]*s
,Math.cos(angle/2)
);
}
,rotatePoint:function(q,p,storage,tmp,tmp2){
return Quaterniono.multiply(
Quaterniono.multiply(q,p,tmp)
,Quaterniono.conjugate(q,tmp2)
,storage
);
}
,conjugate:function(q,storage){
return Quaterniono.set(-q[0],-q[1],-q[2],q[3],storage);
}
,multiply:function(q,p,storage){
return Quaterniono.set(
q[0]*p[3]+q[1]*p[2]-q[2]*p[1]+q[3]*p[0]
,-q[0]*p[2]+q[1]*p[3]+q[2]*p[0]+q[3]*p[1]
,q[0]*p[1]-q[1]*p[0]+q[2]*p[3]+q[3]*p[2]
,-q[0]*p[0]-q[1]*p[1]-q[2]*p[2]+q[3]*p[3]
,storage
);
}
,toMatrix:function(q,storage){
const x=q[0];
const y=q[1];
const z=q[2];
const w=q[3];
const x2=x+x;
const y2=y+y;
const z2=z+z;
const xx=x*x2;
const yx=y*x2;
const yy=y*y2;
const zx=z*x2;
const zy=z*y2;
const zz=z*z2;
const wx=w*x2;
const wy=w*y2;
const wz=w*z2;
storage=Utilo.idk(storage,new Array(16));
storage[0]=1-yy-zz
storage[1]=yx+wz
storage[2]=zx-wy
storage[3]=0
storage[4]=yx-wz
storage[5]=1-xx-zz
storage[6]=zy+wx
storage[7]=0
storage[8]=zx+wy
storage[9]=zy-wx
storage[10]=1-xx-yy
storage[11]=0
storage[12]=0
storage[13]=0
storage[14]=0
storage[15]=1
return storage;
}
,normalize:function(q,storage){
const length=Quaterniono.length(q);
return(
0===length
?Quaterniono.copy(q,storage)
:Quaterniono.scale(1/length,q,storage)
);
}
,length:function(q){
return Math.sqrt(Quaterniono.dot(q,q));
}
,scale:function(s,q,storage){
return Quaterniono.set(
q[0]*s,
q[1]*s,
q[2]*s,
q[3]*s,
storage
);
}
,dot:function(q,p){
return[
q[0]*p[0]+
q[1]*p[1]+
q[2]*p[2]+
q[3]*p[3]
];
}
,add:function(q,p,storage){
return Quaterniono.set(
q[0]+p[0],
q[1]+p[1],
q[2]+p[2],
q[3]+p[3],
storage
);
}
,subtract:function(q,p,storage){
return Quaterniono.set(
q[0]-p[0],
q[1]-p[1],
q[2]-p[2],
q[3]-p[3],
storage
);
}
,interpolateLinearly:function(q,p,t,storage,tmp1,tmp2){
return Quaterniono.add(
q,
Quaterniono.scale(t,Quaterniono.subtract(p,q,tmp1),tmp2),
storage
);
}
,slerp:function(q,p,t){
let v0=Quaterniono.normalize(q);
let v1=Quaterniono.normalize(p);
let dot=Quaterniono.dot(v0,v1);
if(dot<0.0){
v1=Quaterniono.scale(-1,v1);
dot=-dot;
}
const DOT_THRESHOLD=0.9995;
if(dot>DOT_THRESHOLD){
return Quaterniono.normalize(Quaterniono.interpolateLinearly(v0,v1,t));
}
const theta_0=Math.acos(dot);
const theta=theta_0*t;
const sin_theta=Math.sin(theta);
const sin_theta_0=Math.sin(theta_0);
const s0=Math.cos(theta)-dot*sin_theta/sin_theta_0;
const s1=sin_theta/sin_theta_0;
return Quaterniono.add(
Quaterniono.scale(s0,v0),
Quaterniono.scale(s1,v1)
);
}
};
const Mouseo={
simpleControls:function(canvas){
let last=0;
let dragged=false;
let angleX=0;
let angleY=0;
let w=parseInt(canvas.width);
let h=parseInt(canvas.height);
canvas.onmouseup=canvas.onblur=function(){
dragged=false;
};
canvas.onmousemove=function(e){
if(!dragged)return;
e={x:e.pageX,y:e.pageY};
let dx=Mouseo.toAngle(e.x,dragged.x,w);
let dy=Mouseo.toAngle(e.y,dragged.y,h);
angleY+=dx;
angleX+=dy;
dragged=e;
last=new Date().getTime();
};
canvas.onmousedown=function(e){
dragged={x:e.pageX,y:e.pageY};
canvas.onmousemove(e)
};
return{
matrix:function(){
return Matrixo.multiply(
Matrixo.rotateX(Math.cos(angleX),Math.sin(angleX))
,Matrixo.rotateY(Math.cos(angleY),Math.sin(angleY))
)
}
,idle:function(timeout,delta){
if(!last || new Date().getTime()-last>timeout){
angleX+=delta;
angleY+=delta;
}
}
,getAngleX(){
return angleX;
}
,getAngleY(){
return angleY;
}
}
}
,toAngle:function(now,start,size){
return(now-start)/size*2*Math.PI;
}
};
const Constantso={
colors:{
red:[1,0,0],
green:[0,1,0],
blue:[0,0,1],
yellow:[1,1,0],
cyan:[0,1,1],
purple:[1,0,1]
}
};
const Glo={
gl:function(canvas,flags){
let gl=canvas.getContext('webgl',flags);
if(!gl)throw 'could not get webgl context';
gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LESS);
gl.clearColor(0,0,0,1);
return gl;
},
program:function(gl,vertexSource,fragmentSource){
let program=gl.createProgram();
Glo.shader(gl,program,vertexSource,gl.VERTEX_SHADER);
Glo.shader(gl,program,fragmentSource,gl.FRAGMENT_SHADER);
gl.linkProgram(program);
if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
throw gl.getProgramInfoLog(program);
}
gl.useProgram(program);
return program;
},
shader:function(gl,program,source,type){
let shader=gl.createShader(type);
gl.shaderSource(shader,source);
gl.compileShader(shader);
if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
throw gl.getShaderInfoLog(shader);
}
gl.attachShader(program,shader);
return shader;
},
_buffer:function(gl,data){
let need=true;
if('glod' in data){
if(data.length==data.glod.length){
need=false;
}else{
console.log('deleteBuffer');
gl.deleteBuffer(data.glod.buffer);
}
}
if(need){
console.log('createBuffer');
data.glod={length:data.length,buffer:gl.createBuffer()}
}
return data.glod.buffer;
},
_bufferN:function(gl,name){
if(!('glo' in gl))gl.glo={buffers:{}};
return(
(name in gl.glo.buffers)
?(gl.glo.buffers[name])
:(gl.glo.buffers[name]=gl.createBuffer())
)
},
data:function(gl,program,name,data,floatsPerValue){
floatsPerValue=Utilo.idk(floatsPerValue,3);
let buffer=Glo._bufferN(gl,name);
if(!('BYTES_PER_ELEMENT' in data)){
data=new Float32Array(data);
}
gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);
let location=gl.getAttribLocation(program,name);
gl.enableVertexAttribArray(location);
gl.vertexAttribPointer(location,floatsPerValue,gl.FLOAT,false,0,0);
return data;
},
matrix:function(gl,program,name,data){
data=new Float32Array(data);
let location=gl.getUniformLocation(program,name);
gl.uniformMatrix4fv(location,false,data);
},
value:function(gl,program,name,value){
let location=gl.getUniformLocation(program,name);
gl.uniform1i(location,value);
},
clear:function(gl){
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
},
draw:function(gl,faces,type){
type=Utilo.idk(type,gl.TRIANGLES);
if(faces){
let buffer=Glo._bufferN(gl,'_faces');
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(faces),gl.DYNAMIC_DRAW);
gl.drawElements(type,faces.length,gl.UNSIGNED_SHORT,0);
}else{
gl.drawArrays(type,0,3);
}
},
triangles:function(gl,faces){
Glo.draw(gl,faces);
}
,textureSetup:function(gl,program,image){
if(!image.glo_texture){
image.glo_texture=gl.createTexture();
}
gl.bindTexture(gl.TEXTURE_2D,image.glo_texture);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
gl.bindTexture(gl.TEXTURE_2D,null);
}
,texture:function(gl,program,name,image,gl_texture_id){
if(!('glo_texture' in image))throw 'need to call textureSetup for image first';
gl_texture_id=Utilo.idk(gl_texture_id,gl.TEXTURE0);
let samplerValue=gl_texture_id-gl.TEXTURE0;
gl.activeTexture(gl_texture_id);
gl.bindTexture(gl.TEXTURE_2D,image.glo_texture);
Glo.value(gl,program,name,samplerValue);
}
,cubemapSetup:function(gl){
let texture=gl.createTexture();
gl.bindTexture(gl.TEXTURE_CUBE_MAP,texture);
gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
return texture;
}
,cubemapImage:function(gl,program,name,texture,image,gl_cube_map_face_id){
gl.bindTexture(gl.TEXTURE_CUBE_MAP,texture);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
gl.texImage2D(gl_cube_map_face_id,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
}
,cubemap:function(gl,program,name,images){
let texture=Glo.cubemapSetup(gl);
for(let i=0;i<images.length;i++){
let image=images[i];
let face=Glo.cubefaceByIndex(gl,i);
Glo.cubemapImage(gl,program,name,texture,image,face);
}
let shader_uCubeSampler=gl.getUniformLocation(program,name);
gl.uniform1i(shader_uCubeSampler,0);
return texture;
}
,cubefaceByIndex:function(gl,index){
return Object.values(Glo.cubemapIndices(gl))[index];
}
,cubefaceByName:function(gl,name){
return Glo.cubemapIndices(gl)[name];
}
,cubemapIndices:function(gl){
return{
posx:gl.TEXTURE_CUBE_MAP_POSITIVE_X,
negx:gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
posy:gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
negy:gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
posz:gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
negz:gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
};
}
,drawMesh:function(gl,program,mesh){
let type=('type' in mesh)?mesh.type:gl.TRIANGLES;
if(Utilo.isString(type)){
if(type in gl){
mesh.type=type=gl[type];
}else{
throw 'unknown draw type:'+type;
}
}
if(!('attributes' in mesh)){
throw 'missing "attributes" value in mesh object';
}
for(let name in mesh.attributes){
let data=mesh.attributes[name];
Glo.data(gl,program,name,data);
}
Glo.draw(gl,mesh.faces,type);
}
,demoSetup:function(shaders,matrixName,flags){
shaders=Utilo.idk(shaders,Shadero.lit);
matrixName=Utilo.idk(matrixName,'uMatrix');
flags=Utilo.idk(flags,{});
let canvas=Utilo.getByTag('canvas');
Utilo.getByContents('fullscreen').onclick=function(){Utilo.fullscreen(canvas);};
let mouseControls=Mouseo.simpleControls(canvas);
let gl=Glo.gl(canvas,flags);
let program=Glo.program(gl,shaders.vertex,shaders.fragment);
let setup={canvas:canvas,gl:gl,program:program,mouseControls:mouseControls};
setup.mouseLoop=function(idle,matrix){
idle=Utilo.idk(idle,5000);
matrix=Utilo.idk(matrix,Matrixo.scale(0.55));
Glo.clear(gl);
mouseControls.idle(idle,0.03);
let m=Matrixo.multiply(setup.mouseControls.matrix(),matrix);
Glo.matrix(gl,program,matrixName,m);
}
return setup;
}
};
const TriangularPrism={
instantiate:function(){
let instance={
faces:TriangularPrism.faces.slice()
,vertices:TriangularPrism.vertices.slice()
}
instance.subdivide=function(){
return TriangularPrism.subdivide(instance);
}
instance.addMidpoint=function(v0,v1,vertices){
return TriangularPrism._addMidpoint(instance,v0,v1,vertices);
}
return instance;
}
,vertices:[
-1,+0,+0,
+1,+0,+0,
+0,-1,+0,
+0,+1,+0,
+0,+0,-1,
+0,+0,+1
]
,faces:[
4,0,3,
0,5,3,
5,1,3,
1,4,3,
4,0,2,
0,5,2,
5,1,2,
1,4,2
]
,subdivide:function(instance){
let nuFaces=[];
let faces=instance.faces;
let vertices=instance.vertices;
for(let i=0;i<faces.length;i+=3){
let v0=3*faces[i+0];
let v1=3*faces[i+1];
let v2=3*faces[i+2];
let a=instance.addMidpoint(v0,v1,vertices);
let b=instance.addMidpoint(v1,v2,vertices);
let c=instance.addMidpoint(v2,v0,vertices);
v0/=3;v1/=3;v2/=3;a/=3;b/=3;c/=3;
nuFaces.push(v0);nuFaces.push(a);nuFaces.push(c);
nuFaces.push(v1);nuFaces.push(b);nuFaces.push(a);
nuFaces.push(v2);nuFaces.push(c);nuFaces.push(b);
nuFaces.push(a);nuFaces.push(b);nuFaces.push(c);
}
instance.faces=nuFaces;
return instance;
}
,_addMidpoint:function(instance,v0,v1,vertices){
if(!('cache' in instance)){
instance.cache={};
}
let key=(v0<=v1?[v0,v1]:[v1,v0]).join(',');
if(key in instance.cache){
return instance.cache[key];
}
let idx=vertices.length;
let nu=[];
let length=0;
for(let i=0;i<3;i++,v0++,v1++){
let v=0.5*(vertices[v0]+vertices[v1]);
length+=v*v;
nu.push(v);
}
length=Math.sqrt(length);
for(let i=0;i<nu.length;i++){
nu[i]/=length;
}
instance.cache[key]=idx;
vertices.push.apply(vertices,nu);
return idx;
}
};
const Cube={
"vertices":[
-1,-1,-1,
-1,-1,1,
-1,1,-1,
-1,1,1,
1,-1,-1,
1,-1,1,
1,1,-1,
1,1,1
],
"triangles":[
0,1,5,
1,0,2,
1,3,7,
2,0,4,
2,3,1,
3,2,6,
4,5,7,
4,6,2,
5,4,0,
6,7,3,
7,5,1,
7,6,4
],
"perFace":4,
"faces":[
0,1,5,4,
1,3,7,5,
2,3,1,0,
4,5,7,6,
4,6,2,0,
6,7,3,2
]
};
const Shadero={
simple:{
vertex:`
attribute vec4 aPosition;
attribute vec4 aColor;
uniform mat4 uMatrix;
varying vec4 vColor;
void main(){
gl_Position=uMatrix*aPosition;
vColor=aColor;
}
`
,fragment:`
precision mediump float;
varying vec4 vColor;
void main(void){
gl_FragColor=vColor;
}
`
}
,lit:{
vertex:`
precision mediump float;
attribute vec4 aPosition;
varying vec4 vPosition;
attribute vec4 aColor;
varying vec4 vColor;
uniform mat4 uMatrix;
void main(){
gl_Position=uMatrix*aPosition;
vColor=aColor;
vPosition=gl_Position;
}
`
,fragment:`
precision mediump float;
varying vec4 vColor;
varying vec4 vPosition;
vec4 light=vec4(0.5774,0.5774,0.5774,0);
float fuzz(float c,float power){
return pow(256.0*c,power)/256.0;
}
void main(void){
float lightValue=1.0-dot(vPosition,light);
vec4 farqo=vec4(
fuzz(vColor[0],lightValue),
fuzz(vColor[1],lightValue),
fuzz(vColor[2],lightValue),
1
);
gl_FragColor=farqo*0.4+0.6*vColor;
}
`
}
,texture:{
vertex:`
precision mediump float;
attribute vec4 aPosition;
attribute vec2 aTexture;
varying vec2 vTexture;
void main(){
gl_Position=aPosition;
vTexture=aTexture;
}
`
,fragment:`
precision mediump float;
varying vec2 vTexture;
uniform sampler2D uSampler;
void main(void){
float bump=0.033;
float fade=0.6;
vec4 texture=texture2D(uSampler,vTexture);
vec4 faded=fade*texture;
faded=vec4(
pow(texture[0]+bump,2.0)*fade,
pow(texture[1]+bump,2.0)*fade,
pow(texture[2]+bump,2.0)*fade,
1
);
gl_FragColor=vec4(faded[0],faded[1],faded[2],1.0);
}
`
}
,normal:{
vertex:`
precision mediump float;
attribute vec4 aPosition;
varying vec4 vPosition;
varying vec4 vVertex;
attribute vec4 aNormal;
varying vec4 vNormal;
uniform mat4 uMatrix;
void main(){
gl_Position=uMatrix*aPosition;
vPosition=gl_Position;
vVertex=aPosition;
vNormal=uMatrix*aNormal;
}
`
,fragment:`
precision mediump float;
varying vec4 vPosition;
varying vec4 vVertex;
varying vec4 vNormal;
float lightStrength=6.0;
vec4 lightPosition=vec4(3,0,-3,0);
vec4 light=normalize(lightPosition);
uniform samplerCube uCubeSampler;
void main(void){
float lightValue=dot(vNormal,light);
float lightDistance=length(vPosition-lightPosition);
lightValue+=0.33;
lightValue*=lightValue;
lightDistance/=lightStrength;
lightDistance*=lightDistance;
lightValue/=lightDistance;
vec4 color=textureCube(
uCubeSampler
,vec3(-vVertex.x,vVertex.y,vVertex.z)
);
float minimumBrightness=0.003;
gl_FragColor=(lightValue*color)+(minimumBrightness*color);
}
`
}
};
const Utilo={
fullscreen:function(element){
let fz='webkitRequestFullscreen requestFullScreen mozRequestFullScreen msRequestFullscreen webkitRequestFullscreen webkitRequestFullscreen'.split(' ');
for(let i=0;i<fz.length;i++){
let f=fz[i];
if(f in element){
element[f]();
break;
}
}
}
,frame:function(drawCallback,fps){
fps=fps || 24;
let frameFunction=function(){};
frameFunction.count=0;
frameFunction.timeOut=false;
frameFunction.start=function(){
frameFunction.count++;
drawCallback();
frameFunction.timeOut=setTimeout(
function(){
requestAnimationFrame(frameFunction.start);
}
,1000/fps
);
};
frameFunction.stop=function(){
if(frameFunction.timeOut){
clearTimeout(frameFunction.timeOut);
frameFunction.timeOut=false;
}
};
return frameFunction;
}
,idk:function(v,alternative){
return 'undefined'===typeof(v)?alternative:v;
}
,getByTag:function(tag,index){
tag=Utilo.idk(tag,'canvas');
index=Utilo.idk(index,0);
let tagged=Array.from(document.getElementsByTagName(tag));
return isNaN(index)?tagged:tagged[index];
}
,getById:function(id){
return document.getElementById(id);
}
,findBody:function(doc){
if('undefined'===typeof(doc))throw 'no document defined';
if(!('childNodes' in doc))throw 'failed to find body';
for(let i=0;i<doc.childNodes.length;i++){
let kid=doc.childNodes[i];
if(/^body$/i.test(kid.nodeName)){
return kid;
}
let body=Utilo.findBody(kid);
if(body){
return body;
}
}
return false;
}
,getByContents:function(value){
let treeWalker=document.createTreeWalker(
Utilo.findBody(document)
,NodeFilter.SHOW_TEXT
,{acceptNode:function(node){return NodeFilter.FILTER_ACCEPT}}
,false
);
while(treeWalker.nextNode()){
let node=treeWalker.currentNode;
if(value===node.nodeValue.trim()){
return node.parentNode;
}
}
return false;
}
,makeElement:function(stuff){
stuff.type=stuff.type || 'div';
let element=document.createElement(stuff.type);
for(let k in stuff){
if(/^(kids|type)$/.test(k))continue;
switch(k){
case 'txt':element.appendChild(document.createTextNode(stuff[k]));break;
default:element.setAttribute(k,stuff[k]);
}
}
if('kids' in stuff){
for(let i=0;i<stuff.kids.length;i++){
element.appendChild(makeElement(stuff.kids[i]));
}
}
return element;
}
,elementPosition:function(element){
let left=0;
let top=0;
if(element.offsetParent){
do{
left+=element.offsetLeft;
top+=element.offsetTop;
}while(element=element.offsetParent);
}
return{x:left,y:top};
}
,identity:function(value){
return value;
}
,flatten:function(value,converter,values){
converter=Utilo.idk(converter,Utilo.identity);
values=Utilo.idk(values,[]);
if('object'===typeof(value)){
for(let key in value){
Utilo.flatten(value[key],converter,values);
}
}else{
values.push(converter(value));
}
return values;
}
,floatless:function(v,precision){
if(isNaN(v))return v;
precision=Utilo.idk(precision,1000);
return Math.floor(v*precision)/precision
}
,pushAll:function(current,nu){
for(let i=0;i<nu.length;i++){
current.push(nu[i]);
}
return current;
}
,isString:function(s){
return 'string'==typeof(s)|| s instanceof String;
}
};
const Mesho={
triangulate:function(faces,perFace){
perFace=Utilo.idk(perFace,4);
let nu=[];
for(let i=0;i<faces.length;i+=perFace){
let next=i+perFace;
for(let j=i;j<next;j+=2){
let end=j+3;
if(end>=next){
end=j+2;
}
for(let k=j;k<end;k++){
nu.push(faces[k]);
}
}
nu.push(faces[i]);
}
return nu;
}
,normals:function(faces,vertices,perFace){
perFace=Utilo.idk(perFace,3);
let normals=[];
for(let i=0;i<faces.length;i+=perFace){
let vertexIndex0=3*faces[i+0];
let vertexIndex1=3*faces[i+1];
let vertexIndex2=3*faces[i+2];
let vertex0=vertices.slice(vertexIndex0,vertexIndex0+3);
let vertex1=vertices.slice(vertexIndex1,vertexIndex1+3);
let vertex2=vertices.slice(vertexIndex2,vertexIndex2+3);
let normal=Vectoro.normalVector(vertex0,vertex1,vertex2);
for(let k=0;k<perFace;k++){
normals.push(normal[k]);
}
}
return normals;
}
,uniqVertices:function(faces,vertices,normals){
let nuFaces=[];
let nuNormals=[];
let nuVertices=[];
for(let i=0;i<faces.length;i++){
let faceIndex=3*Math.floor(i/3);
let oldIndex=3*faces[i];
nuFaces.push(nuVertices.length/3);
for(let k=0;k<3;k++){
nuVertices.push(vertices[oldIndex+k]);
nuNormals.push(normals[faceIndex+k]);
}
}
return{faces:nuFaces,vertices:nuVertices,normals:nuNormals};
}
,facesToEdges:function(faces,perFace){
perFace=Utilo.idk(perFace,3);
let edges=[];
for(let i=0;i<faces.length;i+=perFace){
for(let j=0;j<perFace;j++){
edges.push(faces[i+j]);
if(perFace-1==j){
edges.push(faces[i+0]);
}else{
edges.push(faces[i+j+1]);
}
}
}
return edges;
}
,normalize:function(mesh){
let faces=Mesho.triangulate(mesh.faces,mesh.perFace);
let normals=Mesho.normals(faces,mesh.vertices);
return Mesho.uniqVertices(
faces
,mesh.vertices
,normals
);
}
,axis:function(vertexName,colorName){
vertexName=Utilo.idk(vertexName,'aPosition');
colorName=Utilo.idk(colorName,'aColor');
let vertices=[];
let faces=[];
let colors=[];
let k=Object.values(Constantso.colors);
for(let d=0;d<3;d++){
for(let v=-1;v<2;v+=2){
for(let p=0;p<3;p++){
colors.push(k[d][p]);
vertices.push(p==d?v:0);
}
faces.push(faces.length);
}
}
let attributes={};
attributes[vertexName]=vertices;
attributes[colorName]=colors;
return{vertices:vertices,faces:faces,colors:colors,attributes:attributes,type:'LINES'};
}
};
