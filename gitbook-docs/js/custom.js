var config = {
	navi: [{
		name: 'SDK API',
		url: '',
		active: 'active',
		children: [{
			name: 'Web',
			url: '',
			active: 'active'
		}, {
			name: 'Desktop',
			url: ''
		}, {
			name: 'iOS',
			url: ''
		}, {
			name: 'Android',
			url: ''
		}, {
			name: 'Server',
			url: ''
		}]
	},{
		name: '基础服务',
		url: ''
	},{
		name: '拓展服务',
		url: ''
	},{
		name: '高级功能',
		url: ''
	},{
		name: '付费功能',
		url: ''
	}]
};

// module.exports = function($) {
// 	$('.divider').remove();
// 	$('.gitbook-link').remove();
// 	$('#book-search-input').remove();

// 	var topNav = `
// 		<li class="rong-top-nav-menu">
// 			<a href="#" class="{{active}}">{{topNav}}</a>
// 		</li>
// 	`;

// 	var subNav = `
// 		<li class="rong-sub-nav-menu">
// 			<a href="#" class="{{active}}">{{subNav}}</a>
// 		</li>
// 	`;

// 	var tmpl = `
// 		<div class="rong-head">
// 			<div class="rong-head-box">
// 				<div class="rong-head-box-logo"></div>
// 				<div class="rong-head-box-nav">
// 					<ul class="rong-top-nav-menus">
// 						{{topNav}}
// 					</ul>
// 				</div>
// 			</div>
// 		</div>
// 		<div class="rong-sub-nav">
// 			<div id="book-search-input" role="search">
// 			    <input type="text" placeholder="Type to search">
// 			</div>
// 			<ul class="rong-sub-nav-menus">
// 				{{subNav}}
// 			</ul>
// 		</div>
// 	`;
// 	$('body').append(tmpl);
// 	return $.html();
// }

module.exports = function($) {
	$('.divider').remove();
	$('.gitbook-link').remove();
	$('#book-search-input').remove();
	var tmpl = `
		<div class="rong-head">
			<div class="rong-head-box">
				<div class="rong-head-box-logo"></div>
				<div class="rong-head-box-nav">
					<ul class="rong-top-nav-menus">
						<li class="rong-top-nav-menu">
							<a href="#" class="active">SDK API</a>
						</li>
						<li class="rong-top-nav-menu">
							<a href="#">基础服务</a>
						</li>
						<li class="rong-top-nav-menu">
							<a href="#">拓展服务</a>
						</li>
						<li class="rong-top-nav-menu">
							<a href="#">高级功能</a>
						</li>
						<li class="rong-top-nav-menu">
							<a href="#">付费功能</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="rong-sub-nav">
			<div id="book-search-input" role="search">
			    <input type="text" placeholder="Type to search">
			</div>
			<ul class="rong-sub-nav-menus">
				<li class="rong-sub-nav-menu">
					<a href="#">Web</a>
				</li>
				<li class="rong-sub-nav-menu">
					<a href="#">Andoid</a>
				</li>
				<li class="rong-sub-nav-menu">
					<a href="#">iOS</a>
				</li>
				<li class="rong-sub-nav-menu">
					<a href="#">Desktop</a>
				</li>
				<li class="rong-sub-nav-menu">
					<a href="#">Server</a>
				</li>
			</ul>
		</div>
	`;
	$('body').append(tmpl);
	return $.html();
}