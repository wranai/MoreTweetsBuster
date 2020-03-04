// ==UserScript==
// @name         MoreTweetsBuster
// @namespace    https://furyutei.work
// @version      0.0.4
// @description  Turn off the "More Tweets" display when open individual tweet
// @author       furyu
// @match        https://*.twitter.com/*/status/*
// @grant        none
// ==/UserScript==

( ( SCRIPT_NAME ) => {
'use strict';

const
    TOUCHED_NAME = SCRIPT_NAME + '_touched',
    ATTEMPT_PAGE_TRANSITION_TIMEOUT = 15000;

if ( window.name == TOUCHED_NAME ) {
    return;
}

// [メモ] 以下のいずれかの条件で、個別ツイート（https://twitter.com/<screen-name>/status/<tweet-id>）表示時に「その他のツイート」が表示される模様
// - クエリに "ref_src=～" を含む
// - リファラが twitter.com 以外

if (
    ( ! /\?(?:.+&)?ref_src=/.test( location.href ) ) &&
    ( ( ! document.referrer ) || ( new URL( document.referrer ).host == new URL( location.href ).host ) )
) {
    return;
}

if ( ! location.href.match( /^https:\/\/[^/]+\/[^/]+\/status\/(\d+)/ ) ) {
    return;
}

let target_tweet_id = RegExp.$1;

window.name = TOUCHED_NAME;

let attempt_page_transition = () => {
        let target_link_time = document.querySelector( 'a[href$="/status/' + target_tweet_id + '"] > time' ),
            target_link = target_link_time && target_link_time.parentNode;
        
        if ( ! target_link ) {
            return;
        }
        
        clearTimeout( giveup_timer_id );
        observer.disconnect();
        
        target_link.click()
    },
    
    observer = new MutationObserver( ( records ) => {
        attempt_page_transition();
    } ),
    
    giveup_timer_id = setTimeout( () => {
        observer.disconnect();
    }, ATTEMPT_PAGE_TRANSITION_TIMEOUT );

observer.observe( document, { childList: true, subtree: true } );

attempt_page_transition();

} )( 'MoreTweetsBuster' );
