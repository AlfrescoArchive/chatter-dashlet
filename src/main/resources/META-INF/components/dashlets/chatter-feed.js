/**
 * Copyright (C) 2005-2009 Alfresco Software Limited.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.

 * As a special exception to the terms and conditions of version 2.0 of 
 * the GPL, you may redistribute this Program in connection with Free/Libre 
 * and Open Source Software ("FLOSS") applications as described in Alfresco's 
 * FLOSS exception.  You should have recieved a copy of the text describing 
 * the FLOSS exception, and it is also available here: 
 * http://www.alfresco.com/legal/licensing
 */
 
/**
 * Chatter Feed component.
 * 
 * @namespace Alfresco
 * @class Alfresco.dashlet.ChatterFeed
 */
(function()
{
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event;

   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML,
      $combine = Alfresco.util.combinePaths;

   /**
    * Preferences
    */
   var PREFERENCES_DASHLET = "org.alfresco.share.dashlet",
      PREF_SITE_TAGS_FILTER = PREFERENCES_DASHLET + ".siteTagsFilter";


   /**
    * Dashboard ChatterFeed constructor.
    * 
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.dashlet.ChatterFeed} The new component instance
    * @constructor
    */
   Alfresco.dashlet.ChatterFeed = function ChatterFeed_constructor(htmlId)
   {
      return Alfresco.dashlet.ChatterFeed.superclass.constructor.call(this, "Alfresco.dashlet.ChatterFeed", htmlId);
   };

   /**
    * Extend from Alfresco.component.Base and add class implementation
    */
   YAHOO.extend(Alfresco.dashlet.ChatterFeed, Alfresco.component.Base,
   {
      /**
       * Object container for initialization options
       *
       * @property options
       * @type object
       */
      options:
      {
         /**
          * Max items
          * 
          * @property maxItems
          * @type integer
          * @default 50
          */
         maxItems: 50,

         /**
          * Currently active filter.
          * 
          * @property activeFilter
          * @type string
          * @default "all"
          */
         activeFilter: "all",
         
         /**
          * Identifier used for storing the an OAuth 2.0 token in the repository personal credentials
          * store.
          * 
          * @property providerId
          * @type string
          * @default "chatter"
          */
         providerId: "chatter",
         
         /**
          * URI of the provider's authorization page. If an access token does not already exist then the
          * user will be sent here in order to obtain one.
          * 
          * @property loginUrl
          * @type string
          * @default "https://login.salesforce.com"
          */
         loginUrl: "https://login.salesforce.com",
         
         /**
          * OAuth client (application) ID
          * 
          * Must be included as a URL parameters when the user is sent to the provider's authorization page
          * 
          * @property clientId
          * @type string
          * @default ""
          */
         clientId: "",
         
         /**
          * URL of the web script (minus the leading slash) to be used as the return landing page after
          * authorization has taken place. The script must exhange the temporary code for an access
          * token and persist it to the repository.
          * 
          * @property returnPage
          * @type string
          * @default "integrations/salesforce/chatter-return"
          */
         returnPage: "integrations/salesforce/chatter-return",
         
         baseUrl: "https://na14.salesforce.com"
      },

      /**
       * Tags DOM container.
       * 
       * @property tagsContainer
       * @type object
       */
      tagsContainer: null,

      /**
       * ContainerId for tag scope query
       *
       * @property containerId
       * @type string
       * @default ""
       */
      containerId: null,

      /**
       * Fired by YUI when parent element is available for scripting
       * @method onReady
       */
      onReady: function ChatterFeed_onReady()
      {
         Alfresco.util.createYUIButton(this, "connectButton", this.onConnectClick);
          
         // Try to find a ticket
         // TODO make this a service
         var tokenName = this.options.providerId;
         Alfresco.util.Ajax.jsonGet({
            url: Alfresco.constants.PROXY_URI + "oauth/token/" + tokenName + "?name=" + tokenName,
            successCallback: {
               fn: function onReady_getToken_success(p_obj) {
                  this.token = p_obj.json.accessToken;
                  this.loadFeed();
               },
               scope: this
            },
            failureCallback: {
               fn: function onReady_getToken_failure(p_obj) {
                  if (p_obj.serverResponse.status == 404)
                  {
                  }
                  else
                  {
                     alert("An unknown error occurred while fetching the user ticket");
                  }
               },
               scope: this
            }
         });
          /*
         var me = this;
         
         // The tags container
         this.tagsContainer = Dom.get(this.id + "-tags");
         
         // Hook the refresh icon click
         Event.addListener(this.id + "-refresh", "click", this.onRefresh, this, true);

         // Preferences service
         this.services.preferences = new Alfresco.service.Preferences();

         // "All" filter
         this.widgets.all = new YAHOO.widget.Button(this.id + "-all",
         {
            type: "checkbox",
            value: "all",
            checked: true
         });
         this.widgets.all.on("checkedChange", this.onAllCheckedChanged, this.widgets.all, this);

         // Dropdown filter
         this.widgets.filter = new YAHOO.widget.Button(this.id + "-filter",
         {
            type: "split",
            menu: this.id + "-filter-menu",
            lazyloadmenu: false
         });
         this.widgets.filter.on("click", this.onFilterClicked, this, true);
         // Clear the lazyLoad flag and fire init event to get menu rendered into the DOM
         var menu = this.widgets.filter.getMenu();
         menu.subscribe("click", function (p_sType, p_aArgs)
         {
            var menuItem = p_aArgs[1];
            if (menuItem)
            {
               me.widgets.filter.set("label", menuItem.cfg.getProperty("text"));
               me.onFilterChanged.call(me, p_aArgs[1]);
            }
         });
         
         if (this.options.activeFilter == "all")
         {
            this.widgets.filter.value = "documentLibrary";
            this.setActiveFilter("all");
         }
         else
         {
            this.widgets.filter.value = this.options.activeFilter;

            // Loop through and find the menuItem corresponding to the default filter
            var menuItems = menu.getItems(),
               menuItem,
               i, ii;

            for (i = 0, ii = menuItems.length; i < ii; i++)
            {
               menuItem = menuItems[i];
               if (menuItem.value == this.options.activeFilter)
               {
                  menu.clickEvent.fire(
                  {
                     type: "click"
                  }, menuItem);
                  break;
               }
            }
         }
         */
      },
      
      /**
       * Load a feed from Chatter for display in the dashlet
       * 
       * @method loadFeed
       */
      loadFeed: function ChatterFeed_loadMessages()
      {
          // Token will be copied to Authorization header by the connector
          // We cannot set the Authorization header directly because Share's proxy doesn't like it
          YAHOO.util.Connect.initHeader("X-OAuth-Token", "OAuth " + this.token); 
          // Get the feed from the server
          Alfresco.util.Ajax.jsonGet({
              url: Alfresco.constants.PROXY_URI.replace("/alfresco/", "/chatter/") + 
                  "services/data/v26.0/chatter/feeds/news/me/feed-items",
              dataObj: {
              },
              successCallback: {
                  fn: this.renderFeed,
                  scope: this
              },
              failureCallback: {
                  fn: function() {
                      // TODO try to re-authenticate in case of a 401
                      Alfresco.util.PopupManager.displayMessage({
                          text: this.msg("error.loadFeed")
                      });
                  },
                  scope: this
              },
              noReloadOnAuthFailure: true
          });
          YAHOO.util.Connect.resetDefaultHeaders();
      },
      
      /**
       * Render the feed in the dashlet
       * 
       * @method renderFeed
       */
      renderFeed: function ChatterFeed_renderFeed(p_obj)
      {
         // Hide the existing content
         //Dom.setStyle(this.id + "-feed", "display", "none");
          var cEl = Dom.get(this.id + "-feed"),
              data = p_obj.json;
          
          cEl.innerHTML = this._itemsHTML(data);
      },
      
      /**
       * Generate items markup
       * 
       * @method _itemsHTML
       * @private
       */
      _itemsHTML: function ChatterFeed__itemsHTML(json)
      {
          var message, client, postedOn, postedLink, u, profileUri, mugshotUri, uname, html = "";
          if (json.items)
          {
              for (var i = 0; i < json.items.length; i++)
              {
                  // TODO use messageSegments
                  // TODO add actions
                  
                  message = json.items[i];
                  u = message.actor;
                  profileUri = u ? u.url : null;
                  mugshotUri = u && u.photo ? u.photo.smallPhotoUrl : null;
                  uname = u ? u.name : null;
                  userLink = "<a href=\"" + profileUri + "\" title=\"" + $html(uname) + "\" class=\"theme-color-1\">" + $html(uname) + "</a>";
                  html += "<div class=\"chatter-item detail-list-item\">" + "<div class=\"chatter-item-hd\">" + 
                      "<div class=\"user-icon\"><a href=\"" + profileUri + "\" title=\"" + $html(uname) + "\"><img src=\"" + $html(mugshotUri) + "\" alt=\"" + $html(uname) + "\" width=\"48\" height=\"48\" /></a></div>" + 
                      "</div><div class=\"chatter-item-bd\">" + "<span class=\"screen-name\">" + userLink + "</span> " +
                      this._formatMessage(message.body.text) + "</div>" + "<div class=\"chatter-item-postedOn\">" +  // or message.body.parsed?
                      this._formatMeta(message) + "</div>" + "</div>";
              }
          }
          return html;
      },

      /**
       * Insert links into message text to highlight links
       * 
       * @method _formatMessage
       * @private
       * @param {string} text The plain message
       * @return {string} The formatted text, with hyperlinks added
       */
      _formatMessage: function ChatterFeed__formatMessage(text)
      {
         var refsRe = /\[\[(\w+):(\w+)\]\]/gm;
         function formatRef(str, p1, p2, offset, s)
         {
             return str;
         };
         text = text.replace(
               /https?:\/\/\S+[^\s.]/gm, "<a href=\"$&\">$&</a>").replace(refsRe, formatRef);
         return text;
      },
      
      /**
       * Get relative time where possible, otherwise just return a simple string representation of the supplied date
       * 
       * @method _relativeTime
       * @private
       * @param d {date} Date object
       */
      _relativeTime: function ChatterFeed__getRelativeTime(d)
      {
          return typeof(Alfresco.util.relativeTime) === "function" ? Alfresco.util.relativeTime(d) : Alfresco.util.formatDate(d);
      },
      
      /**
       * Format the item metadata displayed underneath the text
       * 
       * @method _formatMeta
       * @private
       * @param item {object} Item object
       */
      _formatMeta: function ChatterFeed__formatMeta(item)
      {
          var postedOn = item.createdDate,
              clientInfo = item.clientInfo,
              url = this.options.baseUrl + item.url,
              clientLink = null;
          
          if (clientInfo && clientInfo.applicationName)
          {
              if (clientInfo.applicationUrl && clientInfo.applicationUrl != "null")
              {
                  clientLink = "<a href=\"" + clientInfo.applicationUrl + "\">" + clientInfo.applicationName + "</a>";
              }
              else
              {
                  clientLink = clientInfo.applicationName;
              }
          }
          
          var postedLink = "<a href=\"" + url + "\"><span class=\"chatter-item-date\" title=\"" + postedOn + "\">" + this._relativeTime(new Date(postedOn)) + "</span><\/a>";
          
          return clientLink ? this.msg("text.msgFullDetails", postedLink, clientLink) : this.msg("text.msgDetails", postedLink, clientLink);
      },
      
      /**
       * Event handler for refresh click
       * @method onRefresh
       * @param e {object} Event
       */
      onRefresh: function ChatterFeed_onRefresh(e)
      {
         if (e)
         {
            // Stop browser's default click behaviour for the link
            Event.preventDefault(e);
         }
         this.refreshTags();
      },
      
      /**
       * Refresh tags
       * @method refreshTags
       */
      refreshTags: function ChatterFeed_refreshTags()
      {
         // Hide the existing content
         Dom.setStyle(this.tagsContainer, "display", "none");
         
         // Make an AJAX request to the Tag Service REST API
         Alfresco.util.Ajax.jsonGet(
         {
            url: Alfresco.constants.PROXY_URI + "api/tagscopes/site/" + $combine(this.options.siteId, this.containerId, "tags"),
            successCallback:
            {
               fn: this.onTagsSuccess,
               scope: this
            },
            failureCallback:
            {
               fn: this.onTagsFailed,
               scope: this
            },
            scope: this,
            noReloadOnAuthFailure: true
         });
      },

      /**
       * Tags retrieved successfully
       * @method onTagsSuccess
       * @param p_response {object} Response object from request
       */
      onTagsSuccess: function ChatterFeed_onTagsSuccess(p_response)
      {
         // Retrieve the tags list from the JSON response and trim accordingly
         var tags = p_response.json.tags.slice(0, this.options.maxItems),
            numTags = tags.length,
            totalTags = 0,
            html = "",
            i, ii;

         // Work out total number of tags for scaling
         for (i = 0, ii = tags.length; i < ii; i++)
         {
            totalTags += tags[i].count;
         }

         // Tags to show?
         if (tags.length === 0)
         {
            html = '<div class="msg">' + this.msg("message.no-tags") + '</div>';
         }
         else
         {
            // Define inline scaling functions
            var tag,
               fnTagWeighting = function tagWeighting(thisTag)
               {
                  return thisTag.count / (totalTags / numTags);
               },
               fnTagFontSize = function tagFontSize(thisTag)
               {
                  return (0.5 + fnTagWeighting(thisTag)).toFixed(2);
               },
               fnSortByTagAlphabetical = function sortByTagAlphabetical(tag1, tag2)
               {
                  if (tag1.name < tag2.name)
                     return -1;
                  
                  if (tag1.name > tag2.name)
                     return 1;
                  
                  return 0;
               };
               
            // Sort tags alphabetically - standard for tag clouds
            tags.sort(fnSortByTagAlphabetical);

            // Generate HTML mark-up for each tag
            for (i = 0, ii = tags.length; i < ii; i++)
            {
               tag = tags[i];
               html += '<div class="tag"><a href="' + this.getUriTemplate(tag) + '" class="theme-color-1" style="font-size: ' + fnTagFontSize(tag) + 'em">' + $html(tag.name) + '</a></div> ';
            }
         }
         this.tagsContainer.innerHTML = html;
         
         // Fade the new content in
         Alfresco.util.Anim.fadeIn(this.tagsContainer);
      },

      /**
       * Tags request failed
       * @method onTagsFailed
       */
      onTagsFailed: function ChatterFeed_onTagsFailed()
      {
         this.tagsContainer.innerHTML = this.msg("refresh-failed");
         Alfresco.util.Anim.fadeIn(this.tagsContainer);
      },
      
      /**
       * Generate Uri template based on current active filter
       * @method getUriTemplate
       * @param tag {object} Tag object literal
       */
      getUriTemplate: function ChatterFeed_getUriTemplate(tag)
      {
         var uri = Alfresco.constants.URL_CONTEXT + 'page/site/' + this.options.siteId;
         switch (this.options.activeFilter)
         {
            case "wiki":
               uri += '/wiki';
               break;

            case "blog":
               uri += '/blog-postlist';
               break;

            case "documentLibrary":
               uri += '/documentlibrary#filter=tag|' + encodeURIComponent(tag.name);
               break;

            case "calendar":
               uri += '/calendar';
               break;

            case "links":
               uri += '/links';
               break;

            case "discussions":
               uri += '/discussions-topiclist';
               break;
            
            default:
               uri += '/search?tag=' + encodeURIComponent(tag.name) + '&amp;a=false';
         }
         return uri;
      },

      /**
       * Sets the active filter highlight in the UI
       * @method updateFilterUI
       */
      updateFilterUI: function ChatterFeed_updateFilterUI()
      {
         switch (this.options.activeFilter)
         {
            case "all":
               Dom.removeClass(this.widgets.filter.get("element"), "yui-checkbox-button-checked");
               break;

            default:
               this.widgets.all.set("checked", false, true);
               Dom.addClass(this.widgets.filter.get("element"), "yui-checkbox-button-checked");
               break;
         }
      },

      /**
       * Saves active filter to user preferences
       * @method saveActiveFilter
       * @param filter {string} New filter to set
       * @param noPersist {boolean} [Optional] If set, preferences are not updated
       */
      setActiveFilter: function ChatterFeed_saveActiveFilter(filter, noPersist)
      {
         this.options.activeFilter = filter;
         this.containerId = filter !== "all" ? filter : "";
         this.updateFilterUI();
         this.refreshTags();
         if (noPersist !== true)
         {
            this.services.preferences.set(PREF_SITE_TAGS_FILTER, filter);
         }
      },

      /**
       * YUI WIDGET EVENT HANDLERS
       * Handlers for standard events fired from YUI widgets, e.g. "click"
       */
      
      onConnectClick: function ChatterFeed_onConnectClick(p_oEvent)
      {
         // TODO if this is a site dashboard we need to persist the location of the page we started from,
         // since it seems URL parameters specified on the return URL are not preserved.
          
         var returnUrl = window.location.protocol + "//" + window.location.host + 
               Alfresco.constants.URL_PAGECONTEXT + this.options.returnPage,
            authUri = this.options.loginUrl + 
               "/services/oauth2/authorize?response_type=code&client_id=" + 
               this.options.clientId + "&redirect_uri=" +
               encodeURIComponent(returnUrl);
         
         window.location = authUri;
         
      },

      /**
       * All tasks
       * @method onAllCheckedChanged
       * @param p_oEvent {object} Button event
       * @param p_obj {object} Button
       */
      onAllCheckedChanged: function ChatterFeed_onAllCheckedChanged(p_oEvent, p_obj)
      {
         this.setActiveFilter("all");
         p_obj.set("checked", true, true);
      },

      /**
       * Filter button clicked event handler
       * @method onFilterClicked
       * @param p_oEvent {object} Dom event
       */
      onFilterClicked: function ChatterFeed_onFilterClicked(p_oEvent)
      {
         this.setActiveFilter(this.widgets.filter.value);
      },
      
      /**
       * Filter drop-down changed event handler
       * @method onFilterChanged
       * @param p_oMenuItem {object} Selected menu item
       */
      onFilterChanged: function ChatterFeed_onFilterChanged(p_oMenuItem)
      {
         var filter = p_oMenuItem.value;
         this.widgets.filter.value = filter;
         this.setActiveFilter(filter);
      }
   });
})();
