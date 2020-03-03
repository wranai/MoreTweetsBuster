// ==UserScript==
// @name         MoreTweetsBuster
// @namespace    https://furyutei.work
// @version      0.0.1
// @description  Turn off the "More Tweets" display when open individual tweet
// @author       furyu
// @match        https://*.twitter.com/*/status/*
// @grant        none
// ==/UserScript==

( () => {
'use strict';

if ( location.href.match( /^(.*)\?(?:.+&)?ref_url=/ ) ) {
    // [メモ]クエリに "ref_url=～" が含まれていると「その他のツイート」が表示される→クエリ無しURLにリダイレクト
    location.replace( RegExp.$1 );
    return;
}

if ( ( ! document.referrer ) || ( new URL( document.referrer ).host == new URL( location.href ).host ) ) {
    return;
}

// [メモ]リファラが twitter.com 以外の場合、「その他のツイート」が表示される→ document.referrer が twitter.com になるようにリダイレクト
//location.reload(); // Firefox だと document.referrer は変わらない
location.replace( location.href );

} )();
