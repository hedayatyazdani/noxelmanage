const http=require("http");
//const slowAES=require('./aes');
const BH=require('./bh');
//const fs=require('fs');
const urlclass=require('url');
//sconsole.log(BH);

var currentUrl='http://suerte.cf/';
var callURL=function(cook){
	//console.log(cook);
	var _headers = {'User-Agent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'};
	if(cook){
		_headers['Cookie']='__test='+cook;
	}
	var urlo=urlclass.parse(currentUrl);
	var options={
		host: urlo.host,
		port: 80,
		path: urlo.path,
		method: 'GET',
		headers:_headers
	};
	var req=http.request(options,function(res){
		total++;
		/*res.setEncoding('utf8');
		res.on('data',function(chunck){
			//console.log(chunck);
		});*/
	});
	req.end();
	target_index++;
	setTimeout(cycle,cycle_space);
};

//var workers=['http://suerte.cf/'];
var workers=["http://suerte.cf/data/client/CrawlerBase/call/", "http://www.refind.cf/res/cra/client/CrawlerBase/call/", "http://www.73pro.cf/cra/client/CrawlerBase/call/", "http://www.query-yek.ml/cra/client/CrawlerBase/call/", "http://guneshrich.gdk.mx/wp-plugins/client/CrawlerBase/call/", "http://lunarich.byethost16.com/wp-plugins/client/CrawlerBase/call/", "http://sevdarichard.h70.ir/wp-plugins/client/CrawlerBase/call/", "http://ahmetrichard.1-ws.com/wp/wp-plugins/client/CrawlerBase/call/", "http://beyazrichard.unaux.com/wp-plugins/client/CrawlerBase/call/", "http://simgerich.0hi.me/wp-plugins/client/CrawlerBase/call/", "http://saririchard.paks.pk/wp-plugins/client/CrawlerBase/call/", "http://yashilrichard.nonhost.com/wp-plugins/client/CrawlerBase/call/"];
var delay=110000;
var target_index=0;
var server_port=3000;
var total=0;
var cycle_group=10000;
var cycle_space=3000;

function cycle(){
	if(total%cycle_group==0)BH.cleanCookies();
	if(target_index==workers.length){
		target_index=0;
		setTimeout(cycle,delay);
	}else{
		currentUrl=workers[target_index];
		BH.init(currentUrl,callURL);
	}
}

cycle();
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write("<p>index:"+target_index+"</p>"+
	"<p>count:"+total+"</p>");
  res.end();
}).listen(server_port);