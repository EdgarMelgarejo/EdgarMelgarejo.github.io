var links = document.getElementsByClassName("lnkForm");
links = Array.from(links);

const formsTarget = new Array();
links.forEach((link)=>{
    formsTarget.push(document.getElementById(link.getAttribute("form")));
    link.addEventListener("click", (element)=>{
        formsTarget.forEach((form)=>{
            form.className = 'hide';
        });
        document.getElementById(element.currentTarget.getAttribute("form")).className=''; 
    });;    
});

const url = "https://675ck2pzdl.execute-api.us-east-1.amazonaws.com/default/";
var butons = document.getElementsByClassName("btn");
butons = Array.from(butons);
butons.forEach((buton)=>{
    buton.addEventListener("click", (element)=>{
        var data = formToDataJSon(element.currentTarget.parentNode);
        var body ={};
        var action = element.currentTarget.getAttribute("action");
        body[action] = data;
        var request = {
            method: 'POST',
            body: JSON.stringify(body), 
            mode: 'cors'
        };
        fetch(url,request)
        .then(response => response.json()) 
        .then(json => {
            switch(action){
                case 'login':
                    loginSuccess(json);
                        break;
                case 'register':
                    registerSuccess(json);
                        break;
                case 'forgot':
                    forgotSuccess(json);
                        break;
            }
        })
        .catch((error) => {
          console.log(error);
        });;
    });;    
});

const urlParams = new URLSearchParams(window.location.search);
const state = urlParams.get('state');
loginSuccess= (data)=>{
    alert(JSON.stringify(data))
    if(data && data.isValid==1){
        //redirect
        var vtx= "https://vtexid.vtex.com.br/VtexIdAuthSiteKnockout/ReceiveAuthorizationCode.ashx";
        vtx+="?state="+state;
        vtx+="&codeAuth="+data.codeAuth;
        window.location.replace(vtx);
    }else{
        alert(data.message);

    }
};
registerSuccess= (data)=>{
    alert(JSON.stringify(data))
    if(data && data.isValid==1){
        //redirect
    }
};
forgotSuccess= (data)=>{
    alert(JSON.stringify(data))
    if(data && data.isValid==1){
        formsTarget.forEach((form)=>{
            form.className = 'hide';
        });
        document.getElementById('frmLogin').className='';
    }
};
formToDataJSon = (form)=> {
    data = {};
    for (var i = 0; i < form.elements.length; i++) {
        if (form.elements[i].name && form.elements[i].name != '') {
            var elementName = form.elements[i].name;
            if (form.elements[i].type.toUpperCase() == 'RADIO' || form.elements[i].type.toUpperCase() == 'CHECKBOX') {
                if (form.elements[i].checked) {
                    if (data[elementName] != null) {

                        if (typeof data[elementName] == 'string') {
                            var firstValueArray = data[elementName];
                            data[elementName] = null;
                            data[elementName] = new Array();
                            data[elementName][0] = firstValueArray;
                        }
                        data[elementName][data[elementName].length] = form.elements[i].value.toString().trim().toUpperCase();
                    }
                    else {
                        data[elementName] = form.elements[i].value.toString().trim().toUpperCase();
                    }
                }
            } else {
                var valueTextUpper = form.elements[i].type.toUpperCase() == 'PASSWORD' ? form.elements[i].value.toString() : form.elements[i].value.toString().trim().toUpperCase();
                data[elementName] = valueTextUpper;
            }
        }
    }
    return data;
};

