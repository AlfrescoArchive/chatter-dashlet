function main()
{
   var endpointId = "chatter-api",
      contentEndpointId = "chatter-content",
      authEndpointId = "chatter-auth",
      webEndpointId = "chatter-web",
      endpoint = remote.connect(endpointId),
      authEndpoint = remote.connect(authEndpointId),
      webEndpoint = remote.connect(webEndpointId);

   var dashletResizer = {
      id : "DashletResizer",
      name : "Alfresco.widget.DashletResizer",
      initArgs : ["\"" + args.htmlid + "\"", "\"" + instance.object.id + "\""],
      useMessages: false
   };

   var dashletTitleBarActions = {
      id : "DashletTitleBarActions",
      name : "Alfresco.widget.DashletTitleBarActions",
      useMessages : false,
      options : {
         actions: [
            {
               cssClass: "help",
               bubbleOnClick:
               {
                  message: msg.get("dashlet.help")
               },
               tooltip:  msg.get("dashlet.help.tooltip")
            }
         ]
      }
   };
   
   var dashlet = {
      id : "ChatterDashlet",
      name : "Alfresco.dashlet.ChatterFeed",
      options: {
         endpointId: endpointId,
         contentEndpointId: contentEndpointId,
         clientId: endpoint !== null ? endpoint.getDescriptor().getStringProperty("client-id") : "",
         authorizationUrl: authEndpoint !== null ? authEndpoint.getDescriptor().getEndpointUrl() : "",
         baseUrl: webEndpoint !== null ? webEndpoint.getDescriptor().getEndpointUrl() : ""
      }
   };
   
   model.widgets = [dashlet, dashletResizer, dashletTitleBarActions];
}
main();