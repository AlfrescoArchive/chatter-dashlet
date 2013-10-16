function main()
{
   var endpointId = "chatter-oauth",
      contentEndpointId = "chatter-content",
      connector = remote.connect(endpointId);

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
         clientId: connector != null ? connector.getDescriptor().getStringProperty("client-id") : "",
         authorizationUrl: "https://login.salesforce.com/services/oauth2/authorize",
         baseUrl: "https://eu2.salesforce.com"
      }
   };
   
   model.widgets = [dashlet, dashletResizer, dashletTitleBarActions];
}
main();