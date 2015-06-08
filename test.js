/*! TW2 AutoFarm v1.0.2
 * https://github.com/jcauto/test/blob/master/
 * Rafael Mafra <relaxeaza.tw@gmail.com>
 * (c) 2014, 2015 MIT License
 */

// ==UserScript==
// @name         Tribal Wars 2 Auto Farm
// @namespace    https://github.com/jcauto/test/edit/master/
// @version      1.0.2
// @description  Farmador Automático - Ataques nas aldeias abandonadas ao redor de suas aldeias.
// @author       Relaxeaza
// @match        https://*.tribalwars2.com/game.php?world=*
// @grant        unsafeWindow
// @run-at document-end
// ==/UserScript==

function GameReady ( callback ) {
	var screenLoading = document.querySelector('#screen-loading');

	(function checkReady () {
		if ( screenLoading.classList.contains( 'hidden' ) ) {
			callback( unsafeWindow.define, unsafeWindow.require );
		} else {
			setTimeout( checkReady, 50 );
		}
	})();
}

GameReady(function ( define, require ) {

function makeVillageLink(a){return"getX"in a?"<button onclick=\"javascript:injector.get('mapService').jumpToVillage("+a.getX()+", "+a.getY()+')">'+a.getName()+" ("+a.getX()+"|"+a.getY()+")</button> ":"<button onclick=\"javascript:injector.get('mapService').jumpToVillage("+a.coords[0]+", "+a.coords[1]+')">'+a.name+" ("+a.coords[0]+"|"+a.coords[1]+")</button> "}var modelDataService=injector.get("modelDataService");define("framework/game",function(){var a={};return a.__defineGetter__("data",function(){return modelDataService.getGameData()}),a.__defineGetter__("units",function(){return a.data.getUnitsObject()}),a.__defineGetter__("unitsArray",function(){return a.data.getUnits()}),a.__defineGetter__("buildings",function(){return a.data.getBuildings()}),a.__defineGetter__("configs",function(){return modelDataService.getWorldConfig()}),a}),define("framework/player",function(){var a={};return a.__defineGetter__("groups",function(){return modelDataService.getPlayer().getGroupList()}),a.__defineGetter__("data",function(){return modelDataService.getPlayer().getSelectedCharacter()}),a.__defineGetter__("presets",function(){return modelDataService.getPlayer().getPresetList()}),a.__defineGetter__("currentVillage",function(){return modelDataService.getPlayer().getSelectedCharacter().getSelectedVillage()}),a.__defineGetter__("villages",function(){return modelDataService.getPlayer().getSelectedCharacter().data.villages}),a}),define("framework/server",["framework/util"],function(a){function b(b,c,d,f){"function"===a.type(d)&&(f=d,d=b),d=d||b,g[b]||(g[b]=[],e.on("msg",h[b]=function(a){a.type===d&&(g[b].shift().call(c,a.data),g[b].length||(e.removeListener("msg",h[b]),g[b]=null))})),g[b].push(f||function(){}),e.emit("msg",{type:b,data:c})}function c(a,b,c){return a in f?!1:(e.on("msg",f[a]=function(a){b===a.type&&c(a.data)}),!0)}function d(a){return a in f?(e.socket.removeListener("msg",f[a]),delete f[a],!0):!1}var e=io.connect("/"),f={},g={},h={};return{send:b,register:c,unregister:d}}),define("framework/village",["framework/villages","framework/server","framework/player","framework/util"],function(a,b,c,d){function e(a,d){"function"==typeof a&&(d=a,a=c.currentVillage.getId()),b.send("Village/getUnitInfo",{village_id:a},"Village/unitInfo",function(a){d(a)})}function f(a,d){"function"==typeof a&&(d=a,a=c.currentVillage.getId()),b.send("Command/getOwnCommands",{village_id:a},"Command/ownCommands",function(a){d(a.commands||[])})}function g(a,d){"function"==typeof a&&(d=a,a=c.currentVillage.getId()),b.send("Scouting/getInfo",{village_id:a},"Scouting/info",function(a){d(a)})}function h(e,f,g,j){return"object"===d.type(f)&&(j=g,g=f,e=c.currentVillage.getId()),i.test(e)?(e=e.split("|"),a.byCoords(e[0],e[1],function(a){h(a.id,f,g,j)})):i.test(f)?(f=f.split("|"),a.byCoords(f[0],f[1],function(a){h(e,a.id,g,j)})):void b.send("Command/sendCustomArmy",{start_village:e,target_village:f,type:g.type||"attack",units:g.units,catapult_target:g.catapult||"",officers:g.officers||{},icon:0},"Command/sent",j)}var i=/\d{1,3}\|\d{1,3}/;return{units:e,commands:f,scouting:g,command:h}}),define("framework/villages",["framework/server"],function(a){function b(b,c,e,f){var g=d[b+"|"+c],h=b-b%25-(f?25:0),i=c-c%25-(f?25:0);g?e(g):a.send("Map/getVillagesByArea",{x:h,y:i,width:f?50:25,height:f?50:25},"Map/villageData",function(){e(d[b+"|"+c])})}function c(){return d}var d={};return a.register("mapVillages","Map/villageData",function(a){var b,c;for(c=0;c<a.villages.length;c++)b=a.villages[c],d[b.x+"|"+b.y]=b}),{loaded:c,byCoords:b}}),define("framework/util",function(){function a(a,b,c){var d=k("#notification-controller"),e=d.find(".message"),f=d.find(".icons"),g=d.find(".box-border-dark");d.elems[0].className="success",e.html(a),e.css("height","auto"),f.css({width:"44px",height:"44px"}),g.css({width:"48px",height:"48px"}),b&&b in m&&(f.elems[0].className="icons "+m[b]),setTimeout(function(){d.css("top","-1000px")},c||2e3),d.css("top","80px")}function b(a,b,c,d){if("undefined"==typeof c){var e=a.split("|"),f=b.split("|");a=e[0],b=e[1],c=f[0],d=f[1]}return Math.round(100*Math.sqrt((+a-+b)*(+a-+b)+(+c-+d)*(+c-+d)))/100}function c(a){var b=require("framework/player");return b.data.getWorldId()+b.data.getId()+a}function d(){return(new Date).getTime()}function e(a){return toString.call(a).match(/\s([a-zA-Z]+)/)[1].toLowerCase()}function f(a){var b=a.length,c=e(a);return"function"===c||null!==a&&a===a.window?!1:1===a.nodeType&&b?!0:"array"===e||0===b||"number"==typeof b&&b>0&&b-1 in a}function g(a,b,c){var d=0,e=f(a);if(e)for(;d<a.length&&b.call(c||a[d],a[d],d)!==!1;d++);else for(d in a)if(b.call(c||a[d],d,a[d])===!1)break;return a}function h(a,b){"array"===e(a)?g(a,function(a){g(b,function(b,c){a.style[b]=c})}):g(b,function(b,c){a.style[b]=c})}function i(a){var b=!1;return g(require("framework/game").unitsArray,function(c){return a.indexOf(c.name)>-1?(b=c.name,!1):void 0}),b}function j(a,b,c){var d=(require("framework/server"),require("framework/villages")),f='<a class="btn-orange" href="#" style="padding:0 2px;width:auto;height:24px;line-height:23px"><span class="icon-20x20-__TYPE__"></span>__CONTENT__</a>';switch(b){case"village":"array"===e(a)&&d.byCoords(a[0],a[1],function(a){var d=k(f.replace("__TYPE__",b).replace("__CONTENT__",a.name+" ("+a.x+"|"+a.y+")")).bind("click",function(){injector.get("mapService").jumpToVillage(a.x,a.y)});c(d)})}}function k(a,b){return new l(a,b)}function l(a,b){if(this.elems=[],!a)return this;if("string"==typeof a)a=a.trim(),"<"===a.charAt(0)&&">"===a.charAt(a.length-1)?this.elems=l.buildFragment(a).childNodes:b?"string"==typeof b?(this.elems=Sizzle(b),this.find(a)):b.constructor&&b.constructor===l&&(this.elems=b.find(a).elems):this.elems=Sizzle(a);else if(a.nodeType)this.elems.push(a);else if(a.constructor&&a.constructor===l)this.elems=a.elems;else{var c=e(a),d=[];"array"===c?this.elems=a:/html/.test()&&(g(a,function(){d.push(this)}),this.elems=d)}return this.elems=l.makeArray(this.elems),this}var m={check:"icon-44x44-check",error:"icon-44x44-error",attention:"icon-44x44-attention",settings:"icon-44x44-settings-account",tribe:"icon-44x44-tribe"};return l.buildFragment=function(a){var b=document.createElement("template");return b.innerHTML=a,b.content},l.makeArray=function(a){return[].slice.call(a)},l.prototype.bind=function(a,b){return this.each(function(){this.addEventListener(a,b,!1)})},l.prototype.each=function(a){return g(this.elems,a),this},l.prototype.domManip=function(a,b){var c=this;return a?("string"==typeof a?a=l.buildFragment(a).childNodes:a.constructor===l?a=a.elems:f(a)||(a=k(a).elems),g(a,function(){b.call(c,this)}),this):this},l.prototype.append=function(a){return this.domManip(a,function(a){this.each(function(){this.appendChild(a)})})},l.prototype.appendTo=function(a){return a=k(a),this.each(function(){a.append(this)})},l.prototype.prepend=function(a){return this.domManip(a,function(a){this.each(function(){this.insertBefore(a,this.firstChild)})})},l.prototype.after=function(a){return this.domManip(a,function(a){this.each(function(){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})})},l.prototype.before=function(a){return this.domManip(a,function(a){this.each(function(){this.parentNode&&this.parentNode.insertBefore(a,this)})})},l.prototype.css=function(a,b){return this.each(function(c){void 0!==b?this.style[a]=b:g(a,function(a,b){c.style[a]=b})})},l.prototype.remove=function(){return this.each(function(){this.parentNode.removeChild(this)}),this.elems=[],this},l.prototype.find=function(a){var b=[];return this.each(function(){b=b.concat(Sizzle(a,this))}),k(b)},l.prototype.hide=function(){return this.each(function(){this.style.display="none"})},l.prototype.show=function(){return this.each(function(){this.style.display=""})},l.prototype.html=function(a){return this.each(function(){this.innerHTML=a})},l.prototype.addClass=function(a){return this.each(function(){this.classList.add(a)})},l.prototype.removeClass=function(a){return this.each(function(){this.classList.remove(a)})},{notif:a,distancexy:b,prefix:c,now:d,type:e,each:g,css:h,linkButton:j,dom:k,unitFrom:i}}),define("framework/ui/modal",["framework/ui/templates","framework/util"],function(a,b){return function(c){var d,e,f=[];return(d=document.getElementById(c.id))?b.dom(d):(d=b.dom(a.proccess("modal",{title:c.title,width:c.width||650,buttons:f.join(""),id:c.id})),d.find(".framework-ui-modal-close").bind("click",function(){d.hide()}),c.buttons&&c.buttons.length&&b.each(c.buttons,function(a,f){e=b.dom("<li>"),b.dom('<a class="btn-'+(a.color||"orange")+' btn-border" id="button-'+c.id+"-"+f+'">'+a.title+"</a>").bind("click",this.click).appendTo(e),e.appendTo(d.find(".framework-ui-modal-buttons"))}),d.find(".framework-ui-modal-content").append(c.content),d.applyScroll=function(){jsScrollbar(d.find(".win-main").elems[0])},d.appendTo("body"))}}),define("framework/ui/icon",["framework/ui/templates","framework/util"],function(a,b){var c={};return function(d){if(d.id in c)return c[d.id];var e=b.dom(a.proccess("icon",{content:d.id,color:d.color||"red"})).css({height:(d.size||26)+"px",marginLeft:"22px",marginBottom:"10px",position:"relative"}).bind("click",d.click).appendTo("#interface-chat");return c[d.id]=e,e}}),define("framework/ui/interface",["framework/ui/templates","framework/ui/interface/input","framework/ui/icon","framework/ui/modal","framework/util"],function(a,b,c,d,e){function f(a){for(var b,c,d=[],e=a.length-1;e>=0;e--)b=a[e].split("="),c=b[1],b=b[0],d.push(b+(c?'="'+c+'"':""));return d.join(" ")}var g={};return function(h){if(h.id in g)return g[h.id];var i,j,k=e.dom(a.setting.replace("{id}","framework-ui-interface-"+h.id).replace("{header}",h.header));for(i in h.pluginSettings)h.formats[i]&&(j=h.formats[i],j="string"==typeof j?[j]:[j.shift(),f(j)],b[j[0]]&&(j=b[j[0]](h,i,h.pluginSettings[i],j[1]),k.find(".framework-ui-setting-content").append(j)));g[h.id]=k;var l=d({id:h.id,title:h.title,content:k,buttons:h.buttons});return c({id:h.id,color:h.iconColor,click:function(){l.show(),l.applyScroll()}}),l}}),define("framework/ui/interface/input",["framework/util","framework/ui/templates"],function(a,b){function c(c){return function(d,e,f){var g,h="";return a.each(c,function(a){h+=b.proccess("interface/format/units/unit",{unit:a,amount:f[a]||0})}),g=a.dom(b.proccess("interface/format/units",{name:d.i18n[e],html:h})),g.find(".input-border").css({height:"35px",width:"70px",fontSize:"15px",verticalAlign:"top",marginLeft:"3px"}),g}}var d={};return d.addFormat=function(a,b){d[a]=b},d.addFormat("text",function(a,c,d,e){return Array.isArray(d)&&(d=d.join(" ")),b.proccess("interface/format/text",{name:a.i18n[c],item:c,value:d,attrs:e})}),d.addFormat("select",function(a,c,d){return b.proccess("interface/format/select",{name:a.i18n[c],item:c,value:d?" checked ":" "})}),d.addFormat("units-farm",c(["spear","sword","axe","archer","light_cavalry","mounted_archer","heavy_cavalry","doppelsoldner","knight"])),d.addFormat("units",c(["spear","sword","axe","archer","light_cavalry","mounted_archer","heavy_cavalry","ram","catapult","doppelsoldner","trebuchet","snob","knight"])),d.addFormat("units-recruit",c(["spear","sword","axe","archer","light_cavalry","mounted_archer","heavy_cavalry","ram","catapult","doppelsoldner","trebuchet"])),d}),define("framework/ui/interface/extractor",function(){return function(a){var b,c,d,e,f=document.getElementById("framework-ui-interface-"+a),g={};return Sizzle("[settingInterfaceGroup]",f).forEach(function(a){e=a.getAttribute("settingInterfaceItem"),b=a.getAttribute("settingInterfaceGroup").split("-"),c=b[0],d=b[1],d?(g[c]=g[c]||[],"undefined"==typeof g[c][d]&&g[c].push({}),g[c][d][e]=a.value):(g[c]=g[c]||{},g[c][e]=a.value)}),Sizzle("[settingInterfaceItem]",f).forEach(function(a){a.getAttribute("settingInterfaceGroup")||(g[a.getAttribute("settingInterfaceItem")]="checkbox"===a.type?a.checked:a.value)}),g}}),define("framework/ui/templates",function(){var a={},b=/\{(\w+)\}/g;return a.setTemplate=function(b,c){a[b]=c},a.proccess=function(c,d,e){e=e||{};var f="function"==typeof d?d:function(a,b){return void 0!==e[b]?e[b]:void 0!==d[b]?d[b]:b};return a[c].replace(b,f)},a.setTemplate("modal",'<div class="twx-modal interfaceModal" id="framework-ui-modal-{id}" style="display:none"><div class="outer-wrapper"><div class="middle-wrapper"><div class="inner-wrapper" style="width:{width}px"><div class="win-content"><header class="win-head"><h3>{title}</h3><ul class="list-btn sprite"><li><a href="#" class="btn-red icon-26x26-close framework-ui-modal-close"></a></li></ul></header><div class="win-main"><div class="box-paper" style="max-height:299px"><div class="scroll-wrap framework-ui-modal-content"></div></div></div><footer class="win-foot sprite-fill"><ul class="list-btn list-center framework-ui-modal-buttons">{buttons}</ul></footer></div><div class="window-modal-bg" style="display:block"></div></div></div></div></div>'),a.setTemplate("setting",'<form id="{id}"><table class="tbl-border-light tbl-striped"><colgroup><col width="200px"><col width="200px"></colgroup><thead><tr><th colspan="2" style="text-align:center">{header}</th></tr></thead><tbody class="framework-ui-setting-content"></tbody></table></form>'),a.setTemplate("icon",'<div class="framework-ui-icon btn-border chat-wrapper btn-{color}"><div class="top-left"></div><div class="top-right"></div><div class="middle-top"></div><div class="middle-bottom"></div><div class="middle-left"></div><div class="middle-right"></div><div class="bottom-left"></div><div class="bottom-right"></div><div class="content">{content}</div></div>'),a.setTemplate("interface/format/units",'<td colspan="2"><table><colgroup><col width="200px"><col width="200px"></colgroup><thead><tr><th colspan="2" style="text-align:center">{name}</th></tr></thead><tbody>{html}<tbody></table></td>'),a.setTemplate("interface/format/units/unit",'<tr><td><span class="icon-34x34-unit-{unit}" style="vertical-align:top"></span></td><td><input type="text" class="input-border" settingInterfaceGroup="units" settingInterfaceItem="{unit}" value="{amount}"></td></tr>'),a.setTemplate("interface/format/text",'<tr><td>{name}</td><td><input type="text" class="input-border" style="height:30px;font-size:15px" settingInterfaceItem="{item}" value="{value}" {attrs}></td></tr>'),a.setTemplate("interface/format/select",'<tr><td>{name}</td><td><input type="checkbox"{value} style="height:30px;font-size:15px" settingInterfaceItem="{item}"></td></tr>'),a}),define("framework/getVillages",["framework/server","framework/villageSwitch"],function(a,b){function c(b,c){c=d(c),a.send("Overview/getVillages",{count:1e3,offset:0,sorting:"",reverse:0,groups:c},"Overview/villages",function(a){b(a.villages)})}function d(a){if("number"==typeof a)return[a];if(!a)return[];var b,c,d,e=modelDataService.getGroupList().data.groups,f=[];for(c=0;c<a.length;c++)if(b=a[c],"number"!=typeof b)for(d in e)e[d].name===b&&f.push(Number(d));else f.push(b);return f}function e(a){var b={groups:[],filter:function(){return!0}};for(var c in b)c in a||(a[c]=b[c]);return a}var f=/(.)\s*([\d]+)/,g={name:function(a,b){return a.constructor===RegExp?a.test(b.village_name):b.village_name===a},order:function(a,b){return"string"==typeof a?b.preceptory_order===a:-1!==a.indexOf(b.preceptory_order)},points:function(a,b){var c=a.match(f),d=c[1],e=Number(c[2]),g=!0;switch(d){case">":g=b.points>e;break;case"<":g=b.points<e;break;case"=":g=b.points==e}return g},scouts:function(a,b){var c=a.match(f),d=c[1],e=Number(c[2]),g=!0;switch(d){case">":g=b.scouts>e;break;case"<":g=b.scouts<e;break;case"=":g=b.scouts==e}return g}};return function(a,d){"function"==typeof a&&(d=a,a={}),a=e(a),c(function(c){var e,f,h,i,j,k=[];for(j=0;j<c.length&&(e=c[j],i=!0,a.filter(e)===!0);j++){for(f in a)if(f in g&&(h=a[f],!g[f](h,e))){i=!1;break}i&&k.push(e)}d(b(k))},a.groups)}}),define("framework/villageSwitch",[],function(){function a(a,b){return b=b||{},this.villages=a,this.index=b.index||0,this.completeCicle=b.completeCicle||function(){},this}return a.prototype.get=function(){return this.villages[this.index]},a.prototype.next=function(){return this.index>=this.villages.length-1?(this.index=0,this.completeCicle()):this.index++,this},a.prototype.each=function(a){for(var b=0;b<this.villages.length&&a(this.villages[b])!==!1;b++);return this},a.prototype.setCompleteCicle=function(a){return this.completeCicle=a,this},function(b,c){return new a(b,c)}}),i18n="undefined"==typeof i18n?{}:i18n,i18n["en-us"]={title:"Auto Farm",header:"Configurations",settingsLabel:{radius:"Max Distance",interval:"interval Between Attacks (seconds)",ignoreVillages:"Ignore Own Villages (Coords)",ignoreFarms:"Ignore Targets (coords)",models:"Unit Models"},buttons:{save:"Save",start:"Start",pause:"Pause",log:"Registers"},notif:{save:"The data has been saved!",start:"Starting attacks!",paused:"Paused!"},logs:{allUnitsSent:"All units of all villages were sent, awaiting return.",limitAttacksWait:"Command limit rechead by village, waiting for the next commando returns.",limitAttacksNext:"Command limit reached by village, switching to the next village.",attack:"ataca",noUnitsWait:"No units, awaiting return.",noUnitsStop:"Without units and commands. Farm stopped!",noUnits:"No units in the village.",limitAttackWait:"Limit of 50 attacks reached.",started:"Farm started!",paused:"Farm paused!"},logUI:{title:"Auto Farm - Registers"}},i18n="undefined"==typeof i18n?{}:i18n,i18n["pt-br"]=i18n["pt-pt"]={title:"Auto Farm",header:"Configurações",settingsLabel:{radius:"Distáncia Máxima",interval:"Intervalo (segundos)",ignoreVillages:"Ignorar Próprias Aldeias (Coords)",ignoreFarms:"Ignorar Alvos (Coords)",models:"Modelos de Unidades"},buttons:{save:"Salvar",start:"Iniciar",pause:"Pausar",log:"Registros"},notif:{save:"Os dados foram salvos!",start:"Iniciando ataques!",paused:"Pausado!"},logs:{allUnitsSent:"Todas unidades de todas aldeias foram enviadas, aguardando retorno.",limitAttacksWait:"Limite de comandos por aldeia atingido, esperando o próximo comando retornar.",limitAttacksNext:"Limite de comandos por aldeia atingido, trocando para a próxima aldeia.",attack:"ataca",noUnitsWait:"Sem unidades, esperando retorno.",noUnitsStop:"Sem unidades e comandos. Farm parado!",noUnits:"Sem unidades na aldeia.",limitAttackWait:"Limite de 50 ataques atingido.",started:"Farmador iniciado!",paused:"Farmador pausado!"},logUI:{title:"Auto Farm - Registros"}};var __debug=!0,userLanguage=window.navigator.userLanguage||window.navigator.language||"en-US",$templates=require("framework/ui/templates"),$village=require("framework/village"),$villages=require("framework/villages"),$server=require("framework/server"),$util=require("framework/util"),$interface=require("framework/ui/interface"),$modal=require("framework/ui/modal"),$extractor=require("framework/ui/interface/extractor"),AutoFarm={};AutoFarm.defaults=AutoFarm.settings={radius:7,interval:10,ignoreVillages:[],ignoreFarms:[],models:[{sword:70,spear:0},{spear:70,axe:0},{axe:70,spear:0},{archer:70,spear:0},{light_cavalry:70,spear:0},{mounted_archer:70,spear:0},{heavy_cavalry:70,spear:0}]},AutoFarm.player=modelDataService.getSelectedCharacter(),AutoFarm.player.villages=AutoFarm.player.getVillages(),AutoFarm.is={},AutoFarm.is.paused=!0,AutoFarm.is.uniqueVillage=1===AutoFarm.player.villages.length,AutoFarm.selectedVillage=AutoFarm.player.villages[0],AutoFarm.targetList={},AutoFarm.villageCommandsBack={},AutoFarm.callbacks={},AutoFarm.command={},AutoFarm.simulate={},AutoFarm.i18n=i18n[userLanguage.toLowerCase()],AutoFarm.setSettings=function(a){AutoFarm.settings={},("radius"in a&&a.radius!=AutoFarm.settings.radius||"ignoreFarms"in a&&a.ignoreFarms!=AutoFarm.settings.ignoreFarms)&&(AutoFarm.targetList={});for(var b in AutoFarm.defaults)AutoFarm.settings[b]=b in a?a[b]:AutoFarm.defaults[b]},AutoFarm.getSettings=function(){return AutoFarm.settings},AutoFarm.start=function(){AutoFarm.is.paused=!1,AutoFarm.command.begin()},AutoFarm.pause=function(){__debug&&console.warn("method : command.stop"),clearTimeout(AutoFarm.timerId),AutoFarm.is.paused=!0},$templates.setTemplate("autofarm/format/unitModels/unit",'<td colspan="2"><table><colgroup><col width="200px"><col width="200px"></colgroup><thead><tr><th colspan="2" style="text-align:center">{name}</th></tr></thead><tbody>{html}<tbody></table></td>'),$templates.setTemplate("autofarm/format/unitModels/unit",'<div style="margin-right:3px;display:inline"><span class="unit-model icon-34x34-unit-{unit}" style="vertical-align:top"></span><input type="text" class="input-border" style="height:35px;width:50px;font-size:15px;vertical-align:top;margin-left:3px" settingInterfaceItem="{unit}" settingInterfaceGroup="models-{index}" value="{amount}"></div>'),$templates.setTemplate("autofarm/format/unitModels/unitTr",'<tr><td colspan="2" style="text-align:center">{units}</td></tr>'),$templates.setTemplate("autofarm/format/unitModels",'<tr><td colspan="2"><table class="tbl-border-light tbl-striped"><colgroup><col width="125px"><col width="125px"></colgroup><thead><tr><th colspan="2">{name}</th></tr></thead><tbody>{html}</tbody></table></tr></td>'),$templates.setTemplate("autofarm/log",'<table class="tbl-border-light tbl-striped"><colgroup><col width="130px"></colgroup><tbody></tbody></table>'),AutoFarm.callbacks.noTargets=function(){__debug&&console.log("callback : noTargets")},AutoFarm.callbacks.nextVillage=function(){__debug&&console.log("callback : nextVillage")},AutoFarm.callbacks.villageNoUnits=function(){__debug&&console.log("callback : villageNoUnits")},AutoFarm.callbacks.allVillageNoUnits=function(){__debug&&console.log("callback : allVillageNoUnits")},AutoFarm.callbacks.noUnitsNoCommands=function(){__debug&&console.log("callback : noUnitsNoCommands")},AutoFarm.callbacks.nextTarget=function(){__debug&&console.log("callback : nextTarget")},AutoFarm.callbacks.commandLimit=function(){__debug&&console.log("callback : nextTarget")},AutoFarm.callbacks.sendCommand=function(){__debug&&console.log("callback : sendCommand")},AutoFarm.prepareSystem=function(a,b){return __debug&&console.warn("method : prepareSystem"),b=b||0,-1!==AutoFarm.settings.ignoreVillages.indexOf(AutoFarm.selectedVillage.getX()+"|"+AutoFarm.selectedVillage.getY())?(AutoFarm.nextVillage(),void AutoFarm.prepareSystem(a,b)):AutoFarm.updateTargets(function(){if(AutoFarm.targetList[AutoFarm.selectedVillage.getId()].length)a&&a();else{if(b===AutoFarm.player.villages.length)return AutoFarm.callbacks.noTargets();AutoFarm.nextVillage(),AutoFarm.prepareSystem(a,++b)}})},AutoFarm.updateTargets=function(a){__debug&&console.warn("method : updateTargets");var b=AutoFarm.selectedVillage.getX(),c=AutoFarm.selectedVillage.getY(),d=AutoFarm.selectedVillage.getId();return d in AutoFarm.targetList?a():void $villages.byCoords(b,c,function(){var e,f,g,h,i=b+"|"+c,j=$villages.loaded(),k=[];for(g in j)i===g||j[g].character_id||(f=j[g].name,h=j[g].id,g=g.split("|"),e=$util.distancexy(b,g[0],c,g[1]),e<=AutoFarm.settings.radius&&k.push({coords:g,distance:e,id:h,name:f}));return k.length?(AutoFarm.targetList[d]=k.sort(function(a,b){return a.distance-b.distance}),AutoFarm.targetList[d].index=0,AutoFarm.selectedTarget=AutoFarm.targetList[d][0],void a()):(AutoFarm.nextVillage()?AutoFarm.updateTargets(a):AutoFarm.callbacks.noTargets(),!1)},!0)},AutoFarm.nextVillage=function(){if(__debug&&console.warn("method : nextVillage"),AutoFarm.is.uniqueVillage)return!1;var a=AutoFarm.player.villages.indexOf(AutoFarm.selectedVillage)+1;return"undefined"!=typeof AutoFarm.player.villages[a]?AutoFarm.selectedVillage=AutoFarm.player.villages[a]:AutoFarm.selectedVillage=AutoFarm.player.villages[0],-1!==AutoFarm.settings.ignoreVillages.indexOf(AutoFarm.selectedVillage.getX()+"|"+AutoFarm.selectedVillage.getY())?AutoFarm.nextVillage():(AutoFarm.callbacks.nextVillage(),!0)},AutoFarm.nextTarget=function(){__debug&&console.warn("method : nextTarget");var a=AutoFarm.selectedVillage.getId();if(!(a in AutoFarm.targetList))return AutoFarm.updateTargets(AutoFarm.nextTarget);var b=++AutoFarm.targetList[a].index;return"undefined"!=typeof AutoFarm.targetList[a][b]?AutoFarm.selectedTarget=AutoFarm.targetList[a][b]:(AutoFarm.selectedTarget=AutoFarm.targetList[a][0],AutoFarm.targetList[a].index=0),-1!==AutoFarm.settings.ignoreFarms.indexOf(AutoFarm.selectedTarget.xy)?AutoFarm.nextTarget():void AutoFarm.callbacks.nextTarget()},AutoFarm.getVillageCommands=function(a){__debug&&console.warn("method : getVillageCommands"),$village.commands(AutoFarm.selectedVillage.getId(),function(b){a(b)})},AutoFarm.getVillageUnits=function(a){__debug&&console.warn("method : getVillageUnits"),$village.units(AutoFarm.selectedVillage.getId(),function(b){a(b.available_units)})},AutoFarm.selectModel=function(a){__debug&&console.warn("method : selectModel");var b,c,d;for(d=0;d<AutoFarm.settings.models.length;d++)if(b=AutoFarm.settings.models[d],!AutoFarm.isUndefinedModel(b)){for(c in a)if(a[c].in_town<b[c]){b=!1;break}if(b)return b}return!1},AutoFarm.isUndefinedModel=function(a){__debug&&console.warn("method : isUndefinedModel");for(var b in a)if(parseInt(a[b],10)>0)return!1;return!0},AutoFarm.getNeabyCommand=function(a){__debug&&console.warn("method : getNeabyCommand");for(var b,c,d,e=(new Date).getTime()/1e3,f=[],g=0;g<a.length;g++)d=a[g],("support"!==d.type||"forward"!==d.direction)&&(b=d.time_completed-d.time_start,c=d.time_completed-e,"forward"===d.direction&&(c+=b),f.push(c));return f.sort(function(a,b){return a-b}),1e3*f[0]+5e3},AutoFarm.nextVillageUnits=function(){__debug&&console.warn("method : nextVillageUnits");var a=[];for(var b in AutoFarm.villageCommandsBack)a.push({vid:b,time:AutoFarm.villageCommandsBack[b]});return a.sort(function(a,b){return a.time-b.time}),a[0]},AutoFarm.addVillageCommandsBack=function(a){__debug&&console.warn("method : addVillageCommandsBack");var b=AutoFarm.selectedVillage.getId();if(a.length){var c=AutoFarm.getNeabyCommand(a);AutoFarm.villageCommandsBack[b]=c,setTimeout(function(){delete AutoFarm.villageCommandsBack[b]},c)}else AutoFarm.villageCommandsBack[b]=!1;return!0},AutoFarm.selectVillage=function(a){__debug&&console.warn("method : selectVillage");for(var b=0;b<AutoFarm.player.villages.length;b++)if(AutoFarm.player.villages[b].getId()===a)return AutoFarm.selectedVillage=AutoFarm.player.villages[b],!0;return!1},AutoFarm.command.loopNoUnits=function(a){if(__debug&&console.warn("method : command.loopNoUnits"),a===AutoFarm.player.villages.length){var b=AutoFarm.nextVillageUnits();return setTimeout(function(){AutoFarm.selectVillage(b.vid),AutoFarm.command.begin()},b.time),!0}return!1},AutoFarm.command.begin=function(a){return __debug&&console.warn("method : command.beginCommand"),a=a||0,AutoFarm.command.loopNoUnits(a)?AutoFarm.callbacks.allVillageNoUnits():AutoFarm.is.paused?!1:AutoFarm.selectedVillage.getId()in AutoFarm.villageCommandsBack?(AutoFarm.nextVillage(),AutoFarm.updateTargets(function(){AutoFarm.command.begin(++a)}),!1):void AutoFarm.getVillageCommands(function(a){return a.length>=50?(AutoFarm.addVillageCommandsBack(a),AutoFarm.command.commandLimit(a)):void AutoFarm.getVillageUnits(function(b){var c=AutoFarm.selectModel(b);c?AutoFarm.simulate.mapFactor(function(){AutoFarm.command.send(c,function(){AutoFarm.callbacks.sendCommand(AutoFarm.selectedVillage,AutoFarm.selectedTarget),AutoFarm.nextTarget(),AutoFarm.timerId=setTimeout(function(){AutoFarm.command.begin()},1e3*AutoFarm.settings.interval)})}):(AutoFarm.addVillageCommandsBack(a),AutoFarm.callbacks.villageNoUnits(AutoFarm.selectedVillage,AutoFarm.is.uniqueVillage),AutoFarm.command.villageNoUnits(a))})})},AutoFarm.command.commandLimit=function(a){if(__debug&&console.warn("method : command.commandLimit"),AutoFarm.callbacks.commandLimit(AutoFarm.selectedVillage),AutoFarm.is.uniqueVillage){var b=AutoFarm.getNeabyCommand(a);AutoFarm.timerId=setTimeout(function(){AutoFarm.command.begin()},b)}else AutoFarm.nextVillage(),AutoFarm.updateTargets(function(){AutoFarm.command.begin()})},AutoFarm.command.villageNoUnits=function(a){if(__debug&&console.warn("method : command.villageNoUnits"),AutoFarm.is.uniqueVillage){if(!a.length)return AutoFarm.callbacks.noUnitsNoCommands(AutoFarm.selectedVillage),!1;var b=AutoFarm.getNeabyCommand(a);b?AutoFarm.timerId=setTimeout(function(){AutoFarm.command.begin()},b):AutoFarm.callbacks.noUnitsNoCommands(AutoFarm.selectedVillage)}else AutoFarm.nextVillage(),AutoFarm.updateTargets(function(){AutoFarm.command.begin()})},AutoFarm.command.send=function(a,b){__debug&&console.warn("method : command.send"),$village.command(AutoFarm.selectedVillage.getId(),AutoFarm.selectedTarget.id,{units:a},b)},AutoFarm.simulate.mapFactor=function(a){__debug&&console.warn("method : simulate.mapFactor"),$server.send("Map/getVillageDetails",{my_village_id:AutoFarm.selectedVillage.getId(),num_reports:0,village_id:AutoFarm.selectedTarget.id},"Map/villageDetails",function(){$server.send("Command/getAttackingFactor",{target_id:AutoFarm.selectedTarget.id},"Command/attackingFactor",a)})};var $interfaceInput=require("framework/ui/interface/input");$interfaceInput.addFormat("unit-models",function(a,b,c){var d,e,f=["spear","sword","axe","archer","light_cavalry","mounted_archer","heavy_cavalry","doppelsoldner","knight"],g="";return $util.each(c,function(a,b){d="",$util.each(a,function(a,c){d+=$templates.proccess("autofarm/format/unitModels/unit",{unit:a,index:b,amount:c})}),g+=$templates.proccess("autofarm/format/unitModels/unitTr",{units:d})}),e=$util.dom($templates.proccess("autofarm/format/unitModels",{name:a.i18n[b],html:g})),e.find(".unit-model").bind("click",function(){var a=this.className.match(/unit-(\w+)/)[1],b=f.indexOf(a)+1,c=f[b]||f[0];this.nextSibling.setAttribute("settingInterfaceItem",c),this.className="icon-34x34-unit-"+c}),e});var AutoFarmLog=$modal({id:"autofarm-log",title:AutoFarm.i18n.logUI.title,content:$templates["autofarm/log"]});AutoFarmLog.add=function(a){var b=$util.dom("<tr><td>"+(new Date).toLocaleString()+"</td><td>"+a+"</td></tr>");AutoFarmLog.find("tbody").prepend(b),AutoFarmLog.applyScroll()},AutoFarm.setSettings(JSON.parse(localStorage[$util.prefix("autofarm")]||"{}")),AutoFarm.ui=$interface({id:"AutoFarm",iconColor:"green",title:AutoFarm.i18n.title,header:AutoFarm.i18n.header,pluginSettings:AutoFarm.getSettings(),i18n:AutoFarm.i18n.settingsLabel,formats:{radius:"text",interval:"text",ignoreVillages:["text","placeholder=xxx|yyy xxx|yyy"],ignoreFarms:["text","placeholder=xxx|yyy xxx|yyy"],abandonedOnly:"select",models:"unit-models"},buttons:[{title:AutoFarm.i18n.buttons.save,color:"green",click:function(){AutoFarmLog.add(AutoFarm.i18n.notif.save),AutoFarm.setSettings($extractor("autofarm")),localStorage[$util.prefix("autofarm")]=JSON.stringify(AutoFarm.getSettings()),$util.notif(AutoFarm.i18n.notif.save,"settings",2e3)}},{title:AutoFarm.i18n.buttons.start,click:function(){AutoFarm.is.paused?(AutoFarm.start(),this.innerHTML=AutoFarm.i18n.buttons.pause,$util.notif(AutoFarm.i18n.notif.start,"check",2e3)):(AutoFarm.pause(),this.innerHTML=AutoFarm.i18n.buttons.start,$util.notif(AutoFarm.i18n.notif.paused,"attention",2e3))}},{title:AutoFarm.i18n.buttons.log,click:function(){AutoFarmLog.show(),AutoFarmLog.applyScroll(),AutoFarm.ui.hide()}}]}),AutoFarm.prepareSystem(),AutoFarm.callbacks.sendCommand=function(a,b){AutoFarmLog.add(makeVillageLink(a)+" ataca "+makeVillageLink(b))},AutoFarm.callbacks.commandLimit=function(a){AutoFarmLog.add(makeVillageLink(a)+AutoFarm.i18n.logs.limitAttackWait)},AutoFarm.callbacks.villageNoUnits=function(a,b){AutoFarmLog.add(b?makeVillageLink(a)+AutoFarm.i18n.logs.noUnitsWait:makeVillageLink(a)+AutoFarm.i18n.logs.noUnits)},AutoFarm.callbacks.noUnitsNoCommands=function(a){AutoFarmLog.add(AutoFarm.i18n.logs.noUnitsStop)};

});
