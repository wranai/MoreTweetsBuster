// ==UserScript==
// @name            MoreTweetsBuster
// @name:ja         『その他のツイート』排除
// @namespace       https://furyutei.work
// @license         MIT
// @version         0.0.8
// @description     Turn off the "More Tweets" display when open individual tweet
// @description:ja  個別ツイートを開いた際の『その他のツイート』表示を抑制
// @author          furyu
// @match           https://*.twitter.com/*/status/*
// @grant           none
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
// - [クエリに "s=20" を含む](https://twitter.com/esperecyan/status/1239330675897049090)
// - リファラが twitter.com 以外

if ( ! (
    ( /\?(?:.+&)?(?:ref_src|s)=/.test( location.href ) ) ||
    ( document.referrer && ( new URL( document.referrer ).host != new URL( location.href ).host ) )
) ) {
    return;
}

let parse_status_url = ( url ) => {
        let match_result = new URL( url, location.href ).pathname.match( /^\/([^/]+)\/status\/(\d+)/ );
        
        return ( match_result ) ? { screen_name : match_result[ 1 ], tweet_id : match_result[ 2 ] } : {};
    },
    
    location_status_info = parse_status_url( location.href );

if ( ! location_status_info.tweet_id ) {
    return;
}

let location_tweet_id = location_status_info.tweet_id;

window.name = TOUCHED_NAME;

let attempt_page_transition = () => {
        if ( 0 < window.pageYOffset ) {
            // TODO: スクロールされていたら一番上のツイートかどうかの判定が困難
            // →暫定的に、何もせずに終了
            stop_observer();
            return;
        }
        
        let target_link_time = document.querySelector( 'a[href$="/status/' + location_tweet_id + '"] > time' ),
            target_link = target_link_time && target_link_time.parentNode;
        
        if ( ! target_link ) {
            // [メモ] Twilog 等から https://twitter.com/<retweeter>/status/<retweet-id> のように開かれると、retweet-id に一致するようなリンクが存在しない
            // →一番上のツイートが a > time を含むかどうかで判定
            let first_article = document.querySelector( 'div[data-testid="primaryColumn"] section[role="region"] article[role="article"]' );
            
            if ( ! first_article ) {
                return;
            }
            
            target_link_time = first_article.querySelector( 'a[role="link"][href*="/status/"] > time' );
            target_link = target_link_time && target_link_time.parentNode;
            
            if ( ( ! target_link ) || ( ! parse_status_url( target_link.href ).tweet_id ) ) {
                return;
            }
        }
        
        stop_observer();
        
        /*
        //if ( parse_status_url( target_link.href ).tweet_id != location_tweet_id ) {
        //    // TODO: 可能ならリツイートURLのままで「その他のツイート」を非表示にしたい（historyに残るような形でうまく遷移できない）
        //    location.href = '/' + location_status_info.screen_name + '/status/' + location_tweet_id;
        //    return;
        //}
        */
        target_link.click();
    },
    
    observer = new MutationObserver( ( records ) => {
        attempt_page_transition();
    } ),
    
    stop_observer = () => {
        if ( giveup_timer_id ) {
            clearTimeout( giveup_timer_id );
            giveup_timer_id = null;
        }
        observer.disconnect();
    },
    
    giveup_timer_id = setTimeout( () => {
        giveup_timer_id = null;
        stop_observer();
    }, ATTEMPT_PAGE_TRANSITION_TIMEOUT );

observer.observe( document, { childList: true, subtree: true } );

attempt_page_transition();

} )( 'MoreTweetsBuster' );
