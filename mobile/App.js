import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View, useWindowDimensions } from "react-native";

const C={bg:"#070810",panel:"#0E1120",cyan:"#00F3FF",magenta:"#FF007F",green:"#39FF14",yellow:"#FFE600",orange:"#FF6600",purple:"#A855F7",red:"#FF0055",white:"#EAF2FF",muted:"#8290AA",dark:"#090C14"};
const HEROES=[
{id:"knight",name:"KNIGHT",color:C.cyan,hp:120,maxHp:120,damage:18},
{id:"rogue",name:"ROGUE",color:C.green,hp:85,maxHp:85,damage:24},
{id:"mage",name:"MAGE",color:C.purple,hp:75,maxHp:75,damage:28},
{id:"archer",name:"ARCHER",color:C.yellow,hp:90,maxHp:90,damage:22}
];
const TOWERS=[
{id:"archer",name:"ARCHER",color:C.green,damage:8},
{id:"catapult",name:"CATAPULT",color:C.orange,damage:16},
{id:"wizard",name:"WIZARD",color:C.purple,damage:12},
{id:"ballista",name:"BALLISTA",color:C.cyan,damage:20}
];
const INITIAL_ENEMIES=[
{id:1,kind:"GHOST",color:C.magenta,hp:60,maxHp:60,lane:0},
{id:2,kind:"GOBLIN",color:C.yellow,hp:75,maxHp:75,lane:1},
{id:3,kind:"SKELETON",color:"#E2E8F0",hp:90,maxHp:90,lane:2},
{id:4,kind:"SLIME",color:C.green,hp:70,maxHp:70,lane:3},
{id:5,kind:"ORC",color:C.orange,hp:120,maxHp:120,lane:4}
];

function Neon({color,size=38,label}) {
 return <View style={[styles.neon,{width:size,height:size*1.12,borderColor:color,shadowColor:color}]}>
   <View style={[styles.head,{borderColor:color}]}/>
   <View style={[styles.eye,{backgroundColor:color,left:size*.28}]}/>
   <View style={[styles.eye,{backgroundColor:color,right:size*.28}]}/>
   {label?<Text style={[styles.mark,{color}]}>{label}</Text>:null}
 </View>;
}
function Header({title,onBack}) {
 return <View style={styles.header}>
   <View style={styles.headerLeft}>{onBack?<Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>‹</Text></Pressable>:null}<Text style={styles.logo}>{title}</Text></View>
   <View style={styles.resources}><Text style={{color:C.yellow}}>G 500</Text><Text style={{color:C.green}}>F 300</Text><Text style={{color:C.orange}}>S 150</Text></View>
 </View>;
}
function Info({title,value,color}) {
 return <View style={[styles.info,{borderColor:color+"55"}]}><Text style={[styles.kicker,{color}]}>{title}</Text><Text style={[styles.value,{color}]}>{value}</Text></View>;
}
function Home({go}) {
 return <SafeAreaView style={styles.safe}><Header title="DEMONANIC"/><ScrollView contentContainerStyle={styles.page}>
   <View style={styles.banner}><Text style={styles.kicker}>NEON SYNTHWAVE // MOBILE PROTOTYPE</Text><Text style={styles.title}>DEFEND THE KEEP</Text><Text style={styles.body}>Touch-first proof of concept for the Demonanic battlefield loop.</Text></View>
   <Pressable onPress={()=>go("prep")} style={[styles.big,{borderColor:C.cyan}]}><Text style={[styles.bigText,{color:C.cyan}]}>START DEFENSE</Text><Text style={styles.small}>PREPARATION → 5 SEC SCOUT → BATTLE</Text></Pressable>
   <View style={styles.grid}><Info title="CASTLE POWER" value="12" color={C.cyan}/><Info title="WAVE" value="1" color={C.magenta}/><Info title="TOWERS" value="1 / 5" color={C.green}/><Info title="MORALE" value="82%" color={C.yellow}/></View>
   <Text style={styles.section}>CASTLE SQUAD</Text><View style={styles.row}>{HEROES.map(h=><View key={h.id} style={styles.card}><Neon color={h.color} label={h.id[0].toUpperCase()}/><Text style={[styles.cardTitle,{color:h.color}]}>{h.name}</Text></View>)}</View>
 </ScrollView></SafeAreaView>;
}
function Prep({go}) {
 return <SafeAreaView style={styles.safe}><Header title="PREPARATION" onBack={()=>go("home")}/><ScrollView contentContainerStyle={styles.page}>
   <View style={styles.notice}><Text style={[styles.kicker,{color:C.yellow}]}>NO PREP TIMER</Text><Text style={styles.body}>Place a tower, review the squad, then manually start the wave.</Text></View>
   <Text style={styles.section}>TOWER SLOTS</Text><View style={styles.wrap}>{TOWERS.map(t=><View key={t.id} style={[styles.towerCard,{borderColor:t.color+"88"}]}><Neon color={t.color} size={42} label={t.id[0].toUpperCase()}/><Text style={[styles.cardTitle,{color:t.color}]}>{t.name}</Text><Text style={styles.small}>DMG {t.damage}</Text></View>)}</View>
   <Text style={styles.section}>CASTLE SQUAD</Text><View style={styles.wrap}>{HEROES.map(h=><View key={h.id} style={styles.wide}><Neon color={h.color} size={42} label={h.id[0].toUpperCase()}/><View><Text style={[styles.cardTitle,{color:h.color}]}>{h.name}</Text><Text style={styles.small}>HP {h.hp}/{h.maxHp} · AUTO</Text></View></View>)}</View>
   <Pressable onPress={()=>go("battle")} style={[styles.big,{borderColor:C.magenta}]}><Text style={[styles.bigText,{color:C.magenta}]}>START WAVE</Text><Text style={styles.small}>5-SECOND SCOUT COUNTDOWN</Text></Pressable>
 </ScrollView></SafeAreaView>;
}
function MovingUnit({x,y,children,style}) {
 const yAnim=useRef(new Animated.Value(y)).current;
 useEffect(()=>{
   Animated.timing(yAnim,{toValue:y,duration:110,easing:Easing.linear,useNativeDriver:true,isInteraction:false}).start();
 },[y,yAnim]);
 return <Animated.View style={[style,{left:x,top:0,transform:[{translateY:yAnim}]}]}>{children}</Animated.View>;
}

function Projectile({shot,onDone}) {
 const motion=useRef(new Animated.ValueXY({x:0,y:0})).current;
 useEffect(()=>{
   Animated.timing(motion,{toValue:{x:shot.tx-shot.sx,y:shot.ty-shot.sy},duration:260,easing:Easing.linear,useNativeDriver:true,isInteraction:false})
     .start(({finished})=>{if(finished)onDone(shot.id)});
 },[motion,shot,onDone]);
 const angle=Math.atan2(shot.ty-shot.sy,shot.tx-shot.sx);
 const length=shot.kind==="magic"?13:shot.kind==="bolt"?17:shot.kind==="rock"?15:18;
 return <Animated.View style={[styles.projectile,{left:shot.sx,top:shot.sy,width:length,backgroundColor:shot.color,shadowColor:shot.color,transform:[{translateX:motion.x},{translateY:motion.y},{rotate:`${angle}rad`}]},shot.kind==="magic"&&styles.magicProjectile]}/>;
}

function Battlefield({enemies,heroes,towers,shots,selectedTarget,onAttack,onProjectileDone,width}) {
 const fieldH=Math.min(610,width*1.55),laneW=width/5;
 const enemySize=28;
 const heroPositions=heroes.map((h,i)=>({x:(i+.5)*(width/heroes.length)-18,y:fieldH*h.progress}));
 const towerPositions=towers.map((t,i)=>({x:i%2?width-48:18,y:fieldH*(.32+i*.075)}));
 return <View style={[styles.field,{width,height:fieldH}]}>
   <View style={[styles.band,{top:fieldH*.24,borderColor:C.yellow}]}><Text style={[styles.bandText,{color:C.yellow}]}>OUTER WALL</Text></View>
   <View style={[styles.band,{top:fieldH*.53,borderColor:C.red}]}><Text style={[styles.bandText,{color:C.red}]}>GATE</Text></View>
   {Array.from({length:6}).map((_,i)=><View key={i} style={[styles.lane,{left:i*laneW}]}/>)}
   <View style={styles.keep}><Text style={[styles.keepText,{color:C.magenta}]}>KEEP</Text><View style={[styles.castle,{borderColor:C.magenta}]}/></View>
   {towers.map((t,i)=>{
     const p=towerPositions[i];
     return <View key={t.id} style={[styles.towerField,{left:p.x,top:p.y}]}><Neon color={t.color} size={30} label={t.id[0].toUpperCase()}/><Text style={[styles.unitTag,{color:t.color}]}>AUTO</Text></View>;
   })}
   {enemies.map(e=>{
     const x=e.lane*laneW+laneW/2-enemySize/2, y=fieldH*e.progress;
     return <Pressable key={e.id} onPress={()=>onAttack(e.id)} style={[styles.enemyHitbox,{left:x-7,top:y-7},{borderColor:selectedTarget===e.id?e.color:"transparent"}]}>
       <MovingUnit x={7} y={7} style={styles.enemyUnit}>
         <Neon color={e.color} size={enemySize} label={e.kind[0]}/>
         <View style={styles.hp}><View style={[styles.hpFill,{width:30*(e.hp/e.maxHp),backgroundColor:e.color}]}/></View>
       </MovingUnit>
     </Pressable>;
   })}
   {heroes.map((h,i)=>{
     const p=heroPositions[i];
     return <MovingUnit key={h.id} x={p.x} y={p.y} style={styles.heroField}>
       <Neon color={h.color} size={34} label={h.id[0].toUpperCase()}/>
       <Text style={[styles.unitTag,{color:h.color}]}>AUTO</Text>
       <View style={styles.hp}><View style={[styles.hpFill,{width:34*(h.hp/h.maxHp),backgroundColor:h.color}]}/></View>
     </MovingUnit>;
   })}
   {shots.map(shot=><Projectile key={shot.id} shot={shot} onDone={onProjectileDone}/>)}
   <View style={styles.castleHp}><Text style={styles.small}>CASTLE 100%</Text></View>
 </View>;
}
function Results({won,kills,go}) {
 return <SafeAreaView style={styles.safe}><Header title="RESULTS" onBack={()=>go("home")}/><View style={styles.results}>
   <Text style={[styles.title,{color:won?C.cyan:C.red}]}>{won?"WAVE CLEARED":"CASTLE FALLEN"}</Text>
   <Text style={styles.body}>Prototype combat result. The production v140 systems remain in the web implementation.</Text>
   <View style={styles.resultBox}><Text style={styles.resultLine}>ENEMIES DEFEATED  {kills}</Text><Text style={styles.resultLine}>CASTLE POWER      12</Text><Text style={styles.resultLine}>HEROES            4</Text><Text style={styles.resultLine}>TOWERS            4</Text></View>
   <Pressable onPress={()=>go("prep")} style={[styles.big,{borderColor:C.green}]}><Text style={[styles.bigText,{color:C.green}]}>RETURN TO PREPARATION</Text></Pressable>
 </View></SafeAreaView>;
}
function Battle({go}) {
 const {width}=useWindowDimensions();
 const [phase,setPhase]=useState("scout"),[count,setCount]=useState(5);
 const [enemies,setEnemies]=useState(()=>INITIAL_ENEMIES.map((e,i)=>({...e,progress:.055+i*.012})));
 const [heroes,setHeroes]=useState(()=>HEROES.map((h,i)=>({...h,progress:.76})));
 const [shots,setShots]=useState([]),[selectedTarget,setSelectedTarget]=useState(null),[kills,setKills]=useState(0);
 const shotId=useRef(1),round=useRef(0);

 useEffect(()=>{
   if(phase!=="scout")return;
   const id=setInterval(()=>setCount(v=>{if(v<=1){clearInterval(id);setPhase("combat");return 0}return v-1}),1000);
   return()=>clearInterval(id);
 },[phase]);

 useEffect(()=>{
   if(phase!=="combat")return;
   const id=setInterval(()=>{
     setEnemies(cur=>cur.map(e=>{
       if(e.progress>=.72)return e;
       const lanePressure=cur.filter(x=>x.lane===e.lane).length;
       return {...e,progress:Math.min(.72,e.progress+.0028+(lanePressure>1?.0005:0))};
     }));
   },50);
   return()=>clearInterval(id);
 },[phase]);

 useEffect(()=>{
   if(phase!=="combat")return;
   const id=setInterval(()=>{
     setHeroes(cur=>{
       const front=enemies.length?Math.min(...enemies.map(e=>e.progress)):.1;
       return cur.map((h,i)=>({...h,progress:Math.max(.55,Math.min(.76,front+.12+(i%2)*.015))}));
     });
   },120);
   return()=>clearInterval(id);
 },[phase,enemies]);

 const createShot=(source,target,kind,color)=>{
   if(!target)return;
   const fieldH=Math.min(610,width*1.55),laneW=width/5;
   let sx,sy;
   if(source.type==="tower"){
     sx=source.index%2?width-33:33;
     sy=fieldH*(.32+source.index*.075)+15;
   }else{
     sx=(source.index+.5)*(width/HEROES.length);
     const hero=heroes[source.index];
     sy=fieldH*(hero?.progress??.7)+16;
   }
   const tx=target.lane*laneW+laneW/2,ty=fieldH*target.progress;
   const shot={id:shotId.current++,targetId:target.id,sx,sy,tx,ty,kind,color};
   setShots(cur=>[...cur,shot]);
 };

 const fireAutomatic=()=>{
   if(!enemies.length)return;
   round.current+=1;
   TOWERS.forEach((t,i)=>{
     const target=enemies[(round.current+i)%enemies.length];
     createShot({type:"tower",index:i},target,i===1?"rock":i===2?"magic":i===3?"bolt":"arrow",t.color);
   });
   HEROES.forEach((h,i)=>{
     const sameLane=enemies.find(e=>e.lane===i);
     const target=sameLane||enemies[(round.current+i+1)%enemies.length];
     createShot({type:"hero",index:i},target,h.id==="mage"?"magic":h.id==="knight"?"slash":h.id==="archer"?"arrow":"blade",h.color);
   });
 };

 useEffect(()=>{
   if(phase!=="combat")return;
   const id=setInterval(fireAutomatic,850);
   return()=>clearInterval(id);
 },[phase,enemies,heroes,width]);

 const impactShot=id=>{
   const shot=shots.find(s=>s.id===id);
   if(!shot)return;
   setShots(cur=>cur.filter(s=>s.id!==id));
   setEnemies(cur=>{
     let killed=0;
     const next=cur.map(e=>e.id===shot.targetId?{...e,hp:Math.max(0,e.hp-(shot.kind==="rock"?14:shot.kind==="bolt"?16:shot.kind==="magic"?10:8))}:e)
       .filter(e=>{if(e.hp===0){killed+=1;return false}return true});
     if(killed)setKills(k=>k+killed);
     return next;
   });
 };

 const manualAttack=id=>{
   const target=enemies.find(e=>e.id===id);
   if(!target)return;
   setSelectedTarget(id);
   createShot({type:"hero",index:0},target,"arrow",C.magenta);
 };

 useEffect(()=>{
   if(phase==="combat"&&enemies.length===0)setPhase("won");
 },[enemies.length,phase]);

 if(phase==="won")return <Results won kills={kills} go={go}/>;
 return <SafeAreaView style={styles.safe}><Header title={phase==="scout"?"SCOUTING":"BATTLE"} onBack={()=>go("prep")}/><ScrollView contentContainerStyle={styles.battlePage}>
   {phase==="scout"?<View style={styles.countdown}><Text style={[styles.count,{color:C.yellow}]}>{count}</Text><Text style={styles.kicker}>SCOUTS ARE WATCHING</Text><Text style={styles.body}>Five-second pre-wave phase. Combat begins automatically.</Text></View>:<View style={styles.hud}><Text style={[styles.kicker,{color:C.magenta}]}>WAVE 1 // LIVE</Text><Text style={styles.small}>AUTO COMBAT ACTIVE · TAP AN ENEMY TO DIRECT A HERO</Text></View>}
   <Battlefield enemies={enemies} heroes={heroes} towers={TOWERS} shots={shots} selectedTarget={selectedTarget} onAttack={phase==="combat"?manualAttack:()=>{}} onProjectileDone={impactShot} width={Math.max(300,width-24)}/>
   {phase==="combat"?<View style={styles.commandRow}>{HEROES.map(h=><View key={h.id} style={[styles.command,{borderColor:h.color}]}><Text style={{color:h.color,fontWeight:"800"}}>{h.name}</Text><Text style={styles.small}>AUTO ATTACK</Text></View>)}</View>:null}
 </ScrollView></SafeAreaView>;
}
export default function App(){const [screen,setScreen]=useState("home");return <><StatusBar barStyle="light-content" backgroundColor={C.bg}/>{screen==="home"&&<Home go={setScreen}/>} {screen==="prep"&&<Prep go={setScreen}/>} {screen==="battle"&&<Battle go={setScreen}/>}</>}

const styles=StyleSheet.create({
 safe:{flex:1,backgroundColor:C.bg},page:{padding:16,gap:16,paddingBottom:32},battlePage:{padding:12,gap:10,alignItems:"center",paddingBottom:30},
 header:{minHeight:64,paddingHorizontal:14,flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderBottomWidth:1,borderBottomColor:"#1B2540",backgroundColor:"#090B14"},
 headerLeft:{flexDirection:"row",alignItems:"center",gap:8,flexShrink:1},logo:{color:C.white,fontSize:18,fontWeight:"900",letterSpacing:2},
 back:{width:34,height:34,alignItems:"center",justifyContent:"center",borderWidth:1,borderColor:C.cyan},backText:{color:C.cyan,fontSize:28,lineHeight:28},
 resources:{flexDirection:"row",gap:7},banner:{padding:18,borderWidth:1,borderColor:C.magenta+"55",backgroundColor:"#0F1020"},
 kicker:{color:C.cyan,fontSize:10,fontWeight:"800",letterSpacing:1.4},title:{color:C.magenta,fontSize:27,fontWeight:"900",letterSpacing:1.5,marginTop:7},
 body:{color:"#B6C1D8",fontSize:13,lineHeight:20,marginTop:7},section:{color:"#66748E",fontSize:11,fontWeight:"900",letterSpacing:1.6,marginTop:4},
 big:{minHeight:76,borderWidth:2,backgroundColor:"#0B0E18",alignItems:"center",justifyContent:"center",padding:12},bigText:{fontSize:18,fontWeight:"900",letterSpacing:1.2},
 small:{color:C.muted,fontSize:10,marginTop:4,textAlign:"center"},grid:{flexDirection:"row",flexWrap:"wrap",gap:8},
 info:{width:"48%",minHeight:78,borderWidth:1,backgroundColor:C.panel,padding:12},value:{fontSize:25,fontWeight:"900",marginTop:5},
 row:{flexDirection:"row",justifyContent:"space-between",gap:8},wrap:{flexDirection:"row",flexWrap:"wrap",gap:9},
 card:{flex:1,minWidth:74,backgroundColor:C.panel,borderWidth:1,borderColor:"#24304B",padding:9,alignItems:"center"},
 wide:{width:"48%",flexDirection:"row",alignItems:"center",gap:10,backgroundColor:C.panel,borderWidth:1,borderColor:"#24304B",padding:9},
 cardTitle:{fontSize:10,fontWeight:"900",letterSpacing:1,marginTop:4},towerCard:{width:"47%",minHeight:118,backgroundColor:C.panel,borderWidth:1.5,padding:10,alignItems:"center",justifyContent:"center"},
 notice:{padding:14,borderWidth:1,borderColor:C.yellow+"55",backgroundColor:"#11100C"},
 neon:{backgroundColor:C.dark,borderWidth:2,borderRadius:8,alignItems:"center",justifyContent:"center",shadowOpacity:.85,shadowRadius:9,elevation:6},
 head:{position:"absolute",width:"42%",height:"34%",top:"13%",borderWidth:1.5,borderRadius:9},eye:{position:"absolute",width:3,height:3,top:"28%",borderRadius:2},mark:{position:"absolute",bottom:3,fontSize:9,fontWeight:"900"},
 field:{backgroundColor:"#0A0D16",borderWidth:1,borderColor:"#27304A",overflow:"hidden",position:"relative"},lane:{position:"absolute",top:0,bottom:0,width:1,backgroundColor:"#243047"},
 band:{position:"absolute",left:0,right:0,height:2,borderTopWidth:2},bandText:{position:"absolute",right:6,top:-15,fontSize:8,fontWeight:"900"},
 keep:{position:"absolute",bottom:0,left:0,right:0,height:"16%",alignItems:"center",justifyContent:"flex-end"},castle:{width:"44%",height:"65%",borderWidth:2,backgroundColor:"#14101C",borderTopLeftRadius:8,borderTopRightRadius:8},
 keepText:{fontSize:9,fontWeight:"900",marginBottom:3},towerField:{position:"absolute",alignItems:"center",zIndex:3},enemyHitbox:{position:"absolute",width:42,height:42,alignItems:"center",justifyContent:"center",borderWidth:1,borderRadius:21,zIndex:5},enemyUnit:{position:"absolute",width:42,alignItems:"center"},heroField:{position:"absolute",width:44,alignItems:"center",zIndex:4},unitTag:{fontSize:7,fontWeight:"900",marginTop:1},projectile:{position:"absolute",height:4,borderRadius:3,shadowOpacity:1,shadowRadius:8,zIndex:8},magicProjectile:{height:8,borderRadius:4},
 hp:{height:3,width:30,marginTop:1,backgroundColor:"#171B28",borderWidth:1,borderColor:"#30394F"},hpFill:{height:"100%"},heroField:{position:"absolute",width:48,alignItems:"center"}
 castleHp:{position:"absolute",left:8,bottom:8,padding:5,backgroundColor:"#070810CC",borderWidth:1,borderColor:C.magenta+"66",zIndex:9},
 countdown:{width:"100%",alignItems:"center",padding:12,borderWidth:1,borderColor:C.yellow+"55",backgroundColor:"#11100C"},count:{fontSize:52,fontWeight:"900"},
 hud:{width:"100%",paddingHorizontal:4},commandRow:{width:"100%",flexDirection:"row",gap:6},command:{flex:1,minHeight:50,borderWidth:1,alignItems:"center",justifyContent:"center",backgroundColor:C.panel}
 results:{flex:1,padding:22,justifyContent:"center",gap:18},resultBox:{backgroundColor:C.panel,borderWidth:1,borderColor:"#2B3650",padding:18,gap:13},resultLine:{color:C.white,fontSize:13,fontWeight:"800",letterSpacing:1}
});