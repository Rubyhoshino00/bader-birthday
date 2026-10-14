const $ = id => document.getElementById(id);
const landing=$('landing'), story=$('story'), finale=$('finale');
const chapters=[
 {number:'PROLOGUE',name:'THE LETTER UNDER THE MOON',symbol:'☾',caption:'A message from somewhere beyond midnight',speaker:'THE NARRATOR',text:'On the quietest night of the year, a small envelope appeared beneath a silver moon.\\nIt had no address. Just one name, written carefully on the front: Bader.',choices:[['Pick up the envelope ✉','envelope'],['Look up at the strange, bright moon ☾','moon']]},
 {number:'CHAPTER 01',name:'A SKY FULL OF POSSIBILITIES',symbol:'✦',caption:'Every star is a tiny beginning',speaker:'THE NARRATOR',text:'Inside was a note: “You have reached a new chapter. The map is not complete yet — and that is the beautiful part.”\\nA few stars shimmered above the rooftops, as if the night itself was waiting for your answer.',choices:[['I want to chase a dream I have kept for too long.','dream'],['I want more calm, laughter, and good days.','calm'],['I want to discover something unexpected.','wonder']]},
 {number:'CHAPTER 02',name:'THE THINGS THAT COUNT',symbol:'♧',caption:'The little things are not little',speaker:'A FRIENDLY VOICE',text:'A familiar voice drifted through the night.\\n“Not every important moment looks like a victory. Sometimes it is getting through a difficult day. Sometimes it is trying again. Sometimes it is letting yourself rest.”',choices:[['Remember that progress can be quiet.','progress'],['Give myself permission to rest, too.','rest']]},
 {number:'CHAPTER 03',name:'A MESSAGE FROM MIRA',symbol:'♡',caption:'Some words travel farther than stars',speaker:'MIRA',text:'Okay, birthday boy… the mystery is almost solved. ♡\\nI made this little corner of the internet for you because I wanted your birthday to have something a bit different: a tiny story, a few choices, and a reminder that I’m rooting for you.',choices:[['“You made an entire story?”','story'],['“Okay, what is the final message?”','message']]},
 {number:'CHAPTER 04',name:'THE WISH YOU CARRY',symbol:'☄',caption:'The future is a sky, not a deadline',speaker:'MIRA',text:'Before the last page, choose a wish to carry into your twenty-fifth year. There is no wrong answer — and you can always change your mind.',choices:[['More courage for the dreams ahead ✨','courage'],['More peace and good people around me 🌙','peace'],['More adventures and stories to tell 🎮','adventure']]},
 {number:'EPILOGUE',name:'ONE LAST STAR',symbol:'★',caption:'A little light, just for you',speaker:'THE NARRATOR',text:'The envelope folded itself into a tiny paper star. On its final side, a last line appeared:\\n“Whatever comes next, you do not have to solve the whole story today. Just keep turning the pages.”',choices:[['Open the birthday wish ♡','finale']]}
];
let current=0,ambient=false,ctx=null,osc=null,gain=null;
function cleanText(s){return s.replace(/\\n/g,'\n')}
function renderChapter(){
 const c=chapters[current];
 $('chapterNumber').textContent=c.number;$('chapterName').textContent=c.name;$('figure').textContent=c.symbol;$('sceneArtLabel').textContent=c.caption;$('speaker').textContent=c.speaker;$('dialogueText').textContent=cleanText(c.text);
 $('choiceList').innerHTML='';$('continueBtn').classList.add('hidden');
 c.choices.forEach(([label,key])=>{const b=document.createElement('button');b.className='choice';b.textContent=label;b.addEventListener('click',()=>pick(key));$('choiceList').appendChild(b)});
 $('progressText').textContent=String(current+1).padStart(2,'0')+' / '+String(chapters.length).padStart(2,'0');
 $('progressFill').style.width=((current+1)/chapters.length*100)+'%';
}
function pick(key){
 if(key==='finale'){story.classList.add('hidden');finale.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});return}
 const answers={
 envelope:'The paper smelled faintly of rain and old books. Inside, in neat handwriting, were the words: “For the person whose next chapter deserves a little celebration.”',
 moon:'The moon seemed to smile — or maybe it was just the light. Beneath it, the city looked full of doors that had not been opened yet.',
 dream:'Then may you find the patience to keep going, the right opportunities at the right time, and the confidence to take that first step.',
 calm:'Then may this year bring softer days, honest laughter, restful nights, and people who make life feel lighter.',
 wonder:'Then may curiosity lead you to unexpected places, new favourite things, and memories you will be glad you made.',
 progress:'Exactly. Small steps still move you forward. You deserve credit for the effort, including the effort nobody else sees.',
 rest:'You do not have to earn rest by being exhausted. Take breaks, breathe, and remember that looking after yourself is part of the journey.',
 story:'Every single page — well, a tiny website, at least. I hope it makes you smile. Happy almost-new-chapter, Bader. ♡',
 message:'Happy 25th birthday, Bader. I hope life is kind to you, and I hope you never run out of reasons to look forward to tomorrow.',
 courage:'May you find courage without having to be fearless, and chances that meet you halfway. Your dreams deserve a real attempt.',
 peace:'May your days hold more calm than worry, more genuine laughter than pressure, and people who appreciate the person you are.',
 adventure:'May your next year be full of new places, ridiculous little stories, good surprises, and save points whenever you need them.'
 };
 $('dialogueText').textContent=answers[key]||'The next page is waiting for you.';$('choiceList').innerHTML='';$('continueBtn').classList.remove('hidden');
 $('continueBtn').onclick=()=>{current++;if(current<chapters.length)renderChapter();else{story.classList.add('hidden');finale.classList.remove('hidden')}};
}
function start(){current=0;landing.classList.add('hidden');finale.classList.add('hidden');story.classList.remove('hidden');renderChapter();window.scrollTo({top:0,behavior:'smooth'})}
$('beginBtn').addEventListener('click',start);
$('homeLink').addEventListener('click',e=>{e.preventDefault();landing.classList.remove('hidden');story.classList.add('hidden');finale.classList.add('hidden');window.scrollTo({top:0,behavior:'smooth'})});
$('replayBtn').addEventListener('click',start);
$('restartSmall').addEventListener('click',start);
$('copyLinkBtn').addEventListener('click',async()=>{const msg='Happy 25th Birthday, Bader! ♡ I made you a little story for your special day. May your next chapter bring you peace, good people, and big dreams. — Mira';try{await navigator.clipboard.writeText(msg);$('copyFeedback').textContent='Copied! Send it with your birthday surprise ♡'}catch(e){$('copyFeedback').textContent=msg}});
$('musicToggle').addEventListener('click',async()=>{ambient=!ambient;$('musicLabel').textContent=ambient?'Sound on':'Sound off';if(ambient){try{ctx=ctx||new(window.AudioContext||window.webkitAudioContext)();await ctx.resume();gain=ctx.createGain();gain.gain.value=.012;osc=ctx.createOscillator();osc.type='sine';osc.frequency.value=174.61;osc.connect(gain);gain.connect(ctx.destination);osc.start()}catch(e){$('musicLabel').textContent='Unavailable'}}else if(osc){try{gain.gain.setTargetAtTime(0,ctx.currentTime,.15);osc.stop(ctx.currentTime+.6)}catch(e){}osc=null;gain=null}});
