package org.alfresco.integrations.salesforce.chatter;

import java.io.IOException;
import java.util.Date;

import org.alfresco.service.cmr.oauth2.OAuth2CredentialsStoreService;
import org.alfresco.service.cmr.remoteticket.NoSuchSystemException;
import org.springframework.extensions.webscripts.AbstractWebScript;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.springframework.extensions.webscripts.WebScriptResponse;

/**
 * Save an OAuth 2.0 ticket into the credentials store.
 * 
 * @author Will Abson
 */
public class SaveOAuthToken extends AbstractWebScript
{
    // Services
    private OAuth2CredentialsStoreService    oauth2CredentialsStoreService;
    
    public void setOauth2CredentialsStoreService(OAuth2CredentialsStoreService oauth2CredentialsStoreService)
    {
        this.oauth2CredentialsStoreService = oauth2CredentialsStoreService;
    }

    @Override
    public void execute(WebScriptRequest req, WebScriptResponse arg1)
            throws IOException
    {
        String remoteSystem = req.getParameter("name"), 
                accessToken = req.getParameter("token"), 
                refreshToken = req.getParameter("refreshToken");
        
        Date expiresIn = new Date(); // TODO pick this up from the request
        
        try
        {
            oauth2CredentialsStoreService.storePersonalOAuth2Credentials(remoteSystem, accessToken, refreshToken, expiresIn, new Date());
        }
        catch (NoSuchSystemException nsse)
        {
            throw nsse;
        }
    }

}
