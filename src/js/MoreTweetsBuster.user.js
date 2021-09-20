// ==UserScript==
// @name            MoreTweetsBuster
// @name:ja         『その他のツイート』排除
// @namespace       https://furyutei.work
// @license         MIT
// @version         0.0.11
// @description     Turn off the "More Tweets" display when open individual tweet
// @description:ja  個別ツイートを開いた際の『その他のツイート』表示を抑制
// @author          furyu
// @match           https://*.twitter.com/*/status/*
// @grant           none
// @compatible      chrome
// @compatible      firefox
// @supportURL      https://github.com/furyutei/MoreTweetsBuster/issues
// @contributionURL https://memo.furyutei.work/about#send_donation
// ==/UserScript==

( ( SCRIPT_NAME ) => {
'use strict';

const
    TOUCHED_NAME = SCRIPT_NAME + '_touched',
    USER_AGENT = window.navigator.userAgent.toLowerCase();

if ( window.name == TOUCHED_NAME ) {
    return;
}

// [メモ] 以下のいずれかの条件で、個別ツイート（https://twitter.com/<screen-name>/status/<tweet-id>）表示時に「その他のツイート」が表示される模様
// - クエリに "ref_src=～" を含む
// - [クエリに "s=20" を含む](https://twitter.com/esperecyan/status/1239330675897049090)
// - リファラが twitter.com 以外
if ( ! (
    ( /\?(?:.+&)?(?:ref_src|s)=/.test( location.href ) ) ||
    ( document.referrer && ( new URL( document.referrer ).host != new URL( location.href ).host ) )
) ) {
    return;
}

const
    parse_status_url = ( url ) => {
        const
            match_result = new URL( url, location.href ).pathname.match( /^\/([^/]+)\/status\/(\d+)/ );
        
        if ( ! match_result ) return {};
        
        return {
            screen_name : match_result[ 1 ],
            tweet_id : match_result[ 2 ]
        };
    },
    location_status_info = parse_status_url( location.href );

if ( ! location_status_info.tweet_id ) {
    return;
}

try {
    window.name = TOUCHED_NAME;
}
catch ( error ) {
    console.info( 'window.name could not be changed', error );
}

const
    do_page_transition = ( url ) => {
        if ( ! url ) return;
        
        // TODO: ページ読み込みを発生させないために pushState を使用しているが、Twitter側で state の構造（特に key）が変わってしまうとうまく動かなくなる
        try {
            const
                state = {
                    key : 'r80bpk',
                    state : {
                        fromApp : true,
                        previousPath : location.pathname,
                    },
                },
                pop_state_event = new PopStateEvent( 'popstate', { state : state } );
            
            history.pushState( state, '', new URL( url ).pathname );
            dispatchEvent( pop_state_event );
        }
        catch ( error ) {
            location.href = url;
        }
    },
    transition_url = new URL( `/${location_status_info.screen_name}/status/${location_status_info.tweet_id}`, location.href ).href;

if ( USER_AGENT.indexOf('firefox') != -1 ) {
    // TODO: Firefoxの場合、pushStateによる遷移では「その他のツイート」表示が消えない
    location.href = transition_url;
    return;
}

do_page_transition( transition_url );

} )( 'MoreTweetsBuster' );
