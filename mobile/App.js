import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View, useWindowDimensions } from "react-native";

const C={bg:"#070810",panel:"#0E1120",cyan:"#00F3FF",magenta:"#FF007F",green:"#39FF14",yellow:"#FFE600",orange:"#FF6600",purple:"#A855F7",red:"#FF0055",white:"#EAF2FF",muted:"#8290AA",dark:"#090C14"};

const HEROES=[
{id:"knight",name:"KNIGHT",color:C.cyan,hp:120,maxHp:120,damage:16,cooldown:900,range:.20,advance:82},
{id:"rogue",name:"ROGUE",color:C.green,hp:85,maxHp:85,damage:20,cooldown:650,range:.18,advance:92},
{id:"mage",name:"MAGE",color:C.purple,hp:75,maxHp:75,damage:22,cooldown:1050,range:.34,advance:48},
{id:"archer",name:"ARCHER",color:C.yellow,hp:90,maxHp:90,damage:18,cooldown:800,range:.42,advance:38}
];

const TOWERS=[
{id:"archer",name:"ARCHER",color:C.green,damage:8,cooldown:750,range:1},
{id:"catapult",name:"CATAPULT",color:C.orange,damage:14,cooldown:1250,range:1},
{id:"wizard",name:"WIZARD",color:C.purple,damage:12,cooldown:950,range:1},
{id:"ballista",name:"BALLISTA",color:C.cyan,damage:22,cooldown:1450,range:1}
];

const INITIAL_ENEMIES=[
{id:1,kind:"GHOST",color:C.magenta,hp:58,maxHp:58,lane:0,progress:.04},
{id:2,kind:"GOBLIN",color:C.yellow,hp:70,maxHp:70,lane:1,progress:.015},
{id:3,kind:"SKELETON",color:"#E2E8F0",hp:82,maxHp:82,lane:2,progress:0},
{id:4,kind:"SLIME",color:C.green,hp:66,maxHp:66,lane:3,progress:.025},
{id:5,kind:"ORC",color:C.orange,hp:108,maxHp:108,lane:4,progress:-.01}
];

function Neon({color,size=32,label}) {
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
   <View style={styles.banner}><Text style={styles.kicker}>NEON SYNTHWAVE // MOBILE COMBAT V2</Text><Text style={styles.title}>DEFEND THE KEEP</Text><Text style={styles.body}>Automated combat prototype: moving enemies, advancing heroes, tower fire and visible projectiles.</Text></View>
   <Pressable onPress={()=>go("prep")} style={[styles.big,{borderColor:C.cyan}]}><Text style={[styles.bigText,{color:C.cyan}]}>START DEFENSE</Text><Text style={styles.small}>PREPARATION → 5 SEC SCOUT → BATTLE</Text></Pressable>
   <View style={styles.grid}><Info title="CASTLE POWER" value="12" color={C.cyan}/><Info title="WAVE" value="1" color={C.magenta}/><Info title="TOWERS" value="4 / 5" color={C.green}/><Info title="MORALE" value="82%" color={C.yellow}/></View>
   <Text style={styles.section}>CASTLE SQUAD</Text><View style={styles.row}>{HEROES.map(h=><View key={h.id} style={styles.card}><Neon color={h.color} label={h.id[0].toUpperCase()}/><Text style={[styles.cardTitle,{color:h.color}]}>{h.name}</Text></View>)}</View>
 </ScrollView></SafeAreaView>;
}

function Prep({go}) {
 return <SafeAreaView style={styles.safe}><Header title="PREPARATION" onBack={()=>go("home")}/><ScrollView contentContainerStyle={styles.page}>
   <View style={styles.notice}><Text style={[styles.kicker,{color:C.yellow}]}>NO PREP TIMER</Text><Text style={styles.body}>Place a tower, review the squad, then manually start the wave.</Text></View>
   <Text style={styles.section}>TOWER SLOTS</Text><View style={styles.wrap}>{TOWERS.map(t=><View key={t.id} style={[styles.towerCard,{borderColor:t.color+"88"}]}><Neon color={t.color} size={34} label={t.id[0].toUpperCase()}/><Text style={[styles.cardTitle,{color:t.color}]}>{t.name}</Text><Text style={styles.small}>DMG {t.damage} · AUTO</Text></View>)}</View>
   <Text style={styles.section}>CASTLE SQUAD</Text><View style={styles.wrap}>{HEROES.map(h=><View key={h.id} style={styles.wide}><Neon color={h.color} size={36} label={h.id[0].toUpperCase()}/><View><Text style={[styles.cardTitle,{color:h.color}]}>{h.name}</Text><Text style={styles.small}>HP {h.hp}/{h.maxHp} · AUTO</Text></View></View>)}</View>
   <Pressable onPress={()=>go("battle")} style={[styles.big,{borderColor:C.magenta}]}><Text style={[styles.bigText,{color:C.magenta}]}>START WAVE</Text><Text style={styles.small}>5-SECOND SCOUT COUNTDOWN</Text></Pressable>
 </ScrollView></SafeAreaView>;
}

function Projectile({shot,onDone}) {
 const progress=useRef(new Animated.Value(0)).current;
 useEffect(()=>{
   Animated.timing(progress,{toValue:1,duration:520,easing:Easing.linear,useNativeDriver:true}).start(()=>onDone(shot.id));
 },[onDone,progress,shot.id]);
 const x=progress.interpolate({inputRange:[0,1],outputRange:[shot.fromX,shot.toX]});
 const y=progress.interpolate({inputRange:[0,1],outputRange:[shot.fromY,shot.toY]});
 const scale=progress.interpolate({inputRange:[0,.8,1],outputRange:[1,1.15,.25]});
 return <Animated.View pointerEvents="none" style={[styles.projectile,{backgroundColor:shot.color,shadowColor:shot.color,transform:[{translateX:x},{translateY:y},{scale}]}]}/>;
}

function AnimatedEnemy({enemy,width,fieldH,onPress,combat}) {
 const y=useRef(new Animated.Value(enemy.progress)).current;
 useEffect(()=>{
   if(!combat){ y.setValue(enemy.progress); return; }
   Animated.timing(y,{toValue:enemy.progress,duration:120,easing:Easing.linear,useNativeDriver:true}).start();
 },[combat,enemy.progress,y]);
 const laneW=width/5;
 const startY=fieldH*.06;
 const travel=fieldH*.72;
 const translateY=y.interpolate({inputRange:[0,1],outputRange:[0,travel]});
 const size=30;
 return <Pressable onPress={onPress} style={[styles.enemy,{left:enemy.lane*laneW+laneW/2-size/2,top:startY,width:size}]}>
   <Animated.View style={{transform:[{translateY}]}}>
     <Neon color={enemy.color} size={size} label={enemy.kind[0]}/>
     <View style={styles.hp}><View style={[styles.hpFill,{width:size*(enemy.hp/enemy.maxHp),backgroundColor:enemy.color}]}/></View>
   </Animated.View>
 </Pressable>;
}

function AnimatedHero({hero,index,width,fieldH,combat}) {
 const y=useRef(new Animated.Value(0)).current;
 useEffect(()=>{
   if(combat) Animated.timing(y,{toValue:1,duration:2400,easing:Easing.out(Easing.cubic),useNativeDriver:true}).start();
 },[combat,y]);
 const baseTop=fieldH*.78;
 const travel=hero.advance;
 const x=(index+.5)*(width/4)-22;
 const translateY=y.interpolate({inputRange:[0,1],outputRange:[0,-travel]});
 return <View style={[styles.heroField,{left:x,top:baseTop}]}>
   <Animated.View style={{transform:[{translateY}]}}>
     <Neon color={hero.color} size={36} label={hero.id[0].toUpperCase()}/>
     <View style={styles.hp}><View style={[styles.hpFill,{width:36*(hero.hp/hero.maxHp),backgroundColor:hero.color}]}/></View>
   </Animated.View>
 </View>;
}

function Battlefield({enemies,heroes,towers,width,fieldH,shots,onAttack,onShotDone,combat,castleHp}) {
 const laneW=width/5;
 const towerSpots=[
   {x:laneW*.55,y:fieldH*.34},{x:laneW*4.45,y:fieldH*.39},
   {x:laneW*1.55,y:fieldH*.46},{x:laneW*3.45,y:fieldH*.51}
 ];
 return <View style={[styles.field,{width,height:fieldH}]}>
   <View style={[styles.band,{top:fieldH*.27,borderColor:C.yellow}]}><Text style={[styles.bandText,{color:C.yellow}]}>OUTER WALL</Text></View>
   <View style={[styles.band,{top:fieldH*.57,borderColor:C.red}]}><Text style={[styles.bandText,{color:C.red}]}>GATE</Text></View>
   {Array.from({length:6}).map((_,i)=><View key={i} style={[styles.lane,{left:i*laneW}]}/>)}
   <View style={styles.keep}><Text style={[styles.keepText,{color:C.magenta}]}>KEEP</Text><View style={[styles.castle,{borderColor:C.magenta}]}/></View>
   {towers.map((t,i)=><View key={t.id} style={[styles.towerField,{left:towerSpots[i].x-17,top:towerSpots[i].y}]}><Neon color={t.color} size={34} label={t.id[0].toUpperCase()}/></View>)}
   {enemies.map(e=><AnimatedEnemy key={e.id} enemy={e} width={width} fieldH={fieldH} combat={combat} onPress={()=>onAttack(e.id)}/>)}
   {heroes.map((h,i)=><AnimatedHero key={h.id} hero={h} index={i} width={width} fieldH={fieldH} combat={combat}/>) }
   {shots.map(shot=><Projectile key={shot.id} shot={shot} onDone={onShotDone}/>)}
   <View style={styles.castleHp}><Text style={styles.small}>CASTLE {castleHp}%</Text></View>
 </View>;
}

function Results({won,kills,go}) {
 return <SafeAreaView style={styles.safe}><Header title="RESULTS" onBack={()=>go("home")}/><View style={styles.results}>
   <Text style={[styles.title,{color:won?C.cyan:C.red}]}>{won?"WAVE CLEARED":"CASTLE FALLEN"}</Text>
   <Text style={styles.body}>Combat v2 test result. This build is testing the mobile combat presentation and loop.</Text>
   <View style={styles.resultBox}><Text style={styles.resultLine}>ENEMIES DEFEATED  {kills}</Text><Text style={styles.resultLine}>CASTLE POWER      12</Text><Text style={styles.resultLine}>HEROES            4</Text><Text style={styles.resultLine}>TOWERS            4</Text></View>
   <Pressable onPress={()=>go("prep")} style={[styles.big,{borderColor:C.green}]}><Text style={[styles.bigText,{color:C.green}]}>RETURN TO PREPARATION</Text></Pressable>
 </View></SafeAreaView>;
}

function Battle({go}) {
 const {width}=useWindowDimensions();
 const fieldW=Math.max(300,width-24);
 const fieldH=Math.min(650,fieldW*1.55);
 const [phase,setPhase]=useState("scout"),[count,setCount]=useState(5),[enemies,setEnemies]=useState(INITIAL_ENEMIES),[kills,setKills]=useState(0),[shots,setShots]=useState([]),[castleHp,setCastleHp]=useState(100);
 const enemiesRef=useRef(INITIAL_ENEMIES);
 const lastFire=useRef({});
 const shotSeq=useRef(1);

 useEffect(()=>{enemiesRef.current=enemies},[enemies]);

 useEffect(()=>{
   if(phase!=="scout")return;
   const id=setInterval(()=>setCount(v=>{if(v<=1){clearInterval(id);setPhase("combat");return 0}return v-1}),1000);
   return()=>clearInterval(id);
 },[phase]);

 const spawnShot=(attacker,target,color,damage)=>{
   const laneW=fieldW/5;
   const targetX=target.lane*laneW+laneW/2-3;
   const targetY=fieldH*(.06+Math.min(target.progress,.72));
   let fromX=fieldW/2,fromY=fieldH*.70;
   if(attacker.type==="tower"){
     const towerIndex=TOWERS.findIndex(t=>t.id===attacker.id);
     const spots=[{x:laneW*.55,y:fieldH*.34},{x:laneW*4.45,y:fieldH*.39},{x:laneW*1.55,y:fieldH*.46},{x:laneW*3.45,y:fieldH*.51}];
     fromX=spots[towerIndex].x;fromY=spots[towerIndex].y+16;
   } else {
     const hi=HEROES.findIndex(h=>h.id===attacker.id);
     fromX=(hi+.5)*(fieldW/4);fromY=fieldH*.78-HEROES[hi].advance*.55;
   }
   setShots(cur=>[...cur,{id:shotSeq.current++,createdAt:Date.now(),fromX,fromY,toX:targetX,toY:targetY,color,damage}]);
 };

 useEffect(()=>{
   if(phase!=="combat")return;
   const id=setInterval(()=>{
     const now=Date.now();
     const cur=enemiesRef.current;
     if(!cur.length){clearInterval(id);return;}
     let damageByTarget={};
     const attackers=[...TOWERS.map(t=>({type:"tower",id:t.id,damage:t.damage,cooldown:t.cooldown,range:t.range})),...HEROES.map(h=>({type:"hero",id:h.id,damage:h.damage,cooldown:h.cooldown,range:h.range}))];
     attackers.forEach(a=>{
       const ready=now-(lastFire.current[a.id]||0)>=a.cooldown;
       if(!ready)return;
       const valid=cur.filter(e=>e.progress<.86);
       if(!valid.length)return;
       const target=valid.slice().sort((x,y)=>x.progress-y.progress)[0];
       if(a.type==="hero"){
         const hero=HEROES.find(h=>h.id===a.id);
         const distance=target.progress;
         if(distance>a.range)return;
         if(hero)spawnShot(a,target,hero.color,hero.damage);
       } else {
         const tower=TOWERS.find(t=>t.id===a.id);
         if(tower)spawnShot(a,target,tower.color,tower.damage);
       }
       lastFire.current[a.id]=now;
       damageByTarget[target.id]=(damageByTarget[target.id]||0)+a.damage;
     });
     const moved=cur.map(e=>{
       const incoming=damageByTarget[e.id]||0;
       const nextProgress=Math.min(.90,e.progress+.0028);
       return {...e,progress:nextProgress,hp:Math.max(0,e.hp-incoming)};
     });
     const dead=moved.filter(e=>e.hp<=0).length;
     const breached=moved.filter(e=>e.progress>=.895&&e.hp>0).length;
     const survivors=moved.filter(e=>e.hp>0&&e.progress<.90);
     if(dead)setKills(k=>k+dead);
     if(breached)setCastleHp(h=>Math.max(0,h-breached*2));
     enemiesRef.current=survivors;
     setEnemies(survivors);
     setShots(curShots=>curShots.filter(s=>now-s.createdAt<500));
     if(!survivors.length){setPhase("won");}
     else if(castleHp<=2||castleHp-breached*2<=0){setPhase("lost");}
   },100);
   return()=>clearInterval(id);
 },[phase,fieldH,fieldW,castleHp]);

 const attack=id=>setEnemies(cur=>{
   const next=cur.map(e=>e.id===id?{...e,hp:Math.max(0,e.hp-20)}:e);
   const dead=next.filter(e=>e.hp===0).length;
   if(dead)setKills(k=>k+dead);
   const survivors=next.filter(e=>e.hp>0);
   enemiesRef.current=survivors;
   return survivors;
 });

 if(phase==="won")return <Results won kills={kills} go={go}/>;
 if(phase==="lost")return <Results won={false} kills={kills} go={go}/>;

 return <SafeAreaView style={styles.safe}><Header title={phase==="scout"?"SCOUTING":"BATTLE"} onBack={()=>go("prep")}/><ScrollView contentContainerStyle={styles.battlePage}>
   {phase==="scout"?<View style={styles.countdown}><Text style={[styles.count,{color:C.yellow}]}>{count}</Text><Text style={styles.kicker}>SCOUTS ARE WATCHING</Text><Text style={styles.body}>Five-second pre-wave phase. Combat starts automatically.</Text></View>:<View style={styles.hud}><Text style={[styles.kicker,{color:C.magenta}]}>WAVE 1 // LIVE</Text><Text style={styles.small}>AUTO COMBAT ACTIVE · TAP ANY ENEMY FOR DIRECT TARGET DAMAGE</Text></View>}
   <Battlefield enemies={enemies} heroes={HEROES} towers={TOWERS} onAttack={attack} width={fieldW} fieldH={fieldH} shots={shots} onShotDone={id=>setShots(cur=>cur.filter(s=>s.id!==id))} combat={phase==="combat"} castleHp={castleHp}/>
   {phase==="combat"?<View style={styles.commandRow}>{HEROES.map(h=><Pressable key={h.id} onPress={()=>enemies[0]&&attack(enemies[0].id)} style={[styles.command,{borderColor:h.color}]}><Text style={{color:h.color,fontWeight:"800"}}>{h.name}</Text><Text style={styles.small}>DIRECT</Text></Pressable>)}</View>:null}
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
 neon:{backgroundColor:C.dark,borderWidth:2,borderRadius:9,alignItems:"center",justifyContent:"center",shadowOpacity:.85,shadowRadius:9,elevation:6},
 head:{position:"absolute",width:"42%",height:"34%",top:"13%",borderWidth:1.5,borderRadius:9},eye:{position:"absolute",width:3,height:3,top:"28%",borderRadius:2},mark:{position:"absolute",bottom:3,fontSize:8,fontWeight:"900"},
 field:{backgroundColor:"#0A0D16",borderWidth:1,borderColor:"#27304A",overflow:"hidden",position:"relative"},lane:{position:"absolute",top:0,bottom:0,width:1,backgroundColor:"#243047"},
 band:{position:"absolute",left:0,right:0,height:2,borderTopWidth:2},bandText:{position:"absolute",right:6,top:-15,fontSize:8,fontWeight:"900"},
 keep:{position:"absolute",bottom:0,left:0,right:0,height:"16%",alignItems:"center",justifyContent:"flex-end"},castle:{width:"44%",height:"65%",borderWidth:2,backgroundColor:"#14101C",borderTopLeftRadius:8,borderTopRightRadius:8},
 keepText:{fontSize:9,fontWeight:"900",marginBottom:3},towerField:{position:"absolute",alignItems:"center"},enemy:{position:"absolute",alignItems:"center"},
 hp:{height:3,width:36,marginTop:2,backgroundColor:"#171B28",borderWidth:1,borderColor:"#30394F"},hpFill:{height:"100%"},heroField:{position:"absolute",width:44,alignItems:"center"},
 castleHp:{position:"absolute",left:8,bottom:8,padding:5,backgroundColor:"#070810CC",borderWidth:1,borderColor:C.magenta+"66"},
 countdown:{width:"100%",alignItems:"center",padding:12,borderWidth:1,borderColor:C.yellow+"55",backgroundColor:"#11100C"},count:{fontSize:52,fontWeight:"900"},
 hud:{width:"100%",paddingHorizontal:4},commandRow:{width:"100%",flexDirection:"row",gap:6},command:{flex:1,minHeight:56,borderWidth:1,alignItems:"center",justifyContent:"center",backgroundColor:C.panel},
 results:{flex:1,padding:22,justifyContent:"center",gap:18},resultBox:{backgroundColor:C.panel,borderWidth:1,borderColor:"#2B3650",padding:18,gap:13},resultLine:{color:C.white,fontSize:13,fontWeight:"800",letterSpacing:1},
 projectile:{position:"absolute",left:-5,top:-5,width:18,height:6,borderRadius:3,shadowOpacity:1,shadowRadius:9,elevation:8,zIndex:20}
});