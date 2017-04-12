# Comparatif des SDK  

Voici un court tableau qui montre mes points positifs et mes points négatifs. À noter que je ne suis pas un habitué avec les bots. Certaines de mes réflexions peuvent changer tout au long de la description des comparatifs. Il pourrait y avoir certaines contradictions.

> Les tests ont été faits sur l'intégration de Messenger avec les bots ou en terminal lorsque c'était possible.


||Botkit|Microsoft Bot|ChatFuel|BotPress|
|---|---|---|---|---|
|Installation|:-1:|:+1:|:+1:|:+1:|
|FriendlyUser|||:+1:|:+1:|
|Features|:+1:||:+1:|:+1:|
|Prise en Main|:shit:|:+1:|:boom:|:+1:|


## BotKit

J'ai déployer un heroku qui permet de communiquer avec mon Bot. Je n'ai pas réglé pour le moment le subscriptions. Je vais le faire un plutard. Le bot ne fait pas grand chose. Il répeate ce que l'utilisateur dit et il y a une petite conversation pour les gars de botpress.

[La voyance de strasboug](https://www.messenger.com/t/1766234773686722)

### Ce que J'aime

L'api est bien documenté avec des exemples. Il est différent de celui de Microsoft. Les principales commandes permettent de faire un dialogue avec les humains facilement.

* L'objet conversation est très complet.
* Écouter les évènements sur les différentes platforms.
* Rendre le bot plus humains sur facebook (Simulate Typing).

### Ce que je n'aime pas

Le getting Starter est plutôt long lorsque le développeur n'est pas familiarisé avec le Facebook développeur et le déploiement avec Heroku pour faire un Webhook rapidement. J'ai eu quelques soucis à mettre en place un simple Hello World avec BotKit. Facebook ne permet pas de faire des tests localement. On doit passer par `SSH`.

Il a fallu créer une application qui est liée avec une page. Ensuite de créer un simple serveur  qui répond 200 à une adresse. Finalement, l'exemple qui est offert par botkit pour le développement de [Facebook](https://github.com/howdyai/botkit/issues/764) ne fonctionne pas. J'ai dû passer à travers toute la documentation, pour trouver un boilerplate d’une application [Facebook avec Botkit](https://github.com/howdyai/botkit/blob/master/docs/readme-facebook.md#use-botkit-for-facebook-messenger-with-an-express-web-server).

À première vue, la documentation est très lourde pour un développeur. Il doit constamment aller d'un lien hypertexte à un autre. Ce qui rend l'utilisation pénible et peu productive.


## Microsoft bot

J'ai fait ce bot avec le terminal

### Ce que j'aime

L'introduction et l'installation est très simple.

Dans le Hello World, il apporte les points importants pour la construction d'un Bot.

* Le Dialog avec le Bot.
* La chaine **WaterFall**
* Les intentions (intents)

```javascript
// Exemple de WaterFall
bot.dialog('/profile',[
  function(session){
    builder.Prompts.text(session,'Quel est votre nom ?');
  },
  function(session,results,next){
    session.userData.name = results.response;
    next();
  },
  // Liaison des questions entre-elles
  function(session){
    builder.Prompts.text(session,'Quel est votre Age ?');
  },
  function(session,results){
    console.log(results);
    session.userData.age = results.response;
    session.endDialog();
  }
])
```

### Ce que je n'aime pas

~~Pour le moment, je n'ai fait que ce bot.~~ Le fonctionnement est différent, des autres botMakers.  

## ChatFuel

Il est possible d'utiliser ChatFuel sans avoir de compétence en programmation. Très convivial, il fait tout le travail pour nous.

### Ce que j'aime  

Chatfuel est simple et amusant à utiliser. Il contient le strict minimum, pour construire un bot potentiel utilisable. Il est possible d'y ajouter des plug-ins. Il peut être utilisé avec le NLP(neuro-linguistic programming) ce qui fait la force d'un bon bot.

### Ce que je n'aime pas

Il n'est pas fait pour les développeurs. Je ne me suis pas plongé d’avantage dans Chatfuel. Pour monsieur et madame tout le monde, ce botMaker est fantastique.   

## BotPress

À ce stade, j'avais maintenant l'habitude avec le facebook développeur (ce qui était mieux lourd pour l'apprentissage du framework).

### Ce que j'aime

Le getting starter en vraiment bien monté. L'ajout de module est simple et rapide.
> En peut faire les commandes plus rapide `bp i messenger`

Le module du terminal permet de faire du prototypage rapidement comme celui de Microsoft :thumbsup: . La connexion directement dans l'interface est très friendly-user.  

La documentation est **vraiment** bien expliquée.

La fonction pour simuler le __typing__ dans botpress est plus intuitive que celle de botkit.

Le getting Starter est vraiment plus rapide que celui de bitkit.

### Ce que je n'aime pas  

Je n'aime pas le fait de donner notre app secret. Il ne doit pas rester secret à l'utilisateur ? (Mauvaise connaissance de Facebook Développeur)

J'ai essayé de trouver le `${modules_config_dir}/botpress-messenger.json` pour ne pas passer directement dans l'interface, malheureusement je n'ai pas trouvé.

## Conclusion

Le meilleur bot que j'ai utilisé était BotPress. Si j'avais eu à choisir un botMaker pour un projet, j'aurais probablement opté pour BotPress ou ChatFuel.

Par contre, Chatfuel ne donne pas la sensation de coder un truc. On fait seulement du plug & play.

Botpress, offre l'avantage de pouvoir faire du plug & play ou de pouvoir tout coder sois même. En plus, la documentation est vraiment sympathique et agréable à lire.

J'ai détesté BotKit. La documentation était mal structurée. Les concepts clés n'étaient pas mis en pratique dans le Getting Starter. Un simple projet de **Hello World** était long et fastidieux à mettre en place.
