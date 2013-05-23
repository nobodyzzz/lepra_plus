function randInt(max) { 
    return Number((Math.floor(Math.random()*(max-1)))); 
  } 

$(function(){
		var formNode = document.getElementById('options-form');   
		var clickBehavior = getClickBehavior();
		var navigateOptions = getCommentNavigationOptions(); 
		var refreshIterval = getRefreshInterval();
		var refreshIntervalNode = formNode['refresh-interval'];
		var showOnBadgeNode = formNode['show-on-badge'];
		var showOnBadge = getShowOnBadge();
		var textareaShortcuts = getTextareaShortcuts();
		var defaultFontSize = localStorage["fontSize"] || "medium";
		var fontSizes = ["xx-small", "x-small", "small", "medium", "large" ,"x-large", "xx-large"];
		var fontSizeIndex = fontSizes.indexOf(defaultFontSize);
    var greetings = [
      '"15M 7 on 1 Comp StOmP No AiR NO ZeRG RUSH!!1!" — %username% 1597.',
      '"An nescis, mi fili, quantilla sapientia mundus regatur?"',
      '"Who in the world has Chinese food for breakfast?" "The Chinese?"',
      ' %username%, %username%...',
      '*** STOP (0x0000000A, 0x0000000A, 0x0000000A, 0x0000000A) IRQ_NOT_LESS_OR_EQUAL, %username%.',
      'Artichokes play football. Purple monkeys dance invisibly.',
      'Bite my shiny metal ass, %username%.',
      'Cпасибо, что зашли, %username%.',
      'Don\'t panic, %username%!',
      'F5, %username%.',
      'If you got cojones, come on, mette mano.',
      'Jah\'d never let us down, %username%.',
      'Russian sounds sexy, %username%!',
      'Solutions are not the answer, %username%.',
      'Soviet Russia owns teh Intarnet, %username%.',
      'They killed %username%. Bastards!',
      'You found piles and piles of gold! Keep Clicking! Click like the wind!',
      'You have completed more work units than 89.795% of our users, %username%.',
      'fapfapfapfapfapfap, %username%!',
      'hakkabah hakkabah we hate the usa hakkabah marrakesh hakkabah, %username%.',
      'ž 5;ة العرب¡ 0;ة, ج, %username%.',
      'А мы построим свой Лунапарк, %username%! С блекджеком и шлюхами!',
      'А ты знаешь, в чем соль, %username%?',
      'А ты пробовал лизать октаэдр, %username%?',
      'А что ты можешь противопоставить бездушной американской машине, %username%?',
      'Аллах прекрасен и любит всё прекрасное, %username%.',
      'Анекдоты о блондинках высмеивают арийский тип, %username%!',
      'Благословен ты в городе, и благословен на поле, %username%.',
      'В наборе детских кубиков буквы "Х", "У" и "Й" всегда находятся на одном кубике, %username%',
      'В среду выборы, %username%',
      'Ваш горизонт завален, %username%.',
      'Вообще—то я не религиозный человек, но если ты есть там наверху, спаси меня, %username%.',
      'Вред от курения вообще не доказан, это просто байка, %username%.',
      'Все что вы сдесь видете, далжно оставатся сикретам, %username%.',
      'Вы ввели неправильное имя или пароль, %username%, попробуйте еще раз.',
      'Вы не дождетесь новых приветствий, %username%.',
      'Вы не ошиблись дверью, %username%?',
      'Вы просто созданы для лепрозория, %username%!',
      'Вы тоже имеете право на личную жизнь, %username%.',
      'Высокохохолковый пингвин, %username%, это единственный пингвин в мире, который может шевелить своим хохолком.',
      'Где мой йогурт, %username%?',
      'Геббельс был ученым, поэтом и музыкантом, %username%.',
      'Глаз страуса больше, чем его мозг, %username%.',
      'Деларова Евгения Евгеньевна нашлась, %username%!',
      'Если руки золотые, то не важно откуда они растут, %username%.',
      'Жизнь справедлива только к неграм, %username%.',
      'Зато у тебя есть доступ на Лепру, %username%.',
      'Затоптать муравья не так просто, как кажется, %username%.',
      'Здравствуйте, %username%.',
      'Из человека получается семь кусков мыла, %username%!',
      'Индейка — единственный зверь хитрее человека, %username%.',
      'Кто спит — тот видит только сны, %username%.',
      'Куда вы дели мой ваучер, %username%?',
      'Купите икону "Неупиваемая чаша" и молитесь, %username%!',
      'Лепрозорий — простреленное колено Израилево, %username%.',
      'Люди в тюрьме меньше времени сидят, чем вы на Лепре, %username%.',
      'Мне нужна твоя одежда и мотоцикл, %username%.',
      'Мы надеемся, что вы любите Новое Правительство, %username%.',
      'Надеюсь, приятно проводите время, %username%.',
      'Надо делать то, что нужно людям, а не то, чем мы занимаемся, %username%.',
      'Не верьте тому, что пишут перед вашим псевдонимом, %username%.',
      'Нет, %username%, учёные не такие дураки!',
      'Носороги не играют в игры, %username%.',
      'Ну и отлично, %username%!',
      'Он выпустил на свободу Разум биологов, %username%!',
      'Патрис Лумумба родился 2 июля, %username%!',
      'Паша Цветомузыка жив, %username%',
      'Передайте женщине соль, %username%.',
      'Подростки — не целевая аудитория табачных компаний, %username%.',
      'Позолоти пост, %username%, дорогой!',
      'Попасть сюда сложно, %username%. Выход не могут найти даже старожилы.',
      'Попытка — первый шаг к провалу, %username%.',
      'Прислушивайтесь к голосам в вашей голове, %username%.',
      'Продолжайте кликать! Во имя всего святого, продолжайте кликать!',
      'Самоубийцы дискредитировали самоубийство, %username%.',
      'Сегодня вас ждёт приятная неожиданность, %username%!',
      'Слово «ЙА» — можно написать одной буквой, %username%.',
      'Ссылка, она для кого — наказание, а для кого — отдых, %username%.',
      'Тут никого нет, %username%! Никого! Никого, кроме тебя!',
      'У вас есть такая проблема, что дерьмо прилипает к шерсти, %username%?',
      'У нас тут все либо умные, либо красивые, а вы хоть разорвитесь, %username%.',
      'Увидел, запостил, в бан–лист! Увидел, запостил, в бан–лист! Романтика!',
      'Хочешь новых прикольных рингтонов? Выпрыгни в окно, %username%!',
      'Что общего у Майкла Джексона и Нила Армстронга? Лунная походка.',
      'Шоколад ни в чем не виноват, %username%.',
      'Я видел «17 мгновений весны» на китайском, %username%.',
      'Я слежу за тобой, %username%. И ты мне нравишься. (NOT GAY)',
      '— Алло это прачечная? — Упячечная, %username%.' ];

		$("#highliteColor").ColorPicker({
			color: navigateOptions.highliteColor,
			onSubmit: function(hsb, hex, rgb, el) {
				$('#highliteColor').css('backgroundColor', '#' + hex)
							    .val("#" + hex)
							    .ColorPickerHide();
			},
               onBeforeShow: function () {
				$(this).ColorPickerSetColor(this.value);
            	},
			onChange: function(hsb, hex, rgb){
				$('#highliteColor').css('backgroundColor', '#' + hex)
							    .val("#" + hex)
			}

		}).css('backgroundColor',  navigateOptions.highliteColor);
		$("#" + navigateOptions.navigateWith).attr({checked: true});
		$("#drawBorder").attr({checked: navigateOptions.drawBorder});
		$("#highliteComment").attr({checked: navigateOptions.highliteComment});
		$("#highliteColor").val(navigateOptions.highliteColor);
		$("#showPrevComment").attr({checked: navigateOptions.showPrevComment});
		$("#smoothScroll").attr({checked: navigateOptions.smoothScroll});


		$("#bigger").click(function(){
			if(fontSizeIndex + 1 < fontSizes.length){
				fontSizeIndex += 1;
				$("#options").css({fontSize: fontSizes[fontSizeIndex]});
				localStorage["fontSize"] = fontSizes[fontSizeIndex];
			}
		});
		$("#smaller").click(function(){
			if(fontSizeIndex - 1 >= 0){
				fontSizeIndex -= 1;
				$("#options").css({fontSize: fontSizes[fontSizeIndex]});				
				localStorage["fontSize"] = fontSizes[fontSizeIndex];
			}
		});
		$("#options").css({fontSize: defaultFontSize});
		$("#greeting").text(greetings[randInt(greetings.length)]);
		$("#" + clickBehavior).attr({checked: true});
		for (var i = 0, refreshValueNode; refreshValueNode = refreshIntervalNode[i]; i++) {
			if (refreshValueNode.value == refreshIterval) {
				refreshValueNode.selected = 'true';
				break;
			}
		}
		for(var i = 0, showOnBadgeValueNode; showOnBadgeValueNode = showOnBadgeNode[i]; i++){
			if(showOnBadgeValueNode.value == showOnBadge) {
				showOnBadgeValueNode.selected = 'true';
				break;
			}
		}
		for(var i = 0; userjs = USER_SCRIPTS()[i]; i++){
			formNode[userjs].checked = getUserJsEnabled(userjs);
		}
		$("#textareascuts").click(function() { $("#textareashortcuts").toggle(0); });
		if(!formNode["textareashortcuts"].checked){
			$("#textareashortcuts").hide();
		}
		for(var scut in textareaShortcuts){
			if(textareaShortcuts.hasOwnProperty(scut)){
				formNode[scut].value = textareaShortcuts[scut];
			}
		}
		$("#textareashortcuts input").keydown(function(e){
				var k = KeyCode;
				var hotkey = k.hot_key(k.translate_event(e));

				if(hotkey.indexOf("+") !== -1){
					this.value = hotkey.toLowerCase();
					e.stopPropagation(); 
					e.preventDefault();
				}
		});
		$("#save-button").click(function(){ 				 
			var clickBehaviorNode = formNode['click-behavior']; 
			for (var i = 0, clickBehaviorOptionNode; clickBehaviorOptionNode = clickBehaviorNode[i]; i++) { 
				if (clickBehaviorOptionNode.checked) { 
					setClickBehavior(clickBehaviorOptionNode.value); 
				} 
			}
			var navigateWithNode = formNode['navigate-with'];
			for (var i = 0, navigateWithOptionNode; navigateWithOptionNode = navigateWithNode[i]; i++) { 
				if (navigateWithOptionNode.checked) { 
					navigateOptions.navigateWith = navigateWithOptionNode.value; 
				} 
			}
			navigateOptions.drawBorder = formNode["drawBorder"].checked;
			navigateOptions.highliteComment = formNode["highliteComment"].checked;
			navigateOptions.highliteColor = formNode["highliteColor"].value;
			navigateOptions.showPrevComment = formNode["showPrevComment"].checked;
			navigateOptions.smoothScroll = formNode["smoothScroll"].checked;
			setCommentNavigationOptions(navigateOptions);
			
			clickBehavior = getClickBehavior();
			if(clickBehavior === "popup"){
				chrome.browserAction.setTitle({title:''});
			}
			
			refreshInterval = refreshIntervalNode.children[refreshIntervalNode.selectedIndex].value;
			setRefreshInterval(refreshInterval);
			
			for(var i = 0; userjs = USER_SCRIPTS()[i]; i++){
				setUserJsEnabled(userjs, formNode[userjs].checked);
			}
			
			for(var scut in textareaShortcuts){
				if(textareaShortcuts.hasOwnProperty(scut)){
					textareaShortcuts[scut] = formNode[scut].value;
				}
			}
			setTextareaShortcuts(textareaShortcuts);

			showOnBadge = showOnBadgeNode.children[showOnBadgeNode.selectedIndex].value;
			setShowOnBadge(showOnBadge);
			if(showOnBadge === 'none'){
				chrome.browserAction.setBadgeText({text:''});
			}
			updateInfo();
			if(showOnBadge === 'none' && clickBehavior === "popup"){
				chrome.extension.connect({name: "updateinfo"}).postMessage("stop");
			} else {
				chrome.extension.connect({name: "updateinfo"}).postMessage("start");
			}
			$("#save-button").text("Saved").attr({disabled: true});
			setTimeout(function(){ $("#save-button").text("Save").attr({disabled: false}); }, 750);
		});

});
