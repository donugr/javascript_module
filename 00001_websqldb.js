function DTBase({
    dbname,
    debug = false,
    platform ="web"
  }={})
{
    let newDTBase = Object.create(DB_OPS);
    newDTBase.dbname = dbname;
    newDTBase.platform = platform;
    newDTBase.debug = debug;
    var dbSize = 5 * 1024 * 1024;
    var db = openDatabase(dbname, "", dbname, dbSize, function () {
        if(debug){
            console.log(`${dbname} created`);		
        }
    });
    newDTBase.db = db;
    newDTBase.onErrorQuery = function(transaction, error){		
        if(debug){
            console.log('Query failed: ' + error.message)		
        }
        return {
            "error": "query failed: " + error.message
        }
    };
    newDTBase.onSuccessQuery = function(transaction, resultSet){		
        if(debug){
            console.log('Query completed: ' + JSON.stringify(resultSet))		
        }
    };
    return newDTBase;
}

let DB_OPS = {
    _CreateTable: function({
        tablename,
        querycollumn
    }={}){
        if(tablename === "" || typeof tablename === 'undefined'){
            if(this.debug){
                console.log(`error tablename : undefined`);
            }
        }else if(querycollumn === "" || typeof querycollumn === 'undefined'){
            if(this.debug){
                console.log(`error querycollumn : undefined`);
            }
        }else{
            try {
                this.db.transaction(function (tx) {
                    tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tablename}(${querycollumn})`, [], this.onSuccessQuery, this.onErrorQuery);
                });
                if(this.debug){
                    console.log(`${tablename} created`);
                }
            } catch (error) {
                if(this.debug){
                    console.log(`error created : ${tablename} --- ${error}`);
                }
            }
        }
        
    },
    _RowInsert: function({
        tablename,
        data
    }={},clback) {
        if(tablename === "" || typeof tablename === 'undefined'){
            if(this.debug){
                console.log(`error tablename : undefined`);
            }
            clback({
                "error": "tablename undefined"
            })
        }else if(data === "" || typeof data === 'undefined'){
            if(this.debug){
                console.log(`error data : undefined`);
            }
            clback({
                "error": "data undefined"
            })
        }else if(data.length === 0){
            if(this.debug){
                console.log(`error data : cant empty array`);
            }
            clback({
                "error": "data cant empty array"
            })
        }else{
            if(!(typeof tablename === 'string')){
                clback({
                    "error": "tablename must string"
                });
                return;
            }
            if(!(typeof data === 'object')){
                clback({
                    "error": "data must array"
                });
                return;
            }
            
            var inscollum = [];
            var insvalue = [];
            for ( var obj in Object.keys(data)) {
                var keyn = Object.keys(data)[obj];
                var keyrval = data[keyn];
                inscollum.push(keyn);
                insvalue.push(keyrval);
                    //console.log(`${keyn} : ${keyrval}`);
            }
            var querySmt = `INSERT INTO ${tablename}(${inscollum.join(",")}) VALUES('${insvalue.join("','")}')`;
            //console.log(querySmt);	
            this.db.transaction(function (tx) {
                tx.executeSql(querySmt,[], function (transaction, results){
                    clback({
                        "success": true
                    })
                }, function(transaction, error){		
                    if(this.debug){
                        console.log('Query failed: ' + error.message)		
                    }						
                    clback({
                        "error": "query failed: " + error.message
                    })
                });
            });		
        }
    },
    _RowSelect: function({
        tablename,
        filter={},
        collumreturn=[],
        orderby={},
        limit=0,
        onlycount=false
    }={},clback) {
        if(tablename === "" || typeof tablename === 'undefined'){
            if(this.debug){
                console.log(`error tablename : undefined`);
            }
            clback({
                "error": "tablename undefined"
            })
        }else{
            if(!(typeof tablename === 'string')){
                clback({
                    "error": "tablename must string"
                });
                return;
            }
            if(!(typeof limit === 'number')){
                clback({
                    "error": "limit must number"
                });
                return;
            }

            var fil = "";
            var oprfilter = [];
            if(Object.keys(filter).length > 0){
                if(("where" in filter)){
                    if(filter["where"].length > 0){
                        oprfilter.push("WHERE");
                        var separator = "";
                        if(("separator" in filter)){
                            if(filter["separator"].toString().toUpperCase() == "AND" || filter["separator"].toString().toUpperCase() == "OR"){
                                separator = filter["separator"].toString().toUpperCase();
                            }
                        }
                        separator = separator === "" ? "AND" : separator;
                        var arrfil = [];

                        for (var i = 0; i < filter["where"].length; i++) {
                            var keyn = Object.keys(filter["where"][i]);	
                            arrfil.push(`${keyn}='${filter["where"][i][keyn]}'`);
                            //oprfilterdata.push();							
                        }
                            
                        if(arrfil.length > 0){
                            for ( var obj in arrfil ) {	
                                var i = Object.keys(arrfil).indexOf(obj);
                                if(i % 2 == 0) {
                                    oprfilter.push(arrfil[obj]);
                                }else{
                                    oprfilter.push(separator);
                                    oprfilter.push(arrfil[obj]);									
                                }							
                            }
                        }

                    }
                }
            }
            if(Object.keys(orderby).length > 0){
                var keyn = Object.keys(orderby);
                var OrderK = orderby[obj] !== "DESC" || orderby[obj] !== "ASC" ? "DESC" : orderby[obj].toString().toUpperCase();
                oprfilter.push(`ORDER BY ${keyn} ${OrderK}`);
            }
            var filcollumreturn = "*";
            if(collumreturn.length > 0){
                filcollumreturn = collumreturn.join(",");
            }
            fil = oprfilter.length == 0 ? "" : oprfilter.join(" ");
            var resquery = `SELECT ${filcollumreturn} FROM ${tablename} ${fil}`;
            resquery = resquery.trim();
            //console.log(resquery);
            
            this.db.transaction(function (tx) {
                tx.executeSql(resquery, [], function (transaction, results) {
                    var len = results.rows.length, i;
                    //console.log(len);
                    if(onlycount == true){
                        clback({
                            "count": len
                        })
                    }else{
                        if (len == 0) {
                            clback([])
                        } else {
                            var res = []
                            var lmit = parseInt(limit) === 0 ? len : parseInt(limit);
                            lmit = parseInt(lmit) > len ? len : lmit;
                            for (var i = 0; i < lmit; i++) {
                                var tmpObj = {};
                                for ( var obj in results.rows.item(i) ) {								
                                    tmpObj[obj] = results.rows.item(i)[obj];
                                }
                                res.push(tmpObj);
                            }
                            clback(res)
                        }
                    }
                }, function(transaction, error){		
                    if(this.debug){
                        console.log('Query failed: ' + error.message)		
                    }
                    clback({
                        "error": "query failed: " + error.message
                    })
                });
            });
        }
    },
    _RowDelete: function({
        tablename,
        filter
    }={},clback) {
        if(tablename === "" || typeof tablename === 'undefined'){
            if(this.debug){
                console.log(`error tablename : undefined`);
            }
            clback({
                "error": "tablename undefined"
            })
        }else if(filter === "" || typeof filter === 'undefined'){
            if(this.debug){
                console.log(`error filter : undefined`);
            }
            clback({
                "error": "filter undefined"
            })
        }else{
            if(!(typeof tablename === 'string')){
                clback({
                    "error": "tablename must string"
                });
                return;
            }


            var fil = "";
            var oprfilter = [];
            if(Object.keys(filter).length > 0){
                if(("where" in filter)){
                    if(filter["where"].length > 0){
                        oprfilter.push("WHERE");
                        var separator = "";
                        if(("separator" in filter)){
                            if(filter["separator"].toString().toUpperCase() == "AND" || filter["separator"].toString().toUpperCase() == "OR"){
                                separator = filter["separator"].toString().toUpperCase();
                            }
                        }
                        separator = separator === "" ? "AND" : separator;
                        var arrfil = [];

                        for (var i = 0; i < filter["where"].length; i++) {
                            var keyn = Object.keys(filter["where"][i]);	
                            arrfil.push(`${keyn}='${filter["where"][i][keyn]}'`);
                            //oprfilterdata.push();							
                        }
                            
                        if(arrfil.length > 0){
                            for ( var obj in arrfil ) {	
                                var i = Object.keys(arrfil).indexOf(obj);
                                if(i % 2 == 0) {
                                    oprfilter.push(arrfil[obj]);
                                }else{
                                    oprfilter.push(separator);
                                    oprfilter.push(arrfil[obj]);									
                                }							
                            }
                        }

                    }
                }
            }

            fil = oprfilter.length == 0 ? "" : oprfilter.join(" ");
            var resquery = `DELETE FROM ${tablename} ${fil}`;
            resquery = resquery.trim();
            //console.log(resquery);
            this.db.transaction(function (tx) {
                tx.executeSql(resquery, [], function (transaction, results) {					
                    clback({
                        "success" : true,
                        "rowaffected": results.rowsAffected
                    })					
                }, function(transaction, error){		
                    if(this.debug){
                        console.log('Query failed: ' + error.message)		
                    }
                    clback({
                        "error": "query failed: " + error.message
                    })
                });
            });
        }
    }, 
    _TableDelete: function({
        tablename
    }={},clback) {
        if(tablename === "" || typeof tablename === 'undefined'){
            if(this.debug){
                console.log(`error tablename : undefined`);
            }
            clback({
                "error": "tablename undefined"
            })
        }else{
            if(!(typeof tablename === 'string')){
                clback({
                    "error": "tablename must string"
                });
                return;
            }

            var resquery = `DROP TABLE ${tablename}`;
            resquery = resquery.trim();
            //console.log(resquery);
            this.db.transaction(function (tx) {
                tx.executeSql(resquery, [], function (transaction, results) {	
                    //console.log(results);				
                    clback({
                        "success" : true
                    })					
                }, function(transaction, error){		
                    if(this.debug){
                        console.log('Query failed: ' + error.message)		
                    }
                    clback({
                        "error": "query failed: " + error.message
                    })
                });
            });
        }
    },
    _RowUpdate: function({
        tablename,
        filter
    }={},clback) {
        if(tablename === "" || typeof tablename === 'undefined'){
            if(this.debug){
                console.log(`error tablename : undefined`);
            }
            clback({
                "error": "tablename undefined"
            })
        }else if(filter === "" || typeof filter === 'undefined'){
            if(this.debug){
                console.log(`error filter : undefined`);
            }
            clback({
                "error": "filter undefined"
            })
        }else{
            if(!(typeof tablename === 'string')){
                clback({
                    "error": "tablename must string"
                });
                return;
            }

            var fil = "";
            var oprfilter = [];
            if(Object.keys(filter).length > 0){
                if(("updates" in filter)){
                    if(filter["updates"].length > 0){
                        var arrfil = [];
                        for (var i = 0; i < filter["updates"].length; i++) {
                            var keyn = Object.keys(filter["updates"][i]);	
                            arrfil.push(`${keyn}='${filter["updates"][i][keyn]}'`);						
                        }
                        oprfilter.push(arrfil.join(", "));
                    }else{
                        clback({
                            "error": "updates cant empty"
                        });
                        return;
                    }
                }
                if(("where" in filter)){
                    if(Object.keys(filter["where"]).length > 0){
                            var keyn = Object.keys(filter["where"]);
                            oprfilter.push(`WHERE ${keyn}='${filter["where"][keyn]}'`);						
                    }else{
                        clback({
                            "error": "where cant empty"
                        });
                        return;
                    }
                }
                
            }
            fil = oprfilter.length == 0 ? "" : oprfilter.join(" ");
            var resquery = `UPDATE ${tablename} SET ${fil}`;
            resquery = resquery.trim();
            //console.log(resquery);
            //return;
            this.db.transaction(function (tx) {
                tx.executeSql(resquery, [], function (transaction, results) {
                    console.log(results);				
                    clback({
                        "success" : true,
                        "rowaffected": results.rowsAffected
                    })
                }, function(transaction, error){		
                    if(this.debug){
                        console.log('Query failed: ' + error.message)		
                    }
                    clback({
                        "error": "query failed: " + error.message
                    })
                });
            });
        }
    }
}