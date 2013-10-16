Salesforce Chatter Dashlet and Document Library Integration
==========================================

This project provides a custom dashlet to display recent activity from Salesforce Chatter on your Share dashboards. You can also update your Chatter status from the dashlet and post links to files to Chatter from the Document Library.

Prerequisites
-------------

* Alfresco 4.2.d or later
* Latest [Share OAuth](https://github.com/share-extras/share-oauth) libs, built from source

Checking out and Building
--------

To clone the Git repo to your local machine

    git clone https://github.com/Alfresco/chatter-dashlet.git

To build using Maven

	cd chatter-dashlet
    mvn clean package
    
The build will produce a JAR file `chatter-share/target` which should be copied either to the `WEB-INF/lib` folder inside the Share webapp (by default `tomcat/webapps/share`) or to the `tomcat/shared/lib` directory if this is enabled.

TODO
----

* Improvements to Maven build to use Maven SDK and depend on Share OAuth
* <strike>Request refresh tokens from Salesforce, so that expired access tokens can be renewed</strike>
* <strike>Move repo-tier components into the Share OAuth project</strike>
* <strike>Improvements to Share OAuth to avoid having to load access tokens in client-side code</strike>