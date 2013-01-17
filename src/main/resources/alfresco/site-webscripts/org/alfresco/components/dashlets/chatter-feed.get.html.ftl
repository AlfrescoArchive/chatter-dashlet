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
         <div id="${id}-toolbar" class="toolbar flat-button">
            <div>
               <span class="align-right yui-button-align">
                  <span class="first-child">
                     <a id="${id}-newPost" href="#" class="theme-color-1">
                        <img src="${url.context}/res/components/images/edit-16.png" style="vertical-align: text-bottom" width="16" />
                        ${msg("link.addPost")}</a>
                  </span>
               </span>
            </div>
         </div>
         <div class="body scrollableList" <#if args.height??>style="height: ${args.height}px;"</#if>>
            <div id="${id}-connect" class="connect">
               <div>${msg('message.notConnected')}</div>
               <button id="${id}-connectButton" name="connectButton" disabled="disabled">${msg('button.connect')}</button>
            </div>
            <div id="${id}-feed" class="chatter-feed"></div>
         </div>
      </div>
   </@uniqueIdDiv>
</@markup>