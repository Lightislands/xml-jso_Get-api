                                                                // ------- mocking provided data
const testData = {
    json: 'http://www.mocky.io/v2/5a9566603500005b009b12a0',
    xml: 'http://www.mocky.io/v2/5a95697d35000050009b12c4'
};
                                                                // ------- create all DOM vars for easy replacement
let DOM = {
    tagName: 'loans',
    dataHolder: 'data'
};

                                                                // create single source of truth to have better state control and testability in future
let storage = {
    data: "",
    getData: function() {
        return this.data;
    },
    setData: function(x) {
        this.data = x;
    }
};

let model = {
    parseXsml(data){
        let tmp = new DOMParser();
        return tmp.parseFromString( data , "text/xml" );
    },
                                                                // ------- convert xml to proceed with one data type
    xmlToJson(xml){
        let xmlData = {};

        let details = xml.getElementsByTagName(DOM.tagName);
        for (let i = 0; i < details.length; i++) {
            if (details[i].childNodes) {
                for (let j = 0; j < details[i].childNodes.length; j++) {
                    let detail = details[i].childNodes[j];
                    if (detail.nodeType === 1)
                        xmlData[detail.nodeName] = detail.firstChild.nodeValue;
                }
            }
        }
        return xmlData;
    }
};



let controller = {
    jsonData(json){
        let data = json[0];
        data.format = 'json';
        storage.setData(data);
        buildList();
    },

    xmlData(xmlText){
        let xml = model.parseXsml(xmlText);
        let data = model.xmlToJson(xml);
        data.format = 'xml';
        storage.setData(data);
        buildList();
    }
};



async function makeRequest(format) {
                                                                // ------- await response of fetch call
        let response = await fetch(testData[format]); // /loans/?format=api
                                                                // ------- only proceed once promise is resolved
        if(format === 'json'){
            controller.jsonData(await response.json());
        }else {
            controller.xmlData(await response.text());
        }
}


function buildList(){
    let json = storage.getData();
    let htmlStr = "";
    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            htmlStr += `<li><span>${key}</span><span>${json[key]}</span></li>`
        }
    }
    document.getElementById(DOM.dataHolder).innerHTML = htmlStr;
}

