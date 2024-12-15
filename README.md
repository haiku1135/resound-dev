# RESOUND is Music Diary App!
RESOUNDはhaiku1135が個人で開発した（簡単に言えば）音楽日記アプリです。
昔聴いていた曲を今聴いてみると、当時の風景や楽しかった思い出、時には悩んでいた思い出が蘇ってくるという経験はありませんか？
私は音楽が好きでしょっちゅう音楽を聴きながら散歩しているせいか良くこのような経験があったのでremind(思い出す)、sound(音)を掛けてRESOUNDというアプリを作りました。

## RESOUNDの技術選定
RESOUNDはフロント側にReact,Next.js、バック側はBaaSのSupabaseを使って開発しています。
今後どんどんアップデートする予定なのでフロント側では実務で使い慣れているVue.jsではなくReactそしてNext.jsを選定しました。Vue.jsのProgressive Framework自体に懐疑的なこと（規模が大きくなるにつれて理解しなければいけないことが多すぎる、確かに漸進的なのかもしれないですが私からするとキツいかなと感じました。）
バックエンドに関しては早く作成してリリースしたかったため、BaaSのSupabaseを選定しました。

## 悩んだところ
・認証
  認証ではSupabaseを使いましたが初めて使ったということもあり、公式ドキュメントと睨めっこしながらコーディングしていました。一方で理解すると簡単に出来るのでSupabase最高と今では感じています。
・DB設計
  今現在（2024/12）でも適切なテーブルが作れていると考えていません。いくらBaaSと言っても今後のアップデートのためにDB周辺の知識をつけていく必要があるなと思っています。

## 個人開発をしてみて
まだユーザーは私1人ですが技術的な理解の定着以上に自分が作ったプロダクトに愛着が湧いています。これからどんどんアップデートしていって私の知らない誰かがこのアプリで思い出に浸れるような未来をつくりたいです。

