# POSSIBLE

Before running application:

    run "npm install"
    
I was unable to fetch the Spotify API due to troubles with 
authorization, thus I used the web console to create local JSON files 
to stimulate what would occur if I was able to fetch data from the server. 

This is why when viewing the "data" folder in the public folder, there is the "list-playlist.JSON" file
from fetching playlists from a specific user, a "playlist-track" folder containing the all of the tracks 
for each specific playlist, and finally, a "audio-feature" folder containing the audio feature information
of all tracks for a specific playlist.

To create these files, I used the list-playlist.JSON 

* Note: When searching for a user id, _my Spotify user id (1233291715)_ only works in displaying specific data

When retrieving data from the Spotify API, I would use PHP to make a POST request to retrieve the access token, 
and then use a GET request to the PHP file from the App.JS file to attain the access token to make further
requests to the Spotify API.

## List of JS Libraries used:
- React
- Bootstrap

## View Site
You can view the live version, hosted on GitHub here: link
