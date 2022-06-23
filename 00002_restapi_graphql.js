function RESTWrapper({
	debug = false,
	platform ="web"
  }={})
{
	let newRESTWrapper = Object.create(REST_OPS);
	newRESTWrapper.platform = platform;
	newRESTWrapper.debug = debug;
	return newRESTWrapper;
}

let REST_OPS = {
	_RequestsGET: function({
		requestUrl,
		requestHeaders={},
		requestTimeouts=60000,
		requestcontentType="application/json",
		requestdataType='json'
  	}={},clback){
		if(requestUrl === "" || typeof requestUrl === 'undefined'){
			if(this.debug){
				console.log(`error requestUrl : undefined`);
			}
		}else if(!(this._isValidURL(requestUrl))){
			if(this.debug){
				console.log(`error requestUrl : not valid url`);
			}
		}else{
			if(this.platform.toString().toLowerCase() == "apk"){
				var tmt = requestTimeouts / 1000;
				var options = {
					method: "get",
					responseType: requestdataType,
					timeout: tmt,
					headers: requestHeaders,
				}
				cordova.plugin.http.sendRequest(requestUrl, options, function(response) {
					// prints 200
					if(("error" in response)) {
						var ts = {
							"status" : response.status,
							"error": response.error
						};
						clback(ts);
						return;
					}
					var ts = response.data;
					clback(ts);
				}, function(response) {
					var ts = {
						"status" : response.status,
						"error": response.error
					};
					clback(ts);
				});
			}else{
				$.ajax({
					url: requestUrl,
					contentType: requestcontentType,
					method: "GET",
					dataType: requestdataType,
					timeout:requestTimeouts,
					headers: requestHeaders
				}).done(function(data) {
					if(requestdataType=="json"){					
						try {
							var ts = JSON.parse(data);
						} catch (error) {
							var ts = data;
						}
					}else{
						var ts = data;
					}
					clback(ts);					
					////////////console.log('success', data) ;
				}).fail(function(xhr, textStatus) {
					if(textStatus === 'timeout'){
						clback({'timeout': requestTimeouts+"ms"});
					}else{
						clback({'error': xhr.statusText});
					}				
				});
			}
		}
		
    }, 
	_RequestsPOST: function({
		requestUrl,
		requestData={},
		requestHeaders={},
		requestTimeouts=60000,
		requestcontentType="application/json",
		requestdataType='json'
  	}={},clback){
		if(requestUrl === "" || typeof requestUrl === 'undefined'){
			if(this.debug){
				console.log(`error requestUrl : undefined`);
			}
		}else if(!(this._isValidURL(requestUrl))){
			if(this.debug){
				console.log(`error requestUrl : not valid url`);
			}
		}else{
			if(this.platform.toString().toLowerCase() == "apk"){
				var tmt = requestTimeouts / 1000;
				if(requestcontentType.toString().toLowerCase()=="application/json"){
					var serializerdt = "json";
				}else if(requestcontentType.toString().toLowerCase()=="application/x-www-form-urlencoded"){
					var serializerdt = "urlencoded";
				}else if(requestcontentType.toString().toLowerCase()=="multipart/form-data"){
					var serializerdt = "multipart";
				}else if(requestcontentType.toString().toLowerCase()=="application/octet-stream"){
					var serializerdt = "raw";
				}else{
					var serializerdt = "utf8";
				}
				var options = {
					method: "post",
					data: requestData,
					responseType: requestdataType,
					serializer: serializerdt,
					timeout: tmt,
					headers: requestHeaders,
				}
				cordova.plugin.http.sendRequest(requestUrl, options, function(response) {
					// prints 200
					if(("error" in response)) {
						var ts = {
							"status" : response.status,
							"error": response.error
						};
						clback(ts);
						return;
					}
					var ts = response.data;
					clback(ts);
				}, function(response) {
					var ts = {
						"status" : response.status,
						"error": response.error
					};
					clback(ts);
				});
			}else{
				if(requestcontentType.toString().toLowerCase()=="application/json"){
					var optdt = JSON.stringify(requestData);
				}else if(requestcontentType.toString().toLowerCase()=="application/x-www-form-urlencoded"){
					var optdt = $.param(requestData);
				}
				$.ajax({
					url: requestUrl,
					contentType: requestcontentType,
					method: "POST",
					data:  optdt,
					dataType: requestdataType,
					timeout:requestTimeouts,
					headers: requestHeaders
				}).done(function(data) {
					if(requestdataType=="json"){					
						try {
							var ts = JSON.parse(data);
						} catch (error) {
							var ts = data;
						}
					}else{
						var ts = data;
					}
					clback(ts);					
					////////////console.log('success', data) ;
				}).fail(function(xhr, textStatus) {
					if(textStatus === 'timeout'){
						clback({'timeout': requestTimeouts+"ms"});
					}else{
						clback({'error': xhr.statusText});
					}				
				});
			}
		}
		
    }, 
	_RequestsGraphQL: async function({
		requestUrl,
		requestData,
		requestHeaders={}
  	}={},clback){
		if(requestUrl === "" || typeof requestUrl === 'undefined'){
			if(this.debug){
				console.log(`error requestUrl : undefined`);
			}
		}else if(!(this._isValidURL(requestUrl))){
			if(this.debug){
				console.log(`error requestUrl : not valid url`);
			}
		}else{
			var hdr = {
				'Content-Type': 'application/json',
				'Content-Length': JSON.stringify(requestData).length
			}
			if(Object.keys(requestHeaders).length > 0){
				
				for(var obj in Object.keys(requestHeaders)){
					
					var keyn = Object.keys(requestHeaders)[obj];	
					var keynvl = requestHeaders[keyn];
					//console.log(keynvl);
					if(keyn.toString().toLowerCase() == "content-type"){
					}else if(keyn.toString().toLowerCase() == "content-length"){
					}else{
						hdr[keyn] = keynvl;
					}
				}
			}
			//console.log(hdr);
			//return;
			const response = await fetch(
				requestUrl,
				{
				  method: 'post',
				  body: JSON.stringify(requestData),
				  headers: hdr
				}
			);
			  //var rawresponse = await response;
			const resjson = await response.json();
			  //////console.log(rawresponse);
			clback(resjson);
		}
		
    },
	_isValidURL : function(string) {
		var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
		return (res !== null)
	}
}