function main()
{
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
         // TODO Need to get these values from the web tier config (same source as used by connector)
         clientId: "3MVG9rFJvQRVOvk5W_CrNgQGmoMhFjPC9PwFpIjLhSg7NbTgFtylPj3On557sgBstlxXsG.Xr2wQqfNkdMfKy"
      }
   };
   
   model.widgets = [dashlet, dashletResizer, dashletTitleBarActions];
}
main();