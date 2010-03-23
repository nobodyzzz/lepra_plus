ifEnabled("personal_hell", function(){
// ==UserScript==
// @name Leprosorium Personal Hell
// @include http://*leprosorium.ru/*
// @include http://*leprosorium.ru/users/*posts/*
// @match http://*.leprosorium.ru/*
// @match http://*.leprosorium.ru/users/*posts/*
// @run-at document-start
// ==/UserScript==

if(location.host.match(/leprosorium\.ru/) == null) return;

document.addEventListener("DOMNodeInserted", function(eventObject)
{ 
	if (eventObject.relatedNode.nodeName == "DIV" && eventObject.relatedNode.lastChild.className && eventObject.relatedNode.lastChild.className.match(/post/))
		createPersonalHell(eventObject.relatedNode.lastChild); 

}, false);

var db;

/*
It's your personal hell! Yarrr!
*/
var personalHell = 
{
	db : null,
	hidden : 0,
	func_result : false,

	/*
	Initializing state
	*/
	init : function()
	{
		/*
		HTML5 now
		by Newton
		*/
	
		//Initializing store
		try {
		    if (window.openDatabase) {
		    	db = openDatabase("PersonalHell", "1.0", "HTML5 Personal Hell", 200000);  //google.gears.factory.create('beta.database');
		    	if(!db){
		    		alert('Error');
		    	}
		    } else {
		    	alert('Please use latest Webkit Nightly Build');
		    }
		} catch (err) {
		}
			
		//Creating table for the first time
		db.transaction(function(tx) {
	        tx.executeSql("SELECT COUNT(*) FROM hidden_users", [], function(result) {
	        }, function(tx, error) {
	    		tx.executeSql("CREATE TABLE hidden_users (user_id int, user_nickname text);");
	    		tx.executeSql("CREATE TABLE hidden_posts (post_id int);");
	        });
	    });
		//db.execute("DROP TABLE hidden_users");
		//db.execute("DROP TABLE hidden_posts");
	},
	
	/*
	Saving hidden post
	*/
	saveHidePost : function(post)
	{
		post = personalHell.getPostNumber(post);
		db.transaction(function(tx) {
			tx.executeSql("INSERT INTO hidden_posts VALUES (?)", [post]);
		});
		personalHell.hidePost(post);
		updateBox();
	},
	
	/*
	Saving hidden all author posts
	 */
 	saveHideAuthorPosts : function(post)
	{
		var postAuthor = personalHell.getPostAuthor(post);
		db.transaction(function(tx) {
			tx.executeSql("INSERT INTO hidden_users VALUES (?, ?)", [postAuthor, post.getElementsByClassName("js-user_login").item(0).innerHTML]);
		});
		personalHell.hideUser(postAuthor);
		updateBox();
	},
	
	/*
	Unhiding author
	*/
	unhideAuthor : function(author_id)
	{
		db.transaction(function(tx) {
			tx.executeSql("DELETE FROM hidden_users WHERE user_id = ?", [author_id]);
		});
	},
	
	/*
	Unhiding post
	*/
	unhidePost : function(post_id)
	{
		db.transaction(function(tx) {
			tx.executeSql("DELETE FROM hidden_posts WHERE post_id = ?", [post_id]);
		});
	},
	
	/* Getting post author */
	getPostAuthor : function(post)
	{
		return post.className.match(/u([0-9]+)/)[1];
	},
	
	/* Getting post number */
	getPostNumber : function(post)
	{
		return post.getAttribute("id").match(/p([0-9]+)/)[1];
	},
	
	/*
	Hiding user
	*/
	hideUser : function(user)
	{
		var posts = document.getElementById("js-posts_holder").getElementsByClassName("post");
		
		for(var j = 0; j < posts.length; j++){
			if(personalHell.getPostAuthor(posts[j]) == user){
				personalHell.hidden++;
				posts[j].parentNode.removeChild(posts[j]);
				updateBox();
			}
		}
	},
	
	/*
	Hiding post
	*/
	hidePost : function(post)
	{
		var posts = document.getElementById("js-posts_holder").getElementsByClassName("post");
		
		for(var j = 0; j < posts.length; j++){
			if(personalHell.getPostNumber(posts[j]) == post){
				personalHell.hidden++;
				posts[j].parentNode.removeChild(posts[j]);
				updateBox();
			}
		}
	}
}


/*
Main page handling
*/
function createPersonalHell(specified_node)
{
	var posts = null;
	
	if (specified_node == null)
	{

		//Getting all comments from page
		posts = document.getElementById("js-posts_holder");

		if (posts == null)
		{
			return;
		}

		posts = posts.getElementsByClassName("post");

	}
	else
	{
		posts = [specified_node];
	}
	
	db.transaction(function(tx) {
		for (var i = 0; i < posts.length; i++)
		{
			if (posts[i].getAttribute("hell") != "true")
			{
				var author_id = personalHell.getPostAuthor(posts[i]);
				var post_id = personalHell.getPostNumber(posts[i]);
				
		        tx.executeSql("SELECT * FROM hidden_posts WHERE post_id = ?", [post_id], function(t, r){
		        	if(r.rows.length > 0){
		        		personalHell.hidePost(r.rows.item(0)['post_id']);
		        	}
		        });
		        tx.executeSql("SELECT * FROM hidden_users WHERE user_id = ?", [author_id], function(t, r){
		        	if(r.rows.length > 0){
        				personalHell.hideUser(r.rows.item(0)['user_id']);
		        	}
		        });
		
				var numberElement 		= document.createElement("span");
				var numberElementTwo	= document.createElement("span");
				numberElement.innerHTML = ' | [<a class="js_hide_post" onclick="return false;" title="Не хочу видеть этот пост!" href="#" >удалить</a>]';
				numberElementTwo.innerHTML = ' [<a class="js_hide_author_posts" onclick="return false;" title="Не хочу видеть посты этого автора!" href="#">в ОННН</a>] ';
				//Appending to the lower line of comment
				var insertionNode = posts[i].getElementsByClassName("p").item(0).getElementsByTagName("a").item(0);
				insertionNode.parentNode.insertBefore(numberElement, insertionNode.nextSibling.nextSibling.nextSibling);
				insertionNode.parentNode.insertBefore(numberElementTwo, insertionNode.nextSibling);
	
				//Appending events
				posts[i].getElementsByClassName("js_hide_post").item(0).onclick = function()
				{
					personalHell.saveHidePost(this.parentNode.parentNode.parentNode.parentNode);
					return false;
				}
				
				posts[i].getElementsByClassName("js_hide_author_posts").item(0).onclick = function()
				{
					if (window.confirm("Вам этот пользователь правда-правда надоел?"))
						personalHell.saveHideAuthorPosts(this.parentNode.parentNode.parentNode.parentNode);
					return false;
				}
	
				posts[i].setAttribute("hell", "true");
			}
			
		}
	}, function(){}, function(){
		appendHiddenInfo();
	});
}

function updateBox()
{
	var private_box = document.getElementById("private");
	if (private_box != null && private_box.lastChild)
	{
		var ihtm = 'Ваш <a href="/js/banned" id="trashcan">мусорный ящик</a>';
		if (personalHell.hidden > 0)
		{
			ihtm += ' <span id="hidden_counter" title="Скрыто постов на странице">(' + personalHell.hidden.toString() + ')</span>';
		}
		ihtm += '.';
		if (document.location.href.match(/^http:\/\/(www\.)?leprosorium\.ru\//))
		{
			ihtm += '<br /><a id="roundrobin" href="#">Перетасовать</a> главную.';
		}

		private_box.lastChild.innerHTML = ihtm;
		document.getElementById("roundrobin").onclick = function()
		{
			personalHell.hidden = 0;
			var posts = document.getElementById("js-posts_holder"); 
			while(posts.hasChildNodes()) { posts.removeChild(posts.lastChild); }; 
			document.getElementsByClassName("load_more_posts").item(0).onclick();
			return false;	
		}
		
		if (personalHell.hidden >= 10 && private_box.getAttribute("not_first") != "true")
		{
			document.getElementsByClassName("load_more_posts").item(0).onclick();
			private_box.setAttribute("not_first", "true");
		}
	}
}

function bindUnhideUser(){
	if(users_finished){
		clearInterval(users_interval);
		
		for (var users = container.getElementsByClassName("hidden_user"), i = 0; i < users.length; i++ )
		{
			users[i].onclick = function()
			{
				if (window.confirm("Точно разбанить? Вы прощаете?"))
				{
					personalHell.unhideAuthor(this.getAttribute("user_id"));
					this.parentNode.parentNode.removeChild(this.parentNode);
				}
				return false;
			}
		}
	}
}

function bindUnhidePost(){
	if(posts_finished){
		
		clearInterval(posts_interval);
		for (var posts = container.getElementsByClassName("hidden_post"), i = 0; i < posts.length; i++ )
		{
			posts[i].onclick = function()
			{
				if (window.confirm("Точно разбанить? Вы осознали сущность поста?"))
				{
					personalHell.unhidePost(this.getAttribute("post_id"));
					this.parentNode.parentNode.removeChild(this.parentNode);	
				}
			}
		}
	}
}

var posts_finished = false;
var posts_interval = false;
var users_finished = false;
var users_interval = false;
var container;

function appendHiddenInfo()
{
	//Appending link to personal ban
	var private_box = document.getElementById("private");
	if (!document.getElementById('trashcan') && (private_box != null))
	{
		var private_ban = document.createElement("p");
		var ihtm = 'Ваш <a href="/js/banned" id="trashcan">мусорный ящик</a>';
		if (personalHell.hidden > 0)
		{
			ihtm += ' <span id="hidden_counter" title="Скрыто постов на странице">(' + personalHell.hidden.toString() + ')</span>';
		}
		ihtm += '.';
		
		private_ban.innerHTML = ihtm;
		private_box.appendChild(private_ban);
	}

	//Checking location
	if (!document.location.href.match(/\/js\/banned/))
	{
		return;
	}
	
	//Removing page old content
	document.body.innerHTML = "";
	document.title = "Мусорный ящик";
	
	container = document.createElement("div");
	container.setAttribute("style", "width: 60%; color: #333;");
	document.body.appendChild(container);
	
	var inh = '<h1>Мусорный ящик</h1>';
	inh += '<p>Привет! Тут ты можешь контролировать всех, кого ты забанил или что ты забанил на своём пути. Наслаждайся, это твоя работа!</p>';
	inh += '<p>Если вы случайно сюда попали, вернитесь на <a style="color: #000;" href="/">главную</a>, дяденька!</p>';
	
	//var hidden_author = db.execute("select * from hidden_users"), cnt = 0;
	inh += '<p><strong>Вот кто забанен:</strong></p>';
	inh += '<div id="banned_users"></div>';
	inh += '<p><strong>Вот какие посты скрыты:</strong></p>';
	inh += '<div id="banned_posts"></div>';
	
	container.innerHTML = inh;
	
	db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM hidden_users", [], function(t, r){
			var inh = '';
			
			if(r.rows.length == 0){
				inh += '<p>Вы милосердны: тут пока никого нет.</p>';
			}else{
				for(var i = 0; i < r.rows.length; i++){
					var row = r.rows.item(i);
					inh += '<span style="line-height: 28px; margin-right: 20px;" >\
						<a class="hidden_user" user_id="' + row['user_id'] + '" title="Разбанить автора" style="display: inline; text-decoration: none; color: #888;" href="#">[x]</a>&nbsp;<a style="color: #000" href="/users/' + row['user_nickname'] + '">' + row['user_nickname'] + '</a>&nbsp;<span class="hidden_author_id" style="font-size: 12px;">(' + row['user_id'] + ')</span>\
						</span>';
				}
				users_finished = true;
				inh += '<p>Всего вами забанено людишек: ' + r.rows.length + '.</p>';
			}
			document.getElementById('banned_users').innerHTML = inh;
        });
	});
	
	db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM hidden_posts", [], function(t, r){
			var inh = '';
			
			if(r.rows.length == 0){
				inh += '<p>Вы милосердны: тут пока ничего нет.</p>';
			}else{
				for(var i = 0; i < r.rows.length; i++){
					var row = r.rows.item(i);
					inh += '<span style="line-height: 28px; margin-right: 20px;" >\
						<a class="hidden_post" post_id="' + row['post_id'] + '" title="Разбанить пост" style="display: inline; text-decoration: none; color: #888;" href="#">[x]</a>&nbsp;<a style="color: #000" href="/comments/' + row['post_id'] + '">' + row['post_id'] + '</a>\
						</span>';
				}
				posts_finished = true;
				inh += '<p>Всего вами забанено постов: ' + r.rows.length + '.</p>';
			}
			document.getElementById('banned_posts').innerHTML = inh;
        });
	});
	
	posts_interval = setInterval(bindUnhidePost, 55);
	users_interval = setInterval(bindUnhideUser, 55);
}

//Go! Go! Go!
personalHell.init();
appendHiddenInfo();
createPersonalHell();
});
