const http=require("http");
const slowAES=require('./aes');
const fs=require('fs');
const urlclass=require('url');
function BH()
{
};



BH.callback=null;
BH.currentNT=null;
BH.currentUrl=null;


BH.toNumbers=function(arg)
{
	var e=[];
	arg.replace(/(..)/g,function(arg){
		e.push(parseInt(arg,16));
	});
	return e;
};
BH.toHex=function(arg)
{
	/*for(var arg=[],arg=1==arguments.length&&arguments[0].constructor==Array?arguments[0]:arguments,e="",f=0;f<arg.length;f++)
		e+=(16>arg[f]?"0":"")+arg[f].toString(16);return e.toLowerCase();*/
	/*var ret='';var byte=null;
	for(var i=0;i<arg.length;i++){
		byte=arg[i];
		ret+=byte.toString(16);
	}
	return ret;*/
	
	for(var argi=[],argi=1==arguments.length&&arguments[0].constructor==Array?arguments[0]:arguments,e="",f=0;f<argi.length;f++)
		e+=(16>argi[f]?"0":"")+argi[f].toString(16);return e.toLowerCase();
};
BH.init=function(ch,callback)
{
	var url=ch; var cfile=BH.getCookieFile(url);
	analyzeByetResult=function(src){
		var pats={'a':/a=toNumbers\(\"([a-f\d]+)\"\)/,'b':/b=toNumbers\(\"([a-f\d]+)\"\)/,'c':/c=toNumbers\(\"([a-f\d]+)\"\)/};
		var data={};
		isbh=true;
		var keys=['a','b','c'];
		for(var i=0;i<3;i++){
			if((r=pats[keys[i]].exec(src))){
				data[keys[i]]=BH.toNumbers(r[1]);
			}else{isbh=false; break;}
		}
		if(isbh){
			cookie=BH.toHex(slowAES.decrypt(data['c'],2,data['a'],data['b']));
			fs.writeFile(cfile,cookie,function(res){}); callback(cookie);
			return;
		}else fs.writeFile('nobh'+cfile,'',function(res){});
		callback(null);
	};
	
	fs.exists("nobh"+cfile,function(nobh){
		if(nobh){
			callback(null);
			return; //it is not bh url
		}else{
			fs.exists(cfile,function(cookie_file_exists){
				if(cookie_file_exists){
					fs.readFile(cfile,function(err,data){
						if(err)return ;
						callback(data.toString());
					});
				}else{
					var urlo=urlclass.parse(url);
					var options={host:urlo.host,port:80,path:urlo.path,method:'GET'};
					var req=http.request(options,function(res){
						res.on('data',function(chunck){
							analyzeByetResult(chunck);
						});
					});
					req.end();
				}
				
			});
		}
		
	});
	
	
};
BH.cleanCookies=function()
{
	var dir=process.cwd();
	var files=fs.readdirSync(dir);
	for(var i=0;i<files.length;i++){
		if(files[i].match(/^__/))fs.unlink(dir+"/"+files[i],function(e){});
	}
};
BH.getCookieFile=function(url)
{
	if(url.search("http")<0)url=window.location.href;
	var m=null;
	if((m=/https*\:\/\/([\w_\-\.]+)/.exec(url))){
		var domain= m[1];
		return '___'+domain.replace(/\./g,'_');
	}else return "___localhost";
};
module.exports=BH;