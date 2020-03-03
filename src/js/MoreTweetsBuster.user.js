// ==UserScript==
// @name         MoreTweetsBuster
// @namespace    https://furyutei.work
// @version      0.0.3
// @description  Turn off the "More Tweets" display when open individual tweet
// @author       furyu
// @match        https://*.twitter.com/*/status/*
// @grant        none
// ==/UserScript==

( ( SCRIPT_NAME ) => {
'use strict';

const
    touched_name = SCRIPT_NAME + '_touched';

let redirect_url;

if ( window.name == touched_name ) {
    return;
}

if ( location.href.match( /^(.*)\?(?:.+&)?ref_src=/ ) ) {
    window.name = touched_name;
    // [メモ]クエリに "ref_src=～" が含まれていると「その他のツイート」が表示される→クエリ無しURLにリダイレクト
    redirect_url = RegExp.$1;
    //location.replace( redirect_url );
    // [メモ]遷移元の「その他のツイート」を見たいケースも有る模様→ history に残して『戻る』ことができるようにしておく
    // TODO: 即遷移すると history に残らないケースあり？→遷移を遅らせる
    setTimeout( () => {
        location.href = redirect_url;
    }, 100 );
    return;
}

if ( ( ! document.referrer ) || ( new URL( document.referrer ).host == new URL( location.href ).host ) ) {
    return;
}

// [メモ]リファラが twitter.com 以外の場合、「その他のツイート」が表示される→ document.referrer が twitter.com になるようにリダイレクト
redirect_url = location.href.replace( /\?.*$/, '' ) + '?ref_src=' + encodeURIComponent( document.referrer );
location.replace( redirect_url );

} )( 'MoreTweetsBuster' );
