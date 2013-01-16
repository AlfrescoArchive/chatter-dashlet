<@markup id="css" >
   <#-- CSS Dependencies -->
   <@link rel="stylesheet" type="text/css" href="${url.context}/res/components/dashlets/chatter-feed.css" group="dashlets"  />
</@>

<@markup id="js">
   <#-- JavaScript Dependencies -->
   <@script type="text/javascript" src="${url.context}/res/components/dashlets/chatter-feed.js" group="dashlets"/>
</@>

<@markup id="widgets">
   <@createWidgets group="dashlets"/>
</@>

<@markup id="html">
   <@uniqueIdDiv>
      <#assign id = args.htmlid>
      <div class="dashlet chatter-feed-dashlet">
         <div class="title">Chatter Feed Dashlet</div>
         <div class="body">
            <div class="dashlet-padding" id="${id}-notConnected" class="notConnected">
               <button id="${id}-connectButton" name="connectButton">${msg('button.connect')}</button>
            </div>
         </div>
      </div>
   </@uniqueIdDiv>
</@markup>