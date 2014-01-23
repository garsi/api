//Copyright 2011 Joe Larson http://joewlarson.com
var Md={
    registerMapIframe:function(Mi) {
        this.mapIframe=Mi;
        this.current.mi_ready=1;
        this.init();
        },
    current: { promptIndex:0 },
    APIKEY: "2i6uk3mcp3rh",
    parms:{
        Location:{
            getBasic:function() {
                var locmth=null,
                    locval=$("input[name=Location]:checked").val();
                if(locval=="State") { locmth="State"; locval=$("select[name=Location_State]").val(); }
                if(locval=="Zip"  ) { locmth="Zip";   locval=$("input[name=Location_Zip]"  ).val(); }
                if(locval=="Geoloc") {
                    locmth="Geoloc";
                    locval="Detecting";
                    if(!Md.current.currentPosition || Md.current.currentPosition=="Error") {
                        navigator.geolocation.getCurrentPosition(
                            function(pos) {
                                Md.current.currentPosition=pos;
                                Md.current.currentPositionDisplay=
                                    Math.floor(Md.current.currentPosition.coords.latitude *1000)/1000 +
                                    ", " +
                                    Math.floor(Md.current.currentPosition.coords.longitude*1000)/1000
                                    ;
                                $("#Choice_Location_Geoloc .H2like").html("&#x27a4; "+Md.current.currentPositionDisplay);
                                },
                            function() {
                                Md.showMessage("GeolocError");
                                $("input[name=Location][value=USA]").click();
                                Md.current.currentPosition="Error";
                                }
                            );
                        }
                    else {
                        locval=Md.current.currentPosition;
                        }
                    }
                return { method: locmth, value: locval };
                },
            getUrl:function() {
                var obj=this.getBasic();
                if(     obj.method=="State") { return "&stateCode="+obj.value;  }
                else if(obj.method=="Zip"  ) { return "&keywords="  +obj.value;  }
                else if(obj.method=="Current") {
                    if(Md.current.currentPosition && Md.current.currentPosition!="Error") {
                        return "&centerLat="+Md.current.currentPosition.coords.latitude +
                               "&centerLng="+Md.current.currentPosition.coords.longitude +
                               "&radius=50";
                        }
                    }
                },
            getGaq:function() {
                return "location="+encodeURIComponent(this.getDisplay());
                },
            getDisplay:function() {
                var obj, sel;
                obj=this.getBasic();
                if(obj.method=="State") {
                    sel=$("select",$("input[name=Location]:checked").parentNode).get(0);
                    return Md.trim(sel.options[sel.selectedIndex].text);
                    }
                else if(obj.method=="Geoloc") {
                    return Md.trim(Md.current.currentPositionDisplay);
                    }
                else {
                    return Md.trim(obj.value);
                    }
                },
            onSet:function() {
                this.getBasic();//this will put it through the hoops if its geoloc
                }
            },
        Type:{
            getBasic:function() {
                var typval=$("input[name=Type]:checked").val();
                return { value: typval };
                },
            getUrl:function() {
                return "&"+this.getBasic().value;
                },
            getGaq:function() {
                return "type="+encodeURIComponent(this.getDisplay());
                },
            getDisplay:function() {
                var ele=$("input[name=Type]:checked").get(0);
                if(!ele) { return null; }
                return Md.trim($(ele.parentNode).text().split(":").shift());
                }
            },
        Subject:{
            getBasic:function() {
                var sbjval=$("input[name=Subject]:checked").val(),
                    sbjarr=sbjval.split(":");
                if(sbjarr.length!=2) { return { section: null, value: null }; }
                return { section: sbjarr[0], value: sbjarr[1] };
                },
            getUrl:function() {
                var obj=this.getBasic();
                if(!obj.section || obj.section=="999") { return ""; }
                else { return "&subject"+obj.section+"="+obj.value; }
                },
            getGaq:function() {
                return "subject="+encodeURIComponent(this.getDisplay());
                },                
            getDisplay:function() {
                var ele=$("input[name=Subject]:checked").get(0);
                if(!ele) { return null; }
                return Md.trim($(ele.parentNode).text());
                }
            }
        },
    init:function() {
        if(!this.current.mi_ready || !this.current.jq_ready) { return; }
        $("input").removeAttr('checked').removeAttr('selected');
        $("select").each(function(idx,ele) { ele.selectedIndex=0; });

        $(".Prompt .Choices li")
            .hover(function() { this.className+=" Hover"; },function() { this.className=this.className.split(" Hover").join(""); })
            .click(function() {
                var radele, proele, nam, arr, ai;
                radele=$("input:radio",this).get(0);
                radele.checked=true;
                proele=radele.parentNode;
                while(proele && proele.className.indexOf("Prompt")<0) {
                    proele=proele.parentNode;
                    }
                nam=proele.id.split("_").pop();
                arr=$(".Selected",proele).get();
                for(ai=0; ai<arr.length; ai++) {
                    if(arr[ai]!=radele) {
                        arr[ai].className=arr[ai].className.split(" Selected").join("");
                        }
                    }
                radele.parentNode.className+=" Selected";
                if(Md.parms[nam].onSet) {
                    Md.parms[nam].onSet();
                    }
                Md.showPromptButton(proele);
                })
            ;
        if(!navigator.geolocation) {
            $("#Choice_Location_Current").remove();
            }

        this.current.prompt$=$(".Prompt");
        $(".Loading").remove();
        this.nextPrompt();

        document.onkeydown=function(evt) {
            evt=( window.event || evt );
            if(!evt.keyCode) { evt.keyCode=evt.which; }
            if(evt.keyCode==13) {
                $(".Button:visible").click();
                }
            };
        },
    showMessage:function(nam,skphid) {
        if(this.current.showingPrompt) {
            $("#Prompt_"+this.current.showingPrompt).fadeOut();
            }
        if(!skphid) $("#SideMenu").fadeOut();
        $("#Overlay").show();
        $("#Message_"+nam).slideDown();
        },
    hideMessage:function() {
        $(".Message:visible").slideUp();
        $("#SideMenu").fadeIn();
        if(this.current.showingPrompt) {
            $("#Prompt_"+this.current.showingPrompt).fadeIn();
            }
        else {
            $("#Overlay").hide();
            }
        },
    showPromptButton:function(proele) {
        var nam=proele.id.split("_").pop(),
            val=this.parms[nam].getBasic().value;
        if(val) {
            $(".Button",proele).fadeIn().get(0).className="Button";
            }
        else {
            $(".Button",proele).get(0).className="Button Hidden";
            }
        },
    showSideMenu:function(nam) {
        var dspval;
        if(!this.parms[nam] || !this.parms[nam].wasSet) { return; }
        dspval=this.parms[nam].getDisplay();
        $("#SideMenu_"+nam+" .H2like").html(dspval);
        Md.current.sideMenuEle=$("#SideMenu_"+nam).get(0);
        },
    showPrompt:function(nam) {
        if(this.current.showingPrompt && this.current.showingPrompt!=nam) {
            this.hidePrompt($("#Prompt_"+this.current.showingPrompt).get(0));
            }
        this.current.showingPrompt=nam;
        $("#Overlay").show();
        $("#SideMenu_"+nam).css({visibility: "hidden"});
        $("#Prompt_"+nam).css({display:"block"}).css({ width: "100%", height: "100%"}).animate({left:0, marginTop: "100px"},function() {
            $("input:first",this).focus();
            Md.fixPromptPosition(this);
            });
        this.mapIframe.mapClear();
        },
    nextPrompt:function() {
        var now, hidele, shoele, shonam;
        now=new Date().getTime();
        if(this.current.nextPrompt_last && now-this.current.nextPrompt_last<1000) { return; }
        this.current.nextPrompt_last=now;
        hidele=( this.current.promptIndex>0 ? this.current.prompt$.get(this.current.promptIndex-1) : null );
        shoele=this.current.prompt$.get(this.current.promptIndex);
        shonam=( shoele ? shoele.id.split("_").pop() : null);
        this.current.showingPrompt=shonam;
        this.hidePrompt(hidele);
        if(!shoele) { this.showResults(); return;  }
        $(shoele).css({display:"block",marginTop:"50%",left:"-100%"}).animate({marginTop:"100px",left:0},function() {
            $("input:first",this).focus();
            Md.fixPromptPosition(this);
            });

        this.current.promptIndex++;
        },
    fixPromptPosition:function(ele) {
        var mgt;
        if($(ele).offset().top+ele.offsetHeight>$(window).height()) {
            mgt=($(window).height()-$(ele).offset().top-ele.offsetHeight+100);
            $(ele).css({marginTop:mgt+"px"});
            }
        },
    hidePrompt:function(hidele) {
        if(hidele) {
            var nam=hidele.id.split("_").pop();
            if(this.parms[nam]) { this.parms[nam].wasSet=true; }
            this.showSideMenu(nam);
            $(hidele).css({display:"block",left:0}).animate({left:(document.body.offsetWidth-240),marginTop:(this.current.promptIndex-1)*40,width: 200, height: 50},function() {
                this.style.display="none";
                $(".Note",this).remove();
                if(Md.current.sideMenuEle) {
                    Md.current.sideMenuEle.style.display="block";
                    Md.current.sideMenuEle.style.visibility="visible";
                    }
                });
            }
        },
    finalizePrompts:function() {
        $(".Prompt").each(function(idx,ele) {
            var hedele, btnele;
            if(idx===0) { return; }
            hedele=$("h1",ele).get(0);
            hedele.innerHTML=hedele.innerHTML.split(":").pop();
            $(".Back",ele).remove();
            btnele=$(".Button",ele).get(0);
            btnele.value="Update \u25BA";
            btnele.onclick=function() {
                var nam=this.id.split("_").pop();
                Md.hidePrompt($("#Prompt_"+nam).get(0));
                Md.showResults();
                };
            });
        $("#SideMenu li").each(function(idx,ele) {
            ele.title=ele.getAttribute("data-title");
            ele.style.cursor="pointer";
            ele.onclick=function() {
                Md.showPrompt(this.id.split("_").pop());
                };
            });
        this.current.showingPrompt=null;
        },
    showResults:function() {
        Md.showMessage('Loading',true);
        setTimeout(function() { Md.showResults_continue(); },333);
        //the above delay resolves a problem: sometimes the response is really fast, sometimes slow.  but we kind of need to show the Loading message always.  without a delay, that's weird. but it also gives the impression that some care is being given to selection...
        },
    showResults_continue:function() {
        var url, gaq;
        url=["http://api.donorschoose.org/common/json_feed.html?sortBy=0&APIKey=",this.APIKEY,"&callback=Md.response"];
        gaq=[];
        url.push(this.parms.Location.getUrl()); gaq.push(this.parms.Location.getGaq());
        url.push(this.parms.Type.getUrl());     gaq.push(this.parms.Type.getGaq());
        url.push(this.parms.Subject.getUrl());  gaq.push(this.parms.Subject.getGaq());
        $.getScript(url.join(""));
        this.finalizePrompts();
        _gaq.push(['_trackPageview', '/dgc/results?'+gaq.join("&")]);
        },
    trim:function(txt) {
        return txt.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        },
    response:function(rsp) {
        this.hideMessage();
        if(!rsp.proposals || rsp.proposals.length===0) {
            this.showMessage("NoneFound");
            }
        else {
            $("#Overlay").fadeOut(function() { this.style.display="None"; });
            this.mapIframe.mapProposals(rsp);
            }
        }
    };
$(function() {
    Md.current.jq_ready=1;
    Md.init();
    });