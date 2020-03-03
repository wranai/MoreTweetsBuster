MoreTweetsBuster
================

- License: The MIT license  
- Copyright (c) 2020 風柳(furyu)  
- 対象ブラウザ： Google Chrome、Firefox

外部サイトからツイッターの個別ツイート（https://twitter.com/<screen_name>/status/<tweet_id>）を開いた際に表示される「その他のツイート」表示を抑制。  


■ インストール方法 
---
### ユーザースクリプト
Google Chrome＋[Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) や Firefox＋[Violentmonkey](https://addons.mozilla.org/ja/firefox/addon/violentmonkey/) 等のユーザースクリプトが動作可能な環境で、  

> [MoreTweetsBuster](http://furyutei.github.io/MoreTweetsBuster/src/js/MoreTweetsBuster.user.js)  
                                
をクリックし、指示に従ってインストール。  

※ 2020年03月03日現在、Firefox 73.0.1＋[Tampermonkey](https://addons.mozilla.org/ja/firefox/addon/tampermonkey/) 4.10.6105 の組み合わせだと Twitter 上でユーザースクリプトが動作しなくなっている模様。


■ 動作について
---
外部サイトから個別ツイートを開いた際に、「その他のツイート」が表示されない URL へとリダイレクトする。  
