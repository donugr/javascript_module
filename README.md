# javascript_module
 bookmark purpose js module


### DATABASE FUNCTION FILENAME=00001_websqldb.js###

#Open Database Connection
const dbdata = DTBase({
	dbname, //required
	debug : false, //optional, default 'false'
	platform : "web" //optional, default 'web'
});

Example :
--------------------------------------------------------------------------------
        const dbdata = DTBase({ dbname : "db70a",debug : false});
--------------------------------------------------------------------------------

#create table
dbdata._CreateTable({
	tablename, //required
	querycollumn, //required
});

Example :
--------------------------------------------------------------------------------
        dbdata._CreateTable({ tablename : "testTable2",querycollumn : "id unique, setting_chanceawal"});
--------------------------------------------------------------------------------



#row select
dbdata._RowSelect(
{
    tablename, //required
    filter: { //optional
        "where": [
            {"collumn_name": "value_to_search"}
        ],
        "separator": "OR" // choice : OR, AND
    },
    collumreturn: [], //optional field to return in result
    orderby: { //optional
        "collumn_name":"order_code" //  choice : ASC, DESC
    },
    limit: 10 //optional,
    onlycount: false //optional, if true only return count number
}
,function(resCallback){
    console.log(resCallback);
});

Example :
--------------------------------------------------------------------------------
        dbdata._RowSelect(
            {
                tablename: "testTable2",
                filter: {
                    "where": [
                        {"id": "id123"},
                        {"setting_chanceawal": "setting_chanceawal123"}
                    ],
                    "separator": "OR"
                },
                collumreturn: [],
                orderby: {
                    "id":"ASC"
                },
                limit: 10
            }
        ,function(resCallback){
            console.log(resCallback);
        });
--------------------------------------------------------------------------------

#row insert
dbdata._RowInsert(
{
    tablename, //required
    data: {
        "collumn_name1": "collumn_value1",
        "collumn_name2": "collumn_value2",
    } // required
}
,function(resCallback){
    console.log(resCallback);
});

Example :
--------------------------------------------------------------------------------
        dbdata._RowInsert(
            {
                tablename: "testTable2",
                data: {
                    "id": "id123",
                    "setting_chanceawal": "setting_chanceawal123"
                }
            }
        ,function(resCallback){
            console.log(resCallback);
        });
--------------------------------------------------------------------------------

#row delete
dbdata._RowDelete(
{
    tablename, //required
    filter: { //required
        "where": [
            {"collumn_name": "collumn_value"}
        ],
        "separator": "OR" // choice : OR, AND
    } // required
}
,function(resCallback){
    console.log(resCallback);
});

Example :
--------------------------------------------------------------------------------
        dbdata._RowDelete(
            {
                tablename: "testTable2",
                filter: {
                    "where": [
                        {"id": "id456"},
                        {"setting_chanceawal": "setting_chanceawal123"}
                    ],
                    "separator": "OR"
                }
            }
        ,function(resCallback){
            console.log(resCallback);
        })
--------------------------------------------------------------------------------


#table delete
dbdata._TableDelete(
{
    tablename //required
}
,function(resCallback){
    console.log(resCallback);
});

Example :
--------------------------------------------------------------------------------
        dbdata._TableDelete(
            {
                tablename: "testTable"
            }
        ,function(resCallback){
            console.log(resCallback);
        });
--------------------------------------------------------------------------------

#row update
dbdata._RowUpdate(
{
    tablename, //required
    filter: { //required
        "updates": [
            {"collumn_name": "collumn_value"}
        ],
        "where": {
            "collumn_name": "collumn_value"
        }
    } // required
}
,function(resCallback){
    console.log(resCallback);
});

Example :
--------------------------------------------------------------------------------
        dbdata._RowUpdate(
            {
                tablename: "testTable2",
                filter: {
                    "updates": [                        
                        {"setting_chanceawal": "setting_chanceawal123"}
                    ],
                    "where": {
                        "id": "id123"
                    }
                }
            }
        ,function(resCallback){
            console.log(resCallback);
        });
--------------------------------------------------------------------------------


### REST API FUNCTION FILENAME=00002_restapi_graphql.js###

#open Rest API Module
const Restclara = RESTWrapper(
    { 
        platform, //optional , choice "web/apk", default "web"
        debug //optional , choice "true/false", default "false"
    }
);

Example :
--------------------------------------------------------------------------------
        const Restclara = RESTWrapper(
            { 
                platform:"web",
                debug: true
            }
        );

        or

        const Restclara = RESTWrapper();

--------------------------------------------------------------------------------

#RestAPI Request GET
Restclara._RequestsGET(
{
    requestUrl, //required
    requestHeaders, //optional
    requestTimeouts //optional, in miliseconds
}
,function(resCallback){
     console.log(resCallback);
});

Example :
--------------------------------------------------------------------------------
        Restclara._RequestsGET(
            {
                requestUrl: "https://reqres.in/api/users/2",
                requestHeaders: {},
                requestTimeouts:6000
            }
        ,function(resCallback){
            console.log(resCallback);
        });

--------------------------------------------------------------------------------

#RestAPI Request POST
Restclara._RequestsGET(
{
    requestUrl, //required
    requestData, //optional
    requestHeaders, //optional
    requestTimeouts //optional, in miliseconds
}
,function(resCallback){
     console.log(resCallback);
});

Example :
--------------------------------------------------------------------------------
        Restclara._RequestsPOST(
            {
                requestUrl: "https://reqres.in/api/login",
                requestData: {
                    "email": "eve.holt@reqres.in",
                    "password": "cityslicka"
                },
                requestHeaders: {},
                requestTimeouts:6000
            }
        ,function(resCallback){
            console.log(resCallback);
        });

--------------------------------------------------------------------------------

#RestAPI Request POST GraphQL
Restclara._RequestsGraphQL(
{
    requestUrl, //required
    requestData, //required
    requestHeaders //optional
}
,function(resCallback){
     console.log(resCallback);
});

Example :
--------------------------------------------------------------------------------
        Restclara._RequestsGraphQL(
            {
                requestUrl: "https://api.mocki.io/v2/c4d7a195/graphql",
                requestData: {
                    'query': `{
                        users  {
                            id
                            email
                            name
                        }
                    }`
                },
                requestHeaders: {
                    'x-access-token': 'xeerd'
                }
            }
        ,function(resCallback){
            console.log(resCallback);
        });

--------------------------------------------------------------------------------