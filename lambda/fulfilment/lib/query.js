//start connection
var Promise=require('bluebird')
var aws=require('./aws')
var myCredentials = new aws.EnvironmentCredentials('AWS'); 
var es=require('elasticsearch').Client({
    requestTimeout:10*1000,
    pingTimeout:10*1000,
    hosts: process.env.ES_ADDRESS,
    connectionClass: require('http-aws-es'),
    defer: function () {
        return Promise.defer();
    },
    amazonES: {
        region: process.env.AWS_REGION,
        credentials: myCredentials
    }
})

module.exports=function(req,res){
    return es.search({
        index: process.env.ES_INDEX,
        type: process.env.ES_TYPE,
        searchType:"dfs_query_then_fetch",
        body:req._query
    })
    .tap(x=>console.log("ES result:"+x))
    .then(function(result){
        res.result=result.hits.hits
        res.message=res.result.a
    })
}
