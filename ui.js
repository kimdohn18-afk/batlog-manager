/* ===== TAB SWITCH ===== */
function switchTab(tab){
  currentTab=tab;
  document.querySelectorAll('.tab').forEach(function(t){t.classList.remove('on')});
  document.querySelectorAll('.tab').forEach(function(t){
    if(t.textContent==='선수목록'&&tab==='players') t.classList.add('on');
    if(t.textContent==='경기'&&tab==='games') t.classList.add('on');
    if(t.textContent==='팀스탯'&&tab==='stats') t.classList.add('on');
    if(t.textContent==='설정'&&tab==='settings') t.classList.add('on');
  });
  document.getElementById('playersTab').style.display=tab==='players'?'':'none';
  document.getElementById('gamesTab').style.display=tab==='games'?'':'none';
  document.getElementById('statsTab').style.display=tab==='stats'?'':'none';
  document.getElementById('settingsTab').style.display=tab==='settings'?'':'none';
  renderAll();
}

/* ===== RENDER PLAYERS ===== */
function renderPlayers(){
  var el=document.getElementById('playersTab');
  if(!players.length){el.innerHTML='<div class="empty-msg">선수를 등록해주세요</div>';return}
  var h='';
  players.forEach(function(p){
    var s=playerStats(p.id);
    h+='<div class="player-card" onclick="openPlayerDetail('+p.id+')">';
    h+='<div class="player-num">'+p.number+'</div>';
    h+='<div class="player-info">';
    h+='<div class="player-name">'+p.name+'</div>';
    h+='<div class="player-pos">'+p.position+'</div>';
    if(s.pa>0) h+='<div class="player-stat">타율 '+fmt(s.avg)+' · '+s.h+'안타 · '+s.pa+'타석</div>';
    h+='</div></div>';
  });
  el.innerHTML=h;
}

/* ===== RENDER GAMES ===== */
function renderGames(){
  var el=document.getElementById('gamesTab');
  if(!games.length){el.innerHTML='<div class="empty-msg">경기를 추가해주세요</div>';return}
  var h='';
  games.forEach(function(g){
    var totalPA=0,totalAB=0,totalH=0,pCount=0;
    g.records.forEach(function(r){
      if(r.abs.length>0) pCount++;
      r.abs.forEach(function(a){
        totalPA++;
        var notAB='BB HBP SF SAC';
        if(notAB.indexOf(a.result)<0) totalAB++;
        if('1B 2B 3B HR'.indexOf(a.result)>=0) totalH++;
      });
    });
    var res=gameResultKR(g);
    h+='<div class="game-card" onclick="openGameHub('+g.id+')">';
    h+='<div class="game-date">'+g.date+'</div>';
    h+='<div class="game-opp">vs '+g.opponent;
    if(g.scoreUs!==''&&g.scoreThem!==''){
      h+=' <span class="game-score">'+g.scoreUs+' : '+g.scoreThem+'</span>';
      if(res) h+=' <span class="game-result-badge '+gameResult(g)+'">'+res+'</span>';
    }
    h+='</div>';
    if(pCount>0) h+='<div class="game-summary">'+pCount+'명 출전 · '+totalPA+'타석 '+totalAB+'타수 '+totalH+'안타</div>';
    if(g.memo) h+='<div class="game-memo-preview">'+g.memo+'</div>';
    h+='</div>';
  });
  el.innerHTML=h;
}

/* ===== RENDER STATS ===== */
function renderStats(){
  var el=document.getElementById('statsTab');
  if(!players.length){el.innerHTML='<div class="empty-msg">선수를 먼저 등록해주세요</div>';return}
  var rows=[];
  players.forEach(function(p){
    var s=playerStats(p.id);
      if(s.pa>0||s.runs>0||s.sb>0) rows.push({name:p.name,s:s});
  });
  if(!rows.length){el.innerHTML='<div class="empty-msg">경기 기록이 없습니다</div>';return}
  rows.sort(function(a,b){return b.s.avg-a.s.avg});
  var h='<div style="overflow-x:auto"><table class="stat-table">';
  h+='<tr><th class="name-col">선수</th><th>타율</th><th>출루</th><th>OPS</th><th>타수</th><th>안타</th><th>HR</th><th>타점</th><th>득점</th><th>BB</th><th>SO</th><th>도루</th></tr>';
  rows.forEach(function(r){
    var s=r.s;
    h+='<tr><td class="name-col">'+r.name+'</td>';
    h+='<td>'+fmt(s.avg)+'</td>';
    h+='<td>'+fmt(s.obp)+'</td>';
    h+='<td>'+fmt(s.ops)+'</td>';
    h+='<td>'+s.ab+'</td><td>'+s.h+'</td><td>'+s.hr+'</td>';
    h+='<td>'+s.rbi+'</td><td>'+s.runs+'</td>';
    h+='<td>'+s.bb+'</td><td>'+s.so+'</td><td>'+s.sb+'</td></tr>';
  });
  h+='</table></div>';
  el.innerHTML=h;
}

/* ===== RENDER ALL ===== */
function renderSettings(){
  var el=document.getElementById('settingsTab');
  if(!el)return;
  var h='';
  h+='<div style="padding:8px 0">';
  h+='<div style="font-size:16px;font-weight:700;margin-bottom:16px">데이터 관리</div>';

  // 백업
  h+='<div style="background:#fff;border-radius:12px;padding:16px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,.06)">';
  h+='<div style="font-size:14px;font-weight:600;margin-bottom:4px">데이터 백업</div>';
  h+='<div style="font-size:12px;color:#888;margin-bottom:12px">선수 및 경기 데이터를 JSON 파일로 저장합니다.</div>';
  h+='<button class="modal-primary" style="width:100%" onclick="doBackup()">백업 파일 다운로드</button>';
  h+='</div>';

  // 복원
  h+='<div style="background:#fff;border-radius:12px;padding:16px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,.06)">';
  h+='<div style="font-size:14px;font-weight:600;margin-bottom:4px">데이터 복원</div>';
  h+='<div style="font-size:12px;color:#888;margin-bottom:12px">백업 파일을 선택하면 현재 데이터를 덮어씁니다.</div>';
  h+='<input type="file" id="restoreFile" accept=".json" style="display:none" onchange="doRestore(this)">';
  h+='<button class="modal-primary" style="width:100%;background:#43a047" onclick="document.getElementById(\'restoreFile\').click()">백업 파일 불러오기</button>';
  h+='</div>';

  // 데이터 초기화
  h+='<div style="background:#fff;border-radius:12px;padding:16px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,.06)">';
  h+='<div style="font-size:14px;font-weight:600;margin-bottom:4px;color:#c62828">데이터 초기화</div>';
  h+='<div style="font-size:12px;color:#888;margin-bottom:12px">모든 선수와 경기 데이터를 삭제합니다. 복구할 수 없습니다.</div>';
  h+='<button class="modal-del" style="width:100%" onclick="doResetAll()">전체 데이터 삭제</button>';
  h+='</div>';

  // 정보
  h+='<div style="text-align:center;font-size:11px;color:#bbb;margin-top:20px">';
  h+='선수 '+players.length+'명 · 경기 '+games.length+'경기 저장중';
  h+='</div>';

  h+='</div>';
  el.innerHTML=h;
}

function renderAll(){
  renderPlayers();renderGames();renderStats();renderSettings();
}
/* ===== FAB ===== */
document.getElementById('fabBtn').addEventListener('click',function(){
  if(currentTab==='players') openAddPlayer();
  else if(currentTab==='games') openAddGame();
  else switchTab('players');
});

/* ===== INIT ===== */
renderAll();
