/** -*- compile-command: "jslint-cli app.js" -*-
 *
 * Copyright (C) 2011 Cedric Pinson
 *
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 *
 */

var FakeTweets;
var Socket;
var LastTweetReceived = new Date();
var ConnectionTimeoutCheck = 10;
var CheckNetworkTimeout;
var NbCheckNetworkTimeout = 0;
var StreamConnected = 0;

function startNetwork() {
  try {
    console.log('startNetwork()');
    jQuery('#connection').show();
    jQuery('#connection').removeClass('hidden');

    // change here to point to your socket.io server
//      var socket = new io.Socket("184.106.112.6",{ port: 22048 });
    Socket = io();
//      Socket.connect();
    Socket.on('tweet', function (message) {
//          console.log('TWEET RECEIVED!!');
      //console.log(message);
      hideConnection();
      LastTweetReceived = new Date();
      processTweet(message);
    });
    Socket.on('connect', function (message) {
      Connected = true;
      StreamConnected += 1;
      if (StreamConnected === 1) {
        showInstructions();
      }
      hideConnection();
      LastTweetReceived = new Date();
      Socket.emit('message');
      console.log("connected to server");
      //checkNetwork();
    });
    Socket.on('disconnect', function (message) {
      if (DemoState.running === true) {
        showConnection();
        osg.log("disconnect, try to reconnect");

        if (Socket !== undefined) {
          Socket.connect();
        } else {
          startNetwork();
        }
      }
    });
    Socket.on('error', function (message) {
      osg.log("error, try to reconnect");
      showConnection();
      if (Socket !== undefined) {
        Socket.connect();
      } else {
        startNetwork();
      }
    });

    osg.log("run the checker every " + ConnectionTimeoutCheck + " seconds");
    //setTimeout(checkNetwork, ConnectionTimeoutCheck*1000);

  } catch (er) {
    hideConnection();
    showInstructions();
    osg.log(er);
    osg.log("offline mode, emitting fake tweets");
    jQuery.getJSON("js/samples.json", function (data) {
      osg.log("offline data ready, emitting fake tweets");
      FakeTweets = data;
      var tweetIndex = 0;
      var emitFakeTweet = function () {
        tweetIndex = (tweetIndex + 1) % FakeTweets.length;
        processTweet(FakeTweets[tweetIndex]);
        window.setTimeout(emitFakeTweet, 0.25 * 1000);
      };
      emitFakeTweet();

    });
  }
}