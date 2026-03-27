/* ===== MODAL HELPERS ===== */
function openModal(html){
  document.getElementById('modalBox').innerHTML=html;
  document.getElementById('modalBg').classList.add('show');
  document.getElementById('modalBg').style.zIndex='20000';
}
function closeModal(){
  document.getElementById('modalBg').classList.remove('show');
  document.getElementById('modalBg').style.zIndex='10000';
}
function openModalFull(html){
  document.getElementById('modalFullBox').innerHTML=html;
  document.getElementById('modalFullBg').classList.add('show');
}
function closeModalFull(){
  document.getElementById('modalFullBg').classList.remove('show');
}

/* ===== ADD PLAYER ===== */
function openAddPlayer(){
  var h='<button class="modal-close" onclick="closeModal()">✕</button>';
  h+='<div class="modal-title">선수 등록</div>';
  h+='<div class="modal-label">이름</div>';
  h+='<input class="modal-input" id="pName" placeholder="홍길동">';
  h+='<div class="modal-label">등번호</div>';
  h+='<input class="modal-input" id="pNum" type="number" placeholder="1">';
  h+='<div class="modal-label">포지션</div>';
  h+='<select class="modal-select" id="pPos">';
  POS_LIST.forEach(function(p){h+='<option value="'+p+'">'+p+'</option>'});
  h+='</select>';
  h+='<button class="modal-primary" onclick="doAddPlayer()">등록</button>';
  openModal(h);
}
function doAddPlayer(){
  var name=document.getElementById('pName').value.trim();
  var num=document.getElementById('pNum').value.trim();
  var pos=document.getElementById('pPos').value;
  if(!name){alert('이름을 입력해주세요');return}
  addPlayer(name,num||'0',pos);
  closeModal();renderAll();
}

/* ===== PLAYER DETAIL ===== */
function openPlayerDetail(pid){
  var p=findPlayer(pid);if(!p)return;
  var s=playerStats(pid);
  var h='<button class="modal-close" onclick="closeModal()">✕</button>';
  h+='<div class="modal-title">'+p.name+' #'+p.number+'</div>';
  h+='<div class="modal-label">포지션: '+p.position+'</div>';
  if(s.pa>0){
    h+='<div style="margin:12px 0;font-size:13px;line-height:1.8">';
    h+='타율 <b>'+fmt(s.avg)+'</b> · 출루율 <b>'+fmt(s.obp)+'</b> · 장타율 <b>'+fmt(s.slg)+'</b> · OPS <b>'+fmt(s.ops)+'</b><br>';
    h+=s.pa+'타석 '+s.ab+'타수 '+s.h+'안타 '+s.hr+'홈런<br>';
    h+=s.rbi+'타점 '+s.runs+'득점 '+s.bb+'볼넷 '+s.so+'삼진 '+s.sb+'도루';
    h+='</div>';
  } else {
    h+='<div style="margin:12px 0;font-size:13px;color:#999">기록이 없습니다</div>';
  }
  h+='<button class="modal-primary" onclick="openEditPlayer('+pid+')">수정</button>';
  h+='<button class="modal-del" onclick="if(confirm(\'삭제하시겠습니까?\')){removePlayer('+pid+');closeModal();renderAll()}">삭제</button>';
  openModal(h);
}

/* ===== EDIT PLAYER ===== */
function openEditPlayer(pid){
  var p=findPlayer(pid);if(!p)return;
  var h='<button class="modal-close" onclick="closeModal()">✕</button>';
  h+='<div class="modal-title">선수 수정</div>';
  h+='<div class="modal-label">이름</div>';
  h+='<input class="modal-input" id="eName" value="'+p.name+'">';
  h+='<div class="modal-label">등번호</div>';
  h+='<input class="modal-input" id="eNum" type="number" value="'+p.number+'">';
  h+='<div class="modal-label">포지션</div>';
  h+='<select class="modal-select" id="ePos">';
  POS_LIST.forEach(function(pos){
    h+='<option value="'+pos+'"'+(pos===p.position?' selected':'')+'>'+pos+'</option>';
  });
  h+='</select>';
  h+='<button class="modal-primary" onclick="doEditPlayer('+pid+')">저장</button>';
  openModal(h);
}
function doEditPlayer(pid){
  var name=document.getElementById('eName').value.trim();
  var num=document.getElementById('eNum').value.trim();
  var pos=document.getElementById('ePos').value;
  if(!name){alert('이름을 입력해주세요');return}
  editPlayer(pid,name,num||'0',pos);
  openPlayerDetail(pid);renderAll();
}

/* ===== ADD GAME ===== */
function openAddGame(){
  var today=new Date().toISOString().slice(0,10);
  var h='<button class="modal-close" onclick="closeModal()">✕</button>';
  h+='<div class="modal-title">경기 추가</div>';
  h+='<div class="modal-label">날짜</div>';
  h+='<input class="modal-input" id="gDate" type="date" value="'+today+'">';
  h+='<div class="modal-label">상대팀</div>';
  h+='<input class="modal-input" id="gOpp" placeholder="상대팀 이름">';
  h+='<button class="modal-primary" onclick="doAddGame()">추가</button>';
  openModal(h);
}
function doAddGame(){
  var date=document.getElementById('gDate').value;
  var opp=document.getElementById('gOpp').value.trim();
  if(!opp){alert('상대팀을 입력해주세요');return}
  addGame(date,opp);
  closeModal();renderAll();
}

/* ===== GAME HUB ===== */
function openGameHub(gid){
  var g=findGame(gid);if(!g)return;
  var h='<button class="modal-close" onclick="closeModal()">✕</button>';
  h+='<div class="modal-title">'+g.date+' vs '+g.opponent+'</div>';

  // score
  h+='<div class="modal-label">스코어</div>';
  h+='<div class="score-bar">';
  h+='<span style="font-size:13px;font-weight:600">우리팀</span>';
  h+='<input id="hubScoreUs" type="number" min="0" value="'+(g.scoreUs||'')+'">';
  h+='<span class="vs">:</span>';
  h+='<input id="hubScoreThem" type="number" min="0" value="'+(g.scoreThem||'')+'">';
  h+='<span style="font-size:13px;font-weight:600">'+g.opponent+'</span>';
  h+='</div>';

  // memo
  h+='<div class="modal-label">총평</div>';
  h+='<textarea class="modal-textarea" id="hubMemo" placeholder="경기 전체 평가를 적어주세요">'+g.memo+'</textarea>';

  // save score+memo
  h+='<button class="modal-primary" onclick="doSaveHub('+gid+')">저장</button>';

  // lineup button
  var lineupCount=g.lineup.length;
  h+='<button class="modal-secondary" onclick="closeModal();openLineup('+gid+')">라인업 배치 ('+lineupCount+'/9)</button>';

  // record button
  if(lineupCount>0){
    h+='<button class="modal-secondary" onclick="closeModal();openRecordView('+gid+')">📋 경기 기록</button>';
  } else {
    h+='<button class="modal-secondary" disabled style="opacity:.4">📋 경기 기록 (라인업 먼저 배치)</button>';
  }

  // edit game info
  h+='<button class="modal-secondary" onclick="openEditGameInfo('+gid+')">경기 정보 수정</button>';

  // delete
  h+='<button class="modal-del" onclick="if(confirm(\'삭제하시겠습니까?\')){removeGame('+gid+');closeModal();renderAll()}">경기 삭제</button>';
  openModal(h);
}
function doSaveHub(gid){
  var g=findGame(gid);if(!g)return;
  g.scoreUs=document.getElementById('hubScoreUs').value;
  g.scoreThem=document.getElementById('hubScoreThem').value;
  g.memo=document.getElementById('hubMemo').value.trim();
  save();renderAll();
  alert('저장되었습니다');
}

/* ===== EDIT GAME INFO ===== */
function openEditGameInfo(gid){
  var g=findGame(gid);if(!g)return;
  var h='<button class="modal-close" onclick="closeModal()">✕</button>';
  h+='<div class="modal-title">경기 정보 수정</div>';
  h+='<div class="modal-label">날짜</div>';
  h+='<input class="modal-input" id="egDate" type="date" value="'+g.date+'">';
  h+='<div class="modal-label">상대팀</div>';
  h+='<input class="modal-input" id="egOpp" value="'+g.opponent+'">';
  h+='<button class="modal-primary" onclick="doEditGameInfo('+gid+')">저장</button>';
  openModal(h);
}
function doEditGameInfo(gid){
  var g=findGame(gid);if(!g)return;
  g.date=document.getElementById('egDate').value;
  g.opponent=document.getElementById('egOpp').value.trim();
  save();openGameHub(gid);renderAll();
}

/* ===== LINEUP ===== */
var lineupGid=null;
var lineupSelPos=null;
var lineupSelOrder=null;

function openLineup(gid){
  lineupGid=gid;lineupSelPos=null;lineupSelOrder=null;
  renderLineupFull();
}
function renderLineupFull(){
  var g=findGame(lineupGid);if(!g)return;
  var h='<button class="modal-close" onclick="closeModalFull();openGameHub('+lineupGid+')">✕</button>';
  h+='<div style="padding:12px 16px 16px">';
  h+='<div class="modal-title">라인업 배치 — '+g.date+' vs '+g.opponent+'</div>';

  // 하나의 큰 컨테이너 (필드 + 타순 통합)
  h+='<div class="lineup-field">';

  // 포지션 버튼
  FIELD_POS.forEach(function(pos){
    var c=FIELD_POS_COORDS[pos];
    var sl=g.lineup.find(function(s){return s.pos===pos});
    var p=sl?findPlayer(sl.pid):null;
    var filled=sl?'filled':'';
    h+='<div class="lineup-pos-btn '+filled+'" style="left:'+c.left+';top:'+c.top+'" onclick="lineupClickPos(\''+pos+'\')">';
    h+='<span class="lp-code">'+pos+'</span>';
    if(p) h+='<span class="lp-name">'+p.name+'</span>';
    h+='</div>';
  });

  // 타순 리스트 (포수 아래에 배치, absolute)
  for(var i=1;i<=9;i++){
    var sl=g.lineup.find(function(s){return s.order===i});
    var p=sl?findPlayer(sl.pid):null;
    var topPx=55+((i-1)*4.8);
    h+='<div style="position:absolute;left:5%;right:5%;top:'+topPx+'%;height:4.2%;background:rgba(255,87,34,.1);border-radius:8px;display:flex;align-items:center;padding:0 10px">';
    h+='<div style="width:24px;height:24px;border-radius:50%;background:#e65100;color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;margin-right:8px;flex-shrink:0">'+i+'</div>';
    if(p){
      h+='<span style="font-size:12px;font-weight:700;flex:1">'+p.name+' <span style="font-size:10px;color:#888;font-weight:400">'+FIELD_POS_KR[sl.pos]+'</span></span>';
      h+='<button style="background:none;border:none;color:#c62828;font-size:14px;cursor:pointer" onclick="event.stopPropagation();doClearSlot('+i+')">✕</button>';
    } else {
      h+='<span style="font-size:11px;color:#bbb;flex:1">선수를 배치해주세요</span>';
      h+='<button style="width:22px;height:22px;border-radius:50%;border:1.5px solid #ddd;background:#fafafa;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#999" onclick="event.stopPropagation();lineupClickOrder('+i+')">+</button>';
    }
    h+='</div>';
  }

  h+='</div>'; // lineup-field 끝
  h+='</div>';

  openModalFull(h);
}

function lineupClickPos(pos){
  lineupSelPos=pos;
  // show player select
  var g=findGame(lineupGid);if(!g)return;
  var usedPids=g.lineup.map(function(s){return s.pid});
  var avail=players.filter(function(p){return usedPids.indexOf(p.id)<0});
  if(!avail.length){alert('배치 가능한 선수가 없습니다');return}

  var h='<button class="modal-close" onclick="closeModal()">✕</button>';
  h+='<div class="modal-title">'+FIELD_POS_KR[pos]+' ('+pos+') 선수 선택</div>';
  avail.forEach(function(p){
    h+='<div class="player-card" onclick="doLineupAssignFromPos('+p.id+')">';
    h+='<div class="player-num">'+p.number+'</div>';
    h+='<div class="player-info"><div class="player-name">'+p.name+'</div><div class="player-pos">'+p.position+'</div></div>';
    h+='</div>';
  });
  openModal(h);
}

function doLineupAssignFromPos(pid){
  var g=findGame(lineupGid);if(!g)return;
  // find next empty order
  var order=null;
  for(var i=1;i<=9;i++){
    if(!g.lineup.find(function(s){return s.order===i})){order=i;break}
  }
  if(!order){alert('타순이 꽉 찼습니다');return}

  // ask order
  var h='<button class="modal-close" onclick="closeModal()">✕</button>';
  h+='<div class="modal-title">타순 선택</div>';
  for(var i=1;i<=9;i++){
    var sl=g.lineup.find(function(s){return s.order===i});
    if(!sl){
      h+='<div class="player-card" onclick="doLineupAssign('+i+',\''+lineupSelPos+'\','+pid+')">';
      h+='<div class="player-num">'+i+'</div>';
      h+='<div class="player-info"><div class="player-name">'+i+'번 타순</div></div>';
      h+='</div>';
    }
  }
  openModal(h);
}

function lineupClickOrder(order){
  lineupSelOrder=order;
  var g=findGame(lineupGid);if(!g)return;
  var usedPids=g.lineup.map(function(s){return s.pid});
  var avail=players.filter(function(p){return usedPids.indexOf(p.id)<0});
  if(!avail.length){alert('배치 가능한 선수가 없습니다');return}

  var h='<button class="modal-close" onclick="closeModal()">✕</button>';
  h+='<div class="modal-title">'+order+'번 타순 — 선수 선택</div>';
  avail.forEach(function(p){
    h+='<div class="player-card" onclick="lineupPickPosForOrder('+p.id+')">';
    h+='<div class="player-num">'+p.number+'</div>';
    h+='<div class="player-info"><div class="player-name">'+p.name+'</div><div class="player-pos">'+p.position+'</div></div>';
    h+='</div>';
  });
  openModal(h);
}

function lineupPickPosForOrder(pid){
  var h='<button class="modal-close" onclick="closeModal()">✕</button>';
  h+='<div class="modal-title">수비 포지션 선택</div>';
  h+='<div class="modal-grid">';
  var g=findGame(lineupGid);
  var usedPos=g?g.lineup.map(function(s){return s.pos}):[];
  FIELD_POS.forEach(function(pos){
    if(usedPos.indexOf(pos)<0){
      h+='<button class="modal-btn" onclick="doLineupAssign('+lineupSelOrder+',\''+pos+'\','+pid+')">'+FIELD_POS_KR[pos]+'('+pos+')</button>';
    }
  });
  h+='</div>';
  openModal(h);
}

function doLineupAssign(order,pos,pid){
  setLineup(lineupGid,order,pos,pid);
  closeModal();renderLineupFull();
}
function doClearSlot(order){
  if(!confirm('배치를 해제하시겠습니까?'))return;
  clearLineupSlot(lineupGid,order);
  renderLineupFull();
}

/* ==============================================
   RECORD VIEW (탭 2개: 공격 / 수비)
   ============================================== */
var recGid=null;
var recTab='bat';
var openPosMemoPos=null;

function openRecordView(gid){
  recGid=gid;recTab='bat';openPosMemoPos=null;
  renderRecordFull();
}

function switchRecTab(tab){
  recTab=tab;
  renderRecordFull();
}

function renderRecordFull(){
  var g=findGame(recGid);if(!g)return;
  var res=gameResultKR(g);

  var h='<button class="modal-close" onclick="closeModalFull()">✕</button>';

  // header
  h+='<div class="record-header">';
  h+='<div class="rh-date">'+g.date+'</div>';
  h+='<div class="rh-teams">우리팀 vs '+g.opponent+'</div>';
  if(g.scoreUs!==''&&g.scoreThem!==''){
    h+='<div class="rh-score">'+g.scoreUs+' : '+g.scoreThem;
    if(res) h+=' <span class="game-result-badge '+gameResult(g)+'" style="font-size:13px">'+res+'</span>';
    h+='</div>';
  }
  h+='</div>';

  // 탭 버튼
  h+='<div class="rec-tabs">';
  h+='<button class="rec-tab'+(recTab==='bat'?' on':'')+'" onclick="switchRecTab(\'bat\')">⚾ 공격 기록</button>';
  h+='<button class="rec-tab'+(recTab==='field'?' on':'')+'" onclick="switchRecTab(\'field\')">🧤 수비 기록</button>';
  h+='</div>';

  // 탭 내용
  h+='<div style="padding:12px;overflow-y:auto">';
  if(recTab==='bat'){
    h+=renderBatPage(g);
  } else {
    h+=renderFieldPage(g);
  }
  h+='</div>';

  openModalFull(h);
}

/* ===== BAT PAGE ===== */
function renderBatPage(g){
  var h='';
  if(!g.lineup.length){
    h+='<div class="empty-msg">라인업이 없습니다</div>';
    return h;
  }

  g.lineup.forEach(function(sl){
    var p=findPlayer(sl.pid);if(!p)return;
    var rec=g.records.find(function(r){return r.pid===sl.pid});
    var abs=rec?rec.abs:[];

    h+='<div class="bat-row">';
    h+='<div class="bat-row-header">';
    h+='<div class="bat-order">'+sl.order+'</div>';
    h+='<span class="bat-pos">'+FIELD_POS_KR[sl.pos]+'</span>';
    h+='<span class="bat-name">'+p.name+'</span>';
    h+='<div class="bat-actions">';
    h+='<button class="bat-action-btn" onclick="openABInput('+g.id+','+p.id+')" title="타석추가">+</button>';
    h+='<button class="bat-action-btn" onclick="openSubSelect('+g.id+','+sl.order+')" title="교체">↔</button>';
    h+='</div></div>';

    // chips (선발: 칩에 타점/득점/도루 표시)
    if(abs.length){
      h+='<div class="bat-chips">';
      abs.forEach(function(a,idx){
        var label=String.fromCharCode(9312+idx)+(RN[a.result]||a.result);
        if(a.rbi) label+=' '+a.rbi+'타점';
        if(a.run) label+=' 득점';
        if(a.sb) label+=' 도루'+a.sb;
        h+='<span class="ab-chip '+chipClass(a.result)+'" onclick="openABDetail('+g.id+','+p.id+','+a.id+')">';
        h+=label;
        if(a.memo) h+='<span class="memo-dot"></span>';
        h+='</span>';
      });
      h+='</div>';
    }

    // 선발은 별도 득점/도루 버튼 없음

    // subs
    if(sl.subs&&sl.subs.length){
      sl.subs.forEach(function(sub,si){
        var sp=findPlayer(sub.pid);if(!sp)return;
        var subRec=g.records.find(function(r){return r.pid===sub.pid});
        var subAbs=subRec?subRec.abs:[];

        h+='<div class="bat-sub">';
        h+='<span class="bat-sub-label">교체</span> ';
        h+='<span class="bat-sub-name">'+sp.name+'</span>';
        h+=' <button class="bat-action-btn" style="width:22px;height:22px;font-size:12px" onclick="openABInput('+g.id+','+sub.pid+')" title="타석추가">+</button>';

        if(subAbs.length){
          h+='<div class="bat-chips" style="margin-top:4px">';
          subAbs.forEach(function(a,idx){
            var label=String.fromCharCode(9312+idx)+(RN[a.result]||a.result);
            if(a.rbi) label+=' '+a.rbi+'타점';
            if(a.run) label+=' 득점';
            if(a.sb) label+=' 도루'+a.sb;
            h+='<span class="ab-chip '+chipClass(a.result)+'" onclick="openABDetail('+g.id+','+sub.pid+','+a.id+')">';
            h+=label;
            if(a.memo) h+='<span class="memo-dot"></span>';
            h+='</span>';
          });
          h+='</div>';
        }

        // 교체선수는 별도 득점/도루 버튼 유지
        h+='<div class="bat-badges">';
        h+='<span class="bat-badge run" onclick="toggleRun('+g.id+','+sl.order+','+si+');renderRecordFull()">'+(sub.run?'득점 1':'득점 0')+'</span>';
        h+='<span class="bat-badge sb" onclick="cycleSB('+g.id+','+sl.order+','+si+');renderRecordFull()">도루 '+sub.sb+'</span>';
        h+='</div>';
        h+='</div>';
      });
    }

    h+='</div>';
  });

  // team memo
  h+='<div class="memo-section">';
  h+='<div class="memo-section-title">총평</div>';
  h+='<textarea class="modal-textarea" id="recMemo" onchange="saveRecMemo('+g.id+')" placeholder="팀 타격 총평">'+g.memo+'</textarea>';
  h+='</div>';

  return h;
}

function saveRecMemo(gid){
  var g=findGame(gid);if(!g)return;
  g.memo=document.getElementById('recMemo').value.trim();
  save();renderAll();
}

/* ===== FIELD PAGE ===== */
function renderFieldPage(g){
  var h='';

  // 수비 전용 좌표 (전체적으로 아래로 이동)
  var fieldCoords={
    CF:{left:'50%',top:'10%'},
    LF:{left:'18%',top:'22%'},
    RF:{left:'82%',top:'22%'},
    SS:{left:'34%',top:'37%'},
    '2B':{left:'66%',top:'37%'},
    '3B':{left:'34%',top:'48%'},
    P:{left:'50%',top:'44%'},
    '1B':{left:'66%',top:'48%'},
    C:{left:'50%',top:'58%'}
  };

  // field container
  h+='<div class="field-container" id="fieldContainer">';
  FIELD_POS.forEach(function(pos){
    var c=fieldCoords[pos];
    var sl=g.lineup.find(function(s){return s.pos===pos});
    var p=sl?findPlayer(sl.pid):null;
    var memoCount=getPosMemoCount(g.id,pos);

    h+='<div class="field-btn" style="left:'+c.left+';top:'+c.top+'" onclick="togglePosMemo(\''+pos+'\')">';
    h+='<span class="fb-pos">'+pos+'</span>';
    if(p) h+='<span class="fb-name">'+p.name+'</span>';
    if(memoCount>0) h+='<span class="fb-badge">'+memoCount+'</span>';
    h+='</div>';

    if(openPosMemoPos===pos){
      h+=renderPosMemoPopup(g,pos,c);
    }
  });

  // 감독 메모 (포수 아래 1cm, absolute 배치)
  h+='<div style="position:absolute;left:3%;right:3%;top:66%;background:#fff;border-radius:12px;padding:12px;box-shadow:0 1px 4px rgba(0,0,0,.05)">';
  h+='<div style="font-size:13px;font-weight:700;color:#333;margin-bottom:8px">📋 감독 메모</div>';
  if(g.managerNotes&&g.managerNotes.length){
    g.managerNotes.forEach(function(n){
      h+='<div class="mgr-note-item">';
      h+='<span class="mgr-note-text">'+n.text+'</span>';
      h+='<button class="mgr-note-del" onclick="removeManagerNote('+g.id+','+n.id+');renderRecordFull()">✕</button>';
      h+='</div>';
    });
  }
  h+='<div style="display:flex;gap:6px;margin-top:8px">';
  h+='<input class="modal-input" id="mgrNoteInput" style="margin-bottom:0" placeholder="예: 3회 좌익수 교체, 5회부터 내야 시프트">';
  h+='<button class="modal-btn" style="flex-shrink:0" onclick="doAddMgrNote('+g.id+')">추가</button>';
  h+='</div></div>';

  h+='</div>'; // field-container 끝

  return h;
}

function renderPosMemoPopup(g,pos,coords){
  var memos=getPosMemos(g.id,pos);
  var h='<div class="pos-memo-popup" style="left:'+coords.left+';top:calc('+coords.top+' + 30px)">';
  h+='<div style="font-size:12px;font-weight:700;margin-bottom:6px">'+FIELD_POS_KR[pos]+' 메모</div>';
  if(memos.length){
    memos.forEach(function(m){
      h+='<div class="pos-memo-item">';
      h+='<span class="pos-memo-text">'+m.text+'</span>';
      h+='<button class="pos-memo-del" onclick="event.stopPropagation();removePosMemo('+g.id+',\''+pos+'\','+m.id+');renderRecordFull()">✕</button>';
      h+='</div>';
    });
  } else {
    h+='<div style="font-size:11px;color:#999;padding:4px 0">메모 없음</div>';
  }
  h+='<div style="display:flex;gap:4px;margin-top:6px">';
  h+='<input class="modal-input" id="posMemoInput_'+pos+'" style="margin-bottom:0;font-size:11px" placeholder="메모 입력" onclick="event.stopPropagation()">';
  h+='<button class="modal-btn" style="font-size:11px;flex-shrink:0" onclick="event.stopPropagation();doAddPosMemo('+g.id+',\''+pos+'\')">추가</button>';
  h+='</div></div>';
  return h;
}

function togglePosMemo(pos){
  openPosMemoPos=(openPosMemoPos===pos)?null:pos;
  renderRecordFull();
}
function doAddPosMemo(gid,pos){
  var inp=document.getElementById('posMemoInput_'+pos);
  if(!inp)return;
  var text=inp.value.trim();
  if(!text)return;
  addPosMemo(gid,pos,text);
  renderRecordFull();
}
function doAddMgrNote(gid){
  var inp=document.getElementById('mgrNoteInput');
  if(!inp)return;
  var text=inp.value.trim();
  if(!text)return;
  addManagerNote(gid,text);
  renderRecordFull();
}

/* ===== SWIPE ===== */
function initSwipe(){
  var wrap=document.getElementById('swipeWrap');
  if(!wrap)return;
  wrap.addEventListener('touchstart',function(e){swipeStartX=e.touches[0].clientX},{passive:true});
  wrap.addEventListener('touchend',function(e){
    var dx=e.changedTouches[0].clientX-swipeStartX;
    if(Math.abs(dx)<40)return;
    if(dx<0&&recPage===0){recPage=1;updateSwipe()}
    if(dx>0&&recPage===1){recPage=0;updateSwipe()}
  },{passive:true});
}
function updateSwipe(){
  var inner=document.getElementById('swipeInner');
  if(inner) inner.style.transform='translateX('+(recPage*-100)+'%)';
  var dots=document.querySelectorAll('.swipe-dot');
  dots.forEach(function(d,i){d.classList.toggle('on',i===recPage)});
}

/* ===== SUBSTITUTION ===== */
function openSubSelect(gid,order){
  var g=findGame(gid);if(!g)return;
  var sl=g.lineup.find(function(s){return s.order===order});
  if(!sl)return;

  // players not in lineup and not already subbed in this slot
  var usedPids=g.lineup.map(function(s){return s.pid});
  g.lineup.forEach(function(s){s.subs.forEach(function(sub){usedPids.push(sub.pid)})});
  var avail=players.filter(function(p){return usedPids.indexOf(p.id)<0});

  var h='<button class="modal-close" onclick="closeModal()">✕</button>';
  h+='<div class="modal-title">'+sl.order+'번 타순 교체선수</div>';

  if(sl.subs.length>0){
    h+='<button class="modal-del" onclick="removeLastSub('+gid+','+order+');closeModal();renderRecordFull()">마지막 교체 취소</button>';
    h+='<div style="height:12px"></div>';
  }

  if(!avail.length){
    h+='<div class="empty-msg">교체 가능한 선수가 없습니다</div>';
  } else {
    avail.forEach(function(p){
      h+='<div class="player-card" onclick="doSub('+gid+','+order+','+p.id+')">';
      h+='<div class="player-num">'+p.number+'</div>';
      h+='<div class="player-info"><div class="player-name">'+p.name+'</div><div class="player-pos">'+p.position+'</div></div>';
      h+='</div>';
    });
  }
  openModal(h);
}
function doSub(gid,order,pid){
  addSubstitute(gid,order,pid);
  closeModal();renderRecordFull();
}

/* ===== AB INPUT ===== */
var abGid=null,abPid=null,abR=null,abRbi=0,abSO='';

function openABInput(gid,pid){
  abGid=gid;abPid=pid;abR=null;abRbi=0;abSO='';
  var p=findPlayer(pid);
  var h='<button class="modal-close" onclick="closeModal()">✕</button>';
  h+='<div class="modal-title">'+(p?p.name:'')+' 타석 기록</div>';

  h+='<div class="modal-label">안타</div>';
  h+='<div class="modal-grid">';
  h+='<button class="modal-btn" onclick="abPickResult(\'1B\')">안타</button>';
  h+='<button class="modal-btn" onclick="abPickResult(\'2B\')">2루타</button>';
  h+='<button class="modal-btn" onclick="abPickResult(\'3B\')">3루타</button>';
  h+='<button class="modal-btn" onclick="abPickResult(\'HR\')">홈런</button>';
  h+='</div>';

  h+='<div class="modal-label">아웃</div>';
  h+='<div class="modal-grid">';
  h+='<button class="modal-btn" onclick="abPickResult(\'GO\')">땅볼</button>';
  h+='<button class="modal-btn" onclick="abPickResult(\'FO\')">뜬공</button>';
  h+='<button class="modal-btn" onclick="abPickResult(\'LO\')">직선타</button>';
  h+='<button class="modal-btn" onclick="abPickResult(\'SO\')">삼진</button>';
  h+='</div>';

  h+='<div class="modal-label">출루 / 기타</div>';
  h+='<div class="modal-grid">';
  h+='<button class="modal-btn" onclick="abPickResult(\'BB\')">볼넷</button>';
  h+='<button class="modal-btn" onclick="abPickResult(\'HBP\')">사구</button>';
  h+='<button class="modal-btn" onclick="abPickResult(\'SF\')">희생플라이</button>';
  h+='<button class="modal-btn" onclick="abPickResult(\'SAC\')">희생번트</button>';
  h+='<button class="modal-btn" onclick="abPickResult(\'E\')">실책</button>';
  h+='<button class="modal-btn" onclick="abPickResult(\'FC\')">야수선택</button>';
  h+='</div>';

  openModal(h);
}

function abPickResult(r){
  abR=r;
  if(r==='SO') return showSOType();
  if(r==='HR') return showHRRbi();
  showABMemo();
}

function showSOType(){
  var h='<button class="modal-close" onclick="closeModal()">✕</button>';
  h+='<div class="modal-title">삼진 종류</div>';
  h+='<div class="modal-grid">';
  h+='<button class="modal-btn" onclick="abSO=\'헛스윙\';showABMemo()">헛스윙 삼진</button>';
  h+='<button class="modal-btn" onclick="abSO=\'루킹\';showABMemo()">루킹 삼진</button>';
  h+='</div>';
  openModal(h);
}

function showHRRbi(){
  var h='<button class="modal-close" onclick="closeModal()">✕</button>';
  h+='<div class="modal-title">홈런 타점</div>';
  h+='<div class="modal-grid">';
  for(var i=1;i<=4;i++){
    h+='<button class="modal-btn" onclick="abRbi='+i+';showABMemo()">'+i+'타점'+(i===4?' (만루)':'')+'</button>';
  }
  h+='</div>';
  openModal(h);
}

function showABMemo(){
  var p=findPlayer(abPid);
  var h='<button class="modal-close" onclick="closeModal()">✕</button>';
  h+='<div class="modal-title">'+(p?p.name:'')+' · '+(RN[abR]||abR)+'</div>';
  if(abSO) h+='<div style="font-size:12px;color:#888;margin-bottom:8px">'+abSO+' 삼진</div>';
  if(abRbi) h+='<div style="font-size:12px;color:#888;margin-bottom:8px">'+abRbi+'타점</div>';
  h+='<div class="modal-label">메모 (선택)</div>';
  h+='<input class="modal-input" id="abMemoInput" placeholder="예: 좌중간 적시타, 역전타">';
  h+='<button class="modal-primary" onclick="doSaveAB()">저장</button>';
  openModal(h);
}

function doSaveAB(){
  var memo=document.getElementById('abMemoInput').value.trim();
  addAB(abGid,abPid,abR,memo,abRbi,abSO);
  closeModal();renderRecordFull();renderAll();
}

/* ===== AB DETAIL ===== */
function openABDetail(gid,pid,abId){
  var a=findAB(gid,pid,abId);if(!a)return;
  var p=findPlayer(pid);

  var h='<button class="modal-close" onclick="closeModal()">✕</button>';
  h+='<div class="modal-title">'+(p?p.name:'')+' 타석 상세</div>';

  // 결과 변경
  h+='<div class="modal-label">결과</div>';
  h+='<div class="modal-grid">';
  Object.keys(RN).forEach(function(k){
    h+='<button class="modal-btn'+(a.result===k?' sel':'')+'" onclick="setABField('+gid+','+pid+','+abId+',\'result\',\''+k+'\')">'+RN[k]+'</button>';
  });
  h+='</div>';

  // 타점
  h+='<div class="modal-label">타점</div>';
  h+='<div class="modal-grid">';
  for(var i=0;i<=4;i++){
    h+='<button class="modal-btn'+((a.rbi||0)===i?' sel':'')+'" onclick="setABField('+gid+','+pid+','+abId+',\'rbi\','+i+')">'+i+'</button>';
  }
  h+='</div>';

  // 득점
  h+='<div class="modal-label">득점</div>';
  h+='<div class="modal-grid">';
  h+='<button class="modal-btn'+((a.run||0)===0?' sel':'')+'" onclick="setABField('+gid+','+pid+','+abId+',\'run\',0)">없음</button>';
  h+='<button class="modal-btn'+((a.run||0)===1?' sel':'')+'" onclick="setABField('+gid+','+pid+','+abId+',\'run\',1)">득점</button>';
  h+='</div>';

  // 도루
  h+='<div class="modal-label">도루</div>';
  h+='<div class="modal-grid">';
  for(var i=0;i<=3;i++){
    h+='<button class="modal-btn'+((a.sb||0)===i?' sel':'')+'" onclick="setABField('+gid+','+pid+','+abId+',\'sb\','+i+')">'+i+'</button>';
  }
  h+='</div>';

  // 메모
  h+='<div class="modal-label">메모</div>';
  h+='<input class="modal-input" id="abDetailMemo" value="'+(a.memo||'')+'" onchange="setABField('+gid+','+pid+','+abId+',\'memo\',this.value.trim())">';
// 저장
  h+='<button class="modal-primary" style="margin-top:16px;width:100%" onclick="closeModal();renderRecordFull()">저장</button>';
  // 삭제
  h+='<button class="modal-del" onclick="if(confirm(\'삭제하시겠습니까?\')){removeAB('+gid+','+pid+','+abId+');closeModal();renderRecordFull();renderAll()}">삭제</button>';
  openModal(h);
}
function doABEdit(gid,pid,abId){
  var result=document.getElementById('abEditResult').value;
  var rbi=parseInt(document.getElementById('abEditRbi').value)||0;
  var memo=document.getElementById('abEditMemo').value.trim();
  updateAB(gid,pid,abId,result,memo,rbi,'');
  closeModal();renderRecordFull();renderAll();
}

function setABField(gid,pid,abId,field,value){
  var a=findAB(gid,pid,abId);if(!a)return;
  a[field]=value;
  save();
  openABDetail(gid,pid,abId);
  renderAll();
}

/* ===== AB EDIT ===== */
function openABEdit(gid,pid,abId){
  var a=findAB(gid,pid,abId);if(!a)return;
  var p=findPlayer(pid);

  var h='<button class="modal-close" onclick="closeModal()">✕</button>';
  h+='<div class="modal-title">'+(p?p.name:'')+' 타석 수정</div>';
  h+='<div class="modal-label">결과</div>';
  h+='<select class="modal-select" id="abEditResult">';
  Object.keys(RN).forEach(function(k){
    h+='<option value="'+k+'"'+(k===a.result?' selected':'')+'>'+RN[k]+'</option>';
  });
  h+='</select>';
  h+='<div class="modal-label">타점</div>';
  h+='<input class="modal-input" id="abEditRbi" type="number" min="0" max="4" value="'+(a.rbi||0)+'">';
  h+='<div class="modal-label">메모</div>';
  h+='<input class="modal-input" id="abEditMemo" value="'+(a.memo||'')+'">';
  h+='<button class="modal-primary" onclick="doABEdit('+gid+','+pid+','+abId+')">저장</button>';
  openModal(h);
}

function doABEdit(gid,pid,abId){
  var result=document.getElementById('abEditResult').value;
  var rbi=parseInt(document.getElementById('abEditRbi').value)||0;
  var memo=document.getElementById('abEditMemo').value.trim();
  updateAB(gid,pid,abId,result,memo,rbi,'');
  closeModal();renderRecordFull();renderAll();
}

function setABField(gid,pid,abId,field,value){
  var a=findAB(gid,pid,abId);if(!a)return;
  a[field]=value;
  save();
  openABDetail(gid,pid,abId);
  renderAll();
}


