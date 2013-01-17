/**
 * Copyright (C) 2010-2011 Share Extras contributors.
 */
(function()
{
   /**
    * Post a file to Yammer
    *
    * @method onActionPostToYammer
    * @param record {object} Object literal representing one file or folder to be actioned
    */
   YAHOO.Bubbling.fire("registerAction",
   {
      actionName: "onActionPostToChatter",
      fn: function Chatter_onActionPostToChatter(record)
      {
         var nodeRef = new Alfresco.util.NodeRef(record.nodeRef),
             documentName = record.displayName,
             documentUrl = window.location.href.substring(0, window.location.href.lastIndexOf("/")) + "/document-details?nodeRef=" + nodeRef.nodeRef;

         var token, _request = function ChatterFeed__request(config)
         {
             // Token will be copied to Authorization header by the connector
             // We cannot set the Authorization header directly because Share's proxy doesn't like it
             YAHOO.util.Connect.initHeader("X-OAuth-Token", "OAuth " + token); 
             Alfresco.util.Ajax.jsonRequest({
                 url: config.url,
                 method: config.method || "GET",
                 dataObj: config.dataObj || {},
                 successCallback: config.successCallback,
                 failureCallback: config.failureCallback,
                 noReloadOnAuthFailure: true
             });
             YAHOO.util.Connect.resetDefaultHeaders();
         };
         
         var tokenName = "chatter";
         
         Alfresco.util.Ajax.jsonGet({
            url: Alfresco.constants.PROXY_URI + "oauth/token/" + tokenName + "?name=" + tokenName,
            successCallback: {
               fn: function onReady_getToken_success(p_obj) {
                  token = p_obj.json.accessToken;

                  var titleId = this.msg("actions.post-to-chatter.title"),
                      promptId = this.msg("actions.post-to-chatter.prompt");
                  Alfresco.util.PopupManager.getUserInput({
                      title: this.msg(titleId),
                      text: this.msg(promptId),
                      value: documentName,
                      callback:
                      {
                          fn: function Chatter_onNewPostClick_postCB(value, obj) {
                              if (value != null && value != "")
                              {
                                  var dataObj = {
                                      body: {
                                          messageSegments: [{
                                              type: "Text",
                                              text: value
                                          }, {
                                              type: "Text",
                                              text: " - "
                                          }, {
                                              type: "Link",
                                              url: documentUrl
                                          }]
                                      }
                                  };
                                  
                                  // Post the update
                                  _request({
                                      url: Alfresco.constants.PROXY_URI.replace("/alfresco/", "/chatter/") + 
                                          "services/data/v26.0/chatter/feeds/news/me/feed-items",
                                      method: "POST",
                                      dataObj: dataObj,
                                      successCallback: {
                                          fn: function(o) {
                                              if (o.responseText == "")
                                              {
                                                  throw new Error("Received empty response");
                                              }
                                              else
                                              {
                                                  if (typeof o.json == "object")
                                                  {
                                                      Alfresco.util.PopupManager.displayMessage({
                                                          text: this.msg("actions.post-to-chatter.posted")
                                                      });
                                                  }
                                                  else
                                                  {
                                                      Alfresco.util.PopupManager.displayMessage({
                                                          text: this.msg("error.post-bad-resp-type")
                                                      });
                                                  }
                                              }
                                          },
                                          scope: this
                                      },
                                      failureCallback: {
                                          fn: function() {
                                              Alfresco.util.PopupManager.displayMessage({
                                                  text: this.msg("actions.post-to-chatter.postedError")
                                              });
                                          },
                                          scope: this
                                      }
                                  });
                              }
                          },
                          scope: this
                      }
                  });
               },
               scope: this
            },
            failureCallback: {
               fn: function onReady_getToken_failure(p_obj) {
                  if (p_obj.serverResponse.status == 404)
                  {
                      //this.showConnect();
                  }
                  else
                  {
                     alert("An unknown error occurred while fetching the user ticket");
                  }
               },
               scope: this
            }
         });
      }
   });
})();