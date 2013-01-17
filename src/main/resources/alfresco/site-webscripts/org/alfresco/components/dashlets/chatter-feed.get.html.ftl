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
      <div class="dashlet chatter-dashlet">
         <div class="title">${msg('dashlet.title')}</div>
         <div class="body scrollableList" <#if args.height??>style="height: ${args.height}px;"</#if>>
            <div id="${id}-connect" class="connect">
               <div>${msg('message.notConnected')}</div>
               <button id="${id}-connectButton" name="connectButton">${msg('button.connect')}</button>
            </div>
            <div id="${id}-feed" class="chatter-feed"></div>
         </div>
      </div>
   </@uniqueIdDiv>
</@markup>