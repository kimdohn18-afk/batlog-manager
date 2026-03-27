/* ===== DATA ===== */
var players = JSON.parse(localStorage.getItem('mgr_players')||'[]');
var games   = JSON.parse(localStorage.getItem('mgr_games')||'[]');
var currentTab = 'players';

/* ===== CONSTANTS ===== */
var POS_LIST = ['투수','포수','야수'];

var FIELD_POS = ['P','C','1B','2B','3B','SS','LF','CF','RF'];
var FIELD_POS_KR = {P:'투수',C:'포수','1B':'1루','2B':'2루','3B':'3루',SS:'유격',LF:'좌익',CF:'중견',RF:'우익'};
var FIELD_POS_COORDS = {
  CF:{left:'50%',top:'3%'},
  LF:{left:'18%',top:'15%'},
  RF:{left:'82%',top:'15%'},
  SS:{left:'34%',top:'27%'},
  '2B':{left:'66%',top:'27%'},
  '3B':{left:'34%',top:'38%'},
  P:{left:'50%',top:'36%'},
  '1B':{left:'66%',top:'38%'},
  C:{left:'50%',top:'47%'}
};

var RN = {
  '1B':'안타','2B':'2루타','3B':'3루타','HR':'홈런',
  'GO':'땅볼','FO':'뜬공','LO':'직선타','SO':'삼진',
  'BB':'볼넷','HBP':'사구',
  'SF':'희생플라이','SAC':'희생번트','E':'실책','FC':'야수선택'
};

/* ===== SAVE ===== */
function save(){
  games.sort(function(a,b){return b.date.localeCompare(a.date)});
  localStorage.setItem('mgr_players',JSON.stringify(players));
  localStorage.setItem('mgr_games',JSON.stringify(games));
}

/* ===== MIGRATE ===== */
function migrateData(){
  players.forEach(function(p){
    if(!p.id) p.id=Date.now()+Math.random()*1000|0;
  });
  games.forEach(function(g){
    if(!g.id) g.id=Date.now()+Math.random()*1000|0;
    if(!g.lineup) g.lineup=[];
    if(!g.records) g.records=[];
    if(!g.posMemos) g.posMemos=[];
    if(!g.managerNotes) g.managerNotes=[];
    if(g.scoreUs===undefined) g.scoreUs='';
    if(g.scoreThem===undefined) g.scoreThem='';
    if(!g.memo) g.memo='';
    g.lineup.forEach(function(sl){
      if(!sl.subs) sl.subs=[];
      if(sl.run===undefined) sl.run=0;
      if(sl.sb===undefined) sl.sb=0;
      sl.subs.forEach(function(sub){
        if(sub.run===undefined) sub.run=0;
        if(sub.sb===undefined) sub.sb=0;
      });
    });
    g.records.forEach(function(r){
      if(!r.abs) r.abs=[];
      r.abs.forEach(function(a){
        if(!a.memo) a.memo='';
        if(!a.id) a.id=Date.now()+Math.random()*1000|0;
        if(a.run===undefined) a.run=0;
        if(a.sb===undefined) a.sb=0;
        if(a.rbi===undefined) a.rbi=0;
      });
    });
  });
  save();
}

/* ===== CHIP CLASS ===== */
function chipClass(r){
  if('1B 2B 3B HR'.indexOf(r)>=0) return 'hit';
  if('GO FO LO SO'.indexOf(r)>=0) return 'out';
  if('BB HBP'.indexOf(r)>=0) return 'walk';
  return 'etc';
}

/* ===== FORMAT ===== */
function fmt(n){
  if(isNaN(n)||n===0) return '.000';
  var s=n.toFixed(3);
  return s.charAt(0)==='0'?s.substring(1):s;
}

/* ===== PLAYER STATS ===== */
function playerStats(pid){
  var s={pa:0,ab:0,h:0,hr:0,bb:0,hbp:0,so:0,rbi:0,runs:0,sb:0,single:0,double:0,triple:0,sf:0,sac:0};
  games.forEach(function(g){
    g.records.forEach(function(r){
      if(r.pid!==pid) return;
      r.abs.forEach(function(a){
        s.pa++;
        var res=a.result;
        if('BB HBP'.indexOf(res)>=0){
          if(res==='BB') s.bb++;
          if(res==='HBP') s.hbp++;
        } else if(res==='SF'){
          s.sf++;
        } else if(res==='SAC'){
          s.sac++;
        } else {
          s.ab++;
          if(res==='1B'){s.h++;s.single++}
          if(res==='2B'){s.h++;s.double++}
          if(res==='3B'){s.h++;s.triple++}
          if(res==='HR'){s.h++;s.hr++}
          if(res==='SO') s.so++;
        }
        if(a.rbi) s.rbi+=a.rbi;
        if(a.run) s.runs+=a.run;
        if(a.sb) s.sb+=a.sb;
      });
    });
    g.lineup.forEach(function(sl){
      if(sl.subs){
        sl.subs.forEach(function(sub){
          if(sub.pid===pid){
            s.runs+=sub.run||0;
            s.sb+=sub.sb||0;
          }
        });
      }
    });
  });
  var tb=s.single+s.double*2+s.triple*3+s.hr*4;
  s.avg=s.ab>0?s.h/s.ab:0;
  s.obp=(s.ab+s.bb+s.hbp+s.sf)>0?(s.h+s.bb+s.hbp)/(s.ab+s.bb+s.hbp+s.sf):0;
  s.slg=s.ab>0?tb/s.ab:0;
  s.ops=s.obp+s.slg;
  return s;
}

/* ===== PLAYER CRUD ===== */
function addPlayer(name,number,position){
  var p={id:Date.now(),name:name,number:number,position:position};
  players.push(p);save();return p;
}
function editPlayer(pid,name,number,position){
  var p=findPlayer(pid);if(!p)return;
  p.name=name;p.number=number;p.position=position;save();
}
function removePlayer(pid){
  players=players.filter(function(p){return p.id!==pid});save();
}
function findPlayer(pid){
  return players.find(function(p){return p.id===pid})||null;
}

/* ===== GAME CRUD ===== */
function addGame(date,opponent){
  var g={id:Date.now(),date:date,opponent:opponent,scoreUs:'',scoreThem:'',memo:'',lineup:[],records:[],posMemos:[],managerNotes:[]};
  games.push(g);save();return g;
}
function editGame(gid,date,opponent,scoreUs,scoreThem,memo){
  var g=findGame(gid);if(!g)return;
  g.date=date;g.opponent=opponent;g.scoreUs=scoreUs;g.scoreThem=scoreThem;g.memo=memo;save();
}
function removeGame(gid){
  games=games.filter(function(g){return g.id!==gid});save();
}
function findGame(gid){
  return games.find(function(g){return g.id===gid})||null;
}
function gameResult(g){
  var u=parseInt(g.scoreUs),t=parseInt(g.scoreThem);
  if(isNaN(u)||isNaN(t)) return '';
  if(u>t) return 'win';
  if(u<t) return 'lose';
  return 'draw';
}
function gameResultKR(g){
  var r=gameResult(g);
  if(r==='win') return '승';
  if(r==='lose') return '패';
  if(r==='draw') return '무';
  return '';
}

/* ===== LINEUP ===== */
function setLineup(gid,order,pos,pid){
  var g=findGame(gid);if(!g)return;
  var existing=g.lineup.find(function(s){return s.order===order});
  if(existing){
    existing.pos=pos;existing.pid=pid;
  } else {
    g.lineup.push({order:order,pos:pos,pid:pid,subs:[],run:0,sb:0});
  }
  g.lineup.sort(function(a,b){return a.order-b.order});
  save();
}
function clearLineupSlot(gid,order){
  var g=findGame(gid);if(!g)return;
  g.lineup=g.lineup.filter(function(s){return s.order!==order});
  save();
}
function addSubstitute(gid,order,pid){
  var g=findGame(gid);if(!g)return;
  var sl=g.lineup.find(function(s){return s.order===order});
  if(!sl)return;
  sl.subs.push({pid:pid,run:0,sb:0});
  save();
}
function removeLastSub(gid,order){
  var g=findGame(gid);if(!g)return;
  var sl=g.lineup.find(function(s){return s.order===order});
  if(!sl||!sl.subs.length)return;
  sl.subs.pop();save();
}

/* ===== LINEUP RUN/SB ===== */
function toggleRun(gid,order,subIdx){
  var g=findGame(gid);if(!g)return;
  var sl=g.lineup.find(function(s){return s.order===order});
  if(!sl)return;
  if(subIdx===undefined||subIdx===-1){
    sl.run=sl.run?0:1;
  } else {
    sl.subs[subIdx].run=sl.subs[subIdx].run?0:1;
  }
  save();
}
function cycleSB(gid,order,subIdx){
  var g=findGame(gid);if(!g)return;
  var sl=g.lineup.find(function(s){return s.order===order});
  if(!sl)return;
  if(subIdx===undefined||subIdx===-1){
    sl.sb=(sl.sb+1)%4;
  } else {
    sl.subs[subIdx].sb=(sl.subs[subIdx].sb+1)%4;
  }
  save();
}

/* ===== RECORDS ===== */
function getRecord(gid,pid){
  var g=findGame(gid);if(!g)return null;
  var r=g.records.find(function(r){return r.pid===pid});
  if(!r){r={pid:pid,abs:[]};g.records.push(r)}
  return r;
}
function addAB(gid,pid,result,memo,rbi,soType){
  var r=getRecord(gid,pid);if(!r)return null;
  var ab={id:Date.now(),result:result,memo:memo||'',rbi:rbi||0,run:0,sb:0,soType:soType||''};
  r.abs.push(ab);save();return ab.id;
}
function findAB(gid,pid,abId){
  var r=getRecord(gid,pid);if(!r)return null;
  return r.abs.find(function(a){return a.id===abId})||null;
}
function updateAB(gid,pid,abId,result,memo,rbi,soType){
  var a=findAB(gid,pid,abId);if(!a)return;
  a.result=result;a.memo=memo;a.rbi=rbi||0;a.soType=soType||'';save();
}
function removeAB(gid,pid,abId){
  var r=getRecord(gid,pid);if(!r)return;
  r.abs=r.abs.filter(function(a){return a.id!==abId});save();
}

/* ===== POS MEMOS ===== */
function addPosMemo(gid,pos,text){
  var g=findGame(gid);if(!g)return;
  var pm=g.posMemos.find(function(p){return p.pos===pos});
  if(!pm){pm={pos:pos,memos:[]};g.posMemos.push(pm)}
  pm.memos.push({id:Date.now(),text:text});save();
}
function removePosMemo(gid,pos,memoId){
  var g=findGame(gid);if(!g)return;
  var pm=g.posMemos.find(function(p){return p.pos===pos});
  if(!pm)return;
  pm.memos=pm.memos.filter(function(m){return m.id!==memoId});save();
}
function getPosMemos(gid,pos){
  var g=findGame(gid);if(!g)return[];
  var pm=g.posMemos.find(function(p){return p.pos===pos});
  return pm?pm.memos:[];
}
function getPosMemoCount(gid,pos){
  return getPosMemos(gid,pos).length;
}

/* ===== MANAGER NOTES ===== */
function addManagerNote(gid,text){
  var g=findGame(gid);if(!g)return;
  g.managerNotes.push({id:Date.now(),text:text});save();
}
function removeManagerNote(gid,noteId){
  var g=findGame(gid);if(!g)return;
  g.managerNotes=g.managerNotes.filter(function(n){return n.id!==noteId});save();
}

/* ===== INIT ===== */
migrateData();

/* ===== BACKUP / RESTORE ===== */
function doBackup(){
  var data={
    players:players,
    games:games,
    exportDate:new Date().toISOString()
  };
  var json=JSON.stringify(data,null,2);
  var blob=new Blob([json],{type:'application/json'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');
  a.href=url;
  a.download='batlog_backup_'+new Date().toISOString().slice(0,10)+'.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  alert('백업 파일이 다운로드되었습니다.');
}

function doRestore(input){
  var file=input.files[0];
  if(!file)return;
  var reader=new FileReader();
  reader.onload=function(e){
    try{
      var data=JSON.parse(e.target.result);
      if(!data.players||!data.games){
        alert('올바른 백업 파일이 아닙니다.');return;
      }
      if(!confirm('현재 데이터가 백업 파일의 데이터로 교체됩니다. 계속하시겠습니까?'))return;
      players=data.players;
      games=data.games;
      save();
      migrateData();
      renderAll();
      alert('복원 완료! 선수 '+players.length+'명, 경기 '+games.length+'경기');
    }catch(err){
      alert('파일을 읽을 수 없습니다: '+err.message);
    }
  };
  reader.readAsText(file);
  input.value='';
}

function doResetAll(){
  if(!confirm('정말 모든 데이터를 삭제하시겠습니까?'))return;
  if(!confirm('복구할 수 없습니다. 정말 삭제하시겠습니까?'))return;
  players=[];
  games=[];
  save();
  renderAll();
  alert('모든 데이터가 삭제되었습니다.');
}